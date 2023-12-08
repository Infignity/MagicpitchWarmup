import React, { useEffect, useState, useRef, LegacyRef } from "react";
import { IconContext } from "react-icons";
import { FaAngleRight } from "react-icons/fa";
import { AllMailServersApi } from "@/app/api/allmailserversapi";
import { AllEmailListApi } from "@/app/api/allemaillistapi";

type SelectInputProps = {
  name ?: string
  label: string;
  placeholder: string;
  // options: { text: string; value: string }[];
  // onChange: (item: string) => void;
  errRef?: LegacyRef<HTMLParagraphElement>;
  setFormFields?: any;
};

const MailSelect = ({
  label,
  placeholder,
  errRef,
  setFormFields
}: SelectInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mailServers, setMailServers] = useState<any[]>([]);
    const [value, setValue] = useState<string | null>(null);
  const [index, setIndex] = useState<number>(0);
  const dropDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchMailServers = async () => {
      try {
        const response = await AllMailServersApi(index);
        const newData = response.data.results; // Assuming API response contains the data
        console.log(newData);

        // Update the results by appending new data to the existing results
        setMailServers((prevResults) => [...prevResults, ...newData]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMailServers();
  }, [index]);

  const handleScroll = (event: { target: any; }) => {
    const { target } = event;
    if (target.scrollHeight - target.scrollTop === target.clientHeight) {
      // User has scrolled to the end, increase index for next set of results
      setIndex(prevIndex => prevIndex + 30);
    }
  };

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
    
    <div className="flex flex-col w-full" ref={dropDownRef}
        onScroll={handleScroll}
    >
      <label className="mb-2">{label}</label>
      <div
        role="button"
        className={`text-gray-500 px-4 py-2 text-xs rounded border-[1px] border-[#B2B2B2] flex items-center justify-between`}
        onClick={() => toggle()}
      >
        <p className="text-gray-800">{value || placeholder}</p>
        <IconContext.Provider
          value={{
            size: "1em",
            className: `transition duration-300  ${
              isOpen ? "rotate-90" : "rotate-0"
            }`,
          }}
        >
          <FaAngleRight />
        </IconContext.Provider>
      </div>
      <div className="w-full relative">
        <div
          className={`absolute flex flex-col gap-1 w-full bg-white transition-all duration-200  rounded-b-md overflow-auto z-50 ${
            isOpen ? "max-h-[15rem]" : "h-0"
          }`}
        >
          <ul className="flex flex-col gap-1 w-full p-1 bg-white border-[1px]">
            {mailServers.map((item, index) => (
              <li
              key={`${item._id}_${index}`}
                role="button"
                className={`px-3 text-xs py-2 w-full text-gray-800 hover:bg-gray-200 transition duration-200 ${
                  value === item._id ? "bg-gray-200" : "bg-white"
                }`}
                onClick={() => {
                  setFormFields((prev:any) => ({
                    ...prev,
                    mailServer: item._id,
                  }));
                  setValue(item.name);
                  close();
                }}
          
              >
                {item.name}
              </li>
            ))}
          </ul>
          <p
            ref={errRef ?? undefined}
            className="text-xs text-start text-[red]"
          ></p>
        </div>
      </div>
    </div>
  );
};

export default MailSelect;

export const EmailSelect = ({
    label,
    placeholder,
    name ,
    errRef,
    setFormFields
  }: SelectInputProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mailServers, setMailServers] = useState<any[]>([]);
      const [value, setValue] = useState<string | null>(null);
    const [index, setIndex] = useState<number>(0);
    const dropDownRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, []);
  
    useEffect(() => {
      const fetchMailServers = async () => {
        try {
          const response = await AllEmailListApi("clientEmails");
          const newData = response.data.emailLists; // Assuming API response contains the data
          console.log(newData);
  
          // Update the results by appending new data to the existing results
          setMailServers((prevResults) => [...prevResults, ...newData]);
        } catch (error) {
          console.log(error);
        }
      };
      fetchMailServers();
    }, [index]);
  
    const handleScroll = (event: { target: any; }) => {
      const { target } = event;
      if (target.scrollHeight - target.scrollTop === target.clientHeight) {
        // User has scrolled to the end, increase index for next set of results
        setIndex(prevIndex => prevIndex + 30);
      }
    };
  
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
      
      <div className="flex flex-col w-full" ref={dropDownRef}
          onScroll={handleScroll}
      >
        <label className="mb-2">{label}</label>
        <div
          role="button"
          className={`text-gray-500 px-4 py-2 text-xs rounded border-[1px] border-[#B2B2B2] flex items-center justify-between`}
          onClick={() => toggle()}
        >
          <p className="text-gray-800">{value || placeholder}</p>
          <IconContext.Provider
            value={{
              size: "1em",
              className: `transition duration-300  ${
                isOpen ? "rotate-90" : "rotate-0"
              }`,
            }}
          >
            <FaAngleRight />
          </IconContext.Provider>
        </div>
        <div className="w-full relative">
          <div
            className={`absolute flex flex-col gap-1 w-full bg-white transition-all duration-200 rounded-b-md overflow-auto z-50 ${
              isOpen ? "max-h-[15rem]" : "h-0"
            }`}
          >
            <ul className="flex flex-col gap-1 w-full p-1 bg-white border-[1px]">
              {mailServers.map((item, index) => (
                <li
                key={`${item._id}_${index}`}
                  role="button"
                  className={`px-3 text-xs py-2 w-full text-gray-800 hover:bg-gray-200 transition duration-200 ${
                    value === item._id ? "bg-gray-200" : "bg-white"
                  }`}

                
                  onClick={() => {
                    setFormFields((prev:any) => ({
                      ...prev,
                      clientEmail : item._id,
                    }));
                    console.log(item._id)
                    setValue(item.name);
                    close();
                  }}
                >
                  {item.name}
                </li>
              ))}
            </ul>
            <p
              ref={errRef ?? undefined}
              className="text-xs text-start text-[red]"
            ></p>
          </div>
        </div>
      </div>
    );
  };
