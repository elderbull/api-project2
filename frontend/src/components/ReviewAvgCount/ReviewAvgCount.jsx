import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { getSpotById, getReviewsBySpotId } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from '../OpenModalButton';
import { MdOutlineStarRate, MdStarRate } from "react-icons/md";
import { LuDot } from "react-icons/lu";


const ReviewAvgCount = () => {

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


    return (
        <>
        {
            spotDetails.Reviews.length ? (
                spotDetails.Reviews.length > 1 ? (
                    <div><MdStarRate />{spotDetails.avgRating ? spotDetails.avgRating : spotDetails.avgRating} <LuDot /> {spotDetails.numReviews} reviews</div>

                ) : (
                    <div><MdStarRate />{spotDetails.avgRating ? spotDetails.avgRating.toFixed(2) : spotDetails.avgRating} <LuDot /> {spotDetails.numReviews} review</div>
                )

            ) : (
                <div><MdOutlineStarRate/>New</div>
            )
}
        </>
    )
}
export default ReviewAvgCount
