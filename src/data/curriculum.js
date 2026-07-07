/* ============================================================================
   CURRICULUM — the entire course as data.
   15 levels. Each screen renders generically from these fields, so to add or
   edit content you only touch this file. No component changes needed.

   Screen fields (all optional except title):
     title, lead, time, diff (1-3), objectives[], prose (HTML string),
     analogy {title, body}, mermaid {code, cap}, example {items[]},
     mistakes[], reflection, hint, launch {view, label, icon},
     quiz { type: 'mcq'|'truefalse'|'order'|'match', ... }
   ============================================================================ */

export const CURRICULUM = [
  {
    id: 1, title: 'Foundations', subtitle: 'What discovery is, and why it exists', emoji: '🧠', diff: 1,
    objectives: ['Define product discovery', 'Separate discovery from delivery', 'Recognize when discovery is needed'],
    screens: [
      {
        title: 'What is Product Discovery?',
        lead: 'Discovery is the work of deciding what to build. Delivery is the work of building it well. Confusing the two is the single most expensive mistake in product.',
        time: 6, diff: 1,
        objectives: ['Define discovery in one sentence', 'Contrast discovery vs delivery'],
        prose: `<p><strong>Product discovery</strong> is the continuous practice of reducing uncertainty about what is worth building, before and while you build it. You are answering four risks: will people <em>want</em> it (value), can they <em>use</em> it (usability), can we <em>build</em> it (feasibility), and does it <em>work for the business</em> (viability).</p>
        <p>Teams that skip discovery don't skip the learning. They just pay for it later, in shipped features nobody uses. Roughly <strong>70% of features in the average product see little or no use.</strong> Discovery is how you move that number.</p>
        <ul><li><strong>Delivery</strong> answers <em>are we building it right?</em></li><li><strong>Discovery</strong> answers <em>are we building the right thing?</em></li></ul>`,
        analogy: { title: 'The doctor analogy', body: 'A doctor who prescribes before diagnosing commits malpractice. Shipping a feature before discovery is the same act: prescription without diagnosis. Discovery is the diagnosis.' },
        mermaid: { code: `flowchart LR
  A[Idea / request] --> B{Discovery}
  B -->|Value risk| C[Do they want it?]
  B -->|Usability risk| D[Can they use it?]
  B -->|Feasibility risk| E[Can we build it?]
  B -->|Viability risk| F[Does the business work?]
  C & D & E & F --> G[Delivery: build it well]`, cap: 'The four risks discovery exists to reduce (Cagan framing).' },
        example: { items: ['<b>Superhuman</b> spent months defining a precise product/market-fit metric before scaling, instead of shipping on gut.', '<b>Amazon</b> writes the press release <i>before</i> building (Working Backwards): discovery forces clarity on value first.'] },
        mistakes: ['Treating discovery as a one-time phase before a project instead of a continuous habit.', "Assuming discovery means 'ask customers what they want' (they'll tell you faster horses).", 'Doing discovery only on big bets and never on the small features that quietly rot.'],
        quiz: { type: 'mcq', prompt: "A stakeholder says: 'We already know users want dark mode, just build it.' Most discovery-minded response?", scenario: "You're a PM. Engineering capacity is tight this quarter.",
          options: [
            { t: 'Build it immediately, the stakeholder is confident.', ok: false, why: 'Confidence is not evidence. This is how the 70% graveyard fills.' },
            { t: 'Ask what problem dark mode solves and for whom, then check if evidence supports the size of that problem.', ok: true, why: "Right. You separate the solution from the value risk before spending capacity." },
            { t: 'Refuse until you run a full 6-week research study.', ok: false, why: 'Over-correcting. Discovery is right-sized to risk, not a bureaucratic gate.' },
            { t: 'Add it to the backlog and forget about it.', ok: false, why: "Avoidance isn't discovery. The uncertainty is still unresolved." }
          ] },
        reflection: 'Think of the last feature your team shipped. Which of the four risks did you actually test before building?',
        hint: "Discovery isn't about saying no to ideas. It's about attaching evidence to them before they cost engineering weeks."
      },
      {
        title: 'Discovery vs Delivery: the double track',
        lead: "Modern teams don't do discovery then delivery. They run both at once, continuously, feeding each other.",
        time: 5, diff: 1,
        objectives: ['Explain dual-track development', 'Avoid the waterfall trap'],
        prose: `<p>The outdated model is a relay race: research, then design, then build, then ship. The modern model is <strong>dual-track</strong>: a discovery track and a delivery track running in parallel every week. Discovery feeds validated ideas into delivery; delivery surfaces new questions back into discovery.</p>
        <p>Dual-track is not two teams. It's <em>one</em> product trio (PM, designer, engineer) doing two kinds of work continuously.</p>`,
        mermaid: { code: `flowchart TB
  subgraph Discovery Track
    d1[Interview] --> d2[Map opportunities] --> d3[Test assumptions]
  end
  subgraph Delivery Track
    b1[Build] --> b2[Ship] --> b3[Measure]
  end
  d3 -->|validated ideas| b1
  b3 -->|new questions| d1`, cap: 'Two tracks, one team, continuous flow.' },
        example: { items: ['<b>Spotify</b> squads run discovery spikes alongside sprint delivery so learning never blocks shipping.', '<b>Netflix</b> ships and A/B tests continuously; delivery <i>is</i> a discovery instrument for them.'] },
        mistakes: ["Believing discovery must 'finish' before delivery can start.", 'Handing discovery to a separate research team that throws findings over the wall.'],
        quiz: { type: 'truefalse', prompt: 'In dual-track development, the discovery track must complete before the delivery track begins.', answer: false, whyTrue: "That's the old waterfall model.", whyFalse: 'Correct. Both tracks run continuously and in parallel, feeding each other every week.' },
        reflection: 'Does your team run discovery as a phase or a habit? What would make it continuous?'
      },
      {
        title: 'When is discovery needed?',
        lead: 'Not every decision needs a research study. The skill is matching the depth of discovery to the size of the risk.',
        time: 5, diff: 1,
        objectives: ['Right-size discovery to risk', 'Spot low-risk vs high-risk decisions'],
        prose: `<p>Discovery has a cost. Spend it where uncertainty is high <strong>and</strong> the cost of being wrong is high. A reversible one-line copy change needs almost none. A new pricing model or a six-month platform bet needs a lot.</p>
        <p>Use two axes: <strong>uncertainty</strong> (how confident are we, really?) and <strong>consequence</strong> (how expensive is being wrong?). High on both means discover hard. Low on both means just ship and watch.</p>`,
        mermaid: { code: `quadrantChart
  title Discovery investment
  x-axis Low uncertainty --> High uncertainty
  y-axis Low consequence --> High consequence
  quadrant-1 Discover deeply
  quadrant-2 Watch after shipping
  quadrant-3 Just ship
  quadrant-4 Quick validation
  New pricing model: [0.8, 0.85]
  Button color: [0.3, 0.1]
  Onboarding redesign: [0.7, 0.6]
  Typo fix: [0.1, 0.05]`, cap: 'Match discovery depth to uncertainty and consequence.' },
        mistakes: ['Running heavy discovery on trivial reversible changes (analysis paralysis).', "Shipping irreversible, expensive bets on gut because 'we move fast'."],
        quiz: { type: 'mcq', prompt: 'Which decision most demands deep discovery?',
          options: [
            { t: 'Changing a CTA button from blue to green.', ok: false, why: 'Low uncertainty, low consequence, reversible. Just A/B it.' },
            { t: 'Switching your entire pricing from per-seat to usage-based.', ok: true, why: 'High uncertainty, high consequence, hard to reverse. Discover deeply.' },
            { t: 'Fixing a typo in a tooltip.', ok: false, why: 'Just ship it.' },
            { t: 'Reordering two menu items.', ok: false, why: 'Cheap and reversible, watch the metric after.' }
          ] },
        reflection: "Name one decision your team treats as low-risk that's actually high-consequence and hard to reverse."
      }
    ]
  },
  {
    id: 2, title: 'Understanding Customers', subtitle: 'Personas, empathy, and jobs', emoji: '👥', diff: 1,
    objectives: ['Build evidence-based personas', 'Use empathy maps', 'Introduce Jobs To Be Done'],
    screens: [
      {
        title: 'Real personas vs fake personas',
        lead: "Most personas are fiction: a stock photo, an age, and 'loves coffee.' Real personas are compressed evidence about behavior.",
        time: 6, diff: 1,
        objectives: ['Distinguish evidence-based from invented personas', 'Anchor personas in behavior not demographics'],
        prose: `<p>A <strong>fake persona</strong> describes who someone is: 'Marketing Mary, 34, enjoys yoga.' A <strong>real persona</strong> describes what someone <em>does and struggles with</em>: 'ships 12 campaigns a month, lives in spreadsheets, loses an hour every launch reconciling data across tools.'</p>
        <p>Demographics rarely predict behavior. Anchor personas in <strong>behaviors, goals, and pains</strong> you actually observed, and cite where each detail came from.</p>`,
        analogy: { title: 'Casting vs character', body: "A fake persona is a headshot. A real persona is a character with motivations, obstacles, and a scene they're stuck in. You can't write for a headshot." },
        example: { items: ["<b>Intercom</b> ditched demographic personas for job-based ones: 'when I ___, I want to ___, so I can ___.'", '<b>Fake tell:</b> if a detail (favorite coffee) never changes a product decision, it is decoration, not a persona.'] },
        mistakes: ['Inventing personas in a conference room without talking to a single user.', "Over-indexing on demographics that don't drive behavior.", 'Creating 8 personas so specific they describe individuals, not patterns.'],
        quiz: { type: 'mcq', prompt: 'Which persona detail is actually useful for product decisions?',
          options: [
            { t: 'Enjoys hiking and craft beer.', ok: false, why: "Decoration. Doesn't change what you build." },
            { t: 'Abandons signup when asked for a credit card before seeing value.', ok: true, why: 'A real observed behavior that directly shapes your onboarding.' },
            { t: 'Is 29 years old and lives in Austin.', ok: false, why: 'Demographics rarely predict behavior on their own.' },
            { t: 'Has a golden retriever named Max.', ok: false, why: 'Pure fiction with zero product implication.' }
          ] },
        reflection: 'Pull up a persona your team uses. How many details are backed by something a real user said or did?'
      },
      {
        title: 'Empathy maps: getting inside the head',
        lead: 'An empathy map organizes what a customer says, thinks, does, and feels, so you design for the human, not the average.',
        time: 5, diff: 1,
        objectives: ['Structure observations with an empathy map', 'Separate what people say from what they do'],
        prose: `<p>The classic empathy map has quadrants: <strong>Says, Thinks, Does, Feels</strong>. The gold is in the gaps: when what someone <em>says</em> contradicts what they <em>do</em>, you've found tension worth designing around.</p>`,
        mermaid: { code: `flowchart TB
  U((User)) --- S[SAYS<br/>quotes, claims]
  U --- T[THINKS<br/>beliefs, doubts]
  U --- D[DOES<br/>observed actions]
  U --- F[FEELS<br/>emotions, fears]
  S -.tension.- D
  T -.tension.- F`, cap: 'Say/Do gaps are where insight hides.' },
        mistakes: ['Filling the map with assumptions instead of quotes.', 'Ignoring the say/do gap, the most valuable signal.'],
        quiz: { type: 'match', prompt: 'Match each observation to its empathy-map quadrant.',
          pairs: [
            { l: "'I'd definitely pay for this'", r: 'Says' },
            { l: 'Never upgraded despite 6 prompts', r: 'Does' },
            { l: 'Worries the tool will be abandoned', r: 'Feels' },
            { l: 'Believes competitors are cheaper', r: 'Thinks' }
          ] },
        reflection: 'Recall a time a customer said one thing but did another. What did their behavior reveal?'
      }
    ]
  },
  {
    id: 3, title: 'Research Methods', subtitle: 'Qualitative, quantitative, and choosing well', emoji: '🔬', diff: 2,
    objectives: ['Choose the right research method', 'Combine qual and quant', 'Avoid method mismatches'],
    screens: [
      {
        title: 'Qualitative vs quantitative: why vs how many',
        lead: 'Qual tells you why and what to build. Quant tells you how many and whether it works. You need both, in the right order.',
        time: 6, diff: 2,
        objectives: ['Match method to question', 'Sequence qual before quant when exploring'],
        prose: `<p><strong>Qualitative</strong> methods (interviews, usability tests) answer <em>why</em> and generate hypotheses. Small n, deep signal. <strong>Quantitative</strong> methods (analytics, surveys, A/B) answer <em>how many</em> and validate at scale.</p>
        <p>A survey can't tell you <em>why</em> people churn. Analytics show <em>that</em> people drop at step 3, never <em>why</em>. When exploring, go qual first to find the questions, then quant to size them.</p>`,
        mermaid: { code: `flowchart LR
  Q{What's your question?} -->|Why / what| QL[Qualitative<br/>interviews, usability]
  Q -->|How many / does it work| QN[Quantitative<br/>analytics, A/B, survey]
  QL -->|generates hypotheses| QN
  QN -->|surfaces anomalies| QL`, cap: 'Qual and quant are a loop, not a rivalry.' },
        example: { items: ['<b>Airbnb</b> paired analytics (poor conversion) with in-home visits (photos were terrible) to find the fix.', '<b>Duolingo</b> runs hundreds of A/B tests but grounds new bets in user interviews.'] },
        mistakes: ['Using surveys to ask people to predict future behavior (they can\'t).', "Drawing 'why' conclusions from analytics alone.", 'Interviewing 5 people and treating it as statistically representative.'],
        quiz: { type: 'mcq', prompt: 'Your funnel shows a 40% drop at the payment step. Right next move?',
          options: [
            { t: 'Launch an A/B test on button color immediately.', ok: false, why: 'Guessing at a fix before understanding the cause.' },
            { t: "Run a survey asking why they didn't pay.", ok: false, why: 'People who left won\'t answer, and those who do rationalize.' },
            { t: 'Watch session recordings and run usability tests on the payment step.', ok: true, why: 'Quant found the where; use qual to find the why before you fix.' },
            { t: 'Assume pricing is too high and cut prices.', ok: false, why: 'Unvalidated leap that could destroy margin for nothing.' }
          ] },
        reflection: "When did your team last answer a 'why' question with a 'how many' method, or vice versa?"
      },
      {
        title: 'The research method menu',
        lead: 'Ten methods, each with a sweet spot. Picking wrong wastes weeks; picking right compresses months of guessing.',
        time: 5, diff: 2,
        objectives: ['Recall the main methods and their fit'],
        prose: `<p>Keep a mental menu: <strong>customer interviews</strong> (why), <strong>usability tests</strong> (can they use it), <strong>surveys</strong> (scale a known question), <strong>analytics</strong> (behavior at scale), <strong>A/B tests</strong> (causal impact), <strong>diary studies</strong> (behavior over time), <strong>concept tests</strong> (reaction), <strong>competitive teardown</strong> (landscape), <strong>support/sales mining</strong> (existing signal), <strong>fake-door tests</strong> (demand before building).</p>`,
        mistakes: ['Reaching for the same method every time regardless of the question.', 'Ignoring the cheapest signal already sitting in support tickets and sales calls.'],
        quiz: { type: 'match', prompt: 'Match the question to the sharpest method.',
          pairs: [
            { l: 'Can users complete checkout unaided?', r: 'Usability test' },
            { l: "Is there demand for a feature we haven't built?", r: 'Fake-door test' },
            { l: 'Does variant B lift conversion causally?', r: 'A/B test' },
            { l: 'Why do power users stick around?', r: 'Customer interview' }
          ] },
        reflection: 'Which method does your team overuse out of habit, and which do you underuse?'
      }
    ]
  },
  {
    id: 4, title: 'Customer Interviews', subtitle: 'The core discovery skill', emoji: '🎤', diff: 2,
    objectives: ['Ask non-leading questions', 'Dig into past behavior', 'Practice in the simulator'],
    screens: [
      {
        title: 'The cardinal rule: past behavior, not future promises',
        lead: 'People are terrible at predicting what they will do and generous with what they say. Anchor every question in what actually happened.',
        time: 7, diff: 2,
        objectives: ['Replace hypotheticals with story-mining', 'Recognize leading and closed questions'],
        prose: `<p>The worst interview question is <em>'Would you use a feature that does X?'</em> Everyone says yes to be nice, and yes means nothing. The best questions excavate a <strong>specific recent event</strong>: <em>'Tell me about the last time you tried to do X. Walk me through it.'</em></p>
        <p>Three question sins to hunt: <strong>leading</strong> ('Don't you hate when...?'), <strong>closed/binary</strong> (yes/no), and <strong>hypothetical</strong> ('Would you...?'). Replace all three with open, past-tense, story-mining prompts.</p>`,
        analogy: { title: 'Detective, not salesperson', body: 'A good interviewer is a detective reconstructing a crime scene. A bad interviewer is a salesperson fishing for a yes.' },
        mermaid: { code: `flowchart TB
  BAD[Bad questions] --> B1[Leading:<br/>'Don't you hate X?']
  BAD --> B2[Hypothetical:<br/>'Would you use Y?']
  BAD --> B3[Closed:<br/>'Do you like this?']
  GOOD[Good questions] --> G1['Tell me about the last time...']
  GOOD --> G2['Walk me through what you did']
  GOOD --> G3['Why did that matter to you?']`, cap: 'Trade the three sins for story-mining.' },
        example: { items: ['<b>The Mom Test</b> (Rob Fitzpatrick): ask about their life and past, never pitch your idea.', '<b>Teresa Torres</b>: collect stories, not opinions. Opinions are cheap; behavior is truth.'] },
        mistakes: ['Pitching your solution and mistaking politeness for validation.', "Asking 'would you' instead of 'when did you last'.", 'Talking more than the customer (aim for ~20% you, 80% them).'],
        quiz: { type: 'mcq', prompt: 'Which is the strongest interview question?',
          options: [
            { t: 'Would you pay $10/month for automated reports?', ok: false, why: 'Hypothetical + pitches a solution + invites a polite yes. Triple sin.' },
            { t: "Don't you find manual reporting frustrating?", ok: false, why: "Leading. You've put the answer in their mouth." },
            { t: 'Tell me about the last report you built. Walk me through it.', ok: true, why: 'Open, past-tense, story-mining. Surfaces real behavior and pain.' },
            { t: 'Do you like dashboards?', ok: false, why: 'Closed and vague. Dead-end yes/no.' }
          ] },
        reflection: "Rewrite a hypothetical question you've asked ('Would you use...?') into a past-behavior question.",
        hint: "Every time you catch yourself about to say 'would you', swap it for 'tell me about the last time you'."
      },
      {
        title: 'Practice: the interview simulator',
        lead: 'Reading about interviews is like reading about swimming. Time to get in the water with a live, reactive customer.',
        time: 12, diff: 2,
        objectives: ['Run a real interview end to end', 'Get scored on leading questions, bias, and depth'],
        prose: `<p>Open the <strong>Interview Simulator</strong> from the sidebar. Build a persona, then interview them. The customer answers in character, and afterward you get a scorecard flagging every leading question, closed question, solution-pitch, and the good follow-ups you nailed.</p>
        <p>Your target: at least 8 exchanges, mostly open past-tense questions, digging at least two 'why' layers deep on each pain.</p>`,
        launch: { view: 'interview', label: 'Open the Interview Simulator', icon: 'mic' },
        mistakes: ['Ending the interview after surface answers instead of digging deeper.', 'Leading the witness once you hear something you like.'],
        reflection: 'After your first simulated interview, what was your biggest tell? Leading, closed, or pitching?'
      }
    ]
  },
  {
    id: 5, title: 'Finding Opportunities', subtitle: 'Opportunity solution trees', emoji: '🌳', diff: 2,
    objectives: ['Write opportunity statements', 'Build an opportunity solution tree', 'Separate opportunities from solutions'],
    screens: [
      {
        title: 'Opportunities are problems, not solutions',
        lead: "An opportunity is an unmet need, pain, or desire, phrased from the customer's world. The moment it names a feature, it's a solution in disguise.",
        time: 6, diff: 2,
        objectives: ['Phrase opportunities as needs', 'Catch solutions masquerading as opportunities'],
        prose: `<p>Write opportunities in the customer's voice as a need: <em>'I can't tell which of my campaigns is actually working.'</em> That's an opportunity. <em>'Add a comparison dashboard'</em> is a solution. One opportunity can have many candidate solutions, which is why you keep them separate.</p>
        <p>Good opportunity statements are <strong>specific, emotional, and solution-free</strong>. If you can't imagine three ways to solve it, you've probably written a solution.</p>`,
        mermaid: { code: `flowchart TB
  O["Opportunity: I can't tell which campaign works"]
  O --> S1[Solution: comparison dashboard]
  O --> S2[Solution: weekly digest email]
  O --> S3[Solution: auto-flag top performer]`, cap: 'One opportunity, many possible solutions.' },
        mistakes: ['Writing opportunities that secretly name a feature.', "Making opportunities so broad they're meaningless ('users want a better experience')."],
        quiz: { type: 'mcq', prompt: 'Which of these is a true opportunity (not a solution)?',
          options: [
            { t: 'Add a dark mode toggle.', ok: false, why: "That's a specific solution." },
            { t: 'I lose track of which files are the latest version.', ok: true, why: 'A customer-voiced unmet need, solvable many ways.' },
            { t: 'Build an AI summarizer.', ok: false, why: 'Solution, and a shiny one.' },
            { t: 'Integrate with Slack.', ok: false, why: 'Solution masquerading as a need.' }
          ] },
        reflection: 'Take a feature on your roadmap. What customer opportunity does it serve? Name two other solutions to it.'
      },
      {
        title: 'The Opportunity Solution Tree',
        lead: "Teresa Torres's tree connects your desired outcome to opportunities, opportunities to solutions, and solutions to experiments.",
        time: 7, diff: 2,
        objectives: ['Structure a full OST', 'Trace outcome to experiment'],
        prose: `<p>The tree has four layers: a single <strong>outcome</strong> at the top, branching into <strong>opportunities</strong> (customer needs), branching into <strong>solutions</strong>, branching into <strong>experiments</strong>. Every solution must ladder up to an opportunity that ladders up to your outcome. Orphan features get exposed instantly.</p>`,
        mermaid: { code: `flowchart TB
  OUT[Outcome: +15% weekly retention] --> O1[Opp: can't find files]
  OUT --> O2[Opp: onboarding overwhelms]
  O1 --> S1[Search rewrite]
  O1 --> S2[Recent files rail]
  O2 --> S3[Guided setup]
  S1 --> E1[Prototype test]
  S2 --> E2[Fake-door]
  S3 --> E3[Usability test]`, cap: 'Outcome to opportunities to solutions to experiments.' },
        example: { items: ['<b>Teresa Torres</b> (Continuous Discovery Habits) built the OST as the backbone of weekly discovery.', 'Teams use it to visibly kill orphan features that ladder up to nothing.'] },
        mistakes: ['Starting from solutions and reverse-justifying opportunities.', 'Putting multiple outcomes at the top (focus on one).'],
        quiz: { type: 'order', prompt: 'Put the layers of an Opportunity Solution Tree in top-to-bottom order.', items: ['Outcome', 'Opportunities', 'Solutions', 'Experiments'] },
        reflection: 'Sketch a one-outcome tree for your product. Which branch has the weakest link to the outcome?'
      }
    ]
  },
  {
    id: 6, title: 'Problem Validation', subtitle: 'Assumptions, evidence, and bias', emoji: '🧪', diff: 2,
    objectives: ['Map assumptions', 'Design cheap validation', 'Beat confirmation bias'],
    screens: [
      {
        title: 'Assumption mapping: what must be true?',
        lead: 'Every idea rests on assumptions. Discovery is finding the ones that are both risky and unknown, and testing those first.',
        time: 6, diff: 2,
        objectives: ['Surface hidden assumptions', 'Prioritize by risk x uncertainty'],
        prose: `<p>For any solution, brainstorm assumptions across four types: <strong>desirability</strong>, <strong>viability</strong>, <strong>feasibility</strong>, <strong>usability</strong>. Then plot each on <strong>importance</strong> vs <strong>evidence</strong>. High-importance and low-evidence are your <em>leap-of-faith assumptions</em>. Test those first.</p>`,
        mermaid: { code: `quadrantChart
  title Assumption map
  x-axis Strong evidence --> No evidence
  y-axis Low importance --> High importance
  quadrant-1 TEST FIRST
  quadrant-2 Safe to assume
  quadrant-3 Ignore
  quadrant-4 Monitor
  Users trust AI edits: [0.85, 0.9]
  Problem occurs weekly: [0.8, 0.85]
  We can build the model: [0.3, 0.6]
  Button is findable: [0.4, 0.3]`, cap: 'High importance + low evidence = test first.' },
        mistakes: ['Testing the easy assumptions instead of the scary ones.', "Confusing 'we believe' with 'we know'."],
        quiz: { type: 'mcq', prompt: 'You have four assumptions. Which do you test FIRST?',
          options: [
            { t: 'One that is low importance and already well-evidenced.', ok: false, why: 'Nothing to learn, low stakes. Skip.' },
            { t: 'One that is high importance but you have no evidence for.', ok: true, why: 'Highest risk, most unknown: your leap-of-faith assumption.' },
            { t: 'One that is easy to test regardless of importance.', ok: false, why: 'You might validate something that doesn\'t matter.' },
            { t: 'One engineering is most curious about.', ok: false, why: 'Curiosity is nice; risk-prioritization is better.' }
          ] },
        reflection: "What's the scariest untested assumption behind your current top priority?"
      },
      {
        title: 'The bias arsenal: confirmation, solution, and vanity',
        lead: 'Your brain is a validation machine that wants your idea to be right. Discovery is the discipline of trying to prove yourself wrong.',
        time: 6, diff: 3,
        objectives: ['Name the three deadly biases', 'Design tests that can actually fail'],
        prose: `<p><strong>Confirmation bias:</strong> seeking evidence that supports what you already believe. Antidote: define, in advance, what result would prove you <em>wrong</em>.</p>
        <p><strong>Solution bias:</strong> falling in love with a solution before validating the problem. Antidote: spend more time on the opportunity than the feature.</p>
        <p><strong>Vanity metrics:</strong> numbers that rise and feel good but don't reflect value. Antidote: track actionable, behavior-linked metrics.</p>`,
        analogy: { title: 'The prosecutor and the defense', body: "Confirmation bias makes you the defense attorney for your own idea. Good discovery forces you to also be the prosecutor. If you can't build a case against your idea, you haven't tested it." },
        example: { items: ["<b>Vanity:</b> 'We hit 1M downloads' while daily actives are flat.", "<b>Actionable:</b> 'Week-4 retention rose from 22% to 31% after the onboarding change.'"] },
        mistakes: ["Running a test where every outcome 'confirms' the idea.", 'Celebrating signups while engagement quietly dies.'],
        quiz: { type: 'mcq', prompt: 'Which metric is a vanity metric?',
          options: [
            { t: 'Week-4 retention rate.', ok: false, why: 'Behavior-linked and actionable.' },
            { t: 'Total cumulative registered users.', ok: true, why: 'Only goes up, never reflects current value. Classic vanity.' },
            { t: 'Activation rate (reached first value).', ok: false, why: 'A real leading indicator.' },
            { t: 'Paid conversion rate.', ok: false, why: 'Directly tied to business value.' }
          ] },
        reflection: 'Which metric does your team celebrate that might be vanity? What behavior-linked metric should replace it?'
      }
    ]
  },
  {
    id: 7, title: 'Solution Discovery', subtitle: 'Ideation, JTBD, and Design Thinking', emoji: '💡', diff: 2,
    objectives: ['Generate diverse solutions', 'Apply JTBD', 'Run Design Thinking loops'],
    screens: [
      {
        title: 'Jobs To Be Done: people hire products',
        lead: "Customers don't buy products, they hire them to make progress in a specific circumstance.",
        time: 7, diff: 2,
        objectives: ['Write a JTBD statement', 'Find the real competition'],
        prose: `<p>JTBD reframes everything: nobody wants a quarter-inch drill, they want a quarter-inch hole. The job format: <em>'When I [situation], I want to [motivation], so I can [expected outcome].'</em></p>
        <p>The killer insight: your competition is anything the customer might 'hire' for the same job, including doing nothing. Milkshakes competed with bananas and bagels once Christensen found the job was 'keep my boring commute interesting.'</p>`,
        mermaid: { code: `flowchart LR
  C[Situation: long boring commute] --> J[Job: stay occupied + full till noon]
  J --> H1[Hires: milkshake]
  J --> H2[Also competes: banana]
  J --> H3[Also competes: bagel]
  J --> H4[Also competes: nothing]`, cap: 'The milkshake job and its real competitors.' },
        example: { items: ["<b>Christensen's milkshake study</b>: same product, two totally different jobs.", "<b>Netflix</b> once named its competitor as 'sleep', because the job is filling idle evening time."] },
        mistakes: ["Defining the job as the product ('the job is to use our app').", "Ignoring 'do nothing' as the most common competitor."],
        quiz: { type: 'mcq', prompt: "A commuter 'hires' a podcast. What's the underlying job?",
          options: [
            { t: 'To listen to a podcast.', ok: false, why: "That's the solution, not the job. Circular." },
            { t: 'To make dead commute time feel productive and less boring.', ok: true, why: 'The progress they are making. Audiobooks, music, calls all compete.' },
            { t: 'To like the podcast brand.', ok: false, why: 'Not a job, a preference.' },
            { t: 'To own headphones.', ok: false, why: 'A means, not the job.' }
          ] },
        reflection: 'Write a JTBD statement for your product. What non-obvious things compete for that same job?'
      },
      {
        title: 'Design Thinking: diverge then converge',
        lead: 'Empathize, Define, Ideate, Prototype, Test. The rhythm is opening wide for possibilities, then narrowing hard on evidence.',
        time: 6, diff: 2,
        objectives: ['Run the five-stage loop', 'Balance divergence and convergence'],
        prose: `<p>Design Thinking's five stages alternate between diverging (generate many) and converging (choose few). The classic failure is skipping straight to a single obvious solution.</p>
        <p>In ideation, quantity precedes quality. Aim for 15+ ideas per opportunity before judging any. The tenth idea is where the obvious runs out and the interesting begins.</p>`,
        mermaid: { code: `flowchart LR
  E[Empathize] --> D[Define] --> I[Ideate] --> P[Prototype] --> T[Test]
  T -.learn.-> E`, cap: 'A loop, not a line. Test feeds back into empathy.' },
        mistakes: ['Ideating one solution and calling it a day.', 'Skipping Define and solving the wrong problem beautifully.'],
        quiz: { type: 'order', prompt: 'Order the Design Thinking stages.', items: ['Empathize', 'Define', 'Ideate', 'Prototype', 'Test'] },
        reflection: 'When did your team last generate 10+ options before choosing? If never, what stops you?'
      }
    ]
  },
  {
    id: 8, title: 'Experiment Design', subtitle: 'Hypotheses and cheap tests', emoji: '🧭', diff: 3,
    objectives: ['Write testable hypotheses', 'Pick the cheapest valid test', 'Read results honestly'],
    screens: [
      {
        title: 'Hypotheses: falsifiable or it does not count',
        lead: "A hypothesis you can't disprove is a wish. Structure it so a specific result would clearly kill it.",
        time: 6, diff: 3,
        objectives: ['Write a hypothesis with a kill-criterion', 'Define success before you test'],
        prose: `<p>Use the format: <em>'We believe [solution] will achieve [outcome] for [users]. We'll know we're right when we see [signal]. We're wrong if [threshold].'</em> The last clause is the one everyone skips and the one that matters most.</p>
        <p>Set your success threshold <strong>before</strong> running the test. Deciding what 'good' means after you see the data is how confirmation bias wins.</p>`,
        mermaid: { code: `flowchart LR
  H[Hypothesis] --> M[Metric + threshold set BEFORE]
  M --> R{Result}
  R -->|above threshold| K[Keep / scale]
  R -->|below threshold| X[Kill / pivot]`, cap: 'Pre-commit the threshold, then let data decide.' },
        mistakes: ['Writing hypotheses with no failure condition.', 'Moving the goalposts after seeing the data.'],
        quiz: { type: 'mcq', prompt: 'Which is a well-formed, testable hypothesis?',
          options: [
            { t: 'Users will love the new onboarding.', ok: false, why: 'Not measurable, no threshold, unfalsifiable.' },
            { t: 'Guided setup will lift 7-day activation from 34% to at least 45%; below 40% we kill it.', ok: true, why: 'Specific metric, baseline, success bar, pre-set kill criterion.' },
            { t: 'We think onboarding matters a lot.', ok: false, why: 'A belief, not a hypothesis.' },
            { t: 'Onboarding should be better.', ok: false, why: 'No metric, no test, no threshold.' }
          ] },
        reflection: "Take a current bet and add the missing clause: 'We're wrong if ___.'"
      },
      {
        title: 'The cheapest valid test wins',
        lead: "You don't need to build it to test it. Fake doors, prototypes, concierge, Wizard of Oz: each buys validation for a fraction of the cost.",
        time: 6, diff: 3,
        objectives: ['Match test type to risk', 'Avoid over-building to learn'],
        prose: `<p>A ladder of cheap tests, roughly by cost: <strong>fake-door</strong>, <strong>landing page / smoke test</strong>, <strong>prototype test</strong>, <strong>Wizard of Oz</strong> (humans fake the automation), <strong>concierge</strong> (manually deliver value to a few users). Only after these do you write production code.</p>`,
        analogy: { title: "Don't build the bridge to test the traffic", body: "You don't pour concrete to find out if people want to cross the river. You count how many walk to the water's edge first." },
        example: { items: ['<b>Zappos</b> started as a fake-door: photograph shoes in stores, buy them only when someone ordered.', '<b>Dropbox</b> validated demand with a 3-minute demo video before the product fully existed.'] },
        mistakes: ["Building the real thing to test an idea you could've faked in a day.", 'Running a fake-door but breaking trust at scale.'],
        quiz: { type: 'match', prompt: "Match the test to what it's best at validating.",
          pairs: [
            { l: 'Fake-door button', r: 'Demand for an unbuilt feature' },
            { l: 'Clickable prototype', r: 'Usability + desirability' },
            { l: 'Wizard of Oz', r: 'Value before automation exists' },
            { l: 'Landing page smoke test', r: 'Willingness to sign up / pay' }
          ] },
        reflection: "Your next big feature: what's the cheapest test that could kill it before you write code?"
      }
    ]
  },
  {
    id: 9, title: 'Prioritization', subtitle: 'RICE, ICE, Kano, MoSCoW', emoji: '⚖️', diff: 2,
    objectives: ['Apply RICE and ICE', 'Use Kano to classify features', 'Say no with evidence'],
    screens: [
      {
        title: 'RICE and ICE: scoring the shortlist',
        lead: "Prioritization frameworks don't make the decision for you. They make your reasoning explicit and comparable.",
        time: 6, diff: 2,
        objectives: ['Compute a RICE score', 'Know when the numbers lie'],
        prose: `<p><strong>RICE</strong> = (Reach x Impact x Confidence) / Effort. <strong>ICE</strong> drops Reach for speed (Impact x Confidence x Ease).</p>
        <p>The danger: precise-looking numbers built on guessed inputs. Confidence is doing real work, low-evidence bets should carry low confidence and score down. That's the framework protecting you from yourself.</p>`,
        mermaid: { code: `flowchart LR
  R[Reach] --> S(( ))
  I[Impact] --> S
  C[Confidence] --> S
  S -->|multiply| N[Numerator]
  E[Effort] --> D{divide}
  N --> D
  D --> SC[RICE score]`, cap: 'RICE = R x I x C / Effort. Confidence guards against hype.' },
        mistakes: ['Treating RICE scores as objective truth rather than structured opinion.', 'Inflating Confidence on pet projects.'],
        quiz: { type: 'mcq', prompt: 'Feature A: Reach 1000, Impact 2, Conf 80%, Effort 2. Feature B: same but Effort 8. Which wins on RICE?',
          options: [
            { t: 'Feature A', ok: true, why: 'Same numerator (1600), but A\'s effort is 4x lower: 800 vs 200. A wins.' },
            { t: 'Feature B', ok: false, why: 'B has 4x the effort for identical inputs. It scores lower.' },
            { t: 'They tie', ok: false, why: 'Effort differs 4x, so scores differ 4x.' },
            { t: "Can't tell", ok: false, why: 'You have every input; effort decides.' }
          ] },
        reflection: 'Where does your team fudge Confidence to justify a favorite? Be honest.'
      },
      {
        title: 'Kano and saying no with evidence',
        lead: "Not all features are equal in a customer's heart. Kano sorts them, and gives you language to decline the rest.",
        time: 6, diff: 2,
        objectives: ['Classify features with Kano', 'Decline requests using evidence'],
        prose: `<p><strong>Kano</strong> sorts features into: <strong>basic</strong> (expected), <strong>performance</strong> (more is better), <strong>delighters</strong> (unexpected joy), and <strong>indifferent</strong> (nobody cares). Over-investing in indifferent features while missing basics is a death spiral.</p>
        <p>To say no well, don't say 'no'. Say: <em>'Here's the opportunity this serves, the evidence for its size, and what it trades off against. Based on that, it ranks below X.'</em></p>`,
        mermaid: { code: `quadrantChart
  title Kano model
  x-axis Absent --> Fully present
  y-axis Dissatisfied --> Delighted
  quadrant-1 Delighters
  quadrant-2 Performance
  quadrant-3 Basic must-haves
  quadrant-4 Indifferent
  One-click export: [0.8, 0.85]
  Fast load time: [0.9, 0.7]
  Working login: [0.9, 0.15]
  Theme customizer: [0.7, 0.45]`, cap: 'Kano: not all features earn the same love.' },
        mistakes: ['Building delighters while basics are broken.', "Saying a flat 'no' instead of showing the tradeoff with evidence."],
        quiz: { type: 'mcq', prompt: 'A sales exec demands a niche feature one big prospect asked for. Evidence-based response?',
          options: [
            { t: 'Build it, big prospects matter.', ok: false, why: "One loud voice isn't evidence of broad value." },
            { t: "Flatly refuse; sales doesn't set roadmap.", ok: false, why: 'Correct instinct, terrible politics, and you might be wrong.' },
            { t: 'Show the opportunity, how many users share it, what it displaces, then rank transparently.', ok: true, why: 'Reframe from opinion to evidence and tradeoff.' },
            { t: "Promise it vaguely for 'later'.", ok: false, why: 'Erodes trust when later never comes.' }
          ] },
        reflection: 'Recall a feature you built for one loud stakeholder. Did the evidence ever justify it?'
      }
    ]
  },
  {
    id: 10, title: 'Metrics', subtitle: 'North Star, AARRR, HEART', emoji: '📊', diff: 2,
    objectives: ['Choose a North Star', 'Read AARRR and HEART', 'Kill vanity metrics'],
    screens: [
      {
        title: 'North Star: one metric to align them all',
        lead: 'A North Star metric captures the core value your product delivers, so every team can see whether they are creating it.',
        time: 6, diff: 2,
        objectives: ['Define a good North Star', 'Break it into input metrics'],
        prose: `<p>A <strong>North Star metric</strong> is the one number that best predicts long-term success because it measures delivered customer value. Spotify: time spent listening. Airbnb: nights booked. It should be a leading indicator of revenue, not revenue itself.</p>
        <p>Below the North Star sit <strong>input metrics</strong> you can influence week to week.</p>`,
        mermaid: { code: `flowchart TB
  NS[North Star: Weekly active listeners] --> I1[New user activation]
  NS --> I2[Session frequency]
  NS --> I3[Content discovery rate]
  NS --> I4[Retention]
  I3 --> W1[Recommendation quality]
  I3 --> W2[Search success]`, cap: 'North Star at the top, influenceable inputs below.' },
        example: { items: ["<b>Facebook</b> used '7 friends in 10 days' as an activation input to their North Star.", '<b>Spotify</b>: time spent listening beats total signups every time.'] },
        mistakes: ['Picking revenue as the North Star (lagging, not actionable).', 'Choosing a metric users can game or that ignores value delivered.'],
        quiz: { type: 'mcq', prompt: 'Best North Star candidate for a note-taking app?',
          options: [
            { t: 'Total registered accounts.', ok: false, why: 'Vanity, lagging, includes the dead.' },
            { t: 'Weekly notes created per active user.', ok: true, why: 'Captures delivered value, leading indicator, influenceable.' },
            { t: 'App store rating.', ok: false, why: 'Useful signal, but not a value-throughput metric.' },
            { t: 'Monthly revenue.', ok: false, why: 'Lagging outcome, not a leading star.' }
          ] },
        reflection: 'What single metric best captures the value your product delivers? Is it what your team watches?'
      },
      {
        title: 'AARRR and HEART: the measurement toolkits',
        lead: 'AARRR maps the customer lifecycle. HEART maps experience quality. Together they cover growth and goodness.',
        time: 6, diff: 2,
        objectives: ['Recall AARRR stages', 'Apply HEART dimensions'],
        prose: `<p><strong>AARRR</strong> (pirate metrics): <strong>Acquisition, Activation, Retention, Referral, Revenue</strong>. <strong>HEART</strong> (Google): <strong>Happiness, Engagement, Adoption, Retention, Task success</strong>, pairing each with a Goal-Signal-Metric.</p>`,
        mermaid: { code: `flowchart LR
  A[Acquisition] --> Ac[Activation] --> R[Retention] --> Rf[Referral] --> Rv[Revenue]`, cap: 'AARRR: the funnel every growth team lives in.' },
        mistakes: ['Optimizing acquisition while retention leaks.', 'Measuring engagement without a task-success metric.'],
        quiz: { type: 'order', prompt: 'Put the AARRR pirate metrics in lifecycle order.', items: ['Acquisition', 'Activation', 'Retention', 'Referral', 'Revenue'] },
        reflection: "Which AARRR stage leaks most in your product? What's the evidence?"
      }
    ]
  },
  {
    id: 11, title: 'Discovery in Agile', subtitle: 'Sprints, trios, and stakeholders', emoji: '🔄', diff: 2,
    objectives: ['Run discovery in a sprint cadence', 'Work with the product trio', 'Manage stakeholders'],
    screens: [
      {
        title: 'The product trio and continuous cadence',
        lead: "Discovery isn't a PM solo act. The trio discovers together, weekly, in small continuous doses.",
        time: 6, diff: 2,
        objectives: ["Define the trio's roles", 'Set a weekly discovery rhythm'],
        prose: `<p>The <strong>product trio</strong> shares discovery so decisions carry all three lenses: value (PM), usability (designer), feasibility (engineer). When engineers hear customer pain firsthand, they build better and argue less.</p>
        <p>Teresa Torres's <strong>continuous cadence</strong>: interview at least one customer every week, update the opportunity tree, run at least one small assumption test.</p>`,
        mermaid: { code: `flowchart LR
  PM[PM: value] --- DES[Designer: usability] --- ENG[Engineer: feasibility]
  PM --- ENG
  subgraph Weekly
    W1[1+ interview] --> W2[Update tree] --> W3[1 assumption test]
  end`, cap: 'One trio, one weekly rhythm.' },
        mistakes: ['PM hoarding discovery and handing conclusions to the team.', "Batching all discovery into a rare 'research week'."],
        quiz: { type: 'truefalse', prompt: 'Continuous discovery means interviewing customers roughly every week, not in occasional big batches.', answer: true, whyTrue: 'Right. Small, weekly touches keep the customer model fresh and reduce big-bet risk.', whyFalse: "It's actually true: small and continuous over big and rare." },
        reflection: 'How often does your engineer hear a customer directly? What would change if it were weekly?'
      },
      {
        title: 'Presenting findings and stakeholder buy-in',
        lead: 'Great discovery that nobody acts on is a diary entry. Presenting is where insight becomes decision.',
        time: 6, diff: 2,
        objectives: ['Structure a findings readout', 'Turn evidence into a decision'],
        prose: `<p>Structure a readout as: <strong>the question</strong>, <strong>what we did</strong>, <strong>what we found</strong>, <strong>what it means</strong>, and <strong>what we recommend</strong>. Lead with the recommendation for executives; lead with evidence for skeptics.</p>
        <p>Bring the customer into the room: a 20-second clip of a user struggling beats 20 slides of your interpretation.</p>`,
        mistakes: ['Presenting raw data with no recommendation.', 'Hiding disconfirming evidence to make a cleaner story.'],
        quiz: { type: 'mcq', prompt: "An exec asks 'so what should we do?' after your research. Best readout structure?",
          options: [
            { t: 'Walk through all 40 interview transcripts chronologically.', ok: false, why: "You'll lose the room in minute two." },
            { t: 'Lead with the recommendation and decision, then back it with the sharpest evidence.', ok: true, why: 'Execs want the decision first, evidence second.' },
            { t: 'Show only the data and let them decide.', ok: false, why: 'Abdicating the insight. Your job is to interpret.' },
            { t: 'Present findings but omit the one that contradicts your recommendation.', ok: false, why: 'How you lose credibility permanently.' }
          ] },
        reflection: 'Last time you shared research, did it end in a decision or just a nod?'
      }
    ]
  },
  {
    id: 12, title: 'Advanced Discovery', subtitle: 'Continuous habits and scale', emoji: '🚀', diff: 3,
    objectives: ['Build durable discovery habits', 'Scale discovery across teams', 'Avoid discovery theater'],
    screens: [
      {
        title: 'Discovery habits that survive pressure',
        lead: "Anyone can do discovery when it's calm. The mark of maturity is habits that hold when the deadline is on fire.",
        time: 6, diff: 3,
        objectives: ['Design habit triggers', 'Protect discovery under pressure'],
        prose: `<p>Habits beat intentions. Instead of 'we should talk to users more,' engineer a <strong>trigger</strong>: an automated weekly interview recruit, a standing 30-minute slot, a tree you must update before planning. When the process runs without willpower, it survives crunch.</p>
        <p>Watch for <strong>discovery theater</strong>: interviews that only seek confirmation, trees drawn once and abandoned, tests designed to pass.</p>`,
        analogy: { title: 'Flossing, not a cleanse', body: 'Discovery is flossing: small, unglamorous, daily. It is not a juice cleanse you do once and feel virtuous about. The teams that win floss.' },
        mistakes: ['Relying on motivation instead of a scheduled trigger.', 'Running discovery rituals that reduce zero uncertainty (theater).'],
        quiz: { type: 'mcq', prompt: 'Which is most likely to make discovery survive a crunch?',
          options: [
            { t: 'A team agreement that we value discovery.', ok: false, why: 'Values evaporate under deadline pressure without structure.' },
            { t: 'An automated weekly interview recruit that books itself into a standing slot.', ok: true, why: 'A trigger that runs without willpower. Structure beats intention.' },
            { t: 'A quarterly reminder to do research.', ok: false, why: "Too infrequent; it's not continuous." },
            { t: 'Hoping the PM remembers.', ok: false, why: 'Memory is the first casualty of crunch.' }
          ] },
        reflection: "What's one discovery trigger you could automate so it happens without anyone deciding to?"
      }
    ]
  },
  {
    id: 13, title: 'AI Product Discovery', subtitle: 'Discovery for and with AI', emoji: '🤖', diff: 3,
    objectives: ['Discover AI-product value', 'Handle probabilistic UX', 'Use AI to accelerate discovery'],
    screens: [
      {
        title: 'AI changes what you validate',
        lead: 'AI products fail differently. On top of the classic four risks, you must validate trust, accuracy tolerance, and the cost of being wrong.',
        time: 7, diff: 3,
        objectives: ['Add AI-specific risks to discovery', 'Design for probabilistic outputs'],
        prose: `<p>Traditional software is deterministic. AI is <strong>probabilistic</strong>: right most of the time, wrong sometimes, confidently wrong occasionally. Discovery for AI must answer: <em>what's the user's tolerance for a wrong answer, and what's the cost when it happens?</em> A wrong movie rec is fine; a wrong medical dosage is not.</p>
        <p>New risks: <strong>trust</strong>, <strong>accuracy threshold</strong>, <strong>graceful failure</strong>, and <strong>value over the non-AI baseline</strong>.</p>`,
        mermaid: { code: `flowchart TB
  V[Classic risks: value, usability, feasibility, viability] --> AI[AI adds:]
  AI --> T[Trust: will they act on it?]
  AI --> A[Accuracy: good enough?]
  AI --> F[Failure: graceful when wrong?]
  AI --> B[Beats a simple baseline?]`, cap: 'AI stacks new risks on the classic four.' },
        example: { items: ['<b>GitHub Copilot</b> found users accept ~30% of suggestions and that\'s still hugely valuable: the accuracy threshold was lower than intuition suggested.', "<b>AI failure</b>: many 'AI summarizers' lose to a simple 'show first sentence' baseline nobody tested against."] },
        mistakes: ["Assuming users need near-perfect accuracy when they'd accept 70% with easy correction.", "Skipping the 'does AI beat a dumb baseline?' test.", 'Designing the happy path only, ignoring confidently-wrong failure modes.'],
        quiz: { type: 'mcq', prompt: "You're adding AI auto-categorization. Most AI-specific thing to validate first?",
          options: [
            { t: 'That the model architecture is state of the art.', ok: false, why: "Tech vanity. Users don't care about your architecture." },
            { t: 'The user\'s tolerance for miscategorization and how costly a wrong call is.', ok: true, why: 'Accuracy tolerance and cost-of-wrong define viability and failure design.' },
            { t: 'That it looks impressive in the demo.', ok: false, why: 'Demo magic often dies in real usage.' },
            { t: 'That it is faster than a human.', ok: false, why: 'Speed is worthless if wrong answers are costly and untrusted.' }
          ] },
        reflection: "For an AI feature you'd build, what's the cost when it's confidently wrong, and how would you design for that?"
      },
      {
        title: 'Using AI to accelerate discovery itself',
        lead: 'AI is also a discovery instrument: synthesizing interviews, clustering feedback, drafting hypotheses. Powerful, and quietly dangerous.',
        time: 6, diff: 3,
        objectives: ['Speed up synthesis with AI', 'Avoid AI-amplified bias'],
        prose: `<p>AI can transcribe and cluster hundreds of interviews and draft opportunity statements in seconds. Use it to <strong>expand</strong> what you can process, not to <strong>replace</strong> your judgment.</p>
        <p>The danger: AI is a confirmation-bias amplifier. Ask it to 'find support for my idea' and it obligingly will. Instead, ask it to <em>steelman the opposite</em> and flag where your sample is thin.</p>`,
        mistakes: ['Letting AI synthesis replace reading the raw voice of the customer.', 'Prompting AI to confirm rather than challenge your hypothesis.'],
        quiz: { type: 'mcq', prompt: 'Healthiest way to use AI in interview synthesis?',
          options: [
            { t: 'Ask it to summarize why your idea is validated.', ok: false, why: 'You just weaponized confirmation bias.' },
            { t: 'Ask it to surface quotes that contradict your hypothesis and where evidence is weakest.', ok: true, why: 'Using AI as a prosecutor, not a cheerleader.' },
            { t: 'Let it write the final decision for you.', ok: false, why: "Judgment isn't delegable; AI lacks your context and stakes." },
            { t: 'Only read the AI summary, skip the transcripts.', ok: false, why: "You'll lose the surprising quote that changes everything." }
          ] },
        reflection: 'How could you prompt an AI to challenge your current top hypothesis instead of confirming it?'
      }
    ]
  },
  {
    id: 14, title: 'Real Company Simulations', subtitle: 'Discovery under real constraints', emoji: '🏢', diff: 3,
    objectives: ['Apply discovery in realistic scenarios', 'Handle messy constraints', 'Practice via the generator'],
    screens: [
      {
        title: 'Case study: how the pros actually did it',
        lead: 'Theory meets reality. Four real discovery stories, with the mistakes left in.',
        time: 8, diff: 3,
        objectives: ['Extract transferable lessons from real cases'],
        prose: `<p><strong>Airbnb (the photos insight):</strong> Analytics showed weak listing conversion in New York. Founders visited hosts in person and found the real problem: listing photos were terrible. They shot professional photos, and revenue in the market roughly doubled. <em>Lesson: quant found the where, going to the customer found the why.</em></p>
        <p><strong>Dropbox (the demo video):</strong> Drew Houston made a 3-minute video demoing the product as if it existed. Beta signups jumped from 5,000 to 75,000 overnight. <em>Lesson: validate demand before building the hard thing.</em></p>
        <p><strong>Slack (concierge onboarding):</strong> Slack personally onboarded early teams and treated 'we don't need this' as a research goldmine. <em>Lesson: talk to the people who rejected you.</em></p>
        <p><strong>Superhuman (the PMF engine):</strong> Rahul Vohra built discovery around one question: 'How would you feel if you could no longer use this?' and optimized for the 'very disappointed' users. <em>Lesson: make product/market fit a metric you can discover toward.</em></p>`,
        mermaid: { code: `timeline
  title Airbnb photos discovery
  Notice : Low conversion in NYC (analytics)
  Go there : Visit hosts in person
  Find why : Photos are the problem
  Test cheap : Shoot pro photos manually
  Result : Revenue roughly doubles`, cap: 'Airbnb: the doing-things-that-do-not-scale classic.' },
        example: { items: ['<b>Common thread:</b> every story pairs a signal with getting physically closer to the customer.', '<b>Common thread:</b> they tested the risky assumption cheaply before the expensive build.'] },
        mistakes: ['Reading case studies as recipes instead of extracting the transferable principle.', 'Assuming what worked at their scale works at yours.'],
        quiz: { type: 'mcq', prompt: 'Transferable lesson across Airbnb, Dropbox, and Slack?',
          options: [
            { t: 'Always shoot professional photos.', ok: false, why: "That's the Airbnb tactic, not the principle." },
            { t: 'Get close to the customer and validate the risky assumption cheaply before the expensive build.', ok: true, why: 'The reusable principle beneath all three tactics.' },
            { t: 'Make a viral video.', ok: false, why: "Dropbox's tactic, not a universal law." },
            { t: 'Onboard every user by hand forever.', ok: false, why: 'A phase, not a scalable principle.' }
          ] },
        reflection: 'Which of these four stories mirrors a situation your team is in right now?'
      },
      {
        title: 'Your turn: simulated company scenarios',
        lead: "You're the PM. Pick a company and constraint set, and run discovery against a realistic brief from the generator.",
        time: 15, diff: 3,
        objectives: ['Apply the full discovery loop to a scenario', 'Handle budget, time, and team constraints'],
        prose: `<p>Open the <strong>Exercise Generator</strong> to spin up a randomized company scenario with a problem, customer, market, competition, budget, timeline, and team size. Then work the loop: assumptions, research plan, interview (use the simulator), opportunities, experiment, recommendation.</p>
        <p>Constraints are the point. The skill is discovering <em>well</em> when you have two weeks and one researcher.</p>`,
        launch: { view: 'generator', label: 'Open the Exercise Generator', icon: 'dices' },
        mistakes: ['Ignoring the constraints and designing a fantasy research plan.', 'Skipping straight to solutions without touching the customer.'],
        reflection: "Under a two-week, one-person constraint, what's the single highest-leverage discovery activity?"
      }
    ]
  },
  {
    id: 15, title: 'Capstone Project', subtitle: 'Run a full discovery, end to end', emoji: '🏁', diff: 3,
    objectives: ['Run a complete discovery project', 'Produce a discovery document', 'Recommend a roadmap'],
    screens: [
      {
        title: 'The capstone: from idea to roadmap',
        lead: 'Everything you have learned, applied once, in order, on a project of your choosing. This is where knowledge becomes skill.',
        time: 20, diff: 3,
        objectives: ['Sequence a full discovery project', 'Produce evidence-backed recommendations'],
        prose: `<p>The capstone walks you through nine stages: <strong>choose an idea, research the customer, interview, find opportunities, prioritize, design an experiment, analyze results, present findings, recommend a roadmap.</strong> Each stage saves your work, and at the end you get detailed feedback on the whole arc.</p>
        <p>Open the <strong>Capstone</strong> from the sidebar to begin. The more honest your inputs, the more useful the feedback.</p>`,
        launch: { view: 'capstone', label: 'Start the Capstone Project', icon: 'flag' },
        mermaid: { code: `flowchart LR
  A[Idea] --> B[Research] --> C[Interview] --> D[Opportunities] --> E[Prioritize] --> F[Experiment] --> G[Analyze] --> H[Present] --> I[Roadmap]`, cap: 'The nine-stage capstone arc.' },
        mistakes: ['Rushing to a roadmap before validating any opportunity.', "Skipping the interview stage because 'you already know the customer'."],
        reflection: "What idea will you run through your capstone, and what's your scariest assumption about it?"
      }
    ]
  }
]
