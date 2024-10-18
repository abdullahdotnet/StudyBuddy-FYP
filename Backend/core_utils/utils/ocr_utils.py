import os
import pytesseract
from pdf2image import convert_from_path


def pdf_to_ocr_text(pdf_path, output_text_file=None):
    """
    Convert a PDF to text using OCR.
    
    Args:
        pdf_path (str): Path to the PDF file.
        output_text_file (str): Optional path to save the OCR text. If not provided, returns text.

    Returns:
        str: Extracted text if no output file is specified.
    """
    # if not os.path.exists(pdf_path):
    #     raise FileNotFoundError(f"The file {pdf_path} does not exist.")
    
    images = convert_from_path(pdf_path, 300)
    
    extracted_text = ""
    
    for image in images:
        text = pytesseract.image_to_string(image)
        extracted_text += text + "\n"

    if output_text_file:
        with open(output_text_file, 'w') as f:
            f.write(extracted_text)
        return f"Text saved to {output_text_file}"

    return extracted_text
