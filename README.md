This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## AI Stock Picker
Users can select up to 3 stock tickers (symbols like AAPL or GOOGL). The system then fetches 3 days of historical performance data from Polygon API and formats this data. The data is then sent to OpenAI's API for analysis and an investment report is generated. The report describes the stocks' performance and recommends whether to buy, hold or sell. Reports are generated in a peculiar style because of the few shot approach, providing the model with examples to set the style and tone of it's response.

## Getting Started
The project does not contain environment variables by default, so you'll have to set them yourself for the app to work.

Create a `.env.local` file in the root directory of your project with the following content:

```env
POLYGON_API_KEY=your_polygon_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

Make sure to replace `your_polygon_api_key_here` and `your_openai_api_key_here` with your actual API keys.
An API key for Polygon can be obtained [here](https://polygon.io/dashboard) and an OpenAI API key [here](https://platform.openai.com/settings/organization/api-keys).

Run 'pnpm install' to install dependencies
Run 'pnpm install openai' to install the openai library
Run 'pnpm next build' to build the app.
Run 'pnpm next start' to start the app.
Open your browser and navigate to http://localhost:3000

## Example of generated report
Hold onto your hats! Over the past three days, NVIDIA (NVDA) has spiced things up, jumping from $121.76 to a dazzling close of $129.84. This stock is sizzling, folks! If you've got shares, it’s time to ride this bullish wave. Don't even think about selling – this rocket’s just getting off the launch pad! On the other hand, Alphabet (GOOG) has taken a bit of a nosedive, from $193.10 to $187.14. This tech titan is feeling the pinch, and it’s a bumpy ride ahead! But fear not, it could rebound. Hunker down if you've got it, but maybe keep an eye for that sweet exit. So, for NVDA, charge in and buy more, while for GOOG, it’s a hold. Let’s see where the chips fall next! 🍀