import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongo";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const client = await clientPromise;
    const db = client.db("WEB422");
    const booksCollection = db.collection("books");
    const transactionsCollection = db.collection("transactions");

    const { bookId } = req.body;

    if (!bookId || !ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid or missing bookId" });
    }

    // Check if book exists
    const book = await booksCollection.findOne({ _id: new ObjectId(bookId) });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Mark book as returned
    await booksCollection.updateOne(
      { _id: new ObjectId(bookId) },
      { $set: { borrowed: false } }
    );

    // Update the latest open transaction
    await transactionsCollection.updateOne(
      { bookId: new ObjectId(bookId), returnDate: null },
      { $set: { returnDate: new Date() } }
    );

    return res.status(200).json({ message: "Book returned successfully" });
  } catch (error) {
    console.error("Error in /api/return:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}