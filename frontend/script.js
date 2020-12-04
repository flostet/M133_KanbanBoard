// Arrays for the JSON Files
let cards = [];
let columns = [];

// Loads all Cards and Columns when window loads
window.addEventListener("load", async() => {
    try {
        loadCardsAndColumns();
    } catch (err) {
        console.error("load", err);
    }
});

// Function to load all Cards and Columns
async function loadCardsAndColumns() {
    try {
        columns = await getColumns();
        cards = await getCards();

        document.getElementsByTagName("BODY")[0].innerHTML = "";

        let title = document.createElement("h3");
        title.innerText = "Kanban Board by Florian und Max";
        document.body.appendChild(title);

        let flexContainer = document.createElement("div");
        flexContainer.id = "FlexContainer";
        flexContainer.className = "FlexContainer";
        document.body.appendChild(flexContainer);

        for (let i = 0; i < columns.length; i++) {
            await createColumn(columns[i]);
        }

        createCards(cards);
    } catch (err) {
        console.error("loadCardsAndColumns", err);
    }
}

async function postCard(card) {
    try {
        fetch("/cards", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(card)
        });

        loadCardsAndColumns();
    } catch (err) {
        console.error("postCard", err);
    }
}

async function deleteCard(id) {
    try {
        fetch(`/cards/${id}`, {
            method: "delete",
        });

        loadCardsAndColumns();
    } catch (err) {
        console.error("deleteCard", err);
    }
}

async function putCard(card, id) {
    try {
        fetch(`/cards/${id}`, {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(card)
        });

        loadCardsAndColumns();
    } catch (err) {
        console.error("putCard", err);
    }
}


// Function to create the Columns
async function createColumn(column) {
    try {
        let flexContainer = document.getElementById("FlexContainer");

        let kanbanBoard = document.createElement("div");
        kanbanBoard.className = "kanbanBoard";
        flexContainer.appendChild(kanbanBoard);

        let col = document.createElement("div");
        col.className = "column";
        col.id = `"col_${column.title}`;
        col.addEventListener("dragenter", e => dragEnter(e), false);
        col.addEventListener("dragover", e => dragOver(e), false);
        col.addEventListener("dragleave", e => dragLeave(e), false);
        col.addEventListener("drop", async e => await drop(e), false);
        kanbanBoard.appendChild(col);

        let header = document.createElement("header");
        header.innerText = column.title;
        if (column.title == "ToDo") {
            header.style.backgroundColor = "orange";
        } else if (column.title == "in Progress") {
            header.style.backgroundColor = "lightblue";
        } else if (column.title == "Done") {
            header.style.backgroundColor = "green";
        }
        col.appendChild(header);

        let list = document.createElement("ul");
        list.id = column.title;
        col.appendChild(list);

        let footer = document.createElement("footer");
        col.appendChild(footer);

        let newCardInput = document.createElement("input");
        newCardInput.placeholder = "Add New Card";
        newCardInput.className = "addCard";
        newCardInput.id = "add" + column.title;
        newCardInput.type = "text";
        footer.appendChild(newCardInput);

        let newCardButton = document.createElement("button");
        newCardButton.innerText = "+";
        newCardButton.id = "addBtn" + column.title;
        newCardButton.addEventListener("click", listener => onAddNewCard(listener));
        footer.appendChild(newCardButton);
    } catch (err) {
        console.error("createColumn", err);
    }
}

// prints each card to column
function createCards(cards) {
    try {
        cards.forEach(card => {
            cardHtml = createCardHtml(card);
            if (card.status == "ToDo") {
                document.getElementById("ToDo").appendChild(cardHtml);
            } else if (card.status == "in Progress") {
                document.getElementById("in Progress").appendChild(cardHtml);
            } else if (card.status == "Done") {
                document.getElementById("Done").appendChild(cardHtml);
            }
        });
    } catch (err) {
        console.error("createCards", err);
    }
}

// Converts the Json to HTML Object
function createCardHtml(card) {
    try {
        let listItem = document.createElement("li");

        let div = document.createElement("div");
        div.id = card.id;
        div.class = "card";

        div.setAttribute("style", "border:2px solid black;");
        div.setAttribute("draggable", "true");
        div.addEventListener("dragstart", dragStart);

        let p = document.createElement("p");
        p.innerText = card.description;
        div.appendChild(p);

        if (card.status == "ToDo") {
            let rightMoveButton = document.createElement("button");
            rightMoveButton.innerText = ">";
            rightMoveButton.addEventListener("click", listener => onRightMove(listener));

            div.appendChild(rightMoveButton);
        } else if (card.status == "Done") {
            let leftMoveButton = document.createElement("button");
            leftMoveButton.innerText = "<";
            leftMoveButton.addEventListener("click", listener => onLeftMove(listener));

            div.appendChild(leftMoveButton);
        } else {
            let leftMoveButton = document.createElement("button");
            leftMoveButton.innerText = "<";
            leftMoveButton.addEventListener('click', listener => onLeftMove(listener));

            let rightMoveButton = document.createElement("button");
            rightMoveButton.innerText = ">";
            rightMoveButton.addEventListener("click", listener => onRightMove(listener));

            div.appendChild(leftMoveButton);
            div.appendChild(rightMoveButton);
        }


        let deleteButton = document.createElement("button");
        deleteButton.innerText = "X";
        deleteButton.addEventListener("click", listener => onDeleteCard(listener));

        div.appendChild(deleteButton);

        listItem.appendChild(div);
        return listItem;
    } catch (err) {
        console.error("createCardHtml", err);
    }
}

// Event Listener Functions

// Event Listener Function to add new Card
function onAddNewCard(listener) {
    try {
        let target = listener.target;
        let status = target.id.replace("addBtn", "");
        let description = document.getElementById(("add" + status)).value;
        if (description) {
            document.getElementById(("add" + status)).value = "";
            card = {
                "description": description,
                "status": status,
            }
            postCard(card);
        }
    } catch (err) {
        console.error("onAddNewCard", err);
    }
}

// Function to delete one Card
function onDeleteCard(listener) {
    try {
        let target = listener.target;
        let id = target.parentElement.id;
        deleteCard(id);
    } catch (err) {
        console.error("onDeleteCard", err);
    }
}

async function onLeftMove(listener) {
    try {
        let target = listener.target;
        let id = target.parentElement.id;
        let card = await getCard(id);

        if (card.status == "in Progress") {
            card.status = "ToDo";
        } else if (card.status == "Done") {
            card.status = "in Progress";
        }

        console.log(card.status);

        putCard(card, id);
    } catch (err) {
        console.error("onLeftMove", err);
    }
}

async function onRightMove(listener) {
    try {
        let target = listener.target;
        let id = target.parentElement.id;
        let card = await getCard(id);

        if (card.status == "ToDo") {
            card.status = "in Progress";
        } else if (card.status == "in Progress") {
            card.status = "Done";
        }

        console.log(card.status);

        putCard(card, id);
    } catch (err) {
        console.error("onRightMove", err);
    }
}

// Methods for Drag & Drop Functionality
function dragStart(e) {
    try {
        e.dataTransfer.setData("text/plain", e.target.id);
        setTimeout(() => {
            e.target.classList.add("hide");
        }, 0);
    } catch (err) {
        console.error("dragStart", err);
    }
}

function dragEnter(e) {
    try {
        e.preventDefault();
    } catch (err) {
        console.error("dragEnter", err);
    }
}

function dragOver(e) {
    try {
        e.preventDefault();
    } catch (err) {
        console.error("dragOver", err);
    }
}

function dragLeave(e) {
    try {
        e.preventDefault();
    } catch (err) {
        console.error("dragLeave", err);
    }
}

async function drop(e) {
    try {
        if (e.target.closest(".column")) {
            let col = e.target.closest(".column");
            const id = e.dataTransfer.getData("text/plain");
            const draggable = document.getElementById(id);
            draggable.classList.remove("hide");

            let card = await getCard(id);
            card.status = col.id.substring(5);
            putCard(card, id);
            loadCardsAndColumns();
        }
    } catch (err) {
        console.error("drop", err);
    }
}

// Gets all Columns from API
async function getColumns() {
    try {
        let response = await fetch("http://localhost:8000/columns", {
            method: "GET",
        });
        return await response.json();
    } catch (err) {
        console.error("getColumns", err);
    }
}

// Gets all Cards from API
async function getCards() {
    try {
        let response = await fetch("http://localhost:8000/cards", {
            method: "GET",
        });
        return await response.json();
    } catch (err) {
        console.error("getCards", err);
    }
}

async function getCard(id) {
    try {
        let result = await fetch(`http://localhost:8000/cards/${id}`, {
            method: "GET",
        });
        return await result.json();
    } catch (err) {
        console.error("getCard", err);
    }
}