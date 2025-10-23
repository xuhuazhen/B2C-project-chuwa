import { useEffect, useState } from "react";
import { Row, Col, Card, Tag, Typography, Spin, Alert, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { listProducts } from "/src/service/productService";

const { Title, Text } = Typography;
const PLACEHOLDER = "https://via.placeholder.com/600x400?text=No+Image";

// 统一取图工具：兼容 imageURL / imageUrl / image / img
const getImage = (p) => p?.imageUrl || p?.imageURL || p?.image || p?.img || "";

export default function Products() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await listProducts();
        setProducts(data.products || []);
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: 240 }}>
        <Spin />
      </div>
    );
  }

  if (err) return <Alert type="error" message={err} />;

  return (
    <>
      <Title level={2} style={{ marginBottom: 16 }}>Products</Title>
      <Row gutter={[16, 16]}>
        {products.map((p) => {
          const inStock =
            (typeof p.inStock === "boolean" ? p.inStock : undefined) ??
            (typeof p.stock === "number" ? p.stock > 0 : true);

          const src = getImage(p) || PLACEHOLDER;

          return (
            <Col key={p._id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <img
                    alt={p.name}
                    src={src}
                    onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                    style={{ height: 200, width: "100%", objectFit: "cover" }}
                  />
                }
                actions={[
                  <Button key="view" type="link" onClick={() => navigate(`/products/${p._id}`)}>
                    View Details
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={<span>{p.name}</span>}
                  description={
                    <div>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>${Number(p.price).toFixed(2)}</Text>
                      </div>
                      <Tag color={inStock ? "green" : "red"}>
                        {inStock ? "In Stock" : "Out of Stock"}
                      </Tag>
                    </div>
                  }
                />
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
}
