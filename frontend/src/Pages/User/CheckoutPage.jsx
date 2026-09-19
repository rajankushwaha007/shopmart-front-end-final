import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import Breadcrum from '../../Components/Breadcrum'

import { getCart, deleteCart } from "../../Redux/ActionCreators/CartActionCreators"
import { createCheckout } from "../../Redux/ActionCreators/CheckoutActionCreators"
import { getProduct, updateProduct } from "../../Redux/ActionCreators/ProductActionCreators"
export default function CheckoutPage() {
    let [user, setUser] = useState({ address: [] })

    let [data, setData] = useState([])
    let [subtotal, setSubtotal] = useState(0)
    let [shipping, setShipping] = useState(0)
    let [total, setTotal] = useState(0)

    let [selected, setSelected] = useState({
        deliveryAddress: {},
        paymentMode: "COD"
    })

    let CartStateData = useSelector(state => state.CartStateData)
    let ProductStateData = useSelector(state => state.ProductStateData)
    let dispatch = useDispatch()
    let navigate = useNavigate()

    function placeOrder() {
        let item = {
            user: user._id,
            deliveryAddress: selected.deliveryAddress,
            orderStatus: "Order Has Been Placed",
            paymentMode: selected.paymentMode,
            paymentStatus: "Pending",
            subtotal: subtotal,
            shipping: shipping,
            total: total,
            products: data
        }
        dispatch(createCheckout({ ...item }))
        data.forEach(cart => {
            let p = ProductStateData.find(pr => pr._id === cart.product?._id)
            p.stockQuantity = p.stockQuantity - cart.quantity
            p.stock = p.stockQuantity === 0 ? false : true
            dispatch(updateProduct({ ...p }))

            dispatch(deleteCart({ _id: cart._id }))
        })
        if (selected.paymentMode === "COD")
            navigate("/order-confirmation")
        else
            navigate("/payment/-1")

    }

    function calculate(cart) {
        let sum = 0
        cart.forEach(x => sum = sum + x.total)
        if (sum > 0 && sum < 1000) {
            setTotal(sum + 150)
            setShipping(150)
        }
        else {
            setTotal(sum)
            setShipping(0)
        }
        setSubtotal(sum)
    }
    useEffect(() => {
        (() => {
            dispatch(getCart())
            if (CartStateData.length) {
                // let cart = CartStateData.filter(x => x.user?.name === localStorage.getItem("userid"))
                let cart = CartStateData
                setData(cart)
                calculate(cart)
            }
        })()
    }, [CartStateData.length])

    useEffect(() => {
        (async () => {
            let response = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/user/${localStorage.getItem("userid")}`, {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    "authorization": localStorage.getItem("token")
                }
            })
            response = await response.json()
            setUser({ ...response.data, address: response.data?.address || [] })
            if (response.data?.address)
                setSelected({ ...selected, deliveryAddress: response.data?.address[0] })
        })()
    }, [])

    useEffect(() => {
        (() => dispatch(getProduct()))()
    }, [ProductStateData.length])
    return (
        <>
            <Breadcrum title="Checkout" />
            <div className="container-fluid bg-light overflow-hidden py-5">
                <div className="container py-5">
                    <div className="row g-5">
                        <div className="col-lg-6 col-xl-6 wow fadeInUp" data-wow-delay="0.3s">
                            <h3 className="mb-4 wow fadeInUp" data-wow-delay="0.1s">Billing Address</h3>
                            {user.address?.length !== 0 ?
                                user.address?.map((item, index) => {
                                    return <div key={index} className='card p-3 mb-3' onClick={() => setSelected({ ...selected, deliveryAddress: item })}>
                                        <h6>{item.name}</h6>
                                        <p>{item.phone},{item.email}</p>
                                        <p>{item.address}</p>
                                        <p>{item.pin},{item.city},{item.state}</p>
                                        {selected.deliveryAddress.address === item.address ? <i className='bi bi-check fs-3 m-3 position-absolute end-0'></i> : null}
                                    </div>
                                }) :
                                <div className='card p-5 text-center'>
                                    <h3>Delivery Address Not Found</h3>
                                    <h4>Please Create atleast One Delivery Address</h4>
                                    <Link to="/profile?option=Address" className='btn btn-primary w-100 m-auto'>Create Address</Link>
                                </div>
                            }
                        </div>
                        <div className="col-lg-6 col-xl-6 wow fadeInUp" data-wow-delay="0.3s">
                            <h3 className="mb-4 wow fadeInUp" data-wow-delay="0.1s">Items in Cart</h3>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr className="text-center">
                                            <th scope="col" className="text-start">Name</th>
                                            <th scope="col">Brand</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Quantity</th>
                                            <th scope="col">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map(item => {
                                            return <tr key={item._id} className="text-center">
                                                <td scope="row" className="text-start py-4">
                                                    <h6>{item.product?.name}</h6>
                                                    <p>{item.color}/{item.size}</p>
                                                </td>
                                                <td className="py-4">{item.product?.brand?.name}</td>
                                                <td className="py-4">&#8377;{item.product?.finalPrice}</td>
                                                <td className="py-4 text-center">{item.quantity}</td>
                                                <td className="py-4">&#8377;{item.total}</td>
                                            </tr>
                                        })}
                                    </tbody>
                                </table>
                                <table className='table table-bordered'>
                                    <tbody>
                                        <tr>
                                            <th>Subtotal</th>
                                            <td>&#8377;{subtotal}</td>
                                        </tr>
                                        <tr>
                                            <th>Shipping</th>
                                            <td>&#8377;{shipping}</td>
                                        </tr>
                                        <tr>
                                            <th>Total</th>
                                            <td>&#8377;{total}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="row g-4 text-center align-items-center justify-content-center border-bottom py-2">
                                <div className="col-6">
                                    <div className="form-check text-start my-2">
                                        <input type="checkbox" className="form-check-input bg-primary border-0" id="cod"
                                            onChange={() => setSelected({ ...selected, paymentMode: "COD" })} checked={selected.paymentMode === "COD" ? true : false} />
                                        <label className="form-check-label" htmlFor="cod">COD</label>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-check text-start my-2">
                                        <input type="checkbox" className="form-check-input bg-primary border-0" id="netbanking"
                                            onChange={() => setSelected({ ...selected, paymentMode: "Netbaking" })} checked={selected.paymentMode !== "COD" ? true : false} />
                                        <label className="form-check-label" htmlFor="netbanking">Net Banking/Card/UPI</label>
                                    </div>
                                </div>
                            </div>
                            {user.address && user.address?.length !== 0 ? <div className="row g-4 text-center align-items-center justify-content-center pt-4">
                                <button type="button" onClick={placeOrder} className="btn btn-primary border-secondary text-uppercase w-100 text-primary">Place Order</button>
                            </div> : null}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
