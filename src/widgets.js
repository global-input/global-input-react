import React, { useEffect, useState } from 'react';
import QRCode from "qrcode.react";

const styles = {
    label: {
        paddingTop: 20,
        color: "#A9C8E6", //#4880ED
    },
    qrCode: {
        display: "flex",
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        backgroundColor: "white"
    }
};

const qrCodeLabel = (
    <div style={styles.label}>
        Scan with <a href="https://globalinput.co.uk/global-input-app/get-app" rel="noopener noreferrer" target="_blank"> Global Input App</a>
    </div>
);
const loadingSVG = (<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
    <path fill="#C779D0" d="M25,5A20.14,20.14,0,0,1,45,22.88a2.51,2.51,0,0,0,2.49,2.26h0A2.52,2.52,0,0,0,50,22.33a25.14,25.14,0,0,0-50,0,2.52,2.52,0,0,0,2.5,2.81h0A2.51,2.51,0,0,0,5,22.88,20.14,20.14,0,0,1,25,5Z">
        <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.8s" repeatCount="indefinite" />
    </path>
</svg>);


export const ConnectQR = ({ mobile, level = 'H', size = null, label = qrCodeLabel, loading = loadingSVG, maxSize = 400, vspace = 130, hspace = 50 }) => {
    const [optimumSize, setOptimumSize] = useState(0);
    useEffect(() => {
        const handleResize = () => {
            let oSize = 0;
            if (window && window.innerWidth && window.innerHeight) {
                if (window.innerWidth < window.innerHeight) {
                    oSize = window.innerWidth - hspace;
                }
                else {
                    oSize = window.innerHeight - vspace;
                }
            }
            setOptimumSize(oSize > maxSize ? maxSize : oSize);
        };
        if (size === 0 || size) {
            return null;
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [hspace, maxSize, size, vspace]);
    if (mobile.isLoading) {
        return loading;
    }
    if (!mobile.isReady) {
        return null;
    }
    if ((!mobile.connectionCode) || size === 0) {
        return null;
    }
    return (
        <div style={styles.qrCode}>
            <QRCode value={mobile.connectionCode} level={level} size={size ? size : optimumSize} />
            {label}
        </div>
    );
};


export const PairingQR = ({ mobile, level = 'H', size = null, label = qrCodeLabel, loading = loadingSVG, maxSize = 400, vspace = 130, hspace = 50 }) => {
    const [optimumSize, setOptimumSize] = useState(0);
    useEffect(() => {
        const handleResize = () => {
            let oSize = 0;
            if (window && window.innerWidth && window.innerHeight) {
                if (window.innerWidth < window.innerHeight) {
                    oSize = window.innerWidth - hspace;
                }
                else {
                    oSize = window.innerHeight - vspace;
                }
            }
            setOptimumSize(oSize > maxSize ? maxSize : oSize);
        };
        if (size === 0 || size) {
            return null;
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [hspace, maxSize, size, vspace]);
    if (mobile.isLoading) {
        return loading;
    }
    if (!mobile.isReady) {
        return null;
    }
    if ((!mobile.pairingCode) || size === 0) {
        return null;
    }
    return (
        <div style={styles.qrCode}>
            <QRCode value={mobile.pairingCode} level={level} size={size ? size : optimumSize} />
            {label}
        </div>
    );
};
