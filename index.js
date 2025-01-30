import 'dotenv/config';
import OpenAI from 'openai';
import { getFromToDates } from './utils/dates.js';

/** 
 * Challenge:
 * 1. Use the OpenAI API to generate a report advising 
 * on whether to buy or sell the shares based on the data 
 * that comes in as a parameter.
 * 
 * 🎁 See hint.md for help!
 * 
 * 🏆 Bonus points: use a try catch to handle errors.
 * **/

const BASE_URL = 'https://api.polygon.io/v2/aggs/ticker/';

function requestURL(ticker, startDate, timespan) {
    const [from, to] = getFromToDates(startDate, timespan);
    return `${BASE_URL}${ticker}/range/${timespan}/day/${from}/${to}`;
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const tickers = ['AAPL', 'NVDA', 'AMZN'];

async function requestStockData(url) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.POLYGON_API_KEY}`,
        },
    });

    if (!response.ok) {
        console.error(`Failed to fetch stock data: ${response.status} ${response.statusText}`);
        throw new Error(`Failed to fetch stock data: ${response.status} ${response.statusText}`);
    } 

    return response.text();
}

async function fetchStocksData(tickers, startDate, timespan) {
    try {
        const stocksData = await Promise.all(tickers.map(async (ticker) => {
            const url = requestURL(ticker, startDate, timespan); // TODO: DRY getFromToDates function is being executed for each ticker 
            console.log(`url of ${ticker}: ${url}`);
            return await requestStockData(url);
        }));

        return stocksData;
    } catch (error) {
        console.error('error fetching stocks data:', error);
        // TODO: display error to user
    }
}

const stocksData = await fetchStocksData(tickers, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 3);
console.log(stocksData);

// const stockData = await requestStockData(tickers[0], new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 3);


// const response = await openai.chat.completions.create({
//     model: 'gpt-4o-mini',
//     messages:
//         [
//             {
//                 role: 'system',
//                 content: 'You will be asked to explain specific physics topics to different kinds of audiences. Answer as if you were an expert physicist. Always give answers appropriate for the kind of audience that asked you the question.',
//             },
//             {
//                 role: 'user',
//                 content: 'stock data',
//             },
//         ],
// });

// console.log(response.choices[0].message.content);