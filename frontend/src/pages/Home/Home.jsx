import React, { useState } from 'react'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import ProductDisplay from '../../components/ProductDisplay/ProductDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'


import CustomerReviews from '../../components/CustomerReviews/CustomerReviews'


const Home = () => {

  const [category, setCategory] = useState("All")

  return (
    <>
      <Header />
      {<ExploreMenu setCategory={setCategory} category={category} />}
      <ProductDisplay category={category} />
      <CustomerReviews />
      <AppDownload />
    </>
  )
}

export default Home
