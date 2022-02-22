import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import AuthReducer from "./Reducers/AuthReducer";
import ManageUserReducer from "./Reducers/ManageUserReducer";
import CourtReducer from "./Reducers/CourtReducer";
import PaymentPlanReducer from "./Reducers/PaymentPlanReducer";
import OfficersReducer from "./Reducers/OfficersReducer";
import ServicesReducer from "./Reducers/ServicesReducer";

const ConfigureStore = () => {

  const rootReducer = combineReducers({
    auth: AuthReducer,
    manageUser:ManageUserReducer,
    court:CourtReducer,
    paymentPlan:PaymentPlanReducer,
    officers:OfficersReducer,
    services:ServicesReducer
  });


  const store = createStore(rootReducer, applyMiddleware(thunk));

  return { store };

};

export default ConfigureStore;
