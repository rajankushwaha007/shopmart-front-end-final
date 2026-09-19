import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { getSetting } from "../Redux/ActionCreators/SettingActionCreators"
export default function About() {
  let [settingData, setSettingData] = useState({
    siteName: import.meta.env.VITE_APP_SITE_NAME,
    facebook: import.meta.env.VITE_APP_FAECBOOK,
    twitter: import.meta.env.VITE_APP_TWITTER,
    youtube: import.meta.env.VITE_APP_YOUTUBE,
    linkedin: import.meta.env.VITE_APP_LINKEDIN,
    instagram: import.meta.env.VITE_APP_INSTAGRAM,
  })

  let SettingStateData = useSelector(state => state.SettingStateData)
  let dispatch = useDispatch()
  useEffect(() => {
    (() => {
      dispatch(getSetting())
      if (SettingStateData.length) {
        setSettingData(() => {
          let item = {}
          Object.keys(settingData).map(key => item[key] = SettingStateData[0][key] || settingData[key])
          return item
        })
      }
    })()
  }, [SettingStateData.length])
  return (
    <>
      <div className="container my-4 py-5">
        <h1>Your Trusted Destination for Quality Shopping, Great Value, and Exceptional Customer Experience</h1>
        <div className="row">
          <div className="col-md-6">
            <p>At {settingData.siteName}, we believe online shopping should be simple, secure, and enjoyable for everyone. Our platform brings together a carefully selected collection of high-quality products across multiple categories, helping customers find everything they need in one convenient place. From fashion and electronics to home essentials and lifestyle products, we focus on offering excellent value without compromising quality. Every product is chosen with customer satisfaction in mind, while our intuitive website, secure payment options, and reliable delivery services ensure a seamless shopping experience from browsing to checkout.</p>
            <p>Customer satisfaction is at the heart of everything we do. Our dedicated team continuously works to expand our product selection, improve our services, and provide fast, dependable support whenever you need assistance. We value transparency, trust, and long-term relationships with our customers by offering competitive prices, genuine products, and hassle-free returns. As {settingData.siteName} continues to grow, our mission remains the same—to create an eCommerce platform where every customer can shop with confidence, enjoy outstanding service, and discover products that enhance their everyday lives while receiving the quality and convenience they deserve.</p>
            <div>
              <a href={settingData.facebook} target='_blank' className=" me-2"> <i className='fs-3 text-secondary bi bi-facebook'></i></a>
              <a href={settingData.twitter} target='_blank' className=" me-2"> <i className='fs-3 text-secondary bi bi-twitter'></i></a>
              <a href={settingData.youtube} target='_blank' className=" me-2"> <i className='fs-3 text-secondary bi bi-youtube'></i></a>
              <a href={settingData.linkedin} target='_blank' className=" me-2"> <i className='fs-3 text-secondary bi bi-linkedin'></i></a>
              <a href={settingData.instagram} target='_blank' className=" me-2"> <i className='fs-3 text-secondary bi bi-instagram'></i></a>
            </div>
          </div>
          <div className="col-md-6">
            <img src="/images/banner7.jpg" className='img-fluid w-100' alt="" />
          </div>
        </div>
      </div>
    </>
  )
}
