import React from 'react'
import NotFoundIllustration from "@/app/assets/images/illustrations/notfound.svg"

export default function SearchNotFound({ message, title }: { message?: string | React.ReactNode, title?: string | React.ReactNode }){
  const defaultMessage = <p> We couldn't find Email that match your search. Please try using <br />different, fewer filters or typing another search request</p>
  const defaultTitle = <>Warmup not found</>

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex flex-col gap-4 justify-center items-center">
        <div>
          <NotFoundIllustration />
        </div>
        <h2 className="text-gray-800 text-2xl text-center font-medium capitalize">{ title ?? defaultTitle }</h2>
        <p className="text-gray-500 text-sm text-center">
          {
            message ?? defaultMessage
          }
        </p>
      </div>
    </div>
  )
}

