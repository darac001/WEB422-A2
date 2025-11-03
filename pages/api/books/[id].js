import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongo";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid book ID" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("WEB422");
    const booksCollection = db.collection("books");

    switch (req.method) {
      // GET a single book
      case "GET": {
        const book = await booksCollection.findOne({ _id: new ObjectId(id) });
        if (!book) return res.status(404).json({ message: "Book not found" });
        return res.status(200).json(book);
      }

      // UPDATE a book
      case "PUT": {
        const updateData = req.body;
        const result = await booksCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );

        if (result.matchedCount === 0)
          return res.status(404).json({ message: "Book not found" });

        return res.status(200).json({ message: "Book updated successfully" });
      }

      // DELETE a book
      case "DELETE": {
        const result = await booksCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0)
          return res.status(404).json({ message: "Book not found" });

        return res.status(200).json({ message: "Book deleted successfully" });
      }

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error in /api/books/[id]:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}