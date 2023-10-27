"use client"
import React from 'react'
import { useGetUserQuery } from '../store/api/apiSlice'
import { User } from '@/app/types'
import Loader1 from '../components/Loader1'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

const UserContext = React.createContext<Partial<{
  user:  User,
  token: string
}>>({})

export function useUserContext(){
  return React.useContext(UserContext)
}

const UserProvider = ({ children, token }: {
  children: React.ReactNode,
  token: string
}) => {
  const currentPath = usePathname()
  const { data, isLoading, isError, error } = useGetUserQuery({ token })

  if (isLoading){
    return <div>
      <Loader1 />
    </div>
  }

  if (isError){
    const err =  error as any
    if(err.status){
      if (err.status === 401){
        signOut({ callbackUrl: `${currentPath}` })
      }
    }
    return <div>
      <Loader1 />
    </div>
  }

  return (
    <UserContext.Provider value={{ 
      user: data as User, 
      token
    }}>
      { children }
    </UserContext.Provider>
  )
}

export default UserProvider
