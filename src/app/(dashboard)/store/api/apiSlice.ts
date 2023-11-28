// import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
// import { API_BASE, mailServerVerificationType } from "@/app/constants"
// import { AddMailServerResponse, EmailList, MailServer, MailServerSecurity, MailServerVerificationType, NewWarmup, SMTPServerConfig, ServerConfig, UpdateWarmupState, Warmup, WarmupState } from "@/app/types"

// function getHeaders(token: string){
//     return {
//         Authorization: `Bearer ${token}`
//     }
// }

// const apiSlice = createApi({
//     reducerPath: "api",
//     baseQuery: fetchBaseQuery({
//         baseUrl: `${API_BASE}`
//     }),
//     tagTypes: ["MailServers"], 
//     endpoints: (builder) => ({
//         getUser: builder.query({
//             query: ({ token }) => {
//                 return {
//                     url: `/users`,
//                     headers: getHeaders(token)
//                 }
//             }
//         }),

//         // mail servers
//         getMailServers: builder.query<{
//             pageSize: number,
//             index: number, 
//             totalResults: number,
//             results: MailServer[]
//         }, { token: string, index: number }>({
//             query: ({ token, index }) => {
//                 return {
//                     url: `/mailservers?index=${index}`,
//                     headers: getHeaders(token)
//                 }
//             },
//             providesTags: ["MailServers"]
//         }),
//         verifyMailServer: builder.mutation<{
//             verificationStatus: string, message: string, description: string, verificationType: MailServerVerificationType
//         }, { 
//             token: string, config: ServerConfig & { recipientEmail?: string }
//         }>({
//             query: ({ token, config: { hostname, port, email, password, security, verificationType, recipientEmail } }) => {
//                 let body: ServerConfig | SMTPServerConfig

//                 if (verificationType === mailServerVerificationType.smtp){
//                     body = { hostname, port, email, password, security, verificationType, recipientEmail }
//                 }else {
//                     body = { hostname, port, email, password, security, verificationType, }
//                 }

//                 console.log("body: ", body)
//                 return {
//                     url: `/mailservers/verify`,
//                     headers: getHeaders(token),
//                     method: "POST",
//                     body
//                 }
//             }
//         }),
//         addMailServer: builder.mutation<any, { token: string, name: string, imapDetails: ServerConfig, smtpDetails: ServerConfig } >({
//             query: ({ name, imapDetails, smtpDetails, token }) => {
//                 return {
//                     url: `/mailservers`,
//                     headers: getHeaders(token),
//                     method: "POST",
//                     body: {
//                         name, imapDetails, smtpDetails
//                     }
//                 }
//             },
//             invalidatesTags: ["MailServers"]
//         }),
//         updateMailServer: builder.mutation<any, { mailServerId: string, token: string, name: string, imapDetails: ServerConfig, smtpDetails: ServerConfig } >({
//             query: ({ mailServerId,  name, imapDetails, smtpDetails, token }) => {
//                 return {
//                     url: `/mailservers/${mailServerId}`,
//                     headers: getHeaders(token),
//                     method: "PUT",
//                     body: {
//                         name, imapDetails, smtpDetails
//                     }
//                 }
//             },
//             invalidatesTags: ["MailServers"]
//         }),
//         deleteMailServers: builder.mutation<{ message: string, description: string, totalMailserversDeleted: number }, 
//         { mailServerIds: string[], token: string } >({
//             query: ({ mailServerIds,  token }) => {
//                 return {
//                     url: `/mailservers/delete`,
//                     headers: getHeaders(token),
//                     method: "POST",
//                     body: {
//                         mailServerIds
//                     }
//                 }
//             },
//             invalidatesTags: ["MailServers"]
//         }),


//         // email lists
//         getEmailLists: builder.query<{
//             emailLists: EmailList[],
//             totalEmailLists: number
//         }, { token: string }>({
//             query: ({ token }) => {
//                 return {
//                     url: `/email-lists`,
//                     headers: getHeaders(token)
//                 }
//             }
//         }),
//         deleteEmailLists: builder.mutation<{ message: string, description: string, totalEmailListsDeleted: number }, 
//         { emailListIds: string[], token: string } >({
//             query: ({ emailListIds,  token }) => {
//                 return {
//                     url: `/email-lists/delete`,
//                     headers: getHeaders(token),
//                     method: "POST",
//                     body: {
//                        emailListIds 
//                     }
//                 }
//             }
//         }),


//         // warmup
//         getWarmups: builder.query<{
//             pageSize: number,
//             index: number, 
//             totalResults: number,
//             results: Warmup[]
//         }, { token: string, index: number, name?: string, state?: WarmupState }>({
//             query: ({ token, index, name, state }) => {
//                 let url =  `/warmups?index=${index}`
//                 if (name){
//                     url += `&name=${name}`
//                 }
//                 if (state){
//                     url += `&state=${state}`
//                 }
//                 return {
//                     url,
//                     headers: getHeaders(token)
//                 }
//             }
//         }),
//         addWarmup: builder.mutation<{ message: string, description: string, warmup: Warmup }, { newWarmup: NewWarmup, token: string  }>({
//             query: ({ token, newWarmup }) => {
//                 return {
//                     url: `/warmups`,
//                     headers: getHeaders(token),
//                     method: "POST",
//                     body: {
//                         ...newWarmup
//                     }
//                 }
//             }
//         }),
//         updateWarmupState: builder.mutation<{ message: string, description: string, updateCount: number }, 
//         { warmupIds: string[], state: UpdateWarmupState, token: string } >({
//             query: ({  token, warmupIds, state }) => {
//                 return {
//                     url: `/warmups/update-state`,
//                     headers: getHeaders(token),
//                     method: "POST",
//                     body: {
//                         warmupIds, state
//                     }
//                 }
//             }
//         }),
//         deleteWarmups: builder.mutation<{ message: string, description: string, deleteCount: number }, 
//         { warmupIds: string[], token: string } >({
//             query: ({ warmupIds,  token }) => {
//                 return {
//                     url: `/warmups/delete`,
//                     headers: getHeaders(token),
//                     method: "POST",
//                     body: {
//                         warmupIds
//                     }
//                 }
//             }
//         }),
//     })
// })

// export const {
//     useGetMailServersQuery, 
//     useGetUserQuery, 
//     useGetWarmupsQuery, 
//     useAddWarmupMutation, 
//     useGetEmailListsQuery, 
//     useAddMailServerMutation, 
//     useDeleteWarmupsMutation, 
//     useDeleteEmailListsMutation, 
//     useUpdateMailServerMutation, 
//     useVerifyMailServerMutation, 
//     useDeleteMailServersMutation, 
//     useUpdateWarmupStateMutation
// } = apiSlice
// export default apiSlice
