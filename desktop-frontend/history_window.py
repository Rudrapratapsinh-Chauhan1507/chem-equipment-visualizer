from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QLabel, QListWidget,
    QListWidgetItem, QFrame
)
from PyQt5.QtCore import Qt
from api import fetch_history

class HistoryWindow(QWidget):
    def __init__(self, token, on_select):
        super().__init__()
        self.token = token
        self.on_select = on_select

        self.setWindowTitle("Upload History")
        self.setFixedSize(420, 360)

        self._build_ui()
        self.reload_history()

    def _build_ui(self):
        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(35, 35, 35, 35)
        main_layout.setSpacing(15)

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
        card_layout.setContentsMargins(25, 25, 25, 25)
        card_layout.setSpacing(10)

        # Title
        title = QLabel("📄 Recently Uploaded Files")
        title.setStyleSheet("font-size: 18px; font-weight: 700; color: #003b6d;")
        title.setAlignment(Qt.AlignCenter)
        card_layout.addWidget(title)

        # List Widget
        self.list_widget = QListWidget()
        self.list_widget.setStyleSheet("""
            QListWidget {
                border: none;
                background: #f5faff;
                border-radius: 8px;
                padding: 6px;
            }
            QListWidget::item {
                padding: 10px;
                border-radius: 6px;
                color: #003d66;
                font-size: 14px;
            }
            QListWidget::item:selected {
                background: #296cad;
                color: white;
            }
        """)
        self.list_widget.itemClicked.connect(self.handle_select)
        card_layout.addWidget(self.list_widget)

        main_layout.addWidget(card)

    def reload_history(self):
        self.list_widget.clear()
        try:
            history = fetch_history(self.token)
            if not history:
                self.list_widget.addItem("No history available.")
                return

            for item in history:
                txt = f"ID {item['id']} | {item['file'].split('/')[-1]} | {item['upload_time'][:19]}"
                list_item = QListWidgetItem(txt)
                self.list_widget.addItem(list_item)

        except Exception:
            self.list_widget.addItem("⚠ Failed to load history")

    def handle_select(self, item):
        dataset_id = int(item.text().split()[1])
        self.on_select(dataset_id)
        self.close()
