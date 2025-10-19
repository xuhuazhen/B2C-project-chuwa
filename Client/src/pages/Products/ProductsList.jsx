import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../components/UI/mainLayout";
import ProductCard from "../../components/ProductCard";
import { DownOutlined } from "@ant-design/icons";
import Button from "../../components/Button";
import { Space, Flex, Typography, Dropdown, Pagination } from "antd";
import { fetchProducts } from "../../store/product/productsSlice";
import "./ProductsList.css";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const { Title } = Typography;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((store) => store.products);
  const userRole = useSelector((state) => state.user.curUser?.role);

  const [sort, setSort] = useState("Last Added");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  //Pagination responsiveness
  useEffect(() => {
    const handleResize = () => {
      let size;
      const width = window.innerWidth;
      width < 576 ? (size = 4) : width < 1024 ? (size = 6) : (size = 10);
      setPageSize(size);

      const totalPages = Math.ceil(products.length / size);
      setCurrentPage((prev) => Math.min(prev, totalPages) || 1);
    };

    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [products.length]);

  //Fertch all products
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  console.log(products);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Failed to load products: {error}</p>;

  //Sorting
  const sortedProducts = [...products].sort((a, b) =>
    sort === "Price: low to high"
      ? a.price - b.price
      : sort === "Price: high to low"
      ? b.price - a.price
      : new Date(b.createdAt) - new Date(a.createdAt)
  );

  //Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);
  console.log("currentProducts:", currentProducts);

  const handleSortChange = ({ key }) => {
    if (key === "1") setSort("Price: low to high");
    if (key === "2") setSort("Price: high to low");
    if (key === "3") setSort("Last Added");
    setCurrentPage(1); //reset pagination on sort change
  };

  const items = [
    { key: "1", label: "Price: low to high", onClick: handleSortChange },
    { key: "2", label: "Price: high to low", onClick: handleSortChange },
    { key: "3", label: "Last Added", onClick: handleSortChange },
  ];

  const SortDropdown = () => (
    <Dropdown
      menu={{
        items,
        selectable: true,
        selectedKeys: [
          sort === "Price: low to high"
            ? "1"
            : sort === "Price: high to low"
            ? "2"
            : "3",
        ],
      }}
    >
      <Button
        style={{
          backgroundColor: "#fff",
          color: "#000",
          border: "1px solid #D9D9D9",
        }}
      >
        <Space>
          {sort}
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
        <Title
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#111827",
            margin: 0,
          }}
        >
          Products
        </Title>
        <Flex wrap align="center" justify="space-between" gap={10}>
          <SortDropdown />
          { userRole === 'hr' &&
            <Button
              type="primary"
              style={{ borderRadius: "4px", backgroundColor: "#5048E5" }}
              onClick={() => navigate(`/admin/create-product`)}
            >
              Add Product
            </Button>
          }
        </Flex>
      </Flex>

      <div className="product-grid">
        {currentProducts.map((product) => (
          <div className="product-item" key={product._id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="pagination-wrapper">
        <Pagination
          style={{ marginTop: "24px" }}
          current={currentPage}
          pageSize={pageSize}
          total={sortedProducts.length}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
    </MainLayout>
  );
}
