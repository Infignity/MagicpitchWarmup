"use client";

import React, { ChangeEvent, useState } from "react";
import { LegacyRef } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

const TextInput = ({
  label,
  placeholder,
  value,
  onChange,
  errRef,
  name,
  type,
  min,
  max,
}: {
  label: string;
  placeholder: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  errRef?: LegacyRef<HTMLParagraphElement>;
  name: string;
  type?: string;
  min?: number;
  max?: number;
}) => {
  const [showPwd, setShowPwd] = useState<boolean>(false);
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-gray-800">{label}</label>
      <div className="w-full relative">
        <input
          type={type === "password" && showPwd ? "text" : type}
          value={value}
          onChange={(e) => onChange(e)}
          className="text-gray-800 px-4 py-2 text-xs rounded border-[1px] border-[#B2B2B2] w-full"
          placeholder={placeholder}
          name={name}
          min={min}
          max={max}
        />
        {type === "password" && (
          <div
            className="absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer"
            onClick={() => setShowPwd((prev) => !prev)}
          >
            {showPwd ? <LuEyeOff /> : <LuEye />}
          </div>
        )}
      </div>
      <p ref={errRef} className="text-xs text-start text-[red]"></p>
    </div>
  );
};

export default TextInput;
