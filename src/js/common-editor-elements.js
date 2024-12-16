const createInfoNugget = (title, callback=null, isInput = false, text = '', shrink = false,) => {
    // overall property container
    const infoNugget = document.createElement('div');
    infoNugget.className = 'info-nugget';

    // left side text
    const infoTitle = document.createElement('div');
    infoTitle.className = 'info-title';
    infoTitle.innerHTML = "<b>" + title + "</b>";
    if (shrink) {  // makes the width not fixed
        infoTitle.style.width = 'auto';
    }
    infoNugget.appendChild(infoTitle);

    // right side text (property value)
    const infoText = document.createElement('div');
    infoNugget.appendChild(infoText);
    infoText.className = 'info-text';
    infoText.innerHTML = text;

    // if text is empty, shade it grey
    if (infoText.innerHTML == "") {
        infoText.style.backgroundColor = "lightgrey";
    }

    // if able to edit the property value, create a hidden input box
    if (isInput) {
        infoText.contentEditable = true;
        infoText.style.borderBottom = "1px solid skyblue";
        infoText.style.alignItems = "center";
        // add the input div, this is a hidden input so the input box width fits the content
        const textInput = document.createElement('input');
        textInput.type = "hidden"
        textInput.value = text;
        infoNugget.appendChild(textInput);

        // set the input handler
        infoText.addEventListener("input", function(e) {
            // if baseline text is a number and the input does not have a number, ignore the input
            if (text != null && !isNaN(text) && text !== '' && textInput.value != "" && e.target.innerHTML != '<br>' && isNaN(e.target.innerHTML)) {
                console.log("reverting")
                e.target.innerHTML = textInput.value;  // revert the text to the previous input
                return;
            }
            // if text is empty, shade it grey
            if (e.target.innerHTML == "" || e.target.innerHTML == "<br>") {
                e.target.style.backgroundColor = "lightgrey";
            }
            else {
                e.target.style.backgroundColor = "";  // revert the background color
            }
            textInput.value = e.target.innerHTML;  // change the input to the new text
            if (callback) {
                callback(textInput.value);  // call the callback function with the new text
            }
        }, false);
    }


    return infoNugget;
};

const createInfoMainTitle = (title) => {
    const infoSectionTitle = document.createElement('div');
    infoSectionTitle.className = 'info-main-title';
    infoSectionTitle.textContent = title;
    return infoSectionTitle;
}

const createInfoSectionTitle = (title) => {
    const infoSectionTitle = document.createElement('div');
    infoSectionTitle.className = 'info-section-title';
    infoSectionTitle.textContent = title;
    return infoSectionTitle;
}
