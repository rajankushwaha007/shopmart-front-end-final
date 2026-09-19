import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getProduct } from "../Redux/ActionCreators/ProductActionCreators"
import { useDispatch, useSelector } from 'react-redux'
export default function SaleBanner() {
    let [data, setData] = useState({ pic: [] })
    let ProductStateData = useSelector(state => state.ProductStateData)
    let dispatch = useDispatch()

    useEffect(() => {
        (() => {
            dispatch(getProduct())
            if (ProductStateData.length) {
                setData(ProductStateData[0])
            }
        })()
    }, [ProductStateData.length])
    return (
        <div className="container-fluid py-5">
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-6 wow fadeInLeft" data-wow-delay="0.1s">
                        <div>
                            <div className="bg-primary rounded position-relative">
                                <img src={`${import.meta.env.VITE_APP_IMAGE_SERVER}${data.pic[0]}`} className="img-fluid w-100 rounded" alt="" />
                                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center rounded p-4"
                                    style={{ background: "rgba(255, 255, 255, 0.5)" }}>
                                    <h3 className="display-5 text-primary">{data.name}</h3>
                                    <p className="fs-4 text-muted"><del>&#8377;{data.basePrice}</del>&#8377;{data.finalPrice}<sup>{ClipboardItem.discount}% Off</sup></p>
                                    <Link to={`/product/${data._id}`} className="btn btn-primary rounded-pill align-self-start py-2 px-4">Shop Now</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 wow fadeInRight" data-wow-delay="0.2s">
                        <div>
                            <div className="text-center bg-primary rounded position-relative">
                                <img src="img/product-banner-2.jpg" className="img-fluid w-100" alt="" />
                                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center rounded p-4"
                                    style={{ background: "rgba(242, 139, 0, 0.5)" }}>
                                    <h2 className="display-2 text-secondary">SALE</h2>
                                    <h4 className="display-5 text-white mb-4">Get UP To 90% Off</h4>
                                    <Link to="/shop" className="btn btn-secondary rounded-pill align-self-center py-2 px-4">Shop
                                        Now</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
