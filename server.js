// Import required libraries
const express = require('express');
const axios = require('axios');
const cors = require('cors');
// Initialize express app
const app = express();
const port = 3000; // Server port

const apiKeyy = '76006839-3481-404c-89e9-d2e7688988c5'; 

// Enable CORS for all origins
app.use(cors());

// API endpoint to handle conversion requests
app.get('/api/convert', async (req, res) => {
  const { amount, symbol, convert } = req.query;

  // Ensure parameter check
  if (!amount || !symbol || !convert) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
   const response = await axios.get(
  'https://pro-api.coinmarketcap.com/v2/tools/price-conversion',
  {
    params: {
      amount,      
      symbol,
      convert
    },

    headers: {
      'X-CMC_PRO_API_KEY': apiKeyy
    }
  }
);

const convertedAmount = response.data.data[0].quote[convert].price;

res.json({
  success: true,
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

// Server start
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
