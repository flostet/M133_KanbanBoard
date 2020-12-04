// Function to load the Columns
window.addEventListener('load', async () => {
    columns = await getColumns();

    for (let i = 0; i < columns.length; i++) {
        createColumn(columns[i]);
    }
});

function createColumn(column){
    let col = document.createElement("div");
    document.body.appendChild(col);

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
    footer.appendChild(newCardInput);

    let newCardButton = document.createElement("button");
    newCardButton.innerText = "+";
    footer.appendChild(newCardButton);


}

async function getColumns() {
    let response = await fetch('http://localhost:8000/columns', {
        method: 'GET',
    });
    return await response.json();
}

async function getTasks() {
    let response = await fetch('http://localhost:8000/cards', {
        method: 'GET',
    });
    return await response.json();
}

