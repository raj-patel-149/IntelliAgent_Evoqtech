import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/apiSlice";
import { authApiSlice } from "./features/authApiSlice";
import { userApiSlice } from "./features/userApiSlice";
import { caseApiSlice } from "./features/caseApiSlice";
import { skillApi } from "./features/skillApiSlice";
import { priceApi } from "./features/priceApiSlice";
import serviceReducer from "./features/serviceSlice";
import { notificationApiSlice } from "./features/notificationSlice";
import { bookingApi } from "@/features/bookingApiSlice";
import { employeeApi } from "./features/employeeApiSlice"; // ✅ Ensure correct import
import { teamServiceApi } from "./features/teamServiceApiSlice";
// import { teamTemplateApi } from "./features/teamTemplateApiSlice";
import { teamTemplateApiSlice } from "./features/teamTemplateApiSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["service"],
};

const persistedServiceReducer = persistReducer(persistConfig, serviceReducer);

export const store = configureStore({
  reducer: {
    service: persistedServiceReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [caseApiSlice.reducerPath]: caseApiSlice.reducer,
    [skillApi.reducerPath]: skillApi.reducer,
    [notificationApiSlice.reducerPath]: notificationApiSlice.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer, // ✅ Ensure no duplicate keys
    [teamServiceApi.reducerPath]: teamServiceApi.reducer, // ✅ Ensure no duplicate keys
    [priceApi.reducerPath]: priceApi.reducer,
    [teamTemplateApiSlice.reducerPath]: teamTemplateApiSlice.reducer, // ✅ Ensure no duplicate keys
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      apiSlice.middleware,
      authApiSlice.middleware,
      userApiSlice.middleware,
      caseApiSlice.middleware,
      skillApi.middleware,
      notificationApiSlice.middleware,
      bookingApi.middleware,
      employeeApi.middleware,
      teamServiceApi.middleware,
      priceApi.middleware,
      teamTemplateApiSlice.middleware
    ),
});

export const persistor = persistStore(store);
