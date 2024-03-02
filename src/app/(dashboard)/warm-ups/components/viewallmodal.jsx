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
    // <div className="modal bg-gray-800 bg-opacity-50 w-full h-full overflow-auto z-50 flex justify-center items-center ">
    <div className="bg-white h-[calc(100vh-64px)] max-w-[40rem] z-50 rounded-tl-2xl rounded-bl-2xl overflow-y-scroll">
      <div className="flex justify-between p-5">
        <h2 className="text-xl font-bold">All Details</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5">
        <div className="flex flex-col gap-3 col-span-2">
          <div className="flex flex-col">
            <h3 className="font-bold pb-1">Warmup Name</h3>
            <p>{warupDetailsJSON.name}</p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold pb-1">Mail Server Name</h3>
            <p>{warupDetailsJSON.mailserverName}</p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold pb-1">Created At</h3>
            <p>
              {new Date(warupDetailsJSON.createdAt * 1000).toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold pb-1">Scheduled At</h3>
            <p>
              {new Date(warupDetailsJSON.scheduledAt * 1000).toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold pb-1">Status</h3>
            <div className="flex flex-col">
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
              {warupDetailsJSON.statusText && (
                <p
                  className={`text-xs rounded-lg px-2 py-1 w-fit ${
                    warupDetailsJSON.state === "notStarted"
                      ? "text-yellow bg-opacity-20"
                      : warupDetailsJSON.state === "running"
                      ? "text-green  bg-opacity-20"
                      : warupDetailsJSON.state === "completed"
                      ? "text-green  bg-opacity-20"
                      : warupDetailsJSON.state === "failed"
                      ? "text-red  bg-opacity-20"
                      : ""
                    // : "text-yellow bg-opacity-20"
                  }`}
                  style={{
                    backgroundImage:
                      warupDetailsJSON.state === "notStarted"
                        ? "linear-gradient(135deg, rgba(250, 204, 21, 0.2), rgba(250, 204, 21, 0.1))"
                        : warupDetailsJSON.state === "running"
                        ? "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))"
                        : warupDetailsJSON.state === "completed"
                        ? "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))"
                        : warupDetailsJSON.state === "failed"
                        ? "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))"
                        : "",
                    // : "linear-gradient(135deg, rgba(250, 204, 21, 0.2), rgba(250, 204, 21, 0.1))",
                  }}
                >
                  {warupDetailsJSON.statusText}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold pb-1">Curret WarmUp Day</h3>
            <p>{warupDetailsJSON.currentWarmupDay}</p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold pb-1">Increase Rate</h3>
            <p>{warupDetailsJSON.increaseRate}</p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold pb-1">Target Open Rate</h3>
            <p>{warupDetailsJSON.targetOpenRate}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <h3 className="font-bold pb-1">Client List Name</h3>
            <p>{warupDetailsJSON.clientEmailListName}</p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold pb-1">Reply Email List Name</h3>
            <p>
              {warupDetailsJSON.replyEmailListName
                ? warupDetailsJSON.replyEmailListName
                : "N/A"}
            </p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold pb-1">Started At</h3>
            <p>
              {new Date(warupDetailsJSON.startedAt * 1000).toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold pb-1">Max Days</h3>
            <p>{warupDetailsJSON.maxDays}</p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold pb-1">Daily Send Limit</h3>
            <p>{warupDetailsJSON.dailySendLimit}</p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold pb-1">Start Volume</h3>
            <p>{warupDetailsJSON.startVolume}</p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold pb-1">Target Reply Rate</h3>
            <p>{warupDetailsJSON.targetReplyRate}</p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold pb-1">Total WarmUp Days</h3>
            <p>{warupDetailsJSON.totalWarmupDays}</p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold pb-1">Total Addresses Mailed</h3>
            <p>{warupDetailsJSON.totalAddressesMailed}</p>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};
