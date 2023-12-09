"use client";
import React, { useEffect, useRef, useState } from "react";
import TextInput from "@/app/(auth)/components/TextInput";
import { useGlobalToastContext } from "@/app/contexts/GlobalToastProvider";
import { useRouter } from "next/navigation";
import { SignUpApi } from "@/app/api/signupapi";
import { SignInApi } from "@/app/api/signinapi";
import { API_BASE, SESSION_STATUS, routes } from "@/app/constants";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Loader2 from "@/app/(dashboard)/components/Loader2";
import { isValidEmail } from "@/app/helpers";

const initialFormState = {
  username: "",
  password: "",
  fullName: "",
  email: "",
  accessCode: "",
};

const Signup = () => {
  const usernameErrRef = useRef<HTMLParagraphElement | null>(null);
  const passwordErrRef = useRef<HTMLParagraphElement | null>(null);
  const fullNameErrRef = useRef<HTMLParagraphElement | null>(null);
  const emailErrRef = useRef<HTMLParagraphElement | null>(null);
  const accessCodeErrRef = useRef<HTMLParagraphElement | null>(null);

  const [formState, setFormState] =
    useState<typeof initialFormState>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const { showErrorToast, showSuccessToast } = useGlobalToastContext();
  const router = useRouter();

  function handleOnChange(update: { [key: string]: string }) {
    setFormState((prev) => {
      return { ...prev, ...update };
    });
  }

  async function handleFormSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    console.log("button click: ");
    e.preventDefault();

    if (!formState.fullName) {
      if (fullNameErrRef.current) {
        fullNameErrRef.current.focus();
        fullNameErrRef.current.textContent = "Full Name is required";
      }
      return;
    } else {
      if (fullNameErrRef.current) {
        fullNameErrRef.current.textContent = "";
      }
    }

    if (!formState.email) {
      if (emailErrRef.current) {
        emailErrRef.current.focus();
        emailErrRef.current.textContent = "Email Address is required";
      }
      return;
    } else if (isValidEmail(formState.email) === false) {
      if (emailErrRef.current) {
        emailErrRef.current.focus();
        emailErrRef.current.textContent = "Email Address is invalid";
      }
      return;
    } else {
      if (emailErrRef.current) {
        emailErrRef.current.textContent = "";
      }
    }

    if (!formState.username) {
      if (usernameErrRef.current) {
        usernameErrRef.current.focus();
        usernameErrRef.current.textContent = "Username is required";
      }
      return;
    } else {
      if (usernameErrRef.current) {
        usernameErrRef.current.textContent = "";
      }
    }

    if (!formState.password) {
      if (passwordErrRef.current) {
        passwordErrRef.current.focus();
        passwordErrRef.current.textContent = "Password is required";
      }
      return;
    } else {
      if (passwordErrRef.current) {
        passwordErrRef.current.textContent = "";
      }
    }

    if (!formState.accessCode) {
      if (accessCodeErrRef.current) {
        accessCodeErrRef.current.focus();
        accessCodeErrRef.current.textContent = "Access Code is required";
      }
      return;
    } else {
      if (accessCodeErrRef.current) {
        accessCodeErrRef.current.textContent = "";
      }
    }

    setIsLoading(true);

    try {
      const { data, status } = await SignUpApi({
        fullname: formState.fullName,
        username: formState.username,
        password: formState.password,
        email: formState.email,
        accessCode: formState.accessCode,
      });
      console.log("signup data: ", data);
      if (status === 201) {
        const response = await SignInApi({
          username: formState.username,
          password: formState.password,
        });
        console.log("signin data: ", response);
        if (response.status === 200) {
          router.push(routes.WARM_UPS);
          setFormState(initialFormState);
          showSuccessToast("Login Successful!");
        } else {
          showErrorToast("Couldn't sign in. Something went wrong");
        }
        // const response = await signIn("credentials", {
        //   redirect: false,
        //   username: formState.username,
        //   password: formState.password,
        // });
        // if (response) {
        //   if (response.error === null) {
        //     router.push(routes.HOME);
        //     setFormState(initialFormState);
        //     showSuccessToast("Login Successful!");
        //   } else if (response.error === "CredentialsSignin") {
        //     showErrorToast("username or password is incorrect");
        //   } else {
        //     showErrorToast("Couldn't sign in. Something went wrong");
        //   }
        // } else {
        //   showErrorToast("Unable to complete sign in");
        // }
      }
    } catch (error: any) {
      if (error.response) {
        showErrorToast(error.response.data.description);
      } else if (error.request) {
        showErrorToast("Unable to create user. Try again");
      } else {
        showErrorToast("Unable to create user");
      }
    }

    setIsLoading(false);
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-col md:flex-row gap-3">
        <TextInput
          errRef={fullNameErrRef}
          placeholder="e.g. John"
          label="Full Name"
          onChange={(e) => handleOnChange({ fullName: e.target.value })}
          value={formState.fullName}
          name={"fullName"}
        />
        <TextInput
          errRef={emailErrRef}
          placeholder="e.g. mail@domain.com"
          label="Email address"
          onChange={(e) => handleOnChange({ email: e.target.value })}
          value={formState.email}
          name={"email"}
        />
      </div>
      <TextInput
        errRef={usernameErrRef}
        placeholder="e.g. john23"
        label="Username"
        onChange={(e) => handleOnChange({ username: e.target.value })}
        value={formState.username}
        name={"username"}
      />
      <TextInput
        errRef={passwordErrRef}
        placeholder="e.g. 2insksdioi23"
        label="Password"
        inputType="password"
        onChange={(e) => handleOnChange({ password: e.target.value })}
        value={formState.password}
        name={"password"}
      />
      <TextInput
        errRef={accessCodeErrRef}
        placeholder="e.g. 2insksdioi23"
        label="Access Code"
        inputType="password"
        onChange={(e) => handleOnChange({ accessCode: e.target.value })}
        value={formState.accessCode}
        name={"accessCode"}
      />
      <button
        type="button"
        onClick={handleFormSubmit}
        className="mt-2 bg-blue text-white rounded-md capitalize p-2 w-full outline-none"
        disabled={isLoading}
      >
        {isLoading ? (
          <p className="scale-75 flex justify-center items-center relative h-full w-full">
            <Loader2 />
          </p>
        ) : (
          "Create Account"
        )}
      </button>
    </div>
  );
};

export default Signup;
