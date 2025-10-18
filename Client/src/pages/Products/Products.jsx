import React, { useEffect, useState } from "react";
import { Row, Col, Card, Tag, Typography, Spin, Alert, Button } from "antd";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/UI/mainLayout";
import { listProducts } from "/src/service/productService";

const { Title, Text } = Typography;

// 避免图片挂了导致白块
const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='320'%3E%3Crect width='100%25' height='100%25' fill='%23f2f4f7'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2399a' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function Products() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const data = await listProducts();
        if (mounted) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) setErr("Failed to load products.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  if (err) {
    return (
      <MainLayout>
        <div style={{ padding: 24 }}>
          <Alert type="error" message={err} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={{ padding: 24 }}>
        <Title level={3} style={{ marginBottom: 16 }}>
          Products
        </Title>

        <Row gutter={[16, 16]}>
          {items.map((p) => {
            const img =
              p.imageUrl ?? p.image ?? p.imgUrl ?? p.imageURL ?? FALLBACK_IMG;
            return (
              <Col key={p._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    <img
                      src={img}
                      alt={p.name}
                      style={{ height: 200, objectFit: "cover" }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMG;
                      }}
                    />
                  }
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Text strong>{p.name}</Text>
                    {p.stock > 0 ? (
                      <Tag color="green">In Stock</Tag>
                    ) : (
                      <Tag color="red">Out of Stock</Tag>
                    )}
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary">{p.category || "General"}</Text>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <Text strong>${Number(p.price ?? 0).toFixed(2)}</Text>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <Button
                      type="link"
                      onClick={() => navigate(`/products/${p._id}`)}
                    >
                      View Detail
                    </Button>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </MainLayout>
  );
}
