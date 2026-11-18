"""Saca como JPEG las páginas de un PDF hecho con capturas (jsPDF, el botón de PDF de Moodle).

Uso: py -I extraer-paginas.py entrada.pdf carpeta_salida
Solo usa la biblioteca estándar. Cada página de esos PDF es una imagen JPEG (DCTDecode).
"""
import re
import sys
from pathlib import Path

JPEG_START = b"\xff\xd8"
JPEG_END = b"\xff\xd9"


def extraer(pdf: Path, salida: Path) -> int:
    data = pdf.read_bytes()
    salida.mkdir(parents=True, exist_ok=True)
    n = 0
    for m in re.finditer(rb"/Filter\s*/DCTDecode\s*>>\s*stream\r?\n", data):
        start = m.end()
        end = data.find(b"endstream", start)
        chunk = data[start:end]
        if not chunk.startswith(JPEG_START):
            continue
        chunk = chunk[: chunk.rfind(JPEG_END) + 2]
        (salida / f"pag_{n + 1:03d}.jpg").write_bytes(chunk)
        n += 1
    return n


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit("Uso: py -I extraer-paginas.py entrada.pdf carpeta_salida")
    total = extraer(Path(sys.argv[1]), Path(sys.argv[2]))
    print(f"{total} páginas extraídas")
    assert total > 0, "No se ha encontrado ninguna página JPEG: ¿el PDF tiene texto? Prueba con pdftotext."
