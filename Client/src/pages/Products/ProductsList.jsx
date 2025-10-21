import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../components/UI/mainLayout";
import ProductCard from "../../components/ProductCard";
import { DownOutlined } from "@ant-design/icons";
import Button from "../../components/Button";
import { Space, Flex, Typography, Dropdown, Pagination, Spin } from "antd";
import { fetchProductThunk } from "../../store/product/productThunk";
import { setCurrentPage, setSort } from "../../store/product/productSlice";
import { useNavigate } from "react-router-dom";
import "./ProductsList.css";

export default function ProductsList() {
  const { Title } = Typography;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, currentPage, totalPages, loading, limit, sort } =
    useSelector((store) => store.products);

  const userRole = useSelector((store) => store.user.curUser?.role);

  // Fixed limit based on initial screen width
  const getInitialLimit = () => {
    const width = window.innerWidth;
    if (width >= 1024) return 10; // desktop
    if (width >= 768) return 6; // tablet
    return 3; // mobile
  };

  // Fetch products when page changes
  useEffect(() => {
    dispatch(
      fetchProductThunk({
        page: currentPage,
        limit: getInitialLimit(),
        sort,
      })
    );
  }, [dispatch, currentPage, limit, sort]);

  const sortChangeHandler = ({ key }) => {
    dispatch(setSort(key));
    // console.log(key);
    dispatch(setCurrentPage(1));
  };

  const items = [
    {
      key: "price",
      label: "Price: low to high",
      onClick: sortChangeHandler,
    },
    {
      key: "-price",
      label: "Price: high to low",
      onClick: sortChangeHandler,
    },
    { key: "latest", label: "Last Added", onClick: sortChangeHandler },
  ];

  const SortDropdown = () => (
    <Dropdown
      menu={{
        items,
        selectable: true,
        selectedKeys: [sort],
      }}
    >
      <Button className="sort-button">
        <Space>
          {items.find((i) => i.key === sort)?.label}
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );

  return (
    <MainLayout>
      <Flex
        wrap
        align="center"
        justify="space-between"
        gap={20}
        style={{ marginBottom: "24px" }}
      >
        <Title style={{ fontSize: "32px", fontWeight: 700, margin: 0 }}>
          Products
        </Title>
        <Flex wrap align="center" justify="space-between" gap={10}>
          <SortDropdown />
          { userRole === 'admin' &&
            <Button
              type="primary"
              style={{ borderRadius: "4px", backgroundColor: "#5048E5" }}
              onClick={() => navigate(`/admin/create-product`)}
            >
              Add Product
            </Button>
          )}
        </Flex>
      </Flex>

      {loading ? (
        <Spin tip="Loading products..." />
      ) : (
        <>
          <div className="product-grid">
            {products.map((product) => (
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
