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
            setErrors(data.errors);
          }
        });




    return (
        <div className='create-spot-box'>
            <h1>Create a New Spot</h1>


        </div>
    )
}

export default CreateSpotFormPage;
