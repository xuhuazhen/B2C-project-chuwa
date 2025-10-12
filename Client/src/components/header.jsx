import React, { useEffect, useState, useRef } from "react";
import {
  Layout,
  AutoComplete,
  Input,
  Avatar,
  Badge,
  Typography,
  Space,
  Row,
  Col,
  Flex,
  Grid,
} from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";

import "./header.css";
import { Content } from "antd/es/layout/layout";

const { Header } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const AppHeader = () => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const timeoutRef = useRef(null);

  // Fetch autocomplete options
  const fetchData = async (query) => {
    if (!query.trim()) return setOptions([]);

    try {
      const params = new URLSearchParams({ q: query });
      // console.log(params.toString())
      const res = await fetch(
        `http://localhost:3000/api/product/search?${params.toString()}`
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      // console.log(data)

      if (data.status === "success") {
        setOptions(data.products.map((p) => ({ value: p.name })));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  //Debouncing
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      fetchData(inputValue);
    }, 300);

    return () => clearTimeout(timeoutRef.current);
  }, [inputValue]);

  const Logo = (
    <Flex align="center" style={{ height: "100%" }}>
      <Title style={{ color: "#fff", margin: "0", fontSize: "28px" }}>
        Management
        <span style={{ fontSize: "12px", marginLeft: "10px" }}>Chuwa</span>
      </Title>
    </Flex>
  );

  const Search = (
    <Flex align="center" justify="center" style={{ height: "100%" }}>
      <AutoComplete
        style={{ width: 500 }}
        options={options}
        onChange={setInputValue}
      >
        <Input.Search allowClear placeholder="Search" />
      </AutoComplete>
    </Flex>
  );

  const TopBarActions = (
    <Flex align="center" justify="end" gap={38} style={{ height: "100%" }}>
      <Space>
        <UserOutlined style={{ color: "#fff", fontSize: "30px" }} />
        <Text style={{ color: "#fff", fontSize: "16px" }}>Sign In</Text>
      </Space>
      <Space align="center">
        <ShoppingCartOutlined
          style={{ color: "#fff", fontSize: "30px" }}
          role="button"
          aria-label="Shopping Cart"
        />
        {/* <Badge count={2} size="small" offset={[0, 10]}>
          <ShoppingCartOutlined style={{ color: "#fff", fontSize: "30px" }} />
        </Badge> */}

        <Text strong style={{ color: "#fff", fontSize: "16px" }}>
          $13.00
        </Text>
      </Space>
    </Flex>
  );

  return (
    <Header style={{ backgroundColor: "#111827" }}>
      <Row align="middle" justify="space-between" gutter={[16, 16]}>
        <Col xs={24} md={6}>
          {Logo}
        </Col>
        <Col xs={24} md={12}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {Search}
          </div>
        </Col>
        <Col xs={24} md={6}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {TopBarActions}
          </div>
        </Col>
      </Row>
    </Header>
  );
};

export default AppHeader;
