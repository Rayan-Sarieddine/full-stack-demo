import React, { useEffect, useState } from "react";
import { ReactComponent as EmailIcon } from "../../../assets/icons/envelope.svg";
import { ReactComponent as EyeIcon } from "../../../assets/icons/eye.svg";
import { ReactComponent as EyeSlashIcon } from "../../../assets/icons/eye-slash.svg";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { local } from "../../../core/helpers/localStorage";
import { useDispatch } from "react-redux";
import googleIcon from "../../../assets/logos/google-icon.png";

import "./style.css";
import { authDataSource } from "../../../core/dataSource/remoteDataSource/auth";
import { loggedIn } from "../../../core/dataSource/localDataSource/User";
import { Dispatch, UnknownAction } from "redux";
import { AxiosError } from "axios";
import { gapi } from "gapi-script";
const GOOGLE_CLIENT_ID =
  "80417416444-mc1emnb4r8o1eph2f3note9p7vubvlen.apps.googleusercontent.com";
const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate: NavigateFunction = useNavigate();
  const dispatch: Dispatch<UnknownAction> = useDispatch();

  useEffect(() => {
    function initGoogleSignIn() {
      gapi.load("auth2", () => {
        gapi.auth2.init({ client_id: GOOGLE_CLIENT_ID });
      });
    }

    initGoogleSignIn();

    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      setError("All Fields are Required");
      return;
    }
    const emailRegExpression: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegExpression.test(email)) {
      setError("Please Enter a Valid Email");
      setTimeout(() => setError(""), 4000);
      return;
    }
    const passwordRegExpression =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegExpression.test(password)) {
      setError("Please Enter your Valid Password");
      setTimeout(() => setError(""), 4000);
      return;
    }
    let data: { email: string; password: string } = { email, password };
    try {
      const response = await authDataSource.login(data);
      local("token", response.token);

      dispatch(
        loggedIn({
          email: response.user.email,
          user_id: response.user.id,
          fullName: response.user.fullName,
          userType: response.user.userType,
          token: response.token,
        })
      );

      navigate("/");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleGoogleLogin = async () => {
    try {
      const auth2 = gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn({
        prompt: "select_account",
      });
      const id_token = googleUser.getAuthResponse().id_token;

      const response = await authDataSource.googleAuth({ token: id_token });

      local("token", response.token);

      dispatch(
        loggedIn({
          email: response.user.email,
          id: response.user.id,
          fullName: response.user.fullName,
          userType: response.user.userType,
          token: response.token,
        })
      );

      navigate("/");
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  };
  return (
    <section className="login">
      <div className="login-form-box">
        <Link to="/">
          <div className="page-logo">
            <img src="./favicon.png" alt="logo" />
          </div>
        </Link>
        <div className="login-form-value">
          <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div className="login-inputbox">
              <input
                id="email"
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">Email</label>
              <EmailIcon />
            </div>
            <div className="login-inputbox">
              <input
                id="password"
                type={showPassword ? "password" : "text"}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="login-password-input"
              />
              <label htmlFor="password">Password</label>
              <button
                className="login-toggle-password"
                onClick={togglePasswordVisibility}
                type="button"
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
            <div className="login-forget">
              <label>
                <button
                  className="login-forget-link"
                  onClick={() => {
                    navigate("/forget-password");
                  }}
                  type="button"
                >
                  Forgot password?
                </button>
              </label>
            </div>
            <button type="submit" className="login-btn">
              Log in
            </button>
            {error && <p className="error">{error}</p>}
            <div className="inputBox google-sign-in">
              <p>-------- or sign in with --------</p>
              <div className="google-button" onClick={handleGoogleLogin}>
                <img src={googleIcon} alt="google_logo" />
                <p>Google</p>
              </div>
            </div>
            <div className="login-register">
              <p>
                Don't have an account?{" "}
                <button
                  className="login-register-link"
                  onClick={() => {
                    navigate("/signup");
                  }}
                >
                  Sign-up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
