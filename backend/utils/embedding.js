import crypto from "crypto";

// Generate a vector for text
export const embedText = async (text) => {
  const words = text.toLowerCase().split(/\s+/);
  const vector = Array(16).fill(0); // smaller vector, easier to debug
  for (const w of words) {
    const hash = crypto.createHash("md5").update(w).digest("hex"); // hex string
    for (let i = 0; i < vector.length; i++) {
      const chunk = parseInt(hash.substr(i * 2, 2), 16); // convert each byte
      vector[i] += chunk;
    }
  }
  const norm = Math.sqrt(vector.reduce((s, v) => s + v * v, 0));
  if (norm === 0) return vector.map(() => 0); // avoid division by 0
  return vector.map((v) => v / norm);
};

// Cosine similarity
export const cosineSimilarity = (a, b) => {
  const dot = a.reduce((sum, v, i) => sum + v * (b[i] || 0), 0);
  const normA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const normB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return normA && normB ? dot / (normA * normB) : 0;
};
