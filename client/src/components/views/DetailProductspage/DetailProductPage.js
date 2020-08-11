import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import ProductImage from "../DetailProductspage/Sections/ProductImage";
import ProductInfo from "../DetailProductspage/Sections/ProductInfo";
import Axios from "axios";
import { addToCart } from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";

function DetailProductPage(props) {
  const productId = props.match.params.productId;
  const dispatch = useDispatch();
  const [Product, setProduct] = useState([]);

  useEffect(() => {
    Axios.get(`/api/product/products_by_id?id=${productId}&type=single`).then(
      (res) => {
        setProduct(res.data[0]);
      }
    );
  }, []);

  const addToCartHandler = (productId) => {
    dispatch(addToCart(productId));
  };

  return (
    <div className="postPage" style={{ width: "100%", padding: "3rem 4rem" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1>{Product.title}</h1>
      </div>
      <br />

      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          <ProductImage details={Product} />
        </Col>
        <Col lg={12} xs={24}>
          <ProductInfo addToCart={addToCartHandler} details={Product} />
        </Col>
      </Row>
    </div>
  );
}

export default DetailProductPage;
