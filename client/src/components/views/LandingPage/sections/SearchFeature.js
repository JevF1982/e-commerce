import React, { useState } from "react";
import { Input } from "antd";
const { Search } = Input;

function SearchFeature(props) {
  const [SearchTerms, setSearchTerms] = useState("");

  const handleSearch = (e) => {
    setSearchTerms(e.currentTarget.value);
    props.refreshFunction(e.currentTarget.value);
  };

  return (
    <div>
      <Search
        value={SearchTerms}
        onChange={handleSearch}
        placeholder="Search by typing..."
      />
    </div>
  );
}

export default SearchFeature;
