#!/usr/bin/env python3
"""
ODE Playlist Sorter
Author: Antigravity AI Pair Programmer
Description: Fetches differential equations videos from a YouTube playlist,
             sorts them into a pedagogically structured educational sequence 
             using the Gemini API, and exports the sorted playlist into 
             a clean Markdown guide and an interactive, highly-polished HTML dashboard.
"""

import os
import re
import sys
import json
import ssl
import time
import argparse
import urllib.request
import urllib.error

# ==========================================
# CONFIGURATION & PLACEHOLDERS
# ==========================================
# Add your Gemini API key here!
GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE"

PLAYLIST_URL = "https://youtube.com/playlist?list=PLGfp4Jo_MoBQiSaB89o-mGseDZZxtwRLD"
CACHE_FILE = "playlist_cache.json"
CACHE_EXPIRY_SECONDS = 86400  # 24 hours

# ==========================================
# EXPERT CURATED PEDAGOGICAL SEQUENCING (Fallback)
# ==========================================
# This pre-defined sequence maps video IDs to 8 structured course sections.
# If Gemini is offline or the API key is not configured, it will arrange 
# the 47 videos using this sequence.
PEDAGOGICAL_SECTIONS = [
    {
        "name": "1. Foundations & Definitions",
        "description": "Introduction to differential equations, identifying order, degree, and solutions.",
        "video_ids": [
            "R2QtleY5asQ",  # DIFFERENTIAL EQUATIONS explained in 21 Minutes
            "B5IjsTONKkw",  # What is a DIFFERENTIAL EQUATION?? **Intro to my full ODE course**
            "p_di4Zn4wz4",  # Differential equations, a tourist's guide | DE1
            "ghjOS7Q82s0",  # Overview of Differential Equations
            "QbkWlNf2Xtw",  # Introduction to Differential Equations
            "uoOpCGdktQ4",  # 🔵01 - Differential Equations, Order, Degree, Ordinary and Partial Differential Equation
            "hiL356ExeIw",  # Differential Equations - Introduction, Order and Degree, Solutions to DE
            "C3WKwB5gBqI",  # The Key Definitions of Differential Equations: ODE, order, solution, initial condition, IVP
            "aXW69HPiPzE",  # 🔵02 - Order and Degree of a Differential Equation : Exercise
            "fDvxPdqWjkQ",  # 🔵03 - Linear and Non-Linear Differential Equations: Solved Examples
            "f0BxAtprWts",  # The Calculus You Need
            "sOKctbWGnSk",  # 🔵04a - Solution to a given Differential Equation - Introduction
            "s0tG__GIMqU",  # 🔵04b - Solution to a given Differential Equation - More Examples (NEW)
            "qBNYAqQ_Glo",  # 🔵05a - Differential Equation: Form Differentiation Equation by Eliminating Arbitrary Constants
            "4tcvZU4ACho",  # 🔵05b - Differential Equation: Form Differentiation Equation by Eliminating Arbitrary Constants 2
            "_lp33noEO50",  # 🔵06a - Initial and Boundary Value Problems: Find the arbitrary constants c1 and c2
            "3d5M3G9vDVU",  # 🔵06b - Initial and Boundary Value Problems: Find the arbitrary constants c1 and c2
            "2urpuhYVc14"   # 🔵07 - Particular Solution of a Differential Equation given the Initial / Boundary Conditions
        ]
    },
    {
        "name": "2. First-Order Separable Equations",
        "description": "Solving separable ODEs and early physical models.",
        "video_ids": [
            "7Y-frhf-1Zk",  # Separation of Variables // Differential Equations
            "wU0gYqxZT1g",  # 🔵08 - First Order Separable Differential Equations 1 - Methods of Solving Differential Equations
            "4XgyHnERlWU",  # 🔵09a - First Order Separable Differential Equations 2 - Methods of Solving Differential Equations
            "dMl4khm4E-w",  # 🔵09b - First Order Separable Differential Equations 3 - Methods of Solving Differential Equations
            "_bAjWNsNrQA"   # Newton's Law of Cooling // Separable ODE Example
        ]
    },
    {
        "name": "3. Linear First-Order Equations & Integrating Factors",
        "description": "Using integrating factors to solve linear first-order differential equations.",
        "video_ids": [
            "gd1FYn86P0c",  # First Order Linear Differential Equations
            "2H6BZHlD_3g",  # Linear Differential Equations & the Method of Integrating Factors
            "20x2dNVztlU",  # The Method of Integrating Factors for Linear 1st Order ODEs **full example**
            "MJUjSKew4nQ",  # Integrating Factor for Constant Rate
            "qJOQOkJ7rI8"   # Integrating Factor for a Varying Rate
        ]
    },
    {
        "name": "4. Homogeneous Equations",
        "description": "Handling homogeneous functions and first-order homogeneous ODEs.",
        "video_ids": [
            "TjmVeZpajz8",  # 🔵10 - Homogeneous Functions (Intro to Homogeneous First Order Differential Equations)
            "3y37ug3NON8",  # 🔵11a - Homogeneous First Order Differential Equations (Solved Examples)
            "Iqzf5gMTP-c"   # 🔵11b - Homogeneous First Order Differential Equations (Solved Examples 4-5)
        ]
    },
    {
        "name": "5. Exact Equations & Substitutions",
        "description": "Checking for exactness, finding potential functions, and Bernoulli equations.",
        "video_ids": [
            "pgJci5CI9n4",  # Exact Equations [ODE]
            "qS2zicoG9yg",  # 🔵12a - Exact Differential Equations (Solving Exact Differential Equations)
            "80BuQopXUMM",  # 🔵12b - Exact Differential Equations (Solving Exact Differential Equations)
            "iCN8nGXE29o"   # The Bernoulli Equation // Substitutions in Differential Equations
        ]
    },
    {
        "name": "6. Qualitative Analysis, Slope Fields & Stability",
        "description": "Visualizing slope fields, verifying existence/uniqueness, and analyzing steady states.",
        "video_ids": [
            "ccDMpj2UK_M",  # The Geometric Meaning of Differential Equations // Slope Fields, Integral Curves & Isoclines
            "_WpncZ3RkTg",  # The Big Theorem of Differential Equations: Existence & Uniqueness
            "pZOmToxx-R8",  # Autonomous Equations, Equilibrium Solutions, and Stability
            "NmntYoB1uJg",  # The Stability and Instability of Steady States
            "aP4YXOo-Uko",  # The Logistic Growth Differential Equation
            "TCkLSYxx21c"   # The Logistic Equation
        ]
    },
    {
        "name": "7. Frequency Response & Exponential Inputs",
        "description": "Analyzing responses to exponential, oscillating, complex, and general inputs.",
        "video_ids": [
            "CB9I4mwpQ5E",  # Response to Exponential Input
            "xw3ccgYhFis",  # Response to Oscillating Input
            "kIT2uMxYh6M",  # Response to Complex Exponential
            "0r2L3wTqkBc"   # Solution for Any Input
        ]
    },
    {
        "name": "8. Second-Order Linear Equations",
        "description": "Intro to higher-order systems, superposition, and linear independence.",
        "video_ids": [
            "xCCeV-glFdM",  # Second Order Equations
            "VpZOuOJ_ob4"   # The Theory of 2nd Order ODEs // Existence & Uniqueness, Superposition, & Linear Independence
        ]
    },
    {
        "name": "9. Second-Order Linear Equations (Non-Homogeneous)",
        "description": "Solving non-homogeneous equations using undetermined coefficients and variation of parameters.",
        "video_ids": [
            "P3fc6v191mA",  # Method of Undetermined Coefficients
            "AgyeJEO2a-k",  # Undetermined Coefficients (Conceptual Breakdown)
            "Ik3YW1JGr_A",  # Variation of Parameters (Analytical Method)
            "wSMad7QpaqE"   # Variation of Parameters (Examples)
        ]
    },
    {
        "name": "10. The Laplace Transform",
        "description": "Using Laplace transforms to solve initial value problems with discontinuous or impulse forcing functions.",
        "video_ids": [
            "j0wJBEZdwLs",  # Visualizing the Laplace Transform
            "KqokoYr_h1A",  # Introduction to the Laplace Transform (Calculations)
            "fuxFrpaMLtw"   # Solving Initial Value Problems with Laplace Transforms
        ]
    },
    {
        "name": "11. Systems of Linear Differential Equations",
        "description": "Transforming higher-order equations into first-order systems, using eigenvalues and phase portraits.",
        "video_ids": [
            "-00_YLHlFE0",  # Introduction to Systems of Differential Equations
            "fsnEIYEZc3Y",  # Solving Systems with Real, Distinct Eigenvalues
            "UO_dgXa5szg"   # Phase Portraits of Linear Systems
        ]
    }
]


# Checkpoint Quizzes Database
# Dynamically integrated into dashboard chapters
QUIZZES = {
    "1": {
        "quiz_id": "module_1_foundations",
        "title": "Checkpoint Quiz: ODE Foundations & Geometry",
        "questions": [
            {
                "questionNumber": 1,
                "question": "Which of the following equations is considered a strictly linear Ordinary Differential Equation?",
                "answerOptions": [
                    {
                        "text": "$\\frac{d^2y}{dx^2} + y\\frac{dy}{dx} = 0$",
                        "rationale": "Incorrect. The product of the dependent variable $y$ and its derivative $\\frac{dy}{dx}$ violates the condition of linearity.",
                        "isCorrect": False
                    },
                    {
                        "text": "$x^2\\frac{d^2y}{dx^2} + x\\frac{dy}{dx} + y = \\sin(x)$",
                        "rationale": "Correct! The dependent variable $y$ and its derivatives all appear to the first power, and there are no transcendental functions applied to $y$. The variable coefficients ($x^2, x$) depend only on the independent variable.",
                        "isCorrect": True
                    },
                    {
                        "text": "$\\frac{dy}{dx} + \\cos(y) = x$",
                        "rationale": "Incorrect. The term $\\cos(y)$ applies a transcendental function to the dependent variable, making the equation non-linear.",
                        "isCorrect": False
                    },
                    {
                        "text": "$(\\frac{dy}{dx})^2 + y = 3x$",
                        "rationale": "Incorrect. The first derivative is raised to the second power, which violates linearity.",
                        "isCorrect": False
                    }
                ],
                "hint": "Remember the three rules of linearity: no products of $y$ and its derivatives, no powers of $y$ or its derivatives other than 1, and no transcendental functions applied to $y$."
            },
            {
                "questionNumber": 2,
                "question": "Determine the order and the degree of the following differential equation: $\\sqrt{1 + (\\frac{dy}{dx})^2} = \\frac{d^2y}{dx^2}$",
                "answerOptions": [
                    {
                        "text": "Order 2, Degree 1",
                        "rationale": "Incorrect. You must rationalize the equation by squaring both sides before determining the degree.",
                        "isCorrect": False
                    },
                    {
                        "text": "Order 1, Degree 2",
                        "rationale": "Incorrect. The highest derivative present is the second derivative, so the order must be 2.",
                        "isCorrect": False
                    },
                    {
                        "text": "Order 2, Degree 2",
                        "rationale": "Correct! Squaring both sides to clear the radical yields $1 + (\\frac{dy}{dx})^2 = (\\frac{d^2y}{dx^2})^2$. The highest derivative is the second derivative (Order 2), and it is raised to the second power (Degree 2).",
                        "isCorrect": True
                    },
                    {
                        "text": "Order 1, Degree 1",
                        "rationale": "Incorrect. The highest derivative is the second derivative, and you must rationalize the equation first.",
                        "isCorrect": False
                    }
                ],
                "hint": "Before you can determine the degree, you must clear any fractional powers or radicals that involve derivatives."
            },
            {
                "questionNumber": 3,
                "question": "A student solves an ODE and obtains the general solution $y(x) = C e^{2x}$. What does the arbitrary constant '$C$' represent geometrically?",
                "answerOptions": [
                    {
                        "text": "The rate at which the function grows.",
                        "rationale": "Incorrect. The growth rate is determined by the constant '2' in the exponent.",
                        "isCorrect": False
                    },
                    {
                        "text": "An infinite family of potential solution curves.",
                        "rationale": "Correct! The constant $C$ indicates that the single rate law describes an infinite family of valid trajectories. An Initial Value Problem (IVP) is required to collapse this family down to a single, specific curve.",
                        "isCorrect": True
                    },
                    {
                        "text": "An equilibrium point where the derivative is zero.",
                        "rationale": "Incorrect. An equilibrium is a constant solution $y(x) = k$, which is different from the arbitrary constant of integration.",
                        "isCorrect": False
                    },
                    {
                        "text": "The independent variable of the system.",
                        "rationale": "Incorrect. The independent variable in this system is $x$.",
                        "isCorrect": False
                    }
                ],
                "hint": "Does a differential equation without initial conditions point to a single answer, or a collection of possible answers?"
            },
            {
                "questionNumber": 4,
                "question": "When analyzing the slope field for an autonomous differential equation of the form $\\frac{dy}{dx} = f(y)$, which geometric feature will always be present?",
                "answerOptions": [
                    {
                        "text": "The slopes will be constant along every vertical line.",
                        "rationale": "Incorrect. That behavior occurs when the ODE depends only on $x$, such as $\\frac{dy}{dx} = f(x)$.",
                        "isCorrect": False
                    },
                    {
                        "text": "All solution curves will be parabolas.",
                        "rationale": "Incorrect. Autonomous equations frequently model exponential growth, decay, or logistic curves, not necessarily parabolas.",
                        "isCorrect": False
                    },
                    {
                        "text": "The slopes will be constant along every horizontal line.",
                        "rationale": "Correct! Because the rate of change $f(y)$ depends *only* on the $y$-value and not on $x$, every point on a horizontal line $y=k$ will have the exact same slope.",
                        "isCorrect": True
                    },
                    {
                        "text": "The slope will be zero at the origin.",
                        "rationale": "Incorrect. The slope at the origin is only zero if $f(0) = 0$, which is not guaranteed for all autonomous equations.",
                        "isCorrect": False
                    }
                ],
                "hint": "If the formula for the slope does not contain an '$x$', does moving left or right across the coordinate plane change the slope?"
            },
            {
                "questionNumber": 5,
                "question": "Consider the differential equation $\\frac{dy}{dx} = y - 2$. Without solving the equation analytically, what can you deduce about the solution $y(x) = 2$?",
                "answerOptions": [
                    {
                        "text": "It is a stable equilibrium solution.",
                        "rationale": "Incorrect. While it is an equilibrium, if $y > 2$ the slope is positive (moving away), and if $y < 2$ the slope is negative (moving away).",
                        "isCorrect": False
                    },
                    {
                        "text": "It is an unstable equilibrium solution.",
                        "rationale": "Correct! Plugging in $y=2$ yields $\\frac{dy}{dx} = 0$, making it an equilibrium. However, solutions slightly above 2 will have a positive slope and diverge upwards, and solutions below 2 will have a negative slope and diverge downwards. Therefore, it is unstable.",
                        "isCorrect": True
                    },
                    {
                        "text": "It is the only valid solution.",
                        "rationale": "Incorrect. $y=2$ is a particular equilibrium solution, but there is an infinite family of other general solutions.",
                        "isCorrect": False
                    },
                    {
                        "text": "It is not a valid solution because the derivative is zero.",
                        "rationale": "Incorrect. A derivative of zero simply means the function is constant, which is a perfectly valid dynamic state (equilibrium).",
                        "isCorrect": False
                    }
                ],
                "hint": "Plug $y=2$ into the derivative formula. What happens to the slope if $y$ is 2.1? What if $y$ is 1.9?"
            }
        ]
    }
}


def print_banner():
    """Prints a beautiful title banner in the terminal."""
    banner = r"""
========================================================================
     ___  ____  _____   ____   _         _     _     _   
    / _ \|  _ \| ____| |  _ \ | |  __ _ | |   (_)___| |_ 
   | | | | | | |  _|   | |_) || | / _` || |   | / __| __|
   | |_| | |_| | |___  |  __/ | || (_| || |___| \__ \ |_ 
    \___/|____/|_____| |_|    |_| \__,_||_____|_|___/\__|
                    P L A Y L I S T   S O R T E R
========================================================================
    """
    print(banner)


# ==========================================
# PLAYLIST FETCHING & SCRAPING LOGIC
# ==========================================
def fetch_playlist_html(url):
    """Downloads the YouTube playlist HTML using urllib with SSL verification disabled."""
    print(f"[*] Downloading playlist data from YouTube...")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
    }
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=30) as response:
            return response.read().decode('utf-8', errors='replace')
    except Exception as e:
        print(f"[!] Error downloading playlist page: {e}")
        return None


def parse_playlist_videos(html):
    """
    Parses video elements from YouTube's ytInitialData JSON inside the page HTML.
    Includes a fallback regex parser in case JSON structure is altered.
    """
    print("[*] Parsing playlist HTML content...")
    videos = []
    
    # Method 1: Extract and parse ytInitialData JSON object
    pattern = re.compile(r'ytInitialData\s*=\s*({.*?});', re.DOTALL)
    match = pattern.search(html)
    if not match:
        pattern = re.compile(r'ytInitialData\s*=\s*({.*?})', re.DOTALL)
        match = pattern.search(html)
        
    if match:
        try:
            data = json.loads(match.group(1))
            
            # Recursive search for playlistVideoRenderer nodes
            def extract_nodes(obj):
                if isinstance(obj, dict):
                    if 'playlistVideoRenderer' in obj:
                        videos.append(obj['playlistVideoRenderer'])
                    else:
                        for val in obj.values():
                            extract_nodes(val)
                elif isinstance(obj, list):
                    for item in obj:
                        extract_nodes(item)
                        
            extract_nodes(data)
            
            if videos:
                parsed_list = []
                for idx, v in enumerate(videos):
                    title = v.get('title', {}).get('runs', [{}])[0].get('text', 'No Title')
                    video_id = v.get('videoId')
                    parsed_list.append({
                        'original_index': idx + 1,
                        'title': title,
                        'id': video_id,
                        'url': f"https://www.youtube.com/watch?v={video_id}"
                    })
                return parsed_list
        except Exception as e:
            print(f"[!] JSON parsing failed: {e}. Falling back to regex.")
            
    # Method 2: Fallback regex search for videoId and title
    print("[*] Running regex fallback search...")
    # Find patterns like "videoId":"XXXXXXX" and "title":{"runs":[{"text":"YYYYYYY"
    # To keep it safe, extract all potential videoId blocks
    video_blocks = re.findall(r'"playlistVideoRenderer":\{(.*?)\}', html, re.DOTALL)
    if not video_blocks:
        # Wider fallback
        video_blocks = re.findall(r'"videoId":"([^"]+)".*?"title":\{"runs":\[\{"text":"([^"]+)"', html)
        if video_blocks:
            parsed_list = []
            for idx, (vid_id, title) in enumerate(video_blocks):
                parsed_list.append({
                    'original_index': idx + 1,
                    'title': title.encode().decode('unicode-escape', errors='replace'),
                    'id': vid_id,
                    'url': f"https://www.youtube.com/watch?v={vid_id}"
                })
            return parsed_list
            
    parsed_list = []
    for idx, block in enumerate(video_blocks):
        id_match = re.search(r'"videoId":"([^"]+)"', block)
        title_match = re.search(r'"title":\{"runs":\[\{"text":"([^"]+)"', block)
        if id_match and title_match:
            parsed_list.append({
                'original_index': idx + 1,
                'title': title_match.group(1).encode().decode('unicode-escape', errors='replace'),
                'id': id_match.group(1),
                'url': f"https://www.youtube.com/watch?v={id_match.group(1)}"
            })
            
    return parsed_list


def get_videos(force_fetch=False):
    """
    Retrieves the videos from cache or fetches them live.
    Saves loaded videos in local cache.
    """
    if not force_fetch and os.path.exists(CACHE_FILE):
        file_age = time.time() - os.path.getmtime(CACHE_FILE)
        if file_age < CACHE_EXPIRY_SECONDS:
            print(f"[*] Loading videos from local cache '{CACHE_FILE}'...")
            try:
                with open(CACHE_FILE, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"[!] Error reading cache file: {e}. Fetching live.")
                
    # Cache is invalid or force-fetch requested
    html = fetch_playlist_html(PLAYLIST_URL)
    if not html:
        # If live fetch fails, try to load cache as a desperate backup
        if os.path.exists(CACHE_FILE):
            print("[!] Live fetch failed. Falling back to expired local cache...")
            with open(CACHE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        sys.exit("[!] Critical Error: Could not download playlist and no cached version exists.")
        
    videos = parse_playlist_videos(html)
    if not videos:
        # If parsing fails but cache exists, load cache
        if os.path.exists(CACHE_FILE):
            print("[!] Could not parse live HTML. Falling back to cached data...")
            with open(CACHE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        sys.exit("[!] Critical Error: Scraped playlist successfully but extracted 0 videos. YouTube layout might have changed.")
        
    print(f"[+] Successfully extracted {len(videos)} videos from playlist.")
    
    # Save cache
    try:
        with open(CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(videos, f, indent=2, ensure_ascii=False)
        print(f"[*] Cached playlist videos to '{CACHE_FILE}'")
    except Exception as e:
        print(f"[!] Could not write cache file: {e}")
        
    return videos


# ==========================================
# GEMINI API SORTING ENGINE
# ==========================================
def query_gemini_sorter(videos, api_key):
    """
    Uses Gemini API to sort the playlist.
    Tries the modern `google-genai` SDK first, then falls back to `google-generativeai`.
    """
    print("[*] Initializing Gemini API connection for pedagogical sorting...")
    
    # Construct the instruction prompt with the list of titles
    video_list_str = ""
    for idx, v in enumerate(videos):
        video_list_str += f"Index: {idx}, ID: {v['id']}, Title: {v['title']}\n"
        
    prompt = f"""
You are an expert university professor in Mathematics, specializing in Ordinary Differential Equations (ODEs).
I have a list of {len(videos)} YouTube videos from a playlist covering various Differential Equations topics. Currently, they are in a disordered sequence.
I need you to sort them into a highly logical, step-by-step pedagogical learning path / syllabus.

Here is the list of videos:
{video_list_str}

Please organize these videos into 11 sequential course chapters:
1. Foundations & Definitions (basic introduction, order, degree, linear vs non-linear, verifying solutions, IVPs/BVPs, creating ODEs from constant elimination)
2. First-Order Separable Equations (separating variables, basic integration, applications like Newton's cooling law)
3. Linear First-Order Equations & Integrating Factors (using integrating factors, constant and variable rate systems)
4. Homogeneous First-Order Equations (identifying homogeneous functions, substitutions like y = vx)
5. Exact Equations & Substitutions (testing for exactness, finding potential functions, solving exact equations, Bernoulli equation transformations)
6. Qualitative Analysis, Slope Fields & Stability (drawing slope fields, existence & uniqueness theorem, autonomous ODEs, equilibrium states, stability/instability, logistic equations)
7. Frequency Response & Exponential Inputs (complex exponentials, responding to exponential/oscillatory inputs, general inputs)
8. Second-Order Linear Equations (homogeneous and foundational theory, superposition, linear independence, solving basic second-order ODEs)
9. Second-Order Linear Equations (Non-Homogeneous) (undetermined coefficients, variation of parameters, Wronskian framework)
10. The Laplace Transform (integral transform definition, shifting theorems, initial value problems with step/impulse inputs, inverse transforms)
11. Systems of Linear Differential Equations (coupled first-order rate models, matrix systems, eigenvalues/eigenvectors, distinct/repeated roots, phase portraits, stability analysis)

Ensure every single video is assigned to exactly one chapter and placed in the optimal pedagogical order within that chapter.

Return your response strictly in the following JSON format:
{{
  "chapters": [
    {{
      "chapter_number": 1,
      "chapter_name": "Foundations & Definitions",
      "description": "Brief description of this chapter's learning goal",
      "video_ids": ["video_id_1", "video_id_2", ...]
    }},
    ...
  ]
}}

Ensure every single video ID from the input list is accounted for in the output JSON. Do not return any other text, markdown, or chat wrapping. Return raw JSON only.
"""

    # Try modern google-genai SDK
    try:
        print("[*] Trying Google GenAI SDK (google-genai)...")
        from google import genai
        from google.genai import types
        
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        return parse_gemini_json(response.text, videos)
    except ImportError:
        print("[*] google-genai not found. Trying legacy google-generativeai SDK...")
    except Exception as e:
        print(f"[!] google-genai error: {e}. Trying legacy fallback...")

    # Try legacy google-generativeai SDK
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        return parse_gemini_json(response.text, videos)
    except ImportError:
        print("[!] No Gemini SDKs found on the system. Run: pip install google-genai or pip install google-generativeai")
    except Exception as e:
        print(f"[!] Legacy SDK error: {e}")
        
    return None


def parse_gemini_json(response_text, videos):
    """Parses and validates the JSON output from Gemini, returning the chapter-mapped list."""
    try:
        # Strip any markdown code fence wrapping if present
        cleaned_text = response_text.strip()
        if cleaned_text.startswith("```json"):
            cleaned_text = cleaned_text[7:]
        if cleaned_text.endswith("```"):
            cleaned_text = cleaned_text[:-3]
        cleaned_text = cleaned_text.strip()
        
        parsed = json.loads(cleaned_text)
        
        # Build video lookup map
        video_map = {v['id']: v for v in videos}
        
        structured_syllabus = []
        parsed_ids = set()
        
        for chapter in parsed.get("chapters", []):
            ch_videos = []
            for vid_id in chapter.get("video_ids", []):
                if vid_id in video_map:
                    ch_videos.append(video_map[vid_id])
                    parsed_ids.add(vid_id)
                    
            structured_syllabus.append({
                'name': f"{chapter.get('chapter_number')}. {chapter.get('chapter_name')}",
                'description': chapter.get('description', ''),
                'videos': ch_videos
            })
            
        # Check if any videos were missed by Gemini
        missed_ids = set(video_map.keys()) - parsed_ids
        if missed_ids:
            print(f"[*] Gemini missed {len(missed_ids)} videos. Appending to matching chapters...")
            # We'll place missed videos into the syllabus dynamically
            for missed_id in missed_ids:
                placed = False
                for fallback_ch in PEDAGOGICAL_SECTIONS:
                    if missed_id in fallback_ch['video_ids']:
                        # Add to the corresponding generated chapter
                        for gen_ch in structured_syllabus:
                            if gen_ch['name'].split('.')[1].strip().lower() == fallback_ch['name'].split('.')[1].strip().lower():
                                gen_ch['videos'].append(video_map[missed_id])
                                placed = True
                                break
                if not placed:
                    # Append to chapter 1 as default fallback
                    structured_syllabus[0]['videos'].append(video_map[missed_id])
                    
        return structured_syllabus
    except Exception as e:
        print(f"[!] Failed to parse Gemini JSON: {e}")
        return None


def apply_fallback_sorting(videos):
    """Sorts the parsed videos based on the expert-curated fallback layout."""
    print("[*] Generating syllabus using the expert-curated fallback sequence...")
    
    # Map videos by ID
    video_map = {v['id']: v for v in videos}
    
    structured_syllabus = []
    placed_ids = set()
    
    for ch in PEDAGOGICAL_SECTIONS:
        ch_videos = []
        for vid_id in ch['video_ids']:
            if vid_id in video_map:
                ch_videos.append(video_map[vid_id])
                placed_ids.add(vid_id)
                
        structured_syllabus.append({
            'name': ch['name'],
            'description': ch['description'],
            'videos': ch_videos
        })
        
    # Check if there are any new or unmapped videos in the playlist
    unplaced_ids = set(video_map.keys()) - placed_ids
    if unplaced_ids:
        print(f"[*] Found {len(unplaced_ids)} unclassified videos. Adding to Chapter 1...")
        for vid_id in unplaced_ids:
            structured_syllabus[0]['videos'].append(video_map[vid_id])
            
    return structured_syllabus


# ==========================================
# GORGEOUS EXPORTERS
# ==========================================
def export_to_markdown(syllabus, output_path):
    """Exports the sorted syllabus to a highly structured Markdown file."""
    print(f"[*] Exporting sorted playlist to Markdown '{output_path}'...")
    
    total_videos = sum(len(chapter.get('videos', [])) for chapter in syllabus)
    
    md_content = f"""# 📚 Ordinary Differential Equations: Logical Study Guide & Syllabus

This syllabus contains a logically ordered, pedagogically optimized roadmap of the **{total_videos} videos** in the YouTube playlist. 
Use this document to guide your self-study from primary concepts to advanced second-order systems.

---

"""
    
    for chapter in syllabus:
        md_content += f"## {chapter['name']}\n"
        md_content += f"*{chapter['description']}*\n\n"
        
        if not chapter['videos']:
            md_content += "*No videos in this section yet.*\n\n"
        else:
            for idx, video in enumerate(chapter['videos']):
                md_content += f"{idx+1}. **[{video['title']}]({video['url']})**\n"
                md_content += f"   - *Video ID*: `{video['id']}` | *Original Playlist Position*: #{video['original_index']}\n"
            md_content += "\n"
            
        md_content += "---\n\n"
        
    md_content += f"**Syllabus generated successfully with a total of {total_videos} videos.**\n"
    
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(md_content)
        print(f"[+] Markdown syllabus successfully written to '{output_path}'")
    except Exception as e:
        print(f"[!] Error writing Markdown file: {e}")


def export_to_html(syllabus, output_path):
    """Exports the sorted syllabus into a stunning glassmorphism, responsive HTML dashboard."""
    print(f"[*] Exporting interactive HTML dashboard to '{output_path}'...")
    
    # Generate sections JSON data for HTML embedding
    html_syllabus = []
    total_videos = 0
    
    for ch_idx, chapter in enumerate(syllabus):
        ch_vids = []
        for vid in chapter['videos']:
            total_videos += 1
            ch_vids.append({
                'title': vid['title'].replace('"', '\\"'),
                'id': vid['id'],
                'url': vid['url'],
                'orig_index': vid['original_index']
            })
        html_syllabus.append({
            'ch_number': ch_idx + 1,
            'name': chapter['name'],
            'description': chapter['description'],
            'videos': ch_vids
        })
    syllabus_json_str = json.dumps(html_syllabus, ensure_ascii=False)
    quizzes_json_str = json.dumps(QUIZZES, ensure_ascii=False)
    
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ODE Playlist Study Dashboard</title>
    
    <!-- Premium Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- KaTeX for beautiful LaTeX rendering in Quizzes -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>
    
    <style>
        :root {{
            --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #020617 100%);
            --accent-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
            --glow-color: rgba(99, 102, 241, 0.4);
            --card-bg: rgba(30, 41, 59, 0.45);
            --card-border: rgba(255, 255, 255, 0.08);
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --success-color: #10b981;
            --sidebar-width: 320px;
        }}

        * {{
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }}

        body {{
            background: var(--bg-gradient);
            background-attachment: fixed;
            color: var(--text-primary);
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            overflow-x: hidden;
            display: flex;
            flex-direction: column;
        }}

        h1, h2, h3, h4, .chapter-title {{
            font-family: 'Outfit', sans-serif;
        }}

        /* Scrollbar styling */
        ::-webkit-scrollbar {{
            width: 8px;
        }}
        ::-webkit-scrollbar-track {{
            background: rgba(15, 23, 42, 0.5);
        }}
        ::-webkit-scrollbar-thumb {{
            background: rgba(99, 102, 241, 0.3);
            border-radius: 4px;
        }}
        ::-webkit-scrollbar-thumb:hover {{
            background: rgba(99, 102, 241, 0.6);
        }}

        /* Header block */
        header {{
            position: relative;
            padding: 3rem 2rem 2.5rem;
            text-align: center;
            background: rgba(15, 23, 42, 0.3);
            border-bottom: 1px solid var(--card-border);
            backdrop-filter: blur(8px);
        }}

        .glow-circle {{
            position: absolute;
            top: -100px;
            left: 50%;
            transform: translateX(-50%);
            width: 400px;
            height: 250px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(0,0,0,0) 70%);
            z-index: 0;
            pointer-events: none;
        }}

        .header-container {{
            max-width: 1400px;
            margin: 0 auto;
            position: relative;
            z-index: 1;
        }}

        header h1 {{
            font-size: 3rem;
            font-weight: 800;
            letter-spacing: -0.03em;
            background: var(--accent-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
        }}

        header p {{
            color: var(--text-secondary);
            font-size: 1.1rem;
            max-width: 600px;
            margin: 0 auto 1.5rem;
            font-weight: 300;
        }}

        /* Progress Dashboard Banner */
        .progress-banner {{
            max-width: 600px;
            margin: 0 auto;
            background: rgba(30, 41, 59, 0.6);
            border: 1px solid var(--card-border);
            border-radius: 12px;
            padding: 1rem 1.5rem;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1.5rem;
        }}

        .progress-info {{
            text-align: left;
        }}

        .progress-title {{
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.25rem;
        }}

        .progress-percentage {{
            font-size: 1.6rem;
            font-weight: 800;
            color: var(--text-primary);
            font-family: 'Outfit', sans-serif;
        }}

        .progress-track-bg {{
            flex-grow: 1;
            height: 10px;
            background: rgba(15, 23, 42, 0.6);
            border-radius: 10px;
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }}

        .progress-bar-fill {{
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 0%;
            background: var(--accent-gradient);
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
            transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }}

        /* Main Grid Layout */
        .app-container {{
            max-width: 1500px;
            margin: 2rem auto;
            padding: 0 2rem;
            display: flex;
            gap: 2rem;
            flex-grow: 1;
            width: 100%;
        }}

        /* Sidebar Navigation & Filters */
        .sidebar {{
            width: var(--sidebar-width);
            flex-shrink: 0;
            position: sticky;
            top: 2rem;
            height: calc(100vh - 6rem);
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }}

        .glass-panel {{
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 16px;
            backdrop-filter: blur(12px);
            padding: 1.5rem;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
        }}

        .sidebar-title {{
            font-size: 1.1rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: var(--text-primary);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            padding-bottom: 0.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}

        .reset-btn {{
            font-size: 0.75rem;
            color: #ef4444;
            background: none;
            border: 1px solid rgba(239, 68, 68, 0.2);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            cursor: pointer;
            font-family: inherit;
            transition: all 0.2s;
        }}

        .reset-btn:hover {{
            background: rgba(239, 68, 68, 0.1);
            border-color: #ef4444;
        }}

        .filter-list {{
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            overflow-y: auto;
            flex-grow: 1;
            padding-right: 0.25rem;
        }}

        .filter-item {{
            padding: 0.75rem 1rem;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 0.9rem;
            color: var(--text-secondary);
            border: 1px solid transparent;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }}

        .filter-item:hover {{
            background: rgba(255, 255, 255, 0.03);
            color: var(--text-primary);
        }}

        .filter-item.active {{
            background: rgba(99, 102, 241, 0.15);
            color: var(--text-primary);
            border-color: rgba(99, 102, 241, 0.3);
            font-weight: 600;
        }}

        .filter-badge {{
            background: rgba(15, 23, 42, 0.6);
            color: var(--text-secondary);
            font-size: 0.75rem;
            padding: 0.15rem 0.5rem;
            border-radius: 20px;
            font-weight: 400;
        }}

        .filter-item.active .filter-badge {{
            background: var(--accent-gradient);
            color: white;
            font-weight: 600;
        }}

        /* Content Area */
        .content-area {{
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 2.5rem;
        }}

        /* Chapter Section */
        .chapter-section {{
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
            scroll-margin-top: 2rem;
            transition: opacity 0.3s;
        }}

        .chapter-header {{
            border-bottom: 2px solid rgba(99, 102, 241, 0.25);
            padding-bottom: 0.75rem;
        }}

        .chapter-title {{
            font-size: 1.6rem;
            font-weight: 700;
            background: linear-gradient(to right, #ffffff, #c7d2fe);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.25rem;
        }}

        .chapter-desc {{
            color: var(--text-secondary);
            font-size: 0.95rem;
            font-weight: 300;
        }}

        /* Video Card Grid */
        .video-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.5rem;
        }}

        /* Video Card */
        .video-card {{
            position: relative;
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 14px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }}

        .video-card:hover {{
            transform: translateY(-5px);
            border-color: rgba(99, 102, 241, 0.3);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 
                        0 0 15px 0 rgba(99, 102, 241, 0.1);
        }}

        .video-card.watched {{
            border-color: rgba(16, 185, 129, 0.3);
        }}

        .thumbnail-container {{
            position: relative;
            width: 100%;
            padding-top: 56.25%; /* 16:9 Aspect Ratio */
            background: #000;
            overflow: hidden;
        }}

        .thumbnail-img {{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s;
        }}

        .video-card:hover .thumbnail-img {{
            transform: scale(1.05);
        }}

        /* Checkbox watched layer */
        .card-checkbox-label {{
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 10;
            background: rgba(15, 23, 42, 0.85);
            border: 1.5px solid var(--card-border);
            padding: 6px;
            border-radius: 8px;
            cursor: pointer;
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }}

        .card-checkbox-label:hover {{
            background: rgba(99, 102, 241, 0.2);
            border-color: rgba(99, 102, 241, 0.5);
        }}

        .card-checkbox {{
            appearance: none;
            width: 18px;
            height: 18px;
            border: 2px solid var(--text-secondary);
            border-radius: 4px;
            outline: none;
            cursor: pointer;
            position: relative;
            transition: all 0.2s;
            background: transparent;
        }}

        .card-checkbox:checked {{
            background: var(--success-color);
            border-color: var(--success-color);
        }}

        .card-checkbox:checked::after {{
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #fff;
            font-size: 11px;
            font-weight: 900;
        }}

        .orig-badge {{
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 10;
            background: rgba(15, 23, 42, 0.85);
            color: var(--text-secondary);
            font-size: 0.75rem;
            padding: 4px 8px;
            border-radius: 8px;
            border: 1px solid var(--card-border);
            backdrop-filter: blur(4px);
            font-weight: 500;
        }}

        .video-details {{
            padding: 1.25rem;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            justify-content: space-between;
            gap: 1rem;
        }}

        .video-title-link {{
            color: var(--text-primary);
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 600;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            transition: color 0.2s;
        }}

        .video-title-link:hover {{
            color: #a855f7;
            text-shadow: 0 0 10px rgba(168, 85, 247, 0.2);
        }}

        .play-btn {{
            width: 100%;
            padding: 0.65rem;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            color: var(--text-primary);
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 0.85rem;
        }}

        .play-btn:hover {{
            background: var(--accent-gradient);
            border-color: transparent;
            box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
            transform: scale(1.02);
            color: #fff;
        }}

        }}

        /* Quiz Styles */
        .quiz-badge-btn {{
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
            border: 1px solid rgba(99, 102, 241, 0.4);
            color: var(--text-primary);
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all 0.3s ease;
            margin-top: 8px;
            font-family: 'Outfit', sans-serif;
        }}

        .quiz-badge-btn:hover {{
            background: var(--accent-gradient);
            border-color: transparent;
            box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
            transform: translateY(-2px);
        }}

        .quiz-passed-badge {{
            background: rgba(16, 185, 129, 0.15);
            border: 1px solid rgba(16, 185, 129, 0.4);
            color: #34d399;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            margin-top: 8px;
        }}

        /* Modal Background */
        .modal-overlay {{
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(2, 6, 23, 0.75);
            backdrop-filter: blur(8px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }}

        .modal-overlay.active {{
            opacity: 1;
            pointer-events: auto;
        }}

        /* Modal Container */
        .quiz-modal {{
            background: rgba(30, 41, 59, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            width: 90%;
            max-width: 650px;
            padding: 2.5rem;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 
                        0 0 40px rgba(99, 102, 241, 0.15);
            backdrop-filter: blur(20px);
            position: relative;
            transform: scale(0.9);
            transition: transform 0.3s ease;
            max-height: 90vh;
            overflow-y: auto;
        }}

        .modal-overlay.active .quiz-modal {{
            transform: scale(1);
        }}

        .close-modal-btn {{
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 1.5rem;
            cursor: pointer;
            transition: color 0.2s;
        }}

        .close-modal-btn:hover {{
            color: var(--text-primary);
        }}

        /* Quiz UI Elements */
        .quiz-header {{
            margin-bottom: 1.5rem;
        }}

        .quiz-title {{
            font-size: 1.5rem;
            font-weight: 800;
            background: var(--accent-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }}

        .quiz-progress-container {{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1rem;
            font-size: 0.85rem;
            color: var(--text-secondary);
        }}

        .quiz-progress-bar-bg {{
            height: 6px;
            background: rgba(15, 23, 42, 0.6);
            border-radius: 3px;
            overflow: hidden;
            width: 100%;
            margin-bottom: 1.5rem;
        }}

        .quiz-progress-bar-fill {{
            height: 100%;
            background: var(--accent-gradient);
            width: 0%;
            transition: width 0.3s ease;
        }}

        .question-text {{
            font-size: 1.1rem;
            font-weight: 600;
            line-height: 1.5;
            color: var(--text-primary);
            margin-bottom: 1.5rem;
        }}

        .options-list {{
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            list-style: none;
            margin-bottom: 1.5rem;
        }}

        .option-card {{
            background: rgba(15, 23, 42, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 1rem 1.25rem;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 0.95rem;
            color: var(--text-secondary);
        }}

        .option-card:hover {{
            background: rgba(255, 255, 255, 0.03);
            border-color: rgba(99, 102, 241, 0.3);
            color: var(--text-primary);
        }}

        .option-card.selected {{
            background: rgba(99, 102, 241, 0.1);
            border-color: rgba(99, 102, 241, 0.6);
            color: var(--text-primary);
            box-shadow: 0 0 15px rgba(99, 102, 241, 0.25);
        }}

        .option-card.correct {{
            background: rgba(16, 185, 129, 0.15);
            border-color: var(--success-color);
            color: var(--text-primary);
        }}

        .option-card.incorrect {{
            background: rgba(239, 68, 68, 0.15);
            border-color: #ef4444;
            color: var(--text-primary);
        }}

        .option-radio {{
            appearance: none;
            width: 18px;
            height: 18px;
            border: 2px solid var(--text-secondary);
            border-radius: 50%;
            outline: none;
            position: relative;
            flex-shrink: 0;
            transition: all 0.2s;
        }}

        .option-card.correct .option-radio {{
            border-color: var(--success-color);
            background: var(--success-color);
        }}

        .option-card.correct .option-radio::after {{
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: white;
        }}

        .option-card.incorrect .option-radio {{
            border-color: #ef4444;
            background: #ef4444;
        }}

        .option-card.incorrect .option-radio::after {{
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: white;
        }}

        .option-card.selected .option-radio {{
            border-color: #a855f7;
        }}

        .option-card.selected .option-radio::after {{
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--accent-gradient);
        }}

        /* Feedback Area */
        .feedback-container {{
            background: rgba(15, 23, 42, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 1rem 1.25rem;
            margin-bottom: 1.5rem;
            display: none;
            animation: fadeIn 0.3s ease;
        }}

        .feedback-title {{
            font-size: 0.9rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
            display: flex;
            align-items: center;
            gap: 6px;
        }}

        .feedback-title.correct {{ color: var(--success-color); }}
        .feedback-title.incorrect {{ color: #ef4444; }}

        .feedback-text {{
            font-size: 0.9rem;
            color: var(--text-secondary);
            line-height: 1.4;
        }}

        /* Action Buttons */
        .quiz-actions {{
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        }}

        .quiz-btn-secondary {{
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: var(--text-secondary);
            padding: 0.75rem 1.5rem;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 0.9rem;
        }}

        .quiz-btn-secondary:hover {{
            background: rgba(255, 255, 255, 0.08);
            color: var(--text-primary);
        }}

        .quiz-btn-primary {{
            background: var(--accent-gradient);
            border: none;
            color: white;
            padding: 0.75rem 1.75rem;
            border-radius: 10px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 0.9rem;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
            display: flex;
            align-items: center;
            gap: 6px;
            margin-left: auto;
        }}

        .quiz-btn-primary:hover {{
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }}

        /* Hint Box */
        .hint-box {{
            background: rgba(99, 102, 241, 0.1);
            border: 1px dashed rgba(99, 102, 241, 0.3);
            border-radius: 12px;
            padding: 1rem 1.25rem;
            margin-bottom: 1.5rem;
            color: var(--text-primary);
            font-size: 0.9rem;
            line-height: 1.4;
            display: none;
            animation: fadeIn 0.3s ease;
        }}

        /* Results Screen */
        .results-container {{
            text-align: center;
            display: none;
            animation: fadeIn 0.4s ease;
        }}

        .results-score-circle {{
            width: 140px;
            height: 140px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
            border: 4px solid rgba(99, 102, 241, 0.3);
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.5rem;
            box-shadow: 0 0 25px rgba(99, 102, 241, 0.2);
        }}

        .results-score-num {{
            font-size: 2.5rem;
            font-weight: 800;
            font-family: 'Outfit', sans-serif;
            background: var(--accent-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }}

        .results-score-label {{
            font-size: 0.75rem;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }}

        .results-heading {{
            font-size: 1.8rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
            font-family: 'Outfit', sans-serif;
        }}

        .results-sub {{
            color: var(--text-secondary);
            font-size: 0.95rem;
            margin-bottom: 2rem;
            line-height: 1.4;
        }}
        @keyframes fadeIn {{
            from {{ opacity: 0; transform: translateY(5px); }}
            to {{ opacity: 1; transform: translateY(0); }}
        }}
        
        .sidebar-passed-dot {{
            font-size: 0.85rem;
            font-weight: 800;
        }}
        
        .chapter-quiz-status {{
            align-self: center;
        }}
    </style>
</head>
<body>

    <header>
        <div class="glow-circle"></div>
        <div class="header-container">
            <h1>Ordinary Differential Equations</h1>
            <p>A logically ordered, educational study guide of the {total_videos}-video learning playlist.</p>
            
            <div class="progress-banner">
                <div class="progress-info">
                    <div class="progress-title">Your Progress</div>
                    <div class="progress-percentage" id="progress-text">0% (0 / {total_videos})</div>
                </div>
                <div class="progress-track-bg">
                    <div class="progress-bar-fill" id="progress-bar"></div>
                </div>
            </div>
        </div>
    </header>

    <div class="app-container">
        
        <!-- Sidebar Navigation and Topic Filter -->
        <div class="sidebar">
            <div class="glass-panel" style="display: flex; flex-direction: column; height: 100%; overflow: hidden;">
                <div class="sidebar-title">
                    <span>Syllabus Chapters</span>
                    <button class="reset-btn" id="reset-progress">Reset Progress</button>
                </div>
                <ul class="filter-list" id="chapters-nav">
                    <li class="filter-item active" data-filter="all">
                        <span>All Chapters</span>
                        <span class="filter-badge" id="badge-all">{total_videos}</span>
                    </li>
                    <!-- Categories list dynamically generated -->
                </ul>
            </div>
        </div>
        
        <!-- Main Videos List Container -->
        <div class="content-area" id="content-container">
            <!-- Chapters and Video grids dynamically generated -->
        </div>
        
    </div>

    <!-- Quiz Modal Overlay -->
    <div class="modal-overlay" id="quiz-modal-container">
        <div class="quiz-modal">
            <button class="close-modal-btn" onclick="closeQuiz()">&times;</button>
            <div id="quiz-content-area">
                <!-- Dynamic quiz content -->
            </div>
        </div>
    </div>

    <!-- Syllabus Data & Controller Script -->
    <script>
        const syllabusData = {syllabus_json_str};
        const quizzesData = {quizzes_json_str};

        // DOM Elements
        const chaptersNav = document.getElementById('chapters-nav');
        const contentContainer = document.getElementById('content-container');
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        const resetProgressBtn = document.getElementById('reset-progress');

        // Watch state management
        let watchedVideos = JSON.parse(localStorage.getItem('watched_videos') || '[]');
        let completedQuizzes = JSON.parse(localStorage.getItem('completed_quizzes') || '{{}}');

        function updateProgress() {{
            const totalVideos = {total_videos};
            const watchedCount = watchedVideos.length;
            const percentage = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;
            
            progressBar.style.width = percentage + '%';
            progressText.innerText = percentage + '% (' + watchedCount + ' / ' + totalVideos + ')';
        }}

        function toggleVideoWatch(videoId, isChecked) {{
            if (isChecked) {{
                if (!watchedVideos.includes(videoId)) {{
                    watchedVideos.push(videoId);
                }}
            }} else {{
                watchedVideos = watchedVideos.filter(id => id !== videoId);
            }}
            localStorage.setItem('watched_videos', JSON.stringify(watchedVideos));
            updateProgress();
            
            // Toggle visual class
            const card = document.getElementById('card-' + videoId);
            if (card) {{
                if (isChecked) {{
                    card.classList.add('watched');
                }} else {{
                    card.classList.remove('watched');
                }}
            }}
        }}

        function buildDashboard() {{
            // Clean dynamic components
            // Build the catalog
            syllabusData.forEach((chapter, chIdx) => {{
                // Determine if a quiz exists for this chapter
                const hasQuiz = quizzesData[chapter.ch_number] ? true : false;
                let quizBtnHtml = '';
                let sidebarQuizStatus = '';
                
                if (hasQuiz) {{
                    const quizId = quizzesData[chapter.ch_number].quiz_id;
                    const isPassed = completedQuizzes[quizId] && completedQuizzes[quizId].completed;
                    
                    if (isPassed) {{
                        quizBtnHtml = `
                            <div class="quiz-passed-badge" id="passed-badge-${{quizId}}">
                                <span>✓ Passed Checkpoint</span>
                            </div>
                        `;
                        sidebarQuizStatus = ' <span class="sidebar-passed-dot" title="Quiz Passed" style="color: #34d399; margin-left: 5px;">✓</span>';
                    }} else {{
                        quizBtnHtml = `
                            <button class="quiz-badge-btn" id="quiz-btn-${{quizId}}" onclick="openQuiz('${{chapter.ch_number}}')">
                                📝 Take Checkpoint Quiz
                            </button>
                        `;
                    }}
                }}

                // 1. Generate Sidebar Nav item
                const navItem = document.createElement('li');
                navItem.className = 'filter-item';
                navItem.setAttribute('data-filter', 'chapter-' + chapter.ch_number);
                navItem.innerHTML = `
                    <span>Ch. ${{chapter.ch_number}} - ${{chapter.name.split('.')[1] ? chapter.name.split('.')[1].trim() : chapter.name}}${{sidebarQuizStatus}}</span>
                    <span class="filter-badge">${{chapter.videos.length}}</span>
                `;
                chaptersNav.appendChild(navItem);

                // 2. Generate Chapter Section block
                const section = document.createElement('section');
                section.className = 'chapter-section';
                section.id = 'chapter-' + chapter.ch_number;
                
                section.innerHTML = `
                    <div class="chapter-header">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                            <div>
                                <h2 class="chapter-title">${{chapter.name}}</h2>
                                <div class="chapter-desc">${{chapter.description}}</div>
                            </div>
                            <div class="chapter-quiz-status" id="quiz-status-container-${{chapter.ch_number}}">
                                ${{quizBtnHtml}}
                            </div>
                        </div>
                    </div>
                `;

                const grid = document.createElement('div');
                grid.className = 'video-grid';

                chapter.videos.forEach(video => {{
                    const isWatched = watchedVideos.includes(video.id);
                    
                    const card = document.createElement('div');
                    card.className = 'video-card' + (isWatched ? ' watched' : '');
                    card.id = 'card-' + video.id;
                    
                    card.innerHTML = `
                        <div class="thumbnail-container">
                            <label class="card-checkbox-label">
                                <input type="checkbox" class="card-checkbox" data-id="${{video.id}}" ${{isWatched ? 'checked' : ''}}>
                            </label>
                            <span class="orig-badge">#${{video.orig_index}}</span>
                            <img class="thumbnail-img" src="https://img.youtube.com/vi/${{video.id}}/mqdefault.jpg" alt="Video Thumbnail" loading="lazy">
                        </div>
                        <div class="video-details">
                            <a href="${{video.url}}" target="_blank" class="video-title-link" title="${{video.title}}">${{video.title}}</a>
                            <a href="${{video.url}}" target="_blank" class="play-btn">Play Video</a>
                        </div>
                    `;
                    grid.appendChild(card);
                }});

                section.appendChild(grid);
                contentContainer.appendChild(section);
            }});

            // Wire up event listeners
            document.querySelectorAll('.card-checkbox').forEach(checkbox => {{
                checkbox.addEventListener('change', (e) => {{
                    toggleVideoWatch(e.target.getAttribute('data-id'), e.target.checked);
                }});
            }});

            // Wire up Chapter filters
            document.querySelectorAll('.filter-item').forEach(item => {{
                item.addEventListener('click', (e) => {{
                    const clickedItem = e.currentTarget;
                    document.querySelectorAll('.filter-item').forEach(el => el.classList.remove('active'));
                    clickedItem.classList.add('active');
                    
                    const filter = clickedItem.getAttribute('data-filter');
                    
                    document.querySelectorAll('.chapter-section').forEach(section => {{
                        if (filter === 'all' || section.id === filter) {{
                            section.style.display = 'flex';
                        }} else {{
                            section.style.display = 'none';
                        }}
                    }});
                }});
            }});

            // Wire up reset button
            resetProgressBtn.addEventListener('click', () => {{
                if (confirm('Are you sure you want to reset your study and quiz progress?')) {{
                    watchedVideos = [];
                    completedQuizzes = {{}};
                    localStorage.removeItem('watched_videos');
                    localStorage.removeItem('completed_quizzes');
                    document.querySelectorAll('.card-checkbox').forEach(cb => cb.checked = false);
                    document.querySelectorAll('.video-card').forEach(card => card.classList.remove('watched'));
                    
                    // Rebuild entire dashboard to reset quiz buttons and badges
                    location.reload();
                }}
            }});

            updateProgress();
        }}

        // ==========================================
        // CHECKPOINT QUIZ ENGINE
        // ==========================================
        let currentQuiz = null;
        let currentQuizChapter = null;
        let currentQuestionIdx = 0;
        let selectedOptionIdx = null;
        let score = 0;
        let isAnswerSubmitted = false;

        const modalOverlay = document.getElementById('quiz-modal-container');
        const quizContentArea = document.getElementById('quiz-content-area');

        function openQuiz(chapterNum) {{
            currentQuiz = quizzesData[chapterNum];
            currentQuizChapter = chapterNum;
            if (!currentQuiz) return;

            currentQuestionIdx = 0;
            score = 0;
            selectedOptionIdx = null;
            isAnswerSubmitted = false;

            modalOverlay.classList.add('active');
            renderQuestion();
        }}

        function closeQuiz() {{
            modalOverlay.classList.remove('active');
        }}

        function renderQuestion() {{
            selectedOptionIdx = null;
            isAnswerSubmitted = false;

            const q = currentQuiz.questions[currentQuestionIdx];
            const totalQuestions = currentQuiz.questions.length;
            const progressPercent = Math.round(((currentQuestionIdx) / totalQuestions) * 100);

            let optionsHtml = '';
            q.answerOptions.forEach((option, idx) => {{
                optionsHtml += `
                    <li class="option-card" id="option-${{idx}}" onclick="selectOption(${{idx}})">
                        <span class="option-radio" id="radio-${{idx}}"></span>
                        <span class="option-text-span">${{option.text}}</span>
                    </li>
                `;
            }});

            quizContentArea.innerHTML = `
                <div class="quiz-header">
                    <div class="quiz-title">${{currentQuiz.title}}</div>
                    <div class="quiz-progress-container">
                        <span>Question ${{currentQuestionIdx + 1}} of ${{totalQuestions}}</span>
                        <span>Score: ${{score}} / ${{totalQuestions}}</span>
                    </div>
                    <div class="quiz-progress-bar-bg">
                        <div class="quiz-progress-bar-fill" style="width: ${{progressPercent}}%"></div>
                    </div>
                </div>

                <div class="question-text">${{q.question}}</div>

                <div class="hint-box" id="hint-box-el">${{q.hint}}</div>

                <ul class="options-list">
                    ${{optionsHtml}}
                </ul>

                <div class="feedback-container" id="feedback-box">
                    <div class="feedback-title" id="feedback-title"></div>
                    <div class="feedback-text" id="feedback-text"></div>
                </div>

                <div class="quiz-actions">
                    <button class="quiz-btn-secondary" id="hint-btn" onclick="toggleHint()">💡 Show Hint</button>
                    <button class="quiz-btn-primary" id="submit-btn" onclick="submitAnswer()" disabled>
                        Submit Answer ➜
                    </button>
                </div>
            `;

            // LaTeX rendering
            if (typeof renderMathInElement === 'function') {{
                renderMathInElement(quizContentArea, {{
                    delimiters: [
                        {{left: "$$", right: "$$", display: true}},
                        {{left: "$", right: "$", display: false}}
                    ]
                }});
            }}
        }}

        function selectOption(optIdx) {{
            if (isAnswerSubmitted) return;

            selectedOptionIdx = optIdx;

            // Update UI selection classes
            document.querySelectorAll('.option-card').forEach((card, idx) => {{
                if (idx === optIdx) {{
                    card.classList.add('selected');
                }} else {{
                    card.classList.remove('selected');
                }}
            }});

            const submitBtn = document.getElementById('submit-btn');
            submitBtn.removeAttribute('disabled');
        }}

        function toggleHint() {{
            const hintBox = document.getElementById('hint-box-el');
            const hintBtn = document.getElementById('hint-btn');
            
            if (hintBox.style.display === 'block') {{
                hintBox.style.display = 'none';
                hintBtn.innerText = '💡 Show Hint';
            }} else {{
                hintBox.style.display = 'block';
                hintBtn.innerText = '💡 Hide Hint';
            }}
        }}

        function submitAnswer() {{
            if (isAnswerSubmitted || selectedOptionIdx === null) return;

            isAnswerSubmitted = true;

            const q = currentQuiz.questions[currentQuestionIdx];
            const selectedOpt = q.answerOptions[selectedOptionIdx];
            const isCorrect = selectedOpt.isCorrect;

            const feedbackBox = document.getElementById('feedback-box');
            const feedbackTitle = document.getElementById('feedback-title');
            const feedbackText = document.getElementById('feedback-text');
            const submitBtn = document.getElementById('submit-btn');

            // Apply styling
            document.querySelectorAll('.option-card').forEach((card, idx) => {{
                const opt = q.answerOptions[idx];
                if (opt.isCorrect) {{
                    card.classList.add('correct');
                }} else if (idx === selectedOptionIdx) {{
                    card.classList.add('incorrect');
                }}
                card.style.cursor = 'default';
            }});

            if (isCorrect) {{
                score++;
                feedbackTitle.className = 'feedback-title correct';
                feedbackTitle.innerHTML = '🎉 Correct!';
                feedbackText.innerHTML = selectedOpt.rationale;
            }} else {{
                feedbackTitle.className = 'feedback-title incorrect';
                feedbackTitle.innerHTML = '❌ Incorrect';
                feedbackText.innerHTML = selectedOpt.rationale;
            }}

            feedbackBox.style.display = 'block';

            const isLastQuestion = currentQuestionIdx === currentQuiz.questions.length - 1;
            if (isLastQuestion) {{
                submitBtn.innerText = 'View Results 🏆';
            }} else {{
                submitBtn.innerText = 'Next Question ➜';
            }}

            submitBtn.onclick = function() {{
                if (isLastQuestion) {{
                    showResults();
                }} else {{
                    currentQuestionIdx++;
                    renderQuestion();
                }}
            }};
        }}

        function showResults() {{
            const totalQuestions = currentQuiz.questions.length;
            const passed = score >= Math.ceil(totalQuestions * 0.6); // 60% passing score
            
            let message = '';
            if (score === totalQuestions) {{
                message = 'Perfect score! You are a master of Ordinary Differential Equations foundations!';
            }} else if (passed) {{
                message = 'Great job! You have verified your mathematical foundations and are ready for the next level!';
            }} else {{
                message = 'Study the concept explanations, check out the foundational chapters, and try again!';
            }}

            quizContentArea.innerHTML = `
                <div class="results-container" style="display: block;">
                    <div class="results-score-circle">
                        <span class="results-score-num">${{score}}/${{totalQuestions}}</span>
                        <span class="results-score-label">Score</span>
                    </div>

                    <h2 class="results-heading">${{passed ? 'Syllabus Checkpoint Verified! 🎓' : 'Keep Practicing! 📚'}}</h2>
                    <p class="results-sub">${{message}}</p>

                    <div class="quiz-actions" style="justify-content: center;">
                        <button class="quiz-btn-secondary" onclick="openQuiz('${{currentQuizChapter}}')">Retry Quiz 🔄</button>
                        <button class="quiz-btn-primary" onclick="closeQuiz()">Back to Study Guide</button>
                    </div>
                </div>
            `;

            if (passed) {{
                // Save progress
                completedQuizzes[currentQuiz.quiz_id] = {{
                    completed: true,
                    score: score,
                    total: totalQuestions
                }};
                localStorage.setItem('completed_quizzes', JSON.stringify(completedQuizzes));

                // Update Chapter Header UI
                const statusContainer = document.getElementById('quiz-status-container-' + currentQuizChapter);
                if (statusContainer) {{
                    statusContainer.innerHTML = `
                        <div class="quiz-passed-badge" id="passed-badge-${{currentQuiz.quiz_id}}">
                            <span>✓ Passed Checkpoint</span>
                        </div>
                    `;
                }}

                // Reload navigation or badge in sidebar
                location.reload();
            }}
        }}

        // Initialize on load
        window.addEventListener('DOMContentLoaded', buildDashboard);
    </script>
</body>
</html>
"""
    # Replace standard helper functions or format glitches
    html_content = html_content.replace("{syllabus_json_str}", syllabus_json_str)
    html_content = html_content.replace("{quizzes_json_str}", quizzes_json_str)
    
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        print(f"[+] Interactive HTML dashboard successfully written to '{output_path}'")
    except Exception as e:
        print(f"[!] Error writing HTML file: {e}")


# ==========================================
# YOUTUBE PLAYLIST CREATION & OAUTH2 ENGINE
# ==========================================
def get_youtube_service():
    """
    Authenticates the user via OAuth2 and returns a YouTube Data API v3 service client.
    Saves credentials to token.json for reuse.
    """
    try:
        from googleapiclient.discovery import build
        from google_auth_oauthlib.flow import InstalledAppFlow
        from google.auth.transport.requests import Request
        from google.oauth2.credentials import Credentials
    except ImportError:
        print("\n" + "="*80)
        print("[!] Missing required dependencies for YouTube playlist creation!")
        print("Please install them by running:")
        print("    pip install google-api-python-client google-auth-oauthlib google-auth")
        print("="*80 + "\n")
        return None

    SCOPES = ['https://www.googleapis.com/auth/youtube']
    creds = None
    
    # Load existing tokens if they exist
    if os.path.exists('token.json'):
        try:
            creds = Credentials.from_authorized_user_file('token.json', SCOPES)
        except Exception as e:
            print(f"[*] Warning: Could not load existing token.json: {e}")
            
    # If no valid credentials, authenticate user
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("[*] Access token expired. Refreshing token...")
            try:
                creds.refresh(Request())
            except Exception as e:
                print(f"[!] Could not refresh token: {e}. Re-authenticating...")
                creds = None
                
        if not creds:
            if not os.path.exists('client_secrets.json'):
                print("\n" + "="*80)
                print("[!] ERROR: 'client_secrets.json' not found!")
                print("To create a playlist, you must provide your Google Cloud Client Secret JSON.")
                print("\nFollow these steps to get your 'client_secrets.json':")
                print("1. Go to: https://console.cloud.google.com/")
                print("2. Enable the 'YouTube Data API v3' for your project.")
                print("3. Configure the OAuth Consent Screen (add your email as a Test User).")
                print("4. Go to Credentials -> Create Credentials -> OAuth client ID.")
                print("5. Select 'Desktop application' as Application type.")
                print("6. Download the generated client secrets JSON.")
                print("7. Rename it to 'client_secrets.json' and place it in this directory:")
                print(f"   {os.getcwd()}")
                print("="*80 + "\n")
                return None
                
            print("[*] Opening browser for YouTube OAuth2 authentication...")
            try:
                flow = InstalledAppFlow.from_client_secrets_file('client_secrets.json', SCOPES)
                creds = flow.run_local_server(port=0)
            except Exception as e:
                print(f"[!] Authentication flow failed: {e}")
                return None
                
        # Save credentials for next run
        try:
            with open('token.json', 'w') as token_file:
                token_file.write(creds.to_json())
            print("[+] Successfully saved credentials to 'token.json'")
        except Exception as e:
            print(f"[!] Warning: Could not write token.json: {e}")
            
    try:
        return build('youtube', 'v3', credentials=creds)
    except Exception as e:
        print(f"[!] Failed to build YouTube service: {e}")
        return None


def create_and_populate_playlist(syllabus):
    """
    Creates a new public YouTube playlist and populates it with videos in their sorted pedagogical order.
    """
    youtube = get_youtube_service()
    if not youtube:
        print("[!] Playlist creation cancelled due to authentication failure.")
        return
        
    title = "Ordinary Differential Equations (Sorted)"
    description = (
        "A logically ordered, pedagogically optimized learning syllabus for Ordinary Differential Equations. "
        "Generated automatically using an expert syllabus sorter."
    )
    
    # 1. Create the playlist
    print(f"\n[*] Requesting creation of public playlist: '{title}'...")
    try:
        request = youtube.playlists().insert(
            part="snippet,status",
            body={
                "snippet": {
                    "title": title,
                    "description": description,
                    "defaultLanguage": "en"
                },
                "status": {
                    "privacyStatus": "public"
                }
            }
        )
        response = request.execute()
        playlist_id = response.get('id')
        playlist_url = f"https://www.youtube.com/playlist?list={playlist_id}"
        print(f"[+] SUCCESS: Playlist created!")
        print(f"    - Playlist ID: {playlist_id}")
        print(f"    - URL: {playlist_url}")
    except Exception as e:
        print(f"[!] Error creating playlist: {e}")
        return

    # 2. Extract videos in order
    flat_videos = []
    for chapter in syllabus:
        for video in chapter.get('videos', []):
            flat_videos.append(video)
            
    total_videos = len(flat_videos)
    print(f"\n[*] Found {total_videos} videos to add in pedagogical sequence.")
    print("[*] Starting sequential import. Adding anti-rate-limit delays...")
    
    success_count = 0
    for idx, video in enumerate(flat_videos):
        pos = idx + 1
        video_title = video['title']
        video_id = video['id']
        
        # Display elegant progress indicator
        bar_len = 20
        filled = int(round(bar_len * pos / total_videos))
        bar = '=' * filled + '-' * (bar_len - filled)
        sys.stdout.write(f"\r[*] [{bar}] {pos}/{total_videos} - Adding: {video_title[:35]}...")
        sys.stdout.flush()
        
        try:
            youtube.playlistItems().insert(
                part="snippet",
                body={
                    "snippet": {
                        "playlistId": playlist_id,
                        "resourceId": {
                            "kind": "youtube#video",
                            "videoId": video_id
                        },
                        "position": idx
                    }
                }
            ).execute()
            success_count += 1
        except Exception as e:
            # Print on new line to avoid overwriting progress bar
            sys.stdout.write("\n")
            print(f"[!] Error adding video '{video_title}' ({video_id}): {e}")
            # Try to continue despite failure
            
        time.sleep(0.8) # Keep a safe rate-limit spacing
        
    print(f"\n\n========================================================================")
    print(f"[+] PLAYLIST GENERATION COMPLETE!")
    print(f"[-] Successfully added {success_count} out of {total_videos} videos.")
    print(f"[-] Live Sorted Playlist URL: {playlist_url}")
    print(f"========================================================================\n")


# ==========================================
# MAIN EXECUTION ROUTINE
# ==========================================
def main():
    print_banner()
    
    parser = argparse.ArgumentParser(description="Logical study sorter for ODE YouTube Playlist.")
    parser.add_argument('--force-fetch', action='store_true', help="Bypass local cache and redownload playlist live.")
    parser.add_argument('--out-md', type=str, default="sorted_playlist.md", help="Filename for Markdown syllabus.")
    parser.add_argument('--out-html', type=str, default="sorted_playlist.html", help="Filename for interactive HTML dashboard.")
    parser.add_argument('--create-playlist', action='store_true', help="Authenticate via OAuth2 and create a sorted YouTube playlist.")
    args = parser.parse_args()
    
    # 1. Fetch playlist videos
    videos = get_videos(force_fetch=args.force_fetch)
    print(f"[*] Loaded {len(videos)} playlist videos.")
    
    # 2. Sort the playlist
    syllabus = None
    if GEMINI_API_KEY and GEMINI_API_KEY != "YOUR_GEMINI_API_KEY_HERE":
        try:
            syllabus = query_gemini_sorter(videos, GEMINI_API_KEY)
            if syllabus:
                print("[+] Successfully sorted playlist using Gemini API!")
        except Exception as e:
            print(f"[!] Gemini sorting failed: {e}")
            
    if not syllabus:
        print("[*] Using pre-defined expert pedagogical sequence.")
        syllabus = apply_fallback_sorting(videos)
        
    # 3. Export structured resources
    export_to_markdown(syllabus, args.out_md)
    export_to_html(syllabus, args.out_html)
    
    # 4. Optional YouTube playlist creation
    if args.create_playlist:
        create_and_populate_playlist(syllabus)
        
    print("\n========================================================================")
    print("[+] ODE PLAYLIST SORTING COMPLETE!")
    print(f"[-] Structured Markdown Guide: [ {args.out_md} ]")
    print(f"[-] Interactive HTML Study Dashboard: [ {args.out_html} ]")
    print("[-] Open 'sorted_playlist.html' in your browser to start learning!")
    print("========================================================================\n")


if __name__ == "__main__":
    main()
