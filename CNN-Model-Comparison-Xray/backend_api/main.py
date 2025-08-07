import numpy as np
import onnxruntime as ort
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import base64
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

sessions = {}

# Tải model YOLOv8 (Detection)
try:
    sessions["detect"] = ort.InferenceSession(
        "best.onnx", providers=["CPUExecutionProvider"]
    )
    print(" <<>> YOLOv8 ONNX model loaded successfully. <<>> ")
except Exception as e:
    print(f"<<>> Error loading YOLOv8 ONNX model: {e} <<>>")
    sessions["detect"] = None

# Tải model U-Net (Segmentation)
try:
    sessions["segment"] = ort.InferenceSession(
        "unet_model.onnx", providers=["CPUExecutionProvider"]
    )
    print("<<>> U-Net ONNX model loaded successfully. <<>>")
except Exception as e:
    print(f"<<>> Error loading U-Net ONNX model: {e} <<>>")
    sessions["segment"] = None

# --- 2. CÁC HÀM TIỆN ÍCH (PREPROCESS & POSTPROCESS) ---


# YOLOv8 model
def preprocess_yolo(image: Image.Image):
    # Tiền xử lý ảnh để phù hợp với đầu vào của YOLOv8 model.
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


def postprocess_yolo(
    output_data, model_input_size=(640, 640), confidence_threshold=0.25
):
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


# U-Net model
def preprocess_unet(image: Image.Image):
    # Tiền xử lý ảnh để phù hợp với đầu vào của U-Net model.
    model_width, model_height = (256, 256)

    # Chuyển ảnh sang ảnh xám (1 kênh)
    image = image.convert("L")
    image = image.resize((model_width, model_height))

    # Chuyển đổi ảnh thành mảng numpy và chuẩn hóa
    image_data = np.array(image, dtype=np.float32) / 255.0

    # Thêm chiều kênh để phù hợp với shape (H, W, 1)
    image_data = np.expand_dims(image_data, axis=-1)

    # Thêm chiều batch để có shape (1, H, W, 1)
    image_data = np.expand_dims(image_data, axis=0)

    return image_data


def postprocess_unet(original_image: Image.Image, mask_array: np.ndarray):
    mask_data = mask_array.squeeze()  # (256, 256)

    # --- 1. Tạo ảnh kết quả với mặt nạ màu đỏ ---
    red_mask_img = Image.new(
        "RGBA", (mask_data.shape[1], mask_data.shape[0]), (0, 0, 0, 0)
    )
    pixels = red_mask_img.load()
    for y in range(mask_data.shape[0]):
        for x in range(mask_data.shape[1]):
            if mask_data[y, x] > 0.5:  # Ngưỡng 0.5
                pixels[x, y] = (255, 0, 0, 100)
    red_mask_img = red_mask_img.resize(original_image.size, Image.Resampling.NEAREST)
    combined_image = Image.alpha_composite(original_image.convert("RGBA"), red_mask_img)

    buffered_combined = io.BytesIO()
    combined_image.save(buffered_combined, format="PNG")
    combined_img_str = base64.b64encode(buffered_combined.getvalue()).decode("utf-8")

    # --- 2. Tạo ảnh heatmap xám thể hiện xác suất thô ---
    # Chuẩn hóa mask_data (0-1) thành ảnh xám (0-255)
    heatmap_array = (mask_data * 255).astype(np.uint8)
    heatmap_image = Image.fromarray(heatmap_array, "L")
    heatmap_image = heatmap_image.resize(original_image.size, Image.Resampling.NEAREST)

    buffered_heatmap = io.BytesIO()
    heatmap_image.save(buffered_heatmap, format="PNG")
    heatmap_img_str = base64.b64encode(buffered_heatmap.getvalue()).decode("utf-8")

    # Trả về cả hai ảnh
    return {
        "overlay_image_base64": f"data:image/png;base64,{combined_img_str}",
        "heatmap_image_base64": f"data:image/png;base64,{heatmap_img_str}",
    }


# --- 3. ENDPOINT CHÍNH ĐỂ PHÂN TÍCH ẢNH ---


# Endpoint gốc để kiểm tra API
@app.get("/")
def read_root():
    return {"status": "API is running. Available models: " + ", ".join(sessions.keys())}


# Endpoint để phân tích ảnh
@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...), model_type: str = "detect"):
    session = sessions.get(model_type)
    if not session:
        raise HTTPException(
            status_code=500,
            detail=f"Model type '{model_type}' is not loaded or available.",
        )

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        if model_type == "detect":
            preprocessed_image = preprocess_yolo(image.convert("RGB"))
            input_name = session.get_inputs()[0].name
            outputs = session.run(None, {input_name: preprocessed_image})
            processed_results = postprocess_yolo(outputs[0])

            # Trả về kết quả phân tích ảnh
            return {"modelUsed": "YOLOv8 (ONNX)", "overlayData": processed_results}

        elif model_type == "segment":
            preprocessed_image = preprocess_unet(image)
            input_name = session.get_inputs()[0].name
            output_name = session.get_outputs()[0].name
            outputs = session.run([output_name], {input_name: preprocessed_image})

            processed_results = postprocess_unet(image, outputs[0])

            # Trả về kết quả phân tích ảnh
            return {"modelUsed": "U-Net (ONNX)", **processed_results}

    except Exception as e:
        import traceback

        traceback.print_exc()  # In traceback chi tiết để dễ debug hơn
        raise HTTPException(
            status_code=500, detail=f"An error occurred during analysis: {str(e)}"
        )
