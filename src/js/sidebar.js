
// compile the completion details across rows for a stage
function compileBasicKeyValueSet(container) {
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
    return results;
}