from PyQt5.QtWidgets import QWidget, QVBoxLayout, QLabel, QLineEdit, QPushButton, QMessageBox
from api import login

class LoginWindow(QWidget):
    def __init__(self, on_login):
        super().__init__()
        self.setWindowTitle("Login")
        self.token = None
        self.on_login = on_login

        layout = QVBoxLayout()
        self.label = QLabel("Enter Username and Password")
        layout.addWidget(self.label)

        self.username_input = QLineEdit()
        self.username_input.setPlaceholderText("Username")
        layout.addWidget(self.username_input)

        self.password_input = QLineEdit()
        self.password_input.setPlaceholderText("Password")
        self.password_input.setEchoMode(QLineEdit.Password)
        layout.addWidget(self.password_input)

        self.login_button = QPushButton("Log In")
        self.login_button.clicked.connect(self.try_login)
        layout.addWidget(self.login_button)

        self.setLayout(layout)

    def try_login(self):
        username = self.username_input.text()
        password = self.password_input.text()
        try:
            token = login(username, password)
            self.on_login(token)
            self.close()
        except Exception as e:
            QMessageBox.warning(self, "Login Failed", "Invalid credentials or network error.")
