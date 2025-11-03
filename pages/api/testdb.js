import clientPromise from "@/lib/mongo"; // adjust if your lib path differs

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collections = await db.listCollections().toArray();

    res.status(200).json({
      message: "✅ MongoDB connection successful!",
      collections: collections.map(c => c.name),
    });
  } catch (error) {
    console.error("MongoDB test error:", error);
    res.status(500).json({
      message: "❌ MongoDB connection failed.",
      error: error.message,
    });
  }
}