import React, { FocusEvent, useEffect, useState, useRef, LegacyRef } from 'react'
import { IconContext } from 'react-icons'
import { FaAngleRight } from 'react-icons/fa'

type SelectInputProps = {
  label: string, 
  placeholder: string, 
  options: { text: string, value: string }[],
  onChange: (item: string) => void,
  value: string,
  errRef?: LegacyRef<HTMLParagraphElement>, 
}

const SelectInput = ({label, placeholder, options, onChange, value, errRef }: SelectInputProps) => {
  const [selectedItem, setSelectedItem] = useState<{text: string, value: string } | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const dropDownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedItem){
      onChange(selectedItem.value)
    }else {
      onChange("")
    }
  }, [selectedItem])

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      // Clean up the event listener when the component unmounts
      document.removeEventListener('click', handleClickOutside);
    }
  }, [])


  function toggle(){
    setIsOpen(prev => !prev)
  }

  function close(){
    setIsOpen(false)
  }

  function handleClickOutside(e: MouseEvent){
    e.preventDefault()
    if (e.target instanceof Element) {
      if (!dropDownRef.current?.contains(e.target)) {
        close()
      }
    }
  }

  return (
    <div className="flex flex-col w-full" ref={dropDownRef}>
      <label className='mb-2'>{ label }</label>
      <div role="button" className={`text-gray-500 px-4 py-2 text-xs rounded border-[1px] border-[#B2B2B2] flex items-center justify-between`} onClick={() => toggle()}>
        <p className="text-gray-800">{ value ?? placeholder }</p>
        <IconContext.Provider value={{ size: "1em",  className: `transition duration-300  ${ isOpen ? "rotate-90":"rotate-0" }` }}>
          <FaAngleRight />
        </IconContext.Provider>
      </div>
      <div className="w-full relative">
        <div  className={`absolute flex flex-col gap-1 w-full bg-white transition-all duration-200 border-[1px] rounded-b-md overflow-auto ${isOpen ? "max-h-[15rem]":"h-0"}`}>
          <ul className="flex flex-col gap-1 w-full p-1">
            {
              options.map(item => (
                <li key={item.value} role="button" className={`px-3 text-xs py-2 w-full text-gray-800 hover:bg-gray-200 transition duration-200 ${value === item.value ? "bg-gray-200":"bg-white"}`} onClick={() => {
                  setSelectedItem(item)
                  close()
                }}>{ item.text }</li>
              ))
            }
          </ul>
          <p ref={errRef} className="text-xs text-start text-[red]"></p>
        </div>
      </div>
    </div>
  )
}

export default SelectInput
