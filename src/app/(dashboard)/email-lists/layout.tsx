"use client";
import React, { useState } from "react";
import Link from "next/link";
import Funel from "@/app/assets/icons/svg/funel.svg";
import Search from "../components/Header/Search";
import { IconContext } from "react-icons";
import { FaPlus } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { routes } from "@/app/constants";
import RequireAuth from "../contexts/requireAuth";
import DragNDrop from "./components/DragNDrop";

const buttons = [
  {
    text: "create reply email",
    url: "#",
  },
  {
    text: "create client email",
    url: "#",
  },
];

const EmailListsLayout = ({ children }: { children: React.ReactNode }) => {
  const [isDragNDropOpen, setIsDragNDropOpen] = useState(false);
  let button = buttons[0];
  const pathname = usePathname();
  if (pathname.startsWith(routes.CLIENT_EMAILS)) {
    button = buttons[1];
  }

  function openDragNDrop() {
    setIsDragNDropOpen(true);
  }

  return (
    <RequireAuth>
      <section className="flex w-full h-full overflow-hidden relative">
        <div className="flex flex-col w-full h-full border-x-[0.5px] text-sm">
          {children}
        </div>
      </section>
    </RequireAuth>
  );
};

export default EmailListsLayout;
