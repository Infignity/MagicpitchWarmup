"use client";
//create a context called GlobalToastProvider which can be used to hold global react data
import React, { createContext } from "react";
import { Toaster, toast } from "react-hot-toast";

const GlobalToastProvider = createContext<{
  showSuccessToast: (msg: string) => void;
  showErrorToast: (msg: string) => void;
}>({
  showSuccessToast: () => {},
  showErrorToast: () => {},
});

export function useGlobalToastContext() {
  return React.useContext(GlobalToastProvider);
}

export default function GlobalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  function showSuccessToast(msg: string) {
    toast.success(msg);
  }

  function showErrorToast(msg: string) {
    toast.error(msg);
  }

  return (
    <GlobalToastProvider.Provider value={{ showSuccessToast, showErrorToast }}>
      <Toaster
        toastOptions={{
          // Default options for all toasts
          error: {
            style: {
              maxWidth: "440px", // Remove maximum width constraint
              width: "100%", // Set the desired width, adjust as needed
              border: "1px solid #FF5555",
              background:
                "linear-gradient(135deg, rgba(255, 85, 85, 1) 0%, rgba(255, 85, 85, 1) 100%)",
              color: "#fff",
            },
            icon: "",
          },
          // Custom options for error toasts
        }}
      />
      {children}
    </GlobalToastProvider.Provider>
  );
}
