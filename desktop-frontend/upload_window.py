from PyQt5.QtWidgets import QWidget, QVBoxLayout, QLabel, QPushButton, QFileDialog, QMessageBox
from api import upload_csv

class UploadWindow(QWidget):
    def __init__(self, token, on_upload):
        super().__init__()
        self.token = token
        self.on_upload = on_upload
        self.file_path = None
        self.setWindowTitle("Upload Equipment CSV")

        layout = QVBoxLayout()
        self.label = QLabel("Choose and Upload CSV File")
        layout.addWidget(self.label)

        self.choose_btn = QPushButton("Choose File")
        self.choose_btn.clicked.connect(self.choose_file)
        layout.addWidget(self.choose_btn)

        self.upload_btn = QPushButton("Upload")
        self.upload_btn.clicked.connect(self.upload_file)
        layout.addWidget(self.upload_btn)

        self.setLayout(layout)

    def choose_file(self):
        file_name, _ = QFileDialog.getOpenFileName(self, "Open CSV file", "", "CSV Files (*.csv)")
        if file_name:
            self.file_path = file_name
            self.label.setText(f"Selected: {file_name}")

    def upload_file(self):
        if not self.file_path:
            QMessageBox.warning(self, "No File", "Please choose a CSV file first.")
            return
        try:
            result = upload_csv(self.file_path, self.token)
            QMessageBox.information(self, "Upload Success", "File uploaded & analyzed.")
            self.on_upload(result)
        except Exception as e:
            QMessageBox.warning(self, "Upload Failed", f"Upload failed: {e}")
