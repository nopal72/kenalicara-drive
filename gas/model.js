const MODEL_ID = "1x5y9AtPw03truH3t52sZcpLjugKHZB1g"

function testPredict() {
  // data dummy
  const dummyData = {
    a1: 5, a2: 5, a3: 5, a4: 5, a5: 5,
    v1: 1, v2: 1, v3: 1, v4: 1, v5: 1,
    k1: 1, k2: 4, k3: 3, k4: 1, k5: 2
  }

  return predictXgboost(dummyData)
}

// fungsi klasifikasi gaya belajar
function predictXgboost(data){
  console.log("Mulai prediksi....");

  // ambil model dulu
  const model = getModelFromDrive();

  // cek feature sudah sesuai
  const featureNames = model.learner.feature_names;

  console.log("Input vector yang diproses:", data)
  console.log("Memulai klasifikasi.....")

  // predict data
  const hasil_prediksi = predict(model, data)

  console.log("Hasil prediksi:", hasil_prediksi)

  return {
    result: hasil_prediksi.label,
    percentage: (hasil_prediksi.probability * 100).toFixed(2),
    all_probabilities: hasil_prediksi.all_probabilities,
    raw_scroe: hasil_prediksi.raw_scores
  }
}

// function load model from google drive
function getModelFromDrive() {
  const model_ID = MODEL_ID

  // ambil model dari google drive
  const modelContent = DriveApp.getFileById(model_ID).getBlob().getDataAsString();
  
  // parse model dari JSON agar bisa dibaca di appscript
  const modelJson = JSON.parse(modelContent);

  console.log(modelJson.learner.feature_names)

  return modelJson
}

// function predict 
function predict(model, inputs){
  const learner = model.learner
  const trees = learner.gradient_booster.model.trees
  const num_class = parseInt(learner.learner_model_param.num_class)
  // Ambil daftar nama fitur dari model untuk konversi index → nama key
  const featureNames = learner.feature_names;

  // Skor awal untuk 3 array
  let rawScore = new Array(num_class).fill(0.0)

  // telusuri tiap decicion tree
  for (let i = 0; i < trees.length; i++) {
    const tree = trees[i]
    const class_index = i % num_class
    let nodeId = 0

    while (true) {
      const left_child = tree.left_children[nodeId]

      // Jika mencapai Leaf (Daun)
      if (left_child === -1) {
        rawScore[class_index] += tree.base_weights[nodeId];
        break; 
      }

      // Jika masih di Split Node (Cabang)
      const featureIdx = tree.split_indices[nodeId];
      const threshold = tree.split_conditions[nodeId];
      
      // FIX: Gunakan nama fitur dari model untuk lookup, bukan index numerik
      // Sebelumnya: inputs[featureIdx] → selalu undefined karena inputs adalah objek {a1, a2, ...}
      const featureName = featureNames[featureIdx];
      const featureValue = inputs[featureName];

      if (featureValue < threshold) {
        nodeId = tree.left_children[nodeId];
      } else {
        nodeId = tree.right_children[nodeId];
      }
    }
  }

  // Softmax Activation (Konversi logit ke probabilitas)
  const maxScore = Math.max(...rawScore); 
  const exps = rawScore.map(score => Math.exp(score - maxScore));
  const sumExps = exps.reduce((acc, val) => acc + val, 0);
  const probabilities = exps.map(expVal => expVal / sumExps);

  // Penentuan Label Tertinggi
  let predictedClassIndex = 0;
  let highestProbability = probabilities[0];
  
  for (let j = 1; j < probabilities.length; j++) {
    if (probabilities[j] > highestProbability) {
      highestProbability = probabilities[j];
      predictedClassIndex = j;
    }
  }

  const labelMap = ["Auditori", "Kinestetik", "Visual"];
  const predictedLabel = labelMap[predictedClassIndex];

  return {
    label: predictedLabel,
    probability: highestProbability,
    all_probabilities: probabilities,
    raw_scores: rawScore
  };
}
