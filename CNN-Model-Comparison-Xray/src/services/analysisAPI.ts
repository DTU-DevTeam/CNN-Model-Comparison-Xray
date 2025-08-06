import axios from 'axios';

// Định nghĩa kiểu dữ liệu cho Bounding Box trả về từ API
interface ApiBoundingBox {
  box_percent: [number, number, number, number];
  confidence: number;
}

// Định nghĩa kiểu dữ liệu cho toàn bộ phản hồi từ API
export interface AnalysisApiResponse {
  modelUsed: string;
  overlayData: ApiBoundingBox[];
}

const API_URL = 'http://127.0.0.1:8000/analyze';

export const analyzeImageWithAPI = async (
  imageFile: File,
  modelType: 'detect' | 'segment'
): Promise<AnalysisApiResponse> => {
  const formData = new FormData();
  formData.append('file', imageFile);

  // Gửi request đến API với model_type là một query parameter
  const response = await axios.post<AnalysisApiResponse>(
    `${API_URL}?model_type=${modelType}`, 
    formData, 
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return response.data;
};