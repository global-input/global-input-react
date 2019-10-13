import React from "react";

import { GlobalInputConnect } from "../index";

import { render, fireEvent, waitForElement } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

/*
    When you use the GlobalInputConnect component, you need to pass it with a valid mobileConfig parameter
*/

describe("missing data in the config", () => {
  test("missing mobileConfig", async () => {
    const { getByTestId } = render(<GlobalInputConnect />);
    expect(getByTestId("globalinput-qr-code-label")).toHaveTextContent(
      "mobileConfig is required"
    );
  });

  test("missing initData in mobileConfig", async () => {
    const { getByTestId } = render(
      <GlobalInputConnect mobileConfig={{}} />
    );
    expect(getByTestId("globalinput-qr-code-label")).toHaveTextContent(
      "initData is missing in the parameter mobileConfig"
    );
  });

  test("missing form initData in mobileConfig", async () => {
    const {getByTestId } = render(
      <GlobalInputConnect mobileConfig={{ initData: {} }} />
    );
    expect(getByTestId("globalinput-qr-code-label")).toHaveTextContent(
      "form is missing in the initData of the mobileConfig"
    );
  });
});

