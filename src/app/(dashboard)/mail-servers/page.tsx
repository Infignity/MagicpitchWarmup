"use client";
import { BsX as XMark, BsArrowLeftShort as ArrowLeft } from "react-icons/bs";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EmptyListPlaceholder from "../components/EmptyListPlaceholder";
import SearchNotFound from "../components/SearchNotFound";
import { routes } from "@/app/constants";
import Loader1 from "../components/Loader1";
import { MailServer } from "@/app/types";
import { IconContext } from "react-icons";
import Search from "../components/Header/Search";
import DeleteIcon from "@/app/assets/icons/svg/delete.svg";
import ToolbarButton from "../components/Header/ToolbarButton";
import Book from "@/app/assets/icons/svg/book.svg";
import PlayOutline from "@/app/assets/icons/svg/play-outline.svg";
import MailServersList from "./components/MailServersList";
import { AllMailServersApi } from "@/app/api/allmailserversapi";
import { DeleteMailServerApi } from "@/app/api/deletemailserverapi";
import MailServerForm from "./components/MailServerForm";
import { useGlobalToastContext } from "@/app/contexts/GlobalToastProvider";
import Loader2 from "@/app/(dashboard)/components/Loader2";
import { useSearchParams } from "next/navigation";
import { useUser } from "../contexts/UserProvider";
import { Tooltip } from "react-tooltip";
import toast from "react-hot-toast";
export default function MailServersWrapper() {
  const [isShowSearch] = useState(true);

  //   const token = useUserContext().token as string
  const { showSuccessToast, showErrorToast } = useGlobalToastContext();
  const { isMailServerModal, setIsMailServerModal } = useUser();

  const isSidebarOpen = true;

  return (
    <section className="flex flex-col gap-2 w-full h-full relative bg-white">
      <MailServers />
    </section>
  );
}

function MailServers() {
  //   const userData = useUserContext();
  const [isShowSearch] = useState(true);
  //   const token = useUserContext().token as string
  const { showSuccessToast, showErrorToast } = useGlobalToastContext();
  const { isMailServerModal, setIsMailServerModal } = useUser();
  const [allMailServers, setAllMailServers] = useState<any[]>([]);
  const isSidebarOpen = true;
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const searchParams = useSearchParams();
  const [totalResults, setTotalResults] = useState(0);
  const [pageSize, setPageSize] = useState(50);

  const currentPage = searchParams.get("page") ?? 0;

  // Check if window is defined (i.e. we're on the client side)

  useEffect(() => {
    console.log("currentPage: ", currentPage);
    setIsLoading(true);
    const fetchMailServers = async () => {
      try {
        const resp = await AllMailServersApi(
          currentPage,
          searchQuery === "" ? null : searchQuery
        );
        console.log("resp: ", resp);
        setAllMailServers(resp.data.results);
        setTotalResults(resp.data.totalResults);
        setPageSize(resp.data.pageSize);
        setIsLoading(false);
      } catch (error: any) {
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
        // if (err.data) {
        //   console.log(err.data.description);
        //   showErrorToast(err.data.description);
        // } else if (err.message) {
        //   console.log(err.message);
        //   showErrorToast(err.message);
        // } else if (err.error) {
        //   console.log(err.error);
        //   showErrorToast(err.error);
        // } else {
        //   showErrorToast("Unable to complete delete");
        // }
      }
    };
    fetchMailServers();
  }, [currentPage, searchQuery]);

  // if (isLoading) {
  //   return (
  //     <div className="w-full h-full flex justify-center items-center">
  //       <Loader1 />
  //     </div>
  //   );
  // }

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allRowIds = allMailServers.map((server) => server._id);
      setSelectedRows(allRowIds);
    } else {
      setSelectedRows([]);
    }
  };
  const handleRowSelect = (rowId: number) => {
    const updatedSelectedRows = [...selectedRows];
    const index = updatedSelectedRows.indexOf(rowId);

    if (index === -1) {
      updatedSelectedRows.push(rowId);
    } else {
      updatedSelectedRows.splice(index, 1);
    }

    setSelectedRows(updatedSelectedRows);
  };

  const handleDeleteRows = async () => {
    if (selectedRows.length === 0) return;

    setIsLoading(true);

    try {
      const mailServerIds = selectedRows.map((id) => id.toString()); // Convert IDs to strings if necessary

      const data = JSON.stringify({ mailServerIds }); // Create the required data format
      console.log(data);

      // Make the API call to delete selected rows
      const response = await DeleteMailServerApi(data);
      console.log(response); // Log success message
      showSuccessToast("Email List deleted successfully");
      const newResults = await AllMailServersApi(currentPage);
      setAllMailServers(newResults.data.results);
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

  function handlePageChange(isprev: boolean) {
    if (Number(currentPage) === 0 && isprev) {
      return `/mail-servers?page=${currentPage}`;
    }
    if (isprev) {
      `/mail-servers?page=${Number(currentPage) - 30}`;
    }
    return `/mail-servers?page=${Number(currentPage) + 30}`;
  }

  return (
    <section className="flex flex-col gap-2 w-full h-full relative bg-white overflow-x-hidden">
      {isMailServerModal && (
        <MailServerForm setAllMailServers={setAllMailServers} />
      )}
      {isLoading && (
        <div
          style={{
            position: "absolute",
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
      <div className="w-full h-full flex flex-col">
        <section className="bg-gray-100 flex gap-2 w-full justify-between items-center lg:px-10  py-3 relative">
          <button
            type="button"
            className="z-30 rounded-full bg-gray-200 transition duration-200 -translate-x-1/2 w-7 h-7 flex justify-center items-center"
          >
            <IconContext.Provider
              value={{
                size: "2em",
                className: `cursor-pointer p-1 ${
                  isSidebarOpen ? "" : "rotate-180"
                }`,
                color: "#2F2F2F",
              }}
            >
              <ArrowLeft />
            </IconContext.Provider>
          </button>
          {/* {
          markedServerIDs.length > 0 && ( */}
          <div className="flex justify-start justify-self-start w-full">
            <button
              className="w-fit bg-[#dd2222] px-3 py-1 disabled:opacity-20 rounded-md text-white"
              onClick={handleDeleteRows}
              disabled={selectedRows.length === 0}
              data-tooltip-id="Delete"
            >
              <DeleteIcon />
              <Tooltip id="Delete" place="top" content="Delete" />
            </button>
          </div>
          {/* )
        } */}

          {isShowSearch ? (
            <div className="flex justify-end">
              <Search
                placeholder={"Search Emails"}
                onChange={(value) => setSearchQuery(value)}
                hideFlare={true}
              />
            </div>
          ) : (
            <div className="flex gap-3 items-center w-full justify-between">
              <p className="text-gray-500 hidden md:inline">
                Learn how to use Email list for higher lead engagement and more
                replies
              </p>
              <div className="flex gap-3.5 items-center">
                <ToolbarButton
                  altText="play icon"
                  text="Watch tutorial"
                  Icon={<PlayOutline />}
                />
                <ToolbarButton
                  altText="book icon"
                  text="Read Guide"
                  Icon={<Book />}
                />
              </div>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-white transition duration-200"
              >
                <IconContext.Provider
                  value={{
                    size: "1.5em",
                    className: "cursor-pointer",
                    color: "#2F2F2F",
                  }}
                >
                  <XMark />
                </IconContext.Provider>
              </button>
            </div>
          )}
        </section>
        {/* previous and next buttons */}
        <div className="flex gap-3 items-center justify-end w-full">
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
        <div className="flex flex-col w-full h-full overflow-x-auto overflow-y-visible">
          <MailServersList
            allMailServers={allMailServers}
            setAllMailServers={setAllMailServers}
            handleRowSelect={handleRowSelect}
            handleSelectAll={handleSelectAll}
            selectedRows={selectedRows}
            selectAll={selectAll}
          />
        </div>
      </div>
    </section>
  );
}
