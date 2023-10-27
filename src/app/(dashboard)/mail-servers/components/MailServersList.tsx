import { mode, routes } from "@/app/constants"
import { MailServer } from "@/app/types"
import Link from "next/link"
import { useState } from "react"
import { IconContext } from "react-icons"
import { BsX as XMark } from "react-icons/bs"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa"
import { getSelectedMailServer, openServerForm } from "../../store/slices/mailServersSlice"
import { useAppSelector, useAppDispatch } from "../../store/hooks"
import { setSelectedMailServer } from "../../store/slices/mailServersSlice"

export default function MailServersList({results, next, prev, lastItemCount, firstItemCount, totalResults, hasNext, hasPrev}: {
  results:  MailServer[],
  next: () => void, 
  prev: () => void,
  lastItemCount: number,
  firstItemCount: number,
  totalResults: number,
  hasNext: boolean,
  hasPrev: boolean
}){
  const mailServer = useAppSelector(getSelectedMailServer)
  const dispatch = useAppDispatch()

  const [isOpen, setIsOpen] = useState(false)

  function handleMailServerSelect(server: MailServer){
    dispatch(setSelectedMailServer(server))
    setIsOpen(true)
  }

  return (
    <div className="flex gap-2 w-full h-full relative">
      <div className="relative w-full flex flex-col gap-3">
        <div className="flex flex-col h-full w-full">
          <div className="flex flex-col gap-2 w-full h-fit ">
            {
              results.map((server, index) => { 
                const itemNumber = new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 }).format(index + 1)
                return (
                  <div key={server._id} role="button" className="grid grid-cols-[50px_100px_auto_auto] gap-3 text-gray-500 p-4 lg:px-8 border-b-[0.5px] w-full" onClick={() => handleMailServerSelect(server)}>
                    <div className="">
                      <input type="checkbox" className="scale-105 rounded-md" />
                    </div>
                    <p className="">{itemNumber}</p>
                    <p className="">{ server.name }</p>
                    <p className="">{ (new Date(server.addedOn).toDateString()).toString() }</p>
                  </div>
                )})
            }
          </div>
        </div>
        <div className="flex gap-2 items-center w-full justify-center">
          <p>{ `${firstItemCount} - ${ lastItemCount } of ${ totalResults }` }</p>
          <button type="button" onClick={prev} disabled={hasPrev === false} className="disabled:cursor-not-allowed disabled:opacity-50">
            <IconContext.Provider value={{ size: "2.5em", className: `rounded-md hover:bg-gray-500 bg-white p-2 transition hover:text-white` }}>
              <FaAngleLeft />
            </IconContext.Provider>
          </button>
          <button type="button"  onClick={next} disabled={ hasNext === false } className="disabled:cursor-not-allowed disabled:opacity-50">
            <IconContext.Provider value={{ size: "2.5em", className: `rounded-md hover:bg-gray-500 bg-white p-2 transition hover:text-white` }}>
              <FaAngleRight  />
            </IconContext.Provider>
          </button>
        </div>
      </div>

      <div className={`w-full max-w-[35rem] h-full md:p-3 bg-gray-100 absolute right-0 text-gray-800 rounded-md flex flex-col overflow-y-auto transition duration-300 ${isOpen ? "translate-x-0 ":"translate-x-full "}`}>
        {
          mailServer ? (
            <>
              <div className="flex">
                <div className="w-full px-3 py-2">
                  <div className="flex justify-end" >
                    <button type="button" onClick={() => setIsOpen(false)}>
                      <IconContext.Provider value={{ size: "2em", className: "hover:bg-[#ddd] rounded-full transition duration-200 p-1" }}>
                        <XMark />
                      </IconContext.Provider>
                    </button>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
                    <h2 className="text-2xl">{`${mailServer.name}`}</h2>
                    <p className="text-xs px-2 py-1 w-fit rounded-full bg-white text-gray-placeholder line-clamp-1 text-ellipsis">added on: { new Date(mailServer.addedOn).toDateString() }</p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center md:justify-between text-gray-placeholder gap-2 text-sm">
                    <p>lastModified: { new Date(mailServer.lastModified).toDateString() }</p>
                    <button type="button" onClick={() => {
                      dispatch(setSelectedMailServer(mailServer))
                      dispatch(openServerForm(mode.EDIT))
                    }} className="px-3 py-1 bg-blue-500 text-white rounded-md">edit</button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5 p-2 md:p-3">
                <div className="flex flex-col gap-2">
                  <h4 className="text-lg">IMAP Details</h4>
                  <div className="flex flex-col">
                    <p>hostname: { mailServer.imapDetails.hostname }</p>
                    <p>port: { mailServer.imapDetails.port }</p>
                    <p>email: { mailServer.imapDetails.email }</p>
                    <p>password: { mailServer.imapDetails.password }</p>
                    <p>security: <span className="uppercase">{ mailServer.imapDetails.security }</span></p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-lg">SMTP Details</h4>
                  <div className="flex flex-col">
                    <p>hostname: { mailServer.smtpDetails.hostname }</p>
                    <p>port: { mailServer.smtpDetails.port }</p>
                    <p>email: { mailServer.smtpDetails.email }</p>
                    <p>password: { mailServer.smtpDetails.password }</p>
                    <p>security: <span className="uppercase">{ mailServer.smtpDetails.security }</span></p>
                  </div>
                </div>
              </div>
            </>
          ):(
              <></>
            )
        }
      </div>

    </div>
  )
}
