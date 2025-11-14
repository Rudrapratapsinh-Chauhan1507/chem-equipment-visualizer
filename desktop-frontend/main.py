from PyQt5.QtWidgets import QApplication, QWidget
import sys

# __define-ocg__ basic PyQt window starter
def main():
    varOcg = QApplication(sys.argv)  # Required app object

    window = QWidget()
    window.setWindowTitle("Starter Window")
    window.resize(400, 300)
    window.show()

    sys.exit(varOcg.exec_())

if __name__ == "__main__":
    main()
