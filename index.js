import 'dotenv/config';
import OpenAI from 'openai';
import { getFromToDates } from './utils/dates.js';

const BASE_URL = 'https://api.polygon.io/v2/aggs/ticker/';
const tickers = ['AAPL', 'NVDA', 'AMZN'];
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

function getRequestURL(ticker, endDate, timespan) {
    const [from, to] = getFromToDates(endDate, timespan);
    return `${BASE_URL}${ticker}/range/${timespan}/day/${from}/${to}`;
}

async function fetchStockData(url) {
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

async function fetchStocksData(tickers, endDate, timespan) {
    try {
        const stocksData = await Promise.all(tickers.map(async (ticker) => {
            const url = getRequestURL(ticker, endDate, timespan); // TODO: DRY getFromToDates function is being executed for each ticker 
            return await fetchStockData(url);
        }));

        return stocksData;
    } catch (error) {
        console.error('error fetching stocks data:', error);
        throw new Error(`Error fetching stocks data: ${error}`);
    }
}

try {
    const stocksData = await fetchStocksData(tickers, new Date(), 3);
    const userContent = `
    ###
    Ayo wagone, I am sir Big Smart Stock Broker here to give ya some advice to make bank.
    <your report>
    Good luck brother, may the force be with you!
    ###

    ###
    Whats good my brother, I am like Leonardo DiCaprio in the Wolf of Wallstreet. Great movie, you ever seen it? Anyway, I got some advice for you to make stonksss!
    <your report>
    Go all in dude this is a for sure thang!!
    ###

    ${stocksData.join('')}`;
    const report = await generateReport(userContent);
    console.log(report) || 'No response received from GPT';
} catch (error) {
    console.error(`Error generating report / joining stock data: ${error}`);
}

async function generateReport(data) {
    const report = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages:
            [
                {
                    role: 'system',
                    content: 'You will be asked to generate a report on wether to buy or sell shares of certain stocks based on data about those stocks from the past 3 days. Answer as if you were an experienced stock broker. Your answer should be limited to 150 words. Use examples provided between ### to set the style and tone of your response.',
                },
                {
                    role: 'user',
                    content: data,
                },
            ],
        temperature: 1.1
    });

    return report.choices[0].message.content;
}