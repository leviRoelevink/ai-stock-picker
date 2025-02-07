'use client';
import { useState } from 'react';
import { generateReport, fetchStocksData } from '@/app/lib/actions';

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

function GenerateReportButton({ tickers, onReportGenerated }) {
  const [errorMessage, setErrorMessage] = useState('');

  async function handleClick() {
    try {
      const stocksData = await fetchStocksData(tickers, new Date(), 3);
      const report = await generateReport(stocksData);
      onReportGenerated(report);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  }

  return (
    <div>
      <button onClick={handleClick}>Generate Report</button>
      {errorMessage !== '' && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}

function TickerPickerTable() {
  const [tickers, setTickers] = useState([]);
  const [report, setReport] = useState('');

  return (
    report !== '' ? (
      <>{report}</>
    ) : (
      <>
        <TickerInput tickers={tickers} onTickerChange={setTickers} />
        <TickerList tickers={tickers} />
        <GenerateReportButton tickers={tickers} onReportGenerated={setReport} />
      </>
    )
  );
}

export default function Page() {
  return <TickerPickerTable />;
}