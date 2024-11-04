from flask import Flask
from markupsafe import escape
from flask import render_template, request
from backend.parse import parse_input
import PyPDF2
import google.generativeai as genai
from dotenv import load_dotenv
import os

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html') 

@app.route('/hello/')
@app.route('/hello/<name>')
def hello(name=None):
    return render_template('hello.html', person=name)

@app.route('/handle_submission/', methods=['POST'])
def handle_submission():
    if 'files' not in request.files:
        return "No files uploaded", 400
    
    files = request.files.getlist('files')
    additional_info = request.form.get('additionalInfo', '')

    for file in files:
        print(f"Received file: {file.filename}")
        
        if file.filename.endswith('.pdf'):
            try:
                reader = PyPDF2.PdfReader(file)
                text = ""
                for page in reader.pages:
                    text += page.extract_text()
                    text = parse_input(text)
                #response = model.generate_content(text)
                print(f"Contents of {file.filename}:\n{text}")
                #print(f"Response: {response}")
            except Exception as e:
                print(f"Error reading PDF file {file.filename}: {e}")
        elif file.filename.endswith('.txt'):
            text = file.read().decode('utf-8')
            text = parse_input(text)
            #response = model.generate_content(text)
            print(f"Contents of {file.filename}:\n{text}")  
            #print(f"Response: {response}")
        else:
            print(f"Unsupported file type: {file.filename}")

    print("Received info: " + additional_info)
    
    return "Files processed successfully!", 200

if __name__ == '__main__':
    app.run(debug=True)