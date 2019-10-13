import React from 'react';


let tracker=Object.create(null);
const QRCode = ({value,level,size})=>{
       
    tracker.lastCall={value,level,size};
    return (<div data-testid="mock-qr-code">{value}</div>);
}
export {tracker};
export default QRCode 


