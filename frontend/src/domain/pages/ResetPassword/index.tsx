import React, { useState } from "react";
import { ReactComponent as EyeIcon } from "../../../assets/icons/eye.svg";
import { ReactComponent as EyeSlashIcon } from "../../../assets/icons/eye-slash.svg";
import { Link, useNavigate } from "react-router-dom";

import "./style.css";
import { authDataSource } from "../../../core/dataSource/remoteDataSource/auth";
import CheckMark from "../../components/common/CheckMark";
import { AxiosError } from "axios";

const ResetPassword = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(true);

  const [success, setSuccess] = useState<boolean>(false);

  const navigate = useNavigate();

  const validatePassword = (value: string) => {
    const passwordRegExpression = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    if (!passwordRegExpression.test(value) && value) {
      setPasswordError(`- 8-20 characters long \n
- Include at least one uppercase letter \n
- Include at least one number`);
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
    if (!password || !confirmPassword) {
      return;
    }

    let data: { newPassword: string } = { newPassword: password };
    try {
      await authDataSource.resetPassword(data);
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
  const handleGoogleLogin = async () => {};
  return (
    <section className="reset">
      {!success ? (
        <div className="reset-form-box">
          <Link to="/">
            <div className="page-logo">
              <img src="./favicon.png" alt="logo" />
            </div>
          </Link>
          <div className="reset-form-value">
            <form onSubmit={handleSubmit}>
              <h2>Reset Password</h2>

              <div className="reset-inputbox">
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
                    className="reset-toggle-password"
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
              <div className="reset-inputbox">
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
                    className="reset-password-input"
                  />
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <button
                    className="reset-toggle-password"
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
                Reset
              </button>
              {error && <p className="error">{error}</p>}
            </form>
            <div className="reset-login">
              <p>
                Back To{" "}
                <button
                  className="reset-login-link"
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

export default ResetPassword;
