// wordleSolver.js

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

// 2) Filtering & scoring logic
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
    for (let g of greySet) {
      if (w.includes(g)) return false;
    }
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

// 3) Wire to the page & auto-fill next row
document.addEventListener("DOMContentLoaded", async () => {
  await loadWordLists();

  const runBtn  = document.getElementById("run");
  const outTop5 = document.getElementById("top5");

  runBtn.addEventListener("click", () => {
    // Gather existing guesses & feedback
    const rows = Array.from(document.querySelectorAll(".row"));
    const guesses     = [];
    const greensList  = [];
    const yellowsList = [];

    rows.forEach(r => {
      const letters = Array.from(r.querySelectorAll(".guess"))
                           .map(i=>i.value.toUpperCase()).join("");
      if (letters.length === 5) {
        guesses.push(letters);
        greensList.push(
          Array.from(r.querySelectorAll(".green")).map(i=>i.value.toUpperCase())
        );
        yellowsList.push(
          Array.from(r.querySelectorAll(".yellow")).map(i=>i.value.toUpperCase())
        );
      }
    });

    // Solve
    const [nextGuess, top5] = solveWordle(guesses, greensList, yellowsList);

    // Auto-fill the next blank row's guess inputs
    const nextRow = rows[guesses.length];
    if (nextRow && nextGuess) {
      const inputs = nextRow.querySelectorAll(".guess");
      nextGuess.split("").forEach((L,i) => { inputs[i].value = L; });
    }

    // Render Top 5
    outTop5.innerHTML = "";
    top5.forEach(w => {
      const p = document.createElement("p");
      p.textContent = w;
      outTop5.appendChild(p);
    });
  });
});
