export function getSheetData(sheetName) {
  return new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler((res) => {
        console.log(res);
        resolve(res);
      })
      .withFailureHandler((msg) => {
        console.log(msg);
        reject(msg);
      })
      .getSheetData(sheetName);
  });
}

export function submitForm(data) {
  return new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler((res) => {
        resolve(res);
      })
      .withFailureHandler((msg) => {
        reject(msg);
      })
      .submitForm(data);
  });
}

export function testPredict() {
  return new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler((res) => {
        resolve(res);
      })
      .withFailureHandler((msg) => {
        reject(msg);
      })
      .testPredict();
  });
}
