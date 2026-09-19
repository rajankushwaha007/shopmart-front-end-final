import React from 'react'
import { Link } from 'react-router-dom'

export default function Offer({data}) {
    return (
        <div className="container-fluid bg-light py-5">
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-6 wow fadeInLeft" data-wow-delay="0.2s">
                        <Link to="/shop?sc=Laptop" className="d-flex align-items-center justify-content-between border bg-white rounded p-4">
                            <div>
                                <p className="text-muted mb-3">Find The Best Laptop for You!</p>
                                <h3 className="text-primary">Laptop</h3>
                                <h1 className="display-3 text-secondary mb-0">90% <span
                                    className="text-primary fw-normal">Off</span></h1>
                            </div>
                            <img src="img/carousel-1.png" className="" style={{height:200}} alt="" />
                        </Link>
                    </div>
                    <div className="col-lg-6 wow fadeInRight" data-wow-delay="0.3s">
                        <Link to="/shop?sc=Smart Watches" className="d-flex align-items-center justify-content-between border bg-white rounded p-4">
                            <div>
                                <p className="text-muted mb-3">Find The Best Whatches for You!</p>
                                <h3 className="text-primary">Smart Whatch</h3>
                                <h1 className="display-3 text-secondary mb-0">80% <span
                                    className="text-primary fw-normal">Off</span></h1>
                            </div>
                            <img src="img/product-2.png" className="img-fluid" alt="" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
