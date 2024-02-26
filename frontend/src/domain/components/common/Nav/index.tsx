import React, { useEffect, useRef } from "react";
import "./style.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLogin } from "../../../../core/hooks/login.hook";
import { useSelector } from "react-redux";

interface AppState {
  User: {
    user_id: number;
    fullName: string;
    email: string;
  };
}

function Nav() {
  const navigate = useNavigate();

  const userData = useSelector((state: AppState) => state.User);

  const [isLoggedIn, token] = useLogin();

  const logIn = () => {
    navigate("/login");
  };

  const signUp = () => {
    navigate("/signup");
  };

  return (
    <nav className="hero-nav">
      <div className="nav-logo">
        <Link to="/">
          <img src="./favicon.png" alt="logo" />
        </Link>
      </div>

      {!isLoggedIn ? (
        <div className="nav-auth">
          <button onClick={logIn} className="btn log-in">
            LOG-IN
          </button>
          <button onClick={signUp} className="sign-up">
            SIGN-UP
          </button>
        </div>
      ) : (
        <p className="greeting">Hello {userData.fullName}!</p>
      )}
    </nav>
  );
}

export default Nav;
