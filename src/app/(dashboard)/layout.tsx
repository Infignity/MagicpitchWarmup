import React from "react";
import Sidebar from "@/app/(dashboard)/components/Sidebar";
import Header from "@/app/(dashboard)/components/Header";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import RequireAuth from "./contexts/requireAuth";
import AdsBanner from "./components/AdsBanner";

export const metadata: Metadata = {
  title: "Magicpitch Warmup",
  description: "Warmup app",
};

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500"] });

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RequireAuth>
      <div className={inter.className}>
        <AdsBanner />
        <div className="w-full h-full flex">
          <Sidebar />
          <div className="flex flex-col w-full h-full min-w-0">
            <Header />
            {children}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
};

export default DashboardLayout;
