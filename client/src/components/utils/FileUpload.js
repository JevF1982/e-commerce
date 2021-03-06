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

    files.map((files) => formData.append("file", files));

    // save the image on node server

    Axios.post("/api/product/uploadImage", formData, config).then((res) => {
      let imageArray = [];
      if (res.data.success) {
        res.data.data.forEach(async (element) => {
          imageArray.push(element.location);
          await setimages(images.concat(imageArray));
          await props.refreshFunction(images.concat(imageArray));
        });

        getSignedRequest(files[0]);
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

  const getSignedRequest = (file) => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      `/api/product/sign-s3?file-name=${file.name}&file-type=${file.type}`
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          uploadFile(file, response.signedRequest, response.url);
        } else {
          alert("Could not get signed URL.");
        }
      }
    };
    xhr.send();
  };

  const uploadFile = (file, signedRequest, url) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", signedRequest);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log("Picture uploaded");
        } else {
          alert("Could not upload file.");
        }
      }
    };
    xhr.send(file);
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
