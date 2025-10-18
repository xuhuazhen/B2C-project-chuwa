import React from "react";
import { Layout, Input, Avatar, Badge, Typography, Space, Flex } from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import SearchProduct from "./SearchBar";
import "./header.css";
import { useSelector } from "react-redux";
import { subTotalPrice, totalCartItem } from '../store/cart/cartSelectors';

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = ({setOpen}) => {
  const count = useSelector(totalCartItem);
  const subTotal = useSelector(subTotalPrice);

  return (
    <Header style={{ backgroundColor: "#111827" }} className="header">
      <div className="logo">
        <h4>
          Management
          <span> Chuwa</span>
        </h4>
      </div>
      <div className="search-bar">
        <SearchProduct />
      </div>
      <div className="header-actions">
        <div className="user-info">
          <UserOutlined style={{ color: "#fff", fontSize: "24px" }} />
          <Text className="action-text">Sign In</Text>
        </div>

        <div className="cart-info" onClick={()=>setOpen(true)}>
          <Badge count={count} size="small" offset={[-4, 5]}>
            <ShoppingCartOutlined
              role="button"
              aria-label="Shopping Cart"
              style={{ color: "#fff", fontSize: "30px" }}
            />
          </Badge>
          <Text strong className="action-text">
            $ {subTotal}
          </Text>
        </div>
      </div>
    </Header>
  );
};

export default AppHeader;
