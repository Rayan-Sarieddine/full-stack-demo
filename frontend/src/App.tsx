import React from "react";
import "./styles/index.css";
import { Route, Routes } from "react-router-dom";
import Home from "./domain/pages/Home";
import Login from "./domain/pages/Login";
import SignUp from "./domain/pages/SignUp";
import ForgetPassword from "./domain/pages/ForgetPassword";
import ResetPassword from "./domain/pages/ResetPassword";
import EmailVerified from "./domain/pages/EmailVerified";
import { Provider } from "react-redux";
import { store } from "./core/dataSource/localDataSource/store";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/email-verified" element={<EmailVerified />} />
        </Routes>
      </Provider>
    </div>
  );
}

export default App;
