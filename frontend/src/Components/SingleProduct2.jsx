import React from 'react'
import { Link } from 'react-router-dom'

export default function SingleProduct2({ item }) {
    return (
        <div className="productImg-carousel productList-item">
            <div className="productImg-item products-mini-item border">
                <div className="row g-0">
                    <div className="col-5">
                        <div className="products-mini-img border-end h-100">
                            <img src={`${import.meta.env.VITE_APP_IMAGE_SERVER}${item.pic[0]}`} style={{ height: 180 }} className="img-fluid w-100" alt="Image" />
                            <div className="products-mini-icon rounded-circle bg-primary">
                                <Link to={`/product/${item._id}`}><i className="fa fa-eye fa-1x text-white"></i></Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-7">
                        <div className="products-mini-content p-3">
                            <Link to={`/product/${item._id}`} className="d-block mb-2">{item.maincategory?.name}/{item.subcategory?.name}/{item.brand?.name}</Link>
                            <Link to={`/product/${item._id}`} className="d-block h4">{item.name}</Link>
                            <del className="me-2 fs-5">&#8377;{item.basePrice}</del>
                            <span className="text-primary fs-5">&#8377;{item.finalPrice}</span>
                        </div>
                    </div>
                </div>
                <div className="products-mini-add border p-3">
                    <Link to={`/product/${item._id}`} className="btn btn-primary border-secondary rounded-pill py-2 px-4"><i
                        className="fas fa-shopping-cart me-2"></i> Add To Cart</Link>
                    <div className="d-flex">
                        <div
                            className="text-primary d-flex align-items-center justify-content-center me-3">
                            {item.stock ? `${item.stockQuantity} Quantity Left in Stock` : "Out Of Stock"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
