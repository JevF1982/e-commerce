import React, { useState, useEffect } from "react";
import { Checkbox, Collapse } from "antd";
const { Panel } = Collapse;

export default function Checkboxes(props) {
  const [checked, setChecked] = useState([]);

  const toggleChecked = (_id) => {
    const currentIndex = checked.indexOf(_id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(_id);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    props.handleFilters(newChecked);
  };

  const renderCheckboxList = () =>
    props.continents.map((continent, index) => (
      <Checkbox
        style={{ margin: "5px" }}
        key={index}
        type="checkbox"
        checked={checked.indexOf(continent._id) === -1 ? false : true}
        name={continent.name}
        onChange={() => toggleChecked(continent._id)}
      >
        {continent.name}
      </Checkbox>
    ));

  return (
    <div>
      <div>
        <Collapse>
          <Panel header="Choose Continent">{renderCheckboxList()}</Panel>
        </Collapse>
      </div>
    </div>
  );
}
