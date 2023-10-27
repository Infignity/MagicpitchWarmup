"use client"
import { useSession } from 'next-auth/react'
import { SESSION_STATUS, routes } from '../constants'
import Loader1 from '../(dashboard)/components/Loader1'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import UserProvider from '../(dashboard)/contexts/UserProvider'

const AuthProtected = ({ children }: { children: React.ReactNode }) => {
  const session = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith(routes.LOGIN) || pathname.startsWith(routes.SIGNUP)

  useEffect(() => {
    if (isAuthPage){
      if (session.status === SESSION_STATUS.AUTHENTICATED){
        router.push(routes.HOME)
      }
    }else {
      if (session.status === SESSION_STATUS.UNAUTHENTICATED){
        router.push(routes.LOGIN)
      }
    }
  }, [session])

  if (isAuthPage){
    if(session.status === SESSION_STATUS.UNAUTHENTICATED){
      return (
        // <UserProvider token={session.data?.user.accessToken as string}>{ c{}ildren }</UserProvider>
        children
      ) 
    }else{
      return <div className='flex h-full w-full justify-center items-center'>
        <Loader1 />
      </div>
    }
  }else {
    if(session.status === SESSION_STATUS.AUTHENTICATED){
      return (
        <UserProvider token={session.data?.user.accessToken as string}>{ children }</UserProvider>
      )
    }else{
      return <div className='flex h-full w-full justify-center items-center'>
        <Loader1 />
      </div>
    }
  }
}

export default AuthProtected
