import React, { useEffect, useRef } from "react";
import "./style.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLogin } from "../../../../core/hooks/login.hook";
import { useDispatch, useSelector } from "react-redux";
import { cleanData } from "../../../../core/dataSource/localDataSource/User";
import { local } from "../../../../core/helpers/localStorage";

interface AppState {
  User: {
    user_id: number;
    fullName: string;
    email: string;
  };
}

function Nav() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state: AppState) => state.User);
  console.log(userData);
  const [isLoggedIn, token] = useLogin();

  const logIn = () => {
    navigate("/login");
  };

  const signUp = () => {
    navigate("/signup");
  };

  const logOut = (): void => {
    //empty log in tokens
    local("token", "");

    //clear the user slice in redux
    dispatch(cleanData());

    navigate("/login");
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
        <div className="logged-in-section">
          <p className="greeting">Hello {userData.fullName}!</p>,
          <button className="btn" onClick={logOut}>
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
}

export default Nav;
