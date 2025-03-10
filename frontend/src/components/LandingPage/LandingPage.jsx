import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getSpots } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { MdStarRate } from "react-icons/md";

import './LandingPage.css'

const LandingPage = () => {
    const dispatch = useDispatch();
    const allSpots = useSelector(state => state?.spot?.Spots)


    const fixedPrice = (price) => {
      price = Number(price);
      return price.toFixed(2);
    }


    useEffect(() => {
      dispatch(getSpots());
    }, [dispatch]);


    return (
       <>
        <h1> Find Your Perfect Getaway</h1>
        <div id='all-spots-box'>
        {allSpots?.map((spot) => (
          <div key={spot.id} className="single-spot-box tooltip">
            <NavLink to={`/spots/${spot.id}`} className="single-spot-link">
            <div className="tooltip-content">
              {spot.name}
            </div>
            <img src={spot.previewImage} alt={`${spot.name} image`} className="single-spot-img"/>
            <div className="single-spot-info-box">
              <div>
              {spot.city}, {spot.state}
              </div>
              <div>
              {/* <ReviewAvgCount /> */}
              <MdStarRate /> {spot?.avgRating ? spot?.avgRating.toFixed(2) : "New"}
            </div>

            </div>
            <div className="single-spot-price">${fixedPrice(spot.price)} night</div>

            </NavLink>
          </div>



        ))}

       </div>


       </>

    )



}

export default LandingPage
