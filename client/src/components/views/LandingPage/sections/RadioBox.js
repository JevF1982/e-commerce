import React, { useState } from "react";
import { Collapse, Radio } from "antd";

const { Panel } = Collapse;

function RadioBox(props) {
  const [Value, setValue] = useState("0");

  const renderRadioBox = () => {
    return props.price.map((value) => (
      <Radio key={value._id} value={`${value._id}`}>
        {value.name}
      </Radio>
    ));
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    props.handleFilters(e.target.value);
    console.log(Value);
  };

  return (
    <div>
      <Collapse defaultActiveKey={["0"]}>
        <Panel header="Choose price" key="1">
          <Radio.Group onChange={handleChange} value={Value}>
            {renderRadioBox()}
          </Radio.Group>
        </Panel>
      </Collapse>
    </div>
  );
}

export default RadioBox;
