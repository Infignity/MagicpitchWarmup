"use client"
//create a context called GlobalToastProvider which can be used to hold global react data 
import React, { createContext } from "react";
import { Toaster, toast } from "react-hot-toast";

const GlobalToastProvider = createContext<{
    showSuccessToast: (msg: string) => void,
    showErrorToast: (msg: string) => void
}>({
    showSuccessToast: () => { },
    showErrorToast: () => { }
})


export function useGlobalToastContext() {
    return React.useContext(GlobalToastProvider);
}


export default function GlobalProvider({ children }: {
    children: React.ReactNode
}) {
    function showSuccessToast(msg: string) {
        toast.success(msg)
    }

    function showErrorToast(msg: string) {
        toast.error(msg)
    }

    return (
        <GlobalToastProvider.Provider value={{ showSuccessToast, showErrorToast }}>
            <Toaster />
            {children}
        </GlobalToastProvider.Provider>
    )

}
