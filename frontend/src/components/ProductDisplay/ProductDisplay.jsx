import React, { useContext } from 'react'
import './ProductDisplay.css'
import ProductItem from '../ProductItem/ProductItem'
import { StoreContext } from '../../Context/StoreContext'

const ProductDisplay = ({ category }) => {

  const { product_list } = useContext(StoreContext);

  return (
    <div className='display' id='display'>
      <h2>Latest Arrivals</h2>
      <div className='display-list'>
        {product_list.map((item) => {
          if (category === "All" || category === item.category) {
            return <ProductItem key={item._id} image={item.image} name={item.name} desc={item.description} price={item.price} id={item._id} />
          }
        })}
      </div>
    </div>
  )
}

export default ProductDisplay


// import React, { useContext } from 'react'
// import './ProductDisplay.css'
// import ProductItem from '../ProductItem/ProductItem'
// import { StoreContext } from '../../Context/StoreContext'

// const ProductDisplay = ({ category }) => {

//   const { product_list } = useContext(StoreContext);

//   return (
//     <div className='display' id='display'>
//       <h2>Cloths are here</h2>
//       <div className='display-list'>
//         {product_list.map((item) => {
//           if (category === "All" || category === item.category) {
//             return (
//               <div key={item._id} className="product-item-container">
//                 <img src={item.image} alt={item.name} className="product-image" />
//                 <div className="product-content">
//                   <h3>{item.name}</h3>
//                   <p>{item.description}</p>
//                   <p className="product-price">₹{item.price}</p>
//                 </div>
//               </div>
//             );
//           }
//         })}
//       </div>
//     </div>
//   );
// }

// export default ProductDisplay;

