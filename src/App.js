import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  return (
    <div className="box">
      <Header />
      <Main />
    </div>
  );
}
function Header() {
  return (
    <div>
      <h1 className="heading">CURRENCY CONVERTER</h1>
    </div>
  );
}
function Main() {
  const [data, setData] = useState("");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("CAD");
  const [input, setInput] = useState(Number(1));
  const [output, setOutput] = useState("");
  const [checkAmount, setCheckAmount] = useState("");
  const [error, setError] = useState("");
  const [currency, setCurrency] = useState([]);

  useEffect(
    function () {
      async function convertCurrency() {
        if (from === to) {
          setCheckAmount("Enter Different currencies to convert");
          setInput(0);
          setOutput(1);
          return;
        }
        try {
          const res = await fetch(
            `https://api.frankfurter.app/latest?base=${from}&symbols=${to}`
          );

          if (!res.ok) throw new Error("Something went wrong");

          const data = await res.json();
          setData(data);
        } catch (err) {
          console.log(err.name);
          setError(err.message);
        }
      }

      convertCurrency();
    },
    [from, to, input]
  );
  useEffect(function () {
    try {
      async function fetchCurrency() {
        const res = await fetch(`https://api.frankfurter.app/currencies`);

        if (!res.ok) throw error("Something went wrong");

        const data = await res.json();

        const country = Object.entries(data);
        setCurrency(country);
      }
      fetchCurrency();
    } catch (err) {
      setError(err.message);
    }
  }, []);
  console.log(currency);
  useEffect(
    function () {
      input < 0 ? setCheckAmount("Enter valid Amount") : setCheckAmount("");
      if (to === from) setCheckAmount("Enter different currencies");
      if (data && input >= 0) {
        const exchangeRate = data?.rates?.[to];

        if (exchangeRate) {
          const converted = (input * exchangeRate).toFixed(3);
          setOutput(converted);
        }
      }
    },
    [data]
  );
  useEffect(
    function () {
      setInput(1);
    },
    [to, from]
  );
  return (
    <div className="main">
      {error ? (
        <div className="error">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="input-fields">
            <label for="input" className="label">
              {" "}
              From
            </label>
            <span className="span">:</span>{" "}
            <select
              className="input"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              {currency?.map((curr, i) => (
                <option key={i}>{curr[0]}</option>
              ))}
            </select>
          </div>
          <div className="input-fields">
            <label for="inputTO" className="label">
              {" "}
              To
            </label>
            <span className="SP"></span>
            <span className="span">:</span>{" "}
            <select
              className="input"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              {currency?.map((curr, i) => (
                <option key={i}>{curr[0]}</option>
              ))}
            </select>
          </div>

          <div className="conversion">
            <div className="amount">
              <label for="inputTO" className="label">
                {" "}
                Input
              </label>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type="number"
                id="inputTO"
                className="input"
              />
            </div>
            <div className="amount">
              <label for="inputTO" className="label">
                {" "}
                Output
              </label>

              <input
                disabled
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                type="number"
                id="inputTO"
                className="input"
              />
            </div>
          </div>

          <div className="validity">
            {checkAmount ? <p>{checkAmount}</p> : ""}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
