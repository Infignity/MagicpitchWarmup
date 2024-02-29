"use client"
import React from 'react'
import Link from "next/link"
import { IconContext } from 'react-icons'
import { FaPlus, FaReply, FaUsers } from 'react-icons/fa'
// import { useAppSelector } from '@/app/(dashboard)/store/hooks'
// import { selectIsSidebarOpen } from '@/app/(dashboard)/store/slices/sidebarSlice'
import { Tooltip } from 'react-tooltip'
import { routes } from '@/app/constants'
import { usePathname } from 'next/navigation'

const links = [
  {
    text: "Client Emails",
    url: routes.CLIENT_EMAILS,
    Icon: FaUsers
  },
  {
    text: "Reply Emails",
    url: routes.REPLY_EMAILS,
    Icon: FaReply
  },
 
]

export default function EmailListsSidebar() {
  const isSidebarOpen = true
  const pathname = usePathname()
  return (
    <div className="flex flex-col w-full h-full items-center gap-3">
      {
        links.map(link => (
          <Link href={link.url} data-tooltip-id={link.text} type="button" className={`capitalize rounded-[7px] hover:bg-[#F4F5FE] hover:text-blue flex justify-start gap-4 items-center p-2 transition-all duration-300 text-sm w-full ${pathname.startsWith(link.url) ? "bg-[#F4F5FE] text-blue" : "bg-white text-gray-500"}
            ${
              link.text === "Reply Emails" ? "pointer-events-none cursor-not-allowed opacity-50" : ""
            }
          `}>
            <IconContext.Provider value={{ color: "" }}>
              <link.Icon />
            </IconContext.Provider>
            <span className={`line-clamp-1 ${isSidebarOpen ? "inline" : "hidden"}`} >{link.text}</span>
            <Tooltip id={link.text} place="top" content={link.text} />
          </Link>
        ))
      }
    </div>
  )
}
