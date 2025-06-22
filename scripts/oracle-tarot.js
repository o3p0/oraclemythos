// Enhanced oracle-tarot.js with Mythic Popout Template Support

let oracleDeck = [];
let oracleCardsDrawn = [];
let showingReversed = false;

async function loadOracleDeck() {
  try {
    const res = await fetch('data/archetypes.json');
    oracleDeck = await res.json();
    preloadOracleImages();
    renderInitialCardBacks();
    console.log("Deck loaded:", oracleDeck);
  } catch (err) {
    console.error("Failed to load data/archetypes.json", err);
  }
}

function preloadOracleImages() {
  oracleDeck.forEach(card => {
    const img = new Image();
    img.src = card.image_url || `images/oracle/${card.name.replace(/\s+/g, '-').toLowerCase()}.png`;
  });
}

function getThreeOracleCards() {
  return [...oracleDeck].sort(() => 0.5 - Math.random()).slice(0, 3);
}

function renderInitialCardBacks() {
  for (let i = 0; i < 3; i++) {
    const slot = document.getElementById(`card-slot-${i}`);
    if (!slot) continue;
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'card-wrapper';

    const cardElement = document.createElement('div');
    cardElement.className = 'card';

    const cardBack = document.createElement('div');
    cardBack.className = 'card-face card-back';
    const cardImgBack = document.createElement('img');
    cardImgBack.src = 'images/card_back.png';
    cardImgBack.alt = 'Card Back';
    cardBack.appendChild(cardImgBack);

    cardElement.appendChild(cardBack);
    cardWrapper.appendChild(cardElement);

    slot.innerHTML = '';
    slot.appendChild(cardWrapper);
  }
}

function displayOracleCards() {
  oracleCardsDrawn = getThreeOracleCards();
  const positions = ['past', 'present', 'future'];

  const startBtn = document.getElementById('oracleStartBtn');
  if (startBtn) startBtn.textContent = '🔁';

  oracleCardsDrawn.forEach((card, i) => {
    const slot = document.getElementById(`card-slot-${i}`);
    const reading = document.getElementById(`reading-${positions[i]}`);
    if (!slot || !reading) return;

    slot.className = `card-slot ${card.category?.toLowerCase() || ''}`;

    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'card-wrapper';

    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.addEventListener('click', () => showModal(card));

    const cardFront = document.createElement('div');
    cardFront.className = 'card-face card-front';
    const cardImgFront = document.createElement('img');
    cardImgFront.src = card.image_url || `images/oracle/${card.name.replace(/\s+/g, '-').toLowerCase()}.png`;
    cardImgFront.alt = card.name;
    cardImgFront.style.borderRadius = '10px';
    cardFront.appendChild(cardImgFront);

    const cardBack = document.createElement('div');
    cardBack.className = 'card-face card-back';
    const cardImgBack = document.createElement('img');
    cardImgBack.src = 'images/card_back.png';
    cardImgBack.alt = 'Card Back';
    cardBack.appendChild(cardImgBack);

    cardElement.appendChild(cardFront);
    cardElement.appendChild(cardBack);
    cardWrapper.appendChild(cardElement);

    slot.innerHTML = '';

    const title = document.createElement('h2');
    title.className = 'archetype-title';
    title.textContent = card.name;
    title.style.marginBottom = '12px';
    slot.appendChild(title);

    slot.appendChild(cardWrapper);

    setTimeout(() => {
      cardElement.classList.add('flipped');
    }, 100);

    reading.innerHTML = `
      <div class="reading-box">
        <p class="reading-position"><em>${positions[i][0].toUpperCase() + positions[i].slice(1)} — ${card.category}</em></p>
        <p class="upright-reading">${card[`meaning_${positions[i]}`]}</p>
        <p class="reversed-reading hidden">${card.reversed_meaning}</p>
      </div>
    `;
    reading.classList.add('revealed');
  });

  applyReversedState();
}

function showModal(card) {
  const modal = document.getElementById('cardModal');
  const body = document.querySelector('.modal-body');
  if (!modal || !body) return;

  document.querySelector('.modal-img')?.remove();
  document.querySelector('.modal-meanings')?.remove();

  const imageSrc = card.image_url || `images/oracle/${card.name.replace(/\s+/g, '-').toLowerCase()}.png`;

  document.getElementById('modal-title').textContent = card.name;

  const imageHTML = `<div class="modal-img"><img src="${imageSrc}" alt="${card.name}"></div>`;
  const meaningsHTML = `
    <div class="modal-meanings">
      <p class="poetic">${card.poetic_summary}</p>
      ${card.invocation ? `<p class="invocation"><em>${card.invocation}</em></p>` : ''}
      <p class="essence"><strong>Essence:</strong> ${card.essence}</p>
      ${card.essence_description ? `<p class="essence-desc">${card.essence_description}</p>` : ''}
      ${card.elemental_poetic ? `<p class="elemental"><strong>Elemental Resonance:</strong> ${card.elemental_poetic}</p>` : `<p class="element"><strong>Element:</strong> ${card.element}</p>`}
      <p class="planet"><strong>Planet:</strong> ${card.planet}</p>
      <p class="mythic"><strong>Mythic:</strong> ${card.god}</p>
      ${card.associations ? `<p class="associations"><strong>Associated:</strong> ${card.associations.join(', ')}</p>` : ''}
      ${card.mythic_echoes ? `<ul class="echoes">${card.mythic_echoes.map(e => `<li>${e}</li>`).join('')}</ul>` : ''}
      ${card.walks_with_you ? `<p class="walks-with"><strong>When this Archetype walks with you:</strong><br>${card.walks_with_you}</p>` : ''}
    </div>
  `;

  body.insertAdjacentHTML('afterbegin', imageHTML);
  body.insertAdjacentHTML('beforeend', meaningsHTML);
  modal.style.display = 'block';
  modal.style.pointerEvents = 'auto';
}

function closeModal() {
  const modal = document.getElementById('cardModal');
  modal.style.display = 'none';
  modal.style.pointerEvents = 'none';
  document.querySelector('.modal-img')?.remove();
  document.querySelector('.modal-meanings')?.remove();
}

function setupReversedToggle() {
  const toggleBtn = document.getElementById('toggleReversedBtn');
  if (!toggleBtn) return;

  toggleBtn.textContent = '🔄';

  toggleBtn.addEventListener('click', () => {
    showingReversed = !showingReversed;
    toggleBtn.textContent = showingReversed ? '↩' : '🔄';
    applyReversedState();
  });
}

function applyReversedState() {
  document.querySelectorAll('.upright-reading').forEach(p => p.classList.toggle('hidden', showingReversed));
  document.querySelectorAll('.reversed-reading').forEach(p => p.classList.toggle('hidden', !showingReversed));
  document.querySelectorAll('.card').forEach(card => card.classList.toggle('rotated', showingReversed));
}

window.addEventListener('DOMContentLoaded', async () => {
  await loadOracleDeck();
  document.getElementById('oracleStartBtn')?.addEventListener('click', displayOracleCards);
  document.querySelector('.close-button')?.addEventListener('click', closeModal);
  window.addEventListener('click', e => { if (e.target.id === 'cardModal') closeModal(); });
  setupReversedToggle();
});
