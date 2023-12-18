"use client";
import React, { DragEvent, useState, useEffect } from "react";
import { IconContext } from "react-icons";
import { CreateListApi } from "@/app/api/createListapi";
import { AllEmailListApi } from "@/app/api/allemaillistapi";
import { BsX as XMark } from "react-icons/bs";
import { useRouter } from "next/navigation";
import Loader1 from "../../components/Loader1";
import EditEmailListApi from "@/app/api/editemaillistapi";
import { useGlobalToastContext } from "@/app/contexts/GlobalToastProvider";
import toast from "react-hot-toast";
const EditDragNDrop = ({
  close,
  setResults,
}: {
  close: () => void;
  setResults: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const { showErrorToast, showSuccessToast } = useGlobalToastContext();
  const [listName, setListName] = useState<string>(
    localStorage.getItem("listName") || ""
  );
  const [fileData, setFileData] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [routeurl, setRouteUrl] = useState<string>("");

  useEffect(() => {
    const pathname = window.location.pathname;

    if (pathname === "/email-lists/reply-emails") {
      setRouteUrl("replyEmails");
    } else if (pathname === "/email-lists/client-emails") {
      setRouteUrl("clientEmails");
    } else {
      setRouteUrl(""); // Set routeUrl to null if pathname doesn't match any condition
    }
    console.log(pathname);
  }, []); // This useEffect runs only once on initial mount due to the empty dependency array

  // store the data of the uploaded file, so it can be uploaded to the server
  function setSelectedFiles(files: FileList | null) {
    if (files) {
      const file = files[0];
      const validFileTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain",
      ];
      if (!validFileTypes.includes(file.type)) {
        showErrorToast(
          "Invalid file type. Only CSV, XLS, XLSX and TXT files are supported."
        );
        return;
      }
      if (file.size > 5000000) {
        // 5MB
        showErrorToast("File is too large. Maximum file size is 5MB.");
        return;
      }
    }
    setIsUploadingFiles(false);
    setFileData(files);
  }

  function handleOnDragOver(e: DragEvent) {
    e.preventDefault();
    console.log("drag over");
  }

  function handleOnDrop(e: DragEvent) {
    e.preventDefault();
    setSelectedFiles(e.dataTransfer.files);
  }

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsLoading(true);
    const id = localStorage.getItem("rowId");
    const formData = new FormData();
    formData.append("name", listName);
    if (fileData) {
      formData.append("file", fileData[0]);
    }
    formData.append("updateType", "merge");

    try {
      console.log(formData);
      console.log(id);
      const response = await EditEmailListApi(id, formData);
      console.log(response);
      close();
      showSuccessToast("List updated successfully");
      const newResults = await AllEmailListApi(routeurl);
      setResults(newResults.data.emailLists);
      setIsLoading(false);
    } catch (error : any) {
      console.log(error);
      setIsLoading(false);
      toast.error(
        (t) => (
          <div className="flex w-full">
            {/* Assuming the icon is automatically added by react-hot-toast */}
            <div className="flex flex-col">
              <h3 className="text-base font-semibold">
                {error.response?.data?.message ||
                  "An error occurred during sign in"}
              </h3>
              <p>
                {error.response?.data?.description ||
                  "An error occurred during sign in"}
              </p>
            </div>
          </div>
        ),
        {
          duration: 6000,
          style: {
            width: "100%",
            textAlign: "left",
            // Add any custom styling here
          },
        }
      );
    }
  }

  return (
    <>
      {isLoading ? (
        <p className="scale-75 flex justify-center items-center relative h-full w-full">
          <Loader1 />
        </p>
      ) : null}
      <section className="flex justify-center w-full h-full overflow-auto absolute inset-0 bg-opacity-80 bg-gray-100 p-5">
        <div className="flex  w-full items-center justify-center max-w-[40rem] p-5">
          {/* upload file section */}
          <form className="flex flex-col gap-2 bg-white w-full p-5">
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="Enter list name"
              className="px-2 py-1 max-w-[200px] w-full border-[1px] border-gray-500 rounded-md"
            />
            <div
              className="flex flex-col items-center gap-5 px-2 pt-2 pb-10 border-[1px] bg-white border-gray-500 rounded-md border-dashed hover:border-blue "
              onDragOver={handleOnDragOver}
              onDrop={handleOnDrop}
            >
              <button
                type="button"
                onClick={() => close()}
                className="self-end p-2 rounded-full hover:bg-gray-100 transition duration-200"
              >
                <IconContext.Provider value={{ size: "1.5em" }}>
                  <XMark />
                </IconContext.Provider>
              </button>
              <h3 className="text-2xl text-gray-800 font-medium">
                Upload or Drop File
              </h3>
              <label
                htmlFor="file-upload"
                className="rounded-md cursor-pointer bg-blue shadow-md text-white capitalize px-6 md:px-12 py-2"
              >
                Choose File
              </label>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={(e) => {
                  e.preventDefault();
                  setSelectedFiles(e.target.files);
                }}
              />
              {
                // show the name of the file if it is selected
                fileData && (
                  <p className="text-gray-500 text-center">
                    {fileData?.[0]?.name}
                  </p>
                )
              }
              <p className="text-xs text-gray-500 text-center">
                Reply email tool supports CSV, XLS, XLSX and TXT file formats
              </p>
            </div>
            {isUploadingFiles && (
              <div>
                <p>Uploading: {fileData?.[0]?.name}</p>
                <progress
                  value={fileUploadProgress}
                  max={100}
                  className="w-full pros-docs-progress"
                ></progress>
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={!fileData || !listName.trim() || isLoading}
              className={`bg-gray-placeholder ${
                !fileData ? "hidden" : ""
              } text-white rounded-md shadow-md px-4 py-1 self-end bg-blue-500 ${
                isLoading ? "animate-blink" : ""
              }`}
            >
              {
                // show loading text if the files are being uploaded
                isLoading ? "Uploading..." : "Upload"
              }
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default EditDragNDrop;
