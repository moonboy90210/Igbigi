// Import required libraries
const express = require('express');
const axios = require('axios');
const cors = require('cors');
// Initialize express app
const app = express();
const port = 3000; // Port to run the server

// Define your API key here
const apiKeyy = '4b9a67ec-0803-4010-8b56-053b9ced9857'; // Replace with your actual CoinMarketCap API key

// Enable CORS for all origins
app.use(cors());

// Create an API endpoint to handle conversion requests
app.get('/api/convert', async (req, res) => {
  const { amount, symbol, convert } = req.query;

  // Ensure parameters are provided
  if (!amount || !symbol || !convert) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
        // Log to check the value of amount
        console.log('Amount:', amount);
        
    // Make the API request to CoinMarketCap
    const response = await axios.get(`https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=${amount}&symbol=${symbol}&convert=${convert}`, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKeyy
      }
    });

    // Extract the conversion rate from the API response
    const price = response.data.data[0].quote[convert].price;  // Price of 1 unit of 'symbol' in 'convert' currency

  // Final converted amount:
const convertedAmount = price;  // Already includes 'amount' from request

      //   // Log the full response to inspect its structure
        // console.log(response.data);

      //  // Ensure that response has the expected structure
      //  if (response.data.data && response.data.data[0] && response.data.data[0].quote[convert]) {
      //   const convertedAmount = response.data.data[0].quote[convert].price * parseFloat(amount); // Make sure amount is a number
  
    // Send the result back to the client
    res.json({
      success: true,
      message: `Converted ${amount} ${symbol} to ${convertedAmount} ${convert}`,
      result: {
        amount: convertedAmount,
        symbol: convert
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching conversion rate.',
      error: error.message
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
