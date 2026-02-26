/**
 * @file This file acts as a Spreadsheet Service layer.
 * All interactions with Google SpreadsheetApp should be contained here.
 */

const SHEET_NAME = 'kenalicara';

/**
 * Saves a single form submission along with its prediction result to the spreadsheet.
 * It creates the sheet and headers if they don't exist.
 * @param {object} formData The original data from the form.
 * @param {object} prediction The prediction result object from the model.
 */
function saveSubmission(formData, prediction) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // If sheet doesn't exist, create it.
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      console.log(`Sheet "${SHEET_NAME}" tidak ditemukan, sheet baru telah dibuat.`);
    }

    // Definisikan pemetaan dari kunci form (a1, v1, dll) ke pertanyaan lengkap.
    // Anda bisa mengganti teks pertanyaan ini sesuai kebutuhan.
    const headerMapping = {
      'a1': 'Ketika guru memberi tahu saya instruksi, saya mengerti dengan lebih baik.',
      'a2': 'Ketika seseorang menjelaskan cara melakukan sesuatu di kelas, saya lebih mudah memahaminya.',
      'a3': 'Saya lebih mengingat hal-hal yang saya dengar di kelas daripada hal-hal yang saya baca.',
      'a4': 'Saya belajar lebih baik di kelas ketika guru memberikan ceramah.',
      'a5': 'Saya belajar lebih baik di kelas ketika mendengarkan seseorang.',
      'v1': 'Saya belajar lebih baik dengan membaca apa yang ditulis guru di papan tulis.',
      'v2': 'Ketika saya membaca petunjuk, saya lebih mudah mengingatnya.',
      'v3': 'Saya lebih memahami ketika membaca petunjuk.',
      'v4': 'Saya lebih mudah mengingat sesuatu jika saya menuliskannya kembali.',
      'v5': 'Saya lebih suka membaca buku daripada mendengarkan cerita.',
      'k1': 'Saya lebih suka belajar dengan melakukan sesuatu di kelas.',
      'k2': 'Ketika saya melakukan hal-hal di kelas, saya belajar dengan lebih baik.',
      'k3': 'Saya senang belajar di kelas dengan melakukan eksperimen.',
      'k4': 'Saya lebih memahami materi di kelas ketika saya ikut serta dalam peran-peran.',
      'k5': 'Saya belajar paling baik di kelas ketika saya dapat berpartisipasi dalam kegiatan yang terkait.',
    };

    // Array ini mendefinisikan URUTAN dan KUNCI data dari form.
    const dataKeysInOrder = [
      'timestamp', 'nama', 'kelas', 'no_absen', 'email',
      'a1', 'a2', 'a3', 'a4', 'a5',
      'v1', 'v2', 'v3', 'v4', 'v5',
      'k1', 'k2', 'k3', 'k4', 'k5',
      'hasil_prediksi', 'persentase_keyakinan'
    ];
    
    // Buat header yang akan ditulis ke sheet, gunakan teks lengkap jika ada di mapping.
    const sheetHeaders = dataKeysInOrder.map(key => headerMapping[key] || key);

    // Check if the sheet is empty and add headers if it is.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(sheetHeaders);
    }

    // Buat baris baru berdasarkan urutan kunci data.
    const newRow = dataKeysInOrder.map(key => {
      switch (key) {
        case 'timestamp': return new Date();
        case 'hasil_prediksi': return prediction.result;
        case 'persentase_keyakinan': return prediction.percentage;
        default: return formData[key] || '';
      }
    });

    sheet.appendRow(newRow);
    console.log("Data berhasil disimpan ke Spreadsheet.");
  } catch (e) {
    console.error("Error dalam saveSubmission:", e);
    throw e; // Re-throw to allow the controller to handle it if needed.
  }
}

function getSheetData(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  const dataRange = sheet.getDataRange();
  const data = dataRange.getDisplayValues();
  const heads = data.shift();
  const obj = data.map((r) =>
    heads.reduce((o, k, i) => ((o[k] = r[i] || ""), o), {})
  );
  return JSON.stringify(obj);
}

function getSheetNamesAndHeaders() {
  const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  const sheetNames = sheets.map((sheet) => sheet.getName());
  
  const headers = sheets.map((sheet) => {
    const dataRange = sheet.getDataRange();
    const headers = dataRange.getValues()[0];
    return { [sheet.getName()]: headers };
  });
  return { sheetNames, headers };
}