// import { createSlice } from "@reduxjs/toolkit"
// import { RootState } from "../store"

// const initialState = {
//     isOpen: false
// }

// const sidebarSlice = createSlice({
//     name: "sidebar",
//     initialState,
//     reducers: {
//         openSidebar: (state) => {
//             state.isOpen = true
//         },
//         closeSidebar: (state) => {
//             state.isOpen = false
//         },
//         toggleSidebar: (state) => {
//             const isOpen = state.isOpen
//             if (isOpen){
//                 state.isOpen = false
//             }else {
//                 state.isOpen = true
//             }
//         }
//     }
// })


// export const { closeSidebar, openSidebar, toggleSidebar } = sidebarSlice.actions
// export default sidebarSlice.reducer

// export function selectIsSidebarOpen(state: RootState) {
//     return state.sidebar.isOpen
// }
