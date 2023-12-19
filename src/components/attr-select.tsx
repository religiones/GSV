import React, { useState } from "react";
import { Checkbox, Col, Row, message } from "antd";
import "./style/attr-select.less";
const AttrSelect: React.FC<{}> = () => {
  const useAttr = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "a1",
    "b1",
    "c1",
    "d1",
    "e1",
    "a2",
    "b2",
    "c2",
    "d2",
    "e2",
    "a3",
    "b3",
    "c3",
    "d3",
    "e3",
  ];
  const [checkedValues, setCheckValues] = useState<string[]>([]);
  const onChange = (nowCheckedValues: any[]) => {
    if (nowCheckedValues.length === 0) {
      message.warning("please select at least 1 attribute");
    } else {
      console.log("checked = ", checkedValues);
      setCheckValues(checkedValues);
    }
  };
  return (
    <Checkbox.Group onChange={onChange} className="checkboxGroup">
      <Row>
        {useAttr.map((value: string) => {
          return (
            <Col className="checkboxCol" span={8}>
              <Checkbox value={value}>
                {value}
              </Checkbox>
            </Col>
          );
        })}
      </Row>
    </Checkbox.Group>
  );
};

export default AttrSelect;
