// import React, { useContext } from 'react'
// import './ExploreMenu.css'
// import { StoreContext } from '../../Context/StoreContext'

// const ExploreMenu = ({category,setCategory}) => {

//   const {menu_list} = useContext(StoreContext);

//   return (
//     <div className='explore-menu' id='explore-menu'>
//       <h1>Explore our Products</h1>
//       <div className="explore-menu-list">
//         {menu_list.map((item,index)=>{
//             return (
//                 <div onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)} key={index} className='explore-menu-list-item'>
//                     <img src={item.menu_image} className={category===item.menu_name?"active":""} alt="" />
//                     <p>{item.menu_name}</p>
//                 </div>
//             )
//         })}
//       </div>
//       <hr />
//     </div>
//   )
// }

// export default ExploreMenu



import React, { useContext } from 'react'
import './ExploreMenu.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom';

const ExploreMenu = ({ category, setCategory }) => {

  const { menu_list, setSelectedCategory } = useContext(StoreContext);
  
  return (
    <div className='explore-menu'>
      <h1>Explore Our Collection</h1>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => (
          <div
            key={index}
            className={`explore-menu-card ${category === item.menu_name ? "active" : ""}`}
            onClick={() => setSelectedCategory(item.menu_name)}
          >
            <img
              src={item.menu_image}
              alt={item.menu_name}
              className="explore-menu-card-img"
            />
            <div className="explore-menu-card-content">
              <h3>{item.menu_name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExploreMenu;
