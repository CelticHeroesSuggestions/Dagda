function generateList(eid, data) {
    listContainer = document.getElementById(eid)
    data.forEach((item) => {
        row = document.createElement("div")
        row.setAttribute("class", "list-row")
        itemId = document.createElement("div")
        itemId.setAttribute("class", "list-text")
        itemName = document.createElement("div")
        itemName.setAttribute("class", "list-text")
        row.appendChild(itemId)
        row.appendChild(itemName)
        listContainer.appendChild(row)
        itemId.innerHTML = item.id
        itemName.innerHTML = item.name
    })
}