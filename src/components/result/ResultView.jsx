import { useRef, useState } from "react";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import { Printer, RotateCcw } from "lucide-react";
import { LEARNING_RECOMMENDATIONS } from "../../data/recommendations";
import { ReportContent } from "./ReportContent";
import { buildStyleList, CONFIG } from "./resultUtils";

export function ResultView({ predictionResult, studentData, onReset }) {
  const contentRef = useRef(null);
  const printRef = useRef(null);
  
  const allStyles = buildStyleList(predictionResult);
  const dominant = allStyles.find((s) => s.label === predictionResult.result);
  const cfg = CONFIG[dominant?.label] ?? CONFIG.Visual;
  const rec = LEARNING_RECOMMENDATIONS[dominant?.label];

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    // Kita capture dari container tersembunyi `printRef` yang punya resolusi konstan 1024px
    const element = printRef.current;
    if (!element) return;

    try {
      setIsDownloading(true);
      const filename = studentData?.nama
        ? `Laporan_Gaya_Belajar_${studentData.nama.replace(/\s+/g, "_")}.pdf`
        : "Laporan_Gaya_Belajar.pdf";

      await new Promise((resolve) => setTimeout(resolve, 300));
      const dataUrl = await toPng(element, { quality: 0.95, pixelRatio: 2 });

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;

      if (pdfHeight > pdf.internal.pageSize.getHeight()) {
        pdf.internal.pageSize.setHeight(pdfHeight);
      }

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(filename);
    } catch (err) {
      console.error("Failed to generate PDF", err);
      alert("Gagal membuat PDF. Silakan coba lagi.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-3 sm:p-8 font-sans overflow-x-hidden">
      
      {/* CONTAINER GHAIB KHUSUS PRINT PDF (Ukuran lebar selalu stabil 1024px, menghindari layout sempit mobile) */}
      <div className="absolute top-0 left-[-9999px]">
        <div ref={printRef}>
          <ReportContent 
            dominant={dominant} 
            rec={rec} 
            cfg={cfg} 
            allStyles={allStyles} 
            studentData={studentData} 
            isPrintMode={true} 
          />
        </div>
      </div>

      <div className="bg-white rounded-[24px] sm:rounded-[32px] shadow-sm w-full max-w-5xl p-3 sm:p-10 md:p-12 relative border border-gray-100">
        
        {/* TAMPILAN VIEWPORT */}
        <div ref={contentRef}>
          <ReportContent 
            dominant={dominant} 
            rec={rec} 
            cfg={cfg} 
            allStyles={allStyles} 
            studentData={studentData} 
            isPrintMode={false} 
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 sm:mt-12 bg-white pt-2 sm:pt-4 pb-2">
          <button
            onClick={onReset}
            className="w-full sm:w-auto sm:min-w-[220px] flex items-center justify-center gap-2.5 py-3.5 sm:py-4 px-6 sm:px-8 rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] text-gray-700 font-bold text-[15px] sm:text-[17px] transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Isi Formulir Lagi
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className={`w-full sm:w-auto sm:min-w-[220px] flex items-center justify-center gap-2.5 py-3.5 sm:py-4 px-6 sm:px-8 rounded-full bg-[#0284c7] hover:bg-sky-700 text-white font-bold text-[15px] sm:text-[17px] transition-colors shadow-sm ${isDownloading ? "opacity-70 cursor-wait" : ""
              }`}
          >
            <Printer className="w-5 h-5" />
            {isDownloading ? "Memproses..." : "Cetak"}
          </button>
        </div>
      </div>
    </div>
  );
}
