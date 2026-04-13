const MODEL_ID_A = "1kUyi6TYJ1-8RPT6b6nKmrATCtRujV37x";
const MODEL_ID_K = "1VY7CqsPe8ixMjD-zyhh8fXOwFicY9EjX";
const MODEL_ID_V = "1m9JUBzKeuZX1QZKGayr5SmNJE2fYTqkl";

var CACHED_MODELS;

function getModels() {
  if (CACHED_MODELS) {
    return CACHED_MODELS;
  }

  console.time("LOAD_MODEL");

  CACHED_MODELS = {
    A: JSON.parse(DriveApp.getFileById(MODEL_ID_A).getBlob().getDataAsString()),
    K: JSON.parse(DriveApp.getFileById(MODEL_ID_K).getBlob().getDataAsString()),
    V: JSON.parse(DriveApp.getFileById(MODEL_ID_V).getBlob().getDataAsString())
  };

  console.timeEnd("LOAD_MODEL");

  return CACHED_MODELS;
}


function testPredict() {
  // data dummy
  const dummyData = {
    a1: 4, a2: 4, a3: 4, a4: 4, a5: 4,
    v1: 4, v2: 4, v3: 4, v4: 4, v5: 4,
    k1: 1, k2: 1, k3: 1, k4: 1, k5: 1
  }

  const fullData = addConstructedFeatures(dummyData);

  return predictXgboost(fullData)
}

function testLoop() {
  for (let i = 0; i < 3; i++) {
    console.time("RUN " + i);
    testPredict();
    console.timeEnd("RUN " + i);
  }
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

  // function load model from google drive
  // function getModels() {
  //   if (CACHED_MODELS) return CACHED_MODELS;

  //   console.log("Memuat 3 model dari Drive...");
  //   const modelA = JSON.parse(DriveApp.getFileById(MODEL_ID_A).getBlob().getDataAsString());
  //   const modelK = JSON.parse(DriveApp.getFileById(MODEL_ID_K).getBlob().getDataAsString());
  //   const modelV = JSON.parse(DriveApp.getFileById(MODEL_ID_V).getBlob().getDataAsString());

  //   CACHED_MODELS = { A: modelA, K: modelK, V: modelV };
  //   return CACHED_MODELS;
  // }
}