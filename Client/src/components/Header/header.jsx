// import { Badge, Grid } from "antd";
// import {
//   UserOutlined,
//   StarFilled,
//   ShoppingCartOutlined,
// } from "@ant-design/icons";
// import SearchProduct from "../SearchBar/SearchBar";
// import "./header.css";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../../store/user/userSlice";
// import { resetCart } from "../../store/cart/cartSlice";
// import { subTotalPrice, totalCartItem } from "../../store/cart/cartSelectors";
// import { useNavigate } from "react-router-dom";
// import api from "../../api";

// const AppHeader = ({ setOpen }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const count = useSelector(totalCartItem);
//   const subTotal = useSelector(subTotalPrice);
//   const user = useSelector((state) => state.user);

//   // console.log(subTotal);

//   const { useBreakpoint } = Grid;
//   const screens = useBreakpoint();
//   const isMobile = !screens.md;

//   const handleClick = async () => {
//     console.log("log", user.isLoggedIn);
//     if (!user.isLoggedIn) return navigate("/login");

//     try {
//       const res = await api.get("user/logout", { withCredentials: true });

//       if (res.data.status === "success") {
//         dispatch(logout());
//         dispatch(resetCart());
//         return navigate("/");
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <header style={{ backgroundColor: "#111827" }} className="header">
//       <div
//         className="logo"
//         onClick={() => {
//           navigate("/");
//         }}
//       >
//         <h4>
//           {isMobile ? "M" : "Management"}
//           <span>Chuwa</span>
//         </h4>
//       </div>
//       <div className="search-bar">
//         <SearchProduct />
//       </div>
//       <div className="header-actions">
//         <div className="user-info" onClick={handleClick}>
//           <div className="user-avatar">
//             <UserOutlined className="user-icon" />
//             <StarFilled className="star" />
//           </div>
//           <span className="user-name">
//             {user.isLoggedIn ? "Log Out" : "Sign In"}
//           </span>
//         </div>

//         <div className="cart-info" onClick={() => setOpen(true)}>
//           <Badge count={count} size="small" offset={[-4, 5]}>
//             <ShoppingCartOutlined
//               role="button"
//               aria-label="Shopping Cart"
//               className="cart-icon"
//             />
//           </Badge>
//           <span strong className="price">
//             $ {parseFloat(subTotal).toFixed(2)}
//           </span>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default AppHeader;

import { Badge, Grid, message } from "antd";
import {
  UserOutlined,
  StarFilled,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import SearchProduct from "../SearchBar/SearchBar";
import "./header.css";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/user/userSlice";
import { resetCart } from "../../store/cart/cartSlice";
import { subTotalPrice, totalCartItem } from "../../store/cart/cartSelectors";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useEffect } from "react";
import { initGlobalMessage } from "../../utils/messageConfig";

const AppHeader = ({ setOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const count = useSelector(totalCartItem);
  const subTotal = useSelector(subTotalPrice);
  const user = useSelector((state) => state.user);

  // console.log(subTotal);

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  useEffect(() => {
    initGlobalMessage();
  }, []);

  const handleClick = async () => {
    console.log("log", user.isLoggedIn);
    if (!user.isLoggedIn) return navigate("/login");

    try {
      const res = await api.get("user/logout", { withCredentials: true });

      if (res.data.status === "success") {
        dispatch(logout());
        dispatch(resetCart());
        message.success("Logout succeessful");
        return navigate("/", { replace: true });
      }
    } catch (err) {
      if (err.response && err.response.data.message)
        message.error(err.response.data.message);
      else message.error(err.message);
    }
  };

  return (
    <header style={{ backgroundColor: "#111827" }} className="header" id='app-header'>
      <div
        className="logo"
        onClick={() => {
          navigate("/");
        }}
      >
        <h4>
          {isMobile ? "M" : "Management"}
          <span>Chuwa</span>
        </h4>
      </div>
      <div className="search-bar">
        <SearchProduct />
      </div>
      <div className="header-actions">
        <div className="user-info" onClick={handleClick}>
          <div className="user-avatar">
            <UserOutlined className="user-icon" />
            <StarFilled className="star" />
          </div>
          <span className="user-name">
            {user.isLoggedIn ? "Log Out" : "Sign In"}
          </span>
        </div>

        <div className="cart-info" onClick={() => setOpen(true)}>
          <Badge count={count} size="small" offset={[-4, 5]}>
            <ShoppingCartOutlined
              role="button"
              aria-label="Shopping Cart"
              className="cart-icon"
            />
          </Badge>
          <span className="price">
            $ {parseFloat(subTotal).toFixed(2)}
          </span>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
