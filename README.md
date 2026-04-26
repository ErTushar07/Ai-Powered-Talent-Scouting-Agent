# 🚀 Nexus Scout AI: AI-Powered Talent Scouting & Engagement Agent

## 1. Project Overview
Recruiters spend countless hours manually parsing through candidate profiles and conducting initial screenings to gauge genuine interest. **Nexus Scout AI** is a fully automated, AI-powered agent designed to drastically reduce time-to-hire. It intakes a Job Description (JD), discovers relevant candidates, simulates conversational outreach to assess their interest, and generates a data-driven short-list strictly ranked on a calculated combination of qualification match and engagement enthusiasm.

## 2. Features
* **Intelligent JD Parsing:** Automatically assesses required skills, experience bounds, and domain signaling from unstructured text.
* **Explainable Matching (0-100%):** Calculates a deterministic qualification score based on weighted criteria (skills, domain, experience).
* **Conversational Engagement Simulator:** Acts explicitly as candidates to simulate an outreach session, evaluating real-world availability and interest dynamically.
* **Interest Assessment (0-100%):** Scores the candidate's enthusiasm contextually based on their replies.
* **Dual-Ranked Shortlist:** Combines hard qualifications with soft engagement signaling to eliminate ghosting and source only highly relevant, interested talent.

## 3. Tech Stack
* **Backend:** Python + FastAPI 
* **Frontend:** Vanilla JavaScript + HTML5/CSS3 (Glassmorphism UI)
* **AI Engine:** Google Gemini (GenerativeAI API) for semantic matching and dialogue simulation.
* **Data Layer:** Mock local state (easily extensible to PostgreSQL/MongoDB).

## 4. Setup Instructions

Follow these commands to configure the environment locally:

```bash
# 1. Clone the repository / open the directory
cd "Ai Powered Talent Scouting & Agent"

# 2. Create the Python virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install requirements
pip install -r requirements.txt

# 4. Start the Application Server
uvicorn main:app --host 0.0.0.0 --port 8000
```
Navigate to `http://localhost:8000` in your browser. (To use the live AI model, simply input a Gemini API Key via the secure UI input).

## 5. Repository Structure
```
.
├── main.py               # FastAPI entry point & API routes
├── agent.py              # LLM logic & Agent prompts
├── candidates.py         # Mock candidate database pool
├── requirements.txt      # Project dependencies
└── public/               # Frontend Assets 
    ├── index.html        # Glassmorphic UI Structure
    ├── style.css         # Animations & aesthetic styling
    └── app.js            # Client-side API hooks & logic
```

## 6. Example Usage & Screenshots

**1. Input Phase:** Paste a JD into the system's input box (e.g., "Looking for a Data Scientist familiar with transformers and NLP...").
**2. Discovery Trigger:** Click "Discover Candidates". The system will return a card layout for all candidates.
**3. The Engagement:** Select "Engage" on a profile to open the internal chat simulation and gauge their real-time interest!

> *[Screenshot Placeholder: The sleek dark-mode input screen taking a JD text block]*
> *[Screenshot Placeholder: A 3-column grid showing ranked Candidate cards with gradient matching scores]*
> *[Screenshot Placeholder: A focused chat modal displaying simulated back-and-forth LLM messages resolving to an "Interest: 94%" badge]*

## 7. Future Improvements
* Database Integration for storing historical chat states and JD configurations (e.g. Postgres + SQLAlchemy).
* Real-world ATS API integrations (Greenhouse, Workday) to poll actual candidate lists dynamically.
* Multi-agent debate mechanism: Introduce a secondary "Reviewer Agent" to strictly debate the scoring assigned by the Match Agent. 

---

<br><br>

# 🏗 Architecture & Scoring Explanation

## A. Architecture Description
1. **Input Layer (JD Input):** A clean REST endpoint intakes unstructured text arrays specifying constraints like role, years, or location.
2. **Processing Layer (Nexus Engine Engine):**
   * **JD Parsing & Matching:** Cross-references JSON talent pool profiles against the JD requirements using the semantic model. Provide a short explainer output mapping the logic.
   * **Conversation Simulator:** Isolates the candidate's core identity context and triggers a contextual conversation model.
3. **Output Layer (Ranked Shortlist):** A structured, actionable list containing multi-layered reasoning natively understandable by recruiters.

## B. Scoring Logic
We employ a composite score approach preventing "perfect-match" candidates with zero engagement from topping lists.

**Match Score Component (0-100%):**
* Skills Match: `40%` weight
* Experience Bounds: `30%` weight
* Domain Relevance: `20%` weight
* Location (Remote/On-site): `10%` weight

**Interest Score Component (0-100%):**
Calculated contextually by the LLM simulation based on:
1. Lexical enthusiasm in standard dialogue.
2. Direct availability (e.g., matching job shift).
3. Value alignment (salary flags, mission statement).

**Final Ranking Mechanism:**
```text
Final Score = (0.6 * Match Score) + (0.4 * Interest Score)
```

---

<br><br>

# 📊 Sample Inputs & Outputs

### Input: Sample Job Description
> "Company: Nexus Data Labs. Role: Senior Machine Learning Engineer. We are seeking an experienced ML engineer (4+ years) based remotely to help build internal agentic workflows. Must be strong in Python, PyTorch/TensorFlow, and have concrete experience parsing NLP workflows or building bots."

### Processing: Candidate Analysis Output 

| Candidate | Profiles | Match Score | Simulated Conv Excerpt | Interest Score | Final Score |
|---|---|---|---|---|---|
| **Marcus Chen** | 4 yrs exp, PyTorch, TF, Built bots | **93%** *(Exceeds NLP and deep learning specs)* | *"I've actually built customer service bots before so this is right up my alley! Very interested."* | **90%** | **91.8%** |
| **Elena Rodriguez** | 7 yrs exp, React, Node, Webapps | **45%** *(Overskilled in web, un-aligned on NLP/AI)* | *"I'm mostly focused on standard SaaS architectures right now, not pure ML."* | **20%** | **35.0%** |
| **David Alaba** | 9 yrs exp, Vue, JavaScript | **15%** *(Frontend focus only)* | *"I appreciate you reaching out, but I'm looking for Frontend Architecture roles."* | **10%** | **13.0%** |

### Output: Actionable Insights
* **Immediate Contact:** Marcus Chen (Perfect match intersection, actively seeking).
* **Reject Pipeline:** Elena Rodriguez, David Alaba (Mismatched core skill vectors).

---

<br><br>

# 🎬 Demo Video Script (3-5 Minutes)

**[0:00 - 0:45] Intro & Problem Statement**
* **Visual:** Speaker on camera, cutting to the "Nexus Scout AI" dashboard. 
* **Audio:** "Recruiters lose weeks analyzing hundreds of resumes and chasing down talent that simply isn't interested in the position. Today, I'm showing you Nexus Scout AI. It’s an agentic workflow that matches candidates based on their real qualifications, but uniquely, simulates a conversation with them to calculate a realistic *Interest Score*. Let's jump in."

**[0:45 - 1:30] The JD Input**
* **Visual:** Zoom in on the Job Description text box. Paste the Sample JD. Click "Discover Candidates." 
* **Audio:** "Here, I have a standard Job Description for a Senior Machine Learning engineer. I'll paste it straight in and click Discover. In the background, our agent parses the requirements, filters the candidate database, and assigns a precise Match Score—weighting skills at 40% and experience at 30%."

**[1:30 - 2:30] Reviewing Candidate Ranking & Explaining Scores**
* **Visual:** Scroll through the UI grid of candidate cards. Highlight "Marcus Chen" (Match 93%). 
* **Audio:** "As you can see, the AI returns clear, explainable match justifications. Marcus Chen is flagged beautifully because of his PyTorch history, whereas Elena is scored lower because her experience is isolated to Frontend standard apps. The magic, however, happens next."

**[2:30 - 3:45] The Conversation Simulation**
* **Visual:** Click "Engage" on Marcus Chen. Enter a friendly recruiter pitch into the chat. 
* **Audio:** "We click Engage. Currently, the AI is spawning an environment where it authentically represents Marcus based on his profile state. I'll shoot him a quick message: *'Hi Marcus, checking your interest in an NLP-heavy role?.'* Watch the response. The system gives an authentic response simulating his likelihood to answer, and automatically calculates his Interest Score on the fly. It looks like he loves it—giving us an Interest score of over 90 percent!"

**[3:45 - 4:15] Final Shortlist & Wrap up**
* **Visual:** Head back to the main UI. Show the final ranking blending Match & Interest. 
* **Audio:** "Because our formula assigns a 60% weight to Qualifications and a 40% weight to Genuine Interest, we are left with a final, completely actionable shortlist. No more blindly pinging cold leads. Nexus Scout AI delivers interested, highly qualified matches right to the recruiter's desk."

---

## 👨‍💻 Author

**Tusharul Amin**  
GitHub Repository: [ErTushar07/Ai-Powered-Talent-Scouting-Agent](https://github.com/ErTushar07/Ai-Powered-Talent-Scouting-Agent)
