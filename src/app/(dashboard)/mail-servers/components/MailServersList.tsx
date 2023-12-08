import Link from "next/link";
import { useEffect, useState, useRef } from "react";
// import { IconContext } from "react-icons";
// import { BsX as XMark } from "react-icons/bs";
// import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { formatDateToDDMMYYYY } from "../../email-lists/components/formatdate";
import EditServerForm from "./editServerForm";
export default function MailServersList({
  allMailServers,
  setAllMailServers,
  handleRowSelect,
  handleSelectAll,
  selectedRows,
  selectAll,
}: {
  allMailServers: any[];
  setAllMailServers: React.Dispatch<React.SetStateAction<any[]>>;
  handleRowSelect: (rowId: number) => void; // Update the parameter type to number
  handleSelectAll: () => void;
  selectedRows: any[];
  selectAll: boolean;
}) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [dropdownStates, setDropdownStates] = useState<Map<number, boolean>>(
    new Map()
  );
  const [isEditDragNDropOpen, setIsEditDragNDropOpen] = useState(false);

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
    if (dropdownId === null) {
      // handle the case when dropdownId is null
      return;
    }
  
    const newDropdownStates = new Map(dropdownStates);
    newDropdownStates.set(dropdownId, !newDropdownStates.get(dropdownId));
    setDropdownStates(newDropdownStates);
    console.log(dropdownId);
  };
  const handleEditModal = (rowId: any) => () => {
    localStorage.setItem("rowId", rowId)
    // Find the mail server object corresponding to the rowId
    const selectedMailServer = allMailServers.find(
      (server) => server._id === rowId
    );

    // Check if the selectedMailServer is found
    if (selectedMailServer) {
      // Save the selected object to localStorage
      console.log(selectedMailServer);
      localStorage.setItem(
        "selectedMailServer",
        JSON.stringify(selectedMailServer)
      );
      setIsEditDragNDropOpen(true);
    } else {
      console.error("Mail server not found for the given rowId:", rowId);
    }
  };

  return (
    <div className="flex flex-col w-full min-w-[60rem]">
      {isEditDragNDropOpen && (
        <section className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50">
          <EditServerForm
            setIsEditDragNDropOpen={setIsEditDragNDropOpen}
            setAllMailServers={setAllMailServers}
          />
        </section>
      )}
      <table className=" border-collapse w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">
              <input
                type="checkbox"
                className="form-checkbox rounded-sm"
                onChange={handleSelectAll}
                checked={selectAll}
              />
            </th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Last Modified</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {allMailServers.length === 0 && (
            <tr className="border-b border-gray-200">
              <td colSpan={5} className="text-center text-gray-500 py-4">
                No Mail Servers Found
              </td>
            </tr>
          )}
          {allMailServers.map((mailServer: any) => (
            <tr key={mailServer._id} className="border-b border-gray-200">
              <td className="px-4 py-2 flex items-center justify-center">
                <input
                  type="checkbox"
                  className="form-checkbox rounded-sm"
                  onChange={() => handleRowSelect(mailServer._id)} // Use mailServer._id instead of mailServer.id
                  checked={selectedRows.includes(mailServer._id)} // Use mailServer._id instead of mailServer.id
                />
              </td>
              <td className="px-4 py-2 text-center">
                <a className="hover:underline">
                  {mailServer.name}
                </a>
              </td>
              <td className="px-4 py-2 text-center">
                {formatDateToDDMMYYYY(mailServer.addedOn)}
              </td>
              <td className="px-4 py-2 text-center">
                {formatDateToDDMMYYYY(mailServer.lastModified)}
              </td>
              <td className="px-4 py-2 text-center flex items-center justify-center">
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(mailServer._id)}
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
                  {dropdownStates.get(mailServer._id) && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 z-10 w-48 py-2 mt-2 bg-white rounded-md shadow-xl"
                    >
                      {/* Dropdown content */}
                      <button
                        onClick={handleEditModal(mailServer._id)}
                        className="block px-4 py-2 text-gray-800 hover:bg-indigo-500"
                      >
                        View Contents
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
  );
}
