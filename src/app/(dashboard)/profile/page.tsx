"use client";

import { useEffect, useState } from "react";
import { User } from "@/app/types";
import { GetUserApi } from "@/app/api/signupapi";

const page = () => {
  const [user, setUser] = useState<User>();
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

  console.log(user);

  return (
    <div className="w-full h-full overflow-x-hidden p-10 space-y-5">
      <p className="font-bold text-xl">User Details</p>
      <div className="flex flex-col">
        <label htmlFor="username" className="mb-2">
          Username
        </label>
        <input
          type="text"
          value={user?.username}
          className="w-[300px] px-3 py-2 border-2 rounded-md"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="username" className="mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={user?.fullname}
          className="w-[300px] px-3 py-2 border-2 rounded-md"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="username" className="mb-2">
          Email
        </label>
        <input
          type="text"
          value={user?.email}
          className="w-[300px] px-3 py-2 border-2 rounded-md"
        />
      </div>
    </div>
  );
};

export default page;
