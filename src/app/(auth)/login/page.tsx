"use client";
import React, { useRef, useState } from "react";
import TextInput from "@/app/(auth)/components/TextInput";
import { useGlobalToastContext } from "@/app/contexts/GlobalToastProvider";
import { useRouter } from "next/navigation";
import { SignInApi } from "@/app/api/signinapi";
import { signIn } from "next-auth/react";
import Loader1 from "@/app/(dashboard)/components/Loader1";
import Loader2 from "@/app/(dashboard)/components/Loader2";
import { useAuth } from "@/app/(dashboard)/contexts/authContext";

const initialFormState = {
  username: "",
  password: "",
};

const Login = () => {
  const usernameErrRef = useRef<HTMLParagraphElement | null>(null);
  const passwordErrRef = useRef<HTMLParagraphElement | null>(null);
  const [formState, setFormState] =
    useState<typeof initialFormState>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const { showErrorToast, showSuccessToast } = useGlobalToastContext();
  const router = useRouter();
  const { token, login } = useAuth();
  function handleOnChange(update: { [key: string]: string }) {
    setFormState((prev) => {
      return { ...prev, ...update };
    });
  }

  async function handleFormSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const setError = (
      ref: React.RefObject<HTMLDivElement>,
      message: string
    ) => {
      if (ref.current) {
        ref.current.focus();
        ref.current.textContent = message;
      }
    };

    const clearError = (ref: React.RefObject<HTMLDivElement>) => {
      if (ref.current) {
        ref.current.textContent = "";
      }
    };

    if (!formState.username) {
      setError(usernameErrRef, "Username is required");
      return;
    } else {
      clearError(usernameErrRef);
    }

    if (!formState.password) {
      setError(passwordErrRef, "Password is required");
      return;
    } else {
      clearError(passwordErrRef);
    }

    setIsLoading(true);
    console.log("formState: ", formState);
    try {
      const formData = new FormData();
      formData.append("username", formState.username);
      formData.append("password", formState.password);
      const response = await SignInApi(formData);
      console.log("response: ", response);
      console.log(response.data.accessToken)
      const token = sessionStorage.setItem("token", response.data.accessToken);
      if (response) {
        const token = response.data.accessToken;
        login(token);
        router.push("/warm-ups");
        setFormState(initialFormState);
        showSuccessToast("Login Successful!");
      } else {
        showErrorToast("Could not complete sign in");
      }
    } catch (error: any) {
      console.error("Sign in error: ", error);
      showErrorToast(error.response?.data?.message || "An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
    // try {
    //   const response = await signIn("credentials", {
    //     redirect: false,
    //     username: formState.username,
    //     password: formState.password,
    //   });
    //   const token = sessionStorage.setItem("token", response?.token || "");
    //   console.log("token: ", token);
    //   console.log("auth response: ", response);
    //   if (response?.error === "CredentialsSignin") {
    //     showErrorToast("username or password is incorrect");
    //   } else if (response?.error === null) {
    //     router.push("/");
    //     setFormState(initialFormState);
    //     showSuccessToast("Login Successful!");
    //   }
    // } catch (error) {
    //   console.error("Sign in error: ", error);
    //   showErrorToast("An error occurred during sign in");
    // } finally {
    //   setIsLoading(false);
    // }
    // if (response){
    //   if (response.error === null){
    //     router.push("/")
    //     setFormState(initialFormState)
    //     showSuccessToast("Login Successful!")
    //   }else if (response.error === "CredentialsSignin"){
    //     showErrorToast("username or password is incorrect")
    //   }else {
    //     showErrorToast("Couldn't sign in. Something went wrong")
    //   }
    // }else{
    //   showErrorToast("Could not complete sign in")
    // }
  }

  return (
    <div className="w-full flex flex-col gap-3">
       {/* {isLoading && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            background: "rgba(255, 255, 255, 0.8)",
            padding: "20px",
            borderRadius: "5px",
          }}
        >
          <Loader1 />
        </div>
      )} */}

      <TextInput
        errRef={usernameErrRef}
        placeholder="e.g. john23"
        label="Username"
        onChange={(e) => handleOnChange({ username: e.target.value })}
        name={"username"}
        value={formState.username}
      />
      <TextInput
        errRef={passwordErrRef}
        placeholder="e.g. 2insksdioi23"
        label="Password"
        inputType="password"
        onChange={(e) => handleOnChange({ password: e.target.value })}
        name={"password"}
        value={formState.password}
      />
      <button
        type="button"
        onClick={handleFormSubmit}
        className="mt-2 bg-blue text-white rounded-md capitalize p-2 w-full outline-none flex justify-center relative"
        disabled={isLoading}
      >
        {isLoading ? (
          <p className="scale-75 flex justify-center items-center relative h-full w-full">
            <Loader2 />
          </p>
        ) : (
          <p className="text-center">Login</p>
        )}
      </button>
    </div>
  );
};

export default Login;

