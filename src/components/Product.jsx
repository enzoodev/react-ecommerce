import React, { memo, useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Product = ({product, addProduct}) => {
  const [selectedVariant, setSelectedVariant] = useState('default');
  const isInStock = true;
  
  // it should come from the api
  const variants = useMemo(() => [
    { id: 'default', name: 'Default', price: product.price },
    { id: 'large', name: 'Large', price: (product.price * 1.2).toFixed(2) },
    { id: 'premium', name: 'Premium', price: (product.price * 1.5).toFixed(2) }
  ], [product.price]);
  
  const currentVariant = variants.find(v => v.id === selectedVariant) ?? variants[0];
  
  const handleAddToCart = useCallback(() => {
    addProduct({...product, variant: currentVariant});
  }, [addProduct, product, currentVariant]);
  
  const handleVariantChange = useCallback((e) => {
    setSelectedVariant(e.target.value);
  }, []);

  return (
    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-4">
        <div className="card text-center h-100 shadow-sm hover-shadow" key={product.id}>
        <img
            className="card-img-top p-3"
            src={product.image}
            alt={product.title}
            style={{ height: '250px', objectFit: 'contain' }}
        />
        <div className="card-body d-flex flex-column">
            <h5 className="card-title fs-6 fw-bold">
            {product.title.length > 20 ? product.title.substring(0, 20) + '...' : product.title}
            </h5>
            <p className="card-text small text-muted flex-grow-1">
            {product.description.length > 80 ? product.description.substring(0, 80) + '...' : product.description}
            </p>
            
            {/* Variant Selection */}
            <div className="mb-3">
              <label htmlFor={`variant-${product.id}`} className="form-label small fw-semibold">
                Variant:
              </label>
              <select 
                id={`variant-${product.id}`}
                className="form-select form-select-sm"
                value={selectedVariant}
                onChange={handleVariantChange}
                disabled={!isInStock}
                aria-label={`Select variant for ${product.title}`}
              >
                {variants.map(variant => (
                  <option key={variant.id} value={variant.id}>
                    {variant.name} - ${variant.price}
                  </option>
                ))}
              </select>
            </div>
        </div>
        <ul className="list-group list-group-flush">
            <li className="list-group-item">
                <span className="fs-5 fw-bold text-primary">$ {currentVariant.price}</span>
                {!isInStock && (
                  <span className="badge bg-danger ms-2">Out of Stock</span>
                )}
            </li>
        </ul>
        <div className="card-body d-flex flex-column gap-2">
            <Link
            to={"/product/" + product.id}
            className="btn btn-outline-primary btn-sm"
            >
            Buy Now
            </Link>
            {isInStock ? (
              <button
                  className="btn btn-primary btn-sm"
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                  aria-label={`Add ${product.title} to cart`}
              >
              Add to Cart
              </button>
            ) : (
              <button
                  className="btn btn-secondary btn-sm"
                  disabled
                  aria-label={`${product.title} is out of stock`}
              >
              Out of Stock
              </button>
            )}
        </div>
        </div>
    </div>
  );
};

Product.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    rating: PropTypes.shape({
      count: PropTypes.number
    }),
    stock: PropTypes.number
  }).isRequired,
  addProduct: PropTypes.func.isRequired
};

export default memo(Product);