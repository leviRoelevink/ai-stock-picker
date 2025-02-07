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
    <form onSubmit={(e) => e.preventDefault()} className="text-center max-w-xs" >
      <p>Add up to 3 stock tickers below to get a super accurate stock predictions report</p>
      <div className="inline-block my-4 border-2 border-black">
        <input type="text" value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="AAPL" className="pl-2" />
        <button type="submit" onClick={handleClick} className="border-l-2 border-black py-2 px-4 font-black text-2xl">+</button>
      </div>
    </form>
  );
}

function TickerList({ tickers }) {
  return (
    <div className="text-center max-w-xs mb-4">
      {tickers.length === 0 ? (
        <p>Your tickers will appear here...</p>
      ) : (
        <ul>
          {tickers.map((ticker) =>
            <li key={ticker}>{ticker}</li>
          )}
        </ul>
      )}
    </div>
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
      <button onClick={handleClick} disabled={tickers.length === 0} className={`w-full cursor-pointer px-6 py-4 border-2 border-black bg-green-300 font-semibold text-lg ${tickers.length === 0 ? "opacity-70" : ""}`}>GENERATE REPORT</button>
      {errorMessage !== '' && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}

function TickerPickerTable() {
  const [tickers, setTickers] = useState([]);
  const [report, setReport] = useState('');

  return (
    report !== '' ? (
      <p className="text-center max-w-sm">{report}</p>
    ) : (
      <div className="flex flex-col items-center">
        <TickerInput tickers={tickers} onTickerChange={setTickers} />
        <TickerList tickers={tickers} />
        <GenerateReportButton tickers={tickers} onReportGenerated={setReport} />
      </div>
    )
  );
}

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center h-screen w-full text-lg">
      <TickerPickerTable />
    </main>
  );
}