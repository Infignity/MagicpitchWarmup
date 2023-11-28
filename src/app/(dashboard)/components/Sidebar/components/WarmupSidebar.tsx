"use client"
import React from 'react'
import Link from "next/link"
import { IconContext } from 'react-icons'
import { FaPlus } from 'react-icons/fa'
import SecNavItem from './SecNavItem'
import Disk from "@/app/assets/icons/svg/Vector.svg"
import Trash from "@/app/assets/icons/svg/Vector-1.svg"
// import { useAppSelector } from '@/app/(dashboard)/store/hooks'
// import { selectIsSidebarOpen } from '@/app/(dashboard)/store/slices/sidebarSlice'
import { Tooltip } from 'react-tooltip'

const WarmupSidebar = () => {
  const isSidebarOpen = true
  const newWarmupRoute = "/warm-ups/new"
  const buttonText = "new warm up"
  return (
    <div className="flex flex-col w-full h-full justify-between items-center gap-3">
      <Link href={newWarmupRoute} data-tooltip-id={buttonText} type="button" className={`capitalize rounded-[7px] bg-blue text-white  flex justify-center gap-4 items-center p-2 transition-all duration-300 text-sm w-full`}>
        <IconContext.Provider value={{ color: "" }}>
          <FaPlus />
        </IconContext.Provider>
        <span className={`${isSidebarOpen ? "inline" : "hidden"}`} >{buttonText}</span>
        <Tooltip id={buttonText} place="top" content={buttonText} />
      </Link>

      <div className="flex flex-col items-center w-full gap-5">
        <SecNavItem Icon={<Disk />} text="All Warm-ups" count={0} altText='warm-ups icon' />
        <SecNavItem Icon={<Trash />} text="Delete" count={0} altText='trash can icon' />
      </div>
    </div>
  )
}

export default WarmupSidebar
