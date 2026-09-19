import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { getWishlist, deleteWishlist } from "../../Redux/ActionCreators/WishlistActionCreators"
export default function Wishlist() {
  let [data, setData] = useState([])

  let WishlistStateData = useSelector(state => state.WishlistStateData)
  let dispatch = useDispatch()

  function deleteRecord(_id) {
    if (window.confirm("Are You Sure to Delete That Record")) {
      dispatch(deleteWishlist({ _id: _id }))
      setData(data.filter(x => x._id !== _id))
    }
  }

  useEffect(() => {
    (() => {
      dispatch(getWishlist())
      if (WishlistStateData.length) {
        // setData(WishlistStateData.filter(x => x.user?.name === localStorage.getItem("userid")))
        setData(WishlistStateData)
      }
    })()
  }, [WishlistStateData.length])
  return (
    data.length ?
      <div className="table-responsive">
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Brand</th>
              <th>Color</th>
              <th>Size</th>
              <th>Stock</th>
              <th>Price</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => {
              return <tr key={item._id}>
                <td>
                  <Link to={`${import.meta.env.VITE_APP_IMAGE_SERVER}${item?.product?.pic[0]}`} target='_blank'>
                    <img src={`${import.meta.env.VITE_APP_IMAGE_SERVER}${item?.product?.pic[0]}`} height={70} width={70} alt="" />
                  </Link>
                </td>
                <td>{item?.product?.name}</td>
                <td>{item?.product?.brand?.name}</td>
                <td>{item?.product?.color?.join(", ")}</td>
                <td>{item?.product?.size?.join(", ")}</td>
                <td>{item?.product?.stockQuantity ? `${item?.product?.stockQuantity} Left In Stock` : 'Out of Stock'}</td>
                <td>&#8377;{item?.product?.finalPrice}</td>
                <td><Link to={`/product/${item?.product?._id}`} className='btn btn-primary'><i className='bi bi-cart-plus'></i></Link></td>
                <td><button className='btn btn-danger' onClick={()=>deleteRecord(item._id)}><i className='bi bi-x'></i></button></td>
              </tr>
            })}
          </tbody>
        </table>
      </div> :
      <div className='card p-5 text-center'>
        <h3>No Items in Wishlist</h3>
        <Link to="/shop" className='btn btn-primary w-25 m-auto'>Shop Now</Link>
      </div>
  )
}
