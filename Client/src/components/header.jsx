import { Layout, Input, Avatar, Badge, Typography, Space, Flex, message } from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import SearchProduct from "./SearchBar";
import "./header.css";
import { useSelector, useDispatch } from "react-redux";
import { logout } from '../store/user/userSlice';
import { resetCart } from '../store/cart/cartSlice';
import { subTotalPrice, totalCartItem } from '../store/cart/cartSelectors';
import { useNavigate } from 'react-router-dom'; 
import api from "../api";
import { useEffect } from "react";
import { initGlobalMessage } from '../utils/messageConfig'


const { Header } = Layout;
const { Text } = Typography;

const AppHeader = ({setOpen}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const count = useSelector(totalCartItem);
  const subTotal = useSelector(subTotalPrice);
  const user = useSelector((state) => state.user); 
  console.log(subTotal)

  useEffect(() => {
    initGlobalMessage();
  },[]);

  const handleClick = async() => {
    console.log("log", user.isLoggedIn)
    if (!user.isLoggedIn) return navigate('/login');

    try {
      const res = await api.get('user/logout', { withCredentials: true });
      
      if (res.data.status  === 'success') {
        dispatch(logout());
        dispatch(resetCart());
        message.success('Logout succeessful');
        return navigate('/', { replace: true });
      }
    } catch(err) {
        if (err.response && err.response.data.message) message.error(err.response.data.message);
        else message.error(err.message);
    }
  };

  return (
    <Header style={{ backgroundColor: "#111827" }} className="header" id='app-header'>
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
        <div className="user-info" onClick={handleClick}>
          <UserOutlined style={{ color: "#fff", fontSize: "24px" }} />
          <Text className="action-text"> 
            { user.isLoggedIn ? "Log Out" : "Sign In" } 
          </Text>
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
            $ {parseFloat(subTotal).toFixed(2)}
          </Text>
        </div>
      </div>
    </Header>
  );
};

export default AppHeader;
