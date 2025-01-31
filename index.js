import 'dotenv/config';
import OpenAI from 'openai';
import { getFromToDates } from './utils/dates.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

// try {
//     const stocksData = await fetchStocksData(tickers, new Date(), 3);
//     const userContent = `
//     ###
//     OK baby, hold on tight! You are going to haate this! Over the past three days, Tesla (TSLA) shares have plummetted.
//     The stock opened at $223.98 and closed at $202.11 on the third day, with some jumping around in the meantime.
//     This is a great time to buy, baby! But not a great time to sell! But I'm not done! Apple (AAPL) stocks have gone stratospheric!
//     This is a seriously hot stock right now. They opened at $166.38 and closed at $182.89 on day three.
//     So all in all, I would hold on to Tesla shares tight if you already have them - they might bounce right back up and head to the stars!
//     They are volatile stock, so expect the unexpected. For APPL stock, how much do you need the money?
//     Sell now and take the profits or hang on and wait for more!
//     If it were me, I would hang on because this stock is on fire right now!!!
//     Apple are throwing a Wall Street party and y'all invited!
//     ###

//     ###
//     Apple (AAPL) is the supernova in the stock sky – it shot up from $150.22 to a jaw-dropping $175.36 by the close of day three.
//     We’re talking about a stock that’s hotter than a pepper sprout in a chilli cook-off, and it’s showing no signs of cooling down!
//     If you’re sitting on AAPL stock, you might as well be sitting on the throne of Midas.
//     Hold on to it, ride that rocket, and watch the fireworks, because this baby is just getting warmed up!
//     Then there’s Meta (META), the heartthrob with a penchant for drama.
//     It winked at us with an opening of $142.50, but by the end of the thrill ride, it was at $135.90, leaving us a little lovesick.
//     It’s the wild horse of the stock corral, bucking and kicking, ready for a comeback.
//     META is not for the weak-kneed So, sugar, what’s it going to be? For AAPL, my advice is to stay on that gravy train.
//     As for META, keep your spurs on and be ready for the rally.
//     ###

//     ${stocksData.join('')}`;
//     const report = await generateReport(userContent); 
//     console.log(report) || 'No response received from GPT';
// } catch (error) {
//     console.error(`Error generating report / joining stock data: ${error}`);
// }

async function generateReport(data) {
    const messages = [
        {
            role: 'system',
            content: `You are a trading guru. Given data on share prices over the past 3 days, write a report of no more than 150 words describing the stocks performance and recommending whether to buy, hold or sell.
                    Use examples provided between ### to set the style and tone of your response.`,
        },
        {
            role: 'user',
            content: data,
        },
    ];

    const report = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 1.1,
        stop: [
        ],
        presence_penalty,
        frequency_penalty,
    });

    return report.choices[0].message.content;
}

/* Creating a fine tuned model */

// const upload = await uploadTrainingData('trainingdata.jsonl');
// const fineTune = await createFineTuningJob(upload.id);
// const fineTuneStatus = await openai.fineTuning.jobs.retrieve('ftjob-pCBKFQirNa3XpFUdfqlcWCIz');

/* Test our fine-tuned model */

const messages = [
    {
        role: 'user',
        content: "I don't know what to do with my life"
    }
];
async function getResponse() {
    const response = await openai.chat.completions.create({
        model: 'ft:gpt-3.5-turbo-0125:floydbuilds::Avl41f95',
        messages: messages
    });
    return response.choices[0].message.content;
}
console.log(await getResponse());

async function uploadTrainingData(filename) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const datasetPath = path.join(__dirname, filename);
    const dataset = fs.createReadStream(datasetPath);

    const upload = await openai.files.create({
        file: dataset,
        purpose: 'fine-tune'
    });

    while (upload.status !== 'processed') {
        // Wait until upload is done
    }

    return upload;

    // { object: 'file', id: 'file-W1DLLfptox1x58eAjvbU3e', purpose: 'fine-tune', filename: 'trainingdata.jsonl', bytes: 24147, created_at: 1738327639, status: 'processed', status_details: null; }
}

/* Use file ID to create job */
async function createFineTuningJob(trainingFileId) {
    const fineTune = await openai.fineTuning.jobs.create({
        training_file: trainingFileId,
        model: 'gpt-3.5-turbo', // gpt-4o-2024-08-06
    });

    return fineTune;
    //{ object: 'fine_tuning.job', id: 'ftjob-pCBKFQirNa3XpFUdfqlcWCIz', model: 'gpt-3.5-turbo-0125', created_at: 1738328518,finished_at: null, fine_tuned_model: null, organization_id: 'org-sTjSJDPJ4x1Ergo1BAnIUNWU', result_files: [], status: 'validating_files', validation_file: null, training_file: 'file-EZkACGCH5hTmcbLpq6hBYZ', hyperparameters: { n_epochs: 'auto', batch_size: 'auto', learning_rate_multiplier: 'auto'; }, trained_tokens: null, error: { }, user_provided_suffix: null, seed: 1578610505, estimated_finish: null, integrations: [], method: { type: 'supervised', supervised: { hyperparameters: [Object]; } }}
}
