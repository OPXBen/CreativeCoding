export const starfieldSketch = (p) => {
  let stars = [];
  const count = 400;
  p.setup = () => {
    p.createCanvas(400, 400);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: p.random(-p.width, p.width),
        y: p.random(-p.height, p.height),
        z: p.random(p.width),
        pz: 0
      });
      stars[i].pz = stars[i].z;
    }
  };
  p.draw = () => {
    p.background(0);
    p.translate(p.width / 2, p.height / 2);
    stars.forEach(s => {
      s.z -= 5;
      if (s.z < 1) {
        s.z = p.width;
        s.x = p.random(-p.width, p.width);
        s.y = p.random(-p.height, p.height);
        s.pz = s.z;
      }
      const sx = p.map(s.x / s.z, 0, 1, 0, p.width);
      const sy = p.map(s.y / s.z, 0, 1, 0, p.height);
      const r = p.map(s.z, 0, p.width, 8, 0);
      p.fill(255);
      p.noStroke();
      p.ellipse(sx, sy, r, r);
      
      const px = p.map(s.x / s.pz, 0, 1, 0, p.width);
      const py = p.map(s.y / s.pz, 0, 1, 0, p.height);
      s.pz = s.z;
      p.stroke(255, 150);
      p.line(px, py, sx, sy);
    });
  };
};
