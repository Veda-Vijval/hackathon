import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.messages import HumanMessage, AIMessage
from tools import search_tool, wiki_tool, save_tool, read_webpage_tool # <- UPDATED

# Load environment variables from .env file
load_dotenv()

# Set up the language model using Google Gemini
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

# Define the prompt template for the agent
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a helpful research assistant. Answer the user's query and use the necessary tools.",
        ),
        ("placeholder", "{chat_history}"),
        ("human", "{query}"),
        ("placeholder", "{agent_scratchpad}"),
    ]
)

# List of tools the agent can use
tools = [search_tool, wiki_tool, save_tool, read_webpage_tool] # <- UPDATED

# Create the agent by combining the llm, prompt, and tools
agent = create_tool_calling_agent(
    llm=llm,
    prompt=prompt,
    tools=tools
)

# Create the agent executor, which runs the agent
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# This list will store the conversation history
chat_history = []

print("AI Research Assistant: Hello! What can I help you research today? (Type 'exit' to quit)")

# Main loop to create the chatbot experience
while True:
    # Get input from the user
    user_query = input("You: ")
    if user_query.lower() in ["exit", "quit"]:
        print("AI Research Assistant: Goodbye!")
        break

    # Invoke the agent with the user's query and the conversation history
    response = agent_executor.invoke({
        "query": user_query,
        "chat_history": chat_history
    })

    # Print the agent's response
    print(f"AI Research Assistant: {response['output']}")

    # Update the chat history with the latest turn
    chat_history.append(HumanMessage(content=user_query))
    chat_history.append(AIMessage(content=response['output']))