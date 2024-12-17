// global variables for the mob editor
var mobData = {}
var mobDataFetchInterval // interval object for fetching mob data
var mobsListSearchInput = undefined  // search input element

// get the mob data from the database
function fetchMobData() {
    document.getElementById('quests-list-reload').innerHTML = 'Mobs...'
    getData({"action": "get", "target": "mob_templates"}, receiveMobTemplateData)
}

function receiveMobTemplateData(data) {
    // parse the mob data
    mobData = {}
    dataSummaries["mobs"] = []
    data["message"].forEach(row => {
        let mobId = row[0]
        let mobName = row[1]
        mobData[mobId] = {
            "mob_template_id": mobId,
            "mob_name": mobName,
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
            "attack_speed": mobName,
            "energy": row[16],
            "skill_list": row[17],
            "radius": row[18],
            "armour_value": row[19],
            "model_scale": row[20],
            "damage_list": row[21],
            "resistance_list": row[22],
            "mob_power": row[23],
            "max_attack_range": row[24],
            "mob_race": row[25],
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
            "mob_type": row[38],
            "complete_quest_on_death": row[39],
            "stages": []
        }
        dataSummaries["mobs"].push({"id": mobId, "name": mobName})
    })
}

function fetchMobSummaryData() {
    document.getElementById('quests-list-reload').innerHTML = 'Mobs...'
    getData({"action": "get", "target": "mob_templates", "fields": ["mob_template_id", "mob_name"]}, receiveMobSummaryData)
}

function receiveMobSummaryData(data) {
    // parse the item data
    dataSummaries["mobs"] = []
    data["message"].forEach(row => {
        dataSummaries["mobs"].push({"id": row[0], "name": row[1]})
    })

    fetchItemSummaryData()
}
