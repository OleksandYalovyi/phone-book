import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("phonebook");
  const contacts = await db.collection("contacts").find({}).toArray();
  return NextResponse.json(contacts);
}

export async function POST(req) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("phonebook");
    const result = await db.collection("contacts").insertOne(body);
    const [inserted] = await db
      .collection("contacts")
      .find({ _id: new ObjectId(result.insertedId) })
      .toArray();

    console.log(inserted);

    return NextResponse.json(inserted, { status: 201 });
  } catch (e) {
    console.error("Error saving new record", e);
    return NextResponse.json(
      { error: "Failed to save contact" },
      { status: 500 }
    );
  }
}
