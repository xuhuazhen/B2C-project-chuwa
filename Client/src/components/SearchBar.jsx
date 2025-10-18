import { useState, useEffect } from "react";
import { AutoComplete, Input, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSearchResults, clearSearch } from "../store/search/searchSlice";

const SearchProduct = () => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { results: products, isFetching } = useSelector(
    (state) => state.search
  );

  // Debounce user input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(searchInput), 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Fetch search results
  useEffect(() => {
    if (!debouncedValue.trim()) {
      dispatch(clearSearch()); //clear previous search results from the Redux store
      return;
    }
    dispatch(fetchSearchResults(debouncedValue));
  }, [debouncedValue, dispatch]);

  const options = (products || []).map((product) => ({
    value: product._id,
    label: product.name,
  }));

  // console.log(`options ${options}`);

  return (
    <AutoComplete
      style={{ width: 300 }}
      options={options}
      onSearch={(value) => setSearchInput(value)}
      notFoundContent={isFetching ? <Spin size="small" /> : "No results"}
      placeholder="Search products"
      allowClear
      onSelect={(value) => navigate(`/products/${value}`)}
    >
      <Input.Search size="large" enterButton />
    </AutoComplete>
  );
};

export default SearchProduct;
