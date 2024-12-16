function handleTopbar(eid, tabElement) {
    Array.from(document.getElementById("main-content").children).forEach(element => {
        if (element.id == eid) {
            element.style.display = "flex"
        }
        else {
            element.style.display = "none"
        }
    })

    Array.from(document.getElementById("topbar-tabs").children).forEach(element => {
        if (element == tabElement) {
            element.style.backgroundColor = "paleturquoise"
        }
        else {
            element.style.backgroundColor = "skyblue"
        }
    })
}