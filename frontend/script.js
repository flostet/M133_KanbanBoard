let cards = [];
let columns = [];

window.addEventListener('load', async () => {
    loadCardsAndColumns();
});

async function loadCardsAndColumns(){
    columns = await getColumns();
    cards = await getCards();

    document.getElementsByTagName('BODY')[0].innerHTML = '';

    for (let i = 0; i < columns.length; i++) {
        createColumn(columns[i]);
    }

    createCards(cards);
}

async function postCard(card){
    fetch('/cards', {
        method: 'post',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify(card)
    });
    
    loadCardsAndColumns();
}


// Function to create the Columns
function createColumn(column){
    let kanbanBoard = document.createElement("div");
    kanbanBoard.className = "kanbanBoard";
    document.body.appendChild(kanbanBoard);

    let col = document.createElement("div");
    col.className = "column";
    kanbanBoard.appendChild(col);

    let header = document.createElement("header")
    header.innerText = column.title;
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
    newCardButton.addEventListener('click', listener => addNewCard(listener))
    footer.appendChild(newCardButton);
}

// prints each card to column
function createCards(cards){
    cards.forEach(card => {
        cardHtml = createCardHtml(card);
        console.log(card.description);
        if(card.status == "ToDo"){
            document.getElementById("ToDo").appendChild(cardHtml);
        }
        else if(card.status == "in Progress"){
            document.getElementById("in Progress").appendChild(cardHtml);
        }
        else if(card.status == "Done"){
            document.getElementById("Done").appendChild(cardHtml);
        }
    })
}

// Converts the Json to HTML Object
function createCardHtml(card){
    let listItem = document.createElement("li");
    let div = document.createElement("div");
    div.id = card.id;
    div.class = "card";

    let p = document.createElement("p");
    p.innerText = card.description;

    let deleteButton = document.createElement("button");
    deleteButton.innerText = "X";
    deleteButton.addEventListener('click', listener => deleteCard(listener))

    div.appendChild(p);
    div.appendChild(deleteButton);

    listItem.appendChild(div);
    return listItem;
}

function addNewCard(listener){
    let target = listener.target;
    let status = target.id.replace("addBtn", "");
    let description = document.getElementById(("add" + status)).value;
    document.getElementById(("add" + status)).value = "";
    card = {
        "description": description,
        "status": status,
    }
    postCard(card);
}

async function getColumns() {
    let response = await fetch('http://localhost:8000/columns', {
        method: 'GET',
    });
    return await response.json();
}

async function getCards() {
    let response = await fetch('http://localhost:8000/cards', {
        method: 'GET',
    });
    return await response.json();
}