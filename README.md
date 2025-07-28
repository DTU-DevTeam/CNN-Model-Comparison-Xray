# 🧠 Research and Comparison of CNN Models (U-Net, YOLO) for Pathology Diagnosis via X-ray Imagery

**Version:** 1.0  
**Executing Team:** Group 4 – SIC 2025

---

## 📖 Project Summary

This project, **“Research and Comparison of CNN Models (U-Net, YOLO) for Pathology Diagnosis via X-ray Imagery,”** is a strategic Research and Development (R&D) initiative.  
The primary goal is to identify the **optimal technology platform** for our company's future line of intelligent medical products.

The final deliverables include:
- A **data-driven technology recommendation**
- A **functional prototype software**

---

## 🎯 Core Objective

The main objective is to **research, compare, and select** the optimal CNN model architecture between **U-Net** and **YOLO** (and their variants).  
The selected model will be used to build a prototype for diagnosing two common chest X-ray pathologies:
- **Pulmonary nodule detection**
- **Pneumonia segmentation**

---

## 🔬 Methodology & Hypotheses

Our research is guided by two core hypotheses:

- ✅ **Hypothesis 1 – YOLO for Rapid Screening**:  
  YOLO (e.g., YOLOv8) is ideal for **detecting discrete objects** like pulmonary nodules, where speed (FPS) and high mean Average Precision (mAP) are critical for mass screening.

- ✅ **Hypothesis 2 – U-Net for Precise Analysis**:  
  U-Net (e.g., U-Net++) is better suited for **segmenting diffuse conditions** such as pneumonia, where **boundary precision** (measured by Dice/IoU) is essential.

---

## 🛠️ Technology Stack

| Layer          | Technologies                              |
|----------------|--------------------------------------------|
| **Frontend**   | React (TypeScript + SWC)                   |
| **Backend**    | Python, Flask / FastAPI                    |
| **AI Models**  | PyTorch / TensorFlow, U-Net++, YOLOv8     |
| **Deployment** | Docker, Google Vertex AI / AWS SageMaker  |

---

## 🚀 Getting Started

To set up this project locally:

```bash
# Clone the repository
git clone https://github.com/DTU-DevTeam/CNN-Model-Comparison-Xray

# Navigate into the project directory
cd CNN-Model-Comparison-Xray

# Install frontend dependencies (if applicable)
npm install

# Run the development server (if applicable)
npm run dev
```
---

## 📈 Project Status

**Current Phase: [Phase 1: Preparation & Data Curation]**

* [X] Set up environment and infrastructure.
* [X] Collect raw X-ray data.
* [ ] Build annotation process & tools.

---

## 📬 Contact

For more information, please contact the executing team: **Group 4 – SIC 2025**

---

## 📎 References

**1.** RSNA Pneumonia Detection Challenge (Kaggle)

---

## 📄 License

This project is licensed under the **MIT License**.

You are free to:

- ✅ Use
- ✅ Copy
- ✅ Modify
- ✅ Merge
- ✅ Publish
- ✅ Distribute
- ✅ Sublicense
- ✅ Sell copies of the software

**Under the following conditions:**

- The above rights are granted **only if** the original license and copyright
  notice are included in all copies or substantial portions of the software.
- The software is provided **“as is”**, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and noninfringement.

> 🔒 Please ensure compliance with external dataset licenses (NIH, RSNA, LUNA16, etc.) before redistribution.

---
