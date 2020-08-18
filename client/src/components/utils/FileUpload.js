import React, { useState } from "react";
import Dropzone from "react-dropzone";
import Axios from "axios";

function FileUpload(props) {
  const [images, setimages] = useState([]);

  // handle and post product images

  const onDrop = (files) => {
    let formData = new FormData();

    const config = {
      header: { "content-type": "multipart/form-data" },
    };

    formData.append("file", files[0]);

    // save the image on node server

    Axios.post("/api/product/uploadImage", formData, config).then((res) => {
      if (res.data.success) {
        setimages([...images, res.data.path]);
        props.refreshFunction([...images, res.data.path]);
      } else {
        alert("Failed to save Image on Server");
      }
    });
  };

  // handle and delete product images

  const handleDelete = (image) => {
    const newImageArr = images.filter((pic) => {
      return image !== pic;
    });

    setimages(newImageArr);
    props.refreshFunction(newImageArr);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          marginTop: "40px",
          justifyContent: "space-between",
        }}
      >
        <Dropzone
          onDrop={onDrop}
          uploadMultiple={true}
          maxSize={80000000000}
          minSize={0}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              style={{
                width: "150px",
                height: "150px",
                border: "1px solid black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "40px",
                cursor: "pointer",
                marginRight: "20px",
              }}
              {...getRootProps()}
            >
              <input {...getInputProps()} multiple name="file" />+
            </div>
          )}
        </Dropzone>

        {images.length ? (
          <div
            style={{
              display: "flex",
              width: "150px",
              height: "150px",
              border: "1px solid black",
              overflowX: "scroll",
            }}
          >
            {images.map((image, index) => (
              <div key={index} onClick={() => handleDelete(image)}>
                <img
                  style={{
                    minWidth: "150px",
                    width: "150px",
                    height: "150px",
                  }}
                  src={image}
                  alt={`ProductImage-${index}`}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}

export default FileUpload;
