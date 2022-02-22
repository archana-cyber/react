import Actions from "../Type.js"

const initialState = {
  
  loading: false,
  data: [],
  error: "",
  responseData:{}
}



const OfficersReducer = (state = initialState, { type, payload }) => {
  switch (type) {
   
    case Actions.GET_OFFICER_REQUEST:
      return {
        ...state,
        loading: true
      }
    case Actions.GET_OFFICER_SUCCESS:
      return {
        ...state,
        loading: false,
        data: payload
      }
    case Actions.GET_OFFICER_FAIL:
      return {
        ...state,
        loading: false,
       
      }
     case Actions.ADD_OFFICER_DATA:
       return {
         ...state,
         data: [ ...state.data, payload ],
         responseData:payload
       } 

    default:
      return state
  }
}

export default OfficersReducer
