from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QLabel, QPushButton,
    QFileDialog, QMessageBox, QFrame
)
from PyQt5.QtCore import Qt
from api import upload_csv

class UploadWindow(QWidget):
    def __init__(self, token, on_upload):
        super().__init__()
        self.token = token
        self.on_upload = on_upload
        self.file_path = None

        self.setWindowTitle("Upload CSV File")
        self.setFixedSize(480, 360)

        self._build_ui()

    def _build_ui(self):
        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(40, 40, 40, 40)
        main_layout.setSpacing(15)
        main_layout.setAlignment(Qt.AlignCenter)

        # Card
        card = QFrame()
        card.setStyleSheet("""
            QFrame {
                background: #ffffff;
                border-radius: 14px;
                border: 1px solid #cddce8;
            }
        """)
        card_layout = QVBoxLayout(card)
        card_layout.setContentsMargins(30, 35, 30, 35)
        card_layout.setSpacing(15)

        # Title
        title = QLabel("📤 Upload Equipment CSV")
        title.setStyleSheet("font-size: 22px; font-weight: 700; color: #003b6d;")
        title.setAlignment(Qt.AlignCenter)
        card_layout.addWidget(title)

        # File Label
        self.label = QLabel("Choose a CSV file to analyze")
        self.label.setStyleSheet("font-size: 14px; color: #555;")
        self.label.setAlignment(Qt.AlignCenter)
        card_layout.addWidget(self.label)

        # Choose Button
        self.choose_btn = QPushButton("Browse File")
        self.choose_btn.clicked.connect(self.choose_file)
        card_layout.addWidget(self.choose_btn)

        # Upload Button
        self.upload_btn = QPushButton("Upload & Analyze")
        self.upload_btn.clicked.connect(self.upload_file)
        card_layout.addWidget(self.upload_btn)

        main_layout.addWidget(card)

    def choose_file(self):
        file_name, _ = QFileDialog.getOpenFileName(
            self, "Open CSV File", "", "CSV Files (*.csv)"
        )
        if file_name:
            self.file_path = file_name
            self.label.setText(f"📌 Selected: {file_name.split('/')[-1]}")

    def upload_file(self):
        if not self.file_path:
            QMessageBox.warning(self, "No File", "⚠ Please choose a CSV file first.")
            return
        try:
            result = upload_csv(self.file_path, self.token)
            QMessageBox.information(self, "Upload Success", "✅ File uploaded & analyzed!")
            self.on_upload(result)
        except Exception as e:
            QMessageBox.warning(self, "Upload Failed", f"❌ Upload failed: {e}")
