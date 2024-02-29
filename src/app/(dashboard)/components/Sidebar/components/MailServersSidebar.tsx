import React from 'react'
import Link from "next/link"
import { IconContext } from 'react-icons'
import { FaPlus } from 'react-icons/fa'
import SecNavItem from './SecNavItem'
import Disk from "@/app/assets/icons/svg/Vector.svg"
import Trash from "@/app/assets/icons/svg/Vector-1.svg"
import { Tooltip } from 'react-tooltip'
import { mode } from '@/app/constants'
import { useUser } from '@/app/(dashboard)/contexts/UserProvider'
const MailServersSidebar = () => {
  const isSidebarOpen = true
  // const dispatch = useAppDispatch()

  const buttonText = "new mail server"
  const {isMailServerModal, setIsMailServerModal} = useUser()
  
  return (
    <div className="flex flex-col w-full h-full justify-between gap-3">
      <button type="button"  data-tooltip-id={buttonText} className="capitalize rounded-[7px] bg-blue text-white  flex justify-center gap-2 items-center px-2 py-2 text-sm"
      onClick={()=> setIsMailServerModal(true)}
      >
        <IconContext.Provider value={{ color: "" }}>
          <FaPlus />
        </IconContext.Provider>
        <span className={`${isSidebarOpen ? "inline" : "hidden"}`}>{buttonText}</span>
        <Tooltip id={buttonText} place="top" content={buttonText} />
      </button>

      {/* <div className="flex flex-col w-full gap-5">
        <SecNavItem Icon={<Disk />} text="All Mail Service" count={0} altText='mail service icon' />
        <SecNavItem Icon={<Trash />} text="Delete" count={0} altText='trash can icon' />
      </div> */}
    </div>
  )
}

export default MailServersSidebar
