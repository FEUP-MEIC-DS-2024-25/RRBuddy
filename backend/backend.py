import google.generativeai as genai
from dotenv import load_dotenv
import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import logging
import files
import prompting
from pathlib import Path

load_dotenv()

genai.configure(api_key=os.environ["API_KEY"])
model = genai.GenerativeModel("gemini-1.5-flash")

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
logging.basicConfig(level=logging.INFO)

curr_dir = Path(__file__).parent.absolute()
out_dir = Path(f"{curr_dir}/output")
out_dir.mkdir(parents=True, exist_ok=True)
pathfile = Path(f"{out_dir}/Classification.txt")

@app.route('/api/process', methods=['POST'])
def process():
    try:
        output_type = request.form.get('outputType')
        output_language = request.form.get('outputLanguage')
        ai_model = request.form.get('aiModel')
        additional_info = request.form.get('additionalInfo')
        files_data = request.files.getlist('files')

        files_text = files.process_files(files_data)

        prompt = prompting.generate(files_text, additional_info, output_language)

        response = model.generate_content(prompt)

        files.create_response_txt(response.candidates[0].content.parts[0].text, pathfile)
        return send_file(pathfile,as_attachment=True)

    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({"error": str(e)}), 500
    

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001)
