import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getFeature } from "../Redux/ActionCreators/FeatureActionCreators"
import { getSetting } from "../Redux/ActionCreators/SettingActionCreators"
export default function Feature() {
  let [settingData, setSettingData] = useState({
    siteName: import.meta.env.VITE_APP_SITE_NAME,
  })

  let SettingStateData = useSelector(state => state.SettingStateData)
  let FeatureStateData = useSelector(state => state.FeatureStateData)
  let dispatch = useDispatch()

  useEffect(() => {
    (() => {
      dispatch(getSetting())
      if (SettingStateData.length) {
        setSettingData({ siteName: SettingStateData[0].siteName || settingData.siteName })
      }
    })()
  }, [SettingStateData.length])

  useEffect(() => {
    (() => dispatch(getFeature()))()
  }, [FeatureStateData.length])
  return (
    <>
      <div className="container my-5 py-5">
        <h1 className='text-center'>Why Shop With Confidence at {settingData.siteName}</h1>
        <p className='text-center'>Discover a smarter way to shop with features designed to make every purchase simple, secure, and enjoyable. From premium product quality and fast delivery to secure payments and dedicated customer support, {settingData.siteName} is committed to providing a seamless online shopping experience that exceeds your expectations every time.</p>
        <div className='row my-5'>
          {FeatureStateData.filter(x => x.status).map(item => {
            return <div className='col-lg-4 col-md-6'>
              <div className="my-card p-5">
                <div className='text-center'>
                  <span dangerouslySetInnerHTML={{ __html: item.icon }} className='fs-1'></span>
                </div>
                <h3>{item.name}</h3>
                <p>{item.shortDescription}</p>
              </div>
            </div>
          })}
        </div>
      </div>
    </>
  )
}
