import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "../features/bank/transactionSlice";

const store = configureStore({
  reducer: {
    transaction: transactionReducer,
  },
});
export default store;
