# ODE Student Roadmap - Project History & Changelog

This document serves as the definitive record of all features, automation pipelines, and infrastructure built for the [Ordinary Differential Equations Study Roadmap](https://adamaimshigh.github.io/ode-student-roadmap/).

## 1. Infrastructure & Deployment
* **GitHub Integration**: Initialized a local Git repository, created the remote `ode-student-roadmap` via REST API, and deployed the codebase to the `master` branch.
* **GitHub Pages**: Enabled GitHub Pages on the `master` branch to host the live study dashboard.
* **Clean Root URL**: Configured the compiler to proactively duplicate the main roadmap file to `index.html`, ensuring clean access at `https://adamaimshigh.github.io/ode-student-roadmap/`.
* **Security**: Configured `.gitignore` to secure API keys and local python environments.

## 2. Dynamic Content Compilation
* **Python Orchestrator**: Expanded `ode_sorter.py` to compile the syllabus structure, video databases, custom quizzes, and interactive canvas generators directly into static HTML templates.
* **Playlist Synchronization**: Built a cache architecture (`playlist_cache.json`) to pull and track videos from the source YouTube playlist. Recently synced to pull 9 new videos, bringing the total course catalog to 66 tracked videos.

## 3. Automated Micro-Practice Quiz Pipeline
* **Generator Script**: Built `generate_micro_quizzes.py` to automate the extraction of YouTube transcripts and prompt the Gemini API to formulate rigorous 5-question LaTeX multiple-choice quizzes.
* **Resilience Mechanisms**: Overhauled the batch generation pipeline to include resilient transcript-less fallbacks and a 17-model automatic rotation mechanism to bypass strict API rate limits and quotas.
* **Quiz Database**: Successfully generated and persisted a suite of 66 interactive inline micro-practice quizzes mapped to the specific concepts of each lesson into `quizzes_cache.json`.

## 4. UI/UX Architecture & Layouts
* **Micro-Practice Cards**: Restructured the UI to separate Chapter Mastery Checkpoints from Micro-Practice Quizzes. The Micro-Practices are now injected as sleek inline glassmorphic cards directly beneath their corresponding video cards.
* **Generic Quiz Controller**: Overhauled the frontend JavaScript Quiz Controller to support generic multi-quiz chapter mapping across the entire page, preserving pass/fail states in `localStorage`.

## 5. Interactive Mathematical Visualizers
* **Slope Field Generator**: Built and integrated a custom interactive visual Slope Field Generator directly into Chapter 1, allowing students to input an arbitrary $dy/dx$ and visualize the vector field natively in the browser.
* **Euler's Method Visualizer**: Constructed a comprehensive Euler's Method visualizer at the end of Chapter 1 with the following specifications:
  * **Rendering**: Integrated `Chart.js` via CDN for performant graphing.
  * **Controls**: Added glassmorphic inputs for the differential equation, initial conditions ($x_0$, $y_0$), target $x$, and a dynamic step-size ($h$) slider.
  * **Numerical Logic**: Implemented robust Euler iteration loops in JavaScript capable of stepping forwards and backwards to a specific target.
  * **Analytical Logic**: Wrote an analytical solution solver for standard ODE forms ($y' = y$, $y' = x$, $y' = \sin(x)$, etc.) to overlay the exact mathematical curve.
  * **Live Metrics**: Built real-time absolute error calculation and tracking components that update dynamically as the user modifies the step size.
