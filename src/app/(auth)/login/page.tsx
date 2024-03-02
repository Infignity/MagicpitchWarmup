"use client";
import React, { useRef, useState } from "react";
import TextInput from "@/app/(auth)/components/TextInput";
import { useGlobalToastContext } from "@/app/contexts/GlobalToastProvider";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { IconContext } from "react-icons";
import { BsX as XMark } from "react-icons/bs";
import { SignInApi } from "@/app/api/signinapi";
import { signIn } from "next-auth/react";
import Loader1 from "@/app/(dashboard)/components/Loader1";
import Loader2 from "@/app/(dashboard)/components/Loader2";
import { useAuth } from "@/app/(dashboard)/contexts/authContext";
import { Toaster, toast } from "react-hot-toast";
import { SignInUser } from "@/app/types";

const initialFormState = {
  username: "",
  password: "",
};

const Login = () => {
  const usernameErrRef = useRef<HTMLParagraphElement | null>(null);
  const passwordErrRef = useRef<HTMLParagraphElement | null>(null);
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [errorDescription, setErrorDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formState, setFormState] =
    useState<typeof initialFormState>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const { showErrorToast, showSuccessToast } = useGlobalToastContext();
  const router = useRouter();
  const params = useSearchParams();
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
      sessionStorage.setItem("token", response.data.accessToken);

      if (response) {
        const token = response.data.accessToken;
        if (params.get("referer") !== "addprofile") {
          login(token);
        }
        if (!localStorage.getItem("users")) {
          localStorage.setItem("users", JSON.stringify([response.data]));
        } else {
          let users = JSON.parse(
            localStorage.getItem("users") as string
          ) as Array<SignInUser>;
          console.log("users", users);
          const userExist = users.some(
            (user: SignInUser) => user.userId === response.data.userId
          );
          console.log("userExist", userExist);
          if (!userExist) {
            users.push(response.data);
            localStorage.setItem("users", JSON.stringify(users));
          }
        }
        router.push("/warm-ups");
        setFormState(initialFormState);
        showSuccessToast("Login Successful!");
      } else {
        // showErrorToast("Could not complete sign in");
        toast.error("Could not complete sign in");
      }
    } catch (error: any) {
      console.error("Sign in error: ", error);

      // setErrorMessage(error.response?.data?.message || "An error occurred during sign in");
      // setErrorDescription(error.response?.data?.description || "An error occurred during sign in");
      toast.error(
        (t) => (
          <div className="flex w-full">
            {/* Assuming the icon is automatically added by react-hot-toast */}
            <div className="flex flex-col">
              <h3 className="text-base font-semibold">
                {error.response?.data?.message ||
                  "An error occurred during sign in"}
              </h3>
              <p>
                {error.response?.data?.description ||
                  "An error occurred during sign in"}
              </p>
            </div>
          </div>
        ),
        {
          duration: 6000,
          style: {
            width: "100%",
            textAlign: "left",
            // Add any custom styling here
          },
        }
      );
      // setErrorMessage(
      //   error.response?.data?.description || "An error occurred during sign in"
      // );
      // showErrorToast(error.response?.data?.message || "An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {/* {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
            <button
              type="button"
              onClick={closePopup}
              className="self-end p-2 rounded-full hover:bg-gray-100 transition duration-200"
            >
              <IconContext.Provider value={{ size: "1.5em" }}>
                <XMark />
              </IconContext.Provider>
            </button>
            <h3 className="text-base font-semibold">Error Info</h3>
            <p>{errorMessage}</p>
          </div>
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
