// 🔹 Core personality dimensions
export const DIMENSIONS = [
  "inclusion",   // social energy
  "control",     // structure / leadership
  "affection",   // emotional orientation
  "thinking",    // analytical vs intuitive
  "flexibility"  // planning vs spontaneity
];

// 🔹 Helper to normalize scoring later
export const createEmptyScores = () => ({
  inclusion: 0,
  control: 0,
  affection: 0,
  thinking: 0,
  flexibility: 0
});

// 🔹 Question Pool (can scale to 30+ later)
export const QUESTIONS = [

  // 🔸 SOCIAL (Inclusion)

  {
    id: "q1",
    text: "You've just joined a new student group at school. During the first meeting…",
    options: [
      { label: "I introduce myself and start conversations", weights: { inclusion: +2 } },
      { label: "I join discussions when invited", weights: { inclusion: +1 } },
      { label: "I mostly listen and observe", weights: { inclusion: -1 } },
      { label: "I avoid interacting unless necessary", weights: { inclusion: -2 } }
    ]
  },

  {
    id: "q2",
    text: "During a school debate, you find yourself…",
    options: [
      { label: "Excited to present arguments", weights: { inclusion: +2, thinking: +1 } },
      { label: "Comfortable when prepared", weights: { inclusion: +1 } },
      { label: "Nervous but willing", weights: { inclusion: -1 } },
      { label: "Prefer supporting others", weights: { inclusion: -2, affection: +1 } }
    ]
  },

  // 🔸 CONTROL

  {
    id: "q3",
    text: "Your professor assigns a group project. You naturally…",
    options: [
      { label: "Take charge and organize everything", weights: { control: +2 } },
      { label: "Help coordinate and contribute", weights: { control: +1 } },
      { label: "Focus on your assigned part", weights: { control: 0 } },
      { label: "Prefer working independently", weights: { control: -2 } }
    ]
  },

  {
    id: "q4",
    text: "When planning your weekend, you prefer to…",
    options: [
      { label: "Have a detailed schedule", weights: { flexibility: -2, control: +1 } },
      { label: "Have a general plan", weights: { flexibility: -1 } },
      { label: "Keep options open", weights: { flexibility: +1 } },
      { label: "Go with the flow", weights: { flexibility: +2 } }
    ]
  },

  // 🔸 THINKING STYLE

  {
    id: "q5",
    text: "You're given a broken device. Your instinct is to…",
    options: [
      { label: "Take it apart to understand it", weights: { thinking: +2 } },
      { label: "Follow guides", weights: { thinking: +1 } },
      { label: "Try different solutions", weights: { flexibility: +1 } },
      { label: "Ask an expert", weights: { thinking: -1 } }
    ]
  },

  {
    id: "q6",
    text: "You discover a concept that challenges you. You…",
    options: [
      { label: "Research deeply", weights: { thinking: +2 } },
      { label: "Compare with what you know", weights: { thinking: +1 } },
      { label: "Accept trusted sources", weights: { thinking: 0 } },
      { label: "Resist unless convinced", weights: { thinking: -2 } }
    ]
  },

  // 🔸 AFFECTION

  {
    id: "q7",
    text: "A friend is struggling. You typically…",
    options: [
      { label: "Listen deeply", weights: { affection: +2 } },
      { label: "Offer solutions", weights: { affection: 0, thinking: +1 } },
      { label: "Show support", weights: { affection: +1 } },
      { label: "Give space", weights: { affection: -2 } }
    ]
  },

  {
    id: "q8",
    text: "In relationships, you prefer…",
    options: [
      { label: "Deep emotional connection", weights: { affection: +2 } },
      { label: "Balanced closeness", weights: { affection: +1 } },
      { label: "Mostly independence", weights: { affection: -1 } },
      { label: "Clear emotional distance", weights: { affection: -2 } }
    ]
  },

  // 🔸 PERFORMANCE STYLE

  {
    id: "q9",
    text: "You're working on a math problem. You feel satisfied when…",
    options: [
      { label: "Elegant logical solution", weights: { thinking: +2 } },
      { label: "You understand the reasoning", weights: { thinking: +1 } },
      { label: "You get the answer fast", weights: { control: +1 } },
      { label: "You complete it", weights: { control: 0 } }
    ]
  },

  {
    id: "q10",
    text: "You're asked to create a presentation. You focus on…",
    options: [
      { label: "Creative visuals", weights: { flexibility: +1 } },
      { label: "Balanced clarity + design", weights: { control: +1 } },
      { label: "Accuracy of data", weights: { thinking: +2 } },
      { label: "Efficiency", weights: { control: -1 } }
    ]
  },

  // 🔸 CAREER / MOTIVATION

  {
    id: "q11",
    text: "At a career fair, you're drawn to…",
    options: [
      { label: "Future technologies", weights: { thinking: +2 } },
      { label: "Real-world solutions", weights: { thinking: +1 } },
      { label: "Helping people", weights: { affection: +2 } },
      { label: "Stable careers", weights: { control: +1 } }
    ]
  },

  // 🔸 TEAM ROLE

  {
    id: "q12",
    text: "In a brainstorming session, you are the one who…",
    options: [
      { label: "Generates ideas", weights: { flexibility: +2 } },
      { label: "Improves ideas", weights: { thinking: +1 } },
      { label: "Evaluates risks", weights: { control: +2 } },
      { label: "Organizes the group", weights: { control: +1 } }
    ]
  },

  // 🔸 SOCIAL VARIANTS

  {
    id: "q13",
    text: "At a social event where you know few people, you…",
    options: [
      { label: "Actively meet new people", weights: { inclusion: +2 } },
      { label: "Talk to a few people", weights: { inclusion: +1 } },
      { label: "Stay with one person", weights: { inclusion: -1 } },
      { label: "Keep to yourself", weights: { inclusion: -2 } }
    ]
  },

  {
    id: "q14",
    text: "In a busy group chat, you usually…",
    options: [
      { label: "Drive conversations", weights: { inclusion: +2 } },
      { label: "Engage when relevant", weights: { inclusion: +1 } },
      { label: "Occasionally respond", weights: { inclusion: -1 } },
      { label: "Mostly observe", weights: { inclusion: -2 } }
    ]
  },

  // 🔸 CONTROL VARIANTS

  {
    id: "q15",
    text: "When deadlines are approaching, you…",
    options: [
      { label: "Take control to ensure completion", weights: { control: +2 } },
      { label: "Help keep things on track", weights: { control: +1 } },
      { label: "Focus on your tasks only", weights: { control: 0 } },
      { label: "Wait for direction", weights: { control: -2 } }
    ]
  },

  {
    id: "q16",
    text: "In uncertain situations, you prefer…",
    options: [
      { label: "Clear structure and plans", weights: { control: +2 } },
      { label: "Some direction with flexibility", weights: { control: +1 } },
      { label: "Freedom to explore", weights: { flexibility: +1 } },
      { label: "No structure at all", weights: { flexibility: +2 } }
    ]
  },

  // 🔸 THINKING VARIANTS

  {
    id: "q17",
    text: "When learning something new, you…",
    options: [
      { label: "Break it down logically", weights: { thinking: +2 } },
      { label: "Understand the general idea", weights: { thinking: +1 } },
      { label: "Learn by doing", weights: { flexibility: +1 } },
      { label: "Rely on others to guide you", weights: { thinking: -1 } }
    ]
  },

  {
    id: "q18",
    text: "When solving problems, you rely more on…",
    options: [
      { label: "Logic and analysis", weights: { thinking: +2 } },
      { label: "Experience", weights: { thinking: +1 } },
      { label: "Trial and error", weights: { flexibility: +1 } },
      { label: "Advice from others", weights: { thinking: -1 } }
    ]
  },

  // 🔸 AFFECTION VARIANTS

  {
    id: "q19",
    text: "When someone shares good news, you…",
    options: [
      { label: "Celebrate enthusiastically", weights: { affection: +2 } },
      { label: "Show support warmly", weights: { affection: +1 } },
      { label: "Acknowledge briefly", weights: { affection: -1 } },
      { label: "Stay neutral", weights: { affection: -2 } }
    ]
  },

  {
    id: "q20",
    text: "When you’re stressed, you prefer…",
    options: [
      { label: "Talking it out with someone", weights: { affection: +2 } },
      { label: "Light support", weights: { affection: +1 } },
      { label: "Handling it alone", weights: { affection: -1 } },
      { label: "Complete independence", weights: { affection: -2 } }
    ]
  },

  // 🔸 FLEXIBILITY VARIANTS

  {
    id: "q21",
    text: "When plans change suddenly, you…",
    options: [
      { label: "Adapt easily", weights: { flexibility: +2 } },
      { label: "Adjust with some effort", weights: { flexibility: +1 } },
      { label: "Feel slightly uncomfortable", weights: { flexibility: -1 } },
      { label: "Prefer sticking to original plan", weights: { flexibility: -2 } }
    ]
  },

  {
    id: "q22",
    text: "Your work style is closer to…",
    options: [
      { label: "Spontaneous and flexible", weights: { flexibility: +2 } },
      { label: "Balanced approach", weights: { flexibility: +1 } },
      { label: "Structured with some flexibility", weights: { control: +1 } },
      { label: "Highly structured", weights: { control: +2 } }
    ]
  },

  // 🔸 DECISION MAKING

  {
    id: "q23",
    text: "When making decisions, you…",
    options: [
      { label: "Analyze all options deeply", weights: { thinking: +2 } },
      { label: "Consider key factors", weights: { thinking: +1 } },
      { label: "Go with what feels right", weights: { affection: +1 } },
      { label: "Decide quickly", weights: { control: -1 } }
    ]
  },

  {
    id: "q24",
    text: "When working in teams, you value most…",
    options: [
      { label: "Clear roles and structure", weights: { control: +2 } },
      { label: "Collaboration and balance", weights: { control: +1 } },
      { label: "Freedom to contribute your way", weights: { flexibility: +1 } },
      { label: "Independence", weights: { inclusion: -1 } }
    ]
  }
];

// 🔹 Combine all question pools
export const ALL_QUESTIONS = [
  ...QUESTIONS
];

// 🔹 Shuffle + pick N questions
export function getRandomQuestions(count = 12) {
  const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}