function getData(data, callback) {
    result = []
    fetch("/data", {
        method: "POST", // HTTP method
        headers: {
            "Content-Type": "application/json", // Specify JSON content
        },
        body: JSON.stringify(data), // Convert JavaScript object to JSON string
    })
        .then(response => response.json()) // Parse JSON response
        .then(data => {
            callback(data)
        })
    return result
}

function saveQuestToDb(questId) {
    getData({"action": "set", "target": "quest", "data": questData[questId]})
}

// remove all rows after row N
function removeRowsAfterN(container, n) {
    while (container.children.length > n) {
        container.lastChild.remove()
    }
}

// get value by ID
function getValueById(values, id) {
    return values.find(value => value[0] == id)
}