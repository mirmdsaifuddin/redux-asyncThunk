import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const convertCurrency = createAsyncThunk(
  "transaction/convertCurrency",
  async ({ payload, fromCurrency, type }) => {
    // console.log(payload, fromCurrency, type);
    const res = await fetch(
      `https://api.frankfurter.app/latest?amount=${payload}&from=${fromCurrency}&to=INR`
    );
    const data = await res.json();
    const convertedCurrency = data.rates.INR;
    // console.log(convertedCurrency, type);
    return { convertedCurrency, type };
  }
);

const initialState = {
  balance: 0,
  loan: 0,
  purposeLoan: "",
  message: "",
  loading: false,
  error: "",
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    deposit(state, action) {
      state.balance += action.payload;
      state.message = "";
    },
    withdraw(state, action) {
      if (state.balance >= action.payload) {
        state.balance -= action.payload;
        state.message = "";
      } else {
        state.message = "Withdraw amount is bigger than the balance";
      }
    },
    requestLoan(state, action) {
      if (state.loan === 0) {
        state.balance += action.payload.amount;
        state.loan = action.payload.amount;
        state.purposeLoan = action.payload.purpose;
        state.message = "";
      }
    },
    payLoan(state) {
      if (state.balance >= state.loan) {
        state.balance -= state.loan;
        state.loan = 0;
        state.purposeLoan = "";
        state.message = "";
      }
    },
    closeAccount(state) {
      if (state.loan === 0 && state.balance === 0) {
        return initialState;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(convertCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(convertCurrency.fulfilled, (state, action) => {
        const { convertedCurrency, type } = action.payload;
        if (type === "deposit") {
          state.balance += convertedCurrency;
          state.loading = false;
          state.error = null;
        } else if (type === "withdraw") {
          if (state.balance >= convertedCurrency) {
            state.balance -= convertedCurrency;
            state.loading = false;
            state.error = false;
          } else {
            state.message = "Withdraw amount is larger than the balance";
          }
        }
      })
      .addCase(convertCurrency.rejected, (state, action) => {
        state.error = action.error.message;
        state.message = action.error.message;
        state.loading = false;
      });
  },
});
export const { deposit, withdraw, requestLoan, payLoan, closeAccount } =
  transactionSlice.actions;

export default transactionSlice.reducer;
