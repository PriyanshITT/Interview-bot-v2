from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import chromadb.api
import os
import json
import shutil
import PyPDF2
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_chroma import Chroma
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_groq import ChatGroq
from langchain.docstore.document import Document
import uuid
import requests
from datetime import datetime
from flask_cors import CORS
import traceback
import re

# Initialize Flask app
app = Flask(__name__)
os.environ["GROQ_API_KEY"] = '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'

# Allow requests from specified origins
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://157.173.222.234:3000",
            "http://157.173.222.234:5173",
            "http://localhost:3000", 
            "https://interviewbot.intraintech.com"
        ]
    }
})
# Configuration for uploads
UPLOAD_FOLDER = 'uploads'
CHROMA_DB_FOLDER = '/root/interviewbot/Interview-bot-v2/flask-backend/chroma_db'
ALLOWED_EXTENSIONS = {'pdf'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Global session storage
sessions = {}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def clear_chroma_db():
    try:
        if os.path.exists(CHROMA_DB_FOLDER):
            for filename in os.listdir(CHROMA_DB_FOLDER):
                file_path = os.path.join(CHROMA_DB_FOLDER, filename)
                try:
                    if os.path.isfile(file_path) or os.path.islink(file_path):
                        os.unlink(file_path)  # Remove file or symbolic link
                    elif os.path.isdir(file_path):
                        shutil.rmtree(file_path)  # Remove subdirectory
                except Exception as e:
                    print(f"Failed to delete {file_path}. Reason: {e}")

            os.rmdir(CHROMA_DB_FOLDER)  # Remove the main directory
            os.makedirs(CHROMA_DB_FOLDER, exist_ok=True)
    except Exception as e:
        print(f"Error clearing Chroma DB directory: {e}")

@app.route('/upload_resume', methods=['POST'])
def upload_resume():
    chromadb.api.client.SharedSystemClient.clear_system_cache()
    if 'resume' not in request.files:
        return jsonify({"error": "No resume file provided."}), 400

    resume = request.files['resume']
    if resume.filename == '' or not allowed_file(resume.filename):
        return jsonify({"error": "Invalid file type. Please upload a PDF."}), 400

    # Save uploaded resume
    filename = secure_filename(resume.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    resume.save(filepath)

    # Parse job role and experience
    job_role = request.form.get('job_role')
    experience = request.form.get('experience')
    level = request.form.get('level')
    company_name = request.form.get('company_name')
    skills = request.form.get('skills')
    domain = request.form.get('domain')
    session_id = request.form.get('session_id', str(uuid.uuid4()))
    print(job_role)
    print(experience)
    print(level)
    print(company_name)
    print(skills)
    print(domain)
    print(session_id)

    if not job_role or not experience:
        return jsonify({"error": "Job role and experience are required fields."}), 400

    timestamp = datetime.now().isoformat()

    try:
        with open(filepath, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            resume_text = " ".join(page.extract_text() for page in reader.pages)
    except Exception as e:
        return jsonify({"error": f"Error processing PDF: {str(e)}"}), 500

    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=5000, chunk_overlap=500)
    resume_splits = text_splitter.split_documents([Document(page_content=resume_text)])
    clear_chroma_db()
    vectorstore = Chroma.from_documents(documents=resume_splits, embedding=embeddings, persist_directory=CHROMA_DB_FOLDER)
    retriever = vectorstore.as_retriever()

    llm = ChatGroq(groq_api_key=os.getenv('GROQ_API_KEY'), model_name="gemma2-9b-it")

    #diversity in question

    question_system_prompt = """
    You are an AI interview bot conducting a professional job interview. Based on the candidate's resume, job role, years of experience, company name, skills, and domain, generate only one interview question.
    
    1. Cover the following topics across the interview:
       - Projects (1-2 questions)
       - Skills and technical knowledge (2-3 questions)
       - Experience and achievements (2-3 questions)
       - Certifications and educational background (1-2 questions)
       - The applied role and its responsibilities (2-3 questions)
       - General and behavioral questions (1-2 questions)

    2. Ask *one question at a time* and wait for the candidate's response before proceeding to the next question.

    3. Avoid repeating questions or topics already covered in previous questions.

    4. Ensure the interview consists of *10-12 unique questions* in total.

    5. Use the resume content to tailor each question to the candidate's profile.

    Resume Content: {context}
    Difficulty Level: {level}
    Company: {company_name}
    Job Role: {job_role}
    Experience: {experience} years
    Skills: {skills}
    Domain: {domain}

    Ask the question.
    """

    question_prompt = ChatPromptTemplate.from_messages([
        ("system", question_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{context} {input}")
    ])

    # It should ask the question from the response only if the weightage of response is good

    history_aware_retriever = create_history_aware_retriever(
        llm=llm,
        retriever=retriever,
        prompt=question_prompt
    )

    question_chain = create_stuff_documents_chain(llm, question_prompt)
    rag_chain = create_retrieval_chain(history_aware_retriever, question_chain)

    conversational_rag_chain = RunnableWithMessageHistory(
        rag_chain,
        lambda _: ChatMessageHistory(),
        input_messages_key="input",
        history_messages_key="chat_history",
        output_messages_key="answer"
    )

    sessions[session_id] = {
        "conversational_rag_chain": conversational_rag_chain,
        "resume_text": resume_text,
        "job_role": job_role,
        "experience": experience,
        "level": level,
        "company_name": company_name,
        "skills": skills,
        "domain": domain,
        "timestamp": timestamp
    }

    try:
        response = conversational_rag_chain.invoke(
            {
                "input": "Start the interview.",
                "context": resume_text,
                "chat_history": [],
                "job_role": job_role,
                "experience": experience,
                "level": level,
                "company_name": company_name,
                "skills": skills,
                "domain": domain
            },
            {"configurable": {"session_id": session_id}}
        )

        first_question = response.get('answer', 'No question generated.')
        print("first wuestion"+ first_question)
        return jsonify({"question": first_question, "session_id": session_id})

    except Exception as e:
        return jsonify({"error": f"Error generating question: {str(e)}"}), 500

@app.route('/next_question', methods=['POST'])
def next_question():
    data = request.get_json()
    session_id = data.get('session_id')
    user_answer = data.get('user_answer')
    job_role = data.get('job_role')
    experience = data.get('experience')
    question = data.get('question')
    user_id = data.get('userId')
    username=data.get('username')
    level = data.get('level')
    company_name = data.get('company_name')
    skills = data.get('skills')
    domain = data.get('domain')

    if not all([session_id, user_answer, job_role, experience, level, company_name, skills, domain]):
        return jsonify({"error": "Missing required fields."}), 400

    # Retrieve session data
    session_data = sessions.get(session_id)
    if not session_data:
        return jsonify({"error": "Invalid session ID."}), 400

    conversational_rag_chain = session_data['conversational_rag_chain']
    resume_text = session_data['resume_text']
    timestamp = session_data['timestamp']

    # Evaluate the answer
    evaluation_prompt = f"""
    Evaluate the following answer to the question: '{question}'.
    Context: {resume_text}
    Job Role: {job_role}
    Experience: {experience}
    Level: {level}
    Company: {company_name}
    Skills: {skills}
    Domain: {domain}
    
    Answer: {user_answer}
    
    Provide only an integer score from 0 to 10 based on the relevance and correctness of the answer:
    - If the answer is completely irrelevant, return 0.
    - If the answer is relevant but not perfect, return an integer between 1 and 10 based on how well it aligns with the context, job role, and candidate experience.

    Your response must strictly be a single integer value from 0 to 10.
    """
    
    #evaluation mark template

    try:
        marks_response = conversational_rag_chain.invoke(
            {
                "input": evaluation_prompt,
                "context": resume_text,
                "chat_history": [],
                "job_role": job_role,
                "experience": experience,
                "level": level,
                "company_name": company_name,
                "skills": skills,
                "domain": domain
            },
            {"configurable": {"session_id": session_id}}
        )
        marks = int(marks_response.get('answer', '0'))
        if not 1 <= marks <= 10:
            raise ValueError("Invalid marks value.")
    except Exception as e:
        return jsonify({"error": f"Error evaluating answer: {str(e)}"}), 500
    print(question)
    print(user_answer)
    print(marks)
    print(timestamp)
    print(user_id)
    print(username)
    # Store the evaluation result
    api_url = f"https://interviewbot.intraintech.com/api/api/question-answers/add/userid/{user_id}/username/{username}"
    payload = {
        "question": question,
        "answer": user_answer,
        "marks": marks,
        "timestamp": timestamp
    }

    try:
        response = requests.post(api_url, json=payload)
        if response.status_code != 200:
            return jsonify({"error": f"Failed to store data: {response.status_code} {response.text}"}), 500
    except Exception as e:
        return jsonify({"error": f"Error storing data: {str(e)}"}), 500

    # Generate the next question
    try:
        next_response = conversational_rag_chain.invoke(
            {
                "input": user_answer,
                "context": resume_text,
                "chat_history": [],
                "job_role": job_role,
                "experience": experience,
                "level": level,
                "company_name": company_name,
                "skills": skills,
                "domain": domain
            },
            {"configurable": {"session_id": session_id}}
        )

        next_question = next_response.get('answer', 'No next question generated.')
        return jsonify({"question": next_question, "session_id": session_id})

    except Exception as e:
        return jsonify({"error": f"Error generating next question: {str(e)}"}), 500

@app.route('/ats_score', methods=['POST'])
def ats_score():
    try:
        # Validate resume file
        if 'resume' not in request.files:
            return jsonify({"error": "No resume file provided."}), 400

        resume = request.files['resume']
        if resume.filename == '' or not resume.filename.lower().endswith('.pdf'):
            return jsonify({"error": "Invalid file type. Please upload a PDF."}), 400

        job_description = request.form.get('job_description')
        if not job_description:
            return jsonify({"error": "Job description is required."}), 400

        # Save the resume temporarily
        filename = secure_filename(resume.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        resume.save(filepath)

        # Extract text from PDF
        try:
            with open(filepath, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                resume_text = " ".join(page.extract_text() for page in reader.pages if page.extract_text())
        except Exception as e:
            return jsonify({"error": f"Error processing PDF: {str(e)}"}), 500

        # Initialize LLM
        llm = ChatGroq(
            groq_api_key=os.getenv('GROQ_API_KEY'),
            model_name="gemma2-9b-it"
        )

        # ATS Score Prompt (only calculates score)
        ats_score_prompt = f"""
        You are an AI that evaluates resumes against job descriptions and provides an ATS score out of 100.

        ### Evaluation Criteria:
        1. Compare the resume content with the job description.
        2. Assess the relevance of skills, experience, keywords, and overall alignment with the job role.
        3. Provide a score from 0 to 100 based on how well the resume matches the job description.
        4. Higher scores indicate a better fit for the role.

        ### Input:
        **Job Description:**
        {job_description}

        **Resume Content:**
        {resume_text}

        ### Output (JSON format):
        Provide only the following JSON object with no additional text:
        {{
            "ats_score": <integer from 0 to 100>
        }}
        """

        try:
            ats_response = llm.invoke(ats_score_prompt)
            response_text = ats_response.content.strip()

            # Extract JSON using regex to handle extra text
            json_match = re.search(r'\{.*?\}', response_text, re.DOTALL)
            if not json_match:
                raise ValueError("No valid JSON found in LLM response")

            json_text = json_match.group(0)
            ats_response_json = json.loads(json_text)
            ats_score = int(ats_response_json.get("ats_score", 0))

            if not 0 <= ats_score <= 100:
                raise ValueError("Invalid ATS score value.")

        except json.JSONDecodeError as e:
            traceback.print_exc()
            return jsonify({"error": f"Failed to parse AI response: {str(e)}. Raw response: {response_text}"}), 500
        except Exception as e:
            traceback.print_exc()
            return jsonify({"error": f"Error generating ATS score: {str(e)}. Raw response: {response_text}"}), 500

        # Store resume text and job description in session-like storage
        session_id = request.form.get('session_id', os.urandom(16).hex())
        app.config['sessions'] = getattr(app.config, 'sessions', {})
        app.config['sessions'][session_id] = {
            "resume_text": resume_text,
            "job_description": job_description
        }

        return jsonify({"ats_score": ats_score, "session_id": session_id})

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

@app.route('/get_recommendations', methods=['POST'])
def get_recommendations():
    try:
        data = request.get_json()
        session_id = data.get('session_id')

        if not session_id or session_id not in app.config.get('sessions', {}):
            return jsonify({"error": "Invalid or missing session ID."}), 400

        session_data = app.config['sessions'][session_id]
        resume_text = session_data["resume_text"]
        job_description = session_data["job_description"]

        # Initialize LLM
        llm = ChatGroq(
            groq_api_key=os.getenv('GROQ_API_KEY'),
            model_name="gemma2-9b-it"
        )

        # Recommendations Prompt (only generates suggestions)
        recommendations_prompt = f"""
        You are an AI that provides specific recommendations to improve a resume based on a job description.

        ### Evaluation Criteria:
        1. Compare the resume content with the job description.
        2. Identify gaps in skills, experience, keywords, or alignment with the job role.
        3. Provide **specific recommendations** to improve the resume.

        ### Input:
        **Job Description:**
        {job_description}

        **Resume Content:**
        {resume_text}

        ### Output (JSON format):
        Provide only the following JSON object with no additional text:
        {{
            "improvement_suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
        }}
        """

        try:
            rec_response = llm.invoke(recommendations_prompt)
            response_text = rec_response.content.strip()

            # Extract JSON using regex to handle extra text
            json_match = re.search(r'\{.*?\}', response_text, re.DOTALL)
            if not json_match:
                raise ValueError("No valid JSON found in LLM response")

            json_text = json_match.group(0)
            rec_response_json = json.loads(json_text)
            improvement_suggestions = rec_response_json.get("improvement_suggestions", [])

        except json.JSONDecodeError as e:
            traceback.print_exc()
            return jsonify({"error": f"Failed to parse AI response: {str(e)}. Raw response: {response_text}"}), 500
        except Exception as e:
            traceback.print_exc()
            return jsonify({"error": f"Error generating recommendations: {str(e)}. Raw response: {response_text}"}), 500

        return jsonify({"improvement_suggestions": improvement_suggestions})

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


# Run the app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5040)
