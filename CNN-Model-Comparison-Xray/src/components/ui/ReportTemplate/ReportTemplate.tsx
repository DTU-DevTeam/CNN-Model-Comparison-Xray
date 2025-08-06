import React from 'react';
import styles from './ReportTemplate.module.css';
import Logo from '../../../assets/xraimain.svg';

interface Metric {
  label: string;
  value: string | number;
}
interface BoundingBox {
  top: string;
  left: string;
  width: string;
  height: string;
  confidence: number;
}

interface SegmentationMask {
  opacity: number;
  clipPath: string;
}

interface AnalysisResult {
    modelUsed: string;
  processingTime: string;
  metrics: Metric[];
  overlayData: BoundingBox[] | SegmentationMask;
}

interface ReportProps {
  analysisResult: AnalysisResult;
  originalImage: string;
}

const ReportTemplate: React.FC<ReportProps> = ({ analysisResult, originalImage }) => {
  return (
    <div className={styles.reportContainer} id="pdf-report">
      {/* Header */}
      <header className={styles.header}>
        <img src={Logo} alt="Logo" className={styles.logo} />
        <h1>AI Analysis Report</h1>
      </header>
      
      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.imageComparison}>
          <div className={styles.imageBox}>
            <h3>Original Image</h3>
            <img src={originalImage} alt="Original" />
          </div>
          <div className={styles.imageBox}>
            <h3>AI Analysis</h3>
            <div className={styles.analysisImageWrapper}>
              <img src={originalImage} alt="Analysis" />
              {Array.isArray(analysisResult.overlayData) && analysisResult.overlayData.map((box, index) => (
                <div key={index} className={styles.boundingBox} style={{...box}}>
                   <div className={styles.boundingBoxLabel}>
                        nodule {box.confidence.toFixed(2)}
                    </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className={styles.infoSection}>
          <h3>Detailed Information</h3>
          <div className={styles.infoGrid}>
            <p><strong>Model Used:</strong> {analysisResult.modelUsed}</p>
            <p><strong>Processing Time:</strong> {analysisResult.processingTime}</p>
            {analysisResult.metrics.map((metric, index) => (
              <p key={index}><strong>{metric.label}:</strong> {metric.value}</p>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} AI Pioneers. All Rights Reserved. | Confidential Report</p>
      </footer>
    </div>
  );
};

export default ReportTemplate;