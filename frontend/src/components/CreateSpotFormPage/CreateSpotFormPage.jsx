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

    const valForm = () => {
        const formErrs = {};
        const valImgExt = /.(jpg|jpeg|png|gif|bmp)$/i; //check image extensions

        if (!country) formErrs.country = "Country is required.";
        if (!address) formErrs.address = "Street address is required.";
        if (!city) formErrs.city = "City is required.";
        if (!state) formErrs.state = "State is required.";
        if (!lat || isNaN(lat)) formErrs.lat = "Latitude must be a number.";
        if (!lng || isNaN(lng)) formErrs.lng = "Longitude must be a number.";
        if (!description || description.length < 30) formErrs.description = "Description must be at least 30 characters.";
        if (!name) formErrs.name = "Spot name is required.";
        if (!price || price <= 0) formErrs.price = "Price must be a positive number.";
        if (!previewImgUrl) formErrs.previewImage = "Must include a preview image.";



        const imgArr = [previewImgUrl, img1Url, img2Url, img3Url, img4Url];
        imgArr.forEach((image, index) => {
            if (image && !valImgExt.test(image)) {
        formErrs[`image${index + 1}`] = "Image URL needs to end in .png, .jpg, or .jpeg.";
      }
    });

        setErrors(formErrs)
        return Object.keys(formErrs).length === 0
    }


    const handleSubmit = async(e) => {
        e.preventDefault();


        const newSpot = {address, city, state, country,lat,lng,name,description,price};
        if (!valForm()) return;

        const response = await dispatch(createSpot(newSpot));
        if (response) {
            const imgArr = [previewImgUrl,img1Url,img2Url,img3Url,img4Url]
            imgArr.map(async (image, i) => {
                console.log(`${i} - image =>`,image)
                let preview = false;
                if(i===0) preview = true;

            await dispatch(addSpotImage(response.id, image, preview))
        })
        navigate(`/spots/${response.id}`);
    }


        setAddress("")
        setCountry("")
        setCity("")
        setState("")
        setState("")
        setLat("")
        setLng("")
        setDescription("")
        setName("")
        setPrice("")
        setPreviewImgUrl("")
        setImg1Url("")
        setImg2Url("")
        setImg3Url("")
        setImg4Url("")
    }





    return (
        <>
         {sessionUser && <div className='create-spot-box'>
            <h1>Create a New Spot</h1>
            <form onSubmit={handleSubmit} className='spot-form'>
                <div className='new-spot-section'>
                    <h2 className='spotform-heading'>Where&apos;s your place located?</h2>
                    <p className='spotform-caption'>Guests will only get your exact address once they book a reservation</p>
                    <input
                        placeholder='Country'
                        className='form-input'
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                    {errors.country && <p className='input-error-create'>{errors.country}</p>}
                    <input
                        placeholder='Street Address'
                        className='form-input'
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    {errors.address && <p className='input-error-create'>{errors.address}</p>}
                   <div className='city-state'>
                    <input
                            placeholder='City'
                            className='form-input city-input'
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                        {errors.city && <p className='input-error-create'>{errors.city}</p>},
                        <input
                            placeholder='State'
                            className='form-input state-input'
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                        />
                        {errors.state && <p className='input-error-create'>{errors.state}</p>}
                   </div>
                    <div className='lat-lng'>
                    <input
                        placeholder='Latitude'
                        className='form-input lat-input'
                        type="text"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                    />
                    {errors.lat && <p className='input-error-create'>{errors.lat}</p>}
                    <input
                        placeholder='Longitude'
                        className='form-input'
                        type="text"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                    />
                    {errors.lng && <p className='input-error-create'>{errors.lng}</p>}
                    </div>
                </div>
                <div className='new-spot-section'>
                    <h2 className='spotform-heading'>Describe your place to guests</h2>
                    <p className='spotform-caption'>Mention the best features of your space, any special amenties like fast wifi or parking, and what you about the neighborhood.</p>
                    <textarea
                        placeholder='Please write at least 30 characters'
                        className='form-input'
                        type="text"
                        rows="7"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {errors.description && <p className='input-error-create'>{errors.description}</p>}
                </div>
                <div className='new-spot-section'>
                    <h2 className='spotform-heading'>Create a title for your spot</h2>
                    <p className='spotform-caption'>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
                    <input
                        placeholder='Name of your spot'
                        className='form-input'
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <p className='input-error-create'>{errors.name}</p>}
                </div>
                <div className='new-spot-section'>
                <h2 className='spotform-heading'>Set a base price for your spot</h2>
                <p className='spotform-caption'>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                <div className='price-section'>
                $ <input
                    placeholder='Price per night (USD)'
                    className='form-input price-input'
                    type='number'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                 />
                </div>
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
                    required
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
        </div>}
         {!sessionUser && <h1>Not Authenticated</h1>}
        </>
    )
}

export default CreateSpotFormPage;
