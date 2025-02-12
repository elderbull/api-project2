import { useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { getSpots } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { MdStarRate } from "react-icons/md";
import ReviewAvgCount from "../ReviewAvgCount/ReviewAvgCount";
import './LandingPage.css'

const LandingPage = () => {
    const dispatch = useDispatch();
    const allSpots = useSelector(state => state?.spot?.Spots)
    console.log(allSpots)


    useEffect(() => {
      dispatch(getSpots());
    }, [dispatch]);


    return (
       <>
        <h1> Find Your Perfect Getaway</h1>
        <div id='all-spots-box'>
        {allSpots?.map((spot) => (
          <div key={spot.id} className="single-spot-box">
            <NavLink to={`/spots/${spot.id}`} className="single-spot-link">
            <img src="https://placehold.co/600x400" alt={`${spot.name} image`} className="single-spot-img"/>
            <div className="single-spot-info-box">
              <div>
              {spot.city}, {spot.state}
              </div>
              <div>
              <ReviewAvgCount />
            </div>

            </div>


            </NavLink>
          </div>



        ))}

       </div>


       </>

    )



}

export default LandingPage
