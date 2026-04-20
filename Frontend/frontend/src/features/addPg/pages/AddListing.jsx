import { useState } from "react";
import { addPg } from "../pgService";

function AddListing() {
  const [data, setData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    genderPreference: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      // check what's being sent

      const response = await addPg(data);
      console.log("Success:", response.data);
      setMessage("PG listed successfully!");

    } catch (err) {
      console.log("Status:",       err.response?.status);
      console.log("Backend error:", err.response?.data);  
      setError(JSON.stringify(err.response?.data));
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter the PG name"
          name="title"
          value={data.title}
          onChange={handleChange}
        /><br />

        <input
          type="text"
          placeholder="Enter the description"
          name="description"
          value={data.description}
          onChange={handleChange}
        /><br />

        <input
          type="text"
          placeholder="Enter the location"
          name="location"
          value={data.location}
          onChange={handleChange}
        /><br />

        <input
          type="number"
          placeholder="Enter the price"
          name="price"
          value={data.price}
          onChange={handleChange}
        /><br />

        {/* Dropdown instead of free text — prevents wrong values */}
        <select name="genderPreference" value={data.genderPreference} onChange={handleChange}>
          <option value="">Select gender preference</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="ANY">Any</option>
        </select><br />

        <button type="submit">Submit</button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error   && <p style={{ color: "red"   }}>{error}</p>}
    </>
  );
}

export default AddListing;