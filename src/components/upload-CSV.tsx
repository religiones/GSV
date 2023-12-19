import React, { useCallback, useState } from "react";
import { Button, Upload, message } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import "./style/upload-CSV.less";
const CSVUpload: React.FC<{}> = () => {
  const [nodeData, setNodeData] = useState<any[]>([]);
  const [linkData, setLinkData] = useState<any[]>([]);
  const upLoadData = useCallback(() => {
    let nowData = "";
    if (nodeData.length === 0) {
      nowData = "node CSV Data";
    }
    if (linkData.length === 0) {
      if (nowData === "") {
        nowData = "link CSV Data";
      } else {
        nowData += " and link CSV Data";
      }
    }
    if (nodeData.length !== 0 && linkData.length !== 0) {
      console.log(nodeData, linkData);
    } else {
      message.error(`please upload ${nowData}`);
    }
  }, [nodeData, linkData]);
  const uploadButton = (fileType: string) => (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{`Upload ${fileType}`}</div>
    </div>
  );
  return (
    <div className="uploadComponent">
      <div className="uploadDiv">
        <Upload
          fileList={nodeData}
          maxCount={1}
          listType="picture-card"
          onChange={({ fileList }) => {
            setNodeData(fileList);
          }}
          className="uploadButton"
          accept="text/csv"
        >
          {uploadButton("node")}
        </Upload>
        <Upload
          fileList={linkData}
          maxCount={1}
          onChange={({ fileList }) => {
            setLinkData(fileList);
          }}
          listType="picture-card"
          className="uploadButton"
          accept="text/csv"
        >
          {uploadButton("link")}
        </Upload>
      </div>
      <div className="uploadConfirm">
        <Button icon={<UploadOutlined />} onClick={upLoadData}>
          Confirm Upload
        </Button>
      </div>
    </div>
  );
};

export default CSVUpload;
