import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import AuthRoutes from "./Auth.jsx";
import AdminRoutes from "./admin";
import GameAdminRoutes from "./gameadmin";
import UserRoutes from "./user";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { resetLoginState } from "../store/auth/login.js";
import { AnimatePresence, motion } from "framer-motion";
import Loader from "../components/loader/index.jsx";
import ModalContainer from "../components/modal";

const Routers = () => {
  const [isAuthorised, setIsAuthorised] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  const { credentials } = useSelector((state) => state.login);

  // const handleHistoryChange = (event) => {
  //   if (event.state.idx === 0) {
  //   }
  //   console.log("History stack changed:", event.state);
  // };

  // // Add event listener for popstate event
  // useEffect(() => {
  //   window.addEventListener("popstate", handleHistoryChange);

  //   // Clean up by removing the event listener when component unmounts
  //   return () => {
  //     window.removeEventListener("popstate", handleHistoryChange);
  //   };
  // }, []);

  useEffect(() => {
    if (credentials?.success) {
      if (credentials?.data?.token) {
        setIsAuthorised(true);
        localStorage.setItem("isAuthorised_jwt", credentials?.data?.token);

        if (credentials?.message) {
          toast.success(credentials?.message);
        }
      } else {
        setIsAuthorised(false);
        localStorage.setItem("isAuthorised_jwt", null);
      }
    } else if (!credentials?.success && credentials?.message) {
      toast.error(credentials?.message);
      dispatch(resetLoginState());
      setIsAuthorised(false);
      localStorage.setItem("isAuthorised_jwt", null);
    } else {
      dispatch(resetLoginState());
      setIsAuthorised(false);
      localStorage.setItem("isAuthorised_jwt", null);
    }

    setIsLoading(false);
  }, [credentials, isAuthorised]);

  const RoutesBasedOnRole = () => {
    if (credentials && credentials.data) {
      const role = credentials?.data?.role;

      if (role === "1") {
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, damping: 10 }}
          >
            <AdminRoutes />
          </motion.div>
        );
      } else if (role === "2") {
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, damping: 10 }}
          >
            <GameAdminRoutes />
          </motion.div>
        );
      } else {
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, damping: 10 }}
          >
            <UserRoutes />
          </motion.div>
        );
      }
    }
  };

  if (isLoading) {
    return (
      <ModalContainer>
        <Loader />
      </ModalContainer>
    );
  }

  return (
    <Router>
      <AnimatePresence>
        {isAuthorised ? <RoutesBasedOnRole /> : <AuthRoutes />}
      </AnimatePresence>
    </Router>
  );
};

export default Routers;
