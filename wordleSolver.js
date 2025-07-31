// wordleSolver.js

// ─────────── 1) Load word lists from JSON ───────────
let solutions = [];
let validWords = [];

async function loadWordLists() {
  const errDiv = document.getElementById('error');
  errDiv.textContent = '';          // clear any old error
  try {
    const resp = await fetch('words.json');
    if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
    const text = await resp.text();
    const data = JSON.parse(text);
    solutions  = data.solutions.map(w => w.toUpperCase());
    validWords = data.validWords.map(w => w.toUpperCase());
  } catch (err) {
    console.error('loadWordLists error:', err);
    errDiv.textContent = 'Error loading words.json: ' + err.message;
  }
}

// ─────────── 2) Filtering & scoring ───────────

// Filter “possible” by one guess + its green/yellow feedback
function applyFilter(possible, guess, greens, yellows) {
  // build grey set = letters guessed but neither green nor yellow
  const greySet = new Set();
  for (let i = 0; i < 5; i++) {
    const L = guess[i];
    if (!greens.includes(L) && !yellows.includes(L)) {
      greySet.add(L);
    }
  }

  return possible.filter(w => {
    // 1) Greens: correct letter in exact position
    for (let i = 0; i < 5; i++) {
      if (greens[i] && w[i] !== greens[i]) return false;
    }
    // 2) Yellows: must appear somewhere, but not in that position
    for (let i = 0; i < 5; i++) {
      if (yellows[i]) {
        if (!w.includes(yellows[i]) || w[i] === yellows[i]) return false;
      }
    }
    // 3) Greys: must not contain any grey letter
    for (let g of greySet) {
      if (w.includes(g)) return false;
    }
    return true;
  });
}

// Score & sort by sum of unique-letter frequencies
function scoreAndSort(words) {
  // tally frequencies
  const freq = {};
  for (const w of words) {
    new Set(w).forEach(l => {
      freq[l] = (freq[l] || 0) + 1;
    });
  }
  // build scored array
  const scored = words.map(w => {
    let s = 0;
    new Set(w).forEach(l => { s += freq[l]; });
    return { w, s };
  });
  // sort descending
  scored.sort((a, b) => b.s - a.s);
  return scored.map(o => o.w);
}

// Core solver: returns [nextGuess, top5Array]
function solveWordle(guesses, greensList, yellowsList) {
  // start with the official solutions
  let possible = [...solutions];
  guesses.forEach((g, i) => {
    possible = applyFilter(possible, g, greensList[i], yellowsList[i]);
  });
  // fallback to all validWords if none remain
  if (possible.length === 0) {
    possible = [...validWords];
    guesses.forEach((g, i) => {
      possible = applyFilter(possible, g, greensList[i], yellowsList[i]);
    });
  }
  if (possible.length === 0) {
    alert("No possible words remain – please check your feedback.");
    return ["", []];
  }
  const sorted = scoreAndSort(possible);
  return [ sorted[0], sorted.slice(0,5) ];
}

// ─────────── 3) Wire to your page ───────────
document.addEventListener("DOMContentLoaded", async () => {
  await loadWordLists();

  const runBtn  = document.getElementById("run");
  const outNext = document.getElementById("next-guess");
  const outTop5 = document.getElementById("top5");

  runBtn.addEventListener("click", () => {
    // 1) Gather past guess rows
    const rows = Array.from(document.querySelectorAll(".row"));
    const guesses     = [];
    const greensList  = [];
    const yellowsList = [];

    rows.forEach(r => {
      const guess = Array.from(r.querySelectorAll(".guess"))
                         .map(i => i.value.toUpperCase())
                         .join("");
      const greens = Array.from(r.querySelectorAll(".green"))
                          .map(i => i.value.toUpperCase());
      const yellows= Array.from(r.querySelectorAll(".yellow"))
                          .map(i => i.value.toUpperCase());

      if (guess.length === 5) {
        guesses.push(guess);
        greensList.push(greens);
        yellowsList.push(yellows);
      }
    });

    // 2) Solve
    const [nextGuess, top5] = solveWordle(guesses, greensList, yellowsList);

    // 3) Render Next Guess
    outNext.innerHTML = "";
    nextGuess.split("").forEach(l => {
      const span = document.createElement("span");
      span.textContent = l;
      span.style.display = "inline-block";
      span.style.margin  = "0 .25em";
      span.style.fontSize = "1.5rem";
      outNext.appendChild(span);
    });

    // 4) Render Top 5
    outTop5.innerHTML = "";
    top5.forEach(w => {
      const p = document.createElement("p");
      p.textContent = w;
      p.style.margin = "0.25rem 0";
      outTop5.appendChild(p);
    });
  });
});
