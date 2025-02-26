Google Sheets Clone

A web-based spreadsheet application that mimics the core functionalities of Google Sheets. It includes data entry, mathematical functions, data validation, and visualization using charts.

Tech Stack

Frontend
• React.js – Provides a component-based UI, making it easy to update and manage state efficiently.
• Handsontable – A feature-rich spreadsheet library for handling tabular data with Excel-like interactions.
• Chart.js – Used for data visualization, enabling users to create bar and line charts dynamically.
• Vite – A fast build tool that improves performance during development.

State Management
• React Hooks (useState, useEffect, useRef) – Handles component state and side effects, keeping the UI interactive and responsive.

    Data Structures Used

1. Arrays
   • Why? Used for storing and manipulating spreadsheet data efficiently.
   • Where? Handsontable stores grid data as a 2D array, allowing quick access and modification of cell values.

2. Objects
   • Why? Helps in structuring spreadsheet configurations, styles, and cell metadata.
   • Where? Chart.js datasets and settings are stored as objects for dynamic chart rendering.

3. Hash Maps (Objects in JavaScript)
   • Why? Fast lookups for storing cell dependencies and validation rules.
   • Where? Used in Find & Replace, where key-value pairs map old values to new ones.

Features

✔️ Spreadsheet Interface – Supports adding/removing rows and columns, formatting, and formulas.
✔️ Mathematical Operations – SUM, AVERAGE, MIN, MAX, COUNT functions.
✔️ Data Quality Tools – TRIM, UPPER, LOWER, REMOVE_DUPLICATES.
✔️ Find & Replace – Quickly modify multiple values across the sheet.
✔️ Chart Generation – Convert spreadsheet data into dynamic charts.
✔️ Save & Load Data – Export and import spreadsheet content in JSON format.


Why These Technologies?
	•	React.js for performance and modularity.
	•	Handsontable for a pre-built spreadsheet experience.
	•	Chart.js for effortless data visualization.
	•	Vite for fast builds and improved development experience.