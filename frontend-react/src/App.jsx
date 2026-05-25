import { useState } from "react";

export default function App() {
const [image, setImage] = useState(null);
const [preview, setPreview] = useState(null);
const [matches, setMatches] = useState([]);
const [loading, setLoading] = useState(false);
const [type, setType] = useState("lost");

const handleUpload = async () => {
if (!image) return alert("Upload image");


const formData = new FormData();
formData.append("title", "item");
formData.append("description", "desc");
formData.append("location", "location");
formData.append("type", type);
formData.append("image", image);

setLoading(true);

try {
  const res = await fetch("http://127.0.0.1:8001/items", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  setMatches(data.possible_matches || []);
} catch (err) {
  console.error(err);
  alert("Backend error");
}

setLoading(false);
```

};

return ( <div className="h-screen flex flex-col">

```
  {/* NAVBAR */}
  <div className="bg-blue-600 text-white p-4 text-xl font-semibold">
    🔍 Lost & Found AI
  </div>

  <div className="flex flex-1">

    {/* SIDEBAR */}
    <div className="w-60 bg-gray-100 p-4">
      <p className="font-semibold mb-4">Menu</p>
      <ul className="space-y-2">
        <li className="cursor-pointer hover:text-blue-500">Dashboard</li>
        <li className="cursor-pointer hover:text-blue-500">Report Lost</li>
        <li className="cursor-pointer hover:text-blue-500">Report Found</li>
        <li className="cursor-pointer hover:text-blue-500">Browse Items</li>
      </ul>
    </div>

    {/* MAIN CONTENT */}
    <div className="flex-1 p-6 bg-gray-50">

      {/* UPLOAD SECTION */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Upload Item</h2>

        <div className="flex gap-3 mb-3">
          <button
            onClick={() => setType("lost")}
            className={`px-4 py-2 rounded ${
              type === "lost"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Lost
          </button>

          <button
            onClick={() => setType("found")}
            className={`px-4 py-2 rounded ${
              type === "found"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Found
          </button>
        </div>

        <input
          type="file"
          onChange={(e) => {
            setImage(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
          }}
        />

        {preview && (
          <img
            src={preview}
            className="w-40 mt-3 rounded-lg border"
          />
        )}

        <button
          onClick={handleUpload}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Upload & Find Matches
        </button>

        {loading && <p className="mt-2">Searching...</p>}
      </div>

      {/* MATCHES SECTION */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Matches</h2>

        {matches.length === 0 ? (
          <p className="text-gray-500">No matches yet</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {matches.map((item, i) => (
              <div
                key={i}
                className={`bg-white p-3 rounded-lg shadow ${
                  i === 0 ? "border-2 border-green-500" : ""
                }`}
              >
                <img
                  src={item.image_url}
                  className="rounded mb-2"
                />

                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500">
                  {item.location}
                </p>

                <p className="text-sm mt-1">
                  Score: {item.score}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  </div>
</div>


);
}
