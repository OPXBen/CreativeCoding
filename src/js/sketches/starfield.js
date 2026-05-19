export const starfieldSketch = (p) => {
  let stars = [];
  const count = 400;
  let maxStarSize = 8;

  p.setup = () => {
    p.createCanvas(1600, 800);
    for (let i = 0; i < count; i++) {
      const color = [
        p.random(255),
        p.random(255),
        p.random(255),
        p.random(127, 255)
      ];
      stars.push({
        x: p.random(-p.width, p.width),
        y: p.random(-p.height, p.height),
        z: p.random(p.width),
        pz: 0,
        color
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
        s.color = [
          p.random(255),
          p.random(255),
          p.random(255),
          p.random(127, 255)
        ];
      }
      const sx = p.map(s.x / s.z, 0, 1, 0, p.width);
      const sy = p.map(s.y / s.z, 0, 1, 0, p.height);
      const r = p.map(s.z, 0, p.width, maxStarSize, 0);
      p.fill(...s.color);
      p.noStroke();
      p.ellipse(sx, sy, r, r);
      
      const px = p.map(s.x / s.pz, 0, 1, 0, p.width);
      const py = p.map(s.y / s.pz, 0, 1, 0, p.height);
      s.pz = s.z;
      p.stroke(s.color[0], s.color[1], s.color[2], s.color[3] * 0.6);
      p.line(px, py, sx, sy);
    });
  };

  p.updateParams = (params) => {
    if (params.maxStarSize != null) {
      maxStarSize = Math.max(1, params.maxStarSize);
    }
  };
};
