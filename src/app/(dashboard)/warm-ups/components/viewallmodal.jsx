import React from "react";
import { IconContext } from "react-icons";
import { BsX } from "react-icons/bs";
import { formatDateToDDMMYYYY } from "../../email-lists/components/formatdate";
import CheckGreen from "@/app/assets/icons/svg/check-green.svg";
import CheckRed from "@/app/assets/icons/svg/check-red.svg";
import CheckYellow from "@/app/assets/icons/svg/check-yellow.svg";
export const ViewAllModal = ({ onClose }) => {
  const warmUpDetails = localStorage.getItem("selectedWarmUp");
  const warupDetailsJSON = warmUpDetails ? JSON.parse(warmUpDetails) : {};
  console.log(warupDetailsJSON);
  // ? JSON.parse(localStorage.getItem("selectedWarmUp"))
  // : [];

  return (
    <div className="modal bg-gray-800 bg-opacity-50 w-full h-full overflow-auto z-50 flex justify-center items-center">
      <div className="modal-content bg-white h-fit max-w-[60rem]  mx-auto w-full z-50">
        <div className="flex justify-between p-5">
          <h2>
          All Details
          </h2>
          <button
            type="button"
            className="w-fit h-fit self-end"
            onClick={() => onClose(false)}
          >
            <IconContext.Provider
              value={{
                size: "2em",
                className: `p-1 rounded-full bg-white text-gray-800 hover:bg-gray-200`,
              }}
            >
              <BsX />
            </IconContext.Provider>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <h3 className="text-sm font-bold">Warmup Name</h3>
              <p>{warupDetailsJSON.name}</p>
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold">Mail Server Name</h3>
              <p>{warupDetailsJSON.mailserverName}</p>
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold">Created At</h3>
              <p>{formatDateToDDMMYYYY(warupDetailsJSON.createdAt)}</p>
            </div>

            <div className="flex flex-col">
              <h3 className="text-sm font-bold">Status</h3>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4">
                  {warupDetailsJSON.state === "notStarted" ? (
                    <CheckYellow />
                  ) : warupDetailsJSON.state === "running" ? (
                    <CheckGreen />
                  ) : warupDetailsJSON.state === "completed" ? (
                    <CheckGreen />
                  ) : warupDetailsJSON.state === "failed" ? (
                    <CheckRed />
                  ) : (
                    <CheckYellow />
                  )}
                </div>
                <p>{warupDetailsJSON.state}</p>
              </div>
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold">Curret WarmUp Day</h3>
              <p>{warupDetailsJSON.currentWarmupDay}</p>
            </div>
            <div className="flex flex-col">
                <h3 className="text-sm font-bold">Increase Rate</h3>
                <p>{warupDetailsJSON.increaseRate}</p>
             </div>
             <div className="flex flex-col">
                <h3 className="text-sm font-bold">Target Open Rate</h3>
                <p>{warupDetailsJSON.targetOpenRate}</p>
             </div>   
             <div className="flex flex-col">
                <h3 className="text-sm font-bold">Total Addresses Mailed</h3>
                <p>{warupDetailsJSON.totalAddressesMailed}</p>
              </div>  
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <h3 className="text-sm font-bold">Client List Name</h3>
              <p>{warupDetailsJSON.clientEmailListName}</p>
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold">Reply Email List Name</h3>
              <p>
                {warupDetailsJSON.replyEmailListName
                  ? warupDetailsJSON.replyEmailListName
                  : "N/A"}
              </p>
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold">Started At</h3>
              <p>{formatDateToDDMMYYYY(warupDetailsJSON.startedAt)}</p>
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold">Max Days</h3>
              <p>{warupDetailsJSON.maxDays}</p>
            </div>
            <div className="flex flex-col">
                <h3 className="text-sm font-bold">Daily Send Limit</h3>
                <p>{warupDetailsJSON.dailySendLimit}</p>
            </div>    
            <div className="flex flex-col">
                <h3 className="text-sm font-bold">Start Volume</h3>
                <p>{warupDetailsJSON.startVolume}</p>
            </div> 
            <div className="flex flex-col">
                <h3 className="text-sm font-bold">Target Reply Rate</h3>
                <p>{warupDetailsJSON.targetReplyRate}</p>
            </div>  
            <div className="flex flex-col">
                <h3 className="text-sm font-bold">Total WarmUp Days</h3>
                <p>{warupDetailsJSON.totalWarmupDays}</p>
            </div>         
          </div>
        </div>
      </div>
    </div>
  );
};
