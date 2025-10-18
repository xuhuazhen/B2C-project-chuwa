import React, { useState } from "react";
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
import {
  UploadOutlined,
  ShoppingOutlined,
  DollarOutlined,
  InboxOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer } = Layout;
const { Option } = Select;

export default function CreateProductPage() {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ---- 预览上传图片 ----
  const previewFile = (file) => {
    const url = URL.createObjectURL(file);
    setImgUrl(url);
    setFile(file);
  };

  // ---- 上传配置（阻止自动上传）----
  const uploadProps = {
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      previewFile(file);
      return false; // 阻止默认上传
    },
  };

  // ---- 获取签名 URL ----
  async function getSignedUrlFromServer(file) {
    const qs = new URLSearchParams({
      filename: file.name,
      contentType: file.type || "application/octet-stream",
    });
    const res = await fetch(`/api/upload/sign?${qs.toString()}`);
    if (!res.ok) throw new Error("Failed to get signed URL");
    return res.json(); // { uploadUrl, publicUrl, key, expiresIn }
  }

  // ---- 上传文件到 S3 ----
  async function uploadToS3(file, uploadUrl) {
    const r = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });
    if (!r.ok) throw new Error("Upload to S3 failed");
  }

  // ---- 提交表单 ----
  const onFinish = async (values) => {
    try {
      setSubmitting(true);
      let finalImageUrl = imgUrl;

      // 如果选择了文件而不是直接填图片链接
      if (file && !imgUrl.startsWith("http")) {
        const { uploadUrl, publicUrl } = await getSignedUrlFromServer(file);
        await uploadToS3(file, uploadUrl);
        finalImageUrl = publicUrl;
      }

      const payload = {
        name: values.name.trim(),
        description: values.description || "",
        category: values.category,
        price: parseFloat(values.price),
        stock: parseInt(values.stock, 10),
        image: finalImageUrl,
      };

      const resp = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) throw new Error("Failed to create product");
      message.success("Product created successfully!");
      form.resetFields();
      setFile(null);
      setImgUrl("");
    } catch (e) {
      console.error(e);
      message.error(e.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <Header style={{ color: "white", fontSize: 18 }}>
        <ShoppingOutlined /> Product Management
      </Header>
      <Content style={{ padding: "50px", minHeight: "90vh" }}>
        <Row justify="center">
          <Col xs={24} sm={20} md={16} lg={12}>
            <Card title="Create Product" bordered={false}>
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
                        <Option value="Category1">Category1</Option>
                        <Option value="Category2">Category2</Option>
                        <Option value="Category3">Category3</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="price"
                      label="Price ($)"
                      rules={[{ required: true, message: "Enter price" }]}
                    >
                      <Input prefix={<DollarOutlined />} type="number" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="stock"
                  label="In Stock Quantity"
                  rules={[{ required: true, message: "Enter stock" }]}
                >
                  <Input type="number" />
                </Form.Item>

                <Form.Item label="Add Image Link (optional)">
                  <Input
                    placeholder="https://example.com/image.png"
                    value={imgUrl.startsWith("http") ? imgUrl : ""}
                    onChange={(e) => setImgUrl(e.target.value)}
                  />
                </Form.Item>

                <Form.Item label="Or Upload Image">
                  <Upload.Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file here</p>
                    <p className="ant-upload-hint">PNG, JPG, WEBP allowed</p>
                  </Upload.Dragger>
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
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    block
                  >
                    Add Product
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        ©2025 Product Management System
      </Footer>
    </Layout>
  );
}
