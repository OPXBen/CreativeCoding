export const lSystemSketch = (p) => {
  // --- L-SYSTEM CONFIGURATION ---
  let axiom = "X";
  let sentence = axiom;
  let len = 10; // Length of branch segments (will be randomized in setup)
  let angleMax = 360; // maximum degrees used when creating a random turn

  // Ruleset object defining structural growth
  let rules = {
    "X": "F+[[X]-X]-F[-FX]+X",
    "F": "FF"
  };

  // --- ANIMATION & STEP CONTROL ---
  let currentGen = 0;
  let maxGens = 5;         // The generation limit
  let targetFrameRate = 1; // 1 frame per second to watch it grow step-by-step

  p.setup = () => {
    p.createCanvas(1600, 800);
    // initialize values that depend on the p5 instance
    len = p.random(5, 20);
    angleMax = p.random(360);
    p.frameRate(targetFrameRate);
    p.background(240);
    p.noFill();
    console.log("Starting Randomized L-System Animation Engine...");
    renderTurtle();
  };

  p.draw = () => {
    if (currentGen >= maxGens) {
      console.log("Growth cycle complete. Tree fully matured.");
      p.noLoop();
      return;
    }

    p.background(240);
    generateNext();
    renderTurtle();
  };

  p.updateParams = (params) => {
    // Reset animation state when run button is clicked
    currentGen = 0;
    sentence = axiom;
    p.loop();

    if (params.framesPerUpdate != null) {
      targetFrameRate = params.framesPerUpdate;
      p.frameRate(targetFrameRate);
    }
    if (params.maxGens != null) {
      maxGens = params.maxGens;
    }
    // Apply angle control (degrees) from UI so turns follow the slider
    if (params.angleMax != null) {
      angleMax = params.angleMax;
    }
  };

  function generateNext() {
    let nextSentence = "";

    for (let i = 0; i < sentence.length; i++) {
      let currentChr = sentence.charAt(i);
      if (rules[currentChr] !== undefined) {
        nextSentence += rules[currentChr];
      } else {
        nextSentence += currentChr;
      }
    }

    sentence = nextSentence;
    currentGen++;
    console.log(`Rendering Generation ${currentGen}. Instruction Length: ${sentence.length} characters.`);
  }

  function renderTurtle() {
    p.push();
    p.translate(p.width / 2, p.height);

    for (let i = 0; i < sentence.length; i++) {
      let cmd = sentence.charAt(i);

      if (cmd === "F") {
        p.strokeWeight(p.random(0.75, 5));
        p.stroke(p.random(255), p.random(255), p.random(255), p.random(127, 255));
        p.line(0, 0, 0, -len);
        p.translate(0, -len);
      } else if (cmd === "+") {
        // random turn up to the configured maximum angle
        let a = p.radians(p.random(angleMax));
        p.rotate(a);
      } else if (cmd === "-") {
        let a = p.radians(p.random(angleMax));
        p.rotate(-a);
      } else if (cmd === "[") {
        p.push();
      } else if (cmd === "]") {
        p.pop();
      }
    }

    p.pop();
  }
};