export const markovChainSketch = (p) => {
  // --- CONFIGURATION ---
  let sourceText = "the cat sat on the mat and the dog sat on the rug while the cat looked at the fish and the dog looked at the cat";
  let markovChain = {};
  let words = [];

  // ---  RANDOMNESS  ---
  let fontS;
  let R, G, B, A;

  // --- GENERATION TRACKERS ---
  let currentWord;
  let generatedStory = "";
  let wordCount = 0;
  let maxWords = 160; // Stop after 160 words

  p.setup = () => {
    p.createCanvas(1200, 800);
    p.background(245);

    fontS = p.random(15, 50);
    R = p.random(255);
    G = p.random(255);
    B = p.random(255);
    A = p.random(127, 255);

    // Set the typing speed (x words per second)
    p.frameRate(10);

    // Clean and split source text into individual token words
    let cleanText = sourceText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "").toLowerCase();
    words = p.splitTokens(cleanText, ' ');

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
    currentWord = p.random(words);
    generatedStory = currentWord;

    // Style text formatting
    p.textFont('Courier New');
    p.textSize(fontS);
    p.fill(R, G, B, A);
  };

  p.draw = () => {
    // Clear screen to redraw the updating string nicely
    p.background(205);

    // Title Header
    p.push();
    p.fill(120);
    p.textSize(20);
    p.text("LIVE MARKOV GENERATOR (TYPING ONE WORD PER FRAME):", 40, 50);
    p.pop();

    // Draw the currently accumulated story with automatic text-wrapping boundaries
    p.text(generatedStory + "_", maxWords, 100, p.width - 500, p.height - 150);

    // Check if we hit our word limit safety switch
    if (wordCount >= maxWords) {
      p.noLoop();
      return;
    }

    // Get next options array for the current active token
    let possibilities = markovChain[currentWord];

    if (possibilities && possibilities.length > 0) {
      let nextWord = p.random(possibilities);
      generatedStory += " " + nextWord;
      currentWord = nextWord;
    } else {
      // Pick fresh jumpstart seed if we wander into a terminal text branch
      let nextWord = p.random(words);
      generatedStory += " " + nextWord;
      currentWord = nextWord;
    }

    wordCount++;
  };
};