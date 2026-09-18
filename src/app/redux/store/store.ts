import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "../features/authSlice/loginSlice";
import registerSlice from "../features/authSlice/registerSlice";
import adminReducer from "../features/adminSlice/adminSlice"; 
import filmsSlice from "../features/apiSlice/apiSlice";

export const store = configureStore({
  reducer: {
    films: filmsSlice,
    auth: loginSlice,
    register: registerSlice,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;