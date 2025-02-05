import { csrfFetch } from "./csrf";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const setUser = (user) => {
    return {
        type: SET_USER,
        payload: user
    };
};

const removeUser = () => {
    return {
        type: REMOVE_USER
    };
};

//Login thunk action
export const login = (user) => async (dispatch) => {
    const { credential, password } = user;
    const response = await csrfFetch("/api/session", {
        method: "POST",
        body: JSON.stringify({
            credential,
            password
        })
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

//Restore User thunk action
export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
}

//SignUp User thunk action
export const signupUser = (user) => async (dispatch) => {
    const {username,firstName,lastName, email, password} = user;
    const response = await csrfFetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
            username,
            firstName,
            lastName,
            email,
            password
        })
    })
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

//LogOut User Thunk Action
export const logoutUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session",{
    method: 'DELETE'
});
dispatch(removeUser());
return response;
}

const initialState = { user: null};

const sessionReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_USER:
            return {...state, user:action.payload};
        case REMOVE_USER:
            return {...state, user: null};
        default:
            return state;
    }
};

export default sessionReducer
