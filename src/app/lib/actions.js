'use server';
import { getFromToDates } from '@/app/lib/utils';
import OpenAI from 'openai';
import { userContent } from '@/app/lib/outputExamples';

const BASE_URL = 'https://api.polygon.io/v2/aggs/ticker/';
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

export async function fetchStocksData(tickers, endDate, timespan) {
    try {
        const response = await Promise.all(tickers.map(async (ticker) => {
            const url = getRequestURL(ticker, endDate, timespan); // TODO: DRY getFromToDates function is being executed for each ticker 
            return await fetchStockData(url);
        }));

        const stocksData = response.join('');

        return stocksData;
    } catch (error) {
        console.error('error fetching stocks data:', error);
        throw new Error(`Error fetching stocks data: ${error}`);
    }
}

export async function generateReport(stocksData) {
    const data = `${userContent}\n${stocksData}`;

    const messages = [
        {
            role: 'system',
            content: `You are a trading guru. 
            Given data on share prices over the past 3 days, write a report of no more than 150 words describing the stocks performance and recommending whether to buy, hold or sell.
            The advice for each stock should always be on a separate paragraph.
            Use examples provided between ### to set the style and tone of your response.
            `,
        },
        {
            role: 'user',
            content: data,
        },
    ];

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error(`Error generating report: ${error}`);
        throw new Error(`Error generating report: ${error}`);
    }
}