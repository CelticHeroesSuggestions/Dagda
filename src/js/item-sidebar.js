// functions that assist with the items panel of the quest UI

// update the completion details field for a item
function updateCompletionDetailsField(itemId, itemId, parentElement) {
    let item = itemData[itemId]["items"].find(item => item["item_id"] == itemId)
    // remove the rows after the first two
    removeRowsAfterN(parentElement, 1)
    createitemRowBottom(item, parentElement)
    let itemCompletionDetailsDiv = document.getElementById('item-completion-details-' + itemId)
    
    // kill a mob
    if (item["completion_type"] == 0) {
        itemPrefillKeyQuantityRows(item, parentElement, dataSummaries["mobs"])
        // add a new row if it's not already there
        if (parentElement.children.length == 2) {
            createNewRowWithDropdownAndQuantity(parentElement, dataSummaries["mobs"], () => {
                itemCompileAndSave(itemId, itemId, parentElement)
            })
        }
    }
    // loot/gather an item
    else if (item["completion_type"] == 1) {
        itemPrefillKeyQuantityRows(item, parentElement, dataSummaries["items"])
        // add a new row if it's not already there
        if (parentElement.children.length == 2) {
            createNewRowWithDropdownAndQuantity(parentElement, dataSummaries["items"], () => {
                itemCompileAndSave(itemId, itemId, parentElement)
            })
        }
    }
    // several do not have completion details (3: talk to mentioned NPC, 4: end quest, 5: completed quest)
    else if (item["completion_type"] == 3 || item["completion_type"] == 4 || item["completion_type"] == 5) {
        item["completion_details"] = ""
        if (itemCompletionDetailsDiv) {
            itemCompletionDetailsDiv.innerHTML = ''
        }
    }
    // hand in item (single)
    else if (item["completion_type"] == 6) {
        itemPrefillKeyQuantityRows(item, parentElement, dataSummaries["items"])
        // add a new row if it's not already there
        if (parentElement.children.length == 2) {
            createNewRowWithDropdownAndQuantity(parentElement, dataSummaries["items"], () => {
                itemCompileAndSave(itemId, itemId, parentElement)
            })
        }
    }
    // hand in item (multiple)
    else if (item["completion_type"] == 7) {
        itemPrefillKeyQuantityRows(item, parentElement, dataSummaries["items"])
        // add new rows if it's not already there
        if (parentElement.children.length == 2) {
            createNewRowWithDropdownAndQuantity(parentElement, dataSummaries["items"], () => {
                itemCompileAndSave(itemId, itemId, parentElement)
            })
            createNewRowWithDropdownAndQuantity(parentElement, dataSummaries["items"], () => {
                itemCompileAndSave(itemId, itemId, parentElement)
            })
        }
        addRowWithButtonForNewRowWithDropdownAndQuantity(parentElement, dataSummaries["items"], () => {
            itemCompileAndSave(itemId, itemId, parentElement)
        })
    }
    // cast skill
    else if (item["completion_type"] == 8) {
        itemPrefillKeyQuantityRows(item, parentElement, skillData)
        // add a new row if it's not already there
        if (parentElement.children.length == 2) {
            createNewRowWithDropdownAndQuantity(parentElement, skillData, () => {
                itemCompileAndSave(itemId, itemId, parentElement)
            })
        }
    }
}

// prefill key quantity rows with completion details
function itemPrefillKeyQuantityRows(item, container, values) {
    if (!item["completion_details"]) {
        return
    }
    let completionDetails = item["completion_details"].split(";")
    for (let i = 0; i < completionDetails.length; i++) {
        let keyQuantity = completionDetails[i].split(",")
        createNewRowWithDropdownAndQuantity(container, values, () => {
            itemCompileAndSave(item["quest_id"], item["item_id"], container)
        })
        let id = parseInt(keyQuantity[0])
        let value = getValueById(values, id)
        container.lastChild.value = value
        container.lastChild.children[0].children[0].children[0].innerHTML = value ? value["name"] + " (" + value["id"] + ")" : "UNKNOWN (" + id + ")"
        container.lastChild.children[0].children[1].value = keyQuantity[1]
    }
}

// create a new row with a dropdown and quantity
function createNewRowWithDropdownAndQuantity(container, values, callback, secondToLast=false) {
    // item takes a lot of space, add a new row
    const newRow = document.createElement('div')
    newRow.className = 'items-item-row'
    newRow.style.justifyContent = 'flex-start'
    if (!secondToLast) {
        container.appendChild(newRow)
    }
    else {
        container.insertBefore(newRow, container.lastChild)
    }
    // move the completion details div to the new row
    // item completion details
    const itemCompletionDetails = document.createElement('div')
    itemCompletionDetails.className = 'items-item-text'
    // set the contents of the completion details div
    itemCompletionDetails.innerHTML = "Item:&emsp;"
    itemCompletionDetails.style.justifyContent = "space-between"
    newRow.appendChild(itemCompletionDetails)
    createSearchableDropdown(itemCompletionDetails, values, (item) => {
        newRow.value = item
        callback(newRow.value[0] + "," + quantityField.value)
    })
    // add a quantity field
    const quantityField = document.createElement('input')
    quantityField.type = 'number'
    quantityField.classList.add("info-input")
    quantityField.min = 1
    quantityField.value = 1
    quantityField.onchange = () => {
        callback((newRow.value ? newRow.value[0] : undefined) + "," + quantityField.value)
    }
    itemCompletionDetails.appendChild(quantityField)
}


// create the second row of the item entry
function createItemStatsRowBottom(item, itemContainer) {
    const itemRowBottom = document.createElement('div')
    itemRowBottom.className = 'items-item-row'
    itemContainer.appendChild(itemRowBottom)

    // item completion type
    const itemCompletionType = document.createElement('div')
    itemCompletionType.className = 'items-item-text'
    itemCompletionType.innerHTML = 'Task:&emsp;'
    itemRowBottom.appendChild(itemCompletionType)

    // item completion type dropdown
    const itemCompletionTypeDropdown = createDropdown('item-completion-type-' + item["item_id"], completionTypes, completionTypes[item["completion_type"]], (data) => {
        // update the completion type
        item["completion_type"] = parseInt(data.target.value)
        // update the completion details field
        updateCompletionDetailsField(item["quest_id"], item["item_id"], itemRowBottom.parentElement)
    })
    itemCompletionType.appendChild(itemCompletionTypeDropdown)

    // item completion details
    const itemCompletionDetails = document.createElement('div')
    // itemCompletionDetails.id = 'item-completion-details-' + item["item_id"]
    itemCompletionDetails.className = 'items-item-text'
    itemRowBottom.appendChild(itemCompletionDetails)

    // item next item
    const itemNextitem = document.createElement('div')
    itemNextitem.className = 'items-item-text'
    itemNextitem.innerHTML = 'Next item: ' + item["next_item"]
    itemRowBottom.appendChild(itemNextitem)
}


// add row to bottom of entry with a + arrow to create a new row
function addRowWithButtonForNewRowWithDropdownAndQuantity(itemContainer, values, rowCallback) {
    const itemRowBottom = document.createElement('div')
    itemRowBottom.className = 'items-item-row'
    itemRowBottom.style.justifyContent = 'center'
    itemRowBottom.style.marginTop = '1rem'
    itemContainer.appendChild(itemRowBottom)

    // add a + button
    const plusButton = document.createElement('div')
    plusButton.className = 'items-item-button'
    plusButton.innerHTML = "&emsp;+&emsp;"
    plusButton.style.marginRight = '1rem'
    plusButton.style.backgroundColor = 'lightgreen'
    plusButton.onclick = () => {
        createNewRowWithDropdownAndQuantity(itemContainer, values, rowCallback, secondToLast=true)
    }
    itemRowBottom.appendChild(plusButton)

    // add a - button
    const minusButton = document.createElement('div')
    minusButton.className = 'items-item-button'
    minusButton.innerHTML = "&emsp;-&emsp;"
    minusButton.style.marginLeft = '1rem'
    minusButton.style.backgroundColor = 'palevioletred'
    minusButton.onclick = () => {
        if (itemContainer.children.length > 3) {
            itemContainer.children[itemContainer.children.length - 2].remove()
        }
    }
    itemRowBottom.appendChild(minusButton)
}

// compile the completion details and save it
function itemCompileAndSave(itemId, field, container) {
    let results = itemCompileAndSave(container)
    // save the new quest data
    itemData[itemId][field] = results
    print("Saving item:", itemId, field, results)
    // save the results to the database
    // saveQuestToDb(questId)
}
