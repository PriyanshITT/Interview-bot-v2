from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import chromadb.api
import os
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

# Initialize Flask app
app = Flask(__name__)
os.environ["GROQ_API_KEY"] = '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'

# Allow requests from specified origins
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://157.173.222.234:5173",
            "http://localhost:3000", 
            "https://interviewbot.intraintech.com"
        ]
    }
})
# Configuration for uploads
UPLOAD_FOLDER = 'uploads'
CHROMA_DB_FOLDER = '/mnt/d/21AI_Interviewbot/main/Interview-bot-v2/flask-backend/chroma_db'
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

    # Store the evaluation result
    # api_url = f"https://interviewbot.intraintech.com/api/api/question-answers/add/userid/{user_id}/username/{username}"
    # payload = {
    #     "question": question,
    #     "answer": user_answer,
    #     "marks": marks,
    #     "timestamp": timestamp
    # }

    # try:
    #     response = requests.post(api_url, json=payload)
    #     if response.status_code != 200:
    #         return jsonify({"error": f"Failed to store data: {response.status_code} {response.text}"}), 500
    # except Exception as e:
    #     return jsonify({"error": f"Error storing data: {str(e)}"}), 500

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

# Run the app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5040)