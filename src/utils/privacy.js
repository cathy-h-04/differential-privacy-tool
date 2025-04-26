export function addLaplaceNoise(value, epsilon) {
  const scale = 1 / epsilon;
  const u = Math.random() - 0.5;
  return value - scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
}

export function randomizedResponseBinned(trueBin, epsilon, numBins) {
  const p = Math.exp(epsilon) / (Math.exp(epsilon) + numBins - 1);
  if (Math.random() < p) return trueBin;
  const other = [...Array(numBins).keys()].filter((b) => b !== trueBin);
  return other[Math.floor(Math.random() * other.length)];
}

export function exponentialRandomNoise(trueBin, epsilon, numBins) {
  const centerBins = [10000, 30000, 50000, 80000, 150000, 250000, 350000, 450000, 750000];
  const actual = centerBins[trueBin];
  const sensitivity = Math.max(...centerBins) - Math.min(...centerBins);
  const scores = centerBins.map((v) => Math.exp((-epsilon * Math.abs(v - actual)) / sensitivity));
  const total = scores.reduce((sum, s) => sum + s, 0);
  const probs = scores.map((s) => s / total);
  let r = Math.random();
  for (let i = 0; i < probs.length; i++) {
    r -= probs[i];
    if (r <= 0) return i;
  }
  return probs.length - 1;
} 