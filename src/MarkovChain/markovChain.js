const map = new Map();

function setup() {
  map.set("start", ["Das", "Sie", "Das", "Der"]);
  map.set("Das", ["ist", "ist", "ist", "ist"]);
  map.set("ist", ["meine", "toll", "mein", "spassig"]);
  map.set("meine", ["Katze", "Katze", "Katze", "Katze"]);
  map.set("Katze", [".", ".", ".", "."]);
  map.set(".", ["Sie", "Das", "Der"]);
  map.set("Sie", ["ist", "ist", "ist", "ist"]);
  map.set("toll", [".", ".", ".", "."]);
  map.set("mein", ["Hund", "Hund", "Hund", "Hund"]);
  map.set("Hund", [".", ".", ".", "."]);
  map.set("Der", ["ist", "ist", "ist", "ist"]);
  map.set("spassig", [".", ".", ".", "."]);

  let state = "start";
  let sentence = [];

  for (let i = 0; i < 150; i++) {
    let options = map.get(state);
    state = random(options);

    sentence.push(state);
  }

  console.log(sentence.join(" "));
}