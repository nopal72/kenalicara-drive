/**
 * @file This file acts as a Controller/Orchestrator layer.
 * It receives requests from the client, calls the necessary services (model, spreadsheet),
 * and formats the response. It should not contain direct calls to `SpreadsheetApp` or `DriveApp`.
 */

const submitForm = (data) => {
  // --- Flow ---
  // 1. Get prediction from the model service.
  // 2. Save data and prediction to the spreadsheet service.
  // 3. Return prediction result to the client.

  // --- 1. PREDICTION ---
  // Define the features required by the model
  const modelFeatures = [
    'a1', 'a2', 'a3', 'a4', 'a5',
    'v1', 'v2', 'v3', 'v4', 'v5',
    'k1', 'k2', 'k3', 'k4', 'k5'
  ];

  // Prepare the input for the model by selecting and converting features
  const modelInput = {};
  modelFeatures.forEach(feature => {
    modelInput[feature] = parseFloat(data[feature] || 0);
  });

  // Call the prediction service (from model.js)
  const predictionResult = predictXgboost(modelInput);

  // --- 2. PERSISTENCE ---
  try {
    // Call the spreadsheet service (from spreadsheetService.js)
    saveSubmission(data, predictionResult);
  } catch (e) {
    // Log the error but don't stop the flow. The user should still get their prediction.
    console.error("Gagal menyimpan data ke Spreadsheet. Lanjutkan proses tanpa penyimpanan.");
  }

  // --- 3. RESPONSE ---
  // Return a success response with the prediction data to the client.
  return JSON.stringify({
    status: "success",
    message: "Prediksi berhasil dibuat.",
    prediction: predictionResult
  });
};
