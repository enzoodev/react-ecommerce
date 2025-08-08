import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import toast from "react-hot-toast";
import Product from "./Product";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("all");
  const dispatch = useDispatch();
  
  const filteredProducts = useMemo(() => {
    if (category === "all") {
      return products;
    }
    return products.filter((product) => product.category === category);
  }, [products, category]);

  const addProduct = useCallback((product) => {
    toast.success("Added to cart");
    dispatch(addCart(product));
  }, [dispatch]);

  const fetchProducts = async (signal) => {
    try {
      setIsLoading(true);
      const response = await fetch("https://fakestoreapi.com/products/", {
        signal,
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }
      toast.error("Error fetching products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchProducts(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div className="container my-3 py-3">
      <div className="row">
        <div className="col-12">
          <h2 className="display-5 text-center">Latest Products</h2>
          <hr />
        </div>
      </div>
      <div className="row justify-content-center">
        {isLoading ? (
          <>
            <div className="col-12 py-5 text-center">
              <Skeleton height={40} width={560} />
            </div>
            {Array.from({ length: 8 }).map((_, index) => (
              <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-4" key={String(index + 1)}>
                <Skeleton height={400} />
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="buttons text-center py-4">
              <div className="row justify-content-center g-2">
                <div className="col-auto">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setCategory("all")}
                  >
                    All
                  </button>
                </div>
                <div className="col-auto">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setCategory("men's clothing")}
                  >
                    Men's Clothing
                  </button>
                </div>
                <div className="col-auto">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setCategory("women's clothing")}
                  >
                    Women's Clothing
                  </button>
                </div>
                <div className="col-auto">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setCategory("jewelery")}
                  >
                    Jewelery
                  </button>
                </div>
                <div className="col-auto">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setCategory("electronics")}
                  >
                    Electronics
                  </button>
                </div>
              </div>
            </div>
            <div className="row g-3">
              {filteredProducts.map((product) => (
                <Product
                  key={product.id}
                  product={product}
                  addProduct={addProduct}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
