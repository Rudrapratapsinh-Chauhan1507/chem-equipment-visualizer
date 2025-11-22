from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QLabel, QPushButton, QFileDialog, QMessageBox, QFrame, QHBoxLayout
)
from PyQt5.QtGui import QIcon
from PyQt5.QtCore import Qt
from api import fetch_summary
import matplotlib.pyplot as plt
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas


class SummaryWindow(QWidget):
    def __init__(self, token, dataset_id):
        super().__init__()
        self.setWindowTitle(f"Dataset Summary #{dataset_id}")
        self.setFixedSize(750, 430)

        self.figure = plt.figure(figsize=(7, 3))
        self.canvas = FigureCanvas(self.figure)

        self._build_ui()
        self.show_summary(token, dataset_id)

    def _build_ui(self):
        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(30, 30, 30, 30)
        main_layout.setSpacing(20)

        # -------------------------- CARD --------------------------
        card = QFrame()
        card.setStyleSheet("""
            QFrame {
                background: #ffffff;
                border-radius: 14px;
                border: 1px solid #cddce8;
            }
        """)
        card_layout = QVBoxLayout(card)
        card_layout.setContentsMargins(20, 20, 20, 20)
        card_layout.setSpacing(10)

        # -------------------------- TITLE --------------------------
        self.label = QLabel("🔎 Dataset Analysis Summary")
        self.label.setStyleSheet("font-size: 19px; font-weight: 700; color: #003b6d;")
        self.label.setAlignment(Qt.AlignCenter)
        card_layout.addWidget(self.label)

        # -------------------------- CANVAS --------------------------
        canvasFrame = QFrame()
        canvas_layout = QVBoxLayout(canvasFrame)
        canvas_layout.setContentsMargins(10, 10, 10, 10)
        canvas_layout.addWidget(self.canvas)
        canvasFrame.setStyleSheet("""
            QFrame {
                background: #f6faff;
                border-radius: 10px;
                border: 1px solid #d8e5f4;
            }
        """)
        card_layout.addWidget(canvasFrame)

        # -------------------------- BUTTON --------------------------
        self.pdf_btn = QPushButton("📄 Export as PDF")
        self.pdf_btn.setStyleSheet("""
            QPushButton {
                background-color: #296cad;
                color: white;
                font-size: 14px;
                padding: 8px 16px;
                border-radius: 8px;
                font-weight: 600;
            }
            QPushButton:hover {
                background-color: #1f5588;
            }
        """)
        self.pdf_btn.clicked.connect(self.export_pdf)
        card_layout.addWidget(self.pdf_btn, alignment=Qt.AlignCenter)

        main_layout.addWidget(card)

    # -------------------------- LOAD SUMMARY & PLOT --------------------------
    def show_summary(self, token, dataset_id):
        self.figure.clear()
        try:
            data = fetch_summary(dataset_id, token)

            # ---------- FIRST CHART ----------
            ax = self.figure.add_subplot(121)
            ax.set_title("Type Distribution", fontsize=10, weight="bold")
            ax.bar(data["type_distribution"].keys(), data["type_distribution"].values(), color="#2874A6")
            ax.set_xlabel("Type", fontsize=9)
            ax.set_ylabel("Count", fontsize=9)

            # ---------- SECOND CHART ----------
            ax2 = self.figure.add_subplot(122)
            ax2.set_title("Parameter Averages", fontsize=10, weight="bold")
            ax2.bar(
                ["Flowrate", "Pressure", "Temperature"],
                [data["average_flowrate"], data["average_pressure"], data["average_temperature"]],
                color=['#20CA7D', '#F2C335', '#E93A52']
            )
            ax2.set_ylabel("Avg Value", fontsize=9)

            self.canvas.draw()

        except Exception as e:
            self.label.setText(f"⚠ Failed to load summary")

    # -------------------------- PDF EXPORT --------------------------
    def export_pdf(self):
        filename, _ = QFileDialog.getSaveFileName(self, "Save as PDF", "", "PDF Files (*.pdf)")
        if filename:
            if not filename.lower().endswith('.pdf'):
                filename += '.pdf'
            try:
                self.figure.savefig(filename, format="pdf")
                QMessageBox.information(self, "Export", f"📌 PDF saved: {filename}")
            except Exception as e:
                QMessageBox.warning(self, "Error", f"Failed to export PDF: {e}")
