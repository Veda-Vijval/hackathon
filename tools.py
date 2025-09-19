from langchain_community.tools import WikipediaQueryRun, DuckDuckGoSearchRun
from langchain_community.utilities import WikipediaAPIWrapper
from langchain.tools import Tool
from datetime import datetime
from langchain_community.document_loaders import WebBaseLoader

def save_to_txt(data: str, filename: str = "research_output.txt"):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted_text = f"--- Research Output ---\nTimestamp: {timestamp}\n\n{data}\n\n"

    with open(filename, "a", encoding="utf-8") as f:
        f.write(formatted_text)
    
    return f"Data successfully saved to {filename}"

def read_webpage(url: str) -> str:
    """Reads the full content of a webpage given its URL."""
    try:
        loader = WebBaseLoader(url)
        docs = loader.load()
        content = " ".join([doc.page_content for doc in docs])
        # Limiting content to avoid overly large responses
        return content[:4000]
    except Exception as e:
        return f"Error reading webpage: {e}"

save_tool = Tool(
    name="save_text_to_file",
    func=save_to_txt,
    description="Saves structured research data to a text file.",
)

search = DuckDuckGoSearchRun()
search_tool = Tool(
    name="search",
    func=search.run,
    description="Search the web for information",
)

api_wrapper = WikipediaAPIWrapper(top_k_results=1, doc_content_chars_max=100)
wiki_tool = WikipediaQueryRun(api_wrapper=api_wrapper)

read_webpage_tool = Tool(
    name="read_webpage_content",
    func=read_webpage,
    description="Reads the full content of a webpage from a given URL. Use this after finding a promising URL with the search tool.",
)