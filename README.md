# Library Management System

Library management system built with Next.js, React, MongoDB, and Bootstrap.
Allows full CRUD operations on books and supports borrow/return transactions.

## Features

- Add new books
- Edit existing books
- Delete books
- Borrow and return books
- Integrated with MongoDB
- Full frontend using Next.js pages and React hooks

## Installation

1. Clone this repo or download zip: https://github.com/darac001/WEB422-A2.git
2. Navigate to the project folder: cd my-app
3. Install dependencies: npm install
4. Run the development server: npm run dev
   Open your browser at http://localhost:3000

## API Endpoints

All APIs are under /api in Next.js API routes:

- GET /api/books – Retrieve all books
- POST /api/books – Add a new book (JSON body: title, author, isbn)
- GET /api/books/:id – Retrieve a book by ID
- PUT /api/books/:id – Update a book by ID (JSON body: fields to update)
- DELETE /api/books/:id – Delete a book by ID
- POST /api/borrow – Borrow a book (JSON body: bookId)
- POST /api/return – Return a book (JSON body: bookId)

Frontend Usage

- Main Page: Lists all books with options to add, edit, or delete
- Add/Edit Form: Fill in title, author, and ISBN; submit to create or update books
- Borrow/Return: Use the buttons on each book entry to borrow or return books

All actions are connected to the backend APIs via React fetch calls. Next.js automatically parses JSON request bodies.
Error handling is implemented in API routes
