export const wordCloudSketch = (p) => {
let inputField;
let submitButton;
let rawText = "";
let placedWords = [];

function setup() {
  createCanvas(800, 500);
  colorMode(HSB, 360, 100, 100, 100);
  textFont('Courier New');
  textAlign(CENTER, CENTER);
  
  // Construct DOM Interface elements
  createInterface();
  
  // Initial structural build
  processTextAndGenerateCloud();
}

function draw() {
  background(0); // Deep space backdrop
  
  // Render sequence from pre-calculated coordinates
  for (let w of placedWords) {
    fill(w.color);
    textSize(w.size);
    
    push();
    translate(w.x, w.y);
    if (w.isRotated) {
      rotate(HALF_PI);
    }
    text(w.text, 0, 0);
    pop();
  }
}

function createInterface() {
  // Input Field Configuration
  inputField = createInput('Type your words here');
  inputField.position(20, height + 20);
  inputField.size(560, 30);
  inputField.style('background-color', '#111');
  inputField.style('color', '#00ffcc');
  inputField.style('border', '1px solid #00ffcc');
  inputField.style('font-family', 'Courier New');
  inputField.style('padding', '0 10px');

  // Submit Button Configuration
  submitButton = createButton('PARSE DATA');
  submitButton.position(600, height + 20);
  submitButton.size(180, 30);
  submitButton.style('background-color', '#00ffcc');
  submitButton.style('color', '#000');
  submitButton.style('font-weight', 'bold');
  submitButton.style('font-family', 'Courier New');
  submitButton.style('border', 'none');
  submitButton.style('cursor', 'pointer');
  submitButton.style('margin-left', '5px'); 
  submitButton.style('margin-top', '1px'); 
  
  // Bind execution trigger to button event
  submitButton.mousePressed(processTextAndGenerateCloud);
}

function processTextAndGenerateCloud() {
  // Clear existing telemetry cache
  placedWords = [];
  
  let textData = inputField.value();
  if (!textData.trim()) return;

  // Tokenize and clean raw string entry
  let tokens = textData.toLowerCase().match(/\b[\w\.\-]+(?:\.js)?\b/g);
  if (!tokens) return;

  // Calculate frequency distribution matrix
  let frequencyMap = {};
  for (let token of tokens) {
    frequencyMap[token] = (frequencyMap[token] || 0) + 1;
  }

  // Convert map to sorted data array (Highest frequency shifted to index 0)
  let sortedWords = [];
  for (let key in frequencyMap) {
    // Preserve original casing from input string where possible
    let originalCase = tokens.find(t => t === key) || key;
    sortedWords.push({ text: originalCase, count: frequencyMap[key] });
  }
  sortedWords.sort((a, b) => b.count - a.count);

  // Execute placement loop prioritizing high-frequency metrics
  for (let wordData of sortedWords) {
    // Dynamic Scale Scalar: Base size 18pt + 14pt per registration event
    let dynamicSize = 18 + (wordData.count * 14);
    dynamicSize = min(dynamicSize, 90); // Cap extreme scaling artifacts

    let bounds = calculateBounds(wordData.text, dynamicSize);
    let placed = false;
    let radius = 0;
    let angle = 0;
    
    // Strict priority orientation: Top assets remain horizontal for scanning clarity
    let isRotated = wordData.count > 2 ? false : random(1) < 0.30;
    let w = isRotated ? bounds.h : bounds.w;
    let h = isRotated ? bounds.w : bounds.h;

    // Spiral routing algorithm
    while (!placed && radius < max(width, height)) {
      let x = width / 2 + cos(angle) * radius;
      let y = height / 2 + sin(angle) * radius;

      if (!checkCollision(x, y, w, h, placedWords)) {
        // High frequency keywords receive high-energy neon color values
        let hueValue = wordData.count > 2 ? random(160, 190) : random(200, 240);
        let saturation = wordData.count > 2 ? 100 : 75;
        let brightness = wordData.count > 2 ? 100 : 85;
        
        placedWords.push({
          text: wordData.text,
          size: dynamicSize,
          x: x,
          y: y,
          w: w,
          h: h,
          isRotated: isRotated,
          color: color(hueValue, saturation, brightness)
        });
        placed = true;
      }

      // Density adjustments based on data frequency weight
      angle += 0.10;
      radius += 0.25; 
    }
  }
}

function calculateBounds(txt, sz) {
  textSize(sz);
  return {
    w: textWidth(txt) + 14, // Spatial buffer
    h: sz + 14
  };
}

function checkCollision(x, y, w, h, existing) {
  let leftA = x - w / 2;
  let rightA = x + w / 2;
  let topA = y - h / 2;
  let bottomA = y + h / 2;

  for (let other of existing) {
    let leftB = other.x - other.w / 2;
    let rightB = other.x + other.w / 2;
    let topB = other.y - other.h / 2;
    let bottomB = other.y + other.h / 2;

    if (leftA < rightB && rightA > leftB && topA < bottomB && bottomA > topB) {
      return true;
    }
  }
  return false;
}
}