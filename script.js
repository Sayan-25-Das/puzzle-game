const board = document.getElementById('puzzle-board');
const moveCount = document.getElementById('move-count');
const message = document.getElementById('message');
const imageUpload = document.getElementById('image-upload');

let size = 3;
let tiles = [];
let emptyIndex = 8;
let moves = 0;
let imageUrl = 'https://picsum.photos/id/237/300/300'; // Default dog image

imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    imageUrl = event.target.result;
    init();
  };
  reader.readAsDataURL(file);
});

function init() {
  moves = 0;
  moveCount.textContent = moves;
  message.textContent = '';
  board.innerHTML = '';
  tiles = [];

  for (let i = 0; i < size * size; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.dataset.index = i;

    if (i !== size * size - 1) {
      const row = Math.floor(i / size);
      const col = i % size;
      tile.style.backgroundImage = `url(${imageUrl})`;
      tile.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
      tile.draggable = true;

      tile.addEventListener('dragstart', dragStart);
      tile.addEventListener('dragover', allowDrop);
      tile.addEventListener('drop', dropTile);
    } else {
      tile.classList.add('empty');
    }

    tiles.push(tile);
    board.appendChild(tile);
  }

  emptyIndex = size * size - 1;
  shuffle();
}

function shuffle() {
  for (let i = 0; i < 100; i++) {
    let neighbors = getMovableIndices(emptyIndex);
    let randomIndex = neighbors[Math.floor(Math.random() * neighbors.length)];
    swapTiles(randomIndex, emptyIndex);
    emptyIndex = randomIndex;
  }
}

function getMovableIndices(index) {
  let moves = [];
  const row = Math.floor(index / size);
  const col = index % size;

  if (row > 0) moves.push(index - size);
  if (row < size - 1) moves.push(index + size);
  if (col > 0) moves.push(index - 1);
  if (col < size - 1) moves.push(index + 1);

  return moves;
}

function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.dataset.index);
}

function allowDrop(e) {
  e.preventDefault();
}

function dropTile(e) {
  e.preventDefault();
  const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
  const toIndex = parseInt(e.target.dataset.index);

  if (tiles[toIndex].classList.contains('empty')) {
    swapTiles(fromIndex, toIndex);
    emptyIndex = fromIndex;
    moves++;
    moveCount.textContent = moves;
    checkWin();
  }
}

function swapTiles(i, j) {
  const temp = tiles[i].style.backgroundPosition;
  const tempImg = tiles[i].style.backgroundImage;

  tiles[i].style.backgroundImage = tiles[j].style.backgroundImage;
  tiles[i].style.backgroundPosition = tiles[j].style.backgroundPosition;

  tiles[j].style.backgroundImage = tempImg;
  tiles[j].style.backgroundPosition = temp;

  tiles[i].classList.toggle('empty');
  tiles[j].classList.toggle('empty');
}

function checkWin() {
  for (let i = 0; i < tiles.length - 1; i++) {
    const row = Math.floor(i / size);
    const col = i % size;
    const correctPos = `-${col * 100}px -${row * 100}px`;
    if (tiles[i].style.backgroundPosition !== correctPos) return;
  }
  message.textContent = "🎉 Puzzle Solved!";
}
window.onload = init;
