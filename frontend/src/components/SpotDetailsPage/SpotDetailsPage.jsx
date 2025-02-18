import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { getSpotById, getReviewsBySpotId } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from '../OpenModalButton';

import './SpotDetails.css'
import ReviewAvgCount from "../ReviewAvgCount/ReviewAvgCount";
import CreateReviewFormModal from "../CreateReviewFormModal/CreateReviewFormModal";

const SpotDetailsPage = () => {

    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const { spotId } = useParams();
    const spotDetails = useSelector(state => state.spot);
    const currUser = useSelector((state) => state.session.user);
    const review = useSelector((state) => state.review)


    useEffect(() => {
        dispatch(getSpotById(spotId))
            .then(dispatch(getReviewsBySpotId(spotId)))
            .then(() => { setisLoading(true)})
    }, [dispatch, spotId, review])

    const handleClick = () => {
        alert('Feature Coming Soon...')
    }

    const prevImg = () => {
        const img = spotDetails.SpotImages.find(image => image.preview === true)
        return img
    }

    const formatDate=(dateStr)=> {
        const date = new Date(dateStr);
        const formattedDate = date.toLocaleDateString('en-us', {year: 'numeric', month: 'long'});
        return formattedDate
    }

    return (
        <>
            {
                isLoading ?

                <div id="spot-box">
                <div id="spot-header">
                    <h2>{spotDetails.name}</h2>
                    <h3>{spotDetails.city}, {spotDetails.state}, {spotDetails.country}</h3>
                </div>
               {spotDetails.SpotImages.length ?
               <div id="spot-images-bx">
                    <div id="main-image">
                    <img src={prevImg().url} alt="preview-image" />
                    </div>
                    <div id="smaller-imgs">
                        {/*Need to add additional images and include a feature*/}
                        {spotDetails.SpotImages.slice(1,5).map((image,indx) => (
                        <img key={indx} src={image.url} alt={`SpotImage ${indx}`} className="spot-imgs" />
                    ))}
                    </div>
                </div>
                : <div>Images Coming Soon</div>
                }
                <div id="spot-info-box">
                    <div className="discrip-box">
                        <div className="spot-discrip">
                        <h3>Hosted by {spotDetails.Owner.firstName}     {spotDetails.Owner.lastName}</h3>
                         <p>{spotDetails.description}</p>

                        </div>
                    </div>
                    <div className="price-review-box">
                        <div className="price-details">
                            <h4>${spotDetails.price} <span className="small-font">night</span></h4>
                            <ReviewAvgCount />
                        </div>
                        <button id="reserve-button" onClick={handleClick}>Reserve</button>
                    </div>
                </div>
                <hr/>
                <div id="reviews-box">
                    <ReviewAvgCount />
                    <div className="post-review-box">

                    {
                            currUser && spotDetails.ownerId !== currUser.id &&
                            !(spotDetails?.Reviews?.find(review => review.userId === currUser.id)) && !spotDetails.Reviews.length ? (
                                <div>
                                    <OpenModalButton
                                        buttonText="Post Your Review"
                                        buttonClassName="review-bttn"
                                        modalComponent={<CreateReviewFormModal />}
                                    />
                                </div>

                            ) : (
                                <div>


                                </div>
                            )
                        }
                    </div>
                    <div className='reviews-list'>
                        {spotDetails?.Reviews?.map(review => (
                            <div key={review.id} className="single-review">
                                <div className="reviewer-name">
                                    {review.User.firstName}
                                </div>
                                <div className="review-date">
                                    {formatDate(review.createdAt)}
                                </div>
                                <div className="review-item">
                                    {review.review}
                                </div>
                            </div>
                        ))}



                    </div>


                </div>
            </div>

                : <h1>Loading...</h1>

            }


        </>
    )






}


export default SpotDetailsPage
