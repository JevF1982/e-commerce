import React from "react";
import { Carousel } from "antd";

const ImageSlider = (props) => {
  return (
    <div>
      <Carousel autoplay>
        {props.images.map((image, index) => {
          return (
            <div key={index}>
              <img
                src={image}
                alt={`product_image-${index}`}
                style={{ height: "150px", width: "100%" }}
              />
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

export default ImageSlider;
