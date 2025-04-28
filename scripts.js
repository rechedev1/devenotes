const addCard = document.querySelector("#addcard");
const cards = document.querySelector("#cards");
const input = document.querySelector("input");
const add = document.querySelector("#addcard i");

function createCard(text = "") {
  const card = document.createElement("div");
  card.className = "card";

  const cardArea = document.createElement("textarea");
  cardArea.placeholder = "Digite um texto...";
  cardArea.value = text;
  cardArea.disabled = true;

  const deleteBtn = document.createElement("i");
  deleteBtn.className = "bi bi-x-lg";

  deleteBtn.addEventListener("click", () => {
    cards.removeChild(card);
  });

  const editBtn = document.createElement("i");
  editBtn.className = "bi bi-pencil";
  editBtn;

  editBtn.addEventListener("click", () => {
    cardArea.disabled = false;
    cardArea.focus();
    editBtn.style.display = "none";
    cardArea.dataset.oldvalue = cardArea.value;
  });

  cardArea.addEventListener("blur", () => {
    if (!cardArea.disabled) {
      if (cardArea.value !== cardArea.dataset.oldvalue) {
        const confirmSave = window.confirm("Deseja Salvar as alterações?");
        if (confirmSave) {
          cardArea.disabled = true;
          editBtn.style.display = "inline-block";
        } else {
          cardArea.value = cardArea.dataset.oldvalue;
          cardArea.disabled = true;
          editBtn.style.display = "inline-block";
        }
      }
    }
  });

  card.appendChild(cardArea);
  card.appendChild(deleteBtn);
  card.appendChild(editBtn);

  cards.appendChild(card);
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
