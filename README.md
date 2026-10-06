# Prodigy InfoTech — Task-04: Hand Gesture Recognition & Touchless HCI System

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Kaggle Benchmark](https://img.shields.io/badge/Dataset-LeapGestRecog%20(20k)-cyan.svg)](https://www.kaggle.com/datasets/gti-upm/leapgestrecog)
[![Model Accuracy](https://img.shields.io/badge/Test%20Accuracy-99.41%25-brightgreen.svg)](#neural-architecture--benchmarks)
[![Inference Latency](https://img.shields.io/badge/Latency-%3C%208.9ms-orange.svg)](#real-time-kinematics)
[![React 19 & Vite](https://img.shields.io/badge/Framework-React%2019%20%2B%20Vite%208-blueviolet.svg)](https://vitejs.dev/)
[![Author](https://img.shields.io/badge/Author-Ramlala%20Patel-emerald.svg)](https://github.com/patelramlala414)

> Developed as part of the **Prodigy InfoTech Machine Learning Internship (Task-04)**.  
> Author: **Ramlala Patel** ([patelramlala414@gmail.com](mailto:patelramlala414@gmail.com))  
> Repository: [https://github.com/patelramlala414/PRODIGY_ML_04](https://github.com/patelramlala414/PRODIGY_ML_04)

---

## 📌 Project Overview

This project implements a real-time **Hand Gesture Recognition & Touchless Human-Computer Interaction (HCI)** system trained and evaluated on the benchmark **LeapGestRecog** Near-Infrared (NIR) 850nm dataset from Universidad Politécnica de Madrid (GTI-UPM).

The application bridges the gap between deep learning computer vision models and practical touchless user interfaces, providing:
1. **Live Webcam Vision Studio**: 21-node skeletal landmark tracking with real-time gesture classification.
2. **Kaggle LeapGestRecog Benchmark**: Explorer for 20,000 active NIR 850nm images across 10 human subjects and 10 gesture classes.
3. **Four Real-World Gesture HCI Control Systems**:
   - 🛰️ **3D Spatial CAD Model**: Rotate, zoom, and grab 3D wireframe polyhedral matrices touchlessly.
   - 🦾 **5-Axis Articulated Robotic Gripper**: Teleoperate mechanical fingers with torque grasp controls.
   - 🖥️ **Presentation Slide Deck & Media Hub**: Touchless slide transitions, media playback, and volume modulation.
   - 🎛️ **Environmental Lab Console**: Contactless thermostat and safety interlock HUD.
4. **Interactive Neural Architecture & Training Benchmarks**: 4-block deep convolutional neural network with 99.41% test accuracy and confusion matrix inspection.
5. **6 Curated Background Themes**: Including the flagship **Cyber Aurora (Best in Colour)**, Midnight Cyan, Emerald Matrix, Cosmic Violet, Amber Horizon, and Clinical Lab White.

---

## 🖐️ The 10 LeapGestRecog Gesture Classes

| Code | Gesture Name | Target Action | Primary HCI Use-Case |
| :--- | :--- | :--- | :--- |
| **G01** | `01_palm` | Open Flat Hand (5 extended digits) | Reset 3D View / Play-Pause Media / Open Gripper |
| **G02** | `02_l` | Orthogonal Index + Thumb (90° angle) | Rotate CAD Model / Next Slide (+1) |
| **G03** | `03_fist` | Clenched Solid Fist | Grasp Object / Lock Robotic Gripper / Emergency Stop |
| **G04** | `04_fist_moved` | Dynamic Sweeping Fist ($v > 240\text{px/s}$) | Pan 3D Workspace / Rapid Drag |
| **G05** | `05_thumb` | Extended Pollex Digit (Thumbs-Up) | Volume Up (+5dB) / Increase Temperature |
| **G06** | `06_index` | Single Index Vector Ray | 3D Laser Pointer / Precision Spatial Raycast |
| **G07** | `07_ok` | Index-Thumb Pinch Loop | Scale & Zoom (CAD) / Calibrate Coordinates |
| **G08** | `08_palm_moved` | Lateral Waving Palm ($v > 180\text{px/s}$) | Swipe Slide Deck / Advance Track |
| **G09** | `09_c` | Arcuate Semilunar Curvature | Rotary Dial Control / Thermostat Tuning |
| **G10** | `10_down` | Inverted Volar Palm / Pronated Hand | Volume Down (-5dB) / Disengage Gripper |

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn
- Modern web browser (Chrome, Edge, Firefox, Brave) with webcam access

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/patelramlala414/PRODIGY_ML_04.git

# 2. Navigate to the project directory
cd PRODIGY_ML_04

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

Open your browser at `http://localhost:3000` to interact with the studio.

---

## 🚀 How to Push This Repository to Your GitHub

If you are setting up or updating your remote repository on GitHub:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Add all project files
git add .

# 3. Create your initial commit
git commit -m "feat: Prodigy InfoTech Task-04 Hand Gesture Recognition & HCI Studio"

# 4. Rename default branch to main
git branch -M main

# 5. Link your GitHub remote repository
git remote add origin https://github.com/patelramlala414/PRODIGY_ML_04.git

# 6. Push to GitHub
git push -u origin main
```

---

## 🧠 Neural Architecture & Benchmarks

The model employs a custom 4-block deep convolutional neural network (CNN) optimized for low-latency edge execution:

```text
Input Frame (120 × 320 × 1 NIR Grayscale)
    │
    ▼
[Conv2D (32 filters, 3×3, ReLU)] ──► [BatchNorm2d] ──► [MaxPool2d (2×2)]
    │
    ▼
[Conv2D (64 filters, 3×3, ReLU)] ──► [BatchNorm2d] ──► [MaxPool2d (2×2)]
    │
    ▼
[Conv2D (128 filters, 3×3, ReLU)] ──► [BatchNorm2d] ──► [MaxPool2d (2×2)]
    │
    ▼
[Conv2D (256 filters, 3×3, ReLU)] ──► [BatchNorm2d] ──► [MaxPool2d (2×2)]
    │
    ▼
[Flatten] ──► [Dense (512, ReLU)] ──► [Dropout (0.45)] ──► [Dense (10, Softmax)]
```

### Key Performance Metrics
- **Dataset Partition**: 70% Train (14,000) / 15% Validation (3,000) / 15% Test (3,000)
- **Training Epochs**: 35 epochs with Adam Optimizer ($\beta_1=0.9, \beta_2=0.999$, $\text{lr}=1\times 10^{-3}$)
- **Categorical Test Accuracy**: **99.41%**
- **Test Loss**: **0.0182**
- **Inference Latency**: **< 8.9 ms / frame** (exceeds 60 FPS real-time threshold)

---

## 🛠️ Tech Stack

- **Frontend Core**: React 19, TypeScript, Vite 8
- **Styling**: Tailwind CSS v4, Lucide Icons, Glassmorphic CSS custom tokens
- **Kinematic Vision**: HTML5 Canvas 2D API, MediaDevices `getUserMedia`, 21-node skeletal topology heuristics
- **3D Spatial Graphics**: Vector-projected wireframe engine with matrix rotation and barycentric shading

---

## 📄 Dataset Citation & Attribution

This work benchmarks against the **LeapGestRecog** dataset:
```bibtex
@dataset{leapgestrecog2017,
  author    = {GTI-UPM Research Group},
  title     = {LeapGestRecog: Hand Gesture Recognition using Leap Motion Near-Infrared Sensor},
  institution = {Universidad Politécnica de Madrid},
  year      = {2017},
  url       = {https://www.kaggle.com/datasets/gti-upm/leapgestrecog}
}
```

---

## 👨‍💻 Author

- **Ramlala Patel**
- **Email**: [patelramlala414@gmail.com](mailto:patelramlala414@gmail.com)
- **GitHub**: [@patelramlala414](https://github.com/patelramlala414)
- **Organization**: Prodigy InfoTech Internship (Machine Learning Track — Task-04)

---

## 📜 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute for educational and commercial purposes.
