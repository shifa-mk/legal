import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function SectionDetails() {
  const { id } = useParams();
  const [section, setSection] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/sections/${id}`)
      .then(res => setSection(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!section) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-3">{section.sectionName}</h2>
      
      <p><b>Section ID:</b> {section._id}</p>
      <p><b>Section Number:</b> {section.sectionNumber}</p>
      <p><b>Law Type:</b> {section.lawType}</p>
      <p><b>Description:</b> {section.description}</p>
      <p><b>Punishment:</b> {section.punishment}</p>

      <div className="mt-4">
        <h3 className="font-semibold">Investigation Steps:</h3>
        <ul className="list-disc ml-6">
          {section.investigationSteps?.map((step, i) => <li key={i}>{step}</li>)}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Required Documents:</h3>
        <ul className="list-disc ml-6">
          {section.requiredDocuments?.map((doc, i) => <li key={i}>{doc}</li>)}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Related Sections:</h3>
        <ul className="list-disc ml-6">
          {section.relatedSections?.map((sec, i) => <li key={i}>{sec}</li>)}
        </ul>
      </div>

      <p className="mt-4">
        <b>Reference:</b>{" "}
        <a href={section.referenceLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          {section.referenceLink}
        </a>
      </p>

      <p className="mt-2"><b>Notes for Police:</b> {section.notesForPolice}</p>

      <div className="mt-4">
        <h3 className="font-semibold">Important Cases:</h3>
        <ul className="list-disc ml-6">
          {section.importantCases?.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      </div>
    </div>
  );
}
