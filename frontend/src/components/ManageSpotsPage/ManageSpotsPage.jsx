import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getCurrtUsrSpots, getSpotById } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { MdStarRate } from "react-icons/md";
import './ManageSpots.css'
import OpenModalButton from '../OpenModalButton';
import DeleteSpotModal from "../DeleteSpotModal/DeleteSpotModal";



const ManageSpotsPage = () => {

    const dispatch = useDispatch();
    // const sessionUser = useSelector((state) => state?.session?.user)
    const usrSpots = useSelector(state => state.spot.Spots)
    const navigate = useNavigate();
    // const spotList = Object.values(usrSpots)

    // if(!sessionUser) return <h1>Unauthorized Access</h1>;

    useEffect(() => {
        dispatch(getCurrtUsrSpots());
    }, [dispatch])

    const newSpotRoute = () => {
        navigate(`/spots/new`)
    }

    const updateSpot = async (spotId) => {
        dispatch(getSpotById(spotId))
        navigate(`/spots/${spotId}/edit`)
    }

    return (
        <>
        <div className="ms-header">
              <h1 id="ms-title">Manage Your Spots</h1>
              <button onClick={newSpotRoute} className='ms-bttn'>Create a New Spot</button>
            </div>
            <div id='all-spots-box'>
        {usrSpots?.map((spot) => (
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
            <div className="single-spot-price">${Number(spot.price).toFixed(2)} night</div>
            </NavLink>
            <div className="edit-del-bttn-box">
                <div className="edit-box">
                    <button name={spot.id}className="ms-edit-bttn" type="button" onClick={()=>updateSpot(spot.id)}>Update</button>
                </div>
                <div className="del-box">
                    <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteSpotModal spotId={spot.id}/>}
                    />
                </div>
            </div>
          </div>



        ))}

       </div>


       </>
    )
}


export default ManageSpotsPage;
