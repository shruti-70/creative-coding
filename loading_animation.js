let t = 0;

function setup() {
  createCanvas(600, 600);
  rectMode(CENTER);
  noFill();
  stroke(255);
  strokeWeight(1.5);
}

function draw() {
  background(20, 30, 60, 40); // slight trail

  translate(width / 2, height / 2);

  let layers = 6;
  let step = 30;

  for (let i = 1; i <= layers; i++) {
    let radius = i * step + sin(t + i) * 5;
    let count = 6 + i * 2; // number of elements per ring
    let alpha = map(sin(t + i), -1, 1, 50, 255);
    stroke(100 + i * 20, 200 - i * 15, 255, alpha);

    for (let j = 0; j < count; j++) {
      let angle = (TWO_PI / count) * j + t * 0.5 * (i % 2 == 0 ? 1 : -1);
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      let s = 10 + 5 * sin(t * 2 + j);

      push();
      translate(x, y);
      rotate(angle + t);
      rect(0, 0, s, s);
      pop();
    }
  }

  t += 0.02;
}
