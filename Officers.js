import Actions from "../Type"
import axios from "../request"

export const GetOfficers = () => {
  return async dispatch => {
    try {
      dispatch({ type: Actions.GET_OFFICER_REQUEST })
      const response = await axios.get("/api/v1/courts/probation/officer/")
      dispatch({
        type: Actions.GET_OFFICER_SUCCESS,
        payload: response.data.results
      })
    } catch (e) {
      dispatch({ type: Actions.GET_OFFICER_FAIL })
      console.log('officers get api', e);
    }
  }
}

export const addOfficersData=(data)=>{
  return async dispatch => {
    try {
      dispatch({
        type: Actions.ADD_OFFICER_DATA,
        payload: data
      })
    } catch (e) {
      console.log("e :>> ", e)
    }
  }
}