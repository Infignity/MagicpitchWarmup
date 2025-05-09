"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, SetStateAction } from "react";
import EmptyListPlaceholder from "../components/EmptyListPlaceholder";
import Link from "next/link";
import CheckGreen from "@/app/assets/icons/svg/check-green.svg";
import CheckRed from "@/app/assets/icons/svg/check-red.svg";
import CheckYellow from "@/app/assets/icons/svg/check-yellow.svg";
import NotFound from "@/app/assets/images/illustrations/notfound.svg";
import { routes } from "@/app/constants";
import RequireAuth from "../contexts/requireAuth";
import { AllWarmupServersApi } from "@/app/api/allwarmupserversapi";
import { DeleteWarmupApi } from "@/app/api/deletewarmupapi";
import { UpdateWarmupApi } from "@/app/api/updatewarmupapi";
import { formatDateToDDMMYYYY } from "../email-lists/components/formatdate";
import SelectInput from "../components/SelectInput";
import { useGlobalToastContext } from "@/app/contexts/GlobalToastProvider";
import DeleteIcon from "@/app/assets/icons/svg/delete.svg";
import PauseIcon from "@/app/assets/icons/svg/pause.svg";
import ResumeIcon from "@/app/assets/icons/svg/resume.svg";
import Loader1 from "../components/Loader1";
import Search from "../components/Header/Search";
import { ViewAllModal } from "./components/viewallmodal";
import { useSearchParams } from "next/navigation";
import { Tooltip } from "react-tooltip";
import toast from "react-hot-toast";
import "react-tooltip/dist/react-tooltip.css";

const WarmUp = () => {
  const [warmups, setWarmups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  // State to control the delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const [totalResults, setTotalResults] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const currentPage = searchParams.get("page") ?? 0;
  const { showSuccessToast, showErrorToast } = useGlobalToastContext();
  const [checked, setChecked] = useState([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [dropdownStates, setDropdownStates] = useState<Map<number, boolean>>(
    new Map()
  );
  const [isEditDragNDropOpen, setIsEditDragNDropOpen] = useState(false);
  // State to manage checked rows using an object
  const [checkedRows, setCheckedRows] = useState<Record<string, boolean>>({});

  const router = useRouter();
  const index = 0;

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
  const handleEditModal = (rowId: any) => () => {
    localStorage.setItem("rowId", rowId);
    // Find the mail server object corresponding to the rowId
    const selectedWarmUp = warmups.find((server) => server._id === rowId);

    // Check if the selectedMailServer is found
    if (selectedWarmUp) {
      // Save the selected object to localStorage
      console.log(selectedWarmUp);
      localStorage.setItem("selectedWarmUp", JSON.stringify(selectedWarmUp));
      setIsEditDragNDropOpen(true);
    } else {
      console.error("Mail server not found for the given rowId:", rowId);
    }
  };

  useEffect(() => {
    const fetchWarmups = async () => {
      try {
        const response = await AllWarmupServersApi(currentPage);
        console.log(response.data);
        setWarmups(response.data.results);
        setTotalResults(response.data.totalResults);
        setPageSize(response.data.pageSize);
        setIsLoading(false);
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
        setIsLoading(false);
      }
    };
    fetchWarmups();
  }, [currentPage]);

  // filtervalue and search query
  useEffect(() => {
    const fetchWarmups = async () => {
      setIsLoading(true);

      try {
        const response = await AllWarmupServersApi(
          index,
          searchQuery === "" ? null : searchQuery,
          filterValue === "" ? null : filterValue
        );
        console.log(response.data);
        setWarmups(response.data.results);
        setIsLoading(false);
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
        setIsLoading(false);
      }
    };
    fetchWarmups();
  }, [filterValue, searchQuery, currentPage]);

  function goToCreateWarmup() {
    router.push(routes.NEW_WARM_UP);
  }

  // if (!warmups || warmups.length === 0) {
  //   return (
  //     <EmptyListPlaceholder
  //       title="Everything you need to warm up your email"
  //       ctaLabel="Add Warm-Up"
  //       ctaAction={goToCreateWarmup}
  //     />
  //   );
  // }

  const handleDeleteRows = async () => {
    try {
      setIsLoading(true);
      const warmupIds = selectedRows.map((row) => row);
      const data = JSON.stringify({ warmupIds });
      console.log(data);
      const response = await DeleteWarmupApi(data);
      console.log(response.data);
      setIsLoading(false);
      setSelectedRows([]);
      setSelectAll(false);
      showSuccessToast("Warmup deleted successfully");
      setShowDeleteModal(false);
      const fetchWarmups = async () => {
        setIsLoading(true);
        try {
          const response = await AllWarmupServersApi(index);
          console.log(response.data);
          setWarmups(response.data.results);
          setIsLoading(false);
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
          setIsLoading(false);
        }
      };

      fetchWarmups();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      showErrorToast("Error deleting warmup");
    }
  };

  // handlePause function update
  const handlePause = async () => {
    try {
      setIsLoading(true);
      const warmupIds = selectedRows.map((row) => row);
      const data = {
        warmupIds: warmupIds,
        state: "pause",
      };
      const response = await UpdateWarmupApi(data);
      console.log(response.data);
      setIsLoading(false);
      setSelectedRows([]);
      setSelectAll(false);
      showSuccessToast("Warmup paused successfully");

      const fetchWarmups = async () => {
        setIsLoading(true);
        try {
          const response = await AllWarmupServersApi(index);
          console.log(response.data);
          setWarmups(response.data.results);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
      };

      fetchWarmups();
    } catch (error: any) {
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
  };
  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const handleResume = async () => {
    try {
      setIsLoading(true);
      const warmupIds = selectedRows.map((row) => row);
      const data = {
        warmupIds: warmupIds,
        state: "resume",
      };
      const response = await UpdateWarmupApi(data);
      console.log(response.data);
      setIsLoading(false);
      setSelectedRows([]);
      setSelectAll(false);
      showSuccessToast("Warmup resumed successfully");
      const fetchWarmups = async () => {
        setIsLoading(true);
        try {
          const response = await AllWarmupServersApi(index);
          console.log(response.data);
          setWarmups(response.data.results);
          setIsLoading(false);
        } catch (error: any) {
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
      };

      fetchWarmups();
    } catch (error: any) {
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
  };
  function handlePageChange(isprev: boolean) {
    if (Number(currentPage) === 0 && isprev) {
      return `/warm-ups?page=${currentPage}`;
    }
    if (isprev) {
      `/warm-ups?page=${Number(currentPage) - 30}`;
    }
    return `/warm-ups?page=${Number(currentPage) + 30}`;
  }

  // Method to handle individual row selection

  const handleRowSelect = (id: string) => {
    const isSelected = selectedRows.includes(id);
    let updatedSelectedRows: string[];

    if (isSelected) {
      updatedSelectedRows = selectedRows.filter((rowId) => rowId !== id);
    } else {
      updatedSelectedRows = [...selectedRows, id];
    }

    setSelectedRows(updatedSelectedRows);

    // Check if all rows are selected after row selection/deselection
    setSelectAll(updatedSelectedRows.length === warmups.length);
  };

  // Method to handle 'Select All' checkbox
  const handleSelectAll = () => {
    const newSelectedRows = selectAll ? [] : warmups.map((row) => row._id);
    setSelectedRows(newSelectedRows);
    setSelectAll(!selectAll);
  };

  return (
    <RequireAuth>
      <section className="flex w-full h-full overflow-x-hidden">
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
        {isEditDragNDropOpen && (
          <div className="absolute w-full z-50 inset-0 overflow-y-auto flex items-center justify-center">
            <ViewAllModal onClose={setIsEditDragNDropOpen} />
          </div>
        )}
        {
          // delete confirmation modal
          showDeleteModal && (
            <div className="absolute w-full z-50 inset-0 overflow-y-auto flex items-center justify-center">
              <div className="bg-white p-10 rounded shadow-lg text-center">
                <h2 className="mb-10">Are you sure you want to delete?</h2>
                <div className="flex justify-center">
                  <button
                    onClick={handleDeleteRows}
                    className="w-fit bg-[#dd2222] px-3 py-1 disabled:opacity-20 rounded-md text-white"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={toggleDeleteModal}
                    className="w-fit bg-gray-800 px-3 py-1 disabled:opacity-20 rounded-md text-white ml-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )
        }
        <div className="flex flex-col w-full h-full  border-x-[0.5px] text-sm">
          {/* action buttons */}
          <div className="flex justify-between items-center ">
            <div className="w-full flex p-2">
              <button
                className="flex items-center w-fit bg-[#dd2222] px-3 py-2 text-base disabled:opacity-20 rounded-md text-white"
                onClick={toggleDeleteModal}
                disabled={selectedRows.length === 0}
                data-tooltip-id="Delete"
              >
                <DeleteIcon />
                <Tooltip id="Delete" place="top" content="Delete" />
              </button>

              {/* pause */}
              <button
                className="w-fit bg-[#FFFF00] px-3 py-2 text-base disabled:opacity-20 rounded-md text-black ml-2"
                disabled={selectedRows.length === 0}
                onClick={handlePause}
                data-tooltip-id="Pause"
              >
                <PauseIcon />
                <Tooltip id="Pause" place="top" content="Pause" />
              </button>
              {/* resume */}
              <button
                className="w-fit bg-[#28B446] px-3 py-2 text-base disabled:opacity-20 rounded-md text-white ml-2"
                disabled={selectedRows.length === 0}
                onClick={handleResume}
                data-tooltip-id="Resume"
              >
                <ResumeIcon />
                <Tooltip id="Resume" place="top" content="Resume" />
              </button>
            </div>
            {/* select input */}
            <div className="w-full justify-center gap-3 items-center mr-3 flex p-2">
              <SelectInput
                value={filterValue}
                onChange={(selectedValue) =>
                  setFilterValue((selectedValue || "").toLowerCase().trim())
                }
                placeholder="Filter"
                options={[
                  { value: null, text: "All" },
                  { value: "running", text: "Running" },
                  { value: "completed", text: "Completed" },
                  { value: "failed", text: "Failed" },
                  { value: "notStarted", text: "Not Started" },
                  { value: "paused", text: "Paused" },
                ]}
              />
              <Search
                placeholder={"Search Emails"}
                onChange={(value) => setSearchQuery(value)}
                hideFlare={true}
              />
            </div>
          </div>
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
          <div className="flex flex-col w-full h-full overflow-x-auto overflow-y-visible">
            <div className="flex flex-col w-full min-w-[60rem]">
              <div className="grid grid-cols-7  p-4 lg:px-8 border-b-[0.5px] text-left justify-start">
                <div className="flex justify-start">
                  <button
                    onClick={handleSelectAll}
                    className={`custom-checkbox ${selectAll ? "checked" : ""}`}
                  >
                    <span className="checkmark border-2 rounded-sm">
                      {selectAll && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 50 50"
                          style={{
                            filter:
                              "drop-shadow(0px 0px 2px rgba(0, 0, 0, .7))",
                          }}
                        >
                          {/* Adjust the properties of the checkmark */}
                          <polyline
                            points="10,25 20,35 40,15"
                            stroke="#fff"
                            strokeWidth="4"
                            fill="none"
                          />
                        </svg>
                      )}
                    </span>
                  </button>
                </div>
                <div className="flex justify-start text-gray-800">Name</div>
                <div className="flex justify-start text-gray-800">Status</div>
                <div className="flex justify-start text-gray-800">
                  Emails Sent
                </div>
                <div className="flex justify-start text-gray-800">
                  CreatedAt
                </div>
                <div className="flex justify-start text-gray-800">MaxDays</div>
                <div className="flex justify-start text-gray-800">Actions</div>
              </div>
              {warmups.length === 0 ? (
                // warmups.length === 0
                <div className="w-full h-full flex justify-center items-center">
                  <div className="flex flex-col gap-4 justify-center items-center">
                    <div className="mt-10">
                      <NotFound />
                    </div>
                    <h2 className="text-gray-800 text-2xl text-center font-medium">
                      Warmup not found
                    </h2>
                    <p className="text-gray-500 text-sm text-center">
                      We couldn't find Email that match your search. Please try
                      using <br />
                      different, fewer filters or typing another search request.
                    </p>
                  </div>
                </div>
              ) : (
                warmups.map((warmup) => (
                  <div
                    className="grid grid-cols-7 p-4 lg:px-8 border-b-[0.5px]"
                    key={warmup._id}
                  >
                    <div className="flex  justify-start w-full">
                      <button
                        className={`custom-checkbox ${
                          selectedRows.includes(warmup._id) ? "checked" : ""
                        }`}
                        onClick={() => handleRowSelect(warmup._id)}
                      >
                        <span className="checkmark border-2 rounded-sm">
                          {selectedRows.includes(warmup._id) && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 50 50"
                              style={{
                                filter:
                                  "drop-shadow(0px 0px 2px rgba(0, 0, 0, .7))",
                              }}
                            >
                              <polyline
                                points="10,25 20,35 40,15"
                                stroke="#fff"
                                strokeWidth="4"
                                fill="none"
                              />
                            </svg>
                          )}
                        </span>
                      </button>

                      {/* <input
                      type="checkbox"
                      key={warmup._id}
                      onChange={() => handleRowSelect(warmup._id)}
                    checked={selectedRows.includes(warmup._id)}
                    /> */}
                    </div>
                    <div className="flex text-left lg:pr-2 break-words">
                      {warmup.name}
                    </div>
                    <div className="flex justify-start items-center w-full mx-auto gap-1.5">
                      <div className="w-4 h-4">
                        {warmup.state === "notStarted" ? (
                          <CheckYellow />
                        ) : warmup.state === "running" ? (
                          <CheckGreen />
                        ) : warmup.state === "completed" ? (
                          <CheckGreen />
                        ) : warmup.state === "failed" ? (
                          <CheckRed />
                        ) : (
                          <CheckYellow />
                        )}
                      </div>
                      <p>{warmup.state}</p>
                    </div>
                    <div className="flex items-center justify-start w-full">
                      {warmup.totalAddressesMailed}
                    </div>
                    <div className="flex items-center justify-start mx-auto w-full">
                      {
                        // warmup.createdAt
                        formatDateToDDMMYYYY(warmup.createdAt)
                      }
                    </div>
                    <div className="flex items-center justify-start w-full">
                      {warmup.maxDays}
                    </div>
                    <div className="flex items-center justify-start text-center w-full">
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(warmup._id)}
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
                        {dropdownStates.get(warmup._id) && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 z-10 w-48 py-2 mt-2 bg-white rounded-md shadow-xl"
                          >
                            {/* Dropdown content */}
                            <button
                              onClick={handleEditModal(warmup._id)}
                              className="block px-4 py-2 text-gray-800 hover:bg-indigo-500"
                              style={{ bottom: "auto" }}
                            >
                              View Details
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </RequireAuth>
  );
};

export default WarmUp;
