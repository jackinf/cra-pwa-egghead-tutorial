import React from 'react';
import {Link} from "react-router-dom";

const AppNavbar = (props) => {
  return (
    <nav className="navbar navbar-light bg-ligh">
      <span className="navbar-brand mb-0 h1">
        <div>
          <Link to="/">
          <img src={props.logo} className="App-logo" alt="logo" />
        </Link>
        </div>
        <div>
          <Link to="/profile">Profile</Link>
        </div>
        {props.title}
      </span>

      {
        props.offline && <span className="badge badge-danger my-3">Offline</span>
      }
    </nav>
  )
};

  export default AppNavbar;
