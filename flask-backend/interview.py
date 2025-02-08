# interview.py

import uuid
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_groq import ChatGroq
from langchain_core.runnables import RunnableSequence
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory

# Define the system prompt template
question_system_prompt = """
You are an AI interview bot conducting a professional job interview. Your role is to ask only one thoughtful and engaging question per response based on the candidate's skills, experience, company name, and domain provided.

1. Focus on the following topics:
   - Skills and technical knowledge (4-5 questions in total)
   - Role responsibilities in the specified domain (4-5 questions in total)
   - Relevant work experience (2-3 questions in total)

2. Ask exactly one question per response.  
3. Avoid repeating questions.  
4. Tailor each question to the candidate's profile.  

Inputs: Skills: {skills}, Experience: {experience}, Interview Type: {interview_type}, Domain: {domain}.  

Ask the next one question.
"""

# Create the chat prompt with a placeholder for chat history
question_prompt = ChatPromptTemplate.from_messages([
    ("system", question_system_prompt),
    MessagesPlaceholder("chat_history"),
    ("human", "{input}")
])

# Initialize the LLM (ChatGroq) with your API key and model name
llm = ChatGroq(
    groq_api_key='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',
    model_name="gemma2-9b-it"
)

# Combine the prompt and the LLM into a conversational chain
question_chain = RunnableSequence(question_prompt | llm)

# Global session storage (to hold chain state and details per session)
sessions = {}

def start_interview_handler(skills, experience, interview_type, domain, session_id=None):
    """
    Starts a new interview session and returns the first question along with the session id.
    """
    if session_id is None:
        session_id = str(uuid.uuid4())

    # Set up the conversational chain with message history tracking
    conversational_chain = RunnableWithMessageHistory(
        question_chain,
        lambda _: ChatMessageHistory(),
        input_messages_key="input",
        history_messages_key="chat_history"
    )

    # Store the chain and candidate details in a session
    sessions[session_id] = {
        "chain": conversational_chain,
        "details": {
            "skills": skills,
            "experience": experience,
            "interview_type": interview_type,
            "domain": domain
        }
    }

    # Invoke the chain to generate the first question
    response = conversational_chain.invoke(
        {
            "input": "Start the interview.",
            "chat_history": [],
            "skills": skills,
            "experience": experience,
            "interview_type": interview_type,
            "domain": domain
        },
        {"configurable": {"session_id": session_id}}
    )

    first_question = response.content if hasattr(response, 'content') else 'No question generated.'
    return first_question, session_id

def next_question_handler(session_id, user_answer):
    """
    Takes the candidate's answer and returns the next question for the existing interview session.
    """
    session_data = sessions.get(session_id)
    if not session_data:
        raise ValueError("Invalid session ID.")

    conversational_chain = session_data["chain"]
    details = session_data["details"]

    # Invoke the chain with the user's answer to generate the next question
    response = conversational_chain.invoke(
        {
            "input": user_answer,
            "skills": details["skills"],
            "experience": details["experience"],
            "interview_type": details["interview_type"],
            "domain": details["domain"]
        },
        {"configurable": {"session_id": session_id}}
    )
    next_question_text = response.content if hasattr(response, 'content') else 'No next question generated.'
    return next_question_text
