// ProductCard.jsx
import React from "react";
import { Card, Button } from "antd";     // ✅ 补上
const { Meta } = Card;                   // ✅ 补上

const ProductCard = () => {
  return (
    <Card
      hoverable
      style={{ width: 240 }}
      cover={
        <img
          draggable={false}
          alt="example"
          src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
          style={{
            width: "240px",
            height: "200px",
            objectFit: "cover",
            padding: "12px 12px 0 12px",
          }}
        />
      }
    >
      <Meta title="Europe Street beat" description="www.instagram.com" />
      <Button type="primary" style={{ borderRadius: "4px" }}>
        Add
      </Button>
    </Card>
  );
};

export default ProductCard;
