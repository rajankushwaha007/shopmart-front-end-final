import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

import Breadcrum from '../Components/Breadcrum'
import SaleBanner from '../Components/SaleBanner'

import SingleProduct from '../Components/SingleProduct'
import SingleProduct2 from '../Components/SingleProduct2'

import { getMaincategory } from "../Redux/ActionCreators/MaincategoryActionCreators"
import { getSubcategory } from "../Redux/ActionCreators/SubcategoryActionCreators"
import { getBrand } from "../Redux/ActionCreators/BrandActionCreators"
import { getProduct } from "../Redux/ActionCreators/ProductActionCreators"


const colors = ["Black", "White", "Blue", "Red", "Green", "Gray", "Pink", "Yellow", "Megenta", "Purple", "Orange", "N/A"]
const sizes = ["XXL", "XL", "L", "MD", "SM", "XS", "NB", "22", "24", "26", "28", "30", "32", "34", "36", "38", "40", "N/A"]
export default function ShopPage() {
    let MaincategoryStateData = useSelector(state => state.MaincategoryStateData)
    let SubcategoryStateData = useSelector(state => state.SubcategoryStateData)
    let BrandStateData = useSelector(state => state.BrandStateData)
    let ProductStateData = useSelector(state => state.ProductStateData)

    let [page, setPage] = useState(1)
    let [startIndex, setStartIndex] = useState(0)
    let [endIndex, setEndIndex] = useState(0)
    let [totalProducts, setTotalProducts] = useState(0)

    let [searchParams] = useSearchParams()

    let [selected, setSelected] = useState({
        maincategory: [],
        subcategory: [],
        brand: [],
        color: [],
        size: [],
    })
    let [data, setData] = useState([])
    let [sortFilter, setSortFilter] = useState("No Sort")
    let [search, setSearch] = useState("")
    let [min, setMin] = useState(-1)
    let [max, setMax] = useState(-1)

    let dispatch = useDispatch()

    function getInputSelected(key, value) {
        let arr = selected[key]
        if (arr.includes(value))
            arr = arr.filter(x => x !== value)
        else
            arr.push(value)

        setSelected({ ...selected, [key]: arr })
        applySelectFilter({ ...selected, [key]: arr })
    }

    function applySearchFilter(option = null) {
        let ch = option ? option?.toLocaleLowerCase() : search?.toLocaleLowerCase()
        let items = ProductStateData.filter(x => x.status && (
            (x.name?.toLocaleLowerCase()?.includes(ch)) ||
            (x.maincategory?.toLocaleLowerCase() === ch) ||
            (x.subcategory?.toLocaleLowerCase() === ch) ||
            (x.brand?.toLocaleLowerCase() === ch) ||
            (x.color?.includes(ch)) ||
            (x.description?.toLocaleLowerCase()?.includes(ch))
        ))
        setSelected({
            maincategory: [],
            subcategory: [],
            brand: [],
            color: [],
            size: [],
        })
        applySortFilter(sortFilter, items)
    }

    function applySelectFilter(selected) {
        let items = ProductStateData.filter(x => x.status && (
            (selected.maincategory?.length === 0 || selected.maincategory?.includes(x.maincategory)) &&
            (selected.subcategory?.length === 0 || selected.subcategory?.includes(x.subcategory)) &&
            (selected.brand?.length === 0 || selected.brand?.includes(x.brand)) &&
            (selected.color?.length === 0 || new Set(selected.color).intersection(new Set(x.color)).size > 0) &&
            (selected.size?.length === 0 || new Set(selected.size).intersection(new Set(x.size)).size > 0)
        ))
        setSearch("")
        applySortFilter(sortFilter, items)
    }

    function applySortFilter(filter, data) {
        if (min !== -1 && max !== -1)
            data = data.filter(x => x.finalPrice >= min && x.finalPrice <= max)
        if (filter === "Latest")
            setData(data.sort((x, y) => y._id.localeCompare(x._id)))
        else if (filter === "Price : Low to high")
            setData(data.sort((x, y) => x.finalPrice - y.finalPrice))
        else
            setData(data.sort((x, y) => y.finalPrice - x.finalPrice))

        setTotalProducts(data.length)
        setSortFilter(filter)
    }



    useEffect(() => {
        (() => dispatch(getMaincategory()))()
    }, [MaincategoryStateData.length])

    useEffect(() => {
        (() => dispatch(getSubcategory()))()
    }, [SubcategoryStateData.length])

    useEffect(() => {
        (() => dispatch(getBrand()))()
    }, [BrandStateData.length])

    useEffect(() => {
        (() => {
            dispatch(getProduct())
            if (ProductStateData.length) {
                let items = ProductStateData.filter(x => x.status)
                setTotalProducts(items.length)
                setData(items)
            }
        })()
    }, [ProductStateData.length])

    useEffect(() => {
        setStartIndex((page - 1) * 24)
        setEndIndex((page - 1) * 24 + 24)
    }, [page])

    useEffect(() => {
        if (searchParams.get("search"))
            applySearchFilter(searchParams.get("search"))
        else {
            let selectItems = {
                maincategory: searchParams.get("mc") || "",
                subcategory: searchParams.get("sc") || "",
                brand: searchParams.get("br") || ""
            }
            setSelected({ ...selected, ...selectItems })
            applySelectFilter({ ...selected, ...selectItems })
        }
    }, [searchParams])
    return (
        <>
            <Breadcrum title="Shop" />
            <div className="container-fluid shop py-5">
                <div className="container py-5">
                    <div className="row g-4">
                        <div className="col-lg-3 wow fadeInUp" data-wow-delay="0.1s">
                            <div className="product-categories mb-2">
                                <h5>Maincategory</h5>
                                <ul className="list-unstyled">
                                    {MaincategoryStateData.filter(x => x.status).map((item, index) => {
                                        return <li key={index}>
                                            <div className="d-flex">
                                                <span onClick={() => getInputSelected('maincategory', item.name)} className="btn btn-light w-100 text-start">{item.name}</span>
                                                {selected.maincategory.includes(item.name) ? <i className='bi bi-check'></i> : null}
                                            </div>
                                        </li>
                                    })}
                                </ul>
                            </div>
                            <div className="product-categories mb-2">
                                <h5>Subcategory</h5>
                                <ul className="list-unstyled">
                                    {SubcategoryStateData.filter(x => x.status).map((item, index) => {
                                        return <li key={index}>
                                            <div className="d-flex">
                                                <span onClick={() => getInputSelected('subcategory', item.name)} className="btn btn-light w-100 text-start">{item.name}</span>
                                                {selected.subcategory.includes(item.name) ? <i className='bi bi-check'></i> : null}
                                            </div>
                                        </li>
                                    })}
                                </ul>
                            </div>
                            <div className="product-categories mb-2">
                                <h5>Brand</h5>
                                <ul className="list-unstyled">
                                    {BrandStateData.filter(x => x.status).map((item, index) => {
                                        return <li key={index}>
                                            <div className="d-flex">
                                                <span onClick={() => getInputSelected('brand', item.name)} className="btn btn-light w-100 text-start">{item.name}</span>
                                                {selected.brand.includes(item.name) ? <i className='bi bi-check'></i> : null}
                                            </div>
                                        </li>
                                    })}
                                </ul>
                            </div>

                            <div className="product-color mb-3">
                                <h5>Select By Color</h5>
                                <ul className="list-unstyled">
                                    {colors.map((item, index) => {
                                        return <li key={index}>
                                            <div className="d-flex">
                                                <span onClick={() => getInputSelected('color', item)} className="btn btn-light w-100 text-start">{item}</span>
                                                {selected.color.includes(item) ? <i className='bi bi-check'></i> : null}
                                            </div>
                                        </li>
                                    })}
                                </ul>
                            </div>
                            <div className="product-color mb-3">
                                <h5>Select By Size</h5>
                                <ul className="list-unstyled">
                                    {sizes.map((item, index) => {
                                        return <li key={index}>
                                            <div className="d-flex">
                                                <span onClick={() => getInputSelected('size', item)} className="btn btn-light w-100 text-start">{item}</span>
                                                {selected.size.includes(item) ? <i className='bi bi-check'></i> : null}
                                            </div>
                                        </li>
                                    })}
                                </ul>
                            </div>
                            <div className="product-color mb-3">
                                <h5>Filter By Price Range</h5>
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    applySortFilter(sortFilter, data)
                                }}>
                                    <div className="row">
                                        <div className="col-6 mb-3">
                                            <label>Min. Amount</label>
                                            <input type="number" name="min" onChange={e => (setMin(e.target.value))} placeholder='Min. Amount' className='form-control border-primary' />
                                        </div>
                                        <div className="col-6 mb-3">
                                            <label>Min. Amount</label>
                                            <input type="number" name="max" onChange={e => (setMax(e.target.value))} placeholder='Max. Amount' className='form-control border-primary' />
                                        </div>
                                        <div className="col-12 mb-3">
                                            <button type="submit" className='btn btn-primary w-100'>Apply Filter</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-9 wow fadeInUp" data-wow-delay="0.1s">
                            <div className="row g-4">
                                <div className="col-xl-6">
                                    <form onSubmit={(e) => {
                                        e.preventDefault()
                                        applySearchFilter()
                                    }} >
                                        <div className="input-group w-100 mx-auto d-flex">
                                            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} className="form-control p-3" placeholder="Search Products By Name, Category, Color etc"
                                                aria-describedby="search-icon-1" />
                                            <button type='submit' id="search-icon-1" className="input-group-text p-3"><i
                                                className="fa fa-search"></i></button>
                                        </div>
                                    </form>
                                </div>
                                <div className="col-xl-4 text-end">
                                    <div className="bg-light ps-3 py-3 rounded d-flex justify-content-between">
                                        <label>Sort By:</label>
                                        <select id="electronics" onChange={(e) => applySortFilter(e.target.value, data)} name="electronicslist"
                                            className="border-0 form-select-sm bg-light me-3" form="electronicsform">
                                            <option>Latest</option>
                                            <option>Price : Low to high</option>
                                            <option>Price : High to low</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-xl-2 d-flex justify-content-center align-items-center">
                                    <ul className="nav nav-pills d-inline-flex text-center py-2 px-2 rounded bg-light mb-4">
                                        <li className="nav-item me-4">
                                            <a className="bg-light" data-bs-toggle="pill" href="#tab-5">
                                                <i className="fas fa-th fs-2 text-primary"></i>
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="bg-light" data-bs-toggle="pill" href="#tab-6">
                                                <i className="fas fa-bars fs-2 text-primary"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="tab-content">
                                <div id="tab-5" className="tab-pane fade show p-0 active">
                                    <div className="row g-4 product">
                                        {data.slice(startIndex, endIndex).map(item => {
                                            return <SingleProduct title="shop" item={item} key={item._id} />
                                        })}
                                    </div>
                                </div>
                                <div id="tab-6" className="products tab-pane fade show p-0">
                                    <div className="row g-4 products-mini">
                                        {data.slice(startIndex, endIndex).map(item => {
                                            return <div className="col-lg-6" key={item._id}>
                                                <SingleProduct2 title="shop" item={item} />
                                            </div>
                                        })}
                                    </div>
                                </div>
                                <div className="col-12 wow fadeInUp" data-wow-delay="0.1s">
                                    <div className="pagination d-flex justify-content-center mt-5">
                                        <a href="#" onClick={() => page > 1 ? setPage(page - 1) : null} className="rounded">&laquo;</a>
                                        {Array.from({ length: Math.floor((totalProducts / 24) + 1) }, (p, index) => (
                                            <a href="#" key={index} onClick={() => setPage(index + 1)} className={`rounded ${page === (index + 1) ? 'active' : ''}`}>{index + 1}</a>
                                        ))}
                                        <a href="#" onClick={() => page < totalProducts ? setPage(page + 1) : null} className="rounded">&raquo;</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <SaleBanner />
        </>
    )
}
