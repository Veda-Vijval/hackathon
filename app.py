from flask import Flask, request, jsonify, render_template
from main import agent_executor, chat_history # We import your agent from main.py
from langchain_core.messages import HumanMessage, AIMessage

app = Flask(__name__, template_folder='.')

@app.route('/')
def index():
    """Serves the frontend HTML file."""
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    """Handles the user's query and returns the agent's response."""
    data = request.get_json()
    user_query = data.get('query')
    
    if not user_query:
        return jsonify({'error': 'No query provided'}), 400

    # Get the agent's response
    response = agent_executor.invoke({
        "query": user_query,
        "chat_history": chat_history 
    })
    
    # Update our server-side chat history
    chat_history.append(HumanMessage(content=user_query))
    chat_history.append(AIMessage(content=response['output']))
    
    return jsonify({'answer': response['output']})

if __name__ == '__main__':
    # Note: Setting debug=False is recommended for production
    app.run(debug=True)