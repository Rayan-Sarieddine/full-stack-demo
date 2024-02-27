import React, { useEffect, useState } from "react";
import { ReactComponent as EmailIcon } from "../../../assets/icons/envelope.svg";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { local } from "../../../core/helpers/localStorage";

import "./style.css";
import { authDataSource } from "../../../core/dataSource/remoteDataSource/auth";
import CheckMark from "../../components/common/CheckMark";
import { AxiosError } from "axios";

const ForgetPassword = () => {
  const [email, setEmail] = React.useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const token = local("token");
    if (token) {
      navigate("/");
    }
  }, []);
  const navigate: NavigateFunction = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      setError("All Fields are Required");
      return;
    }
    const emailRegExpression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegExpression.test(email)) {
      setError("Please Enter a Valid Email");
      setTimeout(() => setError(""), 4000);
      return;
    }
    let data: { email: string } = { email };
    try {
      await authDataSource.forgetPassword(data);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <section className="forget">
      {!success ? (
        <div className="forget-form-box">
          <Link to="/">
            <div className="page-logo">
              <img src="./favicon.png" alt="logo" />
            </div>
          </Link>
          <div className="forget-form-value">
            <form onSubmit={handleSubmit}>
              <h2>Forget Password</h2>
              <div className="forget-inputbox">
                <input
                  id="email"
                  type="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="email">Enter Your Email</label>
                <EmailIcon />
              </div>

              <button type="submit" className="forget-btn">
                Send Reset Email
              </button>
              {error && <p className="error">{error}</p>}
              <div className="forget-login">
                <p>
                  Back To{" "}
                  <button
                    className="forget-login-link"
                    onClick={() => {
                      navigate("/signup");
                    }}
                  >
                    Login
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <CheckMark message={"Email Sent"} />
      )}
    </section>
  );
};

export default ForgetPassword;
