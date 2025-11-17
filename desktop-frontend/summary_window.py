from PyQt5.QtWidgets import QWidget, QVBoxLayout, QLabel, QPushButton, QFileDialog, QMessageBox
from PyQt5.QtGui import QIcon
from api import fetch_summary
import matplotlib.pyplot as plt
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas

class SummaryWindow(QWidget):
    def __init__(self, token, dataset_id):
        super().__init__()
        self.setWindowTitle(f"Summary for Dataset #{dataset_id}")
        self.figure = plt.figure(figsize=(7, 3))
        self.canvas = FigureCanvas(self.figure)

        layout = QVBoxLayout()
        self.label = QLabel("Summary Statistics & Charts")
        layout.addWidget(self.label)
        layout.addWidget(self.canvas)

        self.pdf_btn = QPushButton("Export as PDF")
        self.pdf_btn.setIcon(QIcon('assets/icons/pdf.png'))
        self.pdf_btn.clicked.connect(self.export_pdf)
        layout.addWidget(self.pdf_btn)

        self.setLayout(layout)
        self.show_summary(token, dataset_id)

    def show_summary(self, token, dataset_id):
        self.figure.clear()
        try:
            data = fetch_summary(dataset_id, token)
            ax = self.figure.add_subplot(121)
            ax.set_title("Type Distribution")
            ax.bar(data["type_distribution"].keys(), data["type_distribution"].values())
            ax.set_xlabel("Type")
            ax.set_ylabel("Count")

            ax2 = self.figure.add_subplot(122)
            ax2.set_title("Parameter Averages")
            ax2.bar(
                ["Flowrate", "Pressure", "Temperature"],
                [data["average_flowrate"], data["average_pressure"], data["average_temperature"]],
                color=['#5dc3f7', '#ffb45e', '#81e291']
            )
            ax2.set_ylabel("Average Value")
            self.canvas.draw()
        except Exception as e:
            self.label.setText(f"Failed to load summary: {e}")

    def export_pdf(self):
        filename, _ = QFileDialog.getSaveFileName(self, "Save as PDF", "", "PDF Files (*.pdf)")
        if filename:
            if not filename.lower().endswith('.pdf'):
                filename += '.pdf'
            try:
                self.figure.savefig(filename, format="pdf")
                QMessageBox.information(self, "Export", f"PDF saved: {filename}")
            except Exception as e:
                QMessageBox.warning(self, "Error", f"Failed to export PDF: {e}")
