// --- 1. LES DONNÉES ---
const data = {
  base: {
    items: [{ name: "Renfort", price: 45 }],
  },
  options: {
    items: [
      { name: "Couleur", price: 1, position: 1 },
      { name: "French", price: 2, position: 2 },
      { name: "Babycolor", price: 2, position: 3 },
      { name: "Babyboomer", price: 2, position: 4 },
      { name: "Babyglitter", price: 2, position: 5 },
      { name: "Réparation", price: 2, position: 6 },
      {
        name: "Nail Art",
        price: 2,
        position: 7,
        edit: [
          { name: "Lvl 1", price: 2 },
          { name: "Lvl 2", price: 3 },
          { name: "Lvl 3", price: 4 },
        ],
      },
      {
        name: "Rallongement",
        price: 2,
        position: 8,
        edit: [
          { name: "S", price: 2 },
          { name: "M", price: 3 },
          { name: "L", price: 4 },
        ],
      },
      { name: "Réparation", price: 1.5, position: 9 },
    ],
  },
};

// --- 2. ÉTAT INITIAL ET UTILITAIRES ---
const base = data.base.items[0];

const addCount = (optionsList) => {
  return optionsList
    .map((option) => ({
      ...option,
      count: 0,
      price: option.edit ? option.edit[0].price : option.price,
    }))
    .sort((a, b) => a.position - b.position);
};

let options = addCount(data.options.items);
let totalPrice = 0;

function calculatePrice() {
  let price = base.price;
  options.forEach((option) => {
    let calcPrice;
    if (option.count === 10 && option.priceAll) {
      calcPrice = option.priceAll;
    } else {
      calcPrice = option.count * option.price;
    }
    price += calcPrice;
  });
  return price;
}

function resetAll() {
  options.forEach((option) => (option.count = 0));
  updateGlobalState();
}

function toggleOption(index) {
  const opt = options[index];
  opt.count = opt.count !== 10 ? 10 : 0;
  updateGlobalState();
}

function updateOptionPrice(index, newPrice) {
  options[index].price = parseFloat(newPrice);
  if (options[index].count === 0) return;
  updateGlobalState();
}

function scrollToBottom() {
  const element = document.getElementById("bottom");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

// Fonction utilitaire pour lancer l'animation visuelle
function triggerAnim(element) {
  if (!element) return;
  element.classList.remove("fade-in");
  void element.offsetWidth; // Force le reflow
  element.classList.add("fade-in");
}

// --- 3. GESTION DU DOM ---

function initOptionsRender() {
  const container = document.getElementById("options-list");
  container.innerHTML = "";

  options.forEach((option, index) => {
    let radioHtml = "";
    if (option.edit) {
      radioHtml = `<div class="radio-toolbar">`;
      option.edit.forEach((editPrice, i) => {
        const isChecked = option.price === editPrice.price ? "checked" : "";
        radioHtml += `
                    <input type="radio" 
                        id="opt-${index}-${i}" 
                        name="option-${index}" 
                        class="radio-input-${index}"
                        value="${editPrice.price}" 
                        ${isChecked}
                        onchange="updateOptionPrice(${index}, this.value)"
                    >
                    <label for="opt-${index}-${i}" class="radio-label-${index}">${editPrice.name}</label>
                `;
      });
      radioHtml += `</div>`;
    }

    const html = `
            <div class="option">
                <div>
                    <h2 onclick="toggleOption(${index})" id="title-${index}">
                        ${option.name}
                    </h2>
                    <div class="counter">
                        <svg class="icon-svg" id="del-btn-${index}" onclick="modifyCount(${index}, -1)" 
                             xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z" />
                        </svg>

                        <div class="count">
                            <!-- Ajout de data-value pour comparaison fiable -->
                            <p id="count-val-${index}" data-value="0">0</p>
                        </div>

                        <svg class="icon-svg" id="add-btn-${index}" onclick="modifyCount(${index}, 1)" 
                             xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                        </svg>
                    </div>
                </div>
                <p id="desc-${index}">sur aucun ongle</p>
                ${radioHtml}
            </div>
        `;
    container.insertAdjacentHTML("beforeend", html);
  });
}

function updateOptionsVisuals() {
  options.forEach((option, index) => {
    const countEl = document.getElementById(`count-val-${index}`);
    const titleEl = document.getElementById(`title-${index}`);
    const descEl = document.getElementById(`desc-${index}`);
    const addBtn = document.getElementById(`add-btn-${index}`);
    const delBtn = document.getElementById(`del-btn-${index}`);

    // 1. Chiffres & Animation (Comparaison via Dataset)
    // On lit l'ancienne valeur stockée en mémoire dans le HTML
    const previousValue = parseInt(countEl.dataset.value || "0", 10);

    if (previousValue !== option.count) {
      countEl.innerText = option.count;
      countEl.dataset.value = String(option.count); // Stockage explicite en string
      triggerAnim(countEl);
    }

    // 2. Styles inactifs
    const isInactive = option.count === 0;
    titleEl.style.color = isInactive ? "lightgrey" : "black";
    descEl.style.color = isInactive ? "lightgrey" : "grey";
    countEl.style.color = isInactive ? "lightgrey" : "black";

    // 3. Texte descriptif
    let textDetails =
      option.count === 10
        ? "les 2 mains"
        : option.count === 0
        ? "aucun"
        : option.count;
    let textSuffix =
      option.count === 10 ? "" : option.count > 1 ? "ongles" : "ongle";
    descEl.innerText = `sur ${textDetails} ${textSuffix}`;

    // 4. SVG
    addBtn.style.fill = option.count === 10 ? "pink" : "deeppink";
    delBtn.style.fill = option.count === 0 ? "pink" : "deeppink";

    // 5. Radio boutons grisés
    if (option.edit) {
      const inputs = document.querySelectorAll(`.radio-input-${index}`);
      inputs.forEach((input) => {
        if (isInactive) {
          input.classList.add("gray");
          input.disabled = true;
        } else {
          input.classList.remove("gray");
          input.disabled = false;
        }
      });
    }
  });
}

function renderRecap() {
  const container = document.getElementById("recap-list");

  // --- Base ---
  let baseLine = document.getElementById("recap-base");
  const baseSimple = totalPrice === 45 ? "Simple" : "";
  const baseAvec = totalPrice !== 45 ? "avec" : "";
  const baseText = `<span>${base.name} ${baseSimple}</span> ${baseAvec}`;
  const basePrice = base.price; // Valeur numérique
  const basePriceTxt = basePrice + "€";

  if (!baseLine) {
    baseLine = document.createElement("div");
    baseLine.id = "recap-base";
    baseLine.className = "recap";
    baseLine.innerHTML = `
            <p id="recap-base-desc">${baseText}</p>
            <p class="price" id="recap-base-price" data-value="${String(
              basePrice
            )}">${basePriceTxt}</p>
        `;
    container.prepend(baseLine);
  } else {
    document.getElementById("recap-base-desc").innerHTML = baseText;
    const priceEl = document.getElementById("recap-base-price");

    // Comparaison via Dataset (Numérique) - on compare les valeurs numériques
    const oldPrice = parseFloat(priceEl.dataset.value || "0");
    // Comparaison stricte des nombres
    if (oldPrice !== basePrice) {
      priceEl.innerText = basePriceTxt;
      priceEl.dataset.value = String(basePrice); // Stockage explicite en string
      triggerAnim(priceEl);
    }
  }

  // --- Options ---
  options.forEach((option, index) => {
    const lineId = `recap-opt-${index}`;
    let lineEl = document.getElementById(lineId);

    if (option.count > 0) {
      let itemPrice =
        option.count === 10 && option.priceAll
          ? option.priceAll
          : option.count * option.price;
      const priceStr = itemPrice + "€";

      let detailText =
        option.count === 10
          ? "les 2 mains"
          : `${option.count} ${option.count < 2 ? "ongle" : "ongles"}`;
      const descHtml = `<span>${option.name}</span> sur ${
        option.count !== 10 ? detailText : "les 2 mains"
      }`;

      if (!lineEl) {
        // Création
        lineEl = document.createElement("div");
        lineEl.id = lineId;
        lineEl.className = "recap";
        lineEl.innerHTML = `
                    <p id="recap-desc-${index}">${descHtml}</p>
                    <p class="price" id="recap-price-${index}" data-value="${String(
          itemPrice
        )}">${priceStr}</p>
                `;
        container.appendChild(lineEl);
        triggerAnim(document.getElementById(`recap-price-${index}`));
      } else {
        // Mise à jour (l'élément existe déjà dans le DOM)
        document.getElementById(`recap-desc-${index}`).innerHTML = descHtml;

        const priceEl = document.getElementById(`recap-price-${index}`);
        // Comparaison via Dataset (Numérique) - on compare les valeurs numériques
        const oldPrice = parseFloat(priceEl.dataset.value || "0");

        // Comparaison stricte des nombres
        if (oldPrice !== itemPrice) {
          priceEl.innerText = priceStr;
          priceEl.dataset.value = String(itemPrice); // Stockage explicite en string
          triggerAnim(priceEl);
        }
      }
    } else {
      if (lineEl) lineEl.remove();
    }
  });
}

function updateGlobalState() {
  totalPrice = calculatePrice();

  // Titre
  const baseTitle = document.getElementById("base-title");
  const isSimple = totalPrice === 45;
  baseTitle.innerHTML = `${base.name} <span style="color: ${
    isSimple ? "black" : "lightgrey"
  }">Simple</span>`;

  // Total
  const totalEl = document.getElementById("total-display");

  // Utilisation de data-value pour le total aussi, par sécurité
  const oldTotal = parseFloat(totalEl.dataset.value || "0");

  // Comparaison stricte des nombres
  if (oldTotal !== totalPrice) {
    totalEl.innerText = totalPrice + "€";
    totalEl.dataset.value = String(totalPrice); // Stockage explicite en string
    triggerAnim(totalEl);
  }

  updateOptionsVisuals();
  renderRecap();
}

// Initialisation au chargement pour s'assurer que data-value existe sur le total
document.addEventListener("DOMContentLoaded", () => {
  // On ajoute manuellement data-value au total initial
  const totalEl = document.getElementById("total-display");
  if (totalEl) totalEl.dataset.value = "0";

  initOptionsRender();
  updateGlobalState();

  document.getElementById("base-title").addEventListener("click", resetAll);
  document.getElementById("total-link").addEventListener("click", (e) => {
    e.preventDefault();
    scrollToBottom();
  });
});

window.modifyCount = (index, delta) => {
  const opt = options[index];
  if (delta === 1 && opt.count >= 10) return;
  if (delta === -1 && opt.count <= 0) return;
  if (delta === 1) opt.count++;
  else opt.count--;
  updateGlobalState();
};
