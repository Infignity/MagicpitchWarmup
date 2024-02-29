// import { createSlice } from "@reduxjs/toolkit"
// import { RootState } from "../store"
// import { FormMode, MailServer } from "@/app/types"
// import { mode } from "@/app/constants"

// const initialState: {
//     selectedMailServer: null | MailServer,
//     isOpenServerForm: boolean,
//     serverFormMode: FormMode,
//     markedMailServerIDs: string[]
// } = {
//         selectedMailServer: null,
//         isOpenServerForm: false,
//         serverFormMode: mode.NEW,
//         markedMailServerIDs: []
//     }

// const mailServersSlice = createSlice({
//     name: "mailServers",
//     initialState,
//     reducers: {
//         setSelectedMailServer: (state, action) => {
//             state.selectedMailServer = action.payload
//         },
//         clearSelectedMailServer: (state) => {
//             state.selectedMailServer = null
//         }, 
//         openServerForm(state, action){
//             state.isOpenServerForm = true
//             state.serverFormMode = action.payload
//         },
//         closeServerForm(state){
//             state.isOpenServerForm = false
//         },
//         toggleMarkForDelete(state, action){
//             if (state.markedMailServerIDs.includes(action.payload)){
//                 state.markedMailServerIDs = state.markedMailServerIDs.filter(item => item !== action.payload)
//             }else{
//                 state.markedMailServerIDs.push(action.payload)
//             }
//         },
//         clearMarkedMailServerIds(state){
//             state.markedMailServerIDs = []
//         }
//     }
// })

// export const { 
//     setSelectedMailServer, 
//     openServerForm, 
//     closeServerForm, 
//     toggleMarkForDelete,
//     clearMarkedMailServerIds,
//     clearSelectedMailServer
// } = mailServersSlice.actions
// export default mailServersSlice.reducer

// export function getSelectedMailServer(state: RootState): MailServer | null{
//     return state.mailServers.selectedMailServer
// }

// export function getIsOpenServerForm(state: RootState){
//     return state.mailServers.isOpenServerForm
// }

// export function getServerFormMode(state: RootState): FormMode{
//     return state.mailServers.serverFormMode
// }

// export function getMarkedMailServerIDs(state: RootState){
//     return state.mailServers.markedMailServerIDs
// }
