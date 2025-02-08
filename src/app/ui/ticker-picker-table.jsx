'use client';
import { useState } from 'react';
import { generateReport, fetchStocksData } from '@/app/lib/actions';
import LoadingIcon from '@/app/ui/loading-icon';
import TickerList from '@/app/ui/ticker-list';

function TickerInput({ tickers, onTickerChange }) {
    const [ticker, setTicker] = useState('');

    function handleClick() {
        if (tickers.length >= 3) {
            alert('You can only add up to 3 tickers');
            setTicker('');
            return;
        }

        const isValidTicker = ticker.length >= 2 && ticker.length <= 4 && !tickers.includes(ticker);
        if (!isValidTicker) {
            alert(ticker.length < 2 || ticker.length > 4 ? 'Ticker must be between 2 and 4 characters' : 'Ticker already added');
            setTicker('');
            return;
        }

        onTickerChange([...tickers, ticker.toUpperCase()]); // Update the state with the new ticker
        setTicker('');
    }

    return (
        <form onSubmit={(e) => e.preventDefault()} className="text-center max-w-xs" >
            <p>Add up to 3 stock tickers below to get a super accurate stock predictions report</p>
            <div className="inline-block my-4 border-2 border-black">
                <input type="text" value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="AAPL" className="pl-2 focus:outline-none" />
                <button type="submit" onClick={handleClick} className="border-l-2 border-black py-2 px-4 font-black text-2xl">+</button>
            </div>
        </form>
    );
}

function GenerateReportButton({ tickers, onReportGenerated, onLoadingMessageChange }) {
    const [errorMessage, setErrorMessage] = useState('');

    async function handleClick() {
        try {
            onLoadingMessageChange('Fetching stock data...');
            const stocksData = await fetchStocksData(tickers, new Date(), 3);
            onLoadingMessageChange('Creating report...');
            const report = await generateReport(stocksData);
            onReportGenerated(report);
        } catch (error) {
            console.error(error);
            setErrorMessage(error.message);
        } finally {
            onLoadingMessageChange('');
        }
    }

    return (
        <div>
            <button onClick={handleClick} disabled={tickers.length === 0} className={`w-full cursor-pointer px-6 py-4 border-2 border-black bg-green-300 font-semibold text-lg ${tickers.length === 0 ? "opacity-70" : ""}`}>GENERATE REPORT</button>
            {errorMessage !== '' && <p className="text-red-500">{errorMessage}</p>}
        </div>
    );
}

export default function TickerPickerTable() {
    const [tickers, setTickers] = useState([]);
    const [report, setReport] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('');

    const handleReportGenerated = (newReport) => {
        setReport(newReport);
        setTickers([]); // Reset tickers after report is generated
    };

    return (
        report !== '' ? (
            <p className="text-center max-w-sm">{report}</p>
        ) : loadingMessage !== '' ? (
            <div className="flex flex-col items-center">
                <LoadingIcon className="w-24 h-24" />
                <p className="text-center max-w-sm">{loadingMessage}</p>
            </div>
        ) : (
            <div className="flex flex-col items-center">
                <TickerInput tickers={tickers} onTickerChange={setTickers} />

                <TickerList tickers={tickers} />
                <GenerateReportButton tickers={tickers} onReportGenerated={handleReportGenerated} onLoadingMessageChange={setLoadingMessage} />
            </div>
        )
    );
}