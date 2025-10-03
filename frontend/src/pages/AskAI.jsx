import { useState } from "react";
import api from "../utils/axios";

export default function AskAI() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!query.trim()) {
      setMessage("⚠️ Please enter a query.");
      return;
    }

    try {
      setLoading(true);
      setResults([]);
      setMessage("");

      const { data } = await api.post("/api/ai/ask", { query });

      if (data.matchedSections?.length) {
        setResults(data.matchedSections);
      } else {
        setMessage(data.message || "No sections found.");
      }
    } catch (err) {
      setMessage("❌ Error: " + (err.response?.data?.message || "Request failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Search Legal Sections</h1>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a section, law, or keyword..."
        className="w-full border p-2 rounded mb-4"
        rows={4}
      />
      <button
        onClick={askAI}
        disabled={loading}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Loading..." : "Search"}
      </button>

      {message && (
        <div className="mt-4 p-4 bg-gray-100 border rounded">
          {message}
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-4 space-y-4">
          {results.map((sec) => (
            <div key={sec._id} className="p-4 bg-white border rounded shadow">
              <h2 className="font-bold">
                Section {sec.sectionNumber} ({sec.lawType})
              </h2>
              <p className="text-gray-700">{sec.sectionName}</p>
              <p className="text-sm text-gray-600">{sec.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
