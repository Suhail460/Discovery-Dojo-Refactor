/* ============================================================================
   GAMIFICATION + PRACTICE DATA
   Badges, challenge drills, exercise-generator pools, interview persona options.
   All plain data so you can extend without touching component code.
   ============================================================================ */

export const BADGES = [
  { id: 'first_step', em: '👣', name: 'First Step', desc: 'Complete your first screen', check: (s) => s.completed.length >= 1 },
  { id: 'foundations', em: '🧠', name: 'Grounded', desc: 'Finish Level 1', check: (s) => s.levelDone(1) },
  { id: 'interviewer', em: '🎤', name: 'Interviewer', desc: 'Run a full simulated interview', check: (s) => s.interviews.length >= 1 },
  { id: 'ace_interview', em: '⭐', name: 'Natural', desc: 'Score 80+ on an interview', check: (s) => s.interviews.some((i) => i.score >= 80) },
  { id: 'tree', em: '🌳', name: 'Tree Grower', desc: 'Finish Level 5 (opportunity trees)', check: (s) => s.levelDone(5) },
  { id: 'bias_buster', em: '🛡️', name: 'Bias Buster', desc: 'Finish Level 6', check: (s) => s.levelDone(6) },
  { id: 'experimenter', em: '🧪', name: 'Experimenter', desc: 'Finish Level 8', check: (s) => s.levelDone(8) },
  { id: 'quiz_streak', em: '🎯', name: 'Sharp Shooter', desc: 'Get 10 quizzes right', check: (s) => s.quizWins >= 10 },
  { id: 'streak3', em: '🔥', name: 'On a Roll', desc: '3-day streak', check: (s) => s.streak >= 3 },
  { id: 'halfway', em: '🧭', name: 'Halfway There', desc: 'Reach Level 8', check: (s) => s.maxUnlocked() >= 8 },
  { id: 'ai_ready', em: '🤖', name: 'AI-Native', desc: 'Finish Level 13', check: (s) => s.levelDone(13) },
  { id: 'generator', em: '⚙️', name: 'Scenario Runner', desc: 'Generate 3 exercises', check: (s) => s.generated >= 3 },
  { id: 'capstone', em: '🏁', name: 'Practitioner', desc: 'Complete the capstone', check: (s) => s.capstoneDone },
  { id: 'master', em: '🏆', name: 'Discovery Master', desc: 'Finish all 15 levels', check: (s) => { for (let i = 1; i <= 15; i++) if (!s.levelDone(i)) return false; return true } }
]

export const CHALLENGES = [
  { id: 'badq', title: 'Spot the bad interview question', icon: 'search-x',
    prompt: 'Which of these is the WORST interview question?',
    options: [
      { t: 'Tell me about the last time you cancelled a subscription.', ok: false, why: 'Strong: past behavior, open, story-mining.' },
      { t: "Wouldn't it be great if this just worked automatically?", ok: true, why: 'Worst: leading AND hypothetical AND pitches a solution. A triple threat.' },
      { t: 'Walk me through how you decided to switch tools.', ok: false, why: 'Great, it excavates a real decision.' },
      { t: 'Why did that frustrate you?', ok: false, why: 'Good depth question.' }
    ] },
  { id: 'bias', title: 'Identify the bias', icon: 'eye-off',
    prompt: 'A PM only interviews users who love the product, then declares the idea validated. Which bias is this?',
    options: [
      { t: 'Confirmation bias (sampling only supporters).', ok: true, why: 'Correct. Cherry-picking a friendly sample to confirm what you hoped.' },
      { t: 'Vanity metric.', ok: false, why: "That's about misleading numbers, not sampling." },
      { t: 'Survivorship on its own.', ok: false, why: 'Related, but the core sin here is seeking confirming evidence.' },
      { t: "No bias, that's fine.", ok: false, why: "It's very much not fine." }
    ] },
  { id: 'method', title: 'Choose the research method', icon: 'microscope',
    prompt: 'You need to know if users can complete a new checkout flow unaided. Best method?',
    options: [
      { t: 'Send a satisfaction survey.', ok: false, why: "Surveys can't observe task completion." },
      { t: 'Moderated usability test on the flow.', ok: true, why: 'Right, watch real users attempt the task and see where they stumble.' },
      { t: 'Check total signups.', ok: false, why: 'Vanity, unrelated to checkout usability.' },
      { t: 'Ask the sales team their opinion.', ok: false, why: 'Secondhand opinion, not user behavior.' }
    ] },
  { id: 'build', title: 'Decide whether to build', icon: 'hammer',
    prompt: "A feature has high requested-reach but zero evidence users will change behavior, and it's a 6-month build. Best call?",
    options: [
      { t: 'Build it, reach is high.', ok: false, why: 'High reach with zero behavior evidence and huge effort is a classic expensive gamble.' },
      { t: 'Run a cheap fake-door or prototype test to validate demand and behavior first.', ok: true, why: 'Exactly. De-risk the leap-of-faith assumption before a 6-month commitment.' },
      { t: 'Ignore it entirely.', ok: false, why: "Maybe there's real value; you just haven't tested it." },
      { t: 'Ask the loudest stakeholder.', ok: false, why: "Volume isn't evidence." }
    ] },
  { id: 'metric', title: 'Interpret the metric', icon: 'line-chart',
    prompt: 'Signups tripled after a campaign, but week-4 retention fell from 30% to 12%. Honest read?',
    options: [
      { t: 'Huge success, signups tripled!', ok: false, why: "That's the vanity trap. You attracted the wrong users." },
      { t: "The campaign drove low-intent users who don't stick; growth is hollow.", ok: true, why: 'Right. Retention collapsing means you optimized a vanity metric at the cost of value.' },
      { t: "Retention doesn't matter if signups are up.", ok: false, why: 'Retention is where value lives; ignoring it is fatal.' },
      { t: 'Nothing to learn here.', ok: false, why: 'There is: acquisition without retention is a leaky bucket.' }
    ] },
  { id: 'opp', title: 'Opportunity or solution?', icon: 'git-fork',
    prompt: 'Which statement belongs at the OPPORTUNITY layer of a solution tree?',
    options: [
      { t: 'Add a Slack integration.', ok: false, why: 'Solution.' },
      { t: 'Ship an AI assistant.', ok: false, why: 'Solution (and a buzzwordy one).' },
      { t: 'I never know if my teammates have seen my update.', ok: true, why: 'An unmet customer need, solvable many ways. That is an opportunity.' },
      { t: 'Build push notifications.', ok: false, why: 'Solution.' }
    ] }
]

export const GEN = {
  company: ['Spotify', 'Amazon', 'Airbnb', 'Uber', 'Swiggy', 'Zomato', 'Duolingo', 'Netflix', 'Google Photos', 'Notion', 'Slack', 'a healthcare startup', 'a fintech scale-up', 'an edtech platform', 'a B2B dev-tools company', 'a government services team', 'an internal tools team'],
  problem: ['retention is dropping among new users', 'a key workflow takes users far too long', 'support tickets about one feature are spiking', "a new segment isn't activating", "power users are asking for something the data doesn't support", 'churn spikes right after onboarding', 'a competitor just shipped something similar', 'engagement is high but revenue is flat'],
  customer: ['first-time users who signed up this week', 'power users of 2+ years', 'users who churned last month', 'enterprise admins', 'price-sensitive small teams', 'non-technical operators', 'teens using it socially', 'professionals using it for work'],
  market: ['a startup with no users yet', 'a startup with ~100 users', 'a company that just hit product/market fit', 'a crowded enterprise SaaS market', 'a two-sided marketplace', 'a regulated healthcare space', 'a consumer app fighting for attention'],
  competition: ['one dominant incumbent', 'a swarm of cheap clones', "no direct competitor (you're educating the market)", 'a free tool users already tolerate', 'doing nothing (the status quo)'],
  budget: ['basically zero, you have your own time', 'a small research budget (~$2k)', 'a comfortable budget but a nervous exec', 'enough for one contractor'],
  time: ['48 hours', 'one week', 'two weeks', 'a single sprint', 'one month'],
  team: ['just you', 'you and a designer', 'a full product trio', 'you and one engineer, no designer'],
  diff: ['Beginner', 'Intermediate', 'Advanced', 'Brutal']
}

export const PERSONA_OPTS = {
  prof: ['Marketing manager', 'Freelance designer', 'Nurse', 'Software engineer', 'Small-business owner', 'College student', 'Financial analyst', 'Delivery driver', 'Product manager', 'Teacher'],
  personality: ['Talkative & warm', 'Terse & busy', 'Skeptical', 'Enthusiastic', 'Analytical', 'Distracted'],
  industry: ['SaaS', 'Healthcare', 'Fintech', 'Edtech', 'E-commerce', 'Marketplace', 'Developer tools', 'Consumer social', 'Government', 'Logistics'],
  exp: ['Brand new to the space', 'Casual user', 'Power user', 'Former user who churned'],
  emoji: { 'Marketing manager': '📦', 'Freelance designer': '🎨', Nurse: '🩺', 'Software engineer': '💻', 'Small-business owner': '🏪', 'College student': '🎓', 'Financial analyst': '📈', 'Delivery driver': '🚚', 'Product manager': '📱', Teacher: '📚' }
}

export const CAP_STAGES = [
  { id: 'idea', label: 'Choose your idea', icon: 'lightbulb', prompt: "What product or feature idea will you run discovery on? Describe it in a sentence or two, plus who it's for.", ph: 'e.g. A tool that auto-summarizes long Slack threads for busy managers who miss context after meetings.' },
  { id: 'research', label: 'Research the customer', icon: 'users', prompt: 'Who is your target customer and what do you already know (vs assume)? List your top 2 assumptions.', ph: 'Target: mid-level managers. Assume: they lose context daily. Assume: they trust an AI summary.' },
  { id: 'interview', label: 'Interview customers', icon: 'mic', prompt: 'Run at least one interview in the simulator with a matching persona, then paste your biggest insight. What surprised you?', ph: 'Insight: they fear missing the ONE message that mattered, not AI accuracy itself.', link: 'interview' },
  { id: 'opportunities', label: 'Find opportunities', icon: 'git-fork', prompt: "Write 2-3 opportunity statements in the customer's voice (needs, not solutions).", ph: "'I'm terrified I missed something important while I was in back-to-backs.'" },
  { id: 'prioritize', label: 'Prioritize', icon: 'scale', prompt: 'Pick your top opportunity and justify it (reach, impact, confidence, effort). Why this one first?', ph: 'Top: fear of missing the critical message. High reach, high impact, medium confidence/effort.' },
  { id: 'experiment', label: 'Design an experiment', icon: 'flask-conical', prompt: 'Design the cheapest experiment to test your riskiest assumption. Include the success threshold AND the kill criterion.', ph: "Fake-door 'Catch me up' button. Success: 25%+ click weekly. Kill: under 10%." },
  { id: 'analyze', label: 'Analyze results', icon: 'bar-chart-3', prompt: 'Imagine (or note real) results. What would confirm vs disconfirm your hypothesis, and your honest read?', ph: 'If 30% click but 0 return, demand exists but value does not land.' },
  { id: 'present', label: 'Present findings', icon: 'presentation', prompt: 'Summarize as a readout: question, what you did, what you found, what it means, recommendation.', ph: 'Question / did / found / means / recommend...' },
  { id: 'roadmap', label: 'Recommend a roadmap', icon: 'map', prompt: 'What are your recommended next 3 steps, in order, and what would make you STOP?', ph: '1) Ship MVP to 5 teams. 2) Measure trust via return-rate. 3) Expand if 40%+ return. Stop if trust never clears 20%.' }
]
