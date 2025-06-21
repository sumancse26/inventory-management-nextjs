"use client";
import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const showAlert = (message, type = "success") => {
    setAlert({
      visible: true,
      message,
      type,
    });

    setTimeout(() => {
      hideAlert();
    }, 2000);
  };

  const hideAlert = () => {
    setAlert((prevAlert) => ({
      ...prevAlert,
      visible: false,
    }));
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
