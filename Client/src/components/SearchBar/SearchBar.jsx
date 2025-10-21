import { Input, Spin } from "antd";
import { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { setQuery, clearSearchResults } from "../../store/search/searchSlice";
import { fetchSearchThunk } from "../../store/search/searchThunk";
import { SearchOutlined } from "@ant-design/icons";
import "./SearchBar.css";

const SearchProduct = () => {
  const [searchInput, setSearchInput] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { results, status } = useSelector((store) => store.search);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search
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

  //Prevents pending debounced calls when the component unmounts
  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  //Open dropdown if results exist
  useEffect(() => {
    if (results.length > 0) setOpen(true);
  }, [results]);

  //Close dropdown when clickin outide the results box
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  //Update local state input
  const searchHandler = (value) => {
    setSearchInput(value);
    if (value.trim().length === 0) {
      dispatch(clearSearchResults());
      setOpen(false);
    }
    debouncedSearch(value);
  };

  //Navigate to specific product when select
  const selectHandler = (id) => {
    navigate(`/products/${id}`);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="search-container">
      <Input
        size="large"
        value={searchInput}
        onChange={(e) => searchHandler(e.target.value)}
        placeholder="Search"
        autoComplete="off"
        suffix={
          status === "loading" ? (
            <Spin size="small" />
          ) : (
            <SearchOutlined style={{ color: "#979797" }} />
          )
        }
        onFocus={() => {
          if (results.length > 0) setOpen(true);
        }}
        className="search-input"
      />

      {open && (
        <div className="search-dropdown" role="status" aria-live="polite">
          {results.length > 0 ? (
            results.map((item) => (
              <div
                key={item._id}
                onClick={() => selectHandler(item._id)}
                className="search-dropdown-item"
              >
                {item.name}
              </div>
            ))
          ) : (
            <div className="search-dropdown-item">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchProduct;
