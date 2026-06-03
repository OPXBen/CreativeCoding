export const wordCloudSketch = (p) => {
  let placedWords = [];
  let isGenerated = false;

  p.setup = () => {
    p.createCanvas(1600, 800);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.textFont('Courier New');
    p.textAlign(p.CENTER, p.CENTER);
    
    // Safety Fallback Check: Attempt to read text data passed from the framework controls
    let initialText = p.options?.textInput || p.customControls?.textInput || "";
    
    // If the framework control is blank, we use a hardcoded default string to ensure it renders *something*
    if (!initialText.trim()) {
      initialText = "p5.js react vue wordcloud canvas generator script automation portfolio developer";
    }

    processTextAndGenerateCloud(initialText);
  };

  p.draw = () => {
    p.background(0); // Deep space backdrop
    
    // Dynamic Framework Input Check
    let dynamicText = p.options?.textInput || p.customControls?.textInput || "";
    if (dynamicText && dynamicText !== isGenerated) {
      processTextAndGenerateCloud(dynamicText);
      isGenerated = dynamicText; // Track current state string
    }

    // Render sequence from pre-calculated coordinates
    for (let w of placedWords) {
      p.fill(w.color);
      p.textSize(w.size);
      
      p.push();
      p.translate(w.x, w.y);
      if (w.isRotated) {
        p.rotate(p.HALF_PI);
      }
      p.text(w.text, 0, 0);
      p.pop();
    }
  };

  function processTextAndGenerateCloud(textData) {
    placedWords = [];
    if (!textData.trim()) return;

    // Tokenize and clean raw string entry
    let tokens = textData.toLowerCase().match(/\b[\w\.\-]+(?:\.js)?\b/g);
    if (!tokens) return;

    // Calculate frequency distribution matrix
    let frequencyMap = {};
    for (let token of tokens) {
      frequencyMap[token] = (frequencyMap[token] || 0) + 1;
    }

    // Convert map to sorted data array
    let sortedWords = [];
    for (let key in frequencyMap) {
      let originalCase = tokens.find(t => t === key) || key;
      sortedWords.push({ text: originalCase, count: frequencyMap[key] });
    }
    sortedWords.sort((a, b) => b.count - a.count);

    // Execute placement loop prioritizing high-frequency metrics
    for (let wordData of sortedWords) {
      let dynamicSize = 18 + (wordData.count * 14);
      dynamicSize = p.min(dynamicSize, 90); // Prefixed correctly

      let bounds = calculateBounds(wordData.text, dynamicSize);
      let placed = false;
      let radius = 0;
      let angle = 0;
      
      let isRotated = wordData.count > 2 ? false : p.random(1) < 0.30;
      let w = isRotated ? bounds.h : bounds.w;
      let h = isRotated ? bounds.w : bounds.h;

      // Spiral routing algorithm
      while (!placed && radius < p.max(p.width, p.height)) {
        let x = p.width / 2 + p.cos(angle) * radius;
        let y = p.height / 2 + p.sin(angle) * radius;

        if (!checkCollision(x, y, w, h, placedWords)) {
          let hueValue = wordData.count > 2 ? p.random(160, 190) : p.random(200, 240);
          let saturation = wordData.count > 2 ? 100 : 75;
          let brightness = wordData.count > 2 ? 100 : 85;
          
          // CRITICAL CORRECTION: Bound color instantiation directly to instance 'p.'
          placedWords.push({
            text: wordData.text,
            size: dynamicSize,
            x: x,
            y: y,
            w: w,
            h: h,
            isRotated: isRotated,
            color: p.color(hueValue, saturation, brightness)
          });
          placed = true;
        }

        angle += 0.10;
        radius += 0.25; 
      }
    }
  }

  function calculateBounds(txt, sz) {
    p.textSize(sz); // Fixed: Target to instance
    return {
      w: p.textWidth(txt) + 14, // Fixed: Target to instance
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
};