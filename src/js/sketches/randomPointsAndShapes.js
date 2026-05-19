export const randomPointsAndShapesSketch = (p) => {
  // --- Parameters managed by the runner ---
  let maxGens = 3;
  let pointsPerGen = 15;

  let currentGen = 1;    
  let R, G, B, A;
  let generations = {}; 

  // Function to receive updates from the UI
  p.updateParams = (params) => {
    if (params.maxGens) maxGens = params.maxGens;
    if (params.pointsPerGen) pointsPerGen = params.pointsPerGen;
    p.restart();
  };

  p.restart = () => {
    currentGen = 1;
    generations = {};
    p.background(20, 20, 20);
    
    generations[1] = [];
    for (let i = 0; i < pointsPerGen; i++) {
      let startX = p.random(p.width);
      let startY = p.random(p.height);
      generations[1].push({ x: startX, y: startY });
    }
    p.loop();
  };

  const randomizeColor = () => {
    R = p.random(255);
    G = p.random(255);
    B = p.random(255);
    A = p.random(127, 255); 
  };

  // ===================================================
  // ROUND 1: EDGE RULES
  // ===================================================
  const runRound1EdgeRules = (pointsArray) => {
    for (let pt of pointsArray) {
      let distLeft = pt.x;
      let distRight = p.width - pt.x;
      let distTop = pt.y;
      let distBottom = p.height - pt.y;

      if (distTop < distBottom && distTop < 100) {
        randomizeColor(); 
        p.stroke(R, G, B, A); 
        p.strokeWeight(p.random(1, 3));
        p.line(pt.x, pt.y, pt.x, 0);
        p.ellipse(pt.x, pt.y, 30); 
      } 
      else if (distLeft > 200 && distRight > 200 && distTop > 200 && distBottom > 200) {
        randomizeColor(); 
        p.stroke(R, G, B, A); 
        p.strokeWeight(p.random(0.5, 2));
        p.circle(pt.x, pt.y, p.random(40, 120));
      }
      else if (distLeft < distRight) {
        randomizeColor(); 
        p.stroke(R, G, B, A); 
        p.strokeWeight(p.random(1, 4));
        p.rect(pt.x, pt.y, -distLeft, p.random(10, 30)); 
      }
      else {
        randomizeColor(); 
        p.stroke(R, G, B, A); 
        p.strokeWeight(p.random(1, 2));
        let size = p.random(5, 15);
        p.line(pt.x - size, pt.y, pt.x + size, pt.y);
        p.line(pt.x, pt.y - size, p.x, pt.y + size);
      }

      randomizeColor(); 
      p.stroke(R, G, B, A);
      p.strokeWeight(p.random(5, 10)); 
      p.point(pt.x, pt.y);
    }
  };

  // ===================================================
  // ROUND 2: CONNECTIONS & SPAWNING
  // ===================================================
  const runRound2AndSpawnNext = (currentPoints, nextPointsArray) => {
    for (let i = 0; i < currentPoints.length; i++) {
      for (let j = i + 1; j < currentPoints.length; j++) {
        
        let p1 = currentPoints[i];
        let p2 = currentPoints[j];
        let d = p.dist(p1.x, p1.y, p2.x, p2.y);
        
        let lineDrawn = false;

        if (d < 80) {
          randomizeColor(); 
          p.stroke(R, G, B, A); 
          p.strokeWeight(p.random(1.5, 4));
          p.line(p1.x, p1.y, p2.x, p2.y);
          lineDrawn = true;
        }
        else if (d > 100 && d < 250) {
          randomizeColor(); 
          p.stroke(R, G, B, A); 
          p.strokeWeight(p.random(0.25, 1));
          let midX = (p1.x + p2.x) / 2;
          let midY = (p1.y + p2.y) / 2;
          p.circle(midX, midY, d / p.random(2, 3));
        }
        else if (d > 400) {
          randomizeColor(); 
          p.stroke(R, G, B, A); 
          p.strokeWeight(p.random(0.1, 0.5));
          p.line(p1.x, p1.y, p2.x, p2.y);
          lineDrawn = true;
        }

        if (lineDrawn) {
          // Cap max spawned children slightly so late-game generations don't crowd the canvas
          let spawnCount = p.floor(p.random(0, 2)); 
          
          for (let k = 0; k < spawnCount; k++) {
            let pct = p.random(0.1, 0.9); 
            let childX = p.lerp(p1.x, p2.x, pct);
            let childY = p.lerp(p1.y, p2.y, pct);
            
            nextPointsArray.push({ x: childX, y: childY });
          }
        }
      }
    }
  };

  p.setup = () => {
    // We use a fixed size but could also use container dimensions
    // For general compatibility across the app's gallery, 600x600 is safe
    p.createCanvas(600, 600);
    p.background(20, 20, 20); // Darker background to match the theme
    p.noFill();
    
    // Set a comfortable frame rate so you can watch each generation grow
    p.frameRate(5); 
    
    // 1. Initialize Generation 1 points
    generations[1] = [];
    for (let i = 0; i < pointsPerGen; i++) {
      let startX = p.width - p.random(0, p.width);
      let startY = p.height - p.random(0, p.height);
      generations[1].push({ x: startX, y: startY });
    }
  };

  p.draw = () => {
    // If we have processed all allowed generations, shut down the engine cleanly
    if (currentGen > maxGens) {
      p.noLoop();
      return;
    }
    
    // Step A: Run Round 1 (Edge Rules) for the active frame's generation
    runRound1EdgeRules(generations[currentGen]);
    
    // Step B: If there is a next generation, prepare its points using Round 2 Rules
    if (currentGen < maxGens) {
      let nextGenIdx = currentGen + 1;
      generations[nextGenIdx] = [];
      
      runRound2AndSpawnNext(generations[currentGen], generations[nextGenIdx]);
      
      // Safety check: If no lines were drawn and no points spawned, stop to prevent empty loops
      if (generations[nextGenIdx].length === 0) {
        p.noLoop();
        return;
      }
    }
    
    // Advance the generation tracker by ONE step per frame
    currentGen++; 
  };
};
