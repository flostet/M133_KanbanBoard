window.addEventListener('load', async () => {
    let columns = await getColumns();
    let cards = await getCards();

    for (let i = 0; i < columns.length; i++) {
        createColumn(columns[i]);
    }

    createCards(cards);
});

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
    newCardInput.type = "text";
    footer.appendChild(newCardInput);

    let newCardButton = document.createElement("button");
    newCardButton.innerText = "+";
    footer.appendChild(newCardButton);
}

// prints each card to column
function createCards(cards){
    cards.forEach(card => {
        cardHtml = createCardHtml(card);

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

    div.appendChild(p);
    div.appendChild(deleteButton);

    listItem.appendChild(div);
    return listItem;
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

