import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { FormMode, MailServer } from "@/app/types"
import { mode } from "@/app/constants"

const initialState: {
    selectedMailServer: null | MailServer,
    isOpenServerForm: boolean,
    serverFormMode: FormMode
} = {
        selectedMailServer: null,
        isOpenServerForm: false,
        serverFormMode: mode.NEW
    }

const mailServersSlice = createSlice({
    name: "mailServers",
    initialState,
    reducers: {
        setSelectedMailServer: (state, action) => {
            state.selectedMailServer = action.payload
        },
        openServerForm(state, action){
            state.isOpenServerForm = true
            state.serverFormMode = action.payload
        },
        closeServerForm(state){
            state.isOpenServerForm = false
        },
    }
})

export const { setSelectedMailServer, openServerForm, closeServerForm } = mailServersSlice.actions
export default mailServersSlice.reducer

export function getSelectedMailServer(state: RootState): MailServer | null{
    return state.mailServers.selectedMailServer
}

export function getIsOpenServerForm(state: RootState){
    return state.mailServers.isOpenServerForm
}

export function getServerFormMode(state: RootState): FormMode{
    return state.mailServers.serverFormMode
}
