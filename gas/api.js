const submitForm = (data) => {
  const features = ['a1','a2','a3','a4','a5','v1','v2','v3','v4','v5','k1','k2','k3','k4','k5'];

  const modelInput = {};
  features.forEach(f => { modelInput[f] = parseFloat(data[f] || 0); });

  const predictionResult = predictXgboost(modelInput);

  try {
    saveSubmission(data, predictionResult);
  } catch (e) {
    console.error("Gagal menyimpan data ke Spreadsheet:", e);
  }

  return JSON.stringify({
    status: "success",
    message: "Prediksi berhasil dibuat.",
    prediction: predictionResult
  });
};
