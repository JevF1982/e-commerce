import React, { useEffect, useState } from "react";
import { Icon, Row, Col, Card } from "antd";
import ImageSlider from "../../utils/ImageSlider";
import Axios from "axios";
import Checkbox from "../LandingPage/sections/Checkbox";
import RadioBox from "../LandingPage/sections/RadioBox";
import { continents, price } from "../LandingPage/sections/Data";

const { Meta } = Card;

function LandingPage() {
  const [Products, setProducts] = useState([]);
  const [Limit, setLimit] = useState(8);
  const [Skip, setSkip] = useState(0);
  const [PostSize, setPostSize] = useState(0);
  const [Filters, setFilters] = useState({
    continents: [],
    price: [],
  });

  const getProduct = (variables) => {
    Axios.post("/api/product/getProducts", variables).then((res) => {
      if (res.data.success) {
        if (variables.loadMore) {
          setProducts([...Products, ...res.data.products]);
        } else {
          setProducts(res.data.products);
        }

        setPostSize(res.data.postSize);
      } else {
        alert("Failed to fetch product data");
      }
    });
  };

  useEffect(() => {
    const variables = {
      skip: Skip,
      limit: Limit,
    };

    getProduct(variables);
  }, []);

  const handleLoadMore = () => {
    let skipPosts = Skip + Limit;

    setSkip(skipPosts);

    const variables = {
      skip: skipPosts,
      limit: Limit,
      loadMore: true,
    };

    getProduct(variables);
  };

  const renderCards = Products.map((product, index) => {
    return (
      <Col lg={6} md={8} sm={12} xs={24} key={index}>
        <Card hoverable={true} cover={<ImageSlider images={product.images} />}>
          <Meta title={product.title} description={`€${product.price}`} />
        </Card>
      </Col>
    );
  });

  const showFilteredResults = (filters) => {
    const variables = {
      skip: 0,
      limit: Limit,
      filters: filters,
    };
    getProduct(variables);
    setSkip(0);
  };

  const handlePrice = (value) => {
    const data = price;
    let array = [];

    for (let key in data) {
      if (data[key]._id === parseInt(value, 10)) {
        array = data[key].array;
      }
    }
    return array;
  };

  const handleFilters = (filters, category) => {
    const newFilter = { ...Filters };

    newFilter[category] = filters;

    if (category === "price") {
      let priceValue = handlePrice(filters);
      newFilter[category] = priceValue;
      console.log(newFilter);
    }

    showFilteredResults(newFilter);
    setFilters(newFilter);
  };

  return (
    <>
      <div style={{ width: "75%", margin: "3rem auto" }}>
        <div style={{ textAlign: "center" }}>
          <h2>
            Let's travel anywhere <Icon type="rocket" />
          </h2>
          <br />
          <div>
            <Row>
              <Col lg={12} md={12} sm={24} xs={24}>
                {" "}
                <Checkbox
                  continents={continents}
                  handleFilters={(filters) =>
                    handleFilters(filters, "continents")
                  }
                />
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                {" "}
                <RadioBox
                  price={price}
                  handleFilters={(filters) => handleFilters(filters, "price")}
                />
              </Col>
            </Row>
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        {Products.length === 0 ? (
          <div
            style={{
              display: "flex",
              height: "300px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h2>No products yet</h2>
          </div>
        ) : (
          <div>
            <Row gutter={[16, 16]}>{renderCards}</Row>
          </div>
        )}

        <br />
        <br />

        {PostSize >= Limit && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button onClick={handleLoadMore}>Load More</button>
          </div>
        )}
      </div>
    </>
  );
}

export default LandingPage;
