import React, { useState } from "react";
import FileUpload from "../../utils/FileUpload";
import Axios from "axios";

function UploadProductPage(props) {
  const [inputValue, setInputValue] = useState({
    title: "",
    description: "",
    price: 0,
  });

  const [Continents, setContinents] = useState(1);

  const continentArray = [
    {
      key: 1,
      value: "Africa",
    },
    {
      key: 2,
      value: "Europe",
    },
    {
      key: 3,
      value: "North-America",
    },
    {
      key: 4,
      value: "South-America",
    },
    {
      key: 5,
      value: "Asia",
    },
    {
      key: 6,
      value: "Australia",
    },
    {
      key: 7,
      value: "Antarctica",
    },
  ];

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setInputValue({
      ...inputValue,
      [e.target.name]: [e.target.value],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !inputValue.title[0] ||
      !inputValue.description[0] ||
      !inputValue.price[0] ||
      !images
    ) {
      return alert("Please fill in all fields !");
    }

    const variables = {
      writer: props.user.userData._id,
      title: inputValue.title[0],
      description: inputValue.description[0],
      price: inputValue.price[0],
      images: images,
      continents: Continents,
    };

    Axios.post("/api/product/uploadProduct", variables).then((response) => {
      if (response.data.success) {
        alert("Product successfully uploaded");
        props.history.push("/");
      } else {
        alert("Failed upload product");
      }
    });
  };

  const handleSelectedContinent = (e) => {
    setContinents(e.target.value);
  };

  const updateImages = (newImage) => {
    setImages(newImage);
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "2rem auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "2rem",
        }}
      ></div>
      <form onSubmit={handleSubmit}>
        <h2 style={{ display: "block" }}>Upload Travel Product</h2>

        <FileUpload refreshFunction={updateImages} />

        <br />
        <br />
        <label style={{ display: "block" }}>Title</label>
        <input
          onChange={handleChange}
          value={inputValue.title || " "}
          name="title"
        />
        <br />
        <br />
        <label style={{ display: "block" }}>Description</label>
        <textarea
          onChange={handleChange}
          value={inputValue.description || " "}
          name="description"
        />
        <br />
        <br />
        <label style={{ display: "block" }}>Price</label>
        <input
          type="number"
          onChange={handleChange}
          value={inputValue.price || " "}
          name="price"
          style={{ marginRight: "20px" }}
        />
        <select onChange={handleSelectedContinent}>
          {continentArray.map((continent, index) => (
            <option key={index} value={continentArray[index].key}>
              {continent.value}
            </option>
          ))}
        </select>
        <br />
        <br />
        <button onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  );
}

export default UploadProductPage;
