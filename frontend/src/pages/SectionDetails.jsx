import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function SectionDetails() {
  const { id } = useParams();
  const [section, setSection] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/sections/${id}`)
      .then((res) => setSection(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!section)
    return <p className="p-6 text-gray-500 font-medium">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-blue-900 text-white rounded-lg p-6 shadow-md">
        <h2 className="text-3xl font-bold">{section.sectionName}</h2>
        <p className="mt-1 text-gray-200">
          Section {section.sectionNumber} | {section.lawType}
        </p>
      </div>

      {/* Description & Punishment */}
      <div className="bg-white rounded-lg shadow p-6 space-y-3">
        <h3 className="text-xl font-semibold">Description</h3>
        <p className="text-gray-700">{section.description}</p>

        <h3 className="text-xl font-semibold mt-4">Punishment</h3>
        <p className="text-red-600 font-medium">{section.punishment}</p>
      </div>

      {/* Investigation Steps */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-2">Investigation Steps</h3>
        <ul className="list-decimal list-inside space-y-1 text-gray-700">
          {section.investigationSteps?.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ul>
      </div>

      {/* Required Documents */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-2">Required Documents</h3>
        <div className="flex flex-wrap gap-2">
          {section.requiredDocuments?.map((doc, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {doc}
            </span>
          ))}
        </div>
      </div>

      {/* Related Sections */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-2">Related Sections</h3>
        <div className="flex flex-wrap gap-2">
          {section.relatedSections?.map((sec, i) => (
            <span
              key={i}
              className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {sec}
            </span>
          ))}
        </div>
      </div>

      {/* Reference */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold">Reference</h3>
        <a
          href={section.referenceLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {section.referenceLink}
        </a>
      </div>

      {/* Notes for Police */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold">Notes for Police</h3>
        <p className="text-gray-700">{section.notesForPolice}</p>
      </div>

      {/* Important Cases */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-3">Important Cases</h3>
        <ul className="space-y-2">
          {section.importantCases?.map((c) => (
            <li
              key={c._id}
              className="border-l-4 border-blue-500 pl-3 py-2 bg-blue-50 rounded"
            >
              <p className="font-semibold text-gray-800">{c.caseName}</p>
              <p className="text-gray-600 text-sm">{c.citation}</p>
              <p className="text-gray-700">{c.summary}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
