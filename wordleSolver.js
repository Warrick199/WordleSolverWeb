// wordleSolver.js
// Replicates the Excel VBA WordleSolver logic.
// You must populate the wordsA and wordsB arrays with your word lists.

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('solve-btn').addEventListener('click', solveWordle);
});

const wordsA = [
  /* Paste your “solutions” list here (one word per element, uppercase),
     corresponding to column A in your Words sheet. */
];

const wordsB = [
  /* Paste your full valid-word list here (one word per element, uppercase),
     corresponding to column B in your Words sheet. */
];

function solveWordle() {
  const get = id => document.getElementById(id).value.trim().toUpperCase();
  const set = (id, val) => { document.getElementById(id).value = val; };
  const seed = 'CRANE';

  // First run: seed CRANE if no guess in row 1 yet
  if (!get('guess-1-1')) {
    // Clear Top-5
    for (let r = 1; r <= 5; r++) {
      for (let c = 1; c <= 5; c++) {
        set(`top${r}-${c}`, '');
      }
    }
    // Seed row 1 guess & top-1
    for (let i = 0; i < 5; i++) {
      set(`guess-1-${i+1}`, seed[i]);
      set(`top1-${i+1}`, seed[i]);
    }
    return;
  }

  // Determine last used guess row
  let guessRow = 1;
  for (let r = 1; r <= 6; r++) {
    if (get(`guess-${r}-1`)) guessRow = r;
    else break;
  }
  const outRow = guessRow + 1;
  if (outRow > 6) {
    alert('No more rows available for guesses.');
    return;
  }

  // Build & filter candidate list
  let possible = wordsA.slice();
  filterPossible(possible, guessRow);
  if (possible.length === 0) {
    possible = wordsB.slice();
    filterPossible(possible, guessRow);
  }
  if (possible.length === 0) {
    alert('No possible words remain – please check your feedback inputs.');
    return;
  }

  // Score by letter frequency
  const freq = {};
  possible.forEach(w => {
    new Set(w).forEach(l => { freq[l] = (freq[l] || 0) + 1; });
  });
  const scored = possible.map(w => {
    const seen = new Set();
    let score = 0;
    w.split('').forEach(l => {
      if (!seen.has(l)) {
        score += freq[l];
        seen.add(l);
      }
    });
    return { word: w, score };
  }).sort((a, b) => b.score - a.score);

  // Write next guess
  const next = scored[0].word;
  for (let i = 0; i < 5; i++) {
    set(`guess-${outRow}-${i+1}`, next[i]);
  }

  // Update Top-5
  for (let r = 1; r <= 5; r++) {
    for (let c = 1; c <= 5; c++) {
      set(`top${r}-${c}`, '');
    }
  }
  scored.slice(0, 5).forEach((o, idx) => {
    o.word.split('').forEach((l, i) => {
      set(`top${idx+1}-${i+1}`, l);
    });
  });
}

function filterPossible(arr, uptoRow) {
  for (let r = 1; r <= uptoRow; r++) {
    // Read guess
    let guess = '';
    for (let i = 1; i <= 5; i++) {
      guess += document.getElementById(`guess-${r}-${i}`).value.trim().toUpperCase();
    }
    // Read feedback
    const greens = [], yellows = [];
    for (let i = 1; i <= 5; i++) {
      greens[i]  = document.getElementById(`green-${r}-${i}`).value.trim().toUpperCase();
      yellows[i] = document.getElementById(`yellow-${r}-${i}`).value.trim().toUpperCase();
    }
    // Determine grey letters
    const greys = new Set();
    [...guess].forEach((l, i) => {
      if (l && !greens.includes(l) && !yellows.includes(l)) {
        greys.add(l);
      }
    });
    // Filter backwards
    for (let k = arr.length - 1; k >= 0; k--) {
      const w = arr[k], letters = w.split('');
      let keep = true;
      // Greens
      for (let i = 1; i <= 5; i++) {
        if (greens[i] && letters[i-1] !== greens[i]) { keep = false; break; }
      }
      if (!keep) { arr.splice(k, 1); continue; }
      // Yellows
      for (let i = 1; i <= 5; i++) {
        if (yellows[i]) {
          if (!w.includes(yellows[i]) || letters[i-1] === yellows[i]) {
            keep = false; break;
          }
        }
      }
      if (!keep) { arr.splice(k, 1); continue; }
      // Greys
      greys.forEach(g => {
        if (keep && w.includes(g)) keep = false;
      });
      if (!keep) arr.splice(k, 1);
    }
  }
}
