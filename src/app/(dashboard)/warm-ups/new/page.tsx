"use client"
import React from 'react'
import TextInput from '@/app/(dashboard)/components/TextInput'

const CreateWarmup = () => {

  function handleOnChange(){
  }

  return (
    <section className="w-full h-full overflow-auto flex bg-gray-150 px-5 py-10">
      <div className="w-full h-fit flex flex-col items-center just50y-center gap-5 ">
        <form className="bg-white p-5 lg:p-10 rounded-3xl border-[1px] border-[#C2C2C2] w-full max-w-[60rem] flex flex-col gap-7 h-fit">
          <div className="flex justify-between gap-3">
            <h3 className="text-xl text-blue font-medium">Enter details for Warm-up</h3>
          </div>
          <div className="flex gap-6 h-full">
            <div className="w-full flex flex-col gap-5">
              <TextInput label='Select Mail Server Associated with this Warmup' placeholder='Select A "Mail Server" List' value="" onChange={handleOnChange} />
              <TextInput label='Select Client Email Associated with this Warmup' placeholder='Select A Client Email List' value="" onChange={handleOnChange} />
              <TextInput label="Warm-up Name" placeholder="Enter your warm-up name" value="" onChange={handleOnChange} />
              <TextInput label="Warm-up Name" placeholder="Enter your warm-up name"  value="" onChange={handleOnChange}/>
              <TextInput label="Warm-up Name" placeholder="Enter your warm-up name" value="" onChange={handleOnChange} />
              <button type="button" className="px-5 md:px-10 py-2 bg-blue rounded-md text-white w-fit">Submit</button>
            </div>

            <div className="w-full flex flex-col gap-5">
              <TextInput label='Select Mail Server Associated with this Warmup' placeholder='Select A "Mail Server" List' value="" onChange={handleOnChange}/>
              <TextInput label="Warm-up Name" placeholder="Enter your warm-up name" value="" onChange={handleOnChange} />
              <TextInput label="Warm-up Name" placeholder="Enter your warm-up name" value="" onChange={handleOnChange} />
              <TextInput label="Warm-up Name" placeholder="Enter your warm-up name" value="" onChange={handleOnChange} />
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

export default CreateWarmup
