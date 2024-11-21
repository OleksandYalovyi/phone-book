import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(req, { params }) {
  try {
    const id = (await params).id;

    if (!id) {
      return NextResponse.json(
        {
          error: "Not specified id",
        },
        {
          status: 400,
        }
      );
    }

    const client = await clientPromise;
    const db = client.db("phonebook");
    const result = await db.collection("contacts").deleteOne({
      _id: new ObjectId(id),
    });

    console.log(result);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        ({
          error: "Contact not found",
        },
        {
          status: 404,
        })
      );
    }

    return NextResponse.json(
      { message: "Contact deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting record", error);
    return NextResponse.json(
      {
        error: "Failed to delete a contact",
      },
      {
        status: 500,
      }
    );
  }
}
