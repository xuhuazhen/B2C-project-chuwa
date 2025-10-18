import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Typography,
  Spin,
  Alert,
  Button,
  InputNumber,
  Image,
} from "antd";
import MainLayout from "../../components/UI/mainLayout";
import { fetchProductById, listProducts } from "/src/service/productService";

const { Title, Text, Paragraph } = Typography;

const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='520'%3E%3Crect width='100%25' height='100%25' fill='%23f2f4f7'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2399a' font-size='18'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function ProductDetail() {
  const { id } = useParams();
  const [prod, setProd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [errText, setErrText] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadDetail() {
      setLoading(true);
      setErrText("");
      try {
        // 1) 优先按 id 拉详情
        const detail = await fetchProductById(id);
        if (detail && mounted) {
          setProd(detail);
          setLoading(false);
          return;
        }
        throw new Error("not found");
      } catch {
        // 2) 兜底：从列表中筛选
        try {
          const list = await listProducts();
          const found = Array.isArray(list)
            ? list.find((x) => String(x._id) === String(id))
            : null;
          if (found && mounted) {
            setProd(found);
          } else {
            setErrText("Product not found.");
          }
        } catch {
          setErrText("Failed to load product.");
        } finally {
          if (mounted) setLoading(false);
        }
      }
    }

    loadDetail();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  if (!prod) {
    return (
      <MainLayout>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
          <Title level={3}>Products Detail</Title>
          <Alert type="error" message={errText || "Product not found"} />
        </div>
      </MainLayout>
    );
  }

  const imgSrc =
    prod?.imageUrl ?? prod?.image ?? prod?.imgUrl ?? prod?.imageURL ?? "";
  const inStock = (prod?.stock ?? 1) > 0;
  const priceText = `$${Number(prod?.price ?? 0).toFixed(2)}`;

  return (
    <MainLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
        <Title level={3}>Products Detail</Title>

        <Card>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: 24,
            }}
          >
            {/* 左侧图片 */}
            <div>
              <Image
                src={imgSrc || FALLBACK_IMG}
                alt={prod?.name}
                width="100%"
                height={420}
                style={{ objectFit: "cover", borderRadius: 8 }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_IMG;
                }}
              />
            </div>

            {/* 右侧信息 */}
            <div>
              <Text type="secondary">{prod?.category || "General"}</Text>
              <Title level={4} style={{ margin: "4px 0 8px" }}>
                {prod?.name}
              </Title>

              <Title level={5} style={{ margin: 0 }}>
                {priceText}{" "}
                {inStock ? (
                  <Text style={{ color: "#16a34a", marginLeft: 8 }}>In Stock</Text>
                ) : (
                  <Text style={{ color: "#ef4444", marginLeft: 8 }}>
                    Out of Stock
                  </Text>
                )}
              </Title>

              {prod?.description && (
                <Paragraph style={{ marginTop: 12, color: "#4b5563" }}>
                  {prod.description}
                </Paragraph>
              )}

              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                <InputNumber
                  min={1}
                  max={Math.max(1, prod?.stock ?? 99)}
                  value={qty}
                  onChange={(v) => setQty(v || 1)}
                  disabled={!inStock}
                />
                <Button type="primary" disabled={!inStock}>
                  Add To Cart
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
