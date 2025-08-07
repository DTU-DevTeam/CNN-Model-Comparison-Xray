import React, { useRef, useState} from 'react';
import styles from './AnalysisPage.module.css';

// Import các hàm và thành phần cần thiết
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Uploader from '../../components/ui/Uploader/Uploader';
import ReportTemplate from '../../components/ui/ReportTemplate/ReportTemplate';
import { analyzeImageWithAPI, type AnalysisApiResponse } from '../../services/analysisAPI';

// Import các ảnh mẫu
import yoloNormalSample from '../../assets/SAMPLEIMAGES/YOLOv8/Normal/1.3.6.1.4.1.14519.5.2.1.6279.6001.122914038048856168343065566972_slice38.png';
import yoloNoduleSample from '../../assets/SAMPLEIMAGES/YOLOv8/Nodule/1.3.6.1.4.1.14519.5.2.1.6279.6001.187108608022306504546286626125_slice215.png';
import unetNormalSample from '../../assets/SAMPLEIMAGES/U-Net/Normal/003d8fa0-6bf1-40ed-b54c-ac657f8495c5.png';
import unetPneumoniaSample from '../../assets/SAMPLEIMAGES/U-Net/Pneumonia/00436515-870c-4b36-a041-de91049b9ab4.png';


// --- CÁC HẰNG SỐ VÀ INTERFACE ---

const YOLO_SAMPLES = [
  { name: 'Normal', path: yoloNormalSample },
  { name: 'Nodule', path: yoloNoduleSample },
];

const UNET_SAMPLES = [
  { name: 'Normal', path: unetNormalSample },
  { name: 'Pneumonia', path: unetPneumoniaSample },
];

const LoaderIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

interface BoundingBox {
  top: string;
  left: string;
  width: string;
  height: string;
  confidence: number;
}

interface AnalysisResult {
  modelUsed: string;
  processingTime: string;
  metrics: { label: string; value: string | number; }[];
  overlayData: BoundingBox[]; // YOLO
  resultImageUrl?: string; // U-Net
  heatmapImageUrl?: string; 
}

// --- COMPONENT CHÍNH ---

const AnalysisPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const originalImageRef = useRef<HTMLImageElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisTask, setAnalysisTask] = useState<'detect' | 'segment'>('detect');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  // Hàm xử lý khi người dùng tải file lên
  const handleFileSelect = (file: File) => {
    setSelectedFile(file); // Lưu file thật
    setAnalysisResult(null);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Hàm xử lý khi người dùng chọn ảnh mẫu
  const handleSampleClick = async (path: string, name: string) => {
    setPreviewUrl(path);
    setAnalysisResult(null);

    try {
      const response = await fetch(path);
      const blob = await response.blob();
      const file = new File([blob], `${name.toLowerCase().replace(' ', '-')}.png`, { type: blob.type });
      setSelectedFile(file);
    } catch (error) {
      console.error("Error converting sample image to file:", error);
      setSelectedFile(null);
    }
  };

  // Hàm chính để gọi API và phân tích ảnh
  const handleAnalyze = async () => {
    if (!selectedFile) return alert("Please upload an image or select a sample.");
    
    setIsLoading(true);
    setAnalysisResult(null);
    const startTime = performance.now();

    try {
      const result: AnalysisApiResponse = await analyzeImageWithAPI(selectedFile, analysisTask);
      const endTime = performance.now();
      const processingTime = `~${((endTime - startTime) / 1000).toFixed(3)}s`;

      let finalResult: AnalysisResult;

      if (analysisTask === 'detect' && result.overlayData) {
        // Xử lý kết quả cho model YOLOv8
        const finalOverlayData = result.overlayData.map(d => ({
          left: `${d.box_percent[0] * 100}%`,
          top: `${d.box_percent[1] * 100}%`,
          width: `${d.box_percent[2] * 100}%`,
          height: `${d.box_percent[3] * 100}%`,
          confidence: d.confidence,
        }));

        finalResult = {
          modelUsed: result.modelUsed,
          processingTime,
          metrics: [{ label: 'Detections', value: `${finalOverlayData.length} found` }],
          overlayData: finalOverlayData,
        };
      } else if (analysisTask === 'segment' && result.overlay_image_base64) {
        // Xử lý kết quả cho model U-Net
        finalResult = {
          modelUsed: result.modelUsed,
          processingTime,
          metrics: [{ label: 'Status', value: 'Segmentation Complete' }],
          overlayData: [],
          resultImageUrl: result.overlay_image_base64,
          heatmapImageUrl: result.heatmap_image_base64,
        };
      } else {
        throw new Error("Unexpected API response format");
      }

      setAnalysisResult(finalResult);
    
    } catch (error) {
      console.error("Error during analysis:", error);
      alert("An error occurred during API call. Please ensure the backend server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  // Hàmđể tạo và tải báo cáo ảnh
  const handleDownloadReport = () => {
    // Tìm đến component ReportTemplate ẩn
    const reportElement = document.getElementById("pdf-report");
    if (!reportElement || !analysisResult) {
      alert("Please analyze an image first to download a report.");
      return;
    }

    html2canvas(reportElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`report-${analysisResult.modelUsed.replace(' ', '-')}.pdf`);
    });
  };

  const resultsGridClass = analysisTask === 'segment' && analysisResult?.heatmapImageUrl
    ? styles.comparisonGridThree
    : styles.comparisonGrid;

  // Phần JSX trả về giữ nguyên như trong tệp của bạn
  return (
    <div className={styles.pageContainer} ref={containerRef}>
      <div className={styles.headerContainer}>
        {/* Header component */}
        <Header/>
      </div>
      <main className={styles.mainContent}>

        {/* Control Panel */}
        <div className={styles.controlPanel}>
          <h2 className={styles.panelTitle}>Control Panel</h2>
          <Uploader onFileSelect={handleFileSelect} />

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Or try with sample images:</h3>
            <div className={styles.sampleImagesGrid}>
              {analysisTask === 'detect'
                ? YOLO_SAMPLES.map((img) => (
                    <div key={img.name} onClick={() => handleSampleClick(img.path, img.name)} className={styles.sampleImage}>
                      <img src={img.path} alt={img.name} className={styles.sampleImageThumb} />
                      <p className={styles.sampleImageName}>{img.name}</p>
                    </div>
                  ))
                : UNET_SAMPLES.map((img) => (
                    <div key={img.name} onClick={() => handleSampleClick(img.path, img.name)} className={styles.sampleImage}>
                      <img src={img.path} alt={img.name} className={styles.sampleImageThumb} />
                      <p className={styles.sampleImageName}>{img.name}</p>
                    </div>
                  ))
              }
            </div>
          </div>

          {/* Chọn mô hình phân tích */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Choose a model for analysis:</h3>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input type="radio" name="analysisTask" value="detect" checked={analysisTask === 'detect'} onChange={(e) => setAnalysisTask(e.target.value as 'detect' | 'segment')} className={styles.radioInput} />
                <span>Detect Pulmonary Nodules (YOLOv8)</span>
              </label>
              <label className={styles.radioLabel}>
                <input type="radio" name="analysisTask" value="segment" checked={analysisTask === 'segment'} onChange={(e) => setAnalysisTask(e.target.value as 'detect' | 'segment')} className={styles.radioInput} />
                <span>Segment Pneumonia (U-Net++)</span>
              </label>
            </div>
          </div>

          {/* Nút phân tích */}
          <button onClick={handleAnalyze} disabled={isLoading || !previewUrl} className={styles.analyzeButton}>
            {isLoading && <LoaderIcon className={styles.loaderIcon} />}
            {isLoading ? 'Analyzing...' : 'Analyze Image'}
          </button>
        </div>

        {/* Results Panel */}
        <div className={styles.resultsPanel}>
          <h2 className={styles.panelTitle}>Results</h2>
          <div className={styles.resultsContent}>
            {!previewUrl ? (
              <div className={styles.placeholder}>Please upload an image to see the results here.</div>
            ) : (
              <div className={resultsGridClass}>
                
                {/* Original Image */}
                <div className={styles.imageCard}>
                  <h3 className={styles.imageTitle}>Original Image</h3>
                  <div className={styles.imageWrapper}>
                    <img ref={originalImageRef} src={previewUrl} alt="Original X-Ray" className={styles.imageDisplay} />
                  </div>
                </div>

                {/* AI Analysis Image */}
                <div className={styles.imageCard}>
                  <h3 className={styles.imageTitle}>AI Analysis</h3>
                  <div className={styles.imageWrapper}>
                    {isLoading ? (
                      <div className={styles.placeholder}>
                        <LoaderIcon className={styles.loaderIcon} style={{ animation: 'spin 1s linear infinite' }} />
                        <p>Analyzing...</p>
                      </div>
                    ) : (
                      <>
                        {/* Hiển thị ảnh kết quả phân tích */}
                        <img src={analysisResult?.resultImageUrl || previewUrl} alt="AI Analysis" className={styles.imageDisplay} />

                        {/* Hiển thị bounding boxes nếu là tác vụ detect */}
                        {analysisResult && analysisTask === 'detect' && analysisResult.overlayData.map((box, index) => (
                          <div 
                            key={index} 
                            className={styles.boundingBox} 
                            style={{ 
                              top: box.top, 
                              left: box.left, 
                              width: box.width, 
                              height: box.height 
                            }}
                          >
                            <div className={styles.boundingBoxLabel}>
                              {box.confidence.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                {/* Heatmap Image for U-Net */}
                {analysisTask === 'segment' && analysisResult?.heatmapImageUrl && (
                  <div className={styles.imageCard}>
                    <h3 className={styles.imageTitle}>AI Raw Output (Heatmap)</h3>
                    <div className={styles.imageWrapper}>
                      {isLoading ? (
                        <div className={styles.placeholder}>...</div>
                      ) : (
                        <img src={analysisResult.heatmapImageUrl} alt="AI Heatmap" className={styles.imageDisplay} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Info Box */}
            {analysisResult && !isLoading && (
              <div className={styles.infoBox}>
                <div className={styles.infoTitleContainer}>
                  <h3 className={styles.infoTitle}>Detailed Information</h3>
                  <button onClick={handleDownloadReport} className={styles.downloadButton}>
                    Download Report
                  </button>
                </div>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <p>Model Used</p>
                    <span>{analysisResult.modelUsed}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <p>Processing Time</p>
                    <span>{analysisResult.processingTime}</span>
                  </div>
                  {analysisResult.metrics.map((metric, index) => (
                    <div key={index} className={styles.infoItem}>
                      <p>{metric.label}</p>
                      <span>{metric.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Khu vực báo cáo chiến lược mới */}
      <section className={styles.reportSection}>
        <div className={styles.reportContent}>
          <h2 className={styles.reportTitle}>Strategic Project Report</h2>
          <p className={styles.reportDescription}>
            Generate a comprehensive technical report analyzing the performance of U-Net and YOLO,
            providing a data-driven recommendation for future product development.
          </p>
          <button 
            className={styles.reportButton}
            onClick={() => alert("This feature will generate the final technical report comparing YOLO and U-Net performance metrics (mAP, FPS, Dice, IoU).")}
          >
            Generate Full Technical Report
          </button>
        </div>
      </section>      

      <Footer />

      {/* Component ẩn để tạo PDF */}
      <div style={{ position: 'absolute', left: '-2000px', top: 0, zIndex: -1 }}>
        {analysisResult && previewUrl && (
          <ReportTemplate 
            analysisResult={analysisResult} 
            originalImage={previewUrl} 
          />
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;