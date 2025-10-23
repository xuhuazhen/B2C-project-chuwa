import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../components/UI/mainLayout";
import ProductCard from "../../components/ProductCard";
import { DownOutlined } from "@ant-design/icons";
import Button from "../../components/Button";
import { Space, Flex, Typography, Dropdown, Pagination, Spin } from "antd";
import { fetchProductThunk } from "../../store/product/productThunk";
import {
  setCurrentPage,
  setSort,
  setLimit,
} from "../../store/product/productSlice";
import { useNavigate } from "react-router-dom";
import "./ProductsList.css";

export default function ProductsList() {
  const { Title } = Typography;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, currentPage, totalPages, loading, limit, sort } =
    useSelector((store) => store.products);

  const userRole = useSelector((store) => store.user.curUser?.role);

  // Set initial limit based on screen width
  useEffect(() => {
    const width = window.innerWidth;
    const initialLimit = width >= 1024 ? 10 : width >= 768 ? 6 : 3;
    dispatch(setLimit(initialLimit));
  }, [dispatch]);

  // Fetch only if not cached
  useEffect(() => {
    if (!products[currentPage]) {
      dispatch(fetchProductThunk({ page: currentPage, limit, sort }));
    }
  }, [dispatch, currentPage, limit, sort, products]);

  const productResults = products[currentPage] || [];

  const items = [
    { key: "price", label: "Price: low to high" },
    { key: "-price", label: "Price: high to low" },
    { key: "-createdAt", label: "Last Added" },
  ];

  const sortChangeHandler = ({ key }) => {
    dispatch(setSort(key));
  };

  const SortDropdown = () => (
    <Dropdown
      menu={{
        items,
        selectable: true,
        selectedKeys: [sort],
        onClick: sortChangeHandler,
      }}
    >
      <Button
        style={{
          color: "#565656",
          backgroundColor: "#fff",
          border: "1px solid #D9D9D9",
          borderRadius: "4px",
          width: "179px",
          height: "40px",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        <Space>
          {items.find((i) => i.key === sort)?.label}
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );

  return (
    <MainLayout>
      <Flex className="product-list--header">
        <Title style={{ fontSize: "32px", fontWeight: 700, margin: 0 }}>
          Products
        </Title>
        <Flex className="product-list--cta">
          <SortDropdown />
          {userRole === "admin" && (
            <Button
              className="add-product--button"
              type="primary"
              style={{
                width: "133px",
                height: "40px",
                fontSize: "14px",
                fontWeight: 600,
              }}
              onClick={() => navigate(`/admin/create-product`)}
            >
              Add Product
            </Button>
          )}
        </Flex>
      </Flex>

      {loading && !products.length ? (
        <Spin tip="Loading products..." />
      ) : (
        <>
          <div className="product-grid">
            {productResults.map((product) => (
              <div className="product-item" key={product._id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="pagination-wrapper">
            <Pagination
              current={currentPage}
              pageSize={limit}
              total={totalPages * limit}
              onChange={(page) => dispatch(setCurrentPage(page))}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </MainLayout>
  );
}
