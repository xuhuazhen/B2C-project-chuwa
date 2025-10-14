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
import SearchProduct from "./SearchBar";

const { Header } = Layout;
const { Title, Text } = Typography;

const AppHeader = () => {
  const Logo = (
    <Flex align="center" style={{ height: "100%" }}>
      <Title style={{ color: "#fff", margin: "0", fontSize: "28px" }}>
        Management
        <span style={{ fontSize: "12px", marginLeft: "10px" }}>Chuwa</span>
      </Title>
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
            <SearchProduct />
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
