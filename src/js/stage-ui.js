// functions that assist with the stages panel of the quest UI

// update the completion details field for a stage
function updateCompletionDetailsField(questId, stageId, parentElement) {
    let stage = questData[questId]["stages"].find(stage => stage["stage_id"] == stageId)
    // remove the rows after the first two
    removeRowsAfterN(parentElement, 1)
    createStageRowBottom(stage, parentElement)
    let stageCompletionDetailsDiv = document.getElementById('stage-completion-details-' + stageId)
    
    // kill a mob
    if (stage["completion_type"] == 0) {
        stagePrefillKeyQuantityRows(stage, parentElement, dataSummaries["mobs"])
        // add a new row if it's not already there
        if (parentElement.children.length == 2) {
            createNewRowWithDropdownAndQuantity(parentElement, dataSummaries["mobs"], () => {
                compileBasicKeyValueSet(questId, stageId, parentElement)
            })
        }
    }
    // loot/gather an item
    else if (stage["completion_type"] == 1) {
        stagePrefillKeyQuantityRows(stage, parentElement, dataSummaries["items"])
        // add a new row if it's not already there
        if (parentElement.children.length == 2) {
            createNewRowWithDropdownAndQuantity(parentElement, dataSummaries["items"], () => {
                compileBasicKeyValueSet(questId, stageId, parentElement)
            })
        }
    }
    // several do not have completion details (3: talk to mentioned NPC, 4: end quest, 5: completed quest)
    else if (stage["completion_type"] == 3 || stage["completion_type"] == 4 || stage["completion_type"] == 5) {
        stage["completion_details"] = ""
        if (stageCompletionDetailsDiv) {
            stageCompletionDetailsDiv.innerHTML = ''
        }
    }
    // hand in item (single)
    else if (stage["completion_type"] == 6) {
        stagePrefillKeyQuantityRows(stage, parentElement, dataSummaries["items"])
        // add a new row if it's not already there
        if (parentElement.children.length == 2) {
            createNewRowWithDropdownAndQuantity(parentElement, dataSummaries["items"], () => {
                compileBasicKeyValueSet(questId, stageId, parentElement)
            })
        }
    }
    // hand in item (multiple)
    else if (stage["completion_type"] == 7) {
        stagePrefillKeyQuantityRows(stage, parentElement, dataSummaries["items"])
        // add new rows if it's not already there
        if (parentElement.children.length == 2) {
            createNewRowWithDropdownAndQuantity(parentElement, dataSummaries["items"], () => {
                compileBasicKeyValueSet(questId, stageId, parentElement)
            })
            createNewRowWithDropdownAndQuantity(parentElement, dataSummaries["items"], () => {
                compileBasicKeyValueSet(questId, stageId, parentElement)
            })
        }
        addRowWithButtonForNewRowWithDropdownAndQuantity(parentElement, dataSummaries["items"], () => {
            compileBasicKeyValueSet(questId, stageId, parentElement)
        })
    }
    // cast skill
    else if (stage["completion_type"] == 8) {
        stagePrefillKeyQuantityRows(stage, parentElement, skillData)
        // add a new row if it's not already there
        if (parentElement.children.length == 2) {
            createNewRowWithDropdownAndQuantity(parentElement, skillData, () => {
                compileBasicKeyValueSet(questId, stageId, parentElement)
            })
        }
    }
}

// prefill key quantity rows with completion details
function stagePrefillKeyQuantityRows(stage, container, values) {
    if (!stage["completion_details"]) {
        return
    }
    let completionDetails = stage["completion_details"].split(";")
    for (let i = 0; i < completionDetails.length; i++) {
        let keyQuantity = completionDetails[i].split(",")
        createNewRowWithDropdownAndQuantity(container, values, () => {
            compileBasicKeyValueSet(stage["quest_id"], stage["stage_id"], container)
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
    newRow.className = 'stages-stage-row'
    newRow.style.justifyContent = 'flex-start'
    if (!secondToLast) {
        container.appendChild(newRow)
    }
    else {
        container.insertBefore(newRow, container.lastChild)
    }
    // move the completion details div to the new row
    // stage completion details
    const stageCompletionDetails = document.createElement('div')
    stageCompletionDetails.className = 'stages-stage-text'
    // set the contents of the completion details div
    stageCompletionDetails.innerHTML = "Item:&emsp;"
    stageCompletionDetails.style.justifyContent = "space-between"
    newRow.appendChild(stageCompletionDetails)
    createSearchableDropdown(stageCompletionDetails, values, (item) => {
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
    stageCompletionDetails.appendChild(quantityField)
}


// create the second row of the stage entry
function createStageRowBottom(stage, stageContainer) {
    const stageRowBottom = document.createElement('div')
    stageRowBottom.className = 'stages-stage-row'
    stageContainer.appendChild(stageRowBottom)

    // stage completion type
    const stageCompletionType = document.createElement('div')
    stageCompletionType.className = 'stages-stage-text'
    stageCompletionType.innerHTML = 'Task:&emsp;'
    stageRowBottom.appendChild(stageCompletionType)

    // stage completion type dropdown
    const stageCompletionTypeDropdown = createDropdown('stage-completion-type-' + stage["stage_id"], completionTypes, completionTypes[stage["completion_type"]], (data) => {
        // update the completion type
        stage["completion_type"] = parseInt(data.target.value)
        // update the completion details field
        updateCompletionDetailsField(stage["quest_id"], stage["stage_id"], stageRowBottom.parentElement)
    })
    stageCompletionType.appendChild(stageCompletionTypeDropdown)

    // stage completion details
    const stageCompletionDetails = document.createElement('div')
    // stageCompletionDetails.id = 'stage-completion-details-' + stage["stage_id"]
    stageCompletionDetails.className = 'stages-stage-text'
    stageRowBottom.appendChild(stageCompletionDetails)

    // stage next stage
    const stageNextStage = document.createElement('div')
    stageNextStage.className = 'stages-stage-text'
    stageNextStage.innerHTML = 'Next Stage: ' + stage["next_stage"]
    stageRowBottom.appendChild(stageNextStage)
}


// add row to bottom of entry with a + arrow to create a new row
function addRowWithButtonForNewRowWithDropdownAndQuantity(stageContainer, values, rowCallback) {
    const stageRowBottom = document.createElement('div')
    stageRowBottom.className = 'stages-stage-row'
    stageRowBottom.style.justifyContent = 'center'
    stageRowBottom.style.marginTop = '1rem'
    stageContainer.appendChild(stageRowBottom)

    // add a + button
    const plusButton = document.createElement('div')
    plusButton.className = 'stages-stage-button'
    plusButton.innerHTML = "&emsp;+&emsp;"
    plusButton.style.marginRight = '1rem'
    plusButton.style.backgroundColor = 'lightgreen'
    plusButton.onclick = () => {
        createNewRowWithDropdownAndQuantity(stageContainer, values, rowCallback, secondToLast=true)
    }
    stageRowBottom.appendChild(plusButton)

    // add a - button
    const minusButton = document.createElement('div')
    minusButton.className = 'stages-stage-button'
    minusButton.innerHTML = "&emsp;-&emsp;"
    minusButton.style.marginLeft = '1rem'
    minusButton.style.backgroundColor = 'palevioletred'
    minusButton.onclick = () => {
        if (stageContainer.children.length > 3) {
            stageContainer.children[stageContainer.children.length - 2].remove()
        }
    }
    stageRowBottom.appendChild(minusButton)
}

// compile the completion details across rows for a stage
function compileBasicKeyValueSet(questId, stageId, container) {
    let results = ""
    for (let i = 2; i < container.children.length; i++) {
        let row = container.children[i]
        let key = row.value?.["id"];
        let value = row.children[0]?.children[1]?.value
        if (key && value) {
            results += key + "," + value + ";"
        }
    }
    // remove the trailing ;
    if (results[results.length - 1] == ";") {
        results = results.slice(0, -1)
    }
    // save the new quest data
    questData[questId]["stages"].find(stage => stage["stage_id"] == stageId)["completion_details"] = results
    // save the results to the database
    saveQuestToDb(questId)
}