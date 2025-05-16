
import React from "react";

const Filters = () => {
  return (
    <div>
      <label>Choisir un filtre</label>
      <select>
        <option value="politique">Politique</option>
        <option value="sport">Sport</option>
        <option value="culture">Culture</option>
      </select>
    </div>
  );
};

export default Filters;
    