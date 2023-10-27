import React, { ChangeEvent } from 'react'
import { LegacyRef } from 'react'

const TextInput = ({ label, placeholder, value, onChange, errRef }: {
  label: string, 
  placeholder: string, 
  value: string, 
  onChange: (e: ChangeEvent<HTMLInputElement>) => void,
  errRef?: LegacyRef<HTMLParagraphElement>, 
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-gray-800">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e)} className="text-gray-800 px-4 py-2 text-xs rounded border-[1px] border-[#B2B2B2]" placeholder={placeholder}/>
      <p ref={errRef} className="text-xs text-start text-[red]"></p>
    </div>
  )
}

export default TextInput
