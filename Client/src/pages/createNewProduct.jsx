import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  Row,
  Col,
  Layout,
  Card,
  message,
} from "antd";
import { DollarOutlined, InboxOutlined, ShoppingOutlined } from "@ant-design/icons";
import api from "../api";
import MainLayout from "../components/UI/mainLayout";

const { Header, Content, Footer } = Layout;
const { Option } = Select;

const CATEGORY_OPTIONS = [
  "Outerwear",
  "Bottoms",
  "Activewear",
  "Footwear",
  "Accessories",
];

export default function CreateProductPage() {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { id } = useParams();
  const isEdit = !!id;

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const p = res.data?.product;
        if (!p) throw new Error("Product not found");

        form.setFieldsValue({
          name: p.name,
          description: p.description,
          category: p.category,
          price: p.price,
          stock: p.stock,
          imageInput: p.image || "",
        });
        setImgUrl(p.image || "");
      } catch (err) {
        console.error(err);
        message.error("Failed to load product info");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  // 预览本地上传图片
  const previewFile = (f) => {
    const url = URL.createObjectURL(f);
    setImgUrl(url);
    setFile(f);
  };

  // 阻止 Upload 默认上传，先本地预览
  const uploadProps = {
    multiple: false,
    showUploadList: false,
    beforeUpload: (f) => {
      previewFile(f);
      return false;
    },
  };

  // 从后端拿 S3 签名
  async function getSignedUrlFromServer(f) {
        console.log("get signed url")
    const res = await api.get("/upload/sign", {
      params: {
        filename: f.name,
        contentType: f.type || "application/octet-stream",
      },
    });
    return res.data; // { uploadUrl, publicUrl, key, expiresIn }
  }

  // PUT 到 S3
  async function uploadToS3(f, uploadUrl) {
    const r = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": f.type || "application/octet-stream" },
      body: f,
    });
    if (!r.ok) throw new Error("Upload to S3 failed");
  }

  // 提交
  const onFinish = async (values) => {
    try {
      setSubmitting(true);

      // 基本数值防呆
      const priceNum = Number(values.price);
      const stockNum = Number(values.stock);
      if (Number.isNaN(priceNum) || priceNum < 0) {
        message.error("Price must be a non-negative number");
        return;
      }
      if (!Number.isInteger(stockNum) || stockNum < 0) {
        message.error("Stock must be a non-negative integer");
        return;
      }

      // 决定最后的图片 URL
      let finalImageUrl = imgUrl;
      const imageInput = values.imageInput?.trim();
      const usingDirectLink = imageInput && imageInput.startsWith("http");
 
      if (usingDirectLink) { 
        finalImageUrl = imageInput;
      } else if (file && !imgUrl.startsWith("http")) {
        console.log("file")
        const { uploadUrl, publicUrl } = await getSignedUrlFromServer(file);
        await uploadToS3(file, uploadUrl);
        finalImageUrl = publicUrl;
      }
      
      const payload = {
        name: values.name.trim(),
        description: values.description?.trim() || "",
        category: values.category,
        price: priceNum,
        stock: stockNum,
        image: finalImageUrl || "",
      };
      // 创建（如果将来支持编辑，这里切换成 api.put(`/products/${id}`, payload)）
      const resp = await api.post("/products", payload);
      if (!(resp.status >= 200 && resp.status < 300)) {
        throw new Error("Failed to create product");
      }

      message.success(isEdit ? "Product updated!" : "Product created successfully!");
      form.resetFields();
      setFile(null);
      setImgUrl("");

      // 可选：跳转到列表或详情
      // navigate("/products"); // 如果你有对应的路由就放开
    } catch (e) {
      console.error(e);
      message.error(e.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout> 
      {/* <Header style={{ color: "white", fontSize: 18 }}>
        <ShoppingOutlined /> Product Management
      </Header> */}

      <Content style={{ padding: "50px", minHeight: "90vh" }}>
        <Row justify="center">
          <Col xs={24} sm={20} md={16} lg={12}>
            <Card title={!isEdit ? "Create Product" : "Edit Product"}>
              <Form layout="vertical" form={form} onFinish={onFinish}>
                <Form.Item
                  name="name"
                  label="Product Name"
                  rules={[{ required: true, message: "Please enter name" }]}
                >
                  <Input placeholder="iWatch" />
                </Form.Item>

                <Form.Item name="description" label="Product Description">
                  <Input.TextArea rows={3} />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="category"
                      label="Category"
                      rules={[{ required: true, message: "Select category" }]}
                    >
                      <Select placeholder="Choose a category">
                        {CATEGORY_OPTIONS.map((c) => (
                          <Option key={c} value={c}>
                            {c}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="price"
                      label="Price ($)"
                      rules={[{ required: true, message: "Enter price" }]}
                    >
                      <Input prefix={<DollarOutlined />} type="number" min={0} step="0.01" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="stock"
                  label="In Stock Quantity"
                  rules={[{ required: true, message: "Enter stock" }]}
                >
                  <Input type="number" min={0} step="1" />
                </Form.Item>

                {/* 直接填图片链接（可选） */}
                <Form.Item name="imageInput" label="Add Image Link (optional)">
                  <Input placeholder="https://example.com/image.png" />
                </Form.Item>

                {/* 或者上传图片 */}
                <Form.Item label="Or Upload Image">
                  <Upload.Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file here</p>
                    <p className="ant-upload-hint">PNG, JPG, WEBP allowed</p>
                  </Upload.Dragger>

                  {/* 仅在本地预览时展示（imgUrl 是 blob:） */}
                  {imgUrl && !imgUrl.startsWith("http") && (
                    <img
                      src={imgUrl}
                      alt="preview"
                      style={{
                        width: "100%",
                        marginTop: 20,
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={submitting} block>
                    {!isEdit ? "Add Product" : "Save Changes"}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Content>

      {/* <Footer style={{ textAlign: "center" }}>©2025 Product Management System</Footer> */}
    </MainLayout>
  );
}
