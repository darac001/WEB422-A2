// pages/admin.js
import { useEffect, useState } from "react";

export default function Admin() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");

  // Fetch all books from backend
  async function fetchBooks() {
    try {
      const res = await fetch("/api/books");
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div id="booksContainer" class="container">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container">
          <a class="navbar-brand" href="#">
            Seneca Library
          </a>
        </div>
      </nav>

      <div className="mb-4">
        <div className=" d-flex mt-4 justify-content-center align-items-center">
          <h5>{editId ? "Edit Book" : "Add New Book"}</h5>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const method = editId ? "PUT" : "POST";
            const url = editId ? `/api/books/${editId}` : "/api/books";

            try {
              const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, author, isbn }),
              });
              const data = await res.json();
              console.log("Book saved:", data);

              // Reset form
              setTitle("");
              setAuthor("");
              setIsbn("");
              setEditId(null);

              // Refresh table
              fetchBooks();
            } catch (err) {
              console.error("Failed to save book:", err);
              alert("Error saving book");
            }
          }}
        >
          <div className="mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="ISBN"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </form>
      </div>

      {loading ? (
        <p>Loading</p>
      ) : books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.isbn}</td>
                <td>{book.borrowed ? "Borrowed" : "Available"}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => {
                        setEditId(book._id);
                        setTitle(book.title);
                        setAuthor(book.author);
                        setIsbn(book.isbn);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={async () => {
                        if (
                          !confirm(
                            `Are you sure you want to delete "${book.title}"?`
                          )
                        )
                          return;

                        try {
                          const res = await fetch(`/api/books/${book._id}`, {
                            method: "DELETE",
                          });
                          const data = await res.json();
                          console.log(data.message);

                          // Refresh table
                          fetchBooks();
                        } catch (err) {
                          console.error("Failed to delete book:", err);
                          alert("Error deleting book");
                        }
                      }}
                    >
                      Delete
                    </button>

                    {book.borrowed ? (
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={async () => {
                          try {
                            const res = await fetch("/api/return", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ bookId: book._id }),
                            });
                            const data = await res.json();
                            console.log(data.message);
                            fetchBooks(); // refresh table
                          } catch (err) {
                            console.error("Failed to return book:", err);
                            alert("Error returning book");
                          }
                        }}
                      >
                        Return
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={async () => {
                          try {
                            const res = await fetch("/api/borrow", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ bookId: book._id }),
                            });
                            const data = await res.json();
                            console.log(data.message);
                            fetchBooks(); // refresh table
                          } catch (err) {
                            console.error("Failed to borrow book:", err);
                            alert("Error borrowing book");
                          }
                        }}
                      >
                        Borrow
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
