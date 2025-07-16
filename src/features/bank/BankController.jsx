import { useDispatch, useSelector } from "react-redux";
import {
  deposit,
  payLoan,
  requestLoan,
  withdraw,
  closeAccount,
  convertCurrency,
} from "./transactionSlice";
import { useState } from "react";

function BankController() {
  const [amount, setAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [fromCurrency, setFromCurrency] = useState("INR");
  const { balance, loan, purposeLoan, message, loading } = useSelector(
    (store) => store.transaction
  );
  //console.log(purposeLoan);

  const dispatch = useDispatch();

  function handleDeposit() {
    if (fromCurrency === "INR") {
      dispatch(deposit(Number(amount)));
    } else {
      dispatch(
        convertCurrency({
          type: "deposit",
          payload: Number(amount),
          fromCurrency,
        })
      );
      setAmount("");
    }
  }
  function handleWithdraw() {
    if (fromCurrency === "INR") {
      dispatch(withdraw(Number(withdrawAmount)));
    } else {
      dispatch(
        convertCurrency({
          type: "withdraw",
          payload: Number(withdrawAmount),
          fromCurrency,
        })
      );
      setWithdrawAmount("");
    }
  }
  function handleRequestLoan() {
    dispatch(requestLoan({ amount: 5000, purpose: purpose }));
    setPurpose("");
  }
  function handlePayLoan() {
    dispatch(payLoan());
  }
  function handleCloseAccount() {
    dispatch(closeAccount());
  }
  return (
    <div className="container">
      <h1>Bank Account</h1>
      <h3>
        💰 Balance (INR) ₹: {!loading ? `${balance.toFixed(2)}` : "Loading..."}
      </h3>
      <h3>🏦 Loan: {loan}</h3>
      <h4>📌 Purpose: {purposeLoan}</h4>
      <h5 style={{ color: "red" }}>{message}</h5>
      <select onChange={(e) => setFromCurrency(e.target.value)}>
        <option value="INR">INR</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="GBP">GBP</option>
        <option value="CAD">CAD</option>
      </select>

      <p>
        <input
          type="text"
          placeholder="Deposit amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleDeposit} disabled={loading}>
          Deposit
        </button>
      </p>

      <p>
        <input
          type="text"
          placeholder="Withdraw amount"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
        />
        <button onClick={handleWithdraw} disabled={loading}>
          Withdraw
        </button>
      </p>

      <p>
        <input
          type="text"
          placeholder="Purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        />
        <button onClick={handleRequestLoan}>Request loan of 5000</button>
      </p>

      <p>
        <button onClick={handlePayLoan}>Pay Loan</button>
      </p>

      <p>
        <button onClick={handleCloseAccount}>Close Account</button>
      </p>
    </div>
  );
}

export default BankController;
