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

    const { bookId, userId } = req.body;

    if (!bookId || !ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid bookId" });
    }

    const book = await booksCollection.findOne({ _id: new ObjectId(bookId) });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.borrowed) {
      return res.status(400).json({ message: "Book is already borrowed" });
    }

    await booksCollection.updateOne(
      { _id: new ObjectId(bookId) },
      { $set: { borrowed: true } }
    );

    await transactionsCollection.insertOne({
      bookId: new ObjectId(bookId),    
      borrowDate: new Date(),
      returnDate: null,
    });

    return res.status(200).json({ message: "Book borrowed successfully" });
  } catch (error) {
    console.error("Error in /api/borrow:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
