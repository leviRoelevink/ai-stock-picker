export default function TickerList({ tickers }) {
    return (
        <div className="text-center max-w-xs mb-4">
            {tickers.length === 0 ? (
                <p>Your tickers will appear here...</p>
            ) : (
                <ul className="flex flex-wrap justify-center">
                    {tickers.map((ticker, index) =>
                        <li key={ticker} className="px-1">
                            {ticker}{index < tickers.length - 1 ? "," : ""}
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}