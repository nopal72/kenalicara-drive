const SHEET_NAME = 'kenalicara';

const QUESTION_LABELS = {
  a1: 'Ketika guru memberi tahu saya instruksi, saya mengerti dengan lebih baik.',
  a2: 'Ketika seseorang menjelaskan cara melakukan sesuatu di kelas, saya lebih mudah memahaminya.',
  a3: 'Saya lebih mengingat hal-hal yang saya dengar di kelas daripada hal-hal yang saya baca.',
  a4: 'Saya belajar lebih baik di kelas ketika guru memberikan ceramah.',
  a5: 'Saya belajar lebih baik di kelas ketika mendengarkan seseorang.',
  v1: 'Saya belajar lebih baik dengan membaca apa yang ditulis guru di papan tulis.',
  v2: 'Ketika saya membaca petunjuk, saya lebih mudah mengingatnya.',
  v3: 'Saya lebih memahami ketika membaca petunjuk.',
  v4: 'Saya lebih mudah mengingat sesuatu jika saya menuliskannya kembali.',
  v5: 'Saya lebih suka membaca buku daripada mendengarkan cerita.',
  k1: 'Saya lebih suka belajar dengan melakukan sesuatu di kelas.',
  k2: 'Ketika saya melakukan hal-hal di kelas, saya belajar dengan lebih baik.',
  k3: 'Saya senang belajar di kelas dengan melakukan eksperimen.',
  k4: 'Saya lebih memahami materi di kelas ketika saya ikut serta dalam peran-peran.',
  k5: 'Saya belajar paling baik di kelas ketika saya dapat berpartisipasi dalam kegiatan yang terkait.',
};

const ROW_KEYS = [
  'timestamp', 'nama', 'sekolah', 'kelas', 'no_absen', 'email',
  'a1', 'a2', 'a3', 'a4', 'a5',
  'v1', 'v2', 'v3', 'v4', 'v5',
  'k1', 'k2', 'k3', 'k4', 'k5',
  'hasil_prediksi', 'persentase_keyakinan'
];

function saveSubmission(formData, prediction) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    const headers = ROW_KEYS.map(k => QUESTION_LABELS[k] || k);
    sheet.appendRow(headers);
  }

  const row = ROW_KEYS.map(k => {
    if (k === 'timestamp') return new Date();
    if (k === 'hasil_prediksi') return prediction.result;
    if (k === 'persentase_keyakinan') return prediction.confidence;
    return formData[k] || '';
  });

  sheet.appendRow(row);
}

function getSheetData(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  const data = sheet.getDataRange().getDisplayValues();
  const heads = data.shift();
  return JSON.stringify(data.map(r => heads.reduce((o, k, i) => ((o[k] = r[i] || ''), o), {})));
}