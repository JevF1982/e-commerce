import React, { useEffect, useState } from "react";
import {
  getCartItems,
  removeCartItems,
  onSuccessBuy,
} from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";
import UserCardBlock from "../CartPage/UserCardBlock";
import { Result, Empty } from "antd";
import Paypal from "../../utils/Paypal";

import Axios from "axios";

export default function CartPage(props) {
  const dispatch = useDispatch();

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    let cartItems = [];

    if (props.user.userData && props.user.userData.cart) {
      if (props.user.userData.cart.length > 0) {
        props.user.userData.cart.forEach((item) => {
          cartItems.push(item.id);
        });
        dispatch(getCartItems(cartItems, props.user.userData.cart));
      }
    }
  }, [props.user.userData, dispatch]);

  const calculateTotalAmount = () => {
    let total = 0;

    if (!showSuccess) {
      props.user.cartDetail &&
        props.user.cartDetail.map((price) => {
          let amountTotal = price.price * price.quantity;
          return (total += amountTotal);
        });
      return total;
    }
  };

  const handleRemove = (productId) => {
    dispatch(removeCartItems(productId));
  };

  const transactionSuccess = (data) => {
    console.log("transaction success paypal");

    let variables = {
      cartDetail: props.user.cartDetail,
      paymentData: data,
    };

    Axios.post("/api/users/successBuy", variables).then((res) => {
      if (res.data.success) {
        setShowSuccess(true);

        dispatch(
          onSuccessBuy({
            cart: res.data.cart,
            cartDetail: res.data.cartDetail,
          })
        );
      } else {
        alert("Failed to buy item");
        setShowSuccess(false);
      }
    });
  };

  const transactionError = () => {
    console.log("transaction error paypal");
  };

  const transactionCancelled = () => {
    console.log("transaction cancelled paypal");
  };

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <h1>My Cart</h1>
      <div>
        <UserCardBlock
          products={props.user.cartDetail}
          handleRemove={handleRemove}
        />

        {!showSuccess && (
          <div style={{ marginTop: "3rem" }}>
            <h2>Total Amount : €{calculateTotalAmount()}</h2>
          </div>
        )}
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <br />
        {calculateTotalAmount() === 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Empty description={false} />
            <p>No Items In Your Cart</p>
          </div>
        )}
      </div>

      {showSuccess && (
        <Result status="success" title="Successfully Purchased Items" />
      )}

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        {!showSuccess && (
          <Paypal
            toPay={calculateTotalAmount}
            onSuccess={transactionSuccess}
            transactionError={transactionError}
            transactionCancelled={transactionCancelled}
          />
        )}
      </div>
    </div>
  );
}
