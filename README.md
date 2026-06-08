<p align="center">
  <img src="https://img.shields.io/badge/🛒_E--Commerce-Recommendation_Engine-8B5CF6?style=for-the-badge&labelColor=1e1b4b" alt="Project Title" />
</p>

<h1 align="center">E-Commerce Product Recommendation Engine</h1>

<p align="center">
  <em>A production-inspired Hybrid Recommendation System built with core Data Structures & Algorithms — no ML libraries, no black boxes.</em>
</p>

<p align="center">
  <a href="#-quick-start"><img src="https://img.shields.io/badge/Quick_Start-▶_Run_Now-10b981?style=flat-square" alt="Quick Start" /></a>
  <a href="#-dsa-concepts--complexity-matrix"><img src="https://img.shields.io/badge/DSA-Course_Project-6366f1?style=flat-square" alt="DSA Project" /></a>
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python-3.8+-3b82f6?style=flat-square&logo=python&logoColor=white" alt="Python 3.8+" /></a>
  <a href="#-web-visual-dashboard"><img src="https://img.shields.io/badge/Dashboard-Vanilla_JS_·_Chart.js-f59e0b?style=flat-square&logo=javascript&logoColor=white" alt="Web Dashboard" /></a>
  <a href="#-license"><img src="https://img.shields.io/badge/License-MIT-22d3ee?style=flat-square" alt="MIT License" /></a>
</p>

---

## 📌 Table of Contents

| Section | Description |
| :--- | :--- |
| [Project Overview](#-project-overview) | What it does & why it matters |
| [Key Features](#-key-features) | Highlight reel of capabilities |
| [System Architecture](#-system-architecture) | End-to-end pipeline diagram |
| [DSA Concepts & Complexity](#-dsa-concepts--complexity-matrix) | Data structures used with Big-O analysis |
| [Algorithm Deep Dive](#-algorithm-deep-dive) | Jaccard, Hybrid Scoring & Heap walkthrough |
| [Tech Stack](#-tech-stack) | Languages, tools, and libraries |
| [Folder Structure](#-folder-structure) | Complete project tree |
| [Quick Start](#-quick-start) | Installation & running guide |
| [User Personas](#-simulated-user-personas) | Pre-built buyer profiles |
| [Web Dashboard](#-web-visual-dashboard) | Interactive glassmorphism UI |
| [Learning Outcomes](#-learning-outcomes) | Skills you'll master |
| [Contributing](#-contributing) | How to contribute |
| [License](#-license) | MIT License |

---

## 🧠 Project Overview

### What is a Recommendation Engine?

A recommendation engine is an intelligent filtering system that predicts and surfaces products a user is most likely to engage with — transforming raw behavioral signals (purchases, searches, cart actions) into personalized suggestions.

### The Problem: Information Overload

With millions of products on modern e-commerce platforms, users experience **decision fatigue**. Industry leaders like Amazon, Netflix, and Spotify address this through recommendation systems that:

| Challenge | How Recommendations Help | Business Impact |
| :--- | :--- | :--- |
| **High Bounce Rates** | Display relevant items immediately on landing | ↑ Session duration by 35%+ |
| **Low Conversion** | Cross-sell complementary products | ↑ Average Order Value (AOV) |
| **Cold Start Users** | Fallback to trending/popular items | ↓ First-visit abandonment |
| **Catalog Discovery** | Expose long-tail inventory via similarity | ↑ Click-Through Rate (CTR) |

> **This project implements all of the above using first-principles DSA** — no TensorFlow, no scikit-learn, no magic. Every recommendation is explainable through Jaccard set math and heap-based priority ranking.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 🔀 **Hybrid Recommendation Engine** | Blends Collaborative Filtering + Content-Based Filtering + Rating Normalization |
| ⚡ **O(1) HashMap Lookups** | Instant product/user retrieval via dictionary-based HashMaps |
| 📇 **Inverted Indexes** | Category and tag indexes eliminate full-catalog scans |
| 🏔️ **Min-Heap Top-N Selection** | Extracts top recommendations in `O(P log N)` instead of `O(P log P)` |
| 🧮 **Jaccard Similarity** | Set-based intersection/union for user & content similarity scoring |
| ❄️ **Cold Start Handling** | Automatic fallback to trending products for new/sparse users |
| 🖥️ **Interactive CLI Console** | 7-option terminal menu with user switching, cart simulation, report export |
| 🌐 **Glassmorphism Web Dashboard** | Dark-themed responsive UI with Chart.js visualizations & heap tree rendering |
| 📊 **Stacked Bar Charts** | Visual breakdown of Collaborative vs. Content vs. Rating score components |
| 🌳 **Live Heap Tree Visualization** | Binary heap node structure rendered in real-time on the dashboard |
| 📝 **Markdown Report Generator** | Auto-exports detailed recommendation reports with complexity analysis |
| 🎯 **Interview Preparation Guide** | 10 comprehensive Q&As with technical and behavioral answer tracks |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                   │
│  ┌──────────────────┐    ┌──────────────────┐                       │
│  │  products.json   │    │   users.json     │                       │
│  │  16 products     │    │   5 personas     │                       │
│  │  5 categories    │    │   purchase/search │                       │
│  └────────┬─────────┘    └────────┬─────────┘                       │
│           │                       │                                  │
│           ▼                       ▼                                  │
│  ┌─────────────────────────────────────────────┐                    │
│  │         HashMap & Index Construction         │                    │
│  │  • products{}  → O(1) lookup by ID           │                    │
│  │  • users{}     → O(1) lookup by ID           │                    │
│  │  • category_index{} → Inverted Index         │                    │
│  │  • tag_index{}      → Inverted Index         │                    │
│  └─────────────────────┬───────────────────────┘                    │
└────────────────────────┼────────────────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────────────────┐
│                  ALGORITHM LAYER                                     │
│                        ▼                                             │
│  ┌─────────────────────────────────────────────┐                    │
│  │          DUAL SCORING PIPELINES              │                    │
│  │                                              │                    │
│  │  ┌──────────────────────┐  ┌──────────────┐  │                    │
│  │  │  COLLABORATIVE       │  │  CONTENT     │  │                    │
│  │  │  FILTERING           │  │  FILTERING   │  │                    │
│  │  │                      │  │              │  │                    │
│  │  │  Jaccard(            │  │  Jaccard(    │  │                    │
│  │  │    userA.purchases,  │  │    user.tags,│  │                    │
│  │  │    userB.purchases)  │  │    prod.tags)│  │                    │
│  │  │                      │  │              │  │                    │
│  │  │  Weight: 50%         │  │  Weight: 30% │  │                    │
│  │  └──────────┬───────────┘  └──────┬───────┘  │                    │
│  │             │                     │           │                    │
│  │             ▼                     ▼           │                    │
│  │  ┌──────────────────────────────────────┐    │                    │
│  │  │     HYBRID SCORE AGGREGATION         │    │                    │
│  │  │                                      │    │                    │
│  │  │  Score = 0.5×Collab + 0.3×Content    │    │                    │
│  │  │        + 0.2×(Rating/5.0)            │    │                    │
│  │  └──────────────────┬───────────────────┘    │                    │
│  └─────────────────────┼────────────────────────┘                    │
│                        ▼                                             │
│  ┌─────────────────────────────────────────────┐                    │
│  │    MIN-HEAP PRIORITY QUEUE (Top-N)          │                    │
│  │                                              │                    │
│  │    Maintains only N best candidates          │                    │
│  │    Time: O(P log N) where N ≪ P              │                    │
│  │    Space: O(N) auxiliary memory               │                    │
│  └─────────────────────┬───────────────────────┘                    │
└────────────────────────┼────────────────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────────────────┐
│                  PRESENTATION LAYER                                  │
│                        ▼                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │  Python CLI  │  │  Web         │  │  Markdown    │               │
│  │  Console     │  │  Dashboard   │  │  Reports     │               │
│  │  (main.py)   │  │  (web/)      │  │  (outputs/)  │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📐 DSA Concepts & Complexity Matrix

### Core Data Structures

| Data Structure | Implementation | Where Used | Lookup | Insert | Why This Structure? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **HashMap** | Python `dict` / JS `Object` | Product & User stores | $O(1)$ | $O(1)$ | Instant retrieval by ID without sequential scans |
| **Set** | Python `set` / JS `Set` | Purchase & search histories | $O(1)$ membership | $O(1)$ | Enables efficient Jaccard via native `∩` and `∪` operations |
| **Inverted Index** | `dict` of `list` | Category → ProductIDs, Tag → ProductIDs | $O(1)$ | $O(1)$ amortized | Eliminates full-catalog scans for filtered queries |
| **Min-Heap** | Python `heapq` / Custom JS class | Top-N recommendation ranking | $O(1)$ peek | $O(\log N)$ | Maintains only best N candidates in bounded memory |
| **List / Array** | Python `list` / JS `Array` | Shopping cart, ordered results | $O(N)$ | $O(1)$ append | Preserves insertion order for cart display |

### Time Complexity Comparison

| Operation | Naive Approach | Our Optimized Approach | Speedup Factor |
| :--- | :--- | :--- | :--- |
| Product lookup by ID | $O(P)$ linear scan | $O(1)$ HashMap | **P×** (e.g., 10,000×) |
| Category filtering | $O(P)$ full scan | $O(1)$ inverted index | **P×** |
| Jaccard similarity (lists) | $O(A \times B)$ nested loops | $O(A + B)$ set operations | **min(A,B)×** |
| Top-N from P candidates | $O(P \log P)$ full sort | $O(P \log N)$ min-heap | **log(P)/log(N)×** |
| User state update | $O(K)$ list membership check | $O(1)$ set add | **K×** |

---

## 🔬 Algorithm Deep Dive

### 1. Jaccard Similarity Index

The **Jaccard Index** measures the overlap between two sets, producing a value in $[0, 1]$:

$$J(A, B) = \frac{|A \cap B|}{|A \cup B|}$$

**Used in two contexts:**

| Context | Set A | Set B | Interpretation |
| :--- | :--- | :--- | :--- |
| **Collaborative Filtering** | Target user's purchases | Other user's purchases | "How similar are these shoppers?" |
| **Content-Based Filtering** | User's preference tags (search + cart) | Product's attribute tags | "Does this product match user interests?" |

**Example Calculation:**
```
Alex's purchases:    {P101, P103}
Sarah's purchases:   {P204, P203}

Intersection (∩):    {} → size = 0
Union (∪):           {P101, P103, P204, P203} → size = 4

J(Alex, Sarah) = 0/4 = 0.0  (No overlap → no collaborative signal)
```

### 2. Hybrid Score Formula

Each candidate product receives a blended score from three weighted pipelines:

$$\text{HybridScore} = 0.5 \times \text{CollabScore} + 0.3 \times \text{ContentScore} + 0.2 \times \frac{\text{ProductRating}}{5.0}$$

| Weight | Pipeline | Signal Source | Captures |
| :--- | :--- | :--- | :--- |
| **50%** | Collaborative | Similar users' purchases | Social proof — "people like you bought this" |
| **30%** | Content-Based | Search tags & cart item tags | Personal intent — "this matches your searches" |
| **20%** | Rating Baseline | Catalog-wide product ratings | Quality floor — "this is a well-reviewed product" |

### 3. Min-Heap Top-N Selection

Instead of sorting all $P$ candidates ($O(P \log P)$), we maintain a **min-heap of size $N$**:

```
For each of P candidates:
    if heap.size < N:
        heap.push(candidate)           ← O(log N)
    else if candidate.score > heap.peek():
        heap.replaceRoot(candidate)    ← O(log N)
    else:
        skip                           ← O(1)

Total: O(P log N) time, O(N) space
```

**Why this matters at scale:**

| Catalog Size (P) | Top-N | Full Sort $O(P \log P)$ | Heap $O(P \log N)$ | Savings |
| :--- | :--- | :--- | :--- | :--- |
| 1,000 | 5 | ~10,000 ops | ~2,300 ops | **4.3×** |
| 100,000 | 10 | ~1,700,000 ops | ~330,000 ops | **5.1×** |
| 10,000,000 | 10 | ~233M ops | ~33M ops | **7.0×** |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend Engine** | Python 3.8+ (stdlib only) | Core algorithms, CLI, data loading, report generation |
| **Frontend Dashboard** | HTML5 / CSS3 / Vanilla JavaScript (ES6) | Interactive UI with glassmorphism design system |
| **Charting** | Chart.js (CDN) | Stacked bar chart for score component breakdown |
| **Data Format** | JSON | Portable, human-readable product & user datasets |
| **Report Output** | Markdown | Clean, GitHub-renderable recommendation reports |

> **Zero external Python dependencies.** The entire engine runs on Python's standard library (`json`, `heapq`, `os`, `sys`, `datetime`). No `pip install` required.

---

## 📂 Folder Structure

```
E-Commerce-Product-Recommendation-Engine/
│
├── 📁 data/                          # Dataset Layer
│   ├── products.json                 # 16 products across 5 categories with tags & ratings
│   └── users.json                    # 5 buyer personas with purchase/search/cart/rating data
│
├── 📁 src/                           # Core Algorithm Layer
│   ├── __init__.py                   # Python package initializer
│   ├── models.py                     # OOP data models: Product (Set-based tags) & User classes
│   ├── recommender.py                # Recommendation engine: Jaccard, Collaborative, Content, Heap
│   └── report_generator.py           # Markdown report exporter with complexity analysis section
│
├── 📁 web/                           # Presentation Layer (Frontend)
│   ├── index.html                    # Glassmorphism dashboard — dark theme, responsive layout
│   ├── styles.css                    # CSS3 custom properties, animations, glassmorphism cards
│   └── app.js                        # JS engine: MinHeap class, Jaccard, Chart.js renderer
│
├── 📁 docs/                          # Documentation
│   └── interview_prep.md             # 10 interview Q&As (Technical + Behavioral tracks)
│
├── 📁 outputs/                       # Generated Reports (git-ignored)
│   └── report_U101.md                # Example: Auto-generated recommendation report
│
├── 📁 images/                        # Screenshots & Media (git-ignored)
│
├── main.py                           # CLI entry point — 7-option interactive console menu
├── requirements.txt                  # Dependency manifest (stdlib-only, optional extras listed)
├── .gitignore                        # Git ignore configuration
└── README.md                         # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** — [Download here](https://www.python.org/downloads/)
- **A modern web browser** (Chrome, Edge, Firefox, Safari) — for the dashboard

### Option 1: Run the Python CLI Console

```bash
# 1. Clone the repository
git clone https://github.com/HarshalNavale45/E-Commerce-Product-Recommendation-Engine.git
cd E-Commerce-Product-Recommendation-Engine

# 2. Run directly — no pip install needed!
python main.py
```

The interactive menu will launch with 7 options: switch users, view profiles, generate recommendations, simulate actions, browse catalog, export reports, and exit.

### Option 2: Run in Automated Mode (Non-Interactive)

```bash
# Set the AUTO_RUN environment variable to skip the interactive menu

# PowerShell (Windows)
$env:AUTO_RUN="1"; python main.py

# Bash (Linux/macOS)
AUTO_RUN=1 python main.py
```

This generates recommendations for the default user and exports a report automatically.

### Option 3: Launch the Web Dashboard

**No Node.js, npm, or build tools required!**

- **Simple:** Double-click `web/index.html` to open directly in your browser.
- **With local server** (recommended for best experience):
  ```bash
  python -m http.server 8000
  # Navigate to http://localhost:8000/web/
  ```

---

## 👥 Simulated User Personas

The dataset ships with 5 pre-configured buyer personas designed to demonstrate different recommendation scenarios:

| User ID | Persona | Purchases | Search Interests | Cart | Scenario Demonstrated |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `U101` | **Alex** (Tech Enthusiast) | Headphones, Gaming Keyboard | audio, wireless, gaming, gadgets | Fitness Watch | Cross-category discovery via collaborative signals |
| `U102` | **Sarah** (Fitness & Health) | Yoga Mat, Water Bottle | fitness, yoga, running, hydration | Running Shoes | Strong content-match within fitness category |
| `U103` | **David** (Avid Reader) | Sapiens, Atomic Habits | books, self-help, productivity, history | Python DSA Book | Niche interest with clear tag-based content match |
| `U104` | **Emma** (WFH Coffee Lover) | Coffee Beans, Office Chair | coffee, office, morning, kitchen | Coffee Maker | Complementary product cross-selling |
| `U105` | **General Shopper** (Cold Start) | Denim Jacket only | clothing, shoes, outdoor | Empty | Cold start fallback to trending products |

---
## 🎯 Learning Outcomes

By studying and building this project, you will master:

| # | Skill | What You'll Learn |
| :--- | :--- | :--- |
| 1 | **Mathematical Modeling** | Translating the Jaccard Index formula into efficient Python/JS code |
| 2 | **Heap vs. Sort Analysis** | When $O(N \log K)$ heap selection beats $O(N \log N)$ full sorting |
| 3 | **Index Design** | Building inverted indexes to optimize category and tag-based queries |
| 4 | **Full-Stack DSA Thinking** | Implementing identical algorithms in Python (backend) and JavaScript (frontend) |
| 5 | **System Design Principles** | Separating data, algorithm, and presentation layers cleanly |
| 6 | **Professional Packaging** | Clean README, interview prep, commit strategy, and portfolio presentation |

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feat/your-feature`
3. **Commit** with conventional messages: `git commit -m "feat: add cosine similarity option"`
4. **Push** to your fork: `git push origin feat/your-feature`
5. **Open** a Pull Request with a clear description

### Ideas for Contributions

- [ ] Add **Cosine Similarity** as an alternative to Jaccard
- [ ] Implement **TF-IDF** weighted tag scoring
- [ ] Add **product images** to the web dashboard
- [ ] Build a **Flask/FastAPI** REST endpoint wrapper
- [ ] Add **unit tests** with `pytest`
- [ ] Implement **A/B testing** simulation for recommendation strategies
- [ ] Add **user session persistence** with localStorage in the dashboard

---

## Author 👩‍💻

**Shrestha Mukherjee**

## 📄 License

This project is licensed under the **MIT License** — you are free to use, modify, and distribute this code for personal, educational, and commercial purposes.

---

<p align="center">
  <strong>Built with ❤️ for learning Data Structures & Algorithms through real-world application.</strong>
</p>

<p align="center">
  <em>If you found this project helpful, consider giving it a ⭐ on GitHub!</em>
</p>