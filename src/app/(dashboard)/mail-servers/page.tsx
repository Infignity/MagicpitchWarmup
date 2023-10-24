"use client"
import { useRouter } from "next/navigation"
import EmptyListPlaceholder from "../components/EmptyListPlaceholder"
import { useAppSelector } from "../store/hooks"
import { selectMailServers } from "../store/slices/mailServersSlice"
import SearchNotFound from "../components/SearchNotFound"

export default function MailServers(){
  const mailServers = useAppSelector(selectMailServers)
  const router = useRouter()
  function goToCreateMailServer(){
    router.push("/mail-servers/new")
  }

  const searchTerm = "search"

  if (!mailServers || mailServers.length === 0){
    return (
      <EmptyListPlaceholder title="Mail Servers" ctaLabel="Add Mail Server" ctaAction={goToCreateMailServer}/>
    )
  }

  return (
    <section className='flex w-full h-full overflow-hidden'>
      <div className="flex w-full h-full overflow-x-auto border-x-[0.5px] text-sm">
        <div className="flex flex-col w-full min-w-[60rem]">
          <div className="grid grid-cols-8 gap-3 text-gray-800 p-4 lg:px-8 border-b-[0.5px]">
            <div className="">
              <input type="checkbox" className="scale-105 rounded-md" />
            </div>
            <div className="">No</div>
            <div className="">Name</div>
            <div>Email</div>
            <div className="flex justify-center">Day</div>
            <div className="flex justify-center">Reputation</div>
            <div className="flex justify-center">Bounce Rate</div>
            <div className="flex justify-center">Spam Rate</div>
          </div>
          {
            // attempt to display the search results, after it's done loading, if there's a search Term
            searchTerm ? (
              mailServers.length === 0 ? (
                <SearchNotFound />
              ):(
                  <MailServersList results={mailServers}/>
                )
            ):(
                <MailServersList results={mailServers}/>
              )
          }
        </div>
      </div>
    </section>
  )
}


function MailServersList({results}: {
  results:  any[]
}){
  return (
    <>
      {
        results.map(server => (
          <div key={server._id} className="grid grid-cols-8 gap-3 text-gray-500 p-4 lg:px-8 border-b-[0.5px] w-full">
            <div className="">
              <input type="checkbox" className="scale-105 rounded-md" checked={server.isChecked ? true:false} />
            </div>
            <div className="">{server.no}</div>
            <div className="">{server.name}</div>
            <div className="flex items-center w-full gap-1.5 break-all" >{server.email}</div>
            <div className=""><p className="w-full text-center">{server.day}</p></div>
            <div className="flex justify-center">{server.reputation}%</div>
            <div className="flex justify-center">{server.bounceRate}%</div>
            <div className="flex justify-center">{server.spamRate}%</div>
          </div>
        ))
      }
    </>
  )
}

