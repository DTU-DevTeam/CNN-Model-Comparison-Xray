import React from 'react';
import styles from './Uploader.module.css';

const UploadCloudIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
    <path d="M12 12v9"/>
    <path d="m16 16-4-4-4 4"/>
  </svg>
);

interface UploaderProps {
  onFileSelect: (file: File) => void;
}

const Uploader: React.FC<UploaderProps> = ({ onFileSelect }) => {
  
  const handleFileChange = (file: File | undefined) => {
    if (file && (file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.dcm'))) {
      onFileSelect(file);
    } else {
      alert("Please select only image files (PNG, JPG) or DICOM files (.dcm).");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleClick = () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
        fileInput.click();
    }
  };

  return (
    <div 
      className={styles.uploadArea}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input 
        type="file" 
        id="fileInput" 
        className="hidden" 
        accept="image/png, image/jpeg, .dcm"
        onChange={(e) => handleFileChange(e.target.files?.[0])}
      />
      <UploadCloudIcon className={styles.uploadIcon} />
      <p className={styles.uploadText}>
        Drag and drop <span className={styles.uploadLink}>or click to upload images</span>
      </p>
      <p className={styles.uploadHint}>Supported formats: PNG, JPG, JPEG, DCM</p>
    </div>
  );
};

export default Uploader;
