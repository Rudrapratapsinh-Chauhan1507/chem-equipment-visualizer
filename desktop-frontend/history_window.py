from PyQt5.QtWidgets import QWidget, QVBoxLayout, QLabel, QListWidget
from api import fetch_history

class HistoryWindow(QWidget):
    def __init__(self, token, on_select):
        super().__init__()
        self.token = token
        self.on_select = on_select
        self.setWindowTitle("Upload History")

        layout = QVBoxLayout()
        self.label = QLabel("Last 5 Uploaded Datasets")
        layout.addWidget(self.label)

        self.list_widget = QListWidget()
        self.list_widget.itemClicked.connect(self.handle_select)
        layout.addWidget(self.list_widget)

        self.setLayout(layout)
        self.reload_history()

    def reload_history(self):
        self.list_widget.clear()
        try:
            history = fetch_history(self.token)
            for item in history:
                self.list_widget.addItem(f"ID {item['id']}: {item['upload_time'][:19].replace('T',' ')}")
        except Exception:
            self.label.setText("Failed to load history.")

    def handle_select(self, item):
        dataset_id = int(item.text().split()[1])
        self.on_select(dataset_id)
