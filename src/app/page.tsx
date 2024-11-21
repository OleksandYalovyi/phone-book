"use client";
import { useEffect, useState } from "react";

type Record = {
  _id: string;
  fullName: string;
  phone: string;
};

const newRecordInit = {
  _id: "",
  fullName: "",
  phone: "",
};

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export default function Home() {
  const [records, setRecords] = useState<Record[]>([]);
  const [newRecord, setNewRecord] = useState<Record>(newRecordInit as Record);

  useEffect(() => {
    const fetchRecords = async () => {
      const res = await fetch(`/api/contacts`);
      const contactsRes = await res.json();
      console.log(contactsRes);

      setRecords(contactsRes);
    };

    fetchRecords();
  }, []);

  const handleChange = (key: string) => (e) => {
    setNewRecord((prevV) => ({
      ...prevV,
      [key]: e.target.value,
    }));
  };

  const handleAdd = async () => {
    const recordToAdd = {
      fullName: newRecord.fullName.trim(),
      phone: newRecord.phone.trim(),
    };

    if (
      !recordToAdd.fullName ||
      !recordToAdd.phone ||
      !phoneRegex.test(recordToAdd.phone)
    ) {
      return alert("Fill correct data please!");
    }

    const res = await fetch(`/api/contacts`, {
      method: "POST",
      body: JSON.stringify(recordToAdd),
      headers: {
        "Content-Type": "application/json", // Specify JSON format
      },
    });

    if (!res.ok) {
      return alert("Something went wrong!");
    }

    const created = await res.json();

    setRecords((prevRecords) => [...prevRecords, created]);
    setNewRecord(newRecordInit);
  };

  const removeRecord = async (_id: string) => {
    const res = await fetch(`/api/contacts/${_id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      return alert("Something went wrong");
    }

    setRecords((prevRecords) => prevRecords.filter((r) => r._id !== _id));
  };

  return (
    <main className="p-6 bg-gray-200 min-h-screen w-1/2 mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Records Table</h1>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          value={newRecord.fullName}
          onChange={handleChange("fullName")}
          placeholder="Add a fullName"
          className="flex-grow border border-gray-300 rounded-md px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          value={newRecord.phone}
          onChange={handleChange("phone")}
          placeholder="Add a phone"
          className="flex-grow border border-gray-300 rounded-md px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Add Record
        </button>
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">FullName</th>
            <th className="px-4 py-3 text-left">Phone</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map(({ _id, fullName, phone }, index) => (
              <tr
                key={_id}
                className="odd:bg-gray-100 even:bg-white hover:bg-blue-100 transition-colors"
              >
                <td className="px-4 py-3 text-black">{index + 1}</td>
                <td className="px-4 py-3 text-black">{fullName}</td>
                <td className="px-4 py-3 text-black">{phone}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => removeRecord(_id)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-3 text-center text-gray-500 italic"
              >
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
