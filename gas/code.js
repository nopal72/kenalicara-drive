function doGet() {
  return HtmlService.createTemplateFromFile("index")
    .evaluate()
    .setTitle("React-Apps-Script")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

function includes(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function generatePDF(data) {

  const htmlOutput = HtmlService.createTemplateFromFile('index');

  htmlOutput.namaSiswa = "john";
  htmlOutput.gayaDominant = "visual";

  const htmlContent = htmlOutput.evaluate().getContent()

  const blob = Utilities.newBlob(htmlContent, 'text/html', 'hasil-analisis.html');
  const pdfFile = DriveApp.createFile(blob.getAs('application/pdf')).setName("Laporan Gaya Belajar.pdf");

  return pdfFile.getUrl();
}