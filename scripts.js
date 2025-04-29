const addCard = document.querySelector("#addcard");
const cards = document.querySelector("#cards");
const input = document.querySelector("input");
const add = document.querySelector("#addcard i");

function createCard(text = "", isEdited = false, isPinned = false) {
  const card = document.createElement("div");
  card.className = "card";

  const inner = document.createElement("div");
  inner.className = "inner";

  const cardArea = document.createElement("textarea");
  cardArea.placeholder = "Digite um texto...";
  cardArea.value = text;
  cardArea.disabled = true;

  const deleteBtn = document.createElement("i");
  deleteBtn.className = "bi bi-x-lg";

  const copyBtn = document.createElement("i");
  copyBtn.className = "bi bi-copy";
  copyBtn.addEventListener("click", () => {
    createCard(cardArea.value);
    saveLocal();
  });

  const fixedBtn = document.createElement("i");
  fixedBtn.className = "bi bi-pin";

  if (isEdited) card.classList.add("edited");
  if (isPinned) {
    card.classList.add("pinned");
    fixedBtn.className = " bi bi-pin-fill";
  }

  fixedBtn.addEventListener("click", () => {
    card.classList.toggle("pinned");

    if (card.classList.contains("pinned")) {
      cards.prepend(card);
      fixedBtn.className = "bi bi-pin-fill";
    } else {
      fixedBtn.className = "bi bi-pin";
    }

    saveLocal();
  });

  deleteBtn.addEventListener("click", () => {
    cards.removeChild(card);
    saveLocal();
  });

  const editBtn = document.createElement("i");
  editBtn.className = "bi bi-pencil";

  editBtn.addEventListener("click", () => {
    cardArea.disabled = false;
    cardArea.focus();
    cardArea.dataset.oldvalue = cardArea.value;
  });

  cardArea.addEventListener("blur", () => {
    if (!cardArea.disabled) {
      cardArea.disabled = true;

      if (cardArea.value !== cardArea.dataset.oldvalue) {
        card.classList.add("edited");
        saveLocal();
      }
    }
  });

  inner.appendChild(cardArea);
  inner.appendChild(deleteBtn);
  inner.appendChild(editBtn);
  inner.appendChild(copyBtn);
  card.appendChild(fixedBtn);

  card.appendChild(inner);
  cards.appendChild(card);
  saveLocal();
}

add.addEventListener("click", () => {
  const text = input.value.trim();

  if (text === "") {
    alert("Digite algum texto para adicionar um card.");
    return;
  }

  createCard(text);
  input.value = "";
});

input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    const text = input.value.trim();
    if (text === "") {
      alert("Digite algum texto para adicionar um card.");
      return;
    }

    createCard(text);
    input.value = "";
  }
});

function saveLocal() {
  const allCards = document.querySelectorAll("#cards .card");
  const notes = [];

  allCards.forEach((card) => {
    const textarea = card.querySelector("textarea");
    const edited = card.classList.contains("edited");
    const fixed = card
      .querySelector(".bi-pin")
      ?.classList.contains("bi-pin-fill");
    notes.push({ text: textarea.value, edited, fixed });
  });

  localStorage.setItem("notas", JSON.stringify(notes));
}

window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("notas") || "[]");
  saved.forEach((item) => {
    createCard(item.text, item.edited, item.pinned);
  });
});

new Sortable(cards, {
  animation: 400,
  ghostClass: "dragging",
  onEnd: () => {
    saveLocal();
  },
});
