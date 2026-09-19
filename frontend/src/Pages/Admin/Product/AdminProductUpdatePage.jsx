import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Breadcrum from '../../../Components/Breadcrum'
import AdminSidebar from '../../../Components/Admin/AdminSidebar'
import TextValidators from '../../../FormValidators/TextValidators'
import ImageValidators from '../../../FormValidators/ImageValidators'

let rte;
import { updateProduct, getProduct } from '../../../Redux/ActionCreators/ProductActionCreators'
import { getMaincategory } from '../../../Redux/ActionCreators/MaincategoryActionCreators'
import { getSubcategory } from '../../../Redux/ActionCreators/SubcategoryActionCreators'
import { getBrand } from '../../../Redux/ActionCreators/BrandActionCreators'

const colors = ["Black", "White", "Blue", "Red", "Green", "Gray", "Pink", "Yellow", "Megenta", "Purple", "Orange", "N/A"]
const sizes = ["XXL", "XL", "L", "MD", "SM", "XS", "NB", "22", "24", "26", "28", "30", "32", "34", "36", "38", "40", "N/A"]
export default function AdminProductUpdatePage() {
    let { _id } = useParams()

    let refdiv = useRef(null);
    let [data, setData] = useState({
        name: "",
        maincategory: "",
        subcategory: "",
        brand: "",
        color: [],
        size: [],
        basePrice: 0,
        discount: 0,
        finalPrice: 0,
        stock: true,
        stockQuantity: 0,
        pic: [],
        status: true
    })
    let [errorMessage, setErrorMessage] = useState({
        name: "",
        basePrice: "",
        discount: "",
        stockQuantity: "",
        color: "",
        size: "",
        pic: ""
    })
    let [show, setShow] = useState(false)
    let [flag, setFlag] = useState(false)
    let [oldPics, setOldPics] = useState([])

    let ProductStateData = useSelector(state => state.ProductStateData)
    let MaincategoryStateData = useSelector(state => state.MaincategoryStateData)
    let SubcategoryStateData = useSelector(state => state.SubcategoryStateData)
    let BrandStateData = useSelector(state => state.BrandStateData)
    let dispatch = useDispatch()
    let navigate = useNavigate()

    function getInputCheckbox(name, value) {
        let arr = data[name]
        if (arr.includes(value))
            arr = arr.filter(x => x !== value)
        else
            arr.push(value)

        setData({ ...data, [name]: arr })
        setErrorMessage({ ...errorMessage, [name]: arr.length === 0 ? `Please Select Atleast One ${name}` : "" })
    }

    function getInputData(e) {
        let name = e.target.name
        // let value = name === "pic" ? data.pic.concat(Array.from(e.target.files).map(x => "product/" + x.name)) : e.target.value
        let value = name === "pic" ? e.target.files : e.target.value

        setData({ ...data, [name]: name === "status" || name === "stock" ? value === "1" ? true : false : value })
        setErrorMessage({ ...errorMessage, [name]: name === "pic" ? ImageValidators(e) : TextValidators(e) })
    }
    async function postData(e) {
        e.preventDefault()
        let error = Object.values(errorMessage).find(x => x !== "")
        if (error)
            setShow(true)
        else if (oldPics.length === 0 && Array.from(data.pic).length === 0) {
            setErrorMessage({ ...errorMessage, pic: "Please Select Atleast One Image" })
            setShow(true)
        }
        else {
            let stockQuantity = parseInt(data.stockQuantity)
            let bp = parseInt(data.basePrice)
            let d = parseInt(data.discount)
            let fp = parseInt(bp - bp * d / 100)
            // dispatch(updateProduct({
            //     ...data,
            //     maincategory: data.maincategory || MaincategoryStateData[0].name,
            //     subcategory: data.subcategory || SubcategoryStateData[0].name,
            //     brand: data.brand || BrandStateData[0].name,
            //     basePrice: bp,
            //     discount: d,
            //     finalPrice: fp,
            //     stockQuantity: stockQuantity,
            //     description: rte.getHTMLCode()
            // }))

            let formData = new FormData()
            formData.append("_id", data._id)
            formData.append("name", data.name)
            formData.append("maincategory", typeof data.maincategory === "object" ? data.maincategory?._id : data.maincategory)
            formData.append("subcategory", typeof data.subcategory === "object" ? data.subcategory?._id : data.subcategory)
            formData.append("brand", typeof data.brand === "object" ? data.brand?._id : data.brand)
            formData.append("basePrice", bp)
            formData.append("discount", d)
            formData.append("finalPrice", fp)
            formData.append("stock", data.stock)
            formData.append("stockQuantity", stockQuantity)
            Array.from(data.pic).forEach(x => {
                formData.append("pic", x)
            })
            data.color.forEach(x => {
                formData.append("color", x)
            })
            data.size.forEach(x => {
                formData.append("size", x)
            })
            oldPics.forEach(x => {
                formData.append("oldPics", x)
            })
            formData.append("status", data.status)
            formData.append("description", rte.getHTMLCode())
            dispatch(updateProduct(formData))

            navigate("/admin/product")
        }
    }

    useEffect(() => {
        (() => {
            dispatch(getProduct())
            if (ProductStateData.length) {
                let item = ProductStateData.find(x => x._id === _id)
                if (item) {
                    setOldPics(item.pic)
                    setData({ ...data, ...item, pic: [] })
                    rte = new window.RichTextEditor(refdiv.current);
                    rte.setHTMLCode(item.description);
                }
                else
                    navigate("/admin/product")
            }
        })()
    }, [ProductStateData.length])

    useEffect(() => {
        dispatch(getMaincategory())
    }, [MaincategoryStateData.length])

    useEffect(() => {
        dispatch(getSubcategory())
    }, [SubcategoryStateData.length])

    useEffect(() => {
        dispatch(getBrand())
    }, [BrandStateData.length])

    return (
        <>
            <Breadcrum title="Admin" />
            <div className="container-fluid my-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminSidebar />
                    </div>
                    <div className="col-md-9">
                        <h5 className='bg-primary text-light text-center p-2'>Update Product <Link to="/admin/product"><i className='bi bi-arrow-left text-light float-end'></i></Link></h5>
                        <form onSubmit={postData}>
                            <div className="row">
                                <div className="col-12 mb-3">
                                    <label>Name*</label>
                                    <input type="text" name="name" value={data.name} onChange={getInputData} placeholder='Product Name' className={`form-control ${show && errorMessage.name ? 'border-danger' : 'border-primary'}`} />
                                    {show && errorMessage.name ? <p className='text-danger text-capitalize'>{errorMessage.name}</p> : null}
                                </div>

                                <div className="col-xl-3 col-md-6 mb-3">
                                    <label>Maincategory*</label>
                                    <select name="maincategory" value={data.maincategory} onChange={getInputData} className='form-select border-primary'>
                                        {MaincategoryStateData.filter(x => x.status).map((item) => {
                                            // return <option key={item._id}>{item.name}</option>
                                            return <option key={item._id} value={item._id}>{item.name}</option>
                                        })}
                                    </select>
                                </div>

                                <div className="col-xl-3 col-md-6 mb-3">
                                    <label>Subcategory*</label>
                                    <select name="subcategory" value={data.subcategory} onChange={getInputData} className='form-select border-primary'>
                                        {SubcategoryStateData.filter(x => x.status).map((item) => {
                                            // return <option key={item._id}>{item.name}</option>
                                            return <option key={item._id} value={item._id}>{item.name}</option>
                                        })}
                                    </select>
                                </div>

                                <div className="col-xl-3 col-md-6 mb-3">
                                    <label>Brand*</label>
                                    <select name="brand" value={data.brand} onChange={getInputData} className='form-select border-primary'>
                                        {BrandStateData.filter(x => x.status).map((item) => {
                                            // return <option key={item._id}>{item.name}</option>
                                            return <option key={item._id} value={item._id}>{item.name}</option>
                                        })}
                                    </select>
                                </div>

                                <div className="col-xl-3 col-md-6 mb-3">
                                    <label>Stock*</label>
                                    <select name="stock" value={data.stock ? "1" : "0"} onChange={getInputData} className='form-select border-primary'>
                                        <option value="1">In Stock</option>
                                        <option value="0">Out Of Stock</option>
                                    </select>
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label>Base Price*</label>
                                    <input type="number" value={data.basePrice} name="basePrice" onChange={getInputData} placeholder='Product Base Price' className={`form-control ${show && errorMessage.basePrice ? 'border-danger' : 'border-primary'}`} />
                                    {show && errorMessage.basePrice ? <p className='text-danger text-capitalize'>{errorMessage.basePrice}</p> : null}
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label>Discount*</label>
                                    <input type="number" value={data.discount} name="discount" onChange={getInputData} placeholder='Product Discount' className={`form-control ${show && errorMessage.discount ? 'border-danger' : 'border-primary'}`} />
                                    {show && errorMessage.discount ? <p className='text-danger text-capitalize'>{errorMessage.discount}</p> : null}
                                </div>


                                <div className="col-md-4 mb-3">
                                    <label>Stock Quantity*</label>
                                    <input type="number" value={data.stockQuantity} name="stockQuantity" onChange={getInputData} placeholder='Product Stock Quantity' className={`form-control ${show && errorMessage.stockQuantity ? 'border-danger' : 'border-primary'}`} />
                                    {show && errorMessage.stockQuantity ? <p className='text-danger text-capitalize'>{errorMessage.stockQuantity}</p> : null}
                                </div>

                                <div className="col-12 mb-3">
                                    <label>Color*</label>
                                    <div className='border border-primary rounded m-1 row'>
                                        {colors.map((item, index) => {
                                            return <div key={index} className='col-md-2 col-3 my-2'>
                                                <label htmlFor={item} style={{ display: "inline-block", width: 60 }}>{item}</label>
                                                <input type="checkbox" onChange={() => getInputCheckbox('color', item)} checked={data?.color?.includes(item)} name={item} id={item} className='ms-2' />
                                            </div>
                                        })}
                                    </div>
                                    {show && errorMessage.color ? <p className='text-danger text-capitalize'>{errorMessage.color}</p> : null}
                                </div>
                                <div className="col-12 mb-3">
                                    <label>Size*</label>
                                    <div className='border border-primary rounded m-1 row'>
                                        {sizes.map((item, index) => {
                                            return <div key={index} className='col-md-2 col-3 my-2'>
                                                <label htmlFor={item} style={{ display: "inline-block", width: 60 }}>{item}</label>
                                                <input type="checkbox" onChange={() => getInputCheckbox('size', item)} checked={data?.size?.includes(item)} name={item} id={item} className='ms-2' />
                                            </div>
                                        })}
                                    </div>
                                    {show && errorMessage.size ? <p className='text-danger text-capitalize'>{errorMessage.size}</p> : null}
                                </div>
                                <div className="col-12 mb-3">
                                    <label>Description*</label>
                                    <div ref={refdiv} className='border-primary'></div>
                                </div>


                                <div className="col-md-6 mb-3">
                                    <label>Pic</label>
                                    <input type="file" name="pic" multiple onChange={getInputData} className={`form-control ${show && errorMessage.pic ? 'border-danger' : 'border-primary'}`} />
                                    {show && errorMessage.pic ? errorMessage.pic?.split("|").map((item, index) => {
                                        return <p className='text-danger text-capitalize' key={index}>{item}</p>
                                    }) : null}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label>Old Pic(click on Image to Delete)</label>
                                    <div>
                                        {oldPics?.map((item, index) => {
                                            return <img key={index} onClick={() => {
                                                oldPics.splice(index, 1)
                                                setFlag(!flag)
                                            }} className='m-1' src={`${import.meta.env.VITE_APP_IMAGE_SERVER}${item}`} height={50} width={50} />
                                        })}
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label>Status</label>
                                    <select name="status" value={data.status ? "1" : "0"} onChange={getInputData} className='form-select border-primary'>
                                        <option value="1">Active</option>
                                        <option value="0">Inactive</option>
                                    </select>
                                </div>

                                <div className="col-12 mb-3">
                                    <button type='submit' className='btn btn-primary w-100'>Update</button>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
