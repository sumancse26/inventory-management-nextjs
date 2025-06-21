"use client";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect, useRef, useState } from "react";

NProgress.configure({ showSpinner: false });

export const useApiLoader = () => {
  const [loading, setLoading] = useState(false);
  const activeRequests = useRef(0);

  const start = () => {
    activeRequests.current += 1;
    if (activeRequests.current === 1) {
      setLoading(true);
      NProgress.start();
    }
  };

  const stop = () => {
    activeRequests.current = Math.max(activeRequests.current - 1, 0);
    if (activeRequests.current === 0) {
      setLoading(false);
      NProgress.done();
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup in case of unmount
      NProgress.done();
    };
  }, []);

  return { start, stop, loading };
};
