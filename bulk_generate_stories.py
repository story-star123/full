import os
import json
import time
import subprocess
try:
    import google.generativeai as genai
except ImportError:
    print("Please install google-generativeai: pip install google-generativeai")
    exit(1)

# Configure your API key here or set it as an environment variable
# export GEMINI_API_KEY="your_api_key_here"
API_KEY = os.environ.get("GEMINI_API_KEY", "PUT_YOUR_API_KEY_HERE")
if API_KEY == "PUT_YOUR_API_KEY_HERE":
    print("Please set your GEMINI_API_KEY environment variable or hardcode it in the script.")
    exit(1)

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-1.5-pro')

CATEGORIES = ["Romance", "Action", "Horror", "Adventure"]
STORIES_PER_CATEGORY = 49  # since 1 sample per category is already generated
BASE_DIR = "backend/stories"

def generate_story_content(category, index):
    prompt = f"""
    Write a short, engaging story in the {category} genre. 
    It should have a title and be about 300 words long.
    Please output ONLY a JSON object with the following structure:
    {{
      "title": "Story Title",
      "slug": "story-title-slug",
      "description": "A one sentence description of the story.",
      "content": "# Story Title\n\nStory content in markdown format..."
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        # Strip markdown json block formatting if present
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        return json.loads(text.strip())
    except Exception as e:
        print(f"Error generating story: {e}")
        return None

def main():
    if not os.path.exists(BASE_DIR):
        os.makedirs(BASE_DIR)
        
    for category in CATEGORIES:
        print(f"--- Generating stories for {category} ---")
        for i in range(2, STORIES_PER_CATEGORY + 2):  # Starting from 2 since 1 is done
            print(f"Generating {category} story {i}...")
            data = generate_story_content(category, i)
            
            if not data:
                print(f"Skipping {category} story {i} due to generation error.")
                time.sleep(5)
                continue
                
            # Create directory
            folder_name = f"story-{category.lower()}-{i}"
            folder_path = os.path.join(BASE_DIR, folder_name)
            os.makedirs(folder_path, exist_ok=True)
            
            # Write metadata.json
            metadata = {
                "title": data.get("title", f"{category} Story {i}"),
                "slug": data.get("slug", folder_name),
                "description": data.get("description", ""),
                "author": "AI Bulk Generator",
                "category": category,
                "featuredImage": "image1.svg",
                "uploadDate": time.strftime("%Y-%m-%dT%H:%M:%S.000Z")
            }
            
            with open(os.path.join(folder_path, "metadata.json"), "w") as f:
                json.dump(metadata, f, indent=2)
                
            # Write story.md
            with open(os.path.join(folder_path, "story.md"), "w") as f:
                f.write(data.get("content", f"# {metadata['title']}\n\nContent missing."))
                
            # Write a placeholder SVG image
            svg_content = f'''<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="#2d3748"/>
              <text x="50%" y="50%" font-family="Arial" font-size="40" fill="white" text-anchor="middle" dominant-baseline="middle">
                {category} Cover
              </text>
            </svg>'''
            with open(os.path.join(folder_path, "image1.svg"), "w") as f:
                f.write(svg_content)
                
            print(f"Saved {folder_name} successfully.")
            
            # Small delay to avoid rate limits
            time.sleep(4)
            
    print("Generation complete! Don't forget to 'git add' and 'git commit' your new stories.")

if __name__ == "__main__":
    main()
