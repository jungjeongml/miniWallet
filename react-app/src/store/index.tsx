import { configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import accountSlice from "./accountSlice";
import { combineReducers } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { BalanceSlice } from "./balanceSlice";

const reducers = combineReducers({
  account: accountSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["account"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
export type RootState = ReturnType<typeof reducers>;
export default store;
