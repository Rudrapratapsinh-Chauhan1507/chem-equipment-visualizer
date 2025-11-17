import sys
from PyQt5.QtWidgets import QApplication, QWidget, QVBoxLayout, QPushButton
from login_window import LoginWindow
from upload_window import UploadWindow
from history_window import HistoryWindow
from summary_window import SummaryWindow

class MainApp(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Chemical Equipment Visualizer")
        self.token = None
        self.selected_id = None
        self.init_ui()

    def init_ui(self):
        self.layout = QVBoxLayout()
        self.login_btn = QPushButton("Login")
        self.login_btn.clicked.connect(self.open_login)
        self.layout.addWidget(self.login_btn)

        self.upload_btn = QPushButton("Upload CSV")
        self.upload_btn.clicked.connect(self.open_upload)
        self.upload_btn.setEnabled(False)
        self.layout.addWidget(self.upload_btn)

        self.history_btn = QPushButton("History")
        self.history_btn.clicked.connect(self.open_history)
        self.history_btn.setEnabled(False)
        self.layout.addWidget(self.history_btn)

        self.summary_btn = QPushButton("Show Summary")
        self.summary_btn.clicked.connect(self.open_summary)
        self.summary_btn.setEnabled(False)
        self.layout.addWidget(self.summary_btn)

        self.setLayout(self.layout)

    def open_login(self):
        self.login_window = LoginWindow(self.handle_login)
        self.login_window.show()

    def handle_login(self, token):
        self.token = token
        self.upload_btn.setEnabled(True)
        self.history_btn.setEnabled(True)
        self.summary_btn.setEnabled(bool(self.selected_id))

    def open_upload(self):
        self.upload_window = UploadWindow(self.token, self.handle_upload)
        self.upload_window.show()

    def handle_upload(self, result):
        self.selected_id = result["id"]
        self.summary_btn.setEnabled(True)

    def open_history(self):
        self.history_window = HistoryWindow(self.token, self.handle_select_from_history)
        self.history_window.show()

    def handle_select_from_history(self, dataset_id):
        self.selected_id = dataset_id
        self.summary_btn.setEnabled(True)

    def open_summary(self):
        if self.selected_id:
            self.summary_window = SummaryWindow(self.token, self.selected_id)
            self.summary_window.show()

if __name__ == "__main__":
    app = QApplication(sys.argv)
    main = MainApp()
    main.resize(400, 220)
    main.show()
    sys.exit(app.exec_())
