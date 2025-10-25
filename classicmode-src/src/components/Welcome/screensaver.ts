const stage = document.getElementById('stage');
const SPRITE_COUNT = 15;
const IMG_SRC = [
  '/classic/assets/flyingtoaster.gif',
  '/classic/assets/flyingtoast.gif'
];

// dimensions and spacing
const SPRITE_W = 120;
const SPRITE_H = 96;
const H_GAP = 50; // horizontal random spread
const V_GAP = 50; // vertical minimum spacing

if (stage) stage.style.position = stage.style.position || 'relative';

const viewW = stage.clientWidth || window.innerWidth;
const viewH = stage.clientHeight || window.innerHeight;

// keep track of vertical positions to prevent overlap
const usedY = [];

for (let i = 0; i < SPRITE_COUNT; i++) {
  const img = document.createElement('img');
  img.src = IMG_SRC[Math.floor(Math.random() * IMG_SRC.length)];
  img.classList.add('toaster');

  img.style.width = `${SPRITE_W}px`;
  img.style.height = `${SPRITE_H}px`;
  img.style.position = 'absolute';
  img.style.pointerEvents = 'none';

  // find a random y that’s not too close to others
  let y;
  let attempts = 0;
  do {
    y = Math.floor(Math.random() * (viewH - SPRITE_H) * -2);
    attempts++;
  } while (usedY.some(prevY => Math.abs(prevY - y) < V_GAP) && attempts < 50);

  usedY.push(y);

  // randomize right offset so they aren’t all on the same x
  const right = Math.floor(Math.random() * H_GAP);
  const top = Math.floor(Math.random() * H_GAP);

  img.style.top = `${y}px`;
  img.style.right = `${right}px`;

  stage.appendChild(img);
}


stage?.addEventListener('mousemove', () => {
    
})