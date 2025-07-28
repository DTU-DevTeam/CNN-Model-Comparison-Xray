# [cite_start]Research and Comparison of CNN Models (U-Net, YOLO) for Pathology Diagnosis via X-ray Imagery 

[cite_start]**Version:** 1.0 [cite: 3]
[cite_start]**Executing Team:** Group 4 – SIC 2025 [cite: 4]

---

## 📖 Project Summary

[cite_start]This project, “Research and Comparison of CNN Models (U-Net, YOLO) for Pathology Diagnosis via X-ray Imagery,” is a strategic Research and Development (R&D) initiative.  [cite_start]The primary goal is to identify the optimal technology platform for our company's future line of intelligent medical products. 

[cite_start]The final deliverable will be a data-driven technology recommendation and a functional prototype software. [cite: 8]

## 🎯 Core Objective

[cite_start]The main objective is to complete the research, comparison, and selection of the optimal CNN model architecture between U-Net and YOLO (and their variants). [cite: 12] [cite_start]This will be done to build an effective prototype for diagnosing two common pathologies on chest X-rays: detecting pulmonary nodules and segmenting pneumonia. [cite: 12]

## 🔬 Methodology & Hypotheses

Our research is guided by two central hypotheses:

* [cite_start]**Hypothesis 1: YOLO for Rapid Screening**: We hypothesize that YOLO's architecture (e.g., YOLOv8) is best suited for the rapid detection of discrete objects like pulmonary nodules, prioritizing speed (FPS) and high mAP for mass screening applications. [cite: 18, 19, 20, 21]
* [cite_start]**Hypothesis 2: U-Net for Precise Analysis**: We hypothesize that U-Net's architecture (e.g., U-Net++) is superior for accurately segmenting diffuse conditions like pneumonia, where boundary accuracy (measured by Dice/IoU) is critical for assessing the extent of the disease. [cite: 22, 23, 24, 25]

## 🛠️ Technology Stack

* **Frontend:** React (TypeScript + SWC)
* **Backend & Model Serving:** Python, Flask/FastAPI
* **AI/ML Models:** PyTorch/TensorFlow, U-Net++, YOLOv8
* **Deployment:** Docker, Google Vertex AI / AWS SageMaker

## 🚀 Getting Started

Instructions on how to set up the project locally will be updated here.

```bash
# Clone the repository
git clone [https://github.com/DTU-DevTeam/CNN-Model-Comparison-Xray](https://github.com/DTU-DevTeam/CNN-Model-Comparison-Xray)

# Navigate to the project directory
cd CNN-Model-Comparison-Xray

# Install dependencies (to be updated)
npm install

# Run the application (to be updated)
npm run dev
```

## 📈 Project Status

**Current Phase: [Phase 1: Preparation & Data Curation]**

* [X] Set up environment and infrastructure.
* [X] Collect raw X-ray data.
* [ ] Build annotation process & tools.
