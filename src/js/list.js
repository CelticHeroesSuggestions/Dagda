var searchButtonTexts = {}
var dataSummaries = {}
var dataFetchIntervals = {}

// creates the divs for a searchable side list
function setUpListSection(category, container, fetchDataButtonCallback, clickListItemCallback) {
    // overall list section
    const overallListContainer = document.createElement('div')
    overallListContainer.id = category + '-list'
    overallListContainer.className = 'list-overall'
    container.appendChild(overallListContainer)

    // search box at the top
    const listSearch = document.createElement('div')
    listSearch.id = category + '-list-search'
    listSearch.className = 'list-search'
    overallListContainer.appendChild(listSearch)

    // search box resync button
    const listReloadButton = document.createElement('div')
    listReloadButton.id = category + '-list-reload'
    listReloadButton.className = 'list-reload'
    listReloadButton.innerHTML = "Reload"
    listReloadButton.addEventListener("click", (e) => {
        if (e.shiftKey && dataFetchIntervals[category] == undefined) {
            searchButtonTexts[category] = 'Auto'
            fetchDataButtonCallback()
            dataFetchIntervals[category] = window.setInterval(fetchDataButtonCallback, 10000)
            listReloadButton.style.backgroundColor = "red"
        }
        else {
            // clear the automatic reload
            if (dataFetchIntervals[category] != undefined) {
                window.clearInterval(dataFetchIntervals[category])
                dataFetchIntervals[category] = undefined
                listReloadButton.style.backgroundColor = ""
                searchButtonTexts[category] = 'Reload'
            }
            fetchDataButtonCallback()
        }
    })
    listSearch.appendChild(listReloadButton)

    // search box input
    listSearchInput = document.createElement('input')
    listSearchInput.id = category + '-list-search-input'
    listSearchInput.className = 'list-search'
    listSearchInput.placeholder = 'Search for a ' + category + '...'
    listSearchInput.oninput = function() {
        // filter the list
        generateList(category, dataSummaries[category], clickListItemCallback, listSearchInput.value)
    }
    listSearch.appendChild(listSearchInput)

    // list of search results
    const listContainer = document.createElement('div')
    listContainer.id = category + '-list-container'
    listContainer.className = 'list-container'
    overallListContainer.appendChild(listContainer)

    // create a default message in the search results container
    const searchPlaceholder = document.createElement('div')
    searchPlaceholder.className = 'info-placeholder'
    searchPlaceholder.innerHTML = '"Reload" to load ' + category + '.'
    searchPlaceholder.style.fontSize = '1.5rem'
    searchPlaceholder.style.justifyContent = 'start'
    searchPlaceholder.style.paddingTop = '2rem'
    listContainer.appendChild(searchPlaceholder)
}

// highlights a row in a list
function highlightListRow(category, index) {
    // remove highlight from all rows
    const listContainer = document.getElementById(category + '-list-container')
    listContainer.childNodes.forEach((row) => {
        row.style.backgroundColor = ""
    })

    // highlight the selected row
    listContainer.childNodes[index].style.backgroundColor = "lightblue"
}

// creates a list in a standardized format 
function generateList(category, data, clickHandler, nameFilter="") {
    listContainer = document.getElementById(category + '-list-container')
    listContainer.replaceChildren()
    let index = 0
    data.forEach((item) => {
        // ignore those outside the filter
        if (typeof item.name == "string" && !(item.name.toLowerCase() + item.id).includes(nameFilter.toLowerCase())) {
            return;
        }
        let row = document.createElement("div")
        row.setAttribute("class", "list-row")
        row.value = index
        itemId = document.createElement("div")
        itemId.setAttribute("class", "list-text")
        itemName = document.createElement("div")
        itemName.setAttribute("class", "list-text")
        row.appendChild(itemId)
        row.appendChild(itemName)
        // set the onclick for the row
        row.addEventListener("click", function() {
            // highlight the row
            highlightListRow(category, row.value)
            // click handler
            clickHandler(item.id)
        })
        listContainer.appendChild(row)
        itemId.innerHTML = item.id
        itemName.innerHTML = item.name
        index += 1
    })
    return listContainer.children.length
}