// import { createSlice } from "@reduxjs/toolkit"
// import { RootState } from "../store"

// const initialState: {
//     replyEmails: any[],
//     clientEmails: any[]
// } = {
//         replyEmails: [],
//         clientEmails: []
//     }

// const emailListsSlice = createSlice({
//     name: "emailLists",
//     initialState,
//     reducers: {
//         setClientEmails: (state, action) => {
//             state.clientEmails = action.payload
//         },
//         setReplyEmails: (state, action) => {
//             state.replyEmails = action.payload
//         },
//     }
// })


// export const { setReplyEmails, setClientEmails } = emailListsSlice.actions
// export default emailListsSlice.reducer

// export function selectClientEmails(state: RootState) {
//     return state.emailLists.clientEmails
// }
// export function selectReplyEmails(state: RootState) {
//     return state.emailLists.replyEmails
// }
