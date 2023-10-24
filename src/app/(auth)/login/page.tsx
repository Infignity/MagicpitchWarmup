"use client"
import React, { useRef, useState } from 'react'
import TextInput from '@/app/(auth)/components/TextInput'
import { useGlobalToastContext } from '@/app/contexts/GlobalToastProvider'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Loader1 from '@/app/(dashboard)/components/Loader1'
import Loader2 from '@/app/(dashboard)/components/Loader2'

const initialFormState = {
  username: "",
  password: ""
}

const Login = () => {
  const usernameErrRef = useRef<HTMLParagraphElement | null>(null)
  const passwordErrRef = useRef<HTMLParagraphElement | null>(null)
  const [formState, setFormState] = useState<typeof initialFormState>(initialFormState)
  const [isLoading, setIsLoading] = useState(false)
  const { showErrorToast, showSuccessToast } = useGlobalToastContext()
  const router = useRouter()

  function handleOnChange(update: { [key: string]: string }) {
    setFormState(prev => {
      return { ...prev, ...update }
    })
  }


  async function handleFormSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    console.log("button click: ")

    if (!formState.username) {
      if (usernameErrRef.current) {
        usernameErrRef.current.focus()
        usernameErrRef.current.textContent = "Username is required"
      }
      return
    } else {
      if (usernameErrRef.current) {
        usernameErrRef.current.textContent = ""
      }
    }

    if (!formState.password) {
      if (passwordErrRef.current) {
        passwordErrRef.current.focus()
        passwordErrRef.current.textContent = "Password is required"
      }
      return
    } else {
      if (passwordErrRef.current) {
        passwordErrRef.current.textContent = ""
      }
    }

    setIsLoading(true)
    const response = await signIn("credentials", { redirect: false, username: formState.username, password: formState.password })
    console.log("auth response: ", response)
    if (response){
      if (response.error === null){
        router.push("/")
        setFormState(initialFormState)
        showSuccessToast("Login Successful!")
      }else if (response.error === "CredentialsSignin"){
        showErrorToast("username or password is incorrect")
      }else {
        showErrorToast("Couldn't sign in. Something went wrong")
      }
    }else{
      showErrorToast("Could not complete sign in")
    }
    setIsLoading(false)
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <TextInput errRef={usernameErrRef} placeholder="e.g. john23" label="Username" onChange={(e) => handleOnChange({ username: e.target.value })} name={"username"}  value={formState.username}/>
      <TextInput errRef={passwordErrRef} placeholder="e.g. 2insksdioi23" label="Password" inputType="password" onChange={(e) => handleOnChange({ password: e.target.value })} name={"password"} value={formState.password}/>
      <button type="button" onClick={handleFormSubmit} className="mt-2 bg-blue text-white rounded-md capitalize p-2 w-full outline-none flex justify-center relative" disabled={isLoading}>
        { isLoading ? (
          <p className="scale-75 flex justify-center items-center relative h-full w-full">
            <Loader2 />
          </p>
        ):(<p className="text-center">Login</p>) 
        }
      </button>
    </div>
  )
}

export default Login
