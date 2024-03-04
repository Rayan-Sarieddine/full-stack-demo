import React, { useEffect, useState } from "react";

import { ReactComponent as EmailIcon } from "../../../assets/icons/envelope.svg";
import { ReactComponent as EyeIcon } from "../../../assets/icons/eye.svg";
import { ReactComponent as EyeSlashIcon } from "../../../assets/icons/eye-slash.svg";
import { ReactComponent as NameIcon } from "../../../assets/icons/name.svg";

import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { local } from "../../../core/helpers/localStorage";
import { authDataSource } from "../../../core/dataSource/remoteDataSource/auth";
import CheckMark from "../../components/common/CheckMark";
import { AxiosError } from "axios";

import "./style.css";

const SignUp = () => {
  const [email, setEmail] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [fullNameError, setFullNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const token = local("token");
    if (token) {
      navigate("/");
    }
  }, []);

  const navigate: NavigateFunction = useNavigate();

  const validateFullName = (value: string) => {
    const fullNameRegExpression = /^[a-zA-Z]{2,}\s[a-zA-Z]{2,}$/;
    if (!fullNameRegExpression.test(value) && value) {
      setFullNameError("Please enter your correct full name.");
    } else {
      setFullNameError("");
    }
  };

  const validateEmail = (value: string) => {
    const emailRegExpression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegExpression.test(value) && value) {
      setEmailError("Please enter a valid email.");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (value: string) => {
    const passwordRegExpression =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegExpression.test(value) && value) {
      setPasswordError(`- 8-20 characters long. \n
- Include at least one uppercase letter. \n
- Include at least one number and one special character.`);
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmPassword = (value: string) => {
    if (value !== password && value) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password || !fullName || !confirmPassword) {
      return;
    }

    let data = { email, password, fullName };
    try {
      await authDataSource.register(data);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
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

  return (
    <section className="signup">
      {!success ? (
        <div className="signup-form-box">
          <Link to="/">
            <div className="page-logo">
              <img src="./favicon.png" alt="logo" />
            </div>
          </Link>
          <div className="signup-form-value">
            <form onSubmit={handleSubmit}>
              <h2>Sign-up</h2>
              <div className="signup-inputbox">
                <div className="input-container">
                  {" "}
                  <input
                    id="full-name"
                    type="text"
                    required
                    onChange={(e) => {
                      setFullName(e.target.value);
                      validateFullName(e.target.value);
                    }}
                  />
                  <label htmlFor="full-name">Full Name</label>
                  <NameIcon />
                </div>
                {fullNameError && <p className="error">{fullNameError}</p>}{" "}
              </div>
              <div className="signup-inputbox">
                <div className="input-container">
                  {" "}
                  <input
                    id="email"
                    type="email"
                    required
                    onChange={(e) => {
                      setEmail(e.target.value);
                      validateEmail(e.target.value);
                    }}
                  />
                  <label htmlFor="email">Email</label>
                  <EmailIcon />
                </div>
                {emailError && <p className="error">{emailError}</p>}{" "}
              </div>
              <div className="signup-inputbox">
                <div className="input-container">
                  {" "}
                  <input
                    id="password"
                    type={showPassword ? "password" : "text"}
                    required
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validatePassword(e.target.value);
                    }}
                    className="signup-password-input"
                  />
                  <label htmlFor="password">Password</label>
                  <button
                    className="signup-toggle-password"
                    onClick={togglePasswordVisibility}
                    type="button"
                  >
                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                  </button>
                </div>
                {passwordError.split("\n").map((line, index) => (
                  <div key={index} className="error-line">
                    {line}
                  </div>
                ))}
              </div>
              <div className="signup-inputbox">
                <div className="input-container">
                  {" "}
                  <input
                    id="confirm-password"
                    type={showPassword ? "password" : "text"}
                    required
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      validateConfirmPassword(e.target.value);
                    }}
                    className="signup-password-input"
                  />
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <button
                    className="signup-toggle-password"
                    onClick={togglePasswordVisibility}
                    type="button"
                  >
                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                  </button>
                </div>
                {confirmPasswordError && (
                  <p className="error">{confirmPasswordError}</p>
                )}{" "}
              </div>

              <button type="submit" className="signup-btn">
                Sign Up
              </button>
              {error && <p className="error">{error}</p>}
            </form>
            <div className="signup-register">
              <p>
                Already have an account?{" "}
                <button
                  className="signup-register-link"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <CheckMark message={"Successful"} />
      )}
    </section>
  );
};

export default SignUp;
