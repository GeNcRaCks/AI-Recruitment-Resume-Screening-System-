"""
Resume text extraction for PDF and DOCX files.

Handles:
- PDF: standard text extraction, multi-column layout hints, password-protected
  and corrupted files, and detection of scanned (image-only) PDFs.
- DOCX: paragraphs, tables (including nested tables), text boxes/shapes,
  and headers/footers — all walked in true document reading order.
"""
import os
from docx import Document
from docx.oxml.ns import qn
from docx.oxml.table import CT_Tbl
from docx.oxml.text.paragraph import CT_P
from docx.table import Table
from docx.text.paragraph import Paragraph
import pdfplumber

class PDFExtractionError(Exception):
    """Raised when a PDF cannot be read at all (corrupted, encrypted, etc.)."""

def extract_text_from_pdf(path: str) -> str:
    text_parts = []
    try:
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                try:
                    page_text = page.extract_text(layout=True) or ""
                except TypeError:
                    page_text = page.extract_text() or ""
                text_parts.append(page_text)
    except Exception as e:
        raise PDFExtractionError(f"Could not read PDF '{path}': {e}") from e

    full_text = "\n".join(text_parts).strip()

    if not full_text:
        raise PDFExtractionError(
            f"'{path}' produced no extractable text. This usually means it's "
            "a scanned/image-based PDF with no text layer. OCR (e.g. "
            "pytesseract) would be needed to read it — not handled here."
        )

    return full_text

def _iter_block_items(parent):
    """
    Yield each paragraph and table in a docx container (document body or a
    table cell) in the order they actually appear — not "all paragraphs then
    all tables", which loses the resume's real reading order.
    """
    if hasattr(parent, "element"):
        parent_elm = parent.element.body
    else:
        parent_elm = parent._tc  

    for child in parent_elm.iterchildren():
        if isinstance(child, CT_P):
            yield Paragraph(child, parent)
        elif isinstance(child, CT_Tbl):
            yield Table(child, parent)


def _extract_cell_text(cell) -> str:
    """Recursively extract a table cell's text, including nested tables."""
    parts = []
    for block in _iter_block_items(cell):
        if isinstance(block, Paragraph):
            if block.text.strip():
                parts.append(block.text)
        elif isinstance(block, Table):
            for row in block.rows:
                for nested_cell in row.cells:
                    nested_text = _extract_cell_text(nested_cell)
                    if nested_text.strip():
                        parts.append(nested_text)
    return "\n".join(parts)

def _extract_textboxes(doc: Document) -> list[str]:
    """
    Extract text from floating text boxes / shapes (w:txbxContent), which
    python-docx's normal paragraph/table APIs do not read at all. Common in
    sidebar-style creative resume templates.
    """
    texts = []
    body = doc.element.body
    for txbx in body.iter(qn("w:txbxContent")):
        run_texts = [t.text for t in txbx.iter(qn("w:t")) if t.text]
        if run_texts:
            texts.append(" ".join(run_texts))
    return texts


def _extract_headers_footers(doc: Document) -> list[str]:
    """Extract any text placed in page headers/footers (occasionally used
    for name/contact info in some templates)."""
    texts = []
    for section in doc.sections:
        for part in (section.header, section.first_page_header, section.even_page_header,
                     section.footer, section.first_page_footer, section.even_page_footer):
            for p in part.paragraphs:
                if p.text.strip():
                    texts.append(p.text)
    return texts

def extract_text_from_docx(path: str) -> str:
    if path.lower().endswith(".doc"):
        raise ValueError(
            f"'{path}' is a legacy .doc (binary Word) file, which python-docx "
            "cannot read. Convert it to .docx first (e.g. open and re-save in "
            "Word, or `libreoffice --headless --convert-to docx <file>`)."
        )
    doc = Document(path)
    parts = []
    for block in _iter_block_items(doc):
        if isinstance(block, Paragraph):
            if block.text.strip():
                parts.append(block.text)
        elif isinstance(block, Table):
            for row in block.rows:
                for cell in row.cells:
                    cell_text = _extract_cell_text(cell)
                    if cell_text.strip():
                        parts.append(cell_text)
    parts.extend(_extract_textboxes(doc))
    parts.extend(_extract_headers_footers(doc))
    full_text = "\n".join(parts).strip()
    if not full_text:
        raise ValueError(f"'{path}' produced no extractable text — the file may be empty or corrupted.")
    return full_text

def extract_resume_text(path: str) -> str:
    if not os.path.exists(path):
        raise FileNotFoundError(f"File not found: {path}")
    lower = path.lower()
    if lower.endswith(".pdf"):
        return extract_text_from_pdf(path)
    elif lower.endswith(".docx"):
        return extract_text_from_docx(path)
    elif lower.endswith(".doc"):
        return extract_text_from_docx(path)  
    else:
        raise ValueError(f"Unsupported file format: {path}")