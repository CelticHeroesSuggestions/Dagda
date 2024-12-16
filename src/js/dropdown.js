

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function toggleDropdown(container) {
    container.classList.toggle("show");
}
  
function filterFunction(value, container) {
    var filter, ul, li, a, i;
    filter = value.toLowerCase();
    a = container.getElementsByClassName("dropdown-item");
    for (i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toLowerCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}

function createSearchableDropdown(container, values, callback) {
    // dropdown container
    const dropdownContainer = document.createElement('div')
    dropdownContainer.className = 'dropdown'
    container.appendChild(dropdownContainer)
    
    // dropdown button
    const dropdownButton = document.createElement('button')
    dropdownButton.className = 'dropdown-button-main'
    dropdownButton.innerHTML = 'Choose'
    dropdownButton.onclick = () => {
        toggleDropdown(dropdownContent)
    }
    dropdownContainer.appendChild(dropdownButton)

    // dropdown search/list content
    const dropdownContent = document.createElement('div')
    dropdownContent.className = 'dropdown-content'
    dropdownContainer.appendChild(dropdownContent)

    // dropdown search input
    const dropdownInput = document.createElement('input')
    dropdownInput.id = ''
    dropdownInput.type = 'text'
    dropdownInput.placeholder = 'Search...'
    dropdownInput.classList.add('dropdown-search-box')
    dropdownInput.onkeyup = () => {
        filterFunction(dropdownInput.value, dropdownContent)
    }
    dropdownContent.appendChild(dropdownInput);
    
    // dropdown list items
    values.forEach((item) => {
        let itemString = item[1] + " (" + item[0] + ")"
        const dropdownItem = document.createElement('div')
        dropdownItem.className = 'dropdown-item'
        dropdownItem.innerHTML = itemString
        dropdownContent.appendChild(dropdownItem)
        dropdownItem.onclick = function() {
            dropdownButton.innerHTML = itemString
            dropdownContent.classList.toggle("show")
            callback(item)
        }
    })
}


// create a dropdown
function createDropdown(id, options, selectedOption, onChange) {
    const dropdown = document.createElement('select')
    dropdown.id = id
    dropdown.className = 'info-dropdown'
    dropdown.onchange = onChange
    options.forEach(option => {
        const optionElement = document.createElement('option')
        optionElement.value = option[0]
        optionElement.innerHTML = option[1]
        if (option == selectedOption) {
            optionElement.selected = true
        }
        dropdown.appendChild(optionElement)
    })
    return dropdown
}