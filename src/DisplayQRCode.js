import React, {Component,useEffect,useState} from 'react';
import QRCode from "qrcode.react";

const styles={
  container:{
    display:"flex",
    flexDirection:"column",
    justifyContent:"flex-start",
    alignItems:"center",
  },
  qrCodeContainer:{
    padding:5,
    display:"flex",
    width:"100%",
    flexDirection:"column",
    justifyContent:"flex-start",
    alignItems:"center"
  },
  label:{
    marginTop:10,
    fontSize: 22,
    color: "#4880ED",
    fontWeight: 300
  }
};
function computeDefaultSize(){      
      let size = Math.min(window.innerWidth-50,window.innerHeight-50);
      return Math.max(size,400);
}

export default ({label="",code="",level='H',size=0})=>{
        const [defaultSize,setDefaultSize]=useState(computeDefaultSize());
        useEffect(() => {
          function onWindowResize(){
            setDefaultSize(computeDefaultSize());
          }
          window.addEventListener("resize", onWindowResize);
          return ()=>{
              window.removeEventListener("resize", onWindowResize);
          }
        });
    return(
        <div style={styles.container}>
        <div style={styles.qrCodeContainer}>
                <QRCode
                                        value={code}
                                        level={level}
                                        size={size?size:defaultSize}
                                       />
        </div>
        <div style={styles.label} data-testid="globalinput-qr-code-label">{label}</div>
      </div>
    );
};

