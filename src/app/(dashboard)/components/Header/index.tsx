"use client"
import React from 'react'
import { IconContext } from 'react-icons'
import { FaAngleDown } from "react-icons/fa"
import { BsArrowLeftShort as ArrowLeft, BsX as XMark } from "react-icons/bs"
import Image from "next/image"
import Notification from "@/app/assets/icons/svg/Notification.svg"
import Profile from "@/app/assets/images/profile-images/Ellipse 1.png"
import { usePathname } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/app/(dashboard)/store/hooks'
import { closeSidebar, openSidebar, selectIsSidebarOpen } from '@/app/(dashboard)/store/slices/sidebarSlice'
import PlayOutline from "@/app/assets/icons/svg/play-outline.svg"
import Book from "@/app/assets/icons/svg/book.svg"
import Search from './Search'
import ToolbarButton from './ToolbarButton'
import { routes } from '@/app/constants'
import { selectWarmups } from '@/app/(dashboard)/store/slices/warmupsSlice'

const Header = () => {
  // const dispatch = useAppDispatch()
  // const isSidebarOpen = useAppSelector(selectIsSidebarOpen)
  // const warmups = useAppSelector(selectWarmups)
  // // const mailServers = useAppSelector(selectMailServers)
  // const pathname = usePathname()
  // let isShowSecondary = true
  // if (pathname === "/" || pathname === routes.NEW_WARM_UP) {
  //   isShowSecondary = false
  // }
  //
  // let isShowSearch: boolean = false
  // const onWarmupsListRegex = new RegExp(`^${routes.WARM_UPS}/?$`)
  // const isOnWarmupsList = onWarmupsListRegex.test(pathname)
  // const isNonEmptyWarmupsList = warmups?.length > 0
  //
  // const onMailServersListRegex = new RegExp(`^${routes.MAIL_SERVERS}/?$`)
  // const isOnMailServersList = onMailServersListRegex.test(pathname)
  // const isNonEmptyMailServersList = mailServers?.length > 0

  // show the search ber instead, when on warmups or mailservers page and there's actual warmups or mailservers that are displayed
  // if ((isOnWarmupsList && isNonEmptyWarmupsList) || (isOnMailServersList && isNonEmptyMailServersList)) {
  //   isShowSearch = true
  // }

  // function toggleSidebar() {
  //   if (isSidebarOpen) {
  //     dispatch(closeSidebar())
  //   } else {
  //     dispatch(openSidebar())
  //   }
  // }

  return (
    <header className="w-full h-fit flex flex-col">
      {/* primary header  */}
      <section className='w-full h-full flex gap-5 justify-end px-5 md:px-10 py-3 items-center shadow-md bg-white'>
        <button type="button" className="cursor-pointer">
          <Notification />
        </button>
        <div className="flex gap-2 items-center">
          <div>
            <Image src={Profile} className="w-8 h-8 rounded-full" alt="profile image" />
          </div>
          <IconContext.Provider value={{ size: "1.2em", color: "#8F8B8B", className: "cursor-pointer" }}>
            <FaAngleDown />
          </IconContext.Provider>
        </div>
      </section>

      {/* Secondary header  */}
      {
        // isShowSecondary && (
        //   <section className="bg-gray-100 flex gap-2 w-full justify-between items-center pr-5 md:pr-10  py-3 relative">
        //     <button type="button" className="rounded-full bg-gray-200 transition duration-200 -translate-x-1/2 w-7 h-7 flex justify-center items-center" onClick={() => toggleSidebar()}>
        //       <IconContext.Provider value={{ size: "2em", className: `cursor-pointer p-1 ${isSidebarOpen ? "" : "rotate-180"}`, color: "#2F2F2F" }}>
        //         <ArrowLeft />
        //       </IconContext.Provider>
        //     </button>
        //
        //     {
        //       isShowSearch ? (
        //         <div className="flex justify-end">
        //           <Search placeholder={"Search Emails"} />
        //         </div>
        //       ) : (
        //         <div className="flex gap-3 items-center w-full justify-between">
        //           <p className="text-gray-500 hidden md:inline">Learn how to use Email list for higher lead engagement and more replies</p>
        //           <div className="flex gap-3.5 items-center">
        //             <ToolbarButton altText="play icon" text="Watch tutorial" Icon={<PlayOutline />} />
        //             <ToolbarButton altText="book icon" text="Read Guide" Icon={<Book />} />
        //           </div>
        //           <button type='button' className="p-2 rounded-full hover:bg-white transition duration-200">
        //             <IconContext.Provider value={{ size: "1.5em", className: "cursor-pointer", color: "#2F2F2F" }}>
        //               <XMark />
        //             </IconContext.Provider>
        //           </button>
        //         </div>
        //       )
        //     }
        //   </section>
        // )
      }
    </header>
  )
}

export default Header
