export const mondrianSketch = (p) => {
  p.setup = () => {
    p.createCanvas(400, 400);
    p.noLoop();
  };
  p.draw = () => {
    p.background(255);
    p.stroke(0);
    p.strokeWeight(5);
    const colors = ['#ff0000', '#ffff00', '#0000ff', '#ffffff'];
    for (let i = 0; i < 10; i++) {
      const x = p.random(p.width);
      const y = p.random(p.height);
      const w = p.random(p.width - x);
      const h = p.random(p.height - y);
      p.fill(p.random(colors));
      p.rect(x, y, w, h);
    }
  };
};
