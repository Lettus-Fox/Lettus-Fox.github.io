let racerXs = [0, 4, 8];
let moves = [7, 4, 2];

for (let round = 1; round <= 3; round++) {
  for (let i = 0; i < racerXs.length; i++) {
    racerXs[i] += moves[i];
    if (racerXs[i] > 12) {
      moves[round - 1] -= 1;
    }
  }
}

console.log("Positions:", racerXs);
console.log("Moves:", moves);