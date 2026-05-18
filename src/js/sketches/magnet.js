export const magnetSketch = (p) => {
  const step = 20;
  p.setup = () => {
    p.createCanvas(400, 400);
  };
  p.draw = () => {
    p.background(20);
    p.stroke(200, 100, 255);
    p.strokeWeight(2);
    for (let x = step; x < p.width; x += step) {
      for (let y = step; y < p.height; y += step) {
        const angle = p.atan2(p.mouseY - y, p.mouseX - x);
        p.push();
        p.translate(x, y);
        p.rotate(angle);
        p.line(-10, 0, 10, 0);
        p.pop();
      }
    }
  };
};
