const amountOfFormPoints = 5;
const stepSize = 5;
const initRadius = 200;
const mouseAttract = 0.05;
let centerX, centerY;
let x = [];
let y = [];


function setup() {
  createCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
  const angle = radians(360 / amountOfFormPoints);
  
  for (let i = 0; i < amountOfFormPoints; i++) {
    x.push(cos(angle * i) * initRadius)
    y.push(sin(angle * i) * initRadius)
  }
  
  //styling
  stroke(0, 66);
  strokeWeight(1);
  background(255);
  noFill();
  
}

function draw() {
  
  //float to mouse pos.
  centerX += (mouseX - centerX) * mouseAttract;
  centerY += (mouseY - centerY) * mouseAttract;
  
  //calc new points
  for (let i = 0; i < amountOfFormPoints; i++) {
    x[i] += random(-stepSize, stepSize);
    y[i] += random(-stepSize, stepSize);
    ellipse(x[i] + centerX, y[i] + centerY, 5, 5);
  }
  
  beginShape();
  curveVertex(x[0] + centerX, y[0] + centerY);
  
  for (let i = 0; i < amountOfFormPoints; i++) {
    curveVertex(x[i] + centerX, y[i] + centerY);
  }
  
  curveVertex(x[0] + centerX, y[0] + centerY);
  
  curveVertex(
    x[amountOfFormPoints - 1] + centerX,
    y[amountOfFormPoints - 1] + centerY
  );
  
  endShape();

}

new p5(sketch2);