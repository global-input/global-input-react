


import React, {Component} from 'react';


export   default class QRCodeAdjustControl extends Component {

  render() {
      if(!this.props.render){
          return null;
      }
      return(
                <div className="codedataControllerContainer">
                  <input type="range" min="100" max="1000" step="10" value={size} onChange={evt=>{
                      this.setSize(evt.target.value);
                  }}/>
                  <select value={level} onChange={evt=>{
                    this.setLevel(evt.target.value);
                  }}>
                    <option value="L">L</option>
                    <option value="M">M</option>
                    <option value="Q">Q</option>
                    <option value="H">H</option>
                  </select>
                </div>
      );
  }


}
