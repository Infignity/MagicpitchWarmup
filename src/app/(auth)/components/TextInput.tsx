import React, { ChangeEvent, LegacyRef } from 'react'

const TextInput = ({ label, placeholder, inputType, errRef, onChange, name, value }: {
  label: string, 
  placeholder: string, 
  inputType?: string, 
  errRef?: LegacyRef<HTMLParagraphElement>, 
  onChange: (e: ChangeEvent<HTMLInputElement>) => void, 
  name: string, 
  value: string
}) => {
  return (
    <div className="w-full">
      <label className="flex flex-col gap-1 w-full">
        <p className='text-gray-500 text-start capitalize'>{ label }</p>
        <input type={inputType ?? "text"} value={value} onChange={(e) => onChange(e)} className="px-3 w-full py-2.5 rounded border-[1px] border-[#C2C2C2] outline-none" placeholder={placeholder}  />
        <p ref={errRef} className="text-xs text-start text-[red]"></p>
      </label>
    </div>
  )
}

export default TextInput
