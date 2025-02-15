import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getCurrtUsrSpots } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { MdStarRate } from "react-icons/md";
import './ManageSpots.css'
import OpenModalButton from '../OpenModalButton';
import DeleteSpotModal from "../DeleteSpotModal/DeleteSpotModal";



const ManageSpotsPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currUsrSpots = useSelector(state => state.spot.Spots)

    useEffect(() => {
        dispatch(getCurrtUsrSpots());
    }, [dispatch])

    const handleClick = async (e) => {
        e.preventDefaut();
        return navigate('/spots/new')
    }

    const updateSpot = (spotId) => {
        navigate(`/spots/${spotId}/edit`)
    }

    return (
        <div id="manage-spots-box">
            <div className="ms-header">
                <h1 id="ms-title">Manage Spots</h1>
                <button onClick={handleClick} className='ns-bttn'>Create a New Spot</button>
            </div>
            <div className="currUser-spots-box">
                {currUsrSpots?.map(({id,previewImage,name,city,state,avgRating,price}) =>(
                    <div key={id} className='spot-box'>
                        <NavLink to={`/spots/${id}`}>
                            <img src={previewImage} alt='spot-prev-img' className="spot-prev-img" />
                            <div className="spot-info">
                                <div>{city}, {state}</div>
                                <div><MdStarRate />{avgRating ? avgRating.toFixed(2) : avgRating}</div>
                                <div className="ms-price">${price}</div>
                            </div>
                        </NavLink>
                        <div className="edit-del-bttn-box">
                            <div className="update-bttn-box">
                                <button className="update-bttn" type="button" onClick={()=> updateSpot(id)}>Update Spot</button>
                            </div>
                            <div className="del-box">
                                <OpenModalButton
                                    buttonText="Delete"
                                    modalComponent={<DeleteSpotModal spotId={id} /> }
                                />
                            </div>

                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}


export default ManageSpotsPage;
