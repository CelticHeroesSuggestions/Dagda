const itemData = {}

function initItemEditor() {
    const itemsList = document.createElement('div');
    itemsList.id = 'items-list';
    itemsList.className = 'list-container';

    const infoContainer = document.createElement('div');
    infoContainer.className = 'info-container';

    infoContainer.appendChild(createInfoNugget('ID', false, '192837'));
    infoContainer.appendChild(createInfoNugget('Name', true));
    infoContainer.appendChild(createInfoNugget('Description', true));
    infoContainer.appendChild(createInfoNugget('Strength', true));
    infoContainer.appendChild(createInfoNugget('Dexterity', true));
    infoContainer.appendChild(createInfoNugget('Focus', true));
    infoContainer.appendChild(createInfoNugget('Vitality', true));
    infoContainer.appendChild(createInfoNugget('Attack', true));
    infoContainer.appendChild(createInfoNugget('Defense', true));
    infoContainer.appendChild(createInfoNugget('Health', true));
    infoContainer.appendChild(createInfoNugget('Energy', true));
    infoContainer.appendChild(createInfoNugget('Spell Evasion', true));
    infoContainer.appendChild(createInfoNugget('Physical Evasion', true));
    infoContainer.appendChild(createInfoNugget('Wounding Evasion', true));
    infoContainer.appendChild(createInfoNugget('Debuff Evasion', true));
    infoContainer.appendChild(createInfoNugget('Movement Evasion', true));

    const itemEditor = document.getElementById("item-editor")
    itemEditor.appendChild(itemsList);
    itemEditor.appendChild(infoContainer);
}


// get the item data from the database
function fetchItemData() {
    document.getElementById('quests-list-reload').innerHTML = 'Items...'
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
            "item_template_id": itemId,
            "item_name": itemName,
            "aggro_range": row[2],
            "follow_range": row[3],
            "faction_id": row[4],
            "opinion_base": row[5],
            "level": row[6],
            "hitpoints": row[7],
            "loot_table": row[8],
            "min_coins": row[9],
            "max_coins": row[10], 
            "kills_per_level": row[11],
            "conversation_id": row[12],
            "attack": row[13],
            "defence": row[14],
            "attack_speed": itemName,
            "energy": row[16],
            "skill_list": row[17],
            "radius": row[18],
            "armour_value": row[19],
            "model_scale": row[20],
            "damage_list": row[21],
            "resistance_list": row[22],
            "item_power": row[23],
            "max_attack_range": row[24],
            "item_race": row[25],
            "missile_speed": row[26],
            "report_back_time": row[27],
            "ai_template_id": row[28],
            "xp": row[29],
            "num_drops": row[30],
            "perm_status_effects": row[31],
            "blocks_attacks": row[32],
            "avoidance_ratings": row[33],
            "spot_hidden": row[34],
            "immunity_list": row[35],
            "damage_reductions_list": row[36],
            "no_ability_test": row[37],
            "item_type": row[38],
            "complete_quest_on_death": row[39],
            "stages": []
        }
        dataSummaries["items"].push({"id": itemId, "name": itemName})
    })

    // update the search button text
    document.getElementById('quests-list-reload').innerHTML = searchButtonTexts["quests"]
}

function fetchItemSummaryData() {
    document.getElementById('quests-list-reload').innerHTML = 'Items...'
    getData({"action": "get", "target": "item_templates", "fields": ["item_id", "item_name"]}, receiveItemSummaryData)
}

function receiveItemSummaryData(data) {
    // parse the item data
    dataSummaries["items"] = []
    data["message"].forEach(row => {
        dataSummaries["items"].push({"id": row[0], "name": row[1]})
    })

    // update the search button text
    document.getElementById('quests-list-reload').innerHTML = searchButtonTexts["quests"]
}
