import React from "react";

export default function UserCardBlock(props) {
  console.log("mijn props", props);
  const renderItems = () =>
    props.products &&
    props.products.map((product) => (
      <tr key={product._id}>
        <td>
          <img
            src={product.images[0]}
            alt="product"
            style={{ width: "70px", height: "70px" }}
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
