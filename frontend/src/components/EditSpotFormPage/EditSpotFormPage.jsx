import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getSpotById, updateSpot } from '../../store/spots';
import './EditSpotForm.css'

function EditSpotFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {spotId } = useParams();
  const sessionUsr = useSelector((state) => state.session.user)
  const currSpot = useSelector((state) => state.spot.Spots)

  console.log[currSpot]

  useEffect(() => {
    dispatch(getSpotById(spotId))
  },[dispatch, spotId])

  const [address, setAddress] = useState(currSpot?.address);
  const [city, setCity] = useState(currSpot?.city);
  const [state, setState] = useState(currSpot?.state);
  const [country, setCountry] = useState(currSpot?.country);
  const [lat, setLat] = useState(currSpot?.lat);
  const [lng, setLng] = useState(currSpot?.lng);
  const [name, setName] = useState(currSpot?.name);
  const [description, setDescription] = useState(currSpot?.description);
  const [price, setPrice] = useState(currSpot?.price);
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (currSpot) {
        setName(currSpot.name || '');
        setAddress(currSpot.address || '');
        setCity(currSpot.city || '');
        setState(currSpot.state || '');
        setCountry(currSpot.country || '');
        setLat(currSpot.lat || '');
        setLng(currSpot.lng || '');
        setDescription(currSpot.description || '');
        setPrice(currSpot.price || '');
    }
  }, [currSpot]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sessionUsr) {
      setErrors({});

      const editedSpot = {
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
        updateSpot(currSpot.id, editedSpot)
        ).then(spot => {
          navigate(`/spots/${spot.id}`)
      })

        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
  };


  return (
    <>
      {sessionUsr && <div className='create-spot-box'>
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


                <div className='create-spot-bttn-bx'>
                    <button type="submit" id="newspot-submit-bttn">
                        Create Spot
                    </button>
                </div>


            </form>
        </div>}
    </>
  )
}

export default EditSpotFormPage;
