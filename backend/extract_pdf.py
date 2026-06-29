import sys
try:
    from pypdf import PdfReader
    
    pdf_path = "data/Verve_Investment_V1.pdf"
    txt_path = "data/rules_and_guide.txt"
    
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n\n"
        
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(text)
    print("Successfully extracted PDF to " + txt_path)
except Exception as e:
    print(f"Failed to extract PDF: {e}")
