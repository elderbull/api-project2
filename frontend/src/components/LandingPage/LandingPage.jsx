import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getSpots } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { MdStarRate } from "react-icons/md";
import './LandingPage.css'

const LandingPage = () => {
    const dispatch = useDispatch();
    const allSpots = useSelector(state =>state.spot.Spots)
    console.log(allSpots)




    useEffect(() => {
      dispatch(getSpots());
    }, [dispatch]);


    return (
       <div id='all-spots-box'>
        {allSpots.map(({ id, previewImage, city, name, state, avgRating, price }) => (
        <div key={id} className="single-spot-box">
          <NavLink to={`/spots/${id}`} className="single-spot-link">
            <img src="https://placehold.co/600x400" alt={name} className="single-spot-image"/>
            <div className="single-spot-info-box">
              <div>{city}, {state}</div>
              <div><MdStarRate />{avgRating ? avgRating.toFixed(2) : avgRating}</div>
            </div>
            <div className="spot-price">${price} night</div>
          </NavLink>
        </div>
      ))}

       </div>

    )



}

export default LandingPage
