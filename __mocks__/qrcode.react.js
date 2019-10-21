import React from 'react';

let codeResolve=null;

const codePromise=new Promise(resolve => {codeResolve = resolve});

const QRCode = ({value,level,size})=>{ 
    if(value){
        codeResolve({value,level,size});
    }    
    return (<div data-testid="mock-qr-code">{value}</div>);
}
const getDisplayedQRCodeProperties=async ()=>codePromise;
export {getDisplayedQRCodeProperties};
export default QRCode 


