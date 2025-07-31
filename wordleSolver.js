// wordleSolver.js

// 1) Load word lists from JSON
let solutions = [], validWords = [];
async function loadWordLists() {
  const err = document.getElementById('error');
  err.textContent = '';
  try {
    const res = await fetch('words.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    solutions  = data.solutions.map(w=>w.toUpperCase());
    validWords = data.validWords.map(w=>w.toUpperCase());
  } catch (e) {
    console.error(e);
    document.getElementById('error').textContent = 'Error loading words.json: ' + e.message;
  }
}

// 2) Core filter & scoring
function applyFilter(possible, guess, greens, yellows) {
  const grey = new Set();
  for (let i=0;i<5;i++){
    const L = guess[i];
    if (!greens[i] && !yellows[i]) grey.add(L);
  }
  return possible.filter(w=>{
    for (let i=0;i<5;i++){
      if (greens[i] && w[i]!==greens[i]) return false;
      if (yellows[i] && (!w.includes(yellows[i])||w[i]===yellows[i])) return false;
    }
    for (let g of grey) if (w.includes(g)) return false;
    return true;
  });
}

function scoreAndSort(words){
  const freq={};
  words.forEach(w=>new Set(w).forEach(l=>freq[l]=(freq[l]||0)+1));
  const scored = words.map(w=>{
    let s=0; new Set(w).forEach(l=>s+=freq[l]);
    return {w,s};
  });
  scored.sort((a,b)=>b.s-a.s);
  return scored.map(o=>o.w);
}

function solveWordle(guesses, greensList, yellowsList){
  let possible=[...solutions];
  guesses.forEach((g,i)=>possible=applyFilter(possible,g,greensList[i],yellowsList[i]));
  if (possible.length===0){
    possible=[...validWords];
    guesses.forEach((g,i)=>possible=applyFilter(possible,g,greensList[i],yellowsList[i]));
  }
  if (!possible.length){
    document.getElementById('error').textContent='No possible words remain';
    return ['',[]];
  }
  const sorted = scoreAndSort(possible);
  // best is sorted[0], next 4 are sorted[1..4]
  return [sorted[0], sorted.slice(1,5)];
}

// 3) Wire up tables & buttons
document.addEventListener('DOMContentLoaded', async ()=>{
  await loadWordLists();

  const guessBtn    = document.getElementById('guessBtn');
  const clearBtn    = document.getElementById('clearBtn');
  const greenTbody  = document.querySelector('#greenTable tbody');
  const yellowTbody = document.querySelector('#yellowTable tbody');
  const guessesTbody= document.querySelector('#guessesTable tbody');
  const nextTbody   = document.querySelector('#nextTable tbody');

  guessBtn.addEventListener('click', ()=>{
    // clear any prior error
    document.getElementById('error').textContent = '';

    // 1) past guesses from guessesTable
    const past = Array.from(guessesTbody.children).map(tr=>
      Array.from(tr.querySelectorAll('td')).map(td=>td.textContent).join('')
    );

    // 2) feedback from green/yellow
    const greens = [], yellows=[];
    Array.from(greenTbody.children).forEach((tr,i)=>{
      const gRow = Array.from(tr.querySelectorAll('input')).map(i=>i.value.toUpperCase());
      const yRow = Array.from(yellowTbody.children)[i]
                     .querySelectorAll('input');
      const yVals=Array.from(yRow).map(i=>i.value.toUpperCase());
      if (past[i]) { greens.push(gRow); yellows.push(yVals); }
    });

    // 3) solve
    const [nextGuess, next4] = solveWordle(past, greens, yellows);
    if (!nextGuess) return;

    // 4) add new row to Guesses table
    const tr = document.createElement('tr');
    const num = past.length+1;
    tr.innerHTML = `<th>${num}</th>` + nextGuess.split('').map(l=>`<td>${l}</td>`).join('');
    guessesTbody.appendChild(tr);

    // 5) refresh Next 4 table
    nextTbody.innerHTML = '';
    next4.forEach((w,i)=>{
      const tr2 = document.createElement('tr');
      tr2.innerHTML = `<th>${i+1}</th>` + w.split('').map(l=>`<td>${l}</td>`).join('');
      nextTbody.appendChild(tr2);
    });
  });

  clearBtn.addEventListener('click', ()=>{
    greenTbody.querySelectorAll('input').forEach(i=>i.value='');
    yellowTbody.querySelectorAll('input').forEach(i=>i.value='');
    guessesTbody.innerHTML = '';
    nextTbody.innerHTML    = '';
    document.getElementById('error').textContent = '';
  });
});
