# HTML, CSS & JavaScript Training Projects

A collection of small front-end projects built with plain HTML, CSS, and JavaScript. Each project is self-contained and can be opened directly in a browser.

## Projects

| Project | Description | Key features |
| --- | --- | --- |
| 1. Quiz Game | A short multiple-choice web-development quiz. | Question screens, score tracking, answer feedback, progress bar, and restart option. |
| 2. Color Palette Generator | Generates a new five-colour palette on demand. | Random hexadecimal colours and one-click colour copying. |
| 3. Kanban Board | A simple task-management board. | Add tasks and drag cards between To Do, In Progress, and Done columns. |
| 4. Expense Tracker | Records income and expenses. | Live balance calculations, transaction deletion, input validation, and browser storage. |
| 5. Bookmark Saver | Saves useful website links. | URL validation, opening links in a new tab, deletion, and browser storage. |
| 6. Form Validator | A responsive account-registration form. | Username, email, and password validation plus accessible show/hide password eye controls. |
| 7. Password Generator | Creates passwords based on selected character types. | Adjustable length, uppercase/lowercase/number/symbol options, strength indicator, and clipboard copying. |
| 8. Todo App | Dynamic task management with local persistence. | Task creation, completion toggles, deletion, filtering (All/Active/Completed), and localStorage sync. |
| 9. Contact Form | Accessible contact form with real-time feedback. | Input validation, accessible ARIA live status region, and responsive styling with Font Awesome icons. |
| 10. Pricing Cards | Interactive subscription pricing table. | Monthly/annual billing toggle with 20% discount calculation, animated pricing, accessible checkout modal, and keyboard support. |
| 11. Team Members Showcase | Searchable and filterable team gallery. | Live search, department filtering tabs, detailed member profile modal, open careers modal, and toast feedback. |
| 12. Recipe Finder | Global recipe discovery powered by TheMealDB API. | Real-time search, asynchronous fetch, ingredient breakdown, step-by-step directions, and YouTube video tutorials. |

## Run a project locally

1. Open the folder for a project inside `15 projects`.
2. Open its `index.html` file in a browser, or use the VS Code Live Server extension.

For example, to run the Bookmark Saver, open:

```text
15 projects/project 5/index.html
```

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- `localStorage` for data persistence in Projects 4 and 5

## Deployment note

When deploying an individual project to Vercel, set the Vercel **Root Directory** to that project folder - for example, `15 projects/project 5`. The entry file must be named `index.html` in lowercase.
