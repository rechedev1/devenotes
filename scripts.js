const addCard = document.querySelector("#addcard");
const cards = document.querySelector("#cards");
const input = document.querySelector("#addcard input");
const add = document.querySelector("#addcard i");
const search = document.querySelector("#searchCard");
const exportBtn = document.querySelector("#export");

// * Cards com cores aleatórias
const coresDisponiveis = [
  "#ffadad",
  "#ffd6a5",
  "#fdffb6",
  "#caffbf",
  "#9bf6ff",
  "#a0c4ff",
  "#bdb2ff",
  "#ffc6ff",
];

// *Função para cor aleatória
function corAleatoria() {
  const index = Math.floor(Math.random() * coresDisponiveis.length);
  return coresDisponiveis[index];
}
// *Função para criar o card
function createCard(
  text = "",
  isEdited = false,
  isPinned = false,
  cor = corAleatoria()
) {
  const card = document.createElement("div");
  card.className = "card";
  card.style.backgroundColor = cor;
  card.dataset.cor = cor;

  const inner = document.createElement("div");
  inner.className = "inner";

  const cardArea = document.createElement("textarea");
  cardArea.placeholder = "Digite um texto...";
  cardArea.value = text;
  cardArea.disabled = true;

  if (isEdited) card.classList.add("edited");

  // *Excluir Card
  const deleteBtn = document.createElement("i");
  deleteBtn.className = "bi bi-x-lg";
  deleteBtn.addEventListener("click", () => {
    cards.removeChild(card);
    saveLocal();
  });

  // *Editar Card
  const editBtn = document.createElement("i");
  editBtn.className = "bi bi-pencil";
  editBtn.addEventListener("click", () => {
    cardArea.disabled = false;
    cardArea.focus();
    cardArea.dataset.oldvalue = cardArea.value;
  });

  // *Copiar Card
  const copyBtn = document.createElement("i");
  copyBtn.className = "bi bi-copy";
  copyBtn.addEventListener("click", () => {
    createCard(cardArea.value);
    saveLocal();
  });

  // *Fixar / Desafixar  Card
  const fixedBtn = document.createElement("i");
  fixedBtn.className = isPinned ? "bi bi-pin-fill" : "bi bi-pin";

  if (isPinned) {
    card.classList.add("pinned");
  }

  fixedBtn.addEventListener("click", () => {
    card.classList.toggle("pinned");
    fixedBtn.className = card.classList.contains("pinned")
      ? "bi bi-pin-fill"
      : "bi bi-pin";

    if (card.classList.contains("pinned")) {
      cards.prepend(card);
    }

    saveLocal();
  });

  // *Detectar alteração no texto ao sair do campo
  cardArea.addEventListener("blur", () => {
    if (!cardArea.disabled) {
      cardArea.disabled = true;

      if (cardArea.value !== cardArea.dataset.oldvalue) {
        card.classList.add("edited");
        saveLocal();
      }
    }
  });

  // *Ícones para ação
  const actions = document.createElement("div");
  actions.className = "actions";
  actions.appendChild(deleteBtn);
  actions.appendChild(editBtn);
  actions.appendChild(copyBtn);

  inner.appendChild(cardArea);
  inner.appendChild(actions);
  card.appendChild(fixedBtn);
  card.appendChild(inner);
  cards.appendChild(card);

  saveLocal();
}

// *Botão "+" para adicionar o card
add.addEventListener("click", () => {
  const text = input.value.trim();
  if (text === "") return alert("Digite algum texto para adicionar um card.");
  createCard(text);
  input.value = "";
});

// *Adicionar o card com a tecla "ENTER"
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    const text = input.value.trim();
    if (text === "") return alert("Digite algum texto para adicionar um card.");
    createCard(text);
    input.value = "";
  }
});

// *Função para Salvar no nevegador
function saveLocal() {
  const allCards = document.querySelectorAll("#cards .card");
  const notes = [];

  allCards.forEach((card) => {
    const textarea = card.querySelector("textarea");
    const edited = card.classList.contains("edited");
    const pinned = card.classList.contains("pinned");
    const cor = card.dataset.cor || "#ffffff";

    notes.push({ text: textarea.value, edited, pinned, cor });
  });

  localStorage.setItem("notas", JSON.stringify(notes));
}

// *Carregar DOM
window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("notas") || "[]");
  saved.forEach((item) => {
    createCard(item.text, item.edited, item.pinned, item.cor);
  });
});

// * Blibioteca para arrastar os cards
new Sortable(cards, {
  animation: 400,
  ghostClass: "dragging",
  onEnd: () => saveLocal(),
});

// *Buscar Cards
search.addEventListener("input", () => {
  const termo = search.value.toLowerCase();
  const todosCards = document.querySelectorAll("#cards .card");

  todosCards.forEach((card) => {
    const texto = card.querySelector("textarea").value.toLowerCase();
    card.style.display = texto.includes(termo) ? "block" : "none";
  });
});

// *Exportar para CSV
exportBtn.addEventListener("click", () => {
  const allCards = document.querySelectorAll("#cards .card");
  if (allCards.length === 0) {
    alert("Nenhum card para exportar.");
    return;
  }

  let csvContent = "Texto,Editado,Fixado,Cor\n";

  allCards.forEach((card) => {
    const texto = card.querySelector("textarea").value.replace(/"/g, '""'); // escape aspas
    const editado = card.classList.contains("edited") ? "Sim" : "Não";
    const fixado = card.classList.contains("pinned") ? "Sim" : "Não";
    const cor = card.dataset.cor || "#ffffff";

    csvContent += `"${texto}",${editado},${fixado},${cor}\n`;
  });

  // Criar e baixar o arquivo CSV
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "cards_exportados.csv";
  a.click();
  URL.revokeObjectURL(url);
});
