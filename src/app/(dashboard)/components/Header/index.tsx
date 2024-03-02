"use client";
import React, { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { FaAngleDown } from "react-icons/fa";
import { BsArrowLeftShort as ArrowLeft, BsX as XMark } from "react-icons/bs";
import Image from "next/image";
import Notification from "@/app/assets/icons/svg/Notification.svg";
import Profile from "@/app/assets/images/profile-images/Ellipse 1.png";
import { usePathname } from "next/navigation";
import PlayOutline from "@/app/assets/icons/svg/play-outline.svg";
import Book from "@/app/assets/icons/svg/book.svg";
import Search from "./Search";
import ToolbarButton from "./ToolbarButton";
import { routes } from "@/app/constants";
import User from "@/app/assets/images/profile-images/user.svg";
import { GetUserApi } from "@/app/api/signupapi";
import { SignInUser, User as UserType } from "@/app/types";
import { LiaUserEditSolid } from "react-icons/lia";
import { LuUsers2 } from "react-icons/lu";
import { IoAddCircleOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserType>();
  const [openDropdown, setOpenDropdown] = useState(false);
  const storedUsers = JSON.parse(localStorage.getItem("users") as string);
  console.log("stored", storedUsers);

  const getUser = async () => {
    try {
      const res = await GetUserApi();
      if (res.status === 200) {
        setUser(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();

    return () => {
      getUser();
    };
  }, []);

  const handleChangeProfile = (accessToken: string) => {
    sessionStorage.setItem("token", accessToken);
    window.location.reload();
  };

  return (
    <header className="w-full h-fit flex flex-col">
      {/* primary header  */}
      <section className="w-full h-full flex gap-5 justify-end px-5 md:px-10 py-3 items-center shadow-md bg-white relative">
        {/* <button type="button" className="cursor-pointer">
          <Notification />
        </button> */}
        <div
          className="flex gap-2 items-center cursor-pointer"
          onClick={() => setOpenDropdown((prev) => !prev)}
        >
          {/* <div>
            <User />
          </div> */}
          <p className="font-medium">{user?.fullname}</p>
          <IconContext.Provider
            value={{
              size: "1em",
              color: "#8F8B8B",
            }}
          >
            <FaAngleDown />
          </IconContext.Provider>
        </div>
        {openDropdown && (
          <div className="bg-white shadow-lg rounded-md w-[300px] h-auto absolute top-14 right-5 z-50 p-5 border">
            <div className="flex items-center gap-x-1 text-base font-medium">
              <p>{user?.fullname}</p>
              <p>({user?.username})</p>
            </div>
            <p className="text-serif text-sm">{user?.email}</p>
            {/* <hr className="my-3" />
            <div className="flex items-center gap-x-2">
              <LiaUserEditSolid className="text-black w-6 h-6" />
              <p className="text-[15px]">Edit Profile</p>
            </div> */}
            <hr className="my-3" />
            <div className="flex items-center gap-x-2">
              {/* <LuUsers2 className="text-black w-6 h-6 stroke-[1.5px]" /> */}
              <p className="text-base">Other Profiles</p>
            </div>
            {storedUsers
              .filter(
                (storeduser: SignInUser) => storeduser.userId !== user?._id
              )
              .map((filterduser: SignInUser) => (
                <div
                  className="flex items-center gap-x-2 mt-2 cursor-pointer hover:bg-gray-100 py-2 px-2 rounded-xl"
                  onClick={() => handleChangeProfile(filterduser.accessToken)}
                >
                  <FaRegUserCircle className="text-black w-5 h-5 stroke-[1.5px]" />
                  <p className="text-[15px]">{filterduser.username}</p>
                </div>
              ))}
            <div
              className="flex items-center gap-x-2 mt-2 cursor-pointer hover:bg-gray-100 py-2 px-2 rounded-xl"
              onClick={() => router.push(`${routes.LOGIN}?referer=addprofile`)}
            >
              <IoAddCircleOutline className="text-black w-6 h-6 stroke-[1.5px]" />
              <p className="text-sm">Add</p>
            </div>
          </div>
        )}
      </section>

      {/* Secondary header  */}
      {
        // isShowSecondary && (
        //   <section className="bg-gray-100 flex gap-2 w-full justify-between items-center pr-5 md:pr-10  py-3 relative">
        //     <button type="button" className="rounded-full bg-gray-200 transition duration-200 -translate-x-1/2 w-7 h-7 flex justify-center items-center" onClick={() => toggleSidebar()}>
        //       <IconContext.Provider value={{ size: "2em", className: `cursor-pointer p-1 ${isSidebarOpen ? "" : "rotate-180"}`, color: "#2F2F2F" }}>
        //         <ArrowLeft />
        //       </IconContext.Provider>
        //     </button>
        //
        //     {
        //       isShowSearch ? (
        //         <div className="flex justify-end">
        //           <Search placeholder={"Search Emails"} />
        //         </div>
        //       ) : (
        //         <div className="flex gap-3 items-center w-full justify-between">
        //           <p className="text-gray-500 hidden md:inline">Learn how to use Email list for higher lead engagement and more replies</p>
        //           <div className="flex gap-3.5 items-center">
        //             <ToolbarButton altText="play icon" text="Watch tutorial" Icon={<PlayOutline />} />
        //             <ToolbarButton altText="book icon" text="Read Guide" Icon={<Book />} />
        //           </div>
        //           <button type='button' className="p-2 rounded-full hover:bg-white transition duration-200">
        //             <IconContext.Provider value={{ size: "1.5em", className: "cursor-pointer", color: "#2F2F2F" }}>
        //               <XMark />
        //             </IconContext.Provider>
        //           </button>
        //         </div>
        //       )
        //     }
        //   </section>
        // )
      }
    </header>
  );
};

export default Header;
