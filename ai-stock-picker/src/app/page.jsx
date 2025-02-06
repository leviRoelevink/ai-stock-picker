'use client';
import { useState } from 'react';

function TickerInput({ tickers, onTickerChange }) {
  const [ticker, setTicker] = useState('');

  function handleClick() {
    const isValidTicker = ticker.length >= 2 && ticker.length <= 4 && !tickers.includes(ticker);
    if (!isValidTicker) {
      alert(ticker.length < 2 || ticker.length > 4 ? 'Ticker must be between 2 and 4 characters' : 'Ticker already added');
      setTicker('');
      return;
    }

    onTickerChange([...tickers, ticker]);
    setTicker('');
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} >
      <p>Add up to 3 stock tickers below to get a super accurate stock predictions report👇</p>
      <input type="text" value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="AAPL" />
      <button type="submit" onClick={handleClick}>+</button>
    </form>
  );
}

function TickerList({ tickers }) {
  return (
    <>
      {tickers.length === 0 ? (
        <p>Your tickers will appear here...</p>
      ) : (
        <ul>
          {tickers.map((ticker) =>
            <li key={ticker}>{ticker}</li>
          )}
        </ul>
      )}
    </>
  );
}

function GenerateReportButton() {
  return (
    <button>Generate Report</button>
  );
}

function TickerPickerTable() {
  const [tickers, setTickers] = useState([]);

  return (
    <>
      <TickerInput tickers={tickers} onTickerChange={setTickers} />
      <TickerList tickers={tickers} />
      <GenerateReportButton tickers={tickers} />
    </>
  );
}

export default function Page() {
  return <TickerPickerTable />;
}