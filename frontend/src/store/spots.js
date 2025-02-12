import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spot/load_spots';
const LOAD_CURRENT_USER_SPOTS = 'spot/load_current_user_spots'
const ADD_SPOT = 'spot/add_spot';
const EDIT_SPOT = 'spot/edit_spot';
const REMOVE_SPOT = 'spot/remove_spot';
const ADD_IMAGE = 'spot/add_image';
const LOAD_DETAILS = 'spot/load_details';
const LOAD_REVIEWS = 'spot/load_reviews'

//regular action creator
const loadSpots = (spots) => {
  return {
    type: LOAD_SPOTS,
    spots
  };
};

const loadCrntUsrSpots = (spots) => {
  return {
    type: LOAD_CURRENT_USER_SPOTS,
    spots
  };
};

const addSpot = (spot) => {
  return {
    type: ADD_SPOT,
    spot
  };
};

const editSpot = (spot) => {
  return {
    type: EDIT_SPOT,
    spot
  };
};

const removeSpot = (spotId) => {
  return {
    type: REMOVE_SPOT,
    spotId
  };
};

const addImage = (image) => {
  return {
    type: ADD_IMAGE,
    image
  };
};

const loadDetails = (spotId) => {
  return {
    type: LOAD_DETAILS,
    spotId
  };
};

const loadReviews = (spotId) => {
  return {
    type: LOAD_REVIEWS,
    spotId
  };
};

//thunk action
export const getSpots = () => async (dispatch) => {
    //save response from fetched api
    const response = await csrfFetch('/api/spots');
    const spots = await response.json()
    dispatch(loadSpots(spots))
    return //don't know if I need to return
}

export const getCurrentUserSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/session/current');
    const spots = await response.json()
    dispatch(loadCrntUsrSpots(spots))
    return // don't know if return is needed after dispatch
}

export const createSpot = (spot) => async (dispatch) => {
    const { address, city, state, country, lat, lng, name, description, price } = spot;
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
            { address, city, state, country, lat, lng, name, description, price
        })
    })

    if (response.ok) {
        const data = await response.json();
        dispatch(addSpot(data));
        return data
    }
};

export const updateSpot = (spotId, spot) => async (dispatch) => {
    const { address, city, state, country, lat, lng, name, description, price } = spot;
    const response = await csrfFetch(`/api/spots/${spotId}`, { //use str literal for spotId
        method: 'PUT',
        body: JSON.stringify(
            { address, city, state, country, lat, lng, name, description, price }
        )
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(editSpot(data))
    }
};

export const deleteSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    })

    if (response.ok) {
        dispatch(removeSpot(spotId))
        dispatch(getCurrentUserSpots())
        return //dont know if return is needed after dispatch
    }
};

export const addSpotImage = (image) => async (dispatch) => {
    const { spotId, url, preview } = image;
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        body: JSON.stringify({url, preview})
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(addImage(data));
        return response;
    }
};

export const getSpotById = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);

    if (response.ok) {
        const data = await response.json();
        dispatch(loadDetails(data));
        return
    }
};

export const getReviewsBySpotId = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (response.ok) {
        const data = await response.json();
        dispatch(loadReviews(data.Reviews));
        return response //am i return response or data
    }
};

/* -------------end of thunk actions--------------------- */



const initialState = {};

const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS:{
            const newState = {...state, ...action.spots};
            action.spots.Spots.forEach((spot) => newState[spot.id]=spot)
            return newState

        }
        case LOAD_CURRENT_USER_SPOTS: {
            const newState = {...state, Spots: action.spots}
            return newState
        }
        case ADD_SPOT: {
            const newState = {...state, ...action.spot}
            return newState
        }
        case EDIT_SPOT: {
            const newState = {...state, ...action.spot}
            return newState
        }
        case REMOVE_SPOT: {
            const deletedSpot = action.spotId;
            const newState = {...state, deletedSpot};
            delete newState.deletedSpot
            return //do I return newState
        }
        case LOAD_DETAILS: {
            const newState = {...state, ...action.spotId}
            return newState
        }
        case LOAD_REVIEWS: {
          const newState = {...state, Reviews: action.spotId}
          return newState
        }
        default:
            return state;
    }
};


export default spotReducer;
