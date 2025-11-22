import sys
from PyQt5.QtWidgets import QApplication, QWidget, QVBoxLayout, QPushButton, QLabel, QFrame
from PyQt5.QtCore import Qt


class MainApp(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Chemical Equipment Visualizer")
        self.resize(900, 600)  # Larger dashboard window
        self.setMinimumSize(900, 600)

        self.token = None
        self.selected_id = None
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(50, 40, 50, 40)
        layout.setSpacing(35)

        # ----------------- TITLE -----------------
        title = QLabel("🧪 Chemical Equipment Visualizer")
        title.setAlignment(Qt.AlignCenter)
        title.setStyleSheet("""
            QLabel {
                font-size: 22px;
                font-weight: 700;
                color: #003b6d;
            }
        """)
        layout.addWidget(title)

        # ----------------- BUTTON CONTAINER -----------------
        card = QFrame()
        card.setStyleSheet("""
            QFrame {
                background: #ffffff;
                border-radius: 14px;
                border: 1px solid #cddce8;
            }
        """)
        card_layout = QVBoxLayout(card)
        card_layout.setContentsMargins(40, 30, 40, 30)
        card_layout.setSpacing(18)

        # ---------- BUTTON STYLE ----------
        button_style = """
            QPushButton {
                background-color: #296cad;
                color: white;
                font-size: 15px;
                padding: 12px;
                border-radius: 8px;
                font-weight: 600;
            }
            QPushButton:hover {
                background-color: #1f5588;
            }
            QPushButton:disabled {
                background-color: #9bb8d1;
                color: #dfe6ee;
            }
        """

        # ----------------- BUTTONS -----------------
        from login_window import LoginWindow
        from upload_window import UploadWindow
        from history_window import HistoryWindow
        from summary_window import SummaryWindow

        self.login_btn = QPushButton("🔐 Login")
        self.login_btn.setStyleSheet(button_style)
        self.login_btn.clicked.connect(self.open_login)
        card_layout.addWidget(self.login_btn)

        self.upload_btn = QPushButton("⬆ Upload CSV")
        self.upload_btn.setStyleSheet(button_style)
        self.upload_btn.clicked.connect(self.open_upload)
        self.upload_btn.setEnabled(False)
        card_layout.addWidget(self.upload_btn)

        self.history_btn = QPushButton("📄 History")
        self.history_btn.setStyleSheet(button_style)
        self.history_btn.clicked.connect(self.open_history)
        self.history_btn.setEnabled(False)
        card_layout.addWidget(self.history_btn)

        self.summary_btn = QPushButton("📊 Show Summary")
        self.summary_btn.setStyleSheet(button_style)
        self.summary_btn.clicked.connect(self.open_summary)
        self.summary_btn.setEnabled(False)
        card_layout.addWidget(self.summary_btn)

        layout.addWidget(card)

        # Save reference for windows
        self.LoginWindow = LoginWindow
        self.UploadWindow = UploadWindow
        self.HistoryWindow = HistoryWindow
        self.SummaryWindow = SummaryWindow

    # ---------------- ACTIONS ----------------
    def open_login(self):
        self.login_window = self.LoginWindow(self.handle_login)
        self.login_window.show()

    def handle_login(self, token):
        self.token = token
        self.upload_btn.setEnabled(True)
        self.history_btn.setEnabled(True)
        self.summary_btn.setEnabled(bool(self.selected_id))

    def open_upload(self):
        self.upload_window = self.UploadWindow(self.token, self.handle_upload)
        self.upload_window.show()

    def handle_upload(self, result):
        self.selected_id = result["id"]
        self.summary_btn.setEnabled(True)

        # 💥 Auto-open summary immediately
        self.summary_window = self.SummaryWindow(self.token, self.selected_id)
        self.summary_window.show()

    def open_history(self):
        self.history_window = self.HistoryWindow(self.token, self.handle_select_from_history)
        self.history_window.show()

    def handle_select_from_history(self, dataset_id):
        self.selected_id = dataset_id
        self.summary_btn.setEnabled(True)

    def open_summary(self):
        if self.selected_id:
            self.summary_window = self.SummaryWindow(self.token, self.selected_id)
            self.summary_window.show()


# ------------- APP EXECUTION -------------
if __name__ == "__main__":
    app = QApplication(sys.argv)
    main = MainApp()
    main.show()
    sys.exit(app.exec_())
