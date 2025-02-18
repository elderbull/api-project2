import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spot/load_spots';
const LOAD_CURRENT_USER_SPOTS = 'spot/load_current_user_spots'
const ADD_SPOT = 'spot/add_spot';
const EDIT_SPOT = 'spot/editSpot';
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

export const getCurrtUsrSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/session/spots');

    if (response.ok) {
      const data = await response.json()
      dispatch(loadCrntUsrSpots(data))
      return data // don't know if return is needed after dispatch
    }
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

    const response = await csrfFetch(`/api/spots/${spotId}`, { //use str literal for spotId
        method: 'PUT',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(spot)
    })

       if (response.ok) {
        const updatedData = await response.json();
        dispatch(editSpot(updatedData.spot))
        return updatedData;
       }

};

export const deleteSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json"
        }

    })

    const deletedSpot = await response.json()

    if (deletedSpot) {
        // dispatch(removeSpot(spotId))
        dispatch(removeSpot(spotId));
        return deletedSpot //dont know if return is needed after dispatch
    }
}

export const addSpotImage = (spotId, imgUrl, preview) => async (dispatch) => {
    // const { spotId, url, preview } = image;
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        body: JSON.stringify({url:imgUrl, preview})
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(addImage(data));
        return response;
    }
}

export const getSpotById = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);


    if (response.ok) {
        const data = await response.json();
        dispatch(loadDetails(data));
        return data;
    }
}

export const getReviewsBySpotId = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (response.ok) {
        const data = await response.json();
        dispatch(loadReviews(data.Reviews));
        return response //am i return response or data
    }
}

/* -------------end of thunk actions--------------------- */



const initialState = {};

const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS:{
            const newState = {...action.spots};
            action.spots.Spots.forEach((spot) => newState[spot.id]=spot)
            return newState

        }
        case LOAD_CURRENT_USER_SPOTS: {
            const newState = {...action.spots}
            action.spots.Spots.forEach((spot)=> newState[spot.id]=spot)
            return newState
        }
        case ADD_SPOT: {
            const newState = {...state, ...action.spot}
            return newState
        }
        case EDIT_SPOT: {
            return  {...state, spot: state.spot.map((s) => s.id === action.spot.id ? action.spot : s)}
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
