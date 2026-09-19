import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import Breadcrum from '../../Components/Breadcrum'

import { getCart, deleteCart, updateCart } from "../../Redux/ActionCreators/CartActionCreators"
export default function CartPage() {
    let [data, setData] = useState([])
    let [subtotal, setSubtotal] = useState(0)
    let [shipping, setShipping] = useState(0)
    let [total, setTotal] = useState(0)

    let CartStateData = useSelector(state => state.CartStateData)
    let dispatch = useDispatch()

    function deleteRecord(_id) {
        if (window.confirm("Are You Sure to Delete That Record")) {
            dispatch(deleteCart({ _id: _id }))
            setData(data.filter(x => x._id !== _id))
        }
    }

    function updateRecord(_id, option) {
        let item = data.find(x => x._id === _id)
        if ((item.quantity === 1 && option === "DEC") || (item.quantity === item.stockQuantity && option === "INC"))
            return

        let index = data.findIndex(x => x._id === _id)
        if (option === "DEC") {
            item.quantity = item.quantity - 1
            item.total = item.total - item.product?.finalPrice
        }
        else {
            item.quantity = item.quantity + 1
            item.total = item.total + item.product?.finalPrice
        }
        data[index] = { ...item }
        dispatch(updateCart({...item}))
        setData(data)
        calculate(data)
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
    return (
        <>
            <Breadcrum title="Cart" />
            <div className="container-fluid py-5">
                <div className="container py-5">
                    {data.length ?
                        <>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Name</th>
                                            <th>Brand</th>
                                            <th>Color</th>
                                            <th>Size</th>
                                            <th>Stock Quantity</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Total</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item) => {
                                            return <tr key={item._id}>
                                                <th scope="row">
                                                    <Link to={`${import.meta.env.VITE_APP_IMAGE_SERVER}${item.product?.pic[0]}`} target='_blank'>
                                                        <img src={`${import.meta.env.VITE_APP_IMAGE_SERVER}${item.product?.pic[0]}`} height={70} width={70} alt="" />
                                                    </Link>
                                                </th>
                                                <th scope="row"><p className="mb-0 py-4">{item.product?.name}</p></th>
                                                <td><p className="mb-0 py-4">{item.product?.brand?.name}</p></td>
                                                <td><p className="mb-0 py-4">{item.color}</p></td>
                                                <td><p className="mb-0 py-4">{item.size}</p></td>
                                                <td><p className="mb-0 py-4">{item.product?.stockQuantity}</p></td>
                                                <td><p className="mb-0 py-4">&#8377;{item.product?.finalPrice}</p></td>
                                                <td>
                                                    <div className="input-group quantity py-4" style={{ width: "100px" }}>
                                                        <div className="input-group-btn">
                                                            <button className="btn btn-sm btn-minus rounded-circle bg-light border" onClick={() => updateRecord(item._id, "DEC")}>
                                                                <i className="fa fa-minus"></i>
                                                            </button>
                                                        </div>
                                                        <input type="text" className="form-control form-control-sm text-center border-0"
                                                            value={item.quantity} />
                                                        <div className="input-group-btn">
                                                            <button className="btn btn-sm btn-plus rounded-circle bg-light border" onClick={() => updateRecord(item._id, "INC")}>
                                                                <i className="fa fa-plus"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><p className="mb-0 py-4">&#8377;{item.total}</p></td>
                                                <td className="py-4">
                                                    <button className="btn btn-md rounded-circle bg-light border" onClick={() => deleteRecord(item._id)}>
                                                        <i className="fa fa-times text-danger"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        })}

                                    </tbody>
                                </table>
                            </div>
                            <div className="row g-4 justify-content-end">
                                <div className="col-8"></div>
                                <div className="col-sm-8 col-md-7 col-lg-6 col-xl-4">
                                    <div className="bg-light rounded">
                                        <div className="p-4">
                                            <h3 className="mb-3">Cart <span className="fw-normal">Total</span></h3>
                                            <div className="d-flex justify-content-between mb-4">
                                                <h5 className="mb-0 me-4">Subtotal:</h5>
                                                <p className="mb-0">&#8377;{subtotal}</p>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <h5 className="mb-0 me-4">Shipping</h5>
                                                <div>
                                                    <p className="mb-0">&#8377;{shipping}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="py-2 mb-4 border-top border-bottom d-flex justify-content-between">
                                            <h5 className="mb-0 ps-4 me-4">Total</h5>
                                            <p className="mb-0 pe-4">&#8377;{total}</p>
                                        </div>
                                        <Link to="/checkout" className="w-100 btn btn-primary rounded-pill text-uppercase">Proceed To Checkout</Link>
                                    </div>
                                </div>
                            </div>
                        </> :
                        <div className='card p-5 text-center'>
                            <h3>No Items in Cart</h3>
                            <Link to="/shop" className='btn btn-primary w-25 m-auto'>Shop Now</Link>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}
