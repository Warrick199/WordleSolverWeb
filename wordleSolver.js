import wordList from './wordlist.json';

let candidates = [...wordList];

// Compute letter frequencies for heuristic
function scoreWord(word, freq) {
  const seen = new Set();
  return [...word].reduce((sum, ch) => {
    if (!seen.has(ch)) {
      seen.add(ch);
      sum += (freq[ch] || 0);
    }
    return sum;
  }, 0);
}

function buildFreq(list) {
  return list.reduce((f, w) => {
    [...w].forEach(ch => f[ch] = (f[ch] || 0) + 1);
    return f;
  }, {});
}

function getBestGuess(list) {
  const freq = buildFreq(list);
  return list
    .map(w => ({w, s: scoreWord(w, freq)}))
    .sort((a,b) => b.s - a.s)[0].w;
}

// Display initial guess
document.addEventListener('DOMContentLoaded', () => {
  const guess = getBestGuess(candidates);
  document.getElementById('first-guess').textContent = guess;
  window.currentGuess = guess;
});

// Process feedback and update candidates
function filterCandidates(yellowGrid, greenGrid) {
  // TODO: implement filtering based on yellow & green positions
}

document.getElementById('feedback-form').addEventListener('submit', e => {
  e.preventDefault();
  const yellow = /* read yellow table inputs */ [];
  const green = /* read green table inputs */ [];
  candidates = filterCandidates(yellow, green, candidates);
  const next = getBestGuess(candidates);
  // append next guess to table
});
