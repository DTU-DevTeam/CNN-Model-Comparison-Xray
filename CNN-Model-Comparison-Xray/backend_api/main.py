import numpy as np
import onnxruntime as ort
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

# --- 1. KHỞI TẠO ỨNG DỤNG VÀ MODEL ---

app = FastAPI(title="X-Ray Analysis API")

# Cấu hình CORS để cho phép frontend React gọi tới
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Thêm endpoint gốc để kiểm tra API
@app.get("/")
def read_root():
    return {"status": "API is running and ready for analysis."}


# Tải model ONNX khi server khởi động để tối ưu hiệu suất
try:
    session = ort.InferenceSession("best.onnx")
    input_name = session.get_inputs()[0].name
    print("ONNX model loaded successfully.")
except Exception as e:
    print(f"Error loading ONNX model: {e}")
    session = None

# --- 2. CÁC HÀM TIỆN ÍCH (PREPROCESS & POSTPROCESS) ---


def preprocess(image: Image.Image):
    """Tiền xử lý ảnh để phù hợp với đầu vào của model ONNX."""
    model_input_size = (640, 640)
    image = image.resize(model_input_size)
    image_data = np.array(image).astype(np.float32)

    # Đảm bảo ảnh là 3 kênh màu (RGB)
    if len(image_data.shape) == 2:  # Nếu là ảnh xám
        image_data = np.stack([image_data] * 3, axis=-1)

    image_data = np.transpose(image_data, (2, 0, 1))  # HWC to CHW
    image_data /= 255.0
    image_data = np.expand_dims(image_data, axis=0)
    return image_data


def postprocess(output_data, model_input_size=(640, 640), confidence_threshold=0.25):
    # Hậu xử lý tensor đầu ra từ YOLOv8 để lấy các bounding box. #
    boxes = []
    input_w, input_h = model_input_size

    # Transpose output from [1, 84, 8400] to [1, 8400, 84]
    output_data = np.transpose(output_data[0], (1, 0))

    scale_factor = 1.2  # Tỉ lệ mở rộng để bao gồm các đối tượng nhỏ hơn

    for row in output_data:
        confidence = row[4]
        if confidence >= confidence_threshold:
            x_center, y_center, width, height = row[:4]

            # Tính toán tọa độ pixel mới với tỉ lệ mở rộng
            new_width = width * scale_factor
            new_height = height * scale_factor

            # Tính toán tọa độ pixel thô
            x_min = x_center - (new_width / 2)
            y_min = y_center - (new_height / 2)

            # Chuẩn hóa tọa độ thành tỉ lệ %
            box_as_percent = [
                float(x_min / input_w),
                float(y_min / input_h),
                float(new_width / input_w),
                float(new_height / input_h),
            ]

            boxes.append(
                {
                    "box_percent": box_as_percent,
                    "confidence": float(confidence),
                }
            )

    return boxes


# --- 3. ENDPOINT CHÍNH ĐỂ PHÂN TÍCH ẢNH ---


@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...), model_type: str = "detect"):
    if not session:
        raise HTTPException(status_code=500, detail="Model is not loaded.")

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        if model_type == "detect":
            preprocessed_image = preprocess(image)
            outputs = session.run(None, {input_name: preprocessed_image})

            # --- THAY ĐỔI CHÍNH NẰM Ở ĐÂY ---
            # 1. Gọi hàm postprocess mới để lấy tọa độ đã chuẩn hóa
            processed_results = postprocess(outputs[0])

            print(">>> KẾT QUẢ TỪ BACKEND:", processed_results)

            # 2. Trả về kết quả trong trường 'overlayData'
            return {"modelUsed": "YOLOv8 (ONNX)", "overlayData": processed_results}

        elif model_type == "segment":
            # (Logic cho model U-Net sẽ được thêm vào sau)
            return {"error": "Segmentation model not implemented yet"}

        else:
            raise HTTPException(status_code=400, detail="Invalid model type specified.")

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"An error occurred during analysis: {str(e)}"
        )
