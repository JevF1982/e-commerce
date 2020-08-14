import React, { useState, useEffect } from "react";
import ImageGallery from "react-image-gallery";

function ProductImage(props) {
  const [Images, setImages] = useState([]);

  useEffect(() => {
    if (props.details.images && props.details.images.length > 0) {
      let images = [];
      props.details.images &&
        props.details.images.map((image) =>
          images.push({
            original: `/${image.filename}`,
            thumbnail: `/${image.filename}`,
          })
        );

      setImages(images);
    }
  }, [props.details]);

  return (
    <div>
      <ImageGallery items={Images} />
    </div>
  );
}

export default ProductImage;
