"use client";
import { useState, useEffect, useRef } from "react";
import { DeleteListApi } from "@/app/api/deletelistapi";
import { AllEmailListApi } from "@/app/api/allemaillistapi";
import Loader1 from "../../components/Loader1";
import Funel from "@/app/assets/icons/svg/funel.svg";
import Search from "../../components/Header/Search";
import { IconContext } from "react-icons";
import { FaPlus } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { routes } from "@/app/constants";
import DeleteIcon from "@/app/assets/icons/svg/delete.svg";
import DragNDrop from "./DragNDrop";
import EditDragNDrop from "./editDragNDrop";
import { formatDateToDDMMYYYY } from "./formatdate";
import { useGlobalToastContext } from "@/app/contexts/GlobalToastProvider";
import path from "path";
import { Tooltip } from "react-tooltip";
import Link from "next/link";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../contexts/authContext";

export default function EmailList({
  results,
  setResults,
  searchQuery,
  setSearchQuery,
  currentPage,
  pageSize,
  totalResults,
}: {
  results: any[];
  setResults: React.Dispatch<React.SetStateAction<any[]>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  currentPage: any;
  pageSize: any;
  totalResults: any;
}) {
  const { showErrorToast, showSuccessToast } = useGlobalToastContext();
  const [dropdownStates, setDropdownStates] = useState<Map<number, boolean>>(
    new Map()
  );

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
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragNDropOpen, setIsDragNDropOpen] = useState(false);
  const [isEditDragNDropOpen, setIsEditDragNDropOpen] = useState(false);
  const [routeurl, setRouteUrl] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        toggleDropdown(null); // or however you close the dropdown
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const path = window.location.pathname;

    if (path === "/email-lists/reply-emails") {
      console.log("reply");
      setRouteUrl("replyEmails");
    } else if (path === "/email-lists/client-emails") {
      console.log("client");
      setRouteUrl("clientEmails");
    } else {
      setRouteUrl(""); // Set routeUrl to null if pathname doesn't match any condition
    }
    console.log(path);
  }, [path]); // This useEffect runs only once on initial mount due to the empty dependency array
  function handlePageChange(isprev: boolean) {
    if (Number(currentPage) === 0 && isprev) {
      return `/email-lists/client-emails?page=${currentPage}`;
    }
    if (isprev) {
      `/email-lists/client-emails?page=${Number(currentPage) - 30}`;
    }
    return `/email-lists/client-emails?page=${Number(currentPage) + 30}`;
  }

  let button = buttons[0];
  const pathname = usePathname();
  if (pathname.startsWith(routes.CLIENT_EMAILS)) {
    button = buttons[1];
  }

  function openDragNDrop() {
    setIsDragNDropOpen(true);
  }

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allRowIds = results.map((server) => server._id);
      setSelectedRows(allRowIds);
    } else {
      setSelectedRows([]);
    }
  };
  const toggleDropdown = (dropdownId: number | null) => {
    const newDropdownStates = new Map(dropdownStates);

    if (dropdownId === null) {
      // Close all dropdowns
      newDropdownStates.forEach((value, key) => {
        newDropdownStates.set(key, false);
      });
    } else {
      // Toggle the specific dropdown
      newDropdownStates.set(dropdownId, !newDropdownStates.get(dropdownId));
    }

    setDropdownStates(newDropdownStates);
    console.log(dropdownId);
  };

  const handleRowSelect = (rowId: number) => {
    let updatedSelectedRows = [...selectedRows];
    if (updatedSelectedRows.includes(rowId)) {
      updatedSelectedRows = updatedSelectedRows.filter((id) => id !== rowId);
    } else {
      updatedSelectedRows.push(rowId);
    }
    setSelectedRows(updatedSelectedRows);
  };
  const handleDeleteRows = async () => {
    if (selectedRows.length === 0) return;

    setIsLoading(true);

    try {
      const emailListIds = selectedRows.map((id) => id.toString()); // Convert IDs to strings if necessary

      const data = JSON.stringify({ emailListIds }); // Create the required data format

      // Make the API call to delete selected rows
      const response = await DeleteListApi(data);
      console.log(response); // Log success message
      showSuccessToast("Email List deleted successfully");
      const newResults = await AllEmailListApi(routeurl);
      setResults(newResults.data.emailLists);
      // Upon successful deletion, clear selected rows and stop the loader
      setSelectedRows([]);
    } catch (error: any) {
      console.log(error);
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
    } finally {
      setIsLoading(false); // Stop loader whether deletion succeeds or fails
    }
  };
  const handleEditModal = (rowId: any) => () => {
    localStorage.setItem("rowId", rowId);
    const listName = results.filter((server) => server._id === rowId);
    localStorage.setItem("listName", listName[0].name);
    console.log(listName[0].name);
    console.log(rowId);
    setIsEditDragNDropOpen(true);
  };

  const { token } = useAuth();
  // Update the rendering logic for results based on the search query
  const handleDownload = async (downloadUrl: string) => {
    try {
      await axios
        .get(`https://api-warmup.infignity.uk${downloadUrl}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        })
        .then((res) => {
          const blob = new Blob([res.data]);
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "email lists";
          link.click();
        })
        .finally(() => {
          toast.success("Downloaded Successfully");
        });
    } catch (err) {
      console.log(err);
      toast.error("Couldn't download the file!");
    }
  };
  return (
    <>
      {isDragNDropOpen && (
        <section className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
          <DragNDrop
            close={() => setIsDragNDropOpen(false)}
            setResults={setResults}
          />
        </section>
      )}
      {isEditDragNDropOpen && (
        <>
          <section className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
            <EditDragNDrop
              close={() => setIsEditDragNDropOpen(false)}
              setResults={setResults}
            />
          </section>
        </>
      )}
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            background: "rgba(255, 255, 255, 0.8)",
            padding: "20px",
            borderRadius: "5px",
          }}
        >
          <Loader1 />
        </div>
      )}

      <section className="flex flex-col gap-2 w-full h-full relative bg-white">
        <div className="flex  justify-between w-full h-fit  items-center p-5">
          <button
            type="button"
            onClick={() => openDragNDrop()}
            className="capitalize rounded-[7px] bg-blue-500  text-white  flex items-center gap-4 px-6 py-2"
          >
            <IconContext.Provider value={{ color: "" }}>
              <FaPlus />
            </IconContext.Provider>
            <span>{button.text}</span>
          </button>
          <div className="w-fit">
            {pathname.startsWith(routes.CLIENT_EMAILS) ? (
              <Search
                placeholder={"Search Emails"}
                onChange={(value) => setSearchQuery(value)}
                FlareIcon={<Funel />}
                hideSearchIcon={true}
                hideBorder={true}
              />
            ) : (
              <Search
                placeholder={"Search Emails"}
                hideSearchIcon={true}
                hideBorder={true}
                hideFlare={true}
              />
            )}
          </div>
        </div>
        <div className="w-full flex justify-between items-center">
          <button
            onClick={handleDeleteRows}
            disabled={selectedRows.length === 0}
            className=" bg-[red] text-white font-bold py-2 px-4 rounded
        disabled:opacity-50 disabled:cursor-not-allowed ml-10 mb-3
       "
            data-tooltip-id="Delete"
          >
            <DeleteIcon />
            <Tooltip id="Delete" place="bottom" content="Delete" />
          </button>
          <div className="flex gap-3 items-center justify-end">
            <Link
              href={handlePageChange(true)}
              className={`bg-white px-3 py-1 rounded-md text-gray-500
            ${
              Number(currentPage) === 0
                ? "pointer-events-none opacity-20"
                : "block"
            }
            
            `}
            >
              Previous
            </Link>

            <button>
              <Link
                href={handlePageChange(false)}
                className={`bg-white px-3 py-1 rounded-md text-gray-500
            ${
              Number(currentPage) + pageSize > totalResults
                ? "pointer-events-none opacity-20"
                : "block"
            }
            `}
              >
                Next
              </Link>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto pb-[200px]">
          <table className=" border-collapse w-full min-w-[60rem] text-left">
            <thead>
              <tr>
                {/* button to select all */}
                <th className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Last Modified</th>
                <th className="px-4 py-2">Total Emails</th>
                <th className="px-4 py-2">List Type</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                // Display a message if no results are found
                results.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-2 text-center text-gray-800"
                    >
                      No results found
                    </td>
                  </tr>
                )
              }
              {results.map((server) => (
                <tr key={server._id} className="border-b border-gray-200">
                  {/* checkbox to select each row */}
                  <td className="px-4 py-2 flex items-center justify-start">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(server._id)}
                      onChange={() => handleRowSelect(server._id)}
                    />
                  </td>
                  <td className="px-4 py-2 text-start">{server.name}</td>
                  <td className="px-4 py-2 text-start">
                    {formatDateToDDMMYYYY(server.createdAt)}
                  </td>
                  <td className="px-4 py-2 text-start">
                    {formatDateToDDMMYYYY(server.lastModified)}
                  </td>
                  <td className="px-4 py-2 text-start">{server.totalEmails}</td>
                  <td className="px-4 py-2 text-start">
                    {server.emailListType}
                  </td>
                  <td className="px-4 py-2 text-start flex items-center justify-start">
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(server._id)}
                        className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
                      >
                        <svg
                          className="w-4 h-4 text-gray-600"
                          viewBox="0 0 3 15"
                          fill="currentColor"
                        >
                          {/* Three dots SVG path */}
                          <circle cx="1.5" cy="2.5" r="1.5" />
                          <circle cx="1.5" cy="7.5" r="1.5" />
                          <circle cx="1.5" cy="12.5" r="1.5" />
                        </svg>
                      </button>
                      {dropdownStates.get(server._id) && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 z-10 w-48 py-2 mt-2 bg-white rounded-md shadow-xl"
                        >
                          {/* Dropdown content */}
                          <button
                            onClick={handleEditModal(server._id)}
                            className="block px-4 py-2 text-gray-800 hover:bg-indigo-500"
                          >
                            Edit
                          </button>
                          <button
                            className="block px-4 py-2 text-gray-800 hover:bg-indigo-500"
                            onClick={() => handleDownload(server.url)}
                          >
                            Download
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
