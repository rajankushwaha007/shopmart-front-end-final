import { CREATE_USER_RED, DELETE_USER_RED, GET_USER_RED, UPDATE_USER_RED } from "../Constants"

export default function UserReducer(state = [], action) {
    let index
    switch (action.type) {
        case CREATE_USER_RED:
            return [...state, action.payload]

        case GET_USER_RED:
            return action.payload

        case UPDATE_USER_RED:
            index = state.findIndex(x => x._id === action.payload._id)
            state[index] = { ...action.payload }
            return state

        case DELETE_USER_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}