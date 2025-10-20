// // import { AutoComplete, Input, Spin } from "antd";
// import { Input } from "antd";

// import { useState, useMemo, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import debounce from "lodash.debounce";
// import { setQuery, clearSearchResults } from "../store/search/searchSlice";
// import { fetchSearchThunk } from "../store/search/searchThunk";
// import "./SearchBar.css";
// import { SearchOutlined } from "@ant-design/icons";

// const SearchProduct = () => {
//   const [searchInput, setSearchInput] = useState("");
//   const [open, setOpen] = useState(false);
//   const dispatch = useDispatch();
//   const { results, status } = useSelector((store) => store.search);
//   const navigate = useNavigate();

//   const debouncedSearch = useMemo(
//     () =>
//       debounce(async (value) => {
//         const input = value.trim();
//         dispatch(setQuery(input));

//         if (input.length <= 1) {
//           dispatch(clearSearchResults());
//           return;
//         }

//         await dispatch(fetchSearchThunk(input));
//       }, 300),
//     [dispatch]
//   );

//   //Cleanup debounce on unmount
//   useEffect(() => {
//     return () => debouncedSearch.cancel();
//   }, [debouncedSearch]);

//   // const searchHandler = (value) => {
//   //   setSearchInput(value);
//   //   debouncedSearch(value);
//   // };

//   const searchHandler = (value) => {
//     setSearchInput(value);
//     if (value.trim().length > 0) setOpen(true);
//     debouncedSearch(value);
//   };

//   const selectHandler = (value) => {
//     if (value) navigate(`/products/${value}`);
//   };

//   // const options = results.map((product) => ({
//   //   value: product._id,
//   //   label: product.name,
//   // }));

//   // console.log(options);

//   return (
//     <div style={{ position: "relative", width: "250px" }}>
//       <Input
//         size="large"
//         style={{ borderRadius: "4px" }}
//         value={searchInput}
//         onChange={(e) => searchHandler(e.target.value)}
//         placeholder="Search"
//         suffix={<SearchOutlined />}
//         autoComplete="off"
//         onBlur={() => setTimeout(() => setOpen(false), 200)}
//       />
//       {open && results.length > 0 && (
//         <div
//           style={{
//             position: "absolute",
//             top: "40px",
//             left: 0,
//             right: 0,
//             background: "#fff",
//             border: "1px solid #ddd",
//             borderRadius: "6px",
//             boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//             zIndex: 1000,
//             maxHeight: "180px",
//             overflowY: "auto",
//           }}
//         >
//           {results.map((item) => (
//             <div
//               key={item._id}
//               onClick={() => selectHandler(item._id)}
//               style={{
//                 padding: "8px 12px",
//                 cursor: "pointer",
//               }}
//               onMouseEnter={(e) =>
//                 (e.currentTarget.style.background = "#f5f5f5")
//               }
//               onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
//             >
//               {item.name}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>

//     // <AutoComplete
//     //   // popupClassName="custom-autocomplete"
//     //   // style={{ width: 300, borderRadius: "4px" }}
//     //   options={options}
//     //   onSearch={searchHandler}
//     //   notFoundContent={
//     //     status === "loading" ? <Spin size="small" /> : "No results"
//     //   }
//     //   placeholder="Search products"
//     //   allowClear
//     //   onSelect={selectHandler}
//     // >
//     //   <Input.Search
//     //     style={{}}
//     //     size="large"
//     //     enterButton
//     //     onSearch={selectHandler}
//     //   />
//     // </AutoComplete>
//   );
// };

// export default SearchProduct;

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

  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const { results, status } = useSelector((store) => store.search);
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

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  useEffect(() => {
    if (results.length > 0) setOpen(true);
  }, [results]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const searchHandler = (value) => {
    setSearchInput(value);
    if (value.trim().length === 0) {
      dispatch(clearSearchResults());
      setOpen(false);
    }
    debouncedSearch(value);
  };

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

      {open && results.length > 0 && (
        <div className="search-dropdown">
          {results.map((item) => (
            <div
              key={item._id}
              onClick={() => selectHandler(item._id)}
              className="search-dropdown-item"
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchProduct;
