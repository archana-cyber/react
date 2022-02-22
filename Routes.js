import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom"
import Login from "../Pages/Auth/Login"
import Dashboard from "../Pages/Dashboard/Dashboard"
import LeftDrawer from "../Components/LeftDrawer/LeftDrawer"
import OfficersManagement from "../Pages/OfficersManagement/OfficersManagement"
import CourtPricing from "../Pages/CourtPricing/CourtPricing"
import ServicesManagement from "../Pages/ServicesManagement/ServicesManagement"
import Documentation from "../Pages/Documentation/Documentation"
import PaymentManagement from "../Pages/PaymentManagement/PaymentManagement"
import UserManagement from "../Pages/UserManagement/UserManagement"
import ReportManagement from "../Pages/ReportManagement/ReportManagement"
import { useLocation } from "react-router-dom"
import { connect, useDispatch } from "react-redux"
import { auth } from "../Store/Actions/Auth"
import ConfigureStore from "../Store/Store"
import React, { useState, useEffect, useContext } from "react"
import FileStorageManagement from "../Pages/FileStorageManagement/FileStorageManagement"
import ResetPassword from "../Pages/Auth/ResetPassword/ResetPassword"
import ClientPricing from "../Pages/ClientPricing/ClientPricing"
// import ForgetPassword from "../Pages/Auth/ForgetPassword/ForgetPassword"
// import TokenInput from "../Pages/Auth/TokenInput/TokenInput"
import useAuth from "../utils/useAuth"
import User from "../Pages/Users/User"
import Payments from "../Pages/Payments/Payments"

const Routes = props => {
  const { store } = ConfigureStore()
  const token = localStorage.getItem("token")
  const [choice, setChoice] = useState(false)
  const { isAdmin, isIndividualUser, isOperator } = useAuth()

  useEffect(() => {
    let ch = false

    if (
      props.accessToken !== null &&
      props.accessToken !== "" &&
      props.accessToken !== undefined
    ) {
      setChoice(true)
      ch = true
    } else {
      setChoice(false)
      ch = false
    }
  }, [props.accessToken, choice])

  const TrueRoutes = () => {}

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        {/* <Route exact path="/reset-password">
          <ResetPassword />
        </Route>
        <Route exact path="/forget-password">
          <ForgetPassword />
        </Route>
        <Route exact path="/token-verification">
          <TokenInput />
        </Route> */}
        <Route exact path="/reset-password">
          <ResetPassword />
        </Route>

        <LeftDrawer>
          {/* <Redirect to={currentlocation} /> */}
          {/* <Route exact path="/file-storage">
            <FileStorageManagement />
          </Route> */}
          {!isIndividualUser && (
            <>
              <Route exact path="/reports">
                <ReportManagement />
              </Route>
              <Route exact path="/documentation">
                <Documentation />
              </Route>
            </>
          )}
          {(isAdmin || isIndividualUser) && (
            <Route exact path="/payment-plans">
              <PaymentManagement />
            </Route>
          )}
          {(isAdmin || isOperator) && (
            <>
              <Route exact path="/manage-users">
                <UserManagement />
              </Route>
              <Route exact path="/courts">
                <Dashboard />
              </Route>
            </>
          )}
          {isAdmin && (
            <>
              <Route exact path="/officers">
                <OfficersManagement />
              </Route>
              <Route exact path="/court-pricing">
                <CourtPricing />
              </Route>
              <Route exact path="/client-pricing">
                <ClientPricing />
              </Route>
              <Route exact path="/services">
                <ServicesManagement />
              </Route>
              <Route exact path="/user">
                <User />
              </Route>
              <Route exact path="/payments">
                <Payments />
              </Route>
            </>
          )}
        </LeftDrawer>
      </Switch>
    </Router>
  )
}

const mapStateToProps = state => {
  return {
    accessToken: state.auth.accessToken
  }
}

export default connect(mapStateToProps, { auth })(Routes)
