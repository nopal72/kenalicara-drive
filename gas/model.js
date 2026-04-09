const MODEL_ID_A = "1v9FldZpsSqaWICoePCGg0zkCH69Umgmi";
const MODEL_ID_K = "1IgWTRL16YtehF25yAyTUgg6ggWAPdAVI";
const MODEL_ID_V = "1_aCPKS7QCRnaOZ4udw9ex5yp2hPq1AbP";

var CACHED_MODELS = null;

function testPredict() {
  // data dummy
  const dummyData = {
    a1: 5, a2: 5, a3: 5, a4: 5, a5: 5,
    v1: 1, v2: 1, v3: 1, v4: 1, v5: 1,
    k1: 5, k2: 5, k3: 5, k4: 5, k5: 5
  }

  const fullData = addConstructedFeatures(dummyData);

  return predictXgboost(fullData)
}

function addConstructedFeatures(data) {
  let processed = { ...data };

  processed.auditory_score = (data.a1 || 0) + (data.a2 || 0) + (data.a3 || 0) + (data.a4 || 0) + (data.a5 || 0);
  processed.visual_score = (data.v1 || 0) + (data.v2 || 0) + (data.v3 || 0) + (data.v4 || 0) + (data.v5 || 0);
  processed.kinesthetic_score = (data.k1 || 0) + (data.k2 || 0) + (data.k3 || 0) + (data.k4 || 0) + (data.k5 || 0);

  return processed;
}

// fungsi klasifikasi gaya belajar
function predictXgboost(data) {
  console.time("Total_Inference");
  const models = getModels();

  console.log("data yang digunakan: ", data)

  const probA = predictSingleModel(models.A, data);
  const probK = predictSingleModel(models.K, data);
  const probV = predictSingleModel(models.V, data);

  const allProbabilities = {
    "Auditori": probA,
    "Kinestetik": probK,
    "Visual": probV
  };

  // Mencari nilai tertinggi (Argmax)
  let predictedLabel = "Auditori";
  let maxProb = probA;

  if (probK > maxProb) {
    maxProb = probK;
    predictedLabel = "Kinestetik";
  }
  if (probV > maxProb) {
    maxProb = probV;
    predictedLabel = "Visual";
  }

  console.timeEnd("Total_Inference");
  console.log("Hasil OvR:", predictedLabel, allProbabilities);

  return {
    result: predictedLabel,
    confidence: Number((maxProb * 100).toFixed(2)),
    all_probabilities: allProbabilities
  };
}

// function load model from google drive
function getModels() {
  if (CACHED_MODELS) return CACHED_MODELS;

  console.log("Memuat 3 model dari Drive...");
  const modelA = JSON.parse(DriveApp.getFileById(MODEL_ID_A).getBlob().getDataAsString());
  const modelK = JSON.parse(DriveApp.getFileById(MODEL_ID_K).getBlob().getDataAsString());
  const modelV = JSON.parse(DriveApp.getFileById(MODEL_ID_V).getBlob().getDataAsString());

  CACHED_MODELS = { A: modelA, K: modelK, V: modelV };
  return CACHED_MODELS;
}

// function predict 
function predictSingleModel(modelJson, inputs) {
  const learner = modelJson.learner;
  const trees = learner.gradient_booster.model.trees;
  const featureNames = learner.feature_names;

  let rawScore = 0.0;

  for (let i = 0; i < trees.length; i++) {
    const tree = trees[i];
    let nodeId = 0;

    if (tree.left_children.length <= 1 && tree.left_children[0] === -1) {
      rawScore += tree.base_weights[0];
      continue;
    }

    while (true) {
      const leftChild = tree.left_children[nodeId];

      if (leftChild === -1) {
        rawScore += tree.base_weights[nodeId];
        break;
      }

      const featureIdx = tree.split_indices[nodeId];
      const threshold = tree.split_conditions[nodeId];
      const featureName = featureNames[featureIdx];
      const featureValue = inputs[featureName] || 0;

      if (featureValue < threshold) {
        nodeId = tree.left_children[nodeId];
      } else {
        nodeId = tree.right_children[nodeId];
      }
    }
  }

  return 1 / (1 + Math.exp(-rawScore));
}