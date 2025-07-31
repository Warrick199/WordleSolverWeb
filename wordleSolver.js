// wordleSolver.js

// Key for localStorage persistence
const STORAGE_KEY = "wordleSolverState";

// 1) Load word lists from JSON
let solutions = [];
let validWords = [];
async function loadWordLists() {
  const errDiv = document.getElementById('error');
  errDiv.textContent = '';
  try {
    const resp = await fetch('words.json');
    if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
    const data = await resp.json();
    solutions  = data.solutions.map(w => w.toUpperCase());
    validWords = data.validWords.map(w => w.toUpperCase());
  } catch (err) {
    console.error('loadWordLists error:', err);
    errDiv.textContent = 'Error loading words.json: ' + err.message;
  }
}

// 2) Save/Load UI state to localStorage
function saveState() {
  const rows = Array.from(document.querySelectorAll('.row'));
  const state = rows.map(r => ({
    guess: Array.from(r.querySelectorAll('.guess')).map(i => i.value.toUpperCase()),
    green: Array.from(r.querySelectorAll('.green')).map(i => i.value.toUpperCase()),
    yellow: Array.from(r.querySelectorAll('.yellow')).map(i => i.value.toUpperCase()),
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const state = JSON.parse(raw);
    const rows = document.querySelectorAll('.row');
    state.forEach((rowState, idx) => {
      if (idx >= rows.length) return;
      const row = rows[idx];
      rowState.guess.forEach((v,i) => row.querySelectorAll('.guess')[i].value = v);
      rowState.green.forEach((v,i) => row.querySelectorAll('.green')[i].value = v);
      rowState.yellow.forEach((v,i) => row.querySelectorAll('.yellow')[i].value = v);
    });
  } catch (err) {
    console.error('loadState error:', err);
  }
}

// 3) Filtering & scoring logic
function applyFilter(possible, guess, greens, yellows) {
  const greySet = new Set();
  for (let i = 0; i < 5; i++) {
    const L = guess[i];
    if (!greens.includes(L) && !yellows.includes(L)) greySet.add(L);
  }
  return possible.filter(w => {
    for (let i = 0; i < 5; i++) {
      if (greens[i] && w[i] !== greens[i]) return false;
      if (yellows[i]) {
        if (!w.includes(yellows[i]) || w[i] === yellows[i]) return false;
      }
    }
    for (let g of greySet) if (w.includes(g)) return false;
    return true;
  });
}

function scoreAndSort(words) {
  const freq = {};
  words.forEach(w => new Set(w).forEach(l => freq[l] = (freq[l]||0) + 1));
  const scored = words.map(w => {
    let s = 0;
    new Set(w).forEach(l => s += freq[l]);
    return { w, s };
  });
  scored.sort((a,b) => b.s - a.s);
  return scored.map(o => o.w);
}

function solveWordle(guesses, greensList, yellowsList) {
  let possible = [...solutions];
  guesses.forEach((g,i) => {
    possible = applyFilter(possible, g, greensList[i], yellowsList[i]);
  });
  if (possible.length === 0) {
    possible = [...validWords];
    guesses.forEach((g,i) => {
      possible = applyFilter(possible, g, greensList[i], yellowsList[i]);
    });
  }
  if (possible.length === 0) {
    document.getElementById('error').textContent =
      "No possible words remain—check your feedback.";
    return ["", []];
  }
  const sorted = scoreAndSort(possible);
  return [ sorted[0], sorted.slice(0,5) ];
}

// 4) Wire UI, auto-fill, and persistence
window.addEventListener('DOMContentLoaded', async () => {
  await loadWordLists();
  loadState();

  const runBtn  = document.getElementById('run');
  const outTop5 = document.getElementById('top5');

  runBtn.addEventListener('click', () => {
    // Gather guesses & feedback
    const rows = Array.from(document.querySelectorAll('.row'));
    const guesses = [], greensList = [], yellowsList = [];
    rows.forEach(r => {
      const g = Array.from(r.querySelectorAll('.guess')).map(i=>i.value.toUpperCase()).join('');
      if (g.length === 5) {
        guesses.push(g);
        greensList.push(Array.from(r.querySelectorAll('.green')).map(i=>i.value.toUpperCase()));
        yellowsList.push(Array.from(r.querySelectorAll('.yellow')).map(i=>i.value.toUpperCase()));
      }
    });

    // Solve & auto-fill next guess row
    const [nextGuess, top5] = solveWordle(guesses, greensList, yellowsList);
    const nextRow = rows[guesses.length];
    if (nextRow && nextGuess) {
      nextGuess.split('').forEach((L,i) => {
        nextRow.querySelectorAll('.guess')[i].value = L;
      });
    }

    // Render Top 5 list
    outTop5.innerHTML = '';
    top5.forEach(w => {
      const p = document.createElement('p');
      p.textContent = w;
      outTop5.appendChild(p);
    });

    // Persist inputs
    saveState();
  });
});
