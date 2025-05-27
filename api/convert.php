<?php
// Set headers for frontend access
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// CoinMarketCap API Key
$apiKey = '76006839-3481-404c-89e9-d2e7688988c5';

// Get query parameters
$amount = isset($_GET['amount']) ? $_GET['amount'] : 1;
$symbol = isset($_GET['symbol']) ? $_GET['symbol'] : 'BTC';
$convert = isset($_GET['convert']) ? $_GET['convert'] : 'USD';

// Prepare CoinMarketCap API request
$url = "https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=$amount&symbol=$symbol&convert=$convert";

$headers = [
    "X-CMC_PRO_API_KEY: $apiKey"
];

// Initialize cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Output result
if ($httpCode == 200) {
    echo $response;
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Failed to fetch data from CoinMarketCap.',
        'status' => $httpCode
    ]);
}
?>

