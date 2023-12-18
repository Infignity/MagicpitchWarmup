"use client";
import React from "react";
import Link from "next/link";
import WarmupIcon from "@/app/assets/icons/svg/cast.svg";
import Link3 from "@/app/assets/icons/svg/Gmail.svg";
import Link4 from "@/app/assets/icons/svg/server.svg";
import Link5 from "@/app/assets/icons/svg/image 1.svg";
import Link6 from "@/app/assets/icons/svg/settings.svg";
import Logout from "@/app/assets/icons/svg/logout.svg";
import WarmupSidebar from "./components/WarmupSidebar";
import MailServersSidebar from "./components/MailServersSidebar";
import EmailListsSidebar from "./components/EmailListsSidebar";
import { usePathname } from "next/navigation";
// import { useAppDispatch, useAppSelector } from '@/app/(dashboard)/store/hooks'
// import { selectIsSidebarOpen } from '@/app/(dashboard)/store/slices/sidebarSlice'
import { Tooltip } from "react-tooltip";
import { useRouter } from "next/navigation";

interface Sidebar {
  title: string;
  component: () => React.JSX.Element;
}

const sidebars: Sidebar[] = [
  {
    title: "Warm-ups",
    component: WarmupSidebar,
  },
  {
    title: "Mail Servers",
    component: MailServersSidebar,
  },
  {
    title: "Email Lists",
    component: EmailListsSidebar,
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  let SecSidebar: Sidebar | null = null;
  const router = useRouter()
  // const dispatch = useAppDispatch()
  const isSidebarOpen = true;
  const warmUpsRoute = "/warm-ups";
  const mailServersRoute = "/mail-servers";
  const emailListsRoute = "/email-lists";
  const settingsRoute = "/settings";

  // add more conditions for the sidebar of other pages
  if (pathname.startsWith(warmUpsRoute)) {
    SecSidebar = sidebars[0];
  } else if (pathname.startsWith("/mail-servers")) {
    SecSidebar = sidebars[1];
  } else if (pathname.startsWith("/email-lists")) {
    SecSidebar = sidebars[2];
  }

  const SignOut = () => {
    sessionStorage.removeItem('token')
    router.push('/login')
  }
    

  return (
    <section className="flex h-full">
      {/* primary navigation */}
      <nav className="flex w-fit flex-col gap-2 justify-between bg-blue">
        <ul className="flex flex-col  h-full gap-5 md:gap-10 items-center justify-start py-5">
          <Link href={warmUpsRoute} className="shadow-md">
            {
              // <Image src={Link5} alt="" className="w-8 h-8" />
              <Link5 />
            }
          </Link>
          {/* nav items */}
          <div className="h-full flex flex-col justify-start gap-2 items-center">
            <li
              className={`cursor-pointer p-2 transition duration-300 ${
                pathname.startsWith(warmUpsRoute) ? `bg-blue-highlight` : ""
              }`}
            >
              <Link href={warmUpsRoute} data-tooltip-id={warmUpsRoute}>
                <WarmupIcon />
              </Link>
              <Tooltip id={warmUpsRoute} content={"Warmups"} place="right" />
            </li>
            <li
              className={`cursor-pointer p-2 transition duration-300 ${
                pathname.startsWith(mailServersRoute) ? `bg-blue-highlight` : ""
              }`}
            >
              <Link href={mailServersRoute} data-tooltip-id={mailServersRoute}>
                <Link4 />
              </Link>
              <Tooltip
                id={mailServersRoute}
                content={"Mail Servers"}
                place="right"
              />
            </li>
            <li
              className={`cursor-pointer p-2 transition duration-300 ${
                pathname.startsWith(emailListsRoute) ? `bg-blue-highlight` : ""
              }`}
            >
              <Link href={emailListsRoute} data-tooltip-id={emailListsRoute}>
                <Link3 />
              </Link>
              <Tooltip
                id={emailListsRoute}
                content={"Email Lists"}
                place="right"
              />
            </li>
          </div>
          <li
            className={`cursor-pointer justify-self-end transition duration-300 p-2 ${
              pathname.startsWith(settingsRoute) ? `bg-blue-highlight` : ""
            }`}
          >
            <button 
            onClick={SignOut}
            data-tooltip-id={settingsRoute}>
              <Logout />
            </button>
            <Tooltip id={settingsRoute} content={"Logout"} place="right" />
          </li>
        </ul>
      </nav>

      {/* secondary navigation */}
      {SecSidebar && (
        <section
          className={`flex flex-col items-center gap-5 transition-all duration-300 ${
            isSidebarOpen ? "w-[15rem] p-5" : "w-[4rem] px-3 py-5"
          }`}
        >
          <h2
            className={`text-start w-full text-gray-800 text-xl line-clamp-1 font-bold ${
              isSidebarOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            {SecSidebar.title}
          </h2>
          <div className="flex h-full w-full justify-center">
            <SecSidebar.component />
          </div>
        </section>
      )}
    </section>
  );
};

export default Sidebar;
