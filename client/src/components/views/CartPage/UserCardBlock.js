import React from "react";

export default function UserCardBlock(props) {
  const renderItems = () =>
    props.products &&
    props.products.map((product) => (
      <tr key={product._id}>
        <td style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={`http://localhost:5000/uploads/${product.images[0].filename}`}
            alt="product"
            style={{ width: "70px", maxHeight: "60px" }}
          />
        </td>
        <td>{product.quantity}</td>
        <td>€{product.price}</td>
        <td>
          <button onClick={() => props.handleRemove(product._id)}>
            Remove
          </button>
        </td>
      </tr>
    ));

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Product image</th>
            <th>Product Quantity</th>
            <th>Product Price</th>
            <th>Remove from Cart</th>
          </tr>
        </thead>
        <tbody>{renderItems()}</tbody>
      </table>
    </div>
  );
}
