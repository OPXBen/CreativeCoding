let r, g, b = 0;
let stroke_weight = 5;
let background_r, background_g, background_b = 0



function setup() {
    createCanvas(400,400);
    
}

function draw(){
  strokeWeight(stroke_weight)
    background(background_r, background_g, background_b);
    for (let i = 0; i <= innerWidth; i += 20){
        stroke(g, b, r);
        line(0, i, width, i);

        stroke(r, g, b);
        line(i, 0, i, height);
    }
}

function mousePressed() {
  r = random(255);
  g = random(255);
  b = random(255);
  stroke_weight = random(10, 50);
  background_r = random(255);
  background_g = random(255);
  background_b = random(255);
}

new p5(sketch1);
