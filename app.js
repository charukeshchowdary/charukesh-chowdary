const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

const state = {
  stepIndex: 0,
  answers: {},
};

const steps = [
  {
    id: "height",
    prompt: "Hi there! What's your height in centimeters?",
    validate: (value) => {
      const number = Number.parseFloat(value);
      if (!Number.isFinite(number) || number <= 0) {
        return "Please enter a valid height in centimeters (e.g., 170).";
      }
      if (number < 120 || number > 230) {
        return "That height seems unusual. Please double-check the number in centimeters.";
      }
      return null;
    },
  },
  {
    id: "weight",
    prompt: "Thanks! What is your weight in kilograms?",
    validate: (value) => {
      const number = Number.parseFloat(value);
      if (!Number.isFinite(number) || number <= 0) {
        return "Please enter a valid weight in kilograms (e.g., 65).";
      }
      if (number < 35 || number > 200) {
        return "That weight seems unusual. Please double-check the number in kilograms.";
      }
      return null;
    },
  },
  {
    id: "goal",
    prompt:
      "What is your current goal? Type cutting (fat loss), bulking (muscle gain), or maintenance.",
    validate: (value) => {
      const normalized = normalize(value);
      if (["cutting", "bulking", "maintenance"].includes(normalized)) {
        return null;
      }
      return "Please answer with cutting, bulking, or maintenance.";
    },
  },
  {
    id: "activity",
    prompt: "How active are you right now? low, moderate, or high?",
    validate: (value) => {
      const normalized = normalize(value);
      if (["low", "moderate", "high"].includes(normalized)) {
        return null;
      }
      return "Please answer with low, moderate, or high.";
    },
  },
];

function normalize(value) {
  return value.trim().toLowerCase();
}

function addMessage(text, sender) {
  const message = document.createElement("div");
  message.className = `message message--${sender}`;
  message.textContent = text;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function getBmi(heightCm, weightKg) {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

function bmiCategory(bmi) {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

function suggestions({ bmi, goal, activity }) {
  const plan = [];
  const category = bmiCategory(bmi);

  plan.push(`Your BMI is ${bmi.toFixed(1)}, which is considered ${category}.`);

  if (goal === "cutting") {
    plan.push(
      "Focus on a small calorie deficit (10-20%), plenty of protein, and high-fiber foods."
    );
    plan.push("Mix strength training with steady-state cardio 3-5x per week.");
  } else if (goal === "bulking") {
    plan.push(
      "Aim for a slight calorie surplus (5-15%) with protein at every meal and complex carbs."
    );
    plan.push("Prioritize progressive overload strength training 4-5x per week.");
  } else {
    plan.push(
      "Maintain a balanced intake with consistent protein, vegetables, and healthy fats."
    );
    plan.push("Blend strength and mobility training 3-4x per week.");
  }

  if (activity === "low") {
    plan.push("Start with 20-30 minutes of light activity daily to build momentum.");
  } else if (activity === "moderate") {
    plan.push("Keep a consistent weekly routine and add one recovery day.");
  } else {
    plan.push("Include recovery sessions to prevent burnout and support growth.");
  }

  return plan;
}

function resetConversation() {
  state.stepIndex = 0;
  state.answers = {};
  chatWindow.innerHTML = "";
  addMessage(steps[0].prompt, "bot");
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const rawValue = chatInput.value;
  const value = rawValue.trim();
  if (!value) return;

  addMessage(value, "user");
  chatInput.value = "";

  if (normalize(value) === "restart") {
    resetConversation();
    return;
  }

  const step = steps[state.stepIndex];
  const error = step.validate(value);
  if (error) {
    addMessage(error, "bot");
    return;
  }

  state.answers[step.id] = normalize(value);
  state.stepIndex += 1;

  if (state.stepIndex < steps.length) {
    addMessage(steps[state.stepIndex].prompt, "bot");
    return;
  }

  const height = Number.parseFloat(state.answers.height);
  const weight = Number.parseFloat(state.answers.weight);
  const bmi = getBmi(height, weight);

  const recommendations = suggestions({
    bmi,
    goal: state.answers.goal,
    activity: state.answers.activity,
  });

  addMessage("Here is your personalized plan:", "bot");
  recommendations.forEach((line) => addMessage(line, "bot"));
  addMessage("If you'd like to start over, type restart.", "bot");
});

resetConversation();
