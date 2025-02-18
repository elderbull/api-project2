import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from '../../context/Modal';
import { FaStar } from 'react-icons/fa';
import { createReview } from "../../store/reviews";
import './CreateReviewForm.css'

const CreateReviewFormModal = () => {
    const dispatch = useDispatch();
    const currSpot = useSelector((state) => state.spot)
    const [review, setReview] = useState("");
    const [numStars, setNumStars] = useState(null);
    const [hover, setHover] = useState(null);
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit= async (e) => {
        e.preventDefault()
        setErrors({});

        const newReview = {
            review,
            stars: numStars
        }

        return dispatch(createReview(currSpot.id, newReview))
            .then(closeModal)
            .catch(async (res) => {
                const data= res.json();
                if (data?.errors) setErrors(data.errors)
            });
    };

    return (
        <>
            <div className="review-form-box">
                <h1>How was your stay?</h1>
            </div>
            <form onSubmit={handleSubmit} className="review-form">
                <div className="review-text-box">
                <textarea
                    className="review-input"
                    placeholder="Leave your review here..."
                    type="text"
                    rows="8"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    required
                 />
                 {errors.review && <p>{errors.review}</p>}
                </div>
                 <div className="stars-box">
                 {[...Array(5)].map((star, idx) => {
                const currStars = idx + 1
                return (
                    <label key={idx}>
                        <input
                            type="radio"
                            name="rating"
                            value={currStars}
                            onClick={() => setNumStars(currStars)}
                            required
                        />
                        <FaStar
                            size={20}
                            className="star"
                            color={currStars <= (hover || numStars) ? "yellow" : "grey" }
                            onMouseEnter={() => setHover(currStars)}
                            onMouseLeave={() => setHover(null)}
                            style={{
                                outline: 'black'
                            }}
                        />
                    </label>
                )
            })}

                </div>
        {errors.stars && <p>{errors.stars}</p>}
        <div className="review-bttn-box">
        <button type="submit" className="review-submit-bttn">Submit Your Review</button>
        </div>
            </form>
        </>
    )
}

export default CreateReviewFormModal
