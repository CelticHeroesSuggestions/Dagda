
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