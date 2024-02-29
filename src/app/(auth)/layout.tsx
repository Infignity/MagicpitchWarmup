"use client"
import { Montserrat } from 'next/font/google'
import React from 'react'
import { IconContext } from 'react-icons'
import { BsCheckLg as CheckMark, BsArrowRight as ArrowRight   } from "react-icons/bs"
import Logo from "@/app/assets/icons/svg/auth-logo.svg"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { routes } from '../constants'

const items = [
  "Request a demo", "Learn which plan is right for your team", "Get onboarding help"
]

const montserrat = Montserrat({ subsets: ["latin"] })

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const title = pathname.startsWith(routes.SIGNUP) ? "Create your Account":"Login to your Account"
  const bottomCTA = pathname.startsWith(routes.SIGNUP) ? {
    title: "Already have an account ?",
    ctaText: "Log in",
    ctaUrl: routes.LOGIN
  }:{
      title: "Don't have an account ?",
      ctaText: "Signup",
      ctaUrl: routes.SIGNUP
    }
  return (
    <section className={`w-full h-full flex ${montserrat.className}`}>
      <div className="hidden md:flex flex-col gap-4 md:gap-7 text-white justify-center  items-start bg-blue p-10 lg:p-20 text-start md:5/12">
        <h1 className='text-2xl md:text-4xl lg:text-5xl font-bold'>Amplify <br /> Conversations, <br />Secure More Deals</h1>
        <ul className="flex flex-col gap-1.5 md:gap-3">
          {
            items.map((item, index) => (
              <li className="flex gap-2 md:gap-4 items-center text-sm md:text-base" key={index}>
                <CheckMark />
                <p className="break-all">{item}</p>
              </li>
            ))
          }
        </ul>
        <div className="pt-5 md:pt-10 flex flex-col gap-2">
          <p className="font-bold text-white ">Technical issues or product questions?</p>
          <button className="flex gap-3 items-center transition-all duration-300 border-none outline-none w-fit hover:gap-5">
            <a
              href='mailto:support@magicpitch.ai'
            >Contact Support</a>
            <IconContext.Provider value={{size: "1em"}}>
              <ArrowRight />
            </IconContext.Provider>
          </button>
        </div>
      </div>
      <div className="flex w-full h-full justify-center items-center overflow-auto">
        <div className="w-full h-full flex justify-center items-center">
          <form className="flex flex-col text-center text-gray-500 gap-5 p-3 md:p-5">
            <div className="flex flex-col w-full justify-center">
              <div className="flex justify-center items-start">
                <Logo />
              </div>
              <div className="flex flex-col gap-3 mb-3">
                <h3 className="font-bold text-4xl text-[#323131]">{ title }</h3>
                <p className="text-sm">Enter the fields below to get started</p>
              </div>
            </div>
            {children}
            <div className="w-full text-center flex gap-2 text-sm justify-center">
              <p className="">{ bottomCTA.title }</p>
              <Link href={bottomCTA.ctaUrl} className="text-blue">{ bottomCTA.ctaText }</Link>
            </div>
          </form>
          <div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AuthLayout
