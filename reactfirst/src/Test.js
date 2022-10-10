import './Test.css';
import React, { Component } from "react";
import SelectSource from './Components/SelectSource';
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import Login from './Login.js';

class Test extends Component {

  render() {

    var content = (
      <div className="Test">
        
          <h1>Center for Engineering Diversity Data Display Tool</h1>
          <Login/> 

      </div>
    );
    return content;


  }
}


export default Test;
