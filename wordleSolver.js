let solutions = [], validWords = [];

async function loadWordLists() {
  const resp = await fetch('words.json');
  const data = await resp.json();
  solutions = data.solutions;
  validWords = data.validWords;
}

console.log('wordleSolver.js loaded');
alert('wordleSolver.js is running!');
// wordleSolver.js

// Wait until the DOM is loaded, then hook the button
document.addEventListener('DOMContentLoaded', function() {
  const runBtn = document.getElementById('run');
  const nextDiv = document.getElementById('next-guess');
  const top5Div = document.getElementById('top5');

  runBtn.addEventListener('click', function() {
    // For now, just show a test guess and a dummy top 5
    nextDiv.textContent = 'CRANE';

    // Dummy top-5 list
    const top5 = ['CRANE','SLATE','CARTE','TRACE','REACT'];
    // Clear any old content
    top5Div.innerHTML = '';
    // Render each word
    top5.forEach(function(w) {
      const span = document.createElement('span');
      span.textContent = w + ' '; 
      top5Div.appendChild(span);
    });
  });
});
