// import { configureStore } from "@reduxjs/toolkit"
// import sidebarReducer from "./slices/sidebarSlice"
// import mailServersReducer from "./slices/mailServersSlice"
// import warmupsReducer from "./slices/warmupsSlice"
// import emailListsReducer from "./slices/emailListsSlice"
// import apiSlice from "./api/apiSlice"

// const store = configureStore({
//     reducer: {
//         sidebar: sidebarReducer,
//         mailServers: mailServersReducer,
//         warmups: warmupsReducer,
//         emailLists: emailListsReducer,
//         [apiSlice.reducerPath]: apiSlice.reducer
//     },
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware) 
// })

// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch

// export default store
