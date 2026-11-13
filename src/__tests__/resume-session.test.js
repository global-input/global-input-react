import { useGlobalInputApp, createMessageConnector } from '../index';
import { renderHook } from '@testing-library/react-hooks';
import * as testUtil from '../testUtil';

// A device app saves its session, closes (for example a browser panel that is closed), then
// resumes it with config.session: the phone that joined before can join again without a new
// QR code, another phone is refused, and restart() starts a new session.

const deviceConfig = () => ({
    initData: {
        form: {
            id: "resume@globalinput.co.uk",
            title: "Global Input Resume Test",
            fields: [{ label: "Content", id: "content", value: "" }]
        }
    }
});

const joinWithCode = async (connectionCode, client) => {
    const receiver = testUtil.createInputReceivers();
    const con = createMessageConnector();
    const config = client ? { ...receiver.config, client } : receiver.config;
    const result = await con.connect(config, connectionCode);
    return { con, result };
};

it("resumes a saved session for the phone that joined it, and only for that phone", async function () {
    const first = renderHook(() => useGlobalInputApp(deviceConfig()));
    await first.waitFor(() => first.result.current.isReady);
    expect(first.result.current.getSessionData().sender).toBeNull();
    const connectionCode = first.result.current.connectionCode;

    const phone = await joinWithCode(connectionCode);
    expect(phone.result.type).toBe("mobile");
    await first.waitFor(() => first.result.current.isConnected);
    const saved = first.result.current.getSessionData();
    expect(saved.sender.client).toBe(phone.con.client);
    expect(saved.url).toBeTruthy();

    phone.con.disconnect();
    first.result.current.close();
    first.unmount();

    const second = renderHook(() => useGlobalInputApp({ ...deviceConfig(), session: saved }));
    await second.waitFor(() => second.result.current.isReady);
    expect(second.result.current.isDisconnected).toBe(true);
    const resumed = second.result.current.getSessionData();
    expect(resumed.session).toBe(saved.session);
    expect(resumed.aes).toBe(saved.aes);
    expect(resumed.client).toBe(saved.client);

    const other = await joinWithCode(connectionCode);
    expect(other.result.type).toBe("error");
    other.con.disconnect();

    const back = await joinWithCode(connectionCode, saved.sender.client);
    expect(back.result.type).toBe("mobile");
    await second.waitFor(() => second.result.current.isConnected);
    back.con.disconnect();

    second.result.current.restart();
    await second.waitFor(() => second.result.current.isReady && !second.result.current.isDisconnected);
    expect(second.result.current.getSessionData().session).not.toBe(saved.session);
    second.result.current.close();
    second.unmount();
}, 20000);

it("ignores an incomplete saved session and starts a new one", async function () {
    const hook = renderHook(() => useGlobalInputApp({ ...deviceConfig(), session: { session: "abc", aes: "", client: "x" } }));
    await hook.waitFor(() => hook.result.current.isReady);
    expect(hook.result.current.getSessionData().session).not.toBe("abc");
    expect(hook.result.current.isDisconnected).toBe(false);
    hook.result.current.close();
    hook.unmount();
}, 10000);
