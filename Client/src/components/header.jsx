import React, { useEffect, useState } from "react";
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

const { Header } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const AppHeader = () => {
  // const screens = useBreakpoint();
  // const isMobile = !screens.md; // mobile if width < 768px
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);

  const fetchData = async (query) => {
    if (!query?.trim()) return setOptions([]);
    try {
      const params = new URLSearchParams({ q: query });
      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();

      setOptions(
        data.products.map((item) => ({
          value: item.name,
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchData(inputValue);
    }, 300);

    return () => clearTimeout(delay);
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

// <Header style={{ backgroundColor: "#111827" }}>
//   <Row align="middle" justify="space-between">
//     <Col span={8}>{Logo}</Col>
//     <Col span={8}>{Search}</Col>
//     <Col span={8}>{TopBarActions}</Col>
//   </Row>
// </Header>;

// <Header className="custom-header">
//   <div className="header-top-row">
//     {/* Left: Logo */}
//     <div className="header-logo">MyStore</div>

//     {/* Right: Icons */}
//     <Space size="large" className="header-icons">
//       <Avatar icon={<UserOutlined />} />
//       <Badge count={2} size="small">
//         <ShoppingCartOutlined style={{ fontSize: 20 }} />
//       </Badge>
//       <Text strong className="header-price">
//         $123.00
//       </Text>
//     </Space>
//   </div>

//   {/* Bottom row: search bar (only shown on mobile OR adjusted) */}
//   <div className="header-search">
//     <AutoComplete
//       options={options}
//       onSearch={handleSearch}
//       style={{ width: "100%" }}
//     >
//       <Input.Search allowClear placeholder="Search products..." />
//     </AutoComplete>
//   </div>
// </Header>
