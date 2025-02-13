import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSpot, addSpotImage } from '../../store/spots';
import './CreateSpotForm.css'


function CreateSpotFormPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionUser = useSelector((state) => state.session.user);
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [previewImgUrl, setPreviewImgUrl] = useState("");
    const [img1Url, setImg1Url] = useState("");
    const [img2Url, setImg2Url] = useState("");
    const [img3Url, setImg3Url] = useState("");
    const [img4Url, setImg4Url] = useState("");
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        if (sessionUser) {
            setErrors({});
        }
    }

    const newSpot = {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    }

    dispatch(
        createSpot(newSpot)
      )
        .then(spot => {
          dispatch(addSpotImage({ spotId: spot.id, url: previewImgUrl, preview: true }))
          return spot.id
        })
        .then((id) => {
          dispatch(addSpotImage({ spotId: id, url: img1Url, preview: false }))
          return id;
        })
        .then((id) => {
          dispatch(addSpotImage({ spotId: id, url: img2Url, preview: false }))
          return id;
        })
        .then((id) => {
          dispatch(addSpotImage({ spotId: id, url: img3Url, preview: false }))
          return id;
        })
        .then((id) => {
          dispatch(addSpotImage({ spotId: id, url: img4Url, preview: false }))
          navigate(`/spots/${id}`)
          return id;
        })
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            // setErrors(data.errors);
          }
        });




    return (
        <div className='create-spot-box'>
            <h1>Create a New Spot</h1>
            <form onSubmit={handleSubmit} className='spot-form'>
                <div className='new-spot-section'>
                    <h2 className='spotform-heading'>Where's your place located?</h2>
                    <p className='spotform-caption'>Guests will only get your exact address once they book a reservation</p>
                    <input
                        placeholder='Country'
                        className='form-input'
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                    {errors.country && <p className='input-error'>{errors.country}</p>}
                    <input
                        placeholder='Street Address'
                        className='form-input'
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    {errors.address && <p className='input-error'>{errors.address}</p>}
                    <input
                        placeholder='City'
                        className='form-input'
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    {errors.city && <p className='input-error'>{errors.city}</p>},
                    <input
                        placeholder='State'
                        className='form-input'
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                    {errors.state && <p className='input-error'>{errors.state}</p>}
                    <input
                        placeholder='Latitude'
                        className='form-input'
                        type="text"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                    />
                    {errors.lat && <p className='input-error'>{errors.lat}</p>}
                    <input
                        placeholder='Longitude'
                        className='form-input'
                        type="text"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                    />
                    {errors.lng && <p className='input-error'>{errors.lng}</p>}
                </div>
                <div className='new-spot-section'>
                    <h2 className='spotform-heading'>Describe your place to guests</h2>
                    <p className='spotform-caption'>Mention the best features of your space, any special amenties like fast ifi or parking, and what you about the neighborhood.</p>
                    <textarea
                        placeholder='Please write at least 30 characters'
                        className='form-input'
                        type="text"
                        rows="7"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {errors.description && <p className='input-error'>{errors.description}</p>}
                </div>
                <div className='new-spot-section'>
                    <h2 className='spotform-heading'>Create a title for your spot</h2>
                    <p className='spotform-caption'>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                    <input
                        placeholder='Name of your spot'
                        className='form-input'
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <p className='input-error'>{errors.name}</p>}
                </div>
                <div className='new-spot-section'>
                <h2 className='spotform-heading'>Set a base price for your spot</h2>
                <p className='spotform-caption'>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                $ <input
                    placeholder='Price per night (USD)'
                    className='form-input price-input'
                    type='number'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                 />
                </div>
                <div className='new-spot-section'>
                <h2 className='spotform-heading'>Liven up your spot with photos</h2>
                <p className='spotform-caption'>Submit a link to a least one photo to publish</p>
                <input
                    placeholder='Preview Image URL'
                    className='form-input'
                    type='url'
                    value={previewImgUrl}
                    onChange={(e) => setPreviewImgUrl(e.target.value)}
                 />
                <input
                    placeholder='Image URL'
                    className='form-input'
                    type='url'
                    value={img1Url}
                    onChange={(e) => setImg1Url(e.target.value)}
                 />
                <input
                    placeholder='Image URL'
                    className='form-input'
                    type='url'
                    value={img2Url}
                    onChange={(e) => setImg2Url(e.target.value)}
                 />
                <input
                    placeholder='Image URL'
                    className='form-input'
                    type='url'
                    value={img3Url}
                    onChange={(e) => setImg3Url(e.target.value)}
                 />
                <input
                    placeholder='Image URL'
                    className='form-input'
                    type='url'
                    value={img4Url}
                    onChange={(e) => setImg4Url(e.target.value)}
                 />
                </div>

                <div className='create-spot-bttn-bx'>
                    <button type="submit" id="newspot-submit-bttn">
                        Create Spot
                    </button>
                </div>




            </form>
        </div>
    )
}

export default CreateSpotFormPage;
