import React, { useEffect, useState, useRef, LegacyRef } from 'react';
import { IconContext } from 'react-icons';
import { FaAngleRight } from 'react-icons/fa';

type SelectInputProps = {
  label?: string;
  placeholder: string;
  options: { text: string; value: string | null}[];
  onChange: (item: string) => void;
  value: string;
  errRef?: LegacyRef<HTMLParagraphElement>;
};

const SelectInput = ({
  label,
  placeholder,
  options,
  onChange,
  value,
  errRef,
}: SelectInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  function toggle() {
    setIsOpen((prev) => !prev);
  }

  function close() {
    setIsOpen(false);
  }

  function handleClickOutside(e: MouseEvent) {
    e.preventDefault();
    if (e.target instanceof Element) {
      if (!dropDownRef.current?.contains(e.target)) {
        close();
      }
    }
  }

  return (
    <div className="flex flex-col w-full" ref={dropDownRef}>
      <label className="mb-2">{label}</label>
      <div
        role="button"
        className={`text-gray-500 px-4 py-2 text-xs rounded border-[1px] border-[#B2B2B2] flex items-center justify-between`}
        onClick={() => toggle()}
      >
        <p className="text-gray-800">{value || placeholder}</p>
        <IconContext.Provider
          value={{
            size: '1em',
            className: `transition duration-300  ${isOpen ? 'rotate-90' : 'rotate-0'}`,
          }}
        >
          <FaAngleRight />
        </IconContext.Provider>
      </div>
      <div className="w-full relative">
        <div
          className={`absolute flex flex-col gap-1 w-full bg-white transition-all duration-200  rounded-b-md overflow-auto z-50 ${
            isOpen ? 'max-h-[15rem] border-[1px]' : 'h-0'
          }`}
        >
          <ul className="flex flex-col gap-1 w-full p-1 bg-white">
            {options.map((item) => (
              <li
                key={item.value}
                role="button"
                className={`px-3 text-xs py-2 w-full text-gray-800 hover:bg-gray-200 transition duration-200 ${
                  value === item.value ? 'bg-gray-200' : 'bg-white'
                }`}
                onClick={() => {
                  onChange(item.value); // Call the onChange function with the selected value
                  close();
                }}
              >
                {item.text}
              </li>
            ))}
          </ul>
          <p ref={errRef ?? undefined} className="text-xs text-start text-[red]"></p>
        </div>
      </div>
    </div>
  );
};

export default SelectInput;
