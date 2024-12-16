function setUpInfoSection(category, container) {
    const infoContainer = document.createElement('div')
    infoContainer.className = 'info-container'
    infoContainer.id = 'info-container'

    // create a default message in the info container
    const infoPlaceholder = document.createElement('div')
    infoPlaceholder.className = 'info-placeholder'
    infoPlaceholder.innerHTML = 'Select a ' + category + ' to view its details.'
    infoContainer.appendChild(infoPlaceholder)
    container.appendChild(infoContainer)
}