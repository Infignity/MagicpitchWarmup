// import { useAppSelector } from '@/app/(dashboard)/store/hooks'
// import { selectIsSidebarOpen } from '@/app/(dashboard)/store/slices/sidebarSlice'
import React from 'react'
import { Tooltip } from 'react-tooltip'

const SecNavItem = ({ Icon, altText, text, count }: {
  Icon: React.ReactNode,
  altText: string,
  text: string,
  count: number
}) => {
  const isSidebarOpen = true
  return (
    <div className={`w-full flex gap-4 items-center text-sm ${isSidebarOpen ? "justify-between" : "justify-center"}`}>
      <button type="button" className="" data-tooltip-id={text}>
        {Icon}
      </button>
      <Tooltip id={text} content={text} place='right' />
      <p className={`text-gray-800 line-clamp-1 w-full ${isSidebarOpen ? "inline" : "hidden"}`}>{text}</p>
      <p className={`text-gray-500 ${isSidebarOpen ? "inline" : "hidden"}`}>{count}</p>
    </div>
  )
}

export default SecNavItem
