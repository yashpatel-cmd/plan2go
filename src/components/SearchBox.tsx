import React, { useState } from "react";
import Select from "react-select";
import countries from "world-countries";
import { useNavigate } from "react-router-dom";

const countryOptions = countries.map((country) => ({
  value: country.name.common,
  label: (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <img
        src={`https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`}
        alt={country.name.common}
        style={{ width: "20px", height: "15px", borderRadius: "3px" }}
      />
      {country.name.common}
    </div>
  ),
}));

const SearchBox = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: "30px",
        padding: "50px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        maxWidth: "800px",
        width: "100%",
      }}
    >
      {/* Country Selector with Flag */}
      <div style={{ flex: 1, padding: "10px" }}>
        <label style={{ fontSize: "12px", fontWeight: "bold" }}>Country</label>
        <Select
          options={countryOptions}
          value={selectedCountry}
          onChange={setSelectedCountry}
          placeholder="Select a country"
          styles={{
            container: (base) => ({ ...base, width: "100%" }),
            control: (base) => ({ ...base, minHeight: 38, borderColor: "#ccc" }),
          }}
        />
      </div>

      {/* Date Picker */}
      <div style={{ flex: 1, padding: "10px" }}>
        <label style={{ fontSize: "12px", fontWeight: "bold" }}>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* People Selector */}
      <div style={{ flex: 1, padding: "10px" }}>
        <label style={{ fontSize: "12px", fontWeight: "bold" }}>People</label>
        <select
          value={people}
          onChange={(e) => setPeople(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: "white",
          }}
        >
          <option value="">0</option>
          {[...Array(9).keys()].map((num) => (
            <option key={num + 1} value={num + 1}>
              {num + 1}
            </option>
          ))}
          <option value="9+">9+</option>
        </select>
      </div>

      {/* Search Button */}
      <div style={{ padding: "10px" }}>
        <button
          onClick={() => {
            const countryLabel = selectedCountry ? (selectedCountry.label as any)?.props?.children?.[1] || selectedCountry.value : "";
            const params = new URLSearchParams({
              country: countryLabel || "",
              date,
              people,
            });
            navigate(`/agoda?${params.toString()}`);
          }}
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "10px 15px",
            borderRadius: "20px",
            cursor: "pointer",
            border: "none",
          }}
        >
          🔍
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
