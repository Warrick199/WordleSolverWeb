// wordleSolver.js

// ─────────── Load word lists from JSON ───────────
let solutions = [], validWords = [];
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
    document.getElementById('error').textContent = 'Error loading words.json: ' + err.message;
  }
}

// ─────────── Filter & scoring logic ───────────
function applyFilter(possible, guess, greens, yellows) {
  const greySet = new Set();
  for (let i = 0; i < 5; i++) {
    const L = guess[i];
    if (!greens.includes(L) && !yellows.includes(L)) greySet.add(L);
  }
  return possible.filter(w => {
    for (let i = 0; i < 5; i++) {
      if (greens[i] && w[i] !== greens[i]) return false;
      if (yellows[i] && (!w.includes(yellows[i]) || w[i] === yellows[i])) return false;
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
  guesses.forEach((g,i) => possible = applyFilter(possible, g, greensList[i], yellowsList[i]));
  if (possible.length === 0) {
    possible = [...validWords];
    guesses.forEach((g,i) => possible = applyFilter(possible, g, greensList[i], yellowsList[i]));
  }
  if (possible.length === 0) {
    document.getElementById('error').textContent = 'No possible words remain—check your feedback.';
    return ["", []];
  }
  const sorted = scoreAndSort(possible);
  return [ sorted[0], sorted.slice(0,5) ];
}

// ─────────── Wire to HTML tables & buttons ───────────
document.addEventListener('DOMContentLoaded', async () => {
  await loadWordLists();

  const runBtn       = document.getElementById('run');
  const clearBtn     = document.getElementById('clear');
  const greenTbody   = document.querySelector('#greenTable tbody');
  const yellowTbody  = document.querySelector('#yellowTable tbody');
  const guessesTbody = document.querySelector('#guessesTable tbody');
  const next5Tbody   = document.querySelector('#next5Table tbody');
  const errDiv       = document.getElementById('error');

  runBtn.addEventListener('click', () => {
    errDiv.textContent = '';

    // Read past guesses from table
    const pastGuesses = Array.from(guessesTbody.querySelectorAll('tr')).map(tr =>
      Array.from(tr.querySelectorAll('td')).map(td => td.textContent).join('')
    );

    // Read feedback for each past guess
    const greensList = [];
    const yellowsList = [];
    const greenRows = greenTbody.querySelectorAll('tr');
    const yellowRows = yellowTbody.querySelectorAll('tr');
    pastGuesses.forEach((_, i) => {
      greensList.push(
        Array.from(greenRows[i].querySelectorAll('input')).map(inp => inp.value.toUpperCase())
      );
      yellowsList.push(
        Array.from(yellowRows[i].querySelectorAll('input')).map(inp => inp.value.toUpperCase())
      );
    });

    // Solve
    const [nextGuess, top5] = solveWordle(pastGuesses, greensList, yellowsList);
    if (!nextGuess) return;

    // Append nextGuess to guessesTable
    const rowNum = pastGuesses.length + 1;
    const tr = document.createElement('tr');
    // first cell = row number
    const th = document.createElement('th'); th.textContent = rowNum; tr.appendChild(th);
    // letter cells
    nextGuess.split('').forEach(letter => {
      const td = document.createElement('td'); td.textContent = letter; tr.appendChild(td);
    });
    guessesTbody.appendChild(tr);

    // Populate NEXT 5 GUESSES table
    next5Tbody.innerHTML = '';
    top5.forEach((word, idx) => {
      const tr2 = document.createElement('tr');
      const th2 = document.createElement('th'); th2.textContent = idx + 1; tr2.appendChild(th2);
      word.split('').forEach(letter => {
        const td = document.createElement('td'); td.textContent = letter; tr2.appendChild(td);
      });
      next5Tbody.appendChild(tr2);
    });
  });

  clearBtn.addEventListener('click', () => {
    // Clear guess tables and feedback
    guessesTbody.innerHTML = '';
    next5Tbody.innerHTML = '';
    greenTbody.querySelectorAll('input').forEach(inp => inp.value = '');
    yellowTbody.querySelectorAll('input').forEach(inp => inp.value = '');
    errDiv.textContent = '';
  });
});
