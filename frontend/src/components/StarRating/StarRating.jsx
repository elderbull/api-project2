import { useState } from 'react';
import './StarRating.css'; // Import CSS for styling

const StarRating = ({ totalStars = 5 }) => {
  const [rating, setRating] = useState(0); // State to keep track of the rating
  const [hovered, setHovered] = useState(null); // State for hover effect

  const handleClick = (value) => {
    setRating(value); // Set the rating when a star is clicked
  };

  const handleMouseEnter = (value) => {
    setHovered(value); // Set the hover state when mouse enters a star
  };

  const handleMouseLeave = () => {
    setHovered(null); // Reset hover state when mouse leaves the star
  };

  return (
    <div className="star-rating">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={starValue}
            className={`star ${starValue <= (hovered || rating) ? 'filled' : ''}`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
          >
            &#9733;
          </span>
        );
      })}
      <div className="rating-value">{rating} / {totalStars}</div>
    </div>
  );
};

export default StarRating;
