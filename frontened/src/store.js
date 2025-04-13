import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import authReducer from "./services/authSlice";
import linksReducer from "./services/linkSlice";
import homeReducer from "./services/homeSlice"; // Import the new homeSlice

// Config for persisting Redux state
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["links"], // Persist only the 'links' slice
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer, // Authentication state (not persisted)
  links: linksReducer, // Links state (persisted)
  home: homeReducer, // Home state (not persisted)
});

// Persist the links reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

// Create persistor
export const persistor = persistStore(store);
