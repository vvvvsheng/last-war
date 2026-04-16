const collection = Array.isArray(window.LAST_WAR_COLLECTION) ? window.LAST_WAR_COLLECTION : [];

const featuredImage = document.getElementById("featured-image");
const heroImage = document.getElementById("hero-image");
const featuredName = document.getElementById("featured-name");
const featuredTag = document.getElementById("featured-tag");
const featuredDesc = document.getElementById("featured-desc");
const featuredWeapon = document.getElementById("featured-weapon");
const featuredBackdrop = document.getElementById("featured-backdrop");
const featuredBtc = document.getElementById("featured-btc");
const featuredRarity = document.getElementById("featured-rarity");
const collectionGrid = document.getElementById("collection-grid");

let heroPointer = 0;

function rarityLabel(item) {
  if (!item?.rarityTier || !item?.rarityScore) return "-";
  return `${item.rarityTier} / ${item.rarityScore}`;
}

function renderFeatured(item) {
  if (!item) return;

  featuredImage.src = item.image;
  featuredImage.alt = item.name;
  featuredName.textContent = item.name;
  featuredTag.textContent = item.faction;
  featuredDesc.textContent = item.description;
  featuredWeapon.textContent = item.weapon;
  featuredBackdrop.textContent = item.backdrop;
  featuredBtc.textContent = item.bitcoinForm;
  featuredRarity.textContent = rarityLabel(item);

  Array.from(collectionGrid.children).forEach((card) => {
    card.classList.toggle("active", card.dataset.id === item.id);
  });
}

function renderGrid() {
  if (!collectionGrid || collection.length === 0) return;

  const nodes = collection.map((item) => {
    const button = document.createElement("button");
    button.className = "collection-thumb";
    button.type = "button";
    button.dataset.id = item.id;
    button.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="thumb-meta">
        <strong>${item.name}</strong>
        <span>${item.faction} / ${item.rarityTier ?? item.role}</span>
      </div>
    `;
    button.addEventListener("click", () => renderFeatured(item));
    return button;
  });

  collectionGrid.replaceChildren(...nodes);
  renderFeatured(collection[0]);
}

function rotateHero() {
  if (!heroImage || collection.length === 0) return;
  heroPointer = (heroPointer + 1) % collection.length;
  heroImage.src = collection[heroPointer].image;
  heroImage.alt = collection[heroPointer].name;
}

renderGrid();
window.setInterval(rotateHero, 2600);
