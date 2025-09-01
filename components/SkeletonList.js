
import React from "react";
import { List } from "antd";

const SkeletonList = ({ count = 5 }) => {
  const skeletonData = Array.from({ length: count }, (_, i) => ({ key: i }));

  return (
    <div>
      <List
        className="list-wrapper"
        dataSource={skeletonData}
        split={false}
        renderItem={(item) => (
          <List.Item className="list-row" key={item.key}>
            <List.Item.Meta
                className="list-product placeholder-glow d-flex align-items-center"
                avatar={
                    <div
                        className="list-image placeholder rounded"
                        style={{ width: "60px", height: "60px" }}
                    />
                }
                title={<div className="list-header placeholder col-6 mb-2"></div>}
                description={<div className="drinkDetails-wrapper placeholder col-4"></div>}
            />
          </List.Item>
        )}
      />
    </div>
  );
}

export default SkeletonList;
