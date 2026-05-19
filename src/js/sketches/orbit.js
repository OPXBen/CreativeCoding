export const orbitSketch = (p) => {

  let amountOfBalls = 20;
  let angle = 0;

  p.setup = () => {
    p.createCanvas(1600, 800);
  };

  p.draw = () => {
    p.background(10, 10, 20, 25);
    p.translate(p.width / 2, p.height / 2);
    p.noStroke();
    for (let i = 0; i < amountOfBalls; i++) {
      const r = 50 + i * 20;
      const x = p.cos(angle * (1 + i * 0.1)) * r;
      const y = p.sin(angle * (1 + i * 0.1)) * r;
      p.fill(100 + i * 20, 150, 255);
      p.circle(x, y, 10);
    }
    angle += 0.02;
  };

  p.updateParams = (params) => {
    if (params.amountOfBalls != null) {
      amountOfBalls = Math.max(1, Math.floor(params.amountOfBalls));
    }
  };
};
