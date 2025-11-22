from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QLabel, QLineEdit,
    QPushButton, QMessageBox, QFrame
)
from PyQt5.QtCore import Qt
from api import login

class LoginWindow(QWidget):
    def __init__(self, on_login):
        super().__init__()
        self.setWindowTitle("User Login")
        self.setFixedSize(420, 330)  # Bigger UI size
        self.on_login = on_login
        self._build_ui()

    def _build_ui(self):
        # Main layout
        layout = QVBoxLayout(self)
        layout.setContentsMargins(40, 40, 40, 40)
        layout.setSpacing(15)
        layout.setAlignment(Qt.AlignCenter)

        # Card frame
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
        card_layout.setSpacing(12)

        # Title
        title = QLabel("🔐 Login")
        title.setStyleSheet("font-size: 22px; font-weight: 700; color: #003b6d;")
        title.setAlignment(Qt.AlignCenter)
        card_layout.addWidget(title)

        # Username field
        self.username_input = QLineEdit()
        self.username_input.setPlaceholderText("Enter Username")
        card_layout.addWidget(self.username_input)

        # Password field
        self.password_input = QLineEdit()
        self.password_input.setPlaceholderText("Enter Password")
        self.password_input.setEchoMode(QLineEdit.Password)
        card_layout.addWidget(self.password_input)

        # Login button
        self.login_button = QPushButton("Login")
        self.login_button.clicked.connect(self.try_login)
        card_layout.addWidget(self.login_button)

        layout.addWidget(card)

    def try_login(self):
        username = self.username_input.text().strip()
        password = self.password_input.text().strip()

        if not username or not password:
            QMessageBox.warning(self, "Missing Fields", "Username and password are required.")
            return

        try:
            token = login(username, password)
            self.on_login(token)
            self.close()
        except Exception:
            QMessageBox.warning(self, "Login Failed", "Invalid credentials or network error.")
