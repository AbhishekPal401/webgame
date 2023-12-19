import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/login";

const Admin = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  );
};

export default Admin;
