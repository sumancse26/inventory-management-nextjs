"use client";

import { useAlert } from "@/context/AlertContext";
import { useEffect, useState } from "react";

const Alert = () => {
  const { alert, hideAlert } = useAlert();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (alert.visible) {
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
        hideAlert();
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [alert, hideAlert]);

  if (!isVisible) return null;

  const alertStyles = {
    success: "bg-green-100 border-green-500 text-green-700",
    error: "bg-red-100 border-red-500 text-red-700",
    info: "bg-blue-100 border-blue-500 text-blue-700",
  };

  return (
    <div
      className={`fixed top-4 right-4 max-w-sm w-full px-4 py-3 border-l-4 rounded shadow-lg transition-opacity duration-500 ${
        alertStyles[alert.type]
      } ${isVisible ? "opacity-100" : "opacity-0"}`}
      style={{ zIndex: 1000 }}
      role="alert"
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold">{alert.message}</span>
        <button
          onClick={() => {
            hideAlert();
            setIsVisible(false);
          }}
          className="ml-4 text-xl font-bold focus:outline-none"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Alert;
