// src/pages/Analysis/index.tsx
import React, { useRef, useState } from 'react';
import styles from './AnalysisPage.module.css';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Uploader from '../../components/ui/Uploader/Uploader';

const SAMPLE_IMAGES = [
  { name: 'Normal', url: 'https://placehold.co/600x800/222/FFF?text=Normal+X-Ray' },
  { name: 'Nodule', url: 'https://placehold.co/600x800/222/FFF?text=Nodule+X-Ray' },
  { name: 'Pneumonia', url: 'https://placehold.co/600x800/222/FFF?text=Pneumonia+X-Ray' },
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
}

interface SegmentationMask {
  opacity: number;
  clipPath: string;
}

interface AnalysisResult {
  modelUsed: string;
  processingTime: string;
  accuracyScore: string;
  outputUrl: string | null;
  overlayData: BoundingBox[] | SegmentationMask;
}

const AnalysisPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisTask, setAnalysisTask] = useState<'detect' | 'segment'>('detect');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSampleClick = (url: string) => {
    setPreviewUrl(url);
    setAnalysisResult(null);
  };

  const handleAnalyze = () => {
    if (!previewUrl) {
      alert("Please upload an image or select a sample image.");
      return;
    }
    setIsLoading(true);
    setAnalysisResult(null);

    setTimeout(() => {
      const isDetection = analysisTask === 'detect';
      const mockResult: AnalysisResult = {
        modelUsed: isDetection ? 'YOLOv8' : 'U-Net++',
        processingTime: isDetection ? '~0.04s' : '~0.12s',
        accuracyScore: isDetection ? '0.92 (mAP)' : '0.95 (Dice)',
        outputUrl: previewUrl,
        overlayData: isDetection
          ? [
              { top: '40%', left: '55%', width: '15%', height: '12%' },
              { top: '60%', left: '30%', width: '10%', height: '8%' }
            ]
          : { opacity: 0.4, clipPath: 'polygon(20% 60%, 80% 55%, 75% 90%, 25% 95%)' },
      };
      setAnalysisResult(mockResult);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className={styles.pageContainer} ref={containerRef}>
      <Header scrollContainerRef={containerRef} />

      <main className={styles.mainContent}>
        <div className={styles.controlPanel}>
          <h2 className={styles.panelTitle}>Control Panel</h2>
          <Uploader onFileSelect={handleFileSelect} />

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Or try with sample images:</h3>
            <div className={styles.sampleImagesGrid}>
              {SAMPLE_IMAGES.map((img) => (
                <div key={img.name} onClick={() => handleSampleClick(img.url)} className={styles.sampleImage}>
                  <img src={img.url} alt={img.name} className={styles.sampleImageThumb} />
                  <p className={styles.sampleImageName}>{img.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Choose a model for analysis:</h3>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input 
                  type="radio" 
                  name="analysisTask" 
                  value="detect"
                  checked={analysisTask === 'detect'}
                  onChange={(e) => setAnalysisTask(e.target.value as 'detect' | 'segment')}
                  className={styles.radioInput}
                />
                <span>Detect Pulmonary Nodules (YOLOv8)</span>
              </label>
              <label className={styles.radioLabel}>
                <input 
                  type="radio" 
                  name="analysisTask" 
                  value="segment"
                  checked={analysisTask === 'segment'}
                  onChange={(e) => setAnalysisTask(e.target.value as 'detect' | 'segment')}
                  className={styles.radioInput}
                />
                <span>Segment Pneumonia (U-Net++)</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isLoading || !previewUrl}
            className={styles.analyzeButton}
          >
            {isLoading && <LoaderIcon className={styles.loaderIcon} />}
            {isLoading ? 'Analyzing...' : 'Analyze Image'}
          </button>
        </div>

        <div className={styles.resultsPanel}>
          <h2 className={styles.panelTitle}>Results</h2>
          <div className={styles.resultsContent}>
            {!previewUrl ? (
              <div className={styles.placeholder}>
                Please upload an image to see the results here.
              </div>
            ) : (
              <div className={styles.comparisonGrid}>
                <div className={styles.imageCard}>
                  <h3 className={styles.imageTitle}>Original Image</h3>
                  <div className={styles.imageWrapper}>
                    <img src={previewUrl} alt="Original X-Ray" className={styles.imageDisplay} />
                  </div>
                </div>

                <div className={styles.imageCard}>
                  <h3 className={styles.imageTitle}>AI Analysis</h3>
                  <div className={`${styles.imageWrapper} ${styles.analysisWrapper}`}>
                    {isLoading ? (
                      <div className={styles.loadingOverlay}>
                        <LoaderIcon className={styles.mainLoader} />
                      </div>
                    ) : (
                      <>
                        <img src={analysisResult?.outputUrl || previewUrl} alt="AI Analysis" className={styles.imageDisplay} />
                        {analysisResult && analysisTask === 'detect' && Array.isArray(analysisResult.overlayData) && analysisResult.overlayData.map((box, index) => (
                          <div
                            key={index}
                            className={styles.boundingBox}
                            style={{ ...box }}
                          ></div>
                        ))}
                        {analysisResult && analysisTask === 'segment' && !Array.isArray(analysisResult.overlayData) && (
                          <div
                            className={styles.segmentationMask}
                            style={{ ...analysisResult.overlayData }}
                          ></div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {analysisResult && !isLoading && (
              <div className={styles.infoBox}>
                <h3 className={styles.infoTitle}>Detailed Information</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <p>Model Used</p>
                    <span>{analysisResult.modelUsed}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <p>Processing Time</p>
                    <span>{analysisResult.processingTime}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <p>Accuracy Score</p>
                    <span>{analysisResult.accuracyScore}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AnalysisPage;
