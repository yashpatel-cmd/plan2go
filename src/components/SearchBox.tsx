import React, { useState } from 'react';

const SearchBox = () => {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [people, setPeople] = useState('');

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: '30px',
        padding: '10px',
        boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        width: '100%',
      }}
    >
      {/* Location Input */}
      <div style={{ flex: 1, padding: '10px' }}>
        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Location</label>
        <input
          type="text"
          placeholder="Where are you going?"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      {/* Date Picker (Native HTML Input) */}
      <div style={{ flex: 1, padding: '10px' }}>
        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      {/* People Selector (Dropdown) */}
      <div style={{ flex: 1, padding: '10px' }}>
        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>People</label>
        <select
  value={people}
  onChange={(e) => setPeople(e.target.value)}
  style={{
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
  }}
>
<option value="">Select</option>
  <option value="1">1</option>
  <option value="2">2</option>
  <option value="3">3</option>
  <option value="4">4</option>
  <option value="5">5</option>
  <option value="6">6</option>
  <option value="7">7</option>
  <option value="8">8</option>
  <option value="9+">9+</option>
</select>

      </div>

      {/* Search Button */}
      <div style={{ padding: '10px' }}>
        <button
          style={{
            backgroundColor: 'black',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '20px',
            cursor: 'pointer',
            border: 'none',
          }}
        >
          🔍
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
