// global variables for the quest editor
var questData = {}
var questDataFetchInterval // interval object for fetching quest data
var questsListSearchInput = undefined  // search input element

const completionTypes = [[0, "Kill"], [1, "Loot/Gather Item"], [2, "Go to Location"], [3, "Talk to Mentioned NPC"], [4, "End Quest"], [5, "Completed Quest"], [6, "Give Item"], [7, "Give Multiple Items"], [8, "Cast Skill"], [9, "Give Gold"], [10, "Cast Skill On"], [11, "Kill Mob in List"], [12, "Kill Mob in Set"], [13, "Gather Node"], [14, "Gather Node of Set"], [15, "Equip Item"], [16, "Use Item"]]

const skillData = [[54, "Light Heal"], [1, "Fireball"], [2, "Ice Shard"], [3, "Lightning Bolt"], [4, "Earthquake"], [5, "Wind Slash"], [6, "Water Blast"], [7, "Darkness"], [8, "Holy Light"], [9, "Shadow Strike"]]

function initQuestEditor() {
    searchButtonTexts["quests"] = 'Reload'

    // overall container
    const questEditor = document.getElementById("quest-editor")
    
    // set up the list and search
    setUpListSection("quests", questEditor, fetchQuestData, showQuest)
    
    // set up the main info section
    setUpInfoSection("quest", questEditor)

    // set up the stages
    setUpStages(questEditor)
}

// set up the quest stages
function setUpStages(container) {
    // create the container
    const stagesContainer = document.createElement('div')
    stagesContainer.id = 'stages-container'
    stagesContainer.className = 'stages-container'
    container.appendChild(stagesContainer)
}

// load the stages for a quest
function showQuestStages(questId) {
    let stagesContainer = document.getElementById('stages-container')
    stagesContainer.replaceChildren()
    quest = questData[questId]
    let i = 0
    quest["stages"].forEach(stage => {
        // while here, ensure the next stage is lined up correctly
        if (i < quest["stages"].length - 1) {
            questData[questId]["stages"][i]["next_stage"] = questData[questId]["stages"][i+1]["stage_id"]
        }
        else if (i == quest["stages"].length - 1) {
            questData[questId]["stages"][i]["next_stage"] = -1
        }
        i += 1
        // add the stage
        let stageContainer = addStage(stage, stagesContainer)
        // populate the completion details field
        updateCompletionDetailsField(questId, stage["stage_id"], stageContainer)
    })

    createAddRemoveStageButtons(questId, stagesContainer)
}

// add a button to add a stage
function createAddRemoveStageButtons(questId, container) {
    // create the add stage button
    const addStageButton = document.createElement('div')
    addStageButton.className = 'stages-stage-button-half-width'
    addStageButton.style.backgroundColor = "palegreen"
    addStageButton.innerHTML = 'Add Stage'
    addStageButton.onclick = () => {
        let numStages = container.children.length - 1
        let newStage = {"quest_id": questId, "stage_id": numStages-1, "description": "Enter description here", "completion_type": 0, "completion_details": "", "next_stage": numStages, "stage_open_sum": 1}
        // add in the stage to the quest data
        questData[questId]["stages"].splice(numStages-1, 0, newStage)
        // set the stage id of the last stage (+1)
        questData[questId]["stages"][numStages]["stage_id"] = numStages
        // reload the stages
        showQuestStages(questId)
        // save the stages to the DB
        saveQuestToDb(questId)
    }

    // create the add end button
    const addEndButton = document.createElement('div')
    addEndButton.className = 'stages-stage-button-half-width'
    addEndButton.style.backgroundColor = "skyblue"
    addEndButton.innerHTML = 'Add End'
    addEndButton.onclick = () => {
        let numStages = container.children.length - 1
        let newStage = {"quest_id": questId, "stage_id": numStages, "description": "", "completion_type": 4, "completion_details": "", "next_stage": -1, "stage_open_sum": 0}
        // add in the stage to the quest data
        questData[questId]["stages"].push(newStage)
        // set the stage id of the last stage (+1)
        questData[questId]["stages"][numStages]["stage_id"] = numStages
        // reload the stages
        showQuestStages(questId)
        // save the stages to the DB
        saveQuestToDb(questId)
    }

    // create the remove stage button
    const removeStageButton = document.createElement('div')
    removeStageButton.className = 'stages-stage-button-half-width'
    removeStageButton.style.backgroundColor = "lightcoral"
    removeStageButton.innerHTML = 'Remove'
    removeStageButton.onclick = () => {
        if (container.children.length <= 3) {
            return
        }
        questData[questId]["stages"].splice(-2, 1)  // remove the second-to-last stage
        questData[questId]["stages"][questData[questId]["stages"].length-1]["stage_id"] = questData[questId]["stages"].length - 1
        // reload the stages
        showQuestStages(questId)
        // save the stages to the DB
        saveQuestToDb(questId)
    }

    // create the container for the buttons
    const buttonContainer = document.createElement('div')
    buttonContainer.className = 'stages-stage-row'
    buttonContainer.style.alignSelf = "stretch"
    buttonContainer.style.marginTop = '1rem'
    buttonContainer.appendChild(addStageButton)
    buttonContainer.appendChild(addEndButton)
    buttonContainer.appendChild(removeStageButton)
    container.appendChild(buttonContainer)
}

// add a new stage to the UI
function addStage(stage, container, secondToLast=false) {
    const stageContainer = document.createElement('div')
    stageContainer.className = 'stages-stage-container'
    stageContainer.id = 'stage-' + stage["stage_id"]
    if (secondToLast) {
        container.insertBefore(stageContainer, container.lastChild)
    } else {
        container.appendChild(stageContainer)//, container.lastChild)
    }
    // top row: stage number and description
    const stageRowTop = document.createElement('div')
    stageRowTop.className = 'stages-stage-row'
    stageContainer.appendChild(stageRowTop)

    // stage number
    const stageNumber = document.createElement('div')
    stageNumber.className = 'stages-stage-id'
    stageNumber.innerHTML = stage["stage_id"]
    stageNumber.style.fontSize = '1.5rem';
    stageRowTop.appendChild(stageNumber)

    // stage description
    const stageDescription = document.createElement('div')
    stageDescription.className = 'stages-stage-text'
    stageDescription.innerHTML = stage["description"]
    stageDescription.contentEditable = true
    stageDescription.oninput = () => {
        console.log("Editing stage description", stage["quest_id"], stage["stage_id"], stageDescription.innerHTML)
        questData[stage["quest_id"]]["stages"][stage["stage_id"]]["description"] = stageDescription.innerHTML
        // save the stage to the DB
    }
    stageRowTop.appendChild(stageDescription)

    // bottom row: other details
    createStageRowBottom(stage, stageContainer)
    return stageContainer
}

// load a quest into the editor
function showQuest(questId) {
    // header
    const infoContainer = document.getElementById("info-container")
    infoContainer.replaceChildren()
    quest = questData[questId]
    infoContainer.appendChild(createInfoMainTitle(quest["quest_name"] + " (" + quest["quest_id"] + ")"))
    infoContainer.appendChild(createInfoNugget('Name', () => { saveQuestToDb(questId) }, true, quest["quest_name"], true))
    infoContainer.appendChild(createInfoNugget('Description', () => { saveQuestToDb(questId) }, true, quest["description"], true))

    // requirements
    infoContainer.appendChild(createInfoSectionTitle('Requirements'))
    const infoRowReqs = document.createElement('div')
    infoRowReqs.className = 'info-row'
    infoRowReqs.appendChild(createInfoNugget('Level Req', (value) => { questData[questId]["level_req"] = value; saveQuestToDb(questId) }, true, quest["level_req"], true))
    infoRowReqs.appendChild(createInfoNugget('Quest Level', (value) => { questData[questId]["quest_level"] = value; saveQuestToDb(questId) }, true, quest["quest_level"], true))
    infoRowReqs.appendChild(createInfoNugget('Requires Class', (value) => { questData[questId]["requires_class"] = value; saveQuestToDb(questId) }, true, quest["requires_class"], true))
    infoRowReqs.appendChild(createInfoNugget('Prerequisite', (value) => { questData[questId]["prerequisite"] = value; saveQuestToDb(questId) }, true, quest["prerequisite"], true))
    infoRowReqs.appendChild(createInfoNugget('Blocked By', (value) => { questData[questId]["blocked_by"] = value; saveQuestToDb(questId) }, true, quest["blocked_by"], true))
    infoRowReqs.appendChild(createInfoNugget('Has Ability', (value) => { questData[questId]["has_ability"] = value; saveQuestToDb(questId) }, true, quest["has_ability"], true))
    infoRowReqs.appendChild(createInfoNugget('Lacks Ability', (value) => { questData[questId]["lacks_ability"] = value; saveQuestToDb(questId) }, true, quest["lacks_ability"], true))
    infoContainer.appendChild(infoRowReqs)

    // rewards
    infoContainer.appendChild(createInfoSectionTitle('Rewards'))
    const infoRow1 = document.createElement('div')
    infoRow1.className = 'info-row'
    infoRow1.appendChild(createInfoNugget('XP Reward', (value) => { questData[questId]["xp_reward"] = value; saveQuestToDb(questId) }, true, quest["xp_reward"], true))
    infoRow1.appendChild(createInfoNugget('Coins Reward', (value) => { questData[questId]["coins_reward"] = value; saveQuestToDb(questId) }, true, quest["coins_reward"], true))
    infoRow1.appendChild(createInfoNugget('Item Reward', (value) => { questData[questId]["item_reward"] = value; saveQuestToDb(questId) }, true, quest["item_reward"], true))
    infoRow1.appendChild(createInfoNugget('Item Count', (value) => { questData[questId]["item_count"] = value; saveQuestToDb(questId) }, true, quest["item_count"], true))
    infoContainer.appendChild(infoRow1)

    // details
    infoContainer.appendChild(createInfoSectionTitle('Details'))
    const infoRowDetails = document.createElement('div')
    infoRowDetails.className = 'info-row'
    infoRowDetails.appendChild(createInfoNugget('Zone', (value) => { questData[questId]["zone"] = value; saveQuestToDb(questId) }, true, quest["zone"], true))
    infoRowDetails.appendChild(createInfoNugget('Repeatable', (value) => { questData[questId]["repeatable"] = value; saveQuestToDb(questId) }, true, quest["repeatable"], true))
    infoRowDetails.appendChild(createInfoNugget('Uses Loot Table', (value) => { questData[questId]["uses_loot_table"] = value; saveQuestToDb(questId) }, true, quest["uses_loot_table"], true))
    infoRowDetails.appendChild(createInfoNugget('Bounty Weight', (value) => { questData[questId]["bounty_weight"] = value; saveQuestToDb(questId) }, true, quest["bounty_weight"], true))
    infoRowDetails.appendChild(createInfoNugget('Quest Type', (value) => { questData[questId]["quest_type"] = value; saveQuestToDb(questId) }, true, quest["quest_type"], true))
    infoContainer.appendChild(infoRowDetails)

    // factions
    infoContainer.appendChild(createInfoSectionTitle('Factions'))
    const infoRowFactions = document.createElement('div')
    infoRowFactions.className = 'info-row'
    infoRowFactions.appendChild(createInfoNugget('Faction ID', (value) => { questData[questId]["faction_id"] = value; saveQuestToDb(questId) }, true, quest["faction_id"], true))
    infoRowFactions.appendChild(createInfoNugget('Faction Level', (value) => { questData[questId]["faction_level"] = value; saveQuestToDb(questId) }, true, quest["faction_level"], true))
    infoRowFactions.appendChild(createInfoNugget('Faction ID Reward', (value) => { questData[questId]["faction_id_reward"] = value; saveQuestToDb(questId) }, true, quest["faction_id_reward"], true))
    infoRowFactions.appendChild(createInfoNugget('Faction Point Reward', (value) => { questData[questId]["faction_point_reward"] = value; saveQuestToDb(questId) }, true, quest["faction_point_reward"], true))
    infoContainer.appendChild(infoRowFactions)

    // stages
    showQuestStages(questId)
}

// get the quest data from the database
function fetchQuestData() {
    document.getElementById('quests-list-reload').innerHTML = 'Quests...'
    getData({"action": "get", "target": "quest_templates"}, receiveQuestTemplateData)
}

function receiveQuestTemplateData(data) {
    // parse the quest data
    questData = {}
    dataSummaries["quests"] = []
    data["message"].forEach(row => {
        let questId = row[0]
        let questName = row[15]
        questData[questId] = {
            "quest_id": questId,
            "level_required": row[1],
            "xp_reward": row[2],
            "coins_reward": row[3],
            "item_reward": row[4],
            "item_count": row[5],
            "prerequesit": row[6],
            "zone": row[7],
            "quest_level": row[8],
            "repeatable": row[9],
            "requires class": row[10], 
            "has_ability": row[11],
            "lacks_ability": row[12],
            "uses_loot_table": row[13],
            "blocked_by": row[14],
            "quest_name": questName,
            "bounty_weight": row[16],
            "quest_type": row[17],
            "faction_id": row[18],
            "faction_level": row[19],
            "faction_id_reward": row[20],
            "faction_point_reward": row[21],
            "description": row[22],
            "stages": []
        }
        dataSummaries["quests"].push({"id": questId, "name": questName})
    })

    // now that we have the quests, let's get the stages
    fetchQuestStageData()

}

// get the quest stage data from the database
function fetchQuestStageData() {
    document.getElementById('quests-list-reload').innerHTML = 'Stages...'
    getData({"action": "get", "target": "quest_stage_templates"}, receiveQuestStageTemplateData)
}


function receiveQuestStageTemplateData(data) {
    // parse the quest stage data
    data["message"].forEach(row => {
        let questId = row[0]
        let stageId = row[1]
        questData[questId]["stages"].push({
            "quest_id": questId,
            "stage_id": stageId,
            "completion_type": row[2],
            "completion_details": row[3],
            "next_stage": row[4],
            "stage_open_sum": row[5],
            "description": row[6]
        })
    })

    // update the search results
    numResults = generateList("quests-list-container", dataSummaries["quests"], showQuest, document.getElementById("quests-list-search-input").value)

    // select the first item in the list
    if (numResults > 0) {
        showQuest(dataSummaries["quests"][0].id)
        highlightListRow("quests", 0)
    }

    // get the mob data
    fetchMobSummaryData()
}