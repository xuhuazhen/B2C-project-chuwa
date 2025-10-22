import { AutoComplete, Input, Spin } from "antd";
import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { setQuery, clearSearchResults } from "../store/search/searchSlice";
import { fetchSearchThunk } from "../store/search/searchThunk";

const SearchProduct = () => {
  const [searchInput, setSearchInput] = useState("");
  const dispatch = useDispatch();
  const { results, status } = useSelector((store) => store.search);
  const navigate = useNavigate();

  const debouncedSearch = useMemo(
    () =>
      debounce(async (value) => {
        const input = value.trim();
        dispatch(setQuery(input));

        if (input.length <= 1) {
          dispatch(clearSearchResults());
          return;
        }

        await dispatch(fetchSearchThunk(input));
      }, 300),
    [dispatch]
  );

  //Cleanup debounce on unmount
  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const searchHandler = (value) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  const selectHandler = (value) => {
    if (value) navigate(`/products/${value}`);
  };

  const options = results.map((product) => ({
    value: product._id,
    label: product.name,
  }));

  console.log(options);

  return (
    <AutoComplete
      style={{ width: 300 }}
      options={options}
      onSearch={searchHandler}
      notFoundContent={
        status === "loading" ? <Spin size="small" /> : "No results"
      }
      placeholder="Search products"
      allowClear
      onSelect={selectHandler}
    >
      <Input.Search size="large" enterButton onSearch={selectHandler} />
    </AutoComplete>
  );
};

export default SearchProduct;
