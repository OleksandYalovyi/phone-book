import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import JSONStore from "json-store";

const app = express();
const PORT = 3001;
const db = JSONStore(
  "/Users/user/Documents/Pets/phone-book/src/app/server/file.json"
);

app.use(cors());
app.use(bodyParser.json());

app.get("/contacts", (req, res) => {
  const records = db.get("contacts");
  res.json(records);
});

app.post("/contacts", (req, res) => {
  const newContact = req.body;
  const records = db.get("contacts");

  db.set("contacts", [...records, newContact]);

  res.status(201).json(newContact);
});

app.delete("/contacts/:id", (req, res) => {
  const id = Number(req.params.id);

  const records = db.get("contacts");

  db.set(
    "contacts",
    records.filter((contact) => contact.id !== id)
  );

  res.json({ message: "Contact deleted", id }).status(200);
});

app.listen(PORT);
