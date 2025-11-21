# 🧪 Chemical Equipment Parameter Visualizer

A hybrid data analytics platform for interpreting and visualizing chemical equipment data from CSV files.  
Built with a shared **Django REST API** used by both a **Web Interface** and a **Desktop Application**, this project enables flexible industrial and laboratory use for analyzing parameters like **Flowrate, Pressure, Temperature, and Equipment Type**.

---

## 🌟 Core Highlights

- 🧠 **Unified analytics backend** using Django REST API
- 💻 **Two Frontend Clients**
  - 🌐 Web App (React + Chart.js)
  - 🖥 Desktop App (PyQt + Matplotlib)
- 📥 **Smart CSV Interpretation**
  - Detects parameter names automatically, even when columns vary (e.g., `Temp`, `Temperature`, `Flow`, `Flowrate`, etc.)
- 📊 **Interactive Visual Analytics**
  - Bar charts, Pie charts, Trend comparisons (Flow, Pressure, Temperature)
- 🔐 **Secure User Data**
  - Token-based authentication
- 💾 **Smart Storage Optimization**
  - Retains only the last **5 CSV uploads per user** to reduce storage usage

---

## 🧰 Tech Stack Overview

| Layer | Technology |
|--------|------------|
| **Backend API** | Django, DRF, Pandas, SQLite |
| **Web UI** | React.js, Axios, Chart.js |
| **Desktop UI** | PyQt5, Matplotlib, Requests |
| **Auth & Storage** | DRF Token Authentication + SQLite |
| **Visualization** | Chart.js (Web) & Matplotlib (Desktop) |

---

## 📁 Directory Structure
```
chem-equipment-visualizer/
│
├── backend/ # REST API + analytics engine
├── web-frontend/ # React UI for browsers
├── desktop-frontend/ # PyQt UI for desktop users
│
├── README.md # 🧾 Project overview
├── PROJECT_PLAN.md # 📌 Milestone roadmap
└── CONTRIBUTING.md # 🤝 Development guidelines


---

## 🚀 Quick Start Guide
```
### 🔧 Backend (Django API)
```bash
cd backend
python -m venv env
env\Scripts\activate          # Windows
# OR source env/bin/activate  # Mac/Linux
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

```
🌐 Web Application (React)
```bash
cd web-frontend
npm install
npm start

```
🖥 Desktop Application (PyQt)
```bash
cd desktop-frontend
pip install -r requirements.txt
python main.py

```
🔐 Key API Endpoints
```bash
Method	Endpoint	Purpose
POST	/api/register/	Create a new user
POST	/api/login/	Authenticate & retrieve token
POST	/api/upload/	Upload CSV & auto-analyze
GET	/api/history/	Fetch last 5 datasets
GET	/api/summary/<id>/	Get dataset summary
DELETE	/api/dataset/delete/<id>/	Remove a dataset

```
🧭 Suggested Future Enhancements
```bash
Feature	Benefit
📄 PDF Report Export	Share or document analysis results
🔮 Trend Prediction & Anomaly Detection	Predict maintenance issues
🛠 Admin Panel	Multi-user equipment data monitoring
☁ Cloud Deployment	Remote access & scalability
💽 Desktop .exe Packaging	Industrial and factory floor usability
🧑‍🔬 Final Thought

```
This project is more than a CSV visualizer —
it’s a step toward intelligent chemical equipment monitoring, accessible to students, labs, and industry professionals.

🎯 Practical. Reliable. Extensible.