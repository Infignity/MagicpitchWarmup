"use client";
import Loader1 from "@/app/(dashboard)/components/Loader1";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { routes } from "./constants";
import Login from "./(auth)/login/page";
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push(routes.LOGIN);
  }, []);

  return (
    <section className="flex justify-center items-center p-5 bg-white h-full w-full overflow-auto">
      <Login />
    </section>
  );
}
