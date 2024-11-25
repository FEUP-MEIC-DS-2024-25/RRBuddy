import math
import PyPDF2
from fpdf import FPDF

from parse import parse_input

def process_files(files):
    result = []
    
    for file in files:
        print(f"Received file: {file.filename}")
        if file.filename.endswith('.pdf'):
            try:
                reader = PyPDF2.PdfReader(file)
                text = ""
                for page in reader.pages:
                    text += page.extract_text()
                result.append(text)
            except Exception as e:
                print(f"Error reading PDF file {file.filename}: {e}")
        else:
            text = file.read().decode('utf-8')
            text = parse_input(text)
            result.append(text)
            #response = model.generate_content(text)
            print(f"Contents of {file.filename}:\n{text}")  
    
    return result

def create_response_txt(text, filepath):
    with open(filepath, 'w') as file:
        file.write(text)


def create_response_pdf(text, filepath):
    # Create a new FPDF object
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)

    # Add a new page to the PDF
    pdf.add_page()

    # Set the font and font size
    pdf.set_font('Arial', size=11)

    # Write the text to the PDF
    pdf.write(5, text)

    # Save the PDF
    pdf.output(filepath)
    

