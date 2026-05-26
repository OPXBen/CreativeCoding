export const markovChainSketch = (p) => {
    // --- CONFIGURATION ---
let sourceText = "./markovChainText/shakespeare.txt"; // Path to source text file (can be changed to any text source you like)
let markovChain = {};
let words = [];

// ---  RANDOMNESS  ---
let fontS;
let R, G, B, A

// --- GENERATION TRACKERS ---
let currentWord;
let generatedStory = "";
let wordCount = 0;
let maxWords = 160; // Stop after 40 words

function setup() {
  createCanvas(1600, 800);
  background(245);
  
  fontS = random(15, 50);
  R = random(255);
  G = random(255);
  B = random(255);
  A = random(127, 255);
  
  // Set the typing speed (5 words per second)
  frameRate(5);
  
  // Clean and split source text into individual token words
  let cleanText = sourceText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "").toLowerCase();
  words = splitTokens(cleanText, ' ');

  // Build Markov chain dictionary map
  for (let i = 0; i < words.length - 1; i++) {
    let current = words[i];
    let next = words[i + 1];

    if (!markovChain[current]) {
      markovChain[current] = [];
    }
    markovChain[current].push(next);
  }

  // Pick a random starting word
  currentWord = random(words);
  generatedStory = currentWord;
  
  // Style text formatting
  textFont('Courier New');
  textSize(fontS);
  fill(R, G, B, A);
}

function draw() {
  // Clear screen to redraw the updating string nicely
  background(205);
  
  // Title Header
  push();
  fill(120);
  textSize(20);
  text("LIVE MARKOV GENERATOR (TYPING ONE WORD PER FRAME):", 40, 50);
  pop();

  // Draw the currently accumulated story with automatic text-wrapping boundaries
  text(generatedStory + "_", 40, 100, width - 80, height - 150);

  // Check if we hit our word limit safety switch
  if (wordCount >= maxWords) {
    noLoop();
    return;
  }

  // Get next options array for the current active token
  let possibilities = markovChain[currentWord];

  if (possibilities && possibilities.length > 0) {
    let nextWord = random(possibilities);
    generatedStory += " " + nextWord;
    currentWord = nextWord;
  } else {
    // Pick fresh jumpstart seed if we wander into a terminal text branch
    let nextWord = random(words);
    generatedStory += " " + nextWord;
    currentWord = nextWord;
  }

  wordCount++;
}
}