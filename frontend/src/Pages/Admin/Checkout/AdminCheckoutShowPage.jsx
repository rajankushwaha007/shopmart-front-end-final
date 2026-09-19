import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Breadcrum from '../../../Components/Breadcrum'
import AdminSidebar from '../../../Components/Admin/AdminSidebar'

import { getCheckout, updateCheckout } from "../../../Redux/ActionCreators/CheckoutActionCreators"
export default function AdminCheckoutShowPage() {
    let { _id } = useParams()
    let [data, setData] = useState({})
    let [orderStatus, setOrderStatus] = useState("")
    let [paymentStatus, setPaymentStatus] = useState("")
    let [flag, setFlag] = useState(false)

    let CheckoutStateData = useSelector(state => state.CheckoutStateData)
    let dispatch = useDispatch()
    let navigate = useNavigate()

    function updateRecord() {
        if (window.confirm("Are You Sure to Status Of That Record")) {
            data.orderStatus = orderStatus
            data.paymentStatus = paymentStatus
            dispatch(updateCheckout({ ...data }))
            setData(data)
            setFlag(!flag)
        }
    }

    useEffect(() => {
        (() => {
            dispatch(getCheckout())
            if (CheckoutStateData.length) {
                let item = CheckoutStateData.find(x => x._id === _id)
                if (item) {
                    setData(item)
                    setOrderStatus(item.orderStatus)
                    setPaymentStatus(item.paymentStatus)
                }
                else
                    navigate("/admin/contact")
            }
        })()
    }, [CheckoutStateData.length])
    return (
        <>
            <Breadcrum title="Admin" />
            <div className="container-fluid my-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminSidebar />
                    </div>
                    <div className="col-md-9">
                        <h5 className='bg-primary text-light text-center p-2'>Checkout Query
                            <Link to="/admin/checkout"><i className='bi bi-arrow-left float-end text-light'></i></Link>
                        </h5>
                        <div className="table-responsive">
                            <table className='table table-bordered'>
                                <tbody>
                                    <tr>
                                        <th>Id</th>
                                        <td>{data._id}</td>
                                    </tr>
                                    <tr>
                                        <th>Delivery Address</th>
                                        <td>
                                            <h5>{data.deliveryAddress?.name}</h5>
                                            <h6>{data.deliveryAddress?.phone},{data.deliveryAddress?.email}</h6>
                                            <p>{data.deliveryAddress?.address}</p>
                                            <p>{data.deliveryAddress?.pin},{data.deliveryAddress?.city},{data.deliveryAddress?.state}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Order Status</th>
                                        <td>{data.orderStatus}
                                            {data.orderStatus !== "Delivered" ?
                                                <select name="orderStatus" value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className='form-select border-primary my-3'>
                                                    <option>Order Has Been Placed</option>
                                                    <option>Order Has Been Packed</option>
                                                    <option>Order Is Ready To Ship</option>
                                                    <option>Order Has Been Shipped</option>
                                                    <option>Order Is In Transit</option>
                                                    <option>Order Has Been Reached At The Final Delivery station</option>
                                                    <option>Order Is Out for Delivery</option>
                                                    <option>Delivered</option>
                                                </select> : null}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Payment Mode</th>
                                        <td>{data.paymentMode}</td>
                                    </tr>
                                    <tr>
                                        <th>Payment Status</th>
                                        <td>{data.paymentStatus}
                                            {data.paymentStatus !== "Done" ?
                                                <select name="paymentStatus" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className='form-select border-primary my-3'>
                                                    <option>Pending</option>
                                                    <option>Done</option>
                                                </select> : null}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Subtotal</th>
                                        <td>&#8377;{data.subtotal}</td>
                                    </tr>
                                    <tr>
                                        <th>Shipping</th>
                                        <td>&#8377;{data.shipping}</td>
                                    </tr>
                                    <tr>
                                        <th>Total</th>
                                        <td>&#8377;{data.total}</td>
                                    </tr>
                                    <tr>
                                        <th>Date</th>
                                        <td>{new Date(data.createdAt).toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <th>RPPID</th>
                                        <td>{data.rppid ? data.rppid : "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2}>
                                            {data.orderStatus !== "Delivered" || data.paymentStatus === "Pending" ?
                                                <button onClick={updateRecord} className='btn btn-primary w-100'>Update Status</button> :
                                                null}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <h5 className='bg-primary text-center p-2 text-light'>Products In This Order</h5>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th>Brand</th>
                                        <th>Color</th>
                                        <th>Size</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.products?.map(item => {
                                        return <tr key={item._id}>
                                            <td>
                                                <Link to={`${import.meta.env.VITE_APP_IMAGE_SERVER}${item.product?.pic[0]}`} target='_blank'>
                                                    <img src={`${import.meta.env.VITE_APP_IMAGE_SERVER}${item.product?.pic[0]}`} height={70} width={70} alt="" />
                                                </Link>
                                            </td>
                                            <td>{item.product?.name}</td>
                                            <td>{item.product?.brand?.name}</td>
                                            <td>{item.color}</td>
                                            <td>{item.size}</td>
                                            <td>&#8377;{item?.product.finalPrice}</td>
                                            <td>{item?.quantity}</td>
                                            <td>&#8377;{item?.total}</td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
