#!/usr/bin/env python3
"""
ODE Micro-Practice Quiz Generator
Author: Antigravity AI Pair Programmer
Description: Automatically extracts YouTube transcripts, queries the Gemini API
             to generate a conceptually clear 5-question micro-practice quiz in LaTeX,
             adds the quiz to a local persistent database cache, and compiles the 
             updated quiz directly into the Ordinary Differential Equations Study Roadmap dashboard.
"""

import os
import sys

# Force stdout/stderr to use UTF-8 to prevent encoding errors on Windows terminal
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

import json
import argparse
import subprocess
import shutil
CURRENT_MODEL = "gemini-2.5-flash"

# Title Banner
BANNER = r"""
========================================================================
   __  __ ___ ____ ____   ___     ___  _   _ ___ _____ 
  |  \/  |_ _/ ___|  _ \ / _ \   / _ \| | | |_ _|__  / 
  | |\/| || | |   | |_) | | | | | | | | | | || |  / /  
  | |  | || | |___|  _ <| |_| | | |_| | |_| || | / /_  
  |_|  |_|___\____|_| \_\\___/   \__\_\\___/|___/____| 
                 Q U I Z   G E N E R A T O R
========================================================================
"""

def check_dependencies():
    """Checks and verifies that necessary dependencies are installed in the environment."""
    missing = []
    
    try:
        import youtube_transcript_api
    except ImportError:
        missing.append("youtube-transcript-api")
        
    try:
        import google.generativeai
    except ImportError:
        missing.append("google-generativeai")
        
    if missing:
        print("\n" + "!" * 80)
        print("[!] Missing required python libraries for quiz generation!")
        print("Please install them by running:")
        print(f"    pip install {' '.join(missing)}")
        print("!" * 80 + "\n")
        sys.exit(1)

def get_gemini_api_key():
    """Retrieves the Gemini API key from the environment variables."""
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        print("\n" + "!" * 80)
        print("[!] ERROR: 'GEMINI_API_KEY' environment variable not set!")
        print("\nPlease configure your Google Gemini API key by running:")
        print("\n  On Windows PowerShell:")
        print('    $env:GEMINI_API_KEY="your_api_key_here"')
        print("\n  On Windows Command Prompt (CMD):")
        print('    set GEMINI_API_KEY=your_api_key_here')
        print("\n  On Linux / macOS:")
        print('    export GEMINI_API_KEY="your_api_key_here"')
        print("\nYou can get a free Gemini API key from Google AI Studio:")
        print("https://aistudio.google.com/")
        print("!" * 80 + "\n")
        sys.exit(1)
    return key

def fetch_transcript(video_id):
    """Fetches the English transcript of the YouTube video using youtube-transcript-api."""
    from youtube_transcript_api import YouTubeTranscriptApi
    from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound
    
    print(f"[*] Downloading transcript for video ID '{video_id}'...")
    try:
        api = YouTubeTranscriptApi()
        transcript_list = api.fetch(video_id, languages=['en'])
        text = " ".join([item.text for item in transcript_list])
        print(f"[+] Downloaded transcript successfully! ({len(text)} characters)")
        return text
    except TranscriptsDisabled:
        raise Exception(f"Transcripts are disabled for video '{video_id}'. Cannot generate quiz.")
    except NoTranscriptFound:
        raise Exception(f"No English transcript or automatic caption found for video '{video_id}'.")
    except Exception as e:
        raise Exception(f"Error downloading transcript: {e}")

def generate_quiz(video_id, video_title, chapter_number, transcript, api_key, model_name):
    """Calls the Gemini API to generate the LaTeX micro quiz JSON based on the transcript or video details with automatic model rotation."""
    import google.generativeai as genai
    import json
    
    print(f"[*] Initializing Gemini API connection...")
    genai.configure(api_key=api_key)
    
    if transcript:
        prompt = f"""
You are an expert university mathematics professor specializing in Ordinary Differential Equations (ODEs).
I have an educational lecture video titled "{video_title}" (ID: {video_id}) mapped to Chapter {chapter_number} of my course.
Here is the complete English transcript of the video:

---
{transcript}
---

Based ONLY on the provided lecture transcript details, generate a conceptually clear and academically rigorous 5-question multiple-choice micro-practice quiz to test students' comprehension of the core definitions and techniques discussed.

Follow these strict pedagogical rules:
1. Questions must test distinct key concepts, models, or formulas covered in this specific lecture.
2. Each question must have exactly 4 answer options (choices).
3. Only ONE option can be marked as correct (`isCorrect: true`). The other three must be false (`isCorrect: false`).
4. Each option MUST have a clear, academic rationale explaining why it is correct or incorrect based on the lecture contents.
5. Provide a helpful hint for students who get stuck.
6. Use KaTeX/LaTeX formatting for all mathematical symbols, expressions, and equations:
   - Enclose inline math in single dollar signs, like $y(x) = C e^{{kt}}$ or $\\frac{{dy}}{{dx}}$.
   - Enclose block equations in double dollar signs, like $$\\frac{{d^2y}}{{dx^2}} + y = 0$$.
   - Ensure all derivatives, variables, limits, trigonometric functions, and integrals are styled in standard LaTeX.
   - CRITICAL: Since you are outputting inside a JSON string, you MUST double-escape all LaTeX backslashes so they are valid JSON. For example, write \\\\frac instead of \\frac, and \\\\sin instead of \\sin. Single backslashes like \\f or \\l will fail JSON parsing!
7. Return a clean, descriptive title for the quiz (e.g., "Micro-Practice: Separation of Variables").

Your output must be strict, valid JSON in the exact format shown below, with the outer key being "inline_{video_id}_definitions":

{{
  "inline_{video_id}_definitions": {{
    "quiz_id": "inline_{video_id}_definitions",
    "chapter_number": {chapter_number},
    "video_id": "{video_id}",
    "title": "Micro-Practice: [Insert Core Lesson Topic]",
    "questions": [
      {{
        "questionNumber": 1,
        "question": "[LaTeX Question Text]",
        "answerOptions": [
          {{
            "text": "[LaTeX Option A]",
            "rationale": "[LaTeX rationale explaining why correct/incorrect]",
            "isCorrect": false
          }},
          {{
            "text": "[LaTeX Option B]",
            "rationale": "[LaTeX rationale explaining why correct/incorrect]",
            "isCorrect": true
          }},
          {{
            "text": "[LaTeX Option C]",
            "rationale": "[LaTeX rationale explaining why correct/incorrect]",
            "isCorrect": false
          }},
          {{
            "text": "[LaTeX Option D]",
            "rationale": "[LaTeX rationale explaining why correct/incorrect]",
            "isCorrect": false
          }}
        ],
        "hint": "[LaTeX Hint Text]"
      }}
    ]
  }}
}}

Ensure the output is raw JSON only. Do not wrap it in markdown code fences (like ```json ... ```) or include any chat introduction or summary.
"""
    else:
        prompt = f"""
You are an expert university mathematics professor specializing in Ordinary Differential Equations (ODEs).
I have an educational lecture video titled "{video_title}" (ID: {video_id}) mapped to Chapter {chapter_number} of my course.
Since the video transcript is not accessible, please generate a conceptually clear and academically rigorous 5-question multiple-choice micro-practice quiz based on standard university level curricula for this specific topic: "{video_title}".

Follow these strict pedagogical rules:
1. Questions must test distinct key concepts, models, or formulas covered under this topic (e.g., definitions, derivations, analytical steps, or standard examples of {video_title}).
2. Each question must have exactly 4 answer options (choices).
3. Only ONE option can be marked as correct (`isCorrect: true`). The other three must be false (`isCorrect: false`).
4. Each option MUST have a clear, academic rationale explaining why it is correct or incorrect.
5. Provide a helpful hint for students who get stuck.
6. Use KaTeX/LaTeX formatting for all mathematical symbols, expressions, and equations:
   - Enclose inline math in single dollar signs, like $y(x) = C e^{{kt}}$ or $\\frac{{dy}}{{dx}}$.
   - Enclose block equations in double dollar signs, like $$\\frac{{d^2y}}{{dx^2}} + y = 0$$.
   - Ensure all derivatives, variables, limits, trigonometric functions, and integrals are styled in standard LaTeX.
   - CRITICAL: Since you are outputting inside a JSON string, you MUST double-escape all LaTeX backslashes so they are valid JSON. For example, write \\\\frac instead of \\frac, and \\\\sin instead of \\sin. Single backslashes like \\f or \\l will fail JSON parsing!
7. Return a clean, descriptive title for the quiz (e.g., "Micro-Practice: Separation of Variables").

Your output must be strict, valid JSON in the exact format shown below, with the outer key being "inline_{video_id}_definitions":

{{
  "inline_{video_id}_definitions": {{
    "quiz_id": "inline_{video_id}_definitions",
    "chapter_number": {chapter_number},
    "video_id": "{video_id}",
    "title": "Micro-Practice: [Insert Core Lesson Topic]",
    "questions": [
      {{
        "questionNumber": 1,
        "question": "[LaTeX Question Text]",
        "answerOptions": [
          {{
            "text": "[LaTeX Option A]",
            "rationale": "[LaTeX rationale explaining why correct/incorrect]",
            "isCorrect": false
          }},
          {{
            "text": "[LaTeX Option B]",
            "rationale": "[LaTeX rationale explaining why correct/incorrect]",
            "isCorrect": true
          }},
          {{
            "text": "[LaTeX Option C]",
            "rationale": "[LaTeX rationale explaining why correct/incorrect]",
            "isCorrect": false
          }},
          {{
            "text": "[LaTeX Option D]",
            "rationale": "[LaTeX rationale explaining why correct/incorrect]",
            "isCorrect": false
          }}
        ],
        "hint": "[LaTeX Hint Text]"
      }}
    ]
  }}
}}

Ensure the output is raw JSON only. Do not wrap it in markdown code fences (like ```json ... ```) or include any chat introduction or summary.
"""

    global CURRENT_MODEL
    models_to_try = [
        CURRENT_MODEL,
        model_name,
        "gemini-2.5-flash",
        "gemini-2.5-pro",
        "gemini-2.0-flash",
        "gemini-2.0-flash-001",
        "gemini-2.0-flash-lite-001",
        "gemini-2.0-flash-lite",
        "gemini-2.5-flash-lite",
        "gemini-3.5-flash",
        "gemini-3.1-flash-lite",
        "gemini-3-flash-preview",
        "gemini-3.1-pro-preview",
        "gemini-3-pro-preview",
        "gemini-flash-latest",
        "gemini-pro-latest",
        "gemini-flash-lite-latest"
    ]
    seen = set()
    models_to_try = [x for x in models_to_try if not (x in seen or seen.add(x))]
    
    last_exception = None
    for m_idx, m_name in enumerate(models_to_try):
        print(f"[*] Attempting quiz generation using model '{m_name}' (model {m_idx + 1}/{len(models_to_try)})...")
        max_retries = 2
        retry_delay = 5  # short sleep for retry, since we will rotate model if quota is hit
        
        for attempt in range(max_retries):
            try:
                model = genai.GenerativeModel(m_name)
                response = model.generate_content(
                    prompt,
                    generation_config={"response_mime_type": "application/json"}
                )
                
                raw_text = response.text.strip()
                
                if raw_text.startswith("```json"):
                    raw_text = raw_text[7:]
                if raw_text.endswith("```"):
                    raw_text = raw_text[:-3]
                raw_text = raw_text.strip()
                
                try:
                    quiz_data = json.loads(raw_text)
                    print(f"[+] Successfully received and parsed valid quiz JSON from model '{m_name}'!")
                    CURRENT_MODEL = m_name  # Save working model globally for subsequent calls
                    return quiz_data
                except json.JSONDecodeError as jde:
                    print("[*] Primary JSON parsing failed due to raw backslash characters. Attempting pre-escaping recovery...")
                    try:
                        import re
                        fixed_text = re.sub(r'\\(?!"|\\)', r'\\\\', raw_text)
                        quiz_data = json.loads(fixed_text)
                        print("[+] Pre-escaped JSON backslashes successfully!")
                        return quiz_data
                    except Exception as escape_err:
                        print(f"[!] Pre-escaping failed to resolve JSON error: {escape_err}")
                        print(f"[!] Error: Gemini did not return valid JSON. Raw response:\n{response.text}")
                        raise jde
            except Exception as e:
                err_msg = str(e)
                is_rate_limit = "429" in err_msg or "ResourceExhausted" in err_msg or "quota" in err_msg.lower() or "limit exceeded" in err_msg.lower()
                
                if is_rate_limit:
                    if attempt < max_retries - 1:
                        print(f"[!] Rate limit hit for model '{m_name}': {e}. Retrying same model in {retry_delay}s...")
                        import time
                        time.sleep(retry_delay)
                    else:
                        print(f"[!] Model '{m_name}' failed completely (rate-limited/quota exceeded).")
                        last_exception = e
                        break  # Break out of inner loop to try NEXT model
                else:
                    print(f"[!] Unexpected generate_quiz Error for model '{m_name}': {e}")
                    last_exception = e
                    break  # Break out of inner to try NEXT model
                    
    print(f"[!] ERROR: All models in rotation failed to generate quiz.")
    raise last_exception

def save_and_compile(quiz_obj):
    """Saves the generated quiz to quizzes_cache.json and triggers ode_sorter recompilation."""
    cache_file = "quizzes_cache.json"
    cache = {}
    
    # 1. Load existing dynamic quizzes if they exist
    if os.path.exists(cache_file):
        try:
            with open(cache_file, "r", encoding="utf-8") as f:
                cache = json.load(f)
            print(f"[*] Loaded {len(cache)} existing dynamic quizzes from '{cache_file}'")
        except Exception as e:
            print(f"[*] Warning: Could not parse existing '{cache_file}': {e}. Starting fresh.")
            
    # 2. Merge new quiz (overwriting if key already exists)
    cache.update(quiz_obj)
    
    # 3. Save cache
    try:
        with open(cache_file, "w", encoding="utf-8") as f:
            json.dump(cache, f, indent=2, ensure_ascii=False)
        print(f"[+] Saved updated dynamic database to '{cache_file}'")
    except Exception as e:
        sys.exit(f"[!] Error saving to '{cache_file}': {e}")
        
    # 4. Trigger ode_sorter recompilation
    print("\n[*] Rebuilding study guide pages...")
    if os.path.exists("ode_sorter.py"):
        try:
            # Run the Python compiler script
            result = subprocess.run([sys.executable, "ode_sorter.py"], capture_output=True, text=True, check=True)
            print(result.stdout)
            
            # Copy recompiled files to deployment locations
            if os.path.exists("sorted_playlist.html"):
                shutil.copyfile("sorted_playlist.html", "Ordinary Differential Equations Study Roadmap.html")
                shutil.copyfile("sorted_playlist.html", "index.html")
                print("[+] Dashboard compilation successful!")
                print("    - Ordinary Differential Equations Study Roadmap.html (UPDATED)")
                print("    - index.html (UPDATED)")
            else:
                print("[!] Error: 'sorted_playlist.html' was not found after compilation.")
        except subprocess.CalledProcessError as cpe:
            print(f"[!] Compilation failed: {cpe.stderr}")
            sys.exit(1)
    else:
        sys.exit("[!] Error: 'ode_sorter.py' compiler script not found in active directory.")

def main():
    print(BANNER)
    check_dependencies()
    api_key = get_gemini_api_key()
    
    parser = argparse.ArgumentParser(description="Automate LaTeX Micro-Practice quiz generation from video transcripts.")
    parser.add_argument("--video-id", type=str, help="YouTube Video ID to generate the micro quiz for.")
    parser.add_argument("--model", type=str, default="gemini-2.5-flash", help="Gemini API Model name.")
    args = parser.parse_args()
    
    global CURRENT_MODEL
    CURRENT_MODEL = args.model
    
    # 1. Check if video ID is specified. If not, load from cache and present choice.
    target_id = args.video_id
    video_title = "Unknown Lecture Video"
    chapter_number = 1
    
    # Attempt to load catalog from cache to verify / map metadata
    playlist_cache = "playlist_cache.json"
    catalog = []
    if os.path.exists(playlist_cache):
        try:
            with open(playlist_cache, "r", encoding="utf-8") as f:
                catalog = json.load(f)
        except Exception as e:
            print(f"[*] Warning: Could not read '{playlist_cache}': {e}")
            
    # Try importing ode_sorter to get exact syllabus metadata
    syllabus = []
    if os.path.exists("ode_sorter.py"):
        try:
            sys.path.append(os.getcwd())
            import ode_sorter
            videos = ode_sorter.get_videos()
            syllabus = ode_sorter.apply_fallback_sorting(videos)
        except Exception as e:
            print(f"[*] Warning: Could not load syllabus metadata from ode_sorter: {e}")
            
    if not target_id:
        print("[*] No Video ID provided. Entering batch processing mode for all videos...")
        if not catalog:
            sys.exit("[!] Error: 'playlist_cache.json' was not found. Cannot run batch processing.")
            
        # Load existing cache to check which ones are done
        cache_file = "quizzes_cache.json"
        cache = {}
        if os.path.exists(cache_file):
            try:
                with open(cache_file, "r", encoding="utf-8") as f:
                    cache = json.load(f)
            except Exception as e:
                print(f"[*] Warning: Could not parse '{cache_file}': {e}.")

        # Find videos that need quizzes
        todo_videos = []
        for item in catalog:
            vid_id = item["id"]
            quiz_key = f"inline_{vid_id}_definitions"
            # Skip if already in cache or statically in ode_sorter
            if quiz_key in cache:
                continue
            if vid_id == "R2QtleY5asQ" or quiz_key == "inline_1_1_definitions":
                continue
            todo_videos.append(item)
            
        total_todo = len(todo_videos)
        print(f"[+] Found {len(catalog)} total videos in catalog. {len(catalog) - total_todo} already have quizzes. {total_todo} videos remaining to process.")
        
        if total_todo == 0:
            print("[+] All videos already have quizzes! No work to do.")
            sys.exit(0)
            
        import time
        from youtube_transcript_api import YouTubeTranscriptApi
        import google.generativeai as genai
        
        genai.configure(api_key=api_key)
        
        success_count = 0
        for idx, item in enumerate(todo_videos):
            vid_id = item["id"]
            title = item["title"]
            
            # Map chapter number and title
            ch_num = 1
            metadata_found = False
            if syllabus:
                for ch_idx, chapter in enumerate(syllabus):
                    for v in chapter.get("videos", []):
                        if v["id"] == vid_id:
                            title = v["title"]
                            ch_num = ch_idx + 1
                            metadata_found = True
                            break
                    if metadata_found:
                        break
            
            print(f"\n==================================================")
            print(f"[*] Processing Batch Video {idx + 1} of {total_todo}")
            print(f"[-] Video ID: {vid_id}")
            print(f"[-] Title:    {title}")
            print(f"[-] Chapter:  {ch_num}")
            print(f"==================================================")
            
            try:
                # 1. Fetch Transcript with resilient fallback
                try:
                    transcript = fetch_transcript(vid_id)
                except Exception as te:
                    print(f"[!] Warning: Could not download transcript for '{vid_id}' ({te}). Falling back to title-based generation...")
                    transcript = None
                
                # 2. Generate Quiz via Gemini
                quiz_obj = generate_quiz(vid_id, title, ch_num, transcript, api_key, args.model)
                
                # 3. Save to cache immediately (atomic write to prevent progress loss)
                cache.update(quiz_obj)
                with open(cache_file, "w", encoding="utf-8") as f:
                    json.dump(cache, f, indent=2, ensure_ascii=False)
                print(f"[+] Successfully saved 'inline_{vid_id}_definitions' to quizzes_cache.json")
                
                success_count += 1
                
                # Sleep to respect rate limits
                if idx < total_todo - 1:
                    print("[*] Sleeping for 5 seconds to respect rate limits...")
                    time.sleep(5)
                    
            except Exception as e:
                print(f"[!] Error processing video '{vid_id}': {e}")
                print("[*] Skipping this video and continuing to the next...")
                # Sleep anyway to prevent API spamming
                time.sleep(5)
                
        print(f"\n[+] Batch processing finished. Successfully generated {success_count} new quizzes.")
        
        # 4. Trigger Recompilation once at the end
        if success_count > 0:
            save_and_compile({})
            
        print("\n========================================================================")
        print(f"[+] BATCH MICRO-PRACTICE GENERATION PIPELINE COMPLETE!")
        print(f"[-] Total Quizzes Added: {success_count}")
        print("[-] Open 'Ordinary Differential Equations Study Roadmap.html' to review all!")
        print("========================================================================\n")
        sys.exit(0)

    # 2. Single Video Mode
    print(f"\n==================================================")
    print(f"[*] Entering single video processing mode...")
    print(f"[-] Video ID: {target_id}")
    
    # Map title and chapter number
    for item in catalog:
        if item["id"] == target_id:
            video_title = item["title"]
            break
            
    if syllabus:
        metadata_found = False
        for ch_idx, chapter in enumerate(syllabus):
            for v in chapter.get("videos", []):
                if v["id"] == target_id:
                    video_title = v["title"]
                    chapter_number = ch_idx + 1
                    metadata_found = True
                    break
            if metadata_found:
                break
                
    print(f"[-] Title:    {video_title}")
    print(f"[-] Chapter:  {chapter_number}")
    print(f"==================================================")
    
    # Fetch transcript with resilient fallback
    try:
        transcript = fetch_transcript(target_id)
    except Exception as te:
        print(f"[!] Warning: Could not download transcript for '{target_id}' ({te}). Falling back to title-based generation...")
        transcript = None
    
    # Generate quiz
    quiz_obj = generate_quiz(target_id, video_title, chapter_number, transcript, api_key, args.model)
    
    # Save and compile
    save_and_compile(quiz_obj)

if __name__ == "__main__":
    main()
