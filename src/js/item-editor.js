var itemData = {}

function initItemEditor() {
    searchButtonTexts["items"] = 'Reload'

    // overall container
    const itemEditor = document.getElementById("item-editor")
    
    // set up the list and search
    setUpListSection("items", itemEditor, fetchItemData, showItem)
    
    // set up the main info section
    setUpInfoSection("item", itemEditor)

    // set up the stages
    setUpStages(itemEditor)
}

// get the item data from the database
function fetchItemData() {
    document.getElementById('items-list-reload').innerHTML = 'Items...'
    getData({"action": "get", "target": "item_templates"}, receiveItemTemplateData)
}


function receiveItemTemplateData(data) {
    // parse the item data
    itemData = {}
    dataSummaries["items"] = []
    data["message"].forEach(row => {
        let itemId = row[0]
        let itemName = row[1]
        itemData[itemId] = {
            "item_id": itemId,
            "item_name": itemName,
            "stackable": row[2],
            "armour": row[3],
            "equipment_slot": row[4],
            "buy_price": row[5],
            "sell_price": row[6],
            "weight": row[7],
            "attack_speed": row[8],
            "item_sub_type": row[9],
            "no_trade": row[10], 
            "damage_list": row[11],
            "bonus_list": row[12],
            "requirement_list": row[13],
            "class_requirement_list": row[14],
            "skill_id": row[15],
            "skill_level": row[16],
            "attack_range": row[17],
            "missile_id": row[18],
            "missile_speed": row[19],
            "report_back_time_male": row[20],
            "report_back_time_female": row[21],
            "blocks_slots": row[22],
            "proc_skill_id": row[23],
            "proc_skill_level": row[24],
            "proc_skill_chance": row[25],
            "equip_skill_id": row[26],
            "equip_skill_level": row[27],
            "unique_id": row[28],
            "bind_on_equip": row[29],
            "stat_bonus": row[30],
            "ability_bonus": row[31],
            "skill_bonus": row[32],
            "max_charges": row[33],
            "destroy_on_no_charges": row[34],
            "avoidance_bonuses": row[35],
            "immunity_list": row[36],
            "damage_reductions_list": row[37],
            "description": row[38],
            "usable": row[39],
            "icon_id": row[40],
            "female_icon_id": row[41],
            "star_level": row[42],
            "model_id": row[43],
            "mesh": row[44],
            "icon_colour": row[45],
            "model_colour": row[46],
            "important_item": row[47],
            "config_id": row[48],
            "stages": []
        }
        dataSummaries["items"].push({"id": itemId, "name": itemName})
    })

    // update the search button text
    document.getElementById('items-list-reload').innerHTML = searchButtonTexts["items"]

    // update the search results
    numResults = generateList("items", dataSummaries["items"], showItem, document.getElementById("items-list-search-input").value)

    // select the first item in the list
    if (numResults > 0) {
        showItem(dataSummaries["items"][0].id)
        highlightListRow("items", 0)
    }
}

function fetchItemSummaryData() {
    document.getElementById('items-list-reload').innerHTML = 'Items...'
    getData({"action": "get", "target": "item_templates", "fields": ["item_id", "item_name"]}, receiveItemSummaryData)
}

function receiveItemSummaryData(data) {
    // parse the item data
    dataSummaries["items"] = []
    data["message"].forEach(row => {

        dataSummaries["items"].push({"id": row[0], "name": row[1]})
    })

    // update the search button text
    document.getElementById('items-list-reload').innerHTML = searchButtonTexts["items"]
}


// load an item into the editor
function showItem(itemId) {
    // header
    console.log("!!!", itemId, itemData)
    const infoContainer = document.getElementById("item-info-container")
    infoContainer.replaceChildren()
    item = itemData[itemId]
    infoContainer.appendChild(createInfoMainTitle(item["item_name"] + " (" + item["item_id"] + ")"))
    infoContainer.appendChild(createInfoNugget('Name', () => { saveitemToDb(itemId) }, true, item["item_name"], true))
    infoContainer.appendChild(createInfoNugget('Description', () => { saveitemToDb(itemId) }, true, item["description"], true))

    // details
    infoContainer.appendChild(createInfoSectionTitle('Details'))
    const infoRowDetails = document.createElement('div')
    infoRowDetails.className = 'info-row'
    infoRowDetails.appendChild(createInfoNugget('Stackable', (value) => { itemData[itemId]["stackable"] = value; saveitemToDb(itemId) }, true, item["stackable"], true))
    infoRowDetails.appendChild(createInfoNugget('Equipment Slot', (value) => { itemData[itemId]["equipment_slot"] = value; saveitemToDb(itemId) }, true, item["equipment_slot"], true))
    infoRowDetails.appendChild(createInfoNugget('Item Subtype', (value) => { itemData[itemId]["item_sub_type"] = value; saveitemToDb(itemId) }, true, item["item_sub_type"], true))
    infoRowDetails.appendChild(createInfoNugget('No Trade', (value) => { itemData[itemId]["no_trade"] = value; saveitemToDb(itemId) }, true, item["no_trade"], true))
    infoRowDetails.appendChild(createInfoNugget('Buy Price', (value) => { itemData[itemId]["buy_price"] = value; saveitemToDb(itemId) }, true, item["buy_price"], true))
    infoRowDetails.appendChild(createInfoNugget('Sell Price', (value) => { itemData[itemId]["sell_price"] = value; saveitemToDb(itemId) }, true, item["sell_price"], true))
    infoRowDetails.appendChild(createInfoNugget('Unique ID', (value) => { itemData[itemId]["unique_id"] = value; saveitemToDb(itemId) }, true, item["unique_id"], true))
    infoRowDetails.appendChild(createInfoNugget('Bind on Equip', (value) => { itemData[itemId]["bind_on_equip"] = value; saveitemToDb(itemId) }, true, item["bind_on_equip"], true))
    infoRowDetails.appendChild(createInfoNugget('Blocks Slots', (value) => { itemData[itemId]["blocks_slots"] = value; saveitemToDb(itemId) }, true, item["blocks_slots"], true))
    infoRowDetails.appendChild(createInfoNugget('Important Item', (value) => { itemData[itemId]["important_item"] = value; saveitemToDb(itemId) }, true, item["important_item"], true))
    infoRowDetails.appendChild(createInfoNugget('Config ID', (value) => { itemData[itemId]["config_id"] = value; saveitemToDb(itemId) }, true, item["config_id"], true))
    infoContainer.appendChild(infoRowDetails)

    // visuals
    infoContainer.appendChild(createInfoSectionTitle('Visuals'))
    const infoRowVisuals = document.createElement('div')
    infoRowVisuals.className = 'info-row'
    infoRowVisuals.appendChild(createInfoNugget('Default Icon ID', () => { saveitemToDb(itemId) }, true, item["icon_id"], true))
    infoRowVisuals.appendChild(createInfoNugget('Female Icon ID', () => { saveitemToDb(itemId) }, true, item["icon_id"], true))
    infoRowVisuals.appendChild(createInfoNugget('Icon Colour', () => { saveitemToDb(itemId) }, true, item["icon_colour"], true))
    infoRowVisuals.appendChild(createInfoNugget('Star Level', () => { saveitemToDb(itemId) }, true, item["star_level"], true))
    infoRowVisuals.appendChild(createInfoNugget('Model ID', () => { saveitemToDb(itemId) }, true, item["model_id"], true))
    infoRowVisuals.appendChild(createInfoNugget('Model Colour', () => { saveitemToDb(itemId) }, true, item["model_colour"], true))
    infoRowVisuals.appendChild(createInfoNugget('Mesh', () => { saveitemToDb(itemId) }, true, item["mesh"], true))
    infoContainer.appendChild(infoRowVisuals)

    // requirements
    infoContainer.appendChild(createInfoSectionTitle('Requirements'))
    const infoRowReqs = document.createElement('div')
    infoRowReqs.className = 'info-row'
    infoRowReqs.appendChild(createInfoNugget('Level Req', (value) => { itemData[itemId]["level_req"] = value; saveitemToDb(itemId) }, true, item["level_req"], true))
    infoRowReqs.appendChild(createInfoNugget('Max Level', (value) => { itemData[itemId]["max_level"] = value; saveitemToDb(itemId) }, true, item["max_level"], true))
    infoRowReqs.appendChild(createInfoNugget('item Level', (value) => { itemData[itemId]["item_level"] = value; saveitemToDb(itemId) }, true, item["item_level"], true))
    infoRowReqs.appendChild(createInfoNugget('Requires Class', (value) => { itemData[itemId]["requires_class"] = value; saveitemToDb(itemId) }, true, item["requires_class"], true))
    infoRowReqs.appendChild(createInfoNugget('Prerequisite', (value) => { itemData[itemId]["prerequisite"] = value; saveitemToDb(itemId) }, true, item["prerequisite"], true))
    infoRowReqs.appendChild(createInfoNugget('Blocked By', (value) => { itemData[itemId]["blocked_by"] = value; saveitemToDb(itemId) }, true, item["blocked_by"], true))
    infoRowReqs.appendChild(createInfoNugget('Has Ability', (value) => { itemData[itemId]["has_ability"] = value; saveitemToDb(itemId) }, true, item["has_ability"], true))
    infoRowReqs.appendChild(createInfoNugget('Lacks Ability', (value) => { itemData[itemId]["lacks_ability"] = value; saveitemToDb(itemId) }, true, item["lacks_ability"], true))
    infoRowReqs.appendChild(createInfoNugget('Requirement List', (value) => { itemData[itemId]["lacks_ability"] = value; saveitemToDb(itemId) }, true, item["lacks_ability"], true))
    infoContainer.appendChild(infoRowReqs)

    // stats
    infoContainer.appendChild(createInfoSectionTitle('Stats'))
    const infoRow1 = document.createElement('div')
    infoRow1.className = 'info-row'
    infoRow1.appendChild(createInfoNugget('Weight', (value) => { itemData[itemId]["weight"] = value; saveitemToDb(itemId) }, true, item["weight"], true))
    infoRow1.appendChild(createInfoNugget('Damage List', (value) => { itemData[itemId]["damage_list"] = value; saveitemToDb(itemId) }, true, item["damage_list"], true))
    infoRow1.appendChild(createInfoNugget('Bonus List', (value) => { itemData[itemId]["bonus_list"] = value; saveitemToDb(itemId) }, true, item["bonus_list"], true))
    infoRow1.appendChild(createInfoNugget('Stat Bonus', (value) => { itemData[itemId]["stat_bonus"] = value; saveitemToDb(itemId) }, true, item["stat_bonus"], true))
    infoRow1.appendChild(createInfoNugget('Ability Bonus', (value) => { itemData[itemId]["ability_bonus"] = value; saveitemToDb(itemId) }, true, item["ability_bonus"], true))
    infoRow1.appendChild(createInfoNugget('Equip Skill ID', (value) => { itemData[itemId]["equip_skill_id"] = value; saveitemToDb(itemId) }, true, item["equip_skill_id"], true))
    infoRow1.appendChild(createInfoNugget('Equip Skill Level', (value) => { itemData[itemId]["equip_skill_level"] = value; saveitemToDb(itemId) }, true, item["equip_skill_level"], true))
    infoContainer.appendChild(infoRow1)

    // item
    infoContainer.appendChild(createInfoSectionTitle('Item'))
    const infoRowItem = document.createElement('div')
    infoRowItem.className = 'info-row'
    infoRowItem.appendChild(createInfoNugget('Usable', (value) => { itemData[itemId]["usable"] = value; saveitemToDb(itemId) }, true, item["usable"], true))
    infoRowItem.appendChild(createInfoNugget('Use Skill Bonus', (value) => { itemData[itemId]["use_skill_bonus"] = value; saveitemToDb(itemId) }, true, item["use_skill_bonus"], true))
    infoRowItem.appendChild(createInfoNugget('Use Skill ID', (value) => { itemData[itemId]["use_skill_id"] = value; saveitemToDb(itemId) }, true, item["use_skill_id"], true))
    infoRowItem.appendChild(createInfoNugget('Use Skill Level', (value) => { itemData[itemId]["use_skill_level"] = value; saveitemToDb(itemId) }, true, item["use_skill_level"], true))
    infoContainer.appendChild(infoRowItem)

    // weapon
    infoContainer.appendChild(createInfoSectionTitle('Weapon'))
    const infoRowWeapon = document.createElement('div')
    infoRowWeapon.className = 'info-row'
    infoRowWeapon.appendChild(createInfoNugget('Attack Speed', (value) => { itemData[itemId]["attack_speed"] = value; saveitemToDb(itemId) }, true, item["attack_speed"], true))
    infoRowWeapon.appendChild(createInfoNugget('Attack Range', (value) => { itemData[itemId]["attack_range"] = value; saveitemToDb(itemId) }, true, item["attack_range"], true))
    infoRowWeapon.appendChild(createInfoNugget('Missile ID', (value) => { itemData[itemId]["missile_id"] = value; saveitemToDb(itemId) }, true, item["missile_id"], true))
    infoRowWeapon.appendChild(createInfoNugget('Missile Speed', (value) => { itemData[itemId]["missile_speed"] = value; saveitemToDb(itemId) }, true, item["missile_speed"], true))
    infoRowWeapon.appendChild(createInfoNugget('Report Back Time (Male)', (value) => { itemData[itemId]["report_back_time"] = value; saveitemToDb(itemId) }, true, item["report_back_time"], true))
    infoRowWeapon.appendChild(createInfoNugget('Report Back Time (Female)', (value) => { itemData[itemId]["report_back_time_female"] = value; saveitemToDb(itemId) }, true, item["report_back_time_female"], true))
    infoContainer.appendChild(infoRowWeapon)

    // armour
    infoContainer.appendChild(createInfoSectionTitle('Armour'))
    const infoRowArmor = document.createElement('div')
    infoRowArmor.className = 'info-row'
    infoRowArmor.appendChild(createInfoNugget('Armour', (value) => { itemData[itemId]["armour"] = value; saveitemToDb(itemId) }, true, item["armour"], true))
    infoRowArmor.appendChild(createInfoNugget('Avoidance Bonus', (value) => { itemData[itemId]["avoidance_bonus"] = value; saveitemToDb(itemId) }, true, item["avoidance_bonus"], true))
    infoRowArmor.appendChild(createInfoNugget('Immunity List', (value) => { itemData[itemId]["immunity_list"] = value; saveitemToDb(itemId) }, true, item["immunity_list"], true))
    infoRowArmor.appendChild(createInfoNugget('Damage Reductions List', (value) => { itemData[itemId]["damage_reductions_list"] = value; saveitemToDb(itemId) }, true, item["damage_reductions_list"], true))
    infoContainer.appendChild(infoRowArmor)

    // proc
    infoContainer.appendChild(createInfoSectionTitle('Proc'))
    const infoRowProc = document.createElement('div')
    infoRowProc.className = 'info-row'
    infoRowProc.appendChild(createInfoNugget('Proc Skill ID', (value) => { itemData[itemId]["proc_skill_id"] = value; saveitemToDb(itemId) }, true, item["proc_skill_id"], true))
    infoRowProc.appendChild(createInfoNugget('Proc Skill Level', (value) => { itemData[itemId]["proc_skill_level"] = value; saveitemToDb(itemId) }, true, item["proc_skill_level"], true))
    infoRowProc.appendChild(createInfoNugget('Proc Skill Chance', (value) => { itemData[itemId]["proc_skill_chance"] = value; saveitemToDb(itemId) }, true, item["proc_skill_chance"], true))
    infoRowProc.appendChild(createInfoNugget('Max Charges', (value) => { itemData[itemId]["max_charges"] = value; saveitemToDb(itemId) }, true, item["max_charges"], true))
    infoRowProc.appendChild(createInfoNugget('Destroy on No Charges', (value) => { itemData[itemId]["destroy_on_no_charges"] = value; saveitemToDb(itemId) }, true, item["destroy_on_no_charges"], true))
    infoContainer.appendChild(infoRowProc)

    // effects
    // showItemEffects(itemId)
}