import clientPromise from "@/lib/mongo";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("WEB422");
    const booksCollection = db.collection("books");

    switch (req.method) {
      // Retrieve all books
      case "GET": {
        const books = await booksCollection.find({}).toArray();
        return res.status(200).json(books);
      }

      // Add a new book
      case "POST": {
        const newBook = req.body;

        if (!newBook.title || !newBook.author) {
          return res.status(400).json({ message: "Title and author are required" });
        }

        const result = await booksCollection.insertOne({
          title: newBook.title,
          author: newBook.author,
          isbn: newBook.isbn || "",
          borrowed: false,
        });

        return res.status(201).json({
          message: "Book added successfully",
          bookId: result.insertedId,
        });
      }

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error in /api/books:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}