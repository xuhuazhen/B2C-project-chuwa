import { useState, useEffect } from "react";
import { AutoComplete, Input, Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getSearch } from "../service/productService";
import { useNavigate } from "react-router-dom";

const SearchProduct = () => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(searchInput), 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const { data, isFetching } = useQuery({
    queryKey: ["search", debouncedValue],
    queryFn: () => getSearch(debouncedValue),
    enabled: !!debouncedValue, //only fetch if there is input
  });

  const products = data?.products || [];

  const options = products.map((product) => ({
    value: product._id,
    label: product.name,
  }));

  console.log(options);

  return (
    <AutoComplete
      style={{ width: 300 }}
      options={options}
      onSearch={(value) => setSearchInput(value)}
      notFoundContent={isFetching ? <Spin size="small" /> : "No results"}
      placeholder="Search"
      allowClear
      onSelect={(value) => navigate(`/products/${value}`)}
    >
      <Input.Search size="middle" enterButton />
    </AutoComplete>
  );
};

export default SearchProduct;
