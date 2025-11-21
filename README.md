# 🧪 Chemical Equipment Parameter Visualizer

A hybrid data analytics platform designed for analyzing industrial chemical equipment parameters from CSV files. The system supports **web** and **desktop** applications connected to a shared API backend, enabling flexible usage in laboratories, industry control rooms, and research environments.

---

### 🌟 Core Highlights
- **Unified analytics backend** (Django REST API)
- **Two frontend experiences**
  - 🌐 **Web App** (React + Chart.js)
  - 🖥 **Desktop App** (PyQt + Matplotlib)
- **Smart CSV interpretation**
  - Automatically detects varying column names (Flowrate, Pressure, Temperature & Equipment Type)
- **Interactive visual analytics**
  - Bar charts, Pie charts & Trendline comparisons
- **Secure & personal data**
  - Token-based authentication
- **Smart storage**
  - Retains only the last 5 uploads per user

---

### 🧰 Tech Stack Overview

| Layer | Technology |
|--------|------------|
| **Backend API** | Django, DRF, Pandas, SQLite |
| **Web UI** | React.js, Axios, Chart.js |
| **Desktop UI** | PyQt5, Matplotlib, Requests |
| **Auth & Storage** | DRF Token Auth + SQLite |
| **Visualization** | Custom UI + Chart.js + Matplotlib |

---

### 📁 Directory Structure

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

### 🚀 Quick Start

#### 🔧 Backend (Django API)
```bash
cd backend
python -m venv env
env\Scripts\activate   # Windows
# OR source env/bin/activate  # Mac/Linux
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

🌐 Web App (React)
cd web-frontend
npm install
npm start

🖥 Desktop App (PyQt)
cd desktop-frontend
pip install -r requirements.txt
python main.py

🔐 Key API Endpoints
Method	Endpoint	Purpose
POST	/api/register/	Create new user
POST	/api/login/	Authenticate & retrieve token
POST	/api/upload/	Upload CSV & auto-analyze
GET	/api/history/	Fetch last 5 datasets
GET	/api/summary/<id>/	Get dataset summary
DELETE	/api/dataset/delete/<id>/	Delete a dataset

🧭 Suggested Future Enhancements
Feature	Value
PDF Report Export	Share analytical results
Trend Prediction & Anomaly Detection	Preventive maintenance
Multi-user Admin Panel	Centralized monitoring
Cloud Deployment	Remote access & scalability
.exe Packaging for Desktop	Industrial-grade usability

🧑‍🔬 Final Thought

This project is more than a CSV visualizer.
It’s a step toward intelligent equipment monitoring — accessible to students, labs, and industry professionals alike.

🎯 Practical. Reliable. Extensible.

