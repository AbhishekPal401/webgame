import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/login";
import NotFound from "../pages/app/common/notfound";

const Admin = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Admin;
