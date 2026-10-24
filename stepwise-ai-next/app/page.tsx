"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, CheckCircle2,
  ChevronDown, Circle, Clock3, Compass, Flame, Lightbulb, Menu, Play,
  RotateCcw, Sparkles, Target, Trophy, X, Sun, Moon
} from "lucide-react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { SqueezeCarousel, type SqueezeSlide } from "@/components/ui/carousel-squeeze";

type Step = { title: string; detail: string; duration: string; task: string; resource: string; resourceUrl?: string; lesson?: string; checkpoint?: string };
type Roadmap = { title: string; subtitle: string; total: string; steps: Step[] };

const roadmaps: Record<string, Roadmap> = {
  "Web development": {
    title: "Build your first website",
    subtitle: "From blank screen to a live, responsive website.",
    total: "2 weeks",
    steps: [
      { title: "Understand how the web works", detail: "Get comfortable with browsers, HTML, CSS and the role of JavaScript.", duration: "25 min", task: "Explain what happens when you open a website.", resource: "The web, in plain English" },
      { title: "Structure a page with HTML", detail: "Build a clean page using headings, links, images and semantic elements.", duration: "35 min", task: "Create a personal profile page with three sections.", resource: "HTML foundations" },
      { title: "Make it look intentional with CSS", detail: "Use spacing, type, color and layout to create a polished page.", duration: "40 min", task: "Style your profile page and make it mobile-friendly.", resource: "CSS layout essentials" },
      { title: "Add your first interaction", detail: "Use JavaScript to respond to a click and update the page.", duration: "35 min", task: "Add a working theme toggle to your page.", resource: "JavaScript DOM basics" },
      { title: "Publish and share it", detail: "Put your project online and learn the basic deployment workflow.", duration: "30 min", task: "Deploy your page and share the live link.", resource: "Your first deployment" }
    ]
  },
  "Python": {
    title: "Get comfortable with Python",
    subtitle: "Write your first useful program, one small concept at a time.",
    total: "10 days",
    steps: [
      { title: "Meet the basics", detail: "Variables, values, input and output without the jargon.", duration: "20 min", task: "Write a program that asks your name and greets you.", resource: "Python fundamentals" },
      { title: "Make decisions", detail: "Use conditions to make your program respond differently.", duration: "25 min", task: "Build a simple grade checker.", resource: "Conditions made clear" },
      { title: "Repeat useful work", detail: "Use loops to process a list or repeat an action.", duration: "30 min", task: "Print a multiplication table for any number.", resource: "Loops and iteration" },
      { title: "Organize information", detail: "Work with lists and dictionaries to store related data.", duration: "35 min", task: "Create a tiny contact book in the terminal.", resource: "Collections in Python" },
      { title: "Build something real", detail: "Combine the concepts into a small command-line project.", duration: "45 min", task: "Build a quiz with a score at the end.", resource: "Your first mini-project" }
    ]
  },
  "Data structures & algorithms": {
    title: "DSA foundations for placements",
    subtitle: "A hands-on C++ path from complexity analysis to core problem-solving patterns.",
    total: "4 weeks",
    steps: [
      { title: "Understand time and space complexity", detail: "Learn how input size affects runtime, and recognize O(1), O(log n), O(n), O(n log n) and O(n²).", duration: "30 min", task: "Write linear search and binary search. For each, explain the best/average/worst-case time and when binary search is valid.", resource: "Big-O Cheat Sheet", resourceUrl: "https://www.bigocheatsheet.com/", lesson: "Count how the number of operations grows as n grows. A nested loop over the same array is usually O(n²); repeatedly halving a search range is O(log n). Space complexity measures extra memory, not just the input itself.", checkpoint: "You can estimate complexity for a single loop, nested loops, and a halving loop." },
      { title: "Arrays and vectors", detail: "Build confidence with traversal, prefix sums, frequency counts and in-place updates.", duration: "35 min", task: "Solve Contains Duplicate and Best Time to Buy and Sell Stock. Then explain your approach before looking at a solution.", resource: "LeetCode — Array problems", resourceUrl: "https://leetcode.com/tag/array/", lesson: "Start with a brute-force solution, then ask whether you can avoid repeated work. In C++, use vector<int>, pass large vectors by reference, and check edge cases such as an empty array or one element.", checkpoint: "You can traverse a vector, track a running best value, and state the time complexity." },
      { title: "Strings and two pointers", detail: "Use indices from both ends or a slow/fast pair to avoid unnecessary nested loops.", duration: "35 min", task: "Solve Valid Palindrome and Move Zeroes. Trace your pointers on a small example before coding.", resource: "LeetCode — Two Pointers", resourceUrl: "https://leetcode.com/tag/two-pointers/", lesson: "Two pointers work when the structure of the problem lets one or both pointers move monotonically. For a palindrome, compare left and right characters. For Move Zeroes, keep a write position for the next non-zero value.", checkpoint: "You can explain why each pointer only moves forward or inward, keeping the solution O(n)." },
      { title: "Hash maps and sets", detail: "Trade extra memory for faster lookup, counting, and duplicate detection.", duration: "35 min", task: "Implement Two Sum with unordered_map<int, int>. Then solve Valid Anagram using character frequencies.", resource: "C++ unordered_map reference", resourceUrl: "https://en.cppreference.com/w/cpp/container/unordered_map.html", lesson: "Before inserting the current number, look for target - number. This avoids pairing an element with itself. Hash operations are average O(1), though worst-case behavior can be worse.", checkpoint: "You know when to use unordered_map versus unordered_set and can explain the memory trade-off." },
      { title: "Sorting and binary search", detail: "Learn sort's role in simplifying problems and binary search on sorted data.", duration: "40 min", task: "Sort a vector of pairs by the first value, then implement binary search iteratively and test found/not-found cases.", resource: "CP-Algorithms — Binary Search", resourceUrl: "https://cp-algorithms.com/num_methods/binary_search.html", lesson: "Binary search requires a sorted range or a monotonic condition. Maintain a clear invariant for low and high, calculate mid as low + (high - low) / 2, and ensure every iteration shrinks the search interval.", checkpoint: "You can write binary search without an off-by-one error and identify its O(log n) time." },
      { title: "Stacks and queues", detail: "Use the right order of processing for matching symbols, next-greater problems and breadth-first work.", duration: "35 min", task: "Solve Valid Parentheses with stack<char>, then use queue<int> to simulate a first-in-first-out line.", resource: "C++ stack reference", resourceUrl: "https://en.cppreference.com/w/cpp/container/stack.html", lesson: "A stack is last-in-first-out; a queue is first-in-first-out. For parentheses, push opening brackets and ensure every closing bracket matches the most recent unmatched opener.", checkpoint: "You can choose between stack and queue and trace the contents after each operation." },
      { title: "Recursion and backtracking basics", detail: "Define a base case, make progress toward it, and understand the call stack.", duration: "40 min", task: "Write recursive factorial and generate all subsets of a small array. Draw the call tree for an input of size 2.", resource: "CP-Algorithms", resourceUrl: "https://cp-algorithms.com/", lesson: "Every recursive function needs a base case and a step that moves toward it. Backtracking explores a choice, recurses, then undoes the choice. Start with tiny inputs so the call tree stays understandable.", checkpoint: "You can identify the base case, recursive case, and approximate recursion depth." },
      { title: "Linked lists and pointer safety", detail: "Understand nodes, next pointers, traversal and the trade-offs versus arrays.", duration: "35 min", task: "Implement a singly linked list node and reverse a list iteratively using prev, current and next pointers.", resource: "LearnCpp — Pointers", resourceUrl: "https://www.learncpp.com/cpp-tutorial/introduction-to-pointers/", lesson: "A linked list stores each value in a node that points to the next node. While reversing, save current->next before changing the link, or the rest of the list becomes unreachable.", checkpoint: "You can draw a three-node list and show how each pointer changes during reversal." },
      { title: "Trees and depth-first search", detail: "Learn binary-tree terminology, recursive traversal, and when BFS is useful.", duration: "40 min", task: "Implement preorder, inorder and postorder traversal for a small binary tree; write down the output for each.", resource: "CP-Algorithms — DFS", resourceUrl: "https://cp-algorithms.com/graph/depth-first-search.html", lesson: "DFS explores a branch before returning. Recursive tree traversals differ mainly in when the current node is processed relative to its children. BFS uses a queue and explores level by level.", checkpoint: "You can distinguish preorder, inorder and postorder and trace a DFS." },
      { title: "Review, timed practice and error log", detail: "Turn topics into a repeatable problem-solving process instead of memorizing solutions.", duration: "45 min", task: "Complete a 3-problem practice set: one array, one hashing, and one binary-search problem. For each, record the approach, complexity, failed attempt, and lesson learned.", resource: "LeetCode — Study Plan", resourceUrl: "https://leetcode.com/studyplan/", lesson: "For each problem: restate it, test a small example, write a brute-force idea, look for a pattern, code, test edge cases, and analyze complexity. If stuck, study a hint and then re-solve without looking.", checkpoint: "You can explain the solution aloud and identify one improvement without relying on memorized code." }
    ]
  },
  "UI/UX design": {
    title: "Design a clearer interface",
    subtitle: "Learn the fundamentals by improving a real screen.",
    total: "2 weeks",
    steps: [
      { title: "Notice the hierarchy", detail: "Understand what makes an interface easy to scan.", duration: "20 min", task: "Mark the three most important things on an app screen.", resource: "Visual hierarchy" },
      { title: "Work with type and space", detail: "Use scale, line length and spacing to create rhythm.", duration: "30 min", task: "Redesign a crowded screen using only type and spacing.", resource: "Type and layout" },
      { title: "Choose a useful color system", detail: "Build a small palette with accessible contrast.", duration: "25 min", task: "Create background, text, border and accent tokens.", resource: "Color systems" },
      { title: "Map the user journey", detail: "Make each action and next step feel obvious.", duration: "30 min", task: "Sketch the steps to complete one common task.", resource: "Flows and states" },
      { title: "Prototype and test", detail: "Turn your idea into a clickable prototype and learn from feedback.", duration: "45 min", task: "Ask someone to complete the task without your help.", resource: "Prototyping basics" }
    ]
  }
};

const featureSlides: SqueezeSlide[] = [
  {
    id: "choose",
    title: "Start with what matters to you.",
    description: "Choose a skill and tell Stepwise where you are today. The plan starts with your actual goal, not a generic syllabus.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "A student working at a laptop in a bright workspace",
    overlay: <span className="carousel-overlay-label">01 / CHOOSE YOUR DIRECTION</span>,
    action: "Build your roadmap",
    href: "#start",
  },
  {
    id: "plan",
    title: "Turn a big goal into small steps.",
    description: "Get a practical sequence of milestones that makes it easier to know what to learn first and what comes next.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Notebook and study materials on a desk",
    overlay: <span className="carousel-overlay-label">02 / MAKE A PLAN</span>,
    action: "See the roadmap",
    href: "#roadmap",
  },
  {
    id: "practice",
    title: "Learn by doing, not just reading.",
    description: "Each milestone includes a focused task so you can turn a concept into something you can explain or build.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "People collaborating around laptops",
    overlay: <span className="carousel-overlay-label">03 / PRACTICE WITH PURPOSE</span>,
    action: "Choose a skill",
    href: "#start",
  },
  {
    id: "progress",
    title: "See progress without the pressure.",
    description: "Mark steps complete, return to your next action, and build consistency at a pace that fits your day.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "A laptop and workspace ready for focused work",
    overlay: <span className="carousel-overlay-label">04 / KEEP MOVING</span>,
    action: "Explore the experience",
    href: "#roadmap",
  },
  {
    id: "reflect",
    title: "Make learning fit real life.",
    description: "A useful plan should work with your schedule, starting point, and changing priorities—not add another source of stress.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "A calm, light-filled workspace",
    overlay: <span className="carousel-overlay-label">05 / YOUR PACE</span>,
    action: "Start small",
    href: "#start",
  },
];

function HeroPreview() {
  return (
    <div className="preview-shell">
      <div className="preview-top"><span className="window-dots"><i/><i/><i/></span><span>YOUR LEARNING SPACE</span><span className="preview-live"><b/> LIVE ROADMAP</span></div>
      <div className="preview-body">
        <div className="preview-side"><div className="preview-mark">s.</div><span className="side-active"><Compass size={15}/></span><BookOpen size={15}/><Target size={15}/><div className="side-bottom"><Circle size={15}/></div></div>
        <div className="preview-main">
          <div className="preview-greeting"><span>YOUR NEXT CHAPTER</span><span>01 / 05</span></div>
          <h3>Learn web development<span>.</span></h3><p>A little progress, every day.</p>
          <div className="preview-progress"><div><span>YOUR ROADMAP</span><b>20% complete</b></div><div className="progress-track"><i style={{width:"20%"}}/></div></div>
          <div className="preview-step active"><span className="step-icon"><Check size={14}/></span><div><b>Understand the basics</b><small>Learn how the web works</small></div><em>DONE</em></div>
          <div className="preview-step current"><span className="step-icon"><Play size={13}/></span><div><b>Structure a page</b><small>Your next 25-minute session</small></div><ArrowRight size={16}/></div>
          <div className="preview-step"><span className="step-icon"><Circle size={14}/></span><div><b>Style it with CSS</b><small>Make it feel like yours</small></div></div>
          <div className="preview-footer"><span><Flame size={14}/> 3-day learning streak</span><span>KEEP GOING <ArrowRight size={13}/></span></div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [goal, setGoal] = useState("Web development");
  const [level, setLevel] = useState("Beginner");
  const [time, setTime] = useState("30 minutes");
  const [context, setContext] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [generated, setGenerated] = useState(false);
  const [activeRoadmap, setActiveRoadmap] = useState<Roadmap>(roadmaps["Web development"]);
  const [completed, setCompleted] = useState<number[]>([0]);
  const [activeStep, setActiveStep] = useState(1);
  const [showTask, setShowTask] = useState(false);
  const [streak, setStreak] = useState(3);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("stepwise-theme");
    const initialTheme = savedTheme === "dark" ? "dark" : "light";
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("stepwise-theme", nextTheme);
  }

  const progress = useMemo(() => Math.round((completed.length / activeRoadmap.steps.length) * 100), [completed, activeRoadmap]);
  const currentStep = activeRoadmap.steps[activeStep];

  async function generateRoadmap() {
    setIsGenerating(true);
    setGenerationError("");
    // Demo mode: choose a curated local roadmap. No network request or AI API is used.
    await new Promise(resolve => window.setTimeout(resolve, 350));
    const template = roadmaps[goal] ?? roadmaps["Web development"];
    const selectedRoadmap: Roadmap = {
      ...template,
      subtitle: `${template.subtitle} Planned for ${level.toLowerCase()} learners studying ${time.toLowerCase()} per day.`,
      total: time === "15 minutes" ? "4–6 weeks" : time === "30 minutes" ? template.total : time === "45 minutes" ? "2–4 weeks" : "1–3 weeks",
      steps: template.steps.map(step => ({
        ...step,
        duration: time === "15 minutes" ? "15 min" : time === "30 minutes" ? step.duration : time === "45 minutes" ? "45 min" : "60 min",
        detail: level === "Comfortable with basics" ? `${step.detail} Focus on edge cases and explaining trade-offs.` : level === "Know a little" ? `${step.detail} Review the core idea first, then attempt the task.` : step.detail,
      })),
    };
    setActiveRoadmap(selectedRoadmap);
    setCompleted([]);
    setActiveStep(0);
    setGenerated(true);
    setShowTask(false);
    setIsGenerating(false);
    document.getElementById("roadmap")?.scrollIntoView({ behavior: "smooth" });
  }
  function toggleComplete(index: number) {
    setCompleted(prev => prev.includes(index) ? prev.filter(n => n !== index) : [...prev, index]);
    if (!completed.includes(index)) setStreak(s => Math.max(s, 4));
  }

  return (
    <main>
      <nav className="nav container">
        <a className="brand" href="#"><span className="brand-icon">s</span> stepwise<span className="brand-ai">AI</span></a>
        <div className={`nav-links ${mobileMenu ? "nav-open" : ""}`}>
          <a href="#how">How it works</a><a href="#roadmap">Your roadmap</a><a href="#principles">Our approach</a>
        </div>
        <button
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
          <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
        </button>
        <a className="nav-cta" href="#start">Find your first step <ArrowUpRight size={15}/></a>
        <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X/> : <Menu/>}</button>
      </nav>

      <section className="hero container" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot"/> A CALMER WAY TO LEARN <span className="eyebrow-line"/></div>
          <h1>Big goals.<br/><span>Smaller steps.</span></h1>
          <p className="hero-description">Learn something new without the overwhelm. Get a roadmap that meets you where you are — and a clear next step whenever you need one.</p>
          <div className="hero-actions"><a className="button-primary" href="#start">Find my starting point <ArrowRight size={16}/></a><a className="text-link" href="#how"><span className="play-circle"><Play size={11} fill="currentColor"/></span> See how it works</a></div>
          <div className="hero-proof"><div className="proof-avatars"><span>D</span><span>A</span><span>M</span></div><p><strong>One step at a time.</strong><br/>Built for real people, not perfect schedules.</p></div>
        </div>
        <div className="hero-art">
          <div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/>
          <div className="floating-note note-top"><Sparkles size={14}/><span>Made for your pace</span></div>
          <div className="floating-note note-bottom"><CheckCircle2 size={15}/><span>Progress you can see</span></div>
          <div className="hero-preview-wrap"><HeroPreview/></div>
          <span className="art-index">A LITTLE FURTHER, EVERY DAY · 001</span>
        </div>
        <div className="hero-bottom"><span>LESS OVERWHELM. MORE MOMENTUM.</span><a href="#how">SCROLL TO EXPLORE <ArrowDown size={13}/></a></div>
      </section>

      <section className="brief-section">
        <div className="container brief-grid">
          <div><div className="section-label">THE BRIEF</div><h2>Learning should feel like a path, <span>not a maze.</span></h2></div>
          <div className="brief-copy"><p>Choose a skill. Tell us where you’re starting. Get a practical roadmap that turns a vague ambition into the next thing you can actually do.</p><p>No endless resource lists. No guessing what comes next. Just a clear path, one manageable step at a time.</p><a href="#start" className="inline-link">Start with a goal <ArrowRight size={15}/></a></div>
        </div>
      </section>

      <section className="how-section section-pad" id="how">
        <div className="container">
          <div className="section-head"><div><div className="section-label">A SIMPLE SYSTEM</div><h2>From “where do I start?”<br/><span>to “I’ve got this.”</span></h2></div><p>Three small moves. A lot less uncertainty.</p></div>
          <div className="how-grid">
            <article className="how-card"><div className="how-top"><span>01 / CHOOSE</span><Target size={18}/></div><div className="how-symbol symbol-target"><span/></div><h3>Start with your goal</h3><p>Tell us what you want to learn and how much time you have. No long setup, no intimidating questionnaire.</p><span className="how-foot">YOUR GOAL, YOUR PACE</span></article>
            <article className="how-card featured"><div className="how-top"><span>02 / MAP</span><Sparkles size={18}/></div><div className="how-symbol symbol-map"><span/><span/><span/></div><h3>Get a clear roadmap</h3><p>Your goal becomes a sequence of small, practical steps with a visible finish line.</p><span className="how-foot">A PATH THAT MAKES SENSE</span></article>
            <article className="how-card"><div className="how-top"><span>03 / DO</span><CheckCircle2 size={18}/></div><div className="how-symbol symbol-check"><Check size={27}/></div><h3>Keep moving forward</h3><p>Focus on one next action. Mark it complete, see your progress, and move on when you’re ready.</p><span className="how-foot">PROGRESS, NOT PRESSURE</span></article>
          </div>
        </div>
      </section>

      <section className="feature-carousel-section section-pad" aria-labelledby="feature-carousel-title">
        <div className="container">
          <div className="section-head feature-carousel-head">
            <div><div className="section-label">A CLOSER LOOK</div><h2 id="feature-carousel-title">A learning system that<br/><span>moves with you.</span></h2></div>
            <p>Explore the small, practical parts of Stepwise that turn a vague goal into steady progress.</p>
          </div>
          <SqueezeCarousel
            slides={featureSlides}
            label="Stepwise learning experience"
            height="clamp(220px, 36vw, 390px)"
            gap={12}
            slatGap={7}
            slatWidth={9}
            radius={12}
            duration={850}
            accent="var(--accent)"
            accentForeground="#ffffff"
            panelClassName="stepwise-carousel-panel"
          />
        </div>
      </section>

      <section className="start-section section-pad" id="start">
        <div className="container">
          <div className="start-heading"><div><div className="section-label">YOUR FIRST STEP</div><h2>Let’s make it <span>manageable.</span></h2></div><p>Start with what you know. We’ll help with what comes next.</p></div>
          <div className="builder">
            <div className="builder-form">
              <div className="builder-overline"><Sparkles size={15}/> PERSONALIZE YOUR PATH <span>01 — 03</span></div>
              <h3>What would you like to learn?</h3><p className="builder-sub">Choose a direction. You can change it any time.</p>
              <div className="field-label">I WANT TO LEARN</div>
              <div className="goal-grid">
                {Object.keys(roadmaps).map(item => <button key={item} className={`goal-option ${goal === item ? "selected" : ""}`} onClick={() => setGoal(item)}><span className="goal-radio">{goal === item && <i/>}</span>{item}<ArrowUpRight size={14}/></button>)}
              </div>
              <div className="form-row">
                <label><span className="field-label">MY STARTING POINT</span><span className="select-wrap"><select value={level} onChange={e => setLevel(e.target.value)}><option>Beginner</option><option>Know a little</option><option>Comfortable with basics</option></select><ChevronDown size={14}/></span></label>
                <label><span className="field-label">TIME PER DAY</span><span className="select-wrap"><select value={time} onChange={e => setTime(e.target.value)}><option>15 minutes</option><option>30 minutes</option><option>45 minutes</option><option>1 hour</option></select><ChevronDown size={14}/></span></label>
              </div>
              <label className="context-field"><span className="field-label">YOUR LEARNING GOAL (OPTIONAL)</span><textarea value={context} onChange={e => setContext(e.target.value)} maxLength={500} placeholder="e.g. I want to prepare for placement coding rounds." rows={3} /></label>
              {generationError && <p className="generation-error" role="alert">{generationError}</p>}
              <button className="button-primary generate-button" onClick={generateRoadmap} disabled={isGenerating}>{isGenerating ? <><span className="loading-dot"/> Building your personal roadmap…</> : <>Build my roadmap <Sparkles size={16}/></>}</button>
              <p className="privacy-note"><Check size={13}/> Demo mode: your selections stay in this browser. Roadmaps are curated templates; no AI service is called.</p>
            </div>
            <div className="builder-aside">
              <div className="aside-stamp"><Compass size={17}/><span>THE STEPWISE METHOD</span></div>
              <blockquote>“You don’t need the whole map to take the first step.”</blockquote>
              <div className="aside-divider"/>
              <div className="aside-stat"><span>01</span><div><b>One clear next action</b><p>Never wonder what to do next.</p></div></div>
              <div className="aside-stat"><span>02</span><div><b>Small, visible wins</b><p>Progress you can actually feel.</p></div></div>
              <div className="aside-stat"><span>03</span><div><b>Built around your time</b><p>Your schedule is part of the plan.</p></div></div>
              <div className="aside-decoration">s<span>.</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="roadmap-section section-pad" id="roadmap">
        <div className="container">
          <div className="roadmap-header"><div><div className="section-label">{generated ? "YOUR PERSONALIZED PATH" : "A TASTE OF THE EXPERIENCE"}</div><h2>{generated ? activeRoadmap.title : "See your progress take shape."}</h2><p>{generated ? activeRoadmap.subtitle : "Here’s what a focused, manageable roadmap looks like."}</p></div><div className="roadmap-meta"><span><Clock3 size={14}/>{generated ? `${time} / day` : "30 min / day"}</span><span><Target size={14}/>{generated ? level : "Beginner-friendly"}</span></div></div>
          <div className="roadmap-layout">
            <div className="roadmap-list">
              <div className="roadmap-list-head"><span>YOUR ROADMAP <span className="tiny-count">{String(activeRoadmap.steps.length).padStart(2,"0")} STEPS</span></span><span>{progress}%</span></div>
              <div className="roadmap-progress"><i style={{width:`${progress}%`}}/></div>
              <div className="roadmap-items">
                {activeRoadmap.steps.map((step, index) => {
                  const done = completed.includes(index);
                  const selected = activeStep === index;
                  return <button key={step.title} onClick={() => {setActiveStep(index);setShowTask(false)}} className={`roadmap-item ${selected ? "selected" : ""} ${done ? "completed" : ""}`}>
                    <span className="roadmap-number">{done ? <Check size={14}/> : String(index+1).padStart(2,"0")}</span><span className="roadmap-item-copy"><b>{step.title}</b><small>{step.detail}</small></span><span className="roadmap-duration">{step.duration}</span><ArrowUpRight className="roadmap-arrow" size={15}/>
                  </button>
                })}
              </div>
              <div className="roadmap-bottom"><span><Trophy size={15}/> {completed.length} of {activeRoadmap.steps.length} steps complete</span><button onClick={() => {setCompleted([]);setActiveStep(0);setShowTask(false)}}><RotateCcw size={13}/> Reset</button></div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={activeStep + activeRoadmap.title} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.2}} className="step-detail">
                <div className="detail-top"><span className="detail-tag"><span/> {completed.includes(activeStep) ? "COMPLETED" : activeStep === 0 ? "START HERE" : "UP NEXT"}</span><span className="detail-step">STEP {String(activeStep+1).padStart(2,"0")}</span></div>
                <div className="detail-icon"><BookOpen size={21}/></div>
                <h3>{currentStep.title}</h3><p>{currentStep.detail}</p>
                <div className="detail-task"><span className="field-label">YOUR SMALL WIN</span><p>{currentStep.task}</p><div><Clock3 size={13}/>{currentStep.duration}<span>·</span><Lightbulb size={13}/>Hands-on practice</div></div>
                {currentStep.lesson && <div className="detail-foot"><span><BookOpen size={13}/> MINI LESSON</span><p>{currentStep.lesson}</p></div>}
                {currentStep.checkpoint && <div className="detail-foot"><span><CheckCircle2 size={13}/> CHECK YOUR UNDERSTANDING</span><p>{currentStep.checkpoint}</p></div>}
                {currentStep.resourceUrl && <a className="inline-link" href={currentStep.resourceUrl} target="_blank" rel="noreferrer">Open resource: {currentStep.resource} <ArrowUpRight size={14}/></a>}
                <button className={`button-primary detail-button ${completed.includes(activeStep) ? "done-button" : ""}`} onClick={() => { if (!completed.includes(activeStep)) toggleComplete(activeStep); if (activeStep < activeRoadmap.steps.length-1) {setActiveStep(activeStep+1);setShowTask(false)} else setShowTask(true); }}>{completed.includes(activeStep) ? (activeStep === activeRoadmap.steps.length-1 ? "Roadmap complete" : "Continue to next step") : "Mark step complete"} <ArrowRight size={15}/></button>
                {showTask && <div className="completion-message"><Trophy size={16}/> You made it through this roadmap. Take a moment to recognize that progress.</div>}
                <div className="detail-foot"><span><Sparkles size={13}/> STEPWISE TIP</span><p>Small sessions count. Stop when you need to, then pick up right here.</p></div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="scroll-demo">
        <ContainerScroll titleComponent={<div className="scroll-title"><div className="section-label">A CLEARER WAY FORWARD</div><h2>Your learning journey,<br/><span>all in one place.</span></h2><p>Less time figuring out what’s next. More time making progress.</p></div>}>
          <div className="scroll-product">
            <div className="scroll-product-head"><div className="brand"><span className="brand-icon">s</span> stepwise<span className="brand-ai">AI</span></div><span className="scroll-tag"><span/> YOUR LEARNING SPACE</span></div>
            <div className="scroll-product-body"><div className="scroll-kicker">YOUR NEXT CHAPTER</div><h3>Every big thing starts <span>somewhere.</span></h3><p>And now, you know where to start.</p>
              <div className="scroll-milestones"><div className="milestone done"><span><Check size={14}/></span><div><b>Choose your direction</b><small>Know what you're working toward</small></div><em>DONE</em></div><div className="milestone active"><span>02</span><div><b>Take your first small step</b><small>One focused session at a time</small></div><ArrowRight size={15}/></div><div className="milestone"><span>03</span><div><b>See how far you've come</b><small>Progress you can be proud of</small></div></div></div>
            </div>
          </div>
        </ContainerScroll>
      </section>

      <section className="principles-section section-pad" id="principles"><div className="container">
        <div className="section-label">EXTRA POINTS — BUILT INTO THE EXPERIENCE</div><div className="principles-head"><h2>Motivation, without<br/><span>the noise.</span></h2><p>Good learning design should make the next step easier, not give you another system to manage.</p></div>
        <div className="principles-grid">
          <article className="principle-card"><div className="principle-chip"><Flame size={13}/> GAMIFICATION</div><div className="principle-icon"><Flame size={22}/></div><h3>Small wins add up.</h3><p>Visible progress, a lightweight streak and meaningful completion feedback help make consistency feel rewarding — not compulsory.</p><div className="streak-demo"><div><Flame size={17}/><b>{streak}-day streak</b><span>You're building a habit</span></div><div className="streak-days">{["M","T","W","T","F","S","S"].map((d,i)=><span key={i} className={i<streak ? "streak-done" : ""}>{i<streak ? <Check size={11}/> : d}</span>)}</div></div></article>
          <article className="principle-card"><div className="principle-chip"><CheckCircle2 size={13}/> SIMPLICITY</div><div className="principle-icon simplicity"><Compass size={22}/></div><h3>Clarity at every step.</h3><p>One obvious next action. Short instructions. No clutter, no competing dashboards, no need to figure out the system before learning the skill.</p><div className="simplicity-demo"><span className="simplicity-check"><Check size={14}/></span><div><b>Know what to do next</b><small>One step. One small win.</small></div><ArrowRight size={15}/></div></article>
        </div>
      </div></section>

      <section className="final-cta"><div className="container final-cta-inner"><div><div className="section-label">YOU CAN START SMALL</div><h2>You don’t need to have it<br/>all figured out<span>.</span></h2><p>You just need a first step that makes sense.</p></div><a className="button-primary" href="#start">Find your first step <ArrowRight size={16}/></a><div className="cta-mark">s<span>.</span></div></div></section>

      <footer className="footer container"><a className="brand" href="#"><span className="brand-icon">s</span> stepwise<span className="brand-ai">AI</span></a><span>LESS OVERWHELM. MORE MOMENTUM.</span><a href="#top">BACK TO TOP ↑</a><small>© 2026 STEPWISE AI · BUILT ONE STEP AT A TIME</small></footer>
    </main>
  );
}
