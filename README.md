## Dagda: Celtic Heroes World Editor

This program is a visual editor for Celtic Heroes' database. It is a SQL and text file generator that enables small edits to quests, items, mobs, and more. It aims to cover general-purpose use cases that are challenging to do by hand.

*NOTE: This tool is not intended for use with the live game, and will not work for the live game. This is just a fun side project to learn SQL and basic UI/UX.*

### Usage

Open `index.html` in your browser and select an editor at the top. Edit the content as you would like, and save the results as a `.txt` file (for the client) and a `.sql` file (for the server).

### Target Editors

* Recipes
* Skills
* Status Effects
* Conversations
* Quests
* Mobs
* Items
* Loot Tables
* Shops
* Token Vendors

### Contributing

Feel free to take on developing an editor. To help with common functionality:

* Claim and develop one editor at a time, add your name next to the editor you are claiming ownership of.
* Each editor has its own div under the `main-content` div in `index.html`, create a new one for the editor you are making.
* Use shared CSS divs where possible so the tool has a common layout, these are in `styles.css`.
* Make an editor-specific CSS file (e.g., `items.css`) for CSS specific to that panel, prefix all classes with `EDITOR-`, e.g., `items-content-lower`.
* In JS, try to use or make sharable widgets where possible.
* Use JSON notation to store data, users should be able to `Import` .json, .sql, or .txt files to mesh to the current data object, make sure to check the file is formatted correctly.
* Each editor should have one `Export` button that saves three files: the .json representation, the .sql DELETE/INSERT lines, and the .txt file for the client.
* Beyond that, you have freedom to design the editor as you'd like :D

### License

*The Unlicense*, or simply, do what you want with this code.

