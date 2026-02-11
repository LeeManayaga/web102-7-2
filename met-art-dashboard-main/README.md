# Web Development Project 6 - The Met Art Dashboard

Submitted by: **Carmen Wu Feng**

This web app is an interactive dashboard that displays artwork from The Metropolitan Museum of Art using their public API. Users can browse artworks, view individual detail pages, and explore visual data representations that show how works vary across medium and historical period. The dashboard includes search, filtering, and a chart toggle feature.

Time spent: **~16 hours** in total

---

## Required Features

The following **required** functionality is completed:

- [x] **Clicking on an item in the list view displays more details about it**
  - Clicking an artwork card navigates to a *detail view*
  - The detail view includes additional information such as dimensions, repository, full-size image, etc.
  - The **same sidebar is displayed** on both the dashboard and detail view pages

- [x] **Each detail view of an item has a direct, unique URL link**
  - Example: `/art/436532`
  - The detail page can be shared or accessed directly via the URL

- [x] **Two unique charts are included to visualize the data**
  - **Chart 1:** Distribution of artworks by *type* (Painting, Print, Sculpture, Ceramic)
  - **Chart 2:** Distribution of artworks by *century*
  - Each chart highlights a different aspect of the dataset

---

## Optional Features

The following **optional** features are implemented:

- [x] The dashboard includes **explanatory paragraph descriptions** that highlight insights from the data
- [x] Users can **toggle between** the two data visualizations (Type Chart ↔ Century Chart)

---

## Additional Features

- [x] The detail view includes a **mini comparison chart** showing how many other artworks come from the same century
- [x] Fully responsive layout with a persistent sidebar
- [x] Clean, museum–inspired visual styling

---

## 🎥 Video Walkthrough

<img src="./walkthrough3.gif" width="600"/>

---

## 📝 Notes

Challenges Encountered:

The Met API dataset sometimes returns missing or incomplete values, so fallback values and conditional checks were necessary.

Ensuring the sidebar remains persistent on the detail page required reorganizing the page layout.

The first submission lost points because the recording did not show the browser URL bar or the sidebar on the detail page — this version corrects both issues.

---

## ⚖️ License

Copyright 2025
Carmen Wu Feng

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at:

    http://www.apache.org/licenses/LICENSE-2.0
