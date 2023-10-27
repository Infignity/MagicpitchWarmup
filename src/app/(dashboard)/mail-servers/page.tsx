"use client"
import { BsX as XMark, BsArrowLeftShort as ArrowLeft } from "react-icons/bs"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import EmptyListPlaceholder from "../components/EmptyListPlaceholder"
import SearchNotFound from "../components/SearchNotFound"
import { useUserContext } from "../contexts/UserProvider"
import { routes } from "@/app/constants"
import { useGetMailServersQuery } from "../store/api/apiSlice"
import Loader1 from "../components/Loader1"
import { MailServer } from "@/app/types"
import { IconContext } from "react-icons"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { selectIsSidebarOpen, toggleSidebar } from "../store/slices/sidebarSlice"
import Search from "../components/Header/Search"
import ToolbarButton from "../components/Header/ToolbarButton"
import Book from "@/app/assets/icons/svg/book.svg"
import PlayOutline from "@/app/assets/icons/svg/play-outline.svg"
import MailServersList from "./components/MailServersList"
import MailServerForm from "./components/MailServerForm"
import { getIsOpenServerForm } from "../store/slices/mailServersSlice"

export default function MailServersWrapper(){
  const [isShowSearch] = useState(true)
  const dispatch = useAppDispatch()
  const isSidebarOpen = useAppSelector(selectIsSidebarOpen)
  const isOpenServerForm = useAppSelector(getIsOpenServerForm)

  return (
    <section className="flex flex-col gap-2 w-full h-full relative bg-white">
      <section className="bg-gray-100 flex gap-2 w-full justify-between items-center pr-5 md:pr-10  py-3 relative">
        <button type="button" className="z-30 rounded-full bg-gray-200 transition duration-200 -translate-x-1/2 w-7 h-7 flex justify-center items-center" onClick={() => dispatch(toggleSidebar())}>
          <IconContext.Provider value={{ size: "2em", className: `cursor-pointer p-1 ${isSidebarOpen ? "" : "rotate-180"}`, color: "#2F2F2F" }}>
            <ArrowLeft />
          </IconContext.Provider>
        </button>

        {
          isShowSearch ? (
            <div className="flex justify-end">
              <Search placeholder={"Search Emails"} />
            </div>
          ) : (
              <div className="flex gap-3 items-center w-full justify-between">
                <p className="text-gray-500 hidden md:inline">Learn how to use Email list for higher lead engagement and more replies</p>
                <div className="flex gap-3.5 items-center">
                  <ToolbarButton altText="play icon" text="Watch tutorial" Icon={<PlayOutline />} />
                  <ToolbarButton altText="book icon" text="Read Guide" Icon={<Book />} />
                </div>
                <button type='button' className="p-2 rounded-full hover:bg-white transition duration-200">
                  <IconContext.Provider value={{ size: "1.5em", className: "cursor-pointer", color: "#2F2F2F" }}>
                    <XMark />
                  </IconContext.Provider>
                </button>
              </div>
            )
        }
      </section>
      <MailServers />
      {
        isOpenServerForm && <MailServerForm  />
      }
    </section>
  )
}

function MailServers(){
  const userData = useUserContext()
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const { data, isLoading, isError, refetch } = useGetMailServersQuery({ token: userData.token as string, index })


  useEffect(() => {
    console.log("index: ", index)
  }, [index])

  if (isLoading){
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader1 />
      </div>
    ) 
  }

  if (isError){
    return (
      <div>
        <p>Couldn't fetch mail servers</p>
        <button className="rounded-md px-3 py-2 bg-gray-500 text-white" onClick={() => refetch()} type="button">Try again</button>
      </div>
    )
  }

  if (!data){
    return (
      <div>
        <p>Couldn't fetch mail servers</p>
        <button className="rounded-md px-3 py-2 bg-gray-500 text-white" onClick={() => refetch()} type="button">Try again</button>
      </div>
    )
  }

  const searchTerm = "search"

  const mailServers = data?.results as MailServer[]
  const totalResults = data?.totalResults as number
  const firstItemCount = index + 1
  const lastItemCount = index + mailServers.length
  const hasNext = index + mailServers.length < totalResults
  const hasPrev = index - mailServers.length > 0

  function goToCreateMailServer(){
    router.push(routes.NEW_MAIL_SERVER)
  }

  function next(){
    if (index + mailServers.length < totalResults){
      setIndex(prev => prev + mailServers.length)
    }
  }

  function prev(){
    if (index - mailServers.length > 0){
      setIndex(prev => prev - mailServers.length)
    }
  }

  if (mailServers.length === 0){
    return (
      <EmptyListPlaceholder title="Mail Servers" ctaLabel="Add Mail Server" ctaAction={goToCreateMailServer}/>
    )
  }

  return (
    <section className='flex w-full h-full overflow-hidden'>
      <div className="flex w-full h-full border-x-[0.5px] text-sm">
        <div className="flex flex-col w-full">
          <div className="grid grid-cols-[50px_100px_auto_auto] gap-3 text-gray-800 p-4 lg:px-8 border-b-[0.5px] ">
            <div className="">
              <input type="checkbox" className="scale-105 rounded-md" />
            </div>
            <p className="">No</p>
            <p className="">Name</p>
            <p className="text-start md:ps-24">
              <p>Added on</p>
            </p>
          </div>
          {
            searchTerm ? (
              mailServers.length === 0 ? (
                <SearchNotFound />
              ):(
                  <MailServersList results={mailServers} next={next} prev={prev} totalResults={totalResults} lastItemCount={lastItemCount} firstItemCount={firstItemCount} hasNext={hasNext} hasPrev={hasPrev}/>
                )
            ):(
                <MailServersList results={mailServers} next={next} prev={prev} totalResults={totalResults} lastItemCount={lastItemCount} firstItemCount={firstItemCount} hasNext={hasNext} hasPrev={hasPrev}/>
              )
          }
        </div>
      </div>
    </section>
  )
}

