import React, { useEffect, useState } from "react";
import { useRazorpay } from "react-razorpay";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { getCheckout } from "../../Redux/ActionCreators/CheckoutActionCreators";
import Breadcrum from "../../Components/Breadcrum"

export default function Payment() {
    var [checkout, setcheckout] = useState({})

    const { Razorpay } = useRazorpay();

    var navigate = useNavigate()

    var { _id } = useParams()

    var dispatch = useDispatch()
    var allCheckouts = useSelector((state) => state.CheckoutStateData)


    async function getData() {
        dispatch(getCheckout())
        if (allCheckouts.length) {
            var result
            if (_id === "-1")
                result = allCheckouts[0]
            else
                result = allCheckouts.find((item) => item._id === _id)

            setcheckout(result)
        }
    }
    useEffect(() => {
        getData()
    }, [allCheckouts.length])

    const initPayment = (data) => {
        const options = {
            key: import.meta.env.VITE_APP_RPKEYID,
            amount: data.amount,
            currency: "INR",
            order_id: data._id,
            "prefill": {
                "name": checkout?.deliveryAddress?.name,
                "email": checkout?.deliveryAddress?.email,
                "contact": checkout?.deliveryAddress?.phone,
            },
            handler: async (response) => {
                try {
                    var item = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        checkid: checkout._id
                    }
                    response = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/checkout/verify-order`, {
                        method: "post",
                        headers: {
                            "content-type": "application/json",
                            "authorization": localStorage.getItem("token")
                        },
                        body: JSON.stringify(item)
                    });
                    response = await response.json()
                    if (response.result === "Done") {
                        dispatch(getCheckout())
                        navigate("/order-confirmation")
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            theme: {
                color: "#0d6efc",
            },
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
    };

    const handlePayment = async () => {
        try {
            var response = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/checkout/order`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    authorization: localStorage.getItem("token")
                },
                body: JSON.stringify({ amount: checkout.total })
            });
            response = await response.json()
            initPayment(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Breadcrum title="Online Payment" description="Enjoy fast, secure, and hassle-free payments through Razorpay at Heritage Ally. Complete your purchases using UPI, credit cards, debit cards, net banking, or digital wallets with advanced security and seamless transaction processing for a safe and convenient checkout experience." />

            <div className="container my-5">
                <h4 className="text-center border border-dark p-2">Pay With Razorpay</h4>
                {
                    checkout ? <button onClick={handlePayment} className="btn btn-primary w-100">
                        Pay(&#8377;{checkout.total}) With Razorpay
                    </button> : ""
                }
            </div>
        </>
    );
}
