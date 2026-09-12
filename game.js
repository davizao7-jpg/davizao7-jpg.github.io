/* ============================================================
   MINER — lógica do jogo
   ============================================================ */

const SAVE_KEY = "miner_save_v1";
const COLS = 6;
const ROWS = 4;

const TILE_TYPES = [
  { key: "rock",    label: "pedra",    min: 1,  max: 2,  weight: 45 },
  { key: "coal",    label: "carvão",   min: 3,  max: 5,  weight: 26 },
  { key: "iron",    label: "ferro",    min: 6,  max: 10, weight: 16 },
  { key: "goldore", label: "ouro",     min: 14, max: 22, weight: 9  },
  { key: "diamond", label: "diamante", min: 35, max: 55, weight: 3  },
  { key: "cavein",  label: "desabou",  min: 0,  max: 0,  weight: 1  },
];

let state = {
  gold: 0,
  depth: 1,
  pickaxeLevel: 0,
  cartLevel: 0,
  dynamiteLevel: 0,
  grid: [],
};

function load() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (raw) {
    try {
      const saved = JSON.parse(raw);
      state = { ...state, ...saved };
    } catch (e) { /* ignora save corrompido */ }
  }
  if (!state.grid || state.grid.length !== COLS * ROWS) {
    state.grid = newGrid();
  }
}

function save() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function pickaxeMultiplier() {
  return 1 + state.pickaxeLevel * 0.2;
}

function depthMultiplier() {
  return 1 + (state.depth - 1) * 0.12;
}

function caveInChance() {
  return Math.max(0.01, 0.05 - state.dynamiteLevel * 0.008);
}

function weightedTiles() {
  // dinamite reduz peso de desabamento e aumenta peso de achados raros
  return TILE_TYPES.map((t) => {
    let weight = t.weight;
    if (t.key === "cavein") weight = Math.max(0.2, weight - state.dynamiteLevel * 0.15);
    if (t.key === "diamond" || t.key === "goldore") weight = weight + state.dynamiteLevel * 0.6;
    return { ...t, weight };
  });
}

function pickTileType() {
  const tiles = weightedTiles();
  const total = tiles.reduce((sum, t) => sum + t.weight, 0);
  let roll = Math.random() * total;
  for (const t of tiles) {
    roll -= t.weight;
    if (roll <= 0) return t;
  }
  return tiles[0];
}

function newGrid() {
  const grid = [];
  for (let i = 0; i < COLS * ROWS; i++) {
    const type = pickTileType();
    const baseValue = type.min + Math.random() * (type.max - type.min);
    grid.push({ revealed: false, type: type.key, label: type.label, baseValue });
  }
  return grid;
}

function tileValue(tile) {
  return Math.round(tile.baseValue * pickaxeMultiplier() * depthMultiplier());
}

/* ---------- render ---------- */

const el = {
  gold: document.getElementById("gold"),
  depth: document.getElementById("depth"),
  perSec: document.getElementById("perSec"),
  mine: document.getElementById("mine"),
  nextLayerBtn: document.getElementById("nextLayerBtn"),
  toast: document.getElementById("toast"),
  pickaxeLevel: document.getElementById("pickaxeLevel"),
  cartLevel: document.getElementById("cartLevel"),
  dynamiteLevel: document.getElementById("dynamiteLevel"),
  pickaxeCost: document.getElementById("pickaxeCost"),
  cartCost: document.getElementById("cartCost"),
  dynamiteCost: document.getElementById("dynamiteCost"),
};

function costFor(kind) {
  if (kind === "pickaxe") return Math.floor(10 * Math.pow(1.5, state.pickaxeLevel));
  if (kind === "cart") return Math.floor(40 * Math.pow(1.6, state.cartLevel));
  if (kind === "dynamite") return Math.floor(80 * Math.pow(1.8, state.dynamiteLevel));
}

function cartGoldPerSecond() {
  return state.cartLevel * 1.5 * depthMultiplier();
}

function renderStats() {
  el.gold.textContent = Math.floor(state.gold);
  el.depth.textContent = state.depth;
  el.perSec.textContent = cartGoldPerSecond().toFixed(1);

  el.pickaxeLevel.textContent = `nível ${state.pickaxeLevel}`;
  el.cartLevel.textContent = `nível ${state.cartLevel}`;
  el.dynamiteLevel.textContent = `nível ${state.dynamiteLevel}`;

  el.pickaxeCost.textContent = costFor("pickaxe");
  el.cartCost.textContent = costFor("cart");
  el.dynamiteCost.textContent = costFor("dynamite");

  document.querySelectorAll(".buy-btn").forEach((btn) => {
    const kind = btn.dataset.buy;
    btn.disabled = state.gold < costFor(kind);
  });
}

function renderGrid() {
  el.mine.innerHTML = "";
  state.grid.forEach((tile, index) => {
    const btn = document.createElement("button");
    btn.className = "tile" + (tile.revealed ? ` revealed type-${tile.type}` : "");
    btn.dataset.index = index;
    if (tile.revealed) {
      btn.textContent = tile.type === "cavein" ? "×" : `+${tileValue(tile)}`;
      btn.title = tile.label;
      btn.disabled = true;
    }
    el.mine.appendChild(btn);
  });

  const allRevealed = state.grid.every((t) => t.revealed);
  el.nextLayerBtn.hidden = !allRevealed;
}

function showToast(msg) {
  el.toast.textContent = msg;
  el.toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.toast.classList.remove("show"), 1400);
}

/* ---------- ações ---------- */

function digTile(index) {
  const tile = state.grid[index];
  if (!tile || tile.revealed) return;

  tile.revealed = true;

  if (tile.type === "cavein") {
    const loss = Math.floor(state.gold * 0.1);
    state.gold = Math.max(0, state.gold - loss);
    showToast(`desabamento! -${loss} ouro`);
  } else {
    const value = tileValue(tile);
    state.gold += value;
    if (tile.type === "diamond") showToast(`diamante! +${value} ouro`);
  }

  renderStats();
  renderGrid();
  save();
}

function nextLayer() {
  state.depth += 1;
  state.grid = newGrid();
  renderStats();
  renderGrid();
  save();
  // ação real do jogador (mudou de "terreno") -> dispara o popunder
  if (typeof window.dispararPopunder === "function") {
    window.dispararPopunder();
  }
}

function buyUpgrade(kind) {
  const cost = costFor(kind);
  if (state.gold < cost) return;
  state.gold -= cost;
  if (kind === "pickaxe") state.pickaxeLevel += 1;
  if (kind === "cart") state.cartLevel += 1;
  if (kind === "dynamite") state.dynamiteLevel += 1;
  renderStats();
  save();
}

function resetProgress() {
  if (!confirm("Reiniciar todo o progresso?")) return;
  state = {
    gold: 0,
    depth: 1,
    pickaxeLevel: 0,
    cartLevel: 0,
    dynamiteLevel: 0,
    grid: newGrid(),
  };
  renderStats();
  renderGrid();
  save();
}

/* ---------- eventos ---------- */

el.mine.addEventListener("click", (e) => {
  const btn = e.target.closest(".tile");
  if (!btn || btn.disabled) return;
  digTile(Number(btn.dataset.index));
});

el.nextLayerBtn.addEventListener("click", nextLayer);

document.querySelectorAll(".buy-btn").forEach((btn) => {
  btn.addEventListener("click", () => buyUpgrade(btn.dataset.buy));
});

document.getElementById("resetBtn").addEventListener("click", resetProgress);

/* ---------- loop do carrinho automático ---------- */

setInterval(() => {
  if (state.cartLevel > 0) {
    state.gold += cartGoldPerSecond();
    renderStats();
    save();
  }
}, 1000);

/* ---------- início ---------- */

load();
renderStats();
renderGrid();
