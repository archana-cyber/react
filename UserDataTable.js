import React, { useState, useEffect, useContext } from "react"
import {
  useStyles,
  newStyles,
  dialogStyles,
  addUserStyles
} from "./UserDataTableStyle"
import { DataArray, UserArray } from "./DataArray"
import MoreDropDown from "../MoreDropDown/MoreDropDown"
import ViewModal from "../ViewModal/ViewModal"
import axios from "../../Store/request"
import { connect, useDispatch, useSelector } from "react-redux"
import { auth } from "../../Store/Actions/Auth"
import Dialog from "@material-ui/core/Dialog"
import { ScreenContext } from "../../context/context"
import Logo from "../../assets/AMSLogo.png"
import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import useToast from "../../Components/Toast/useToast"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import InputLabel from "@material-ui/core/InputLabel"
import FormControl from "@material-ui/core/FormControl"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import {
  ClientDetailAction,
  GetUser,
  ManageUserAction
} from "../../Store/Actions/ManageUserAction"
import { GetCourt } from "../../Store/Actions/Court"
import { GetOfficers } from "../../Store/Actions/Officers"
import { GetPaymentPlan } from "../../Store/Actions/PaymentPlan"
import { GetServices } from "../../Store/Actions/Services"
import { CircularProgress } from "@material-ui/core"
import SearchableDropDown from "../SearchableDropdown/SearchableDropDown"
import CourtDropDownData from "../CourtDropDownData/CourtDropDownData"
import AddCourtDialog from "../AddCourtDialog/AddCourtDialog"
import AddOfficerDialog from "../AddOfficersDialog/AddOfficerDialog"
import { AddPaymentModal } from "../AddPaymentModal/AddPaymentModal"
import AddServicesDialog from "../AddServicesDialog/AddServicesDialog"

const UserDataTable = props => {
  const classes = useStyles()
  const newclasses = newStyles()
  const userClasses = dialogStyles()
  const addUserClasses = addUserStyles()
  const { showToast } = useToast()
  const [currentData, setCurrentData] = useState({})
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const [openDescModal, setOpenDescModal] = useState(false)
  const [arrayOfData, setArrayOfData] = useState([])
  const [userDetailModal, setUserDetailModal] = useState(false)
  const { screenSize, setScreenSize } = useContext(ScreenContext)
  //const [showAdduser, setShowAdduser] = useState(true);
  const [openCourtModal, setOpenCourtModal] = useState(false)
  const [openOfficerModal, setOpenOfficerModal] = useState(false)
  const [openPaymentModal, setOpenPaymentModal] = useState(false)
  const [openServiceModal, setOpenServiceModal] = useState(false)
  const [formError, setFormError] = useState()
  const dispatch = useDispatch()
  const [dropDownInput, setDropDownInput] = useState("")
  const [searchData, setSearchData] = useState([])  
  const [dropdownData, setDropdownData] = useState({
    court: "",
    paymentPlan: ""
  })
  const [userData, setUserData] = useState({
    //residentAddress: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    address: "",
    emergency_contact: "",
    email: "",
    home_phone: "",
    phone: "",
    alt_phone: "",
    // is_court_admin_user: false,
    //is_operator_user: false,
    //is_administrator: false,
    pay_plan_procedure: "",
    user_type: "",
    court: "",
    parole_officer: "",
    middle_name: "",
    username: "",
    services: []
  })
  const [validation, setValidation] = useState({})
  const {   
    addUser: isAddUser,
    clientDetail,
    data: manageUserData,
    loading: userLoading
  } = useSelector(({ manageUser }) => manageUser)
  const { data: courtData,responseData:courtsData } = useSelector(({ court }) => court)
  const { data: officersData,responseData:officers } = useSelector(({ officers }) => officers)
  const { data: paymentPlanData,responseData:paymentPlan } = useSelector(
    ({ paymentPlan }) => paymentPlan
  )
  const { data: servicesData,responseData:service } = useSelector(({ services }) => services)

  const MenuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "center",
      maxHeight: "100px"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "center",
      maxHeight: "100px"
    },
    PaperProps: {
      style: {
        maxHeight: 120,
        maxWidth: "30%"
      }
    }
  }
 //console.log('userData', userData)
 
  useEffect(() => {
    dispatch(GetUser())
    dispatch(GetOfficers())
    dispatch(GetPaymentPlan())
    dispatch(GetServices())
  }, [])

  useEffect(() => {
    setScreenSize(window.innerWidth)
  }, [screenSize])

  useEffect(() => {
    if (paymentPlan.id) {
      setUserData({ ...userData, pay_plan_procedure: paymentPlan.id })
    }
  }, [paymentPlan.id])

  useEffect(() => {
    if (courtsData.id) {
      setUserData({ ...userData, court: courtsData.id })
    }
  }, [courtsData.id])

  useEffect(() => {
    if (officers.id) {
      setUserData({ ...userData, parole_officer: officers.id })
    }
  }, [officers.id])


  useEffect(() => {
  
    if (service.id) {
      setUserData({ ...userData, services: [...userData.services, service.id] })
    }
  }, [service.id])
 

  const isPhoneNumberValid = number => {
    return (
      !number.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/) ||
      number.length !== 12
    )
  }
  const userTypeDropDownData=()=>{
   
    const users = [
      { label: 'Admin', value: 1 },
      { label: 'User', value: 2 },
      { label: 'Court', value: 3 },
      { label: 'Operator', value: 4 },    
    ];
    return users
  }

  const paymentDropDownData = () => {
    return paymentPlanData?.map(item => ({ value: item.id, label: item.name }))
  }

  const officersDropDownData = () => {
   
    return officersData?.map(item => ({
      value: item.id,
      label: item.first_name
    }))
  }

  const servicesDropDownData = () => {
    return servicesData?.map(item => ({ value: item.id, label: item.name }))
  }

  const formValidation = () => {
    const {
      username,
      first_name,
      last_name,
      date_of_birth,
      address,
      emergency_contact,
      email,
      home_phone,
      phone,
      alt_phone,
      pay_plan_procedure,
      user_type,
      court,
      parole_officer,
      middle_name,
      services
    } = userData
    let formErrors = {}
    let formIsValid = true
    let mobPattern = /(7|8|9)\d{9}/
    if (!username) {
      formIsValid = false
      formErrors["username"] = "username is required."
    }
    if (!first_name) {
      formIsValid = false
      formErrors["first_name"] = "first name is required."
    }
    if (!middle_name) {
      formIsValid = false
      formErrors["middle_name"] = "middle name is required."
    }
    if (!last_name) {
      formIsValid = false
      formErrors["last_name"] = "last name is required."
    }
    if (!date_of_birth) {
      formIsValid = false
      formErrors["date_of_birth"] = "date of birth is required."
    }
    if (!address) {
      formIsValid = false
      formErrors["address"] = "address is required."
    }
    if (!emergency_contact) {
      formIsValid = false
      formErrors["emergency_contact"] = "emergency contact is required."
    }
    //  else if (!emergency_contact.match(mobPattern)) {
    //   formIsValid = false
    //   formErrors["emergency_contact"] = "enter a valid contact detail."
    // }
    if (!email) {
      formIsValid = false
      formErrors["email"] = "email contact is required."
    } else if (!email.includes("@") || !email.includes(".")) {
      formIsValid = false
      formErrors["email"] = "please enter a valid email."
    }
    if (!home_phone) {
      formErrors["home_phone"] = "home contact is required."
    }
    //  else if (!home_phone.match(mobPattern)) {
    //   formIsValid = false
    //   formErrors["home_phone"] = "enter a valid contact detail."
    // }
    if (!alt_phone) {
      formIsValid = false
      formErrors["alt_phone"] = "alternate contact is required."
    }
    //  else if (!alt_phone.match(mobPattern)) {
    //   formIsValid = false
    //   formErrors["alt_phone"] = "enter a valid contact detail."
    // }
    if (!phone) {
      formIsValid = false
      formErrors["phone"] = "contact is required."
    }
    // else if (!phone.match(mobPattern)) {
    //   formIsValid = false
    //   formErrors["phone"] = "enter a valid contact detail."
    // }
    if (!pay_plan_procedure) {
      formIsValid = false
      formErrors["pay_plan_procedure"] = "payment plan is required."
    }
    if (!court) {
      formIsValid = false
      formErrors["court"] = "court  is required."
    }
    if (!parole_officer) {
      formIsValid = false
      formErrors["parole_officer"] = "parole officer is required."
    }
    if (!user_type) {
      formIsValid = false
      formErrors["user_type"] = "user type is required."
    }
    if (!services.length) {
      formIsValid = false
      formErrors["services"] = "service is required."
    }

    setValidation(formErrors)
    return formIsValid
  }
  const addUserFunc = e => {
    e.preventDefault()

    if (formValidation()) {
      let finalObj = {
        ...userData,
        name: userData.first_name,
        user_type: +userData.user_type,
        pay_plan_procedure: +userData.pay_plan_procedure,
        parole_officer: +userData.parole_officer,
        court: +userData.court
      }

      addUser(finalObj)
    }
  }
 

  const addUser = async addData => {
    try {
      const response = await axios.post("/manage-users/", addData)

      if (response.status === 200) {
        showToast("User Added Successfully", "success")
        dispatch(ManageUserAction(false))
        setUserData({        
          first_name: "",
          last_name: "",
          date_of_birth: "",
          address: "",
          emergency_contact: "",
          email: "",
          home_phone: "",
          phone: "",
          alt_phone: "",         
          pay_plan_procedure: "",
          user_type: "",
          court: "",
          parole_officer: "",
          middle_name: "",
          username: "",
          services: []
        })
      }
    } catch (error) {
      setFormError(error.response.data.message)
      showToast("Could not add user, please try later", "error")
     
    }
  }
 
  const ShowUserType = userType => {
    switch (userType) {
      case 1:
        return "admin"
      case 2:
        return "user"
      case 3:
        return "court"
      case 4:
        return "operator"
      default:
        return ""
    }
  }
  const ShowCourt = courtId => {
    const foundData = courtData?.find(item => item.id === courtId)
    return foundData?.name
  }
  const ShowPaymentPlan = paymentId => {
    const foundData = paymentPlanData?.find(item => item.id === paymentId)
    return foundData?.name
  }
  const ShowParoleOfficer = officerId => {
    const foundData = officersData?.find(item => item.id === officerId)
    return foundData?.first_name
  }
  const ShowServices = services => {
    let data = []
    services?.forEach(element => {
      let found = servicesData?.find(item => item.id === element)
      data.push(found)
    })

    return data
  }
  const isDisabled = () => {
    return false
    return (
      !userData.userType ||
      !userData.courtSystem ||
      !userData.paymentPlan ||
      !userData.first_name ||
      !userData.middleName ||
      !userData.last_name ||
      !userData.date_of_birth ||
      !userData.paroleOfficer ||
      !userData.address ||
      !userData.emergency_contact ||
      !userData.email ||
      !userData.residentAddress ||
      !userData.home_phone ||
      !userData.phone ||
      !userData.alt_phone
    )
  }
  const TextClipper = (bio = "", length) => {
    let vb = ""

    if (bio.length >= length) {
      for (var i = 0; i < length; i++) {
        vb += bio.charAt(i)
      }
      bio = `${vb}...`
    }

    return bio
  }

  const dialogHandler = i => {
    dispatch(ClientDetailAction(true))
    //setUserDetailModal(true)
    setCurrentData(i)
  }
  // console.log('userData yhjg', userData )
  return (
    <>
      {userLoading ? (
        <div className={classes.root}>
          <CircularProgress style={{ color: "#3971FF" }} />
        </div>
      ) : isAddUser ? (
        <Card classes={{ root: addUserClasses.root }}>
          <CardContent>
            <form onSubmit={addUserFunc}>
              <div className={addUserClasses.majorDiv}>
                <div className={addUserClasses.flexer}>
                  <div className={addUserClasses.each}>
                    <span style={{ fontWeight: 600 }}>USER TYPE</span>
                    {/* <select
                      className={addUserClasses.selectCont}
                      onChange={e => {
                        setUserData({ ...userData, user_type: e.target.value })
                      }}
                      // required
                      name="paymentTypes"
                    >
                      <option disabled selected value="">
                        User Type
                      </option>
                      <option value={1}>Admin</option>
                      <option value={2}>User</option>
                      <option value={3}>Court</option>
                      <option value={4}>Operator</option>
                    </select> */}
                    <SearchableDropDown                     
                      data={userTypeDropDownData()}
                      handleClick={val =>
                        setUserData({ ...userData, user_type: val })
                      }
                      addNew={false}
                    />

                    <span style={{ color: "red" }}>
                      {formError?.user_type} {validation?.user_type}
                    </span>
                  </div>
                  <div className={addUserClasses.each}>
                    <span style={{ fontWeight: 600 }}>COURT SYSTEM</span>
                    <CourtDropDownData
                      handleSelect={val =>
                        setUserData({ ...userData, court: val })
                      }
                      openModal={() => setOpenCourtModal(true)}
                      inputValue={(input)=>setDropDownInput(input)}
                      selectedValue={userData.court}
                    />
                    <span style={{ color: "red" }}>
                      {formError?.court} {validation?.court}
                    </span>
                  </div>
                  <div className={addUserClasses.each}>
                    <span style={{ fontWeight: 600 }}>PAYMENT PLAN</span>
                    <SearchableDropDown                     
                      data={paymentDropDownData()}
                      handleClick={val =>
                        setUserData({ ...userData, pay_plan_procedure: val })
                      }
                      openModalHandler={() => setOpenPaymentModal(true)}
                      inputValue={(input)=>setDropDownInput(input)}
                      selectedValue={userData.pay_plan_procedure}
                     
                    />

                    <span style={{ color: "red" }}>
                      {formError?.pay_plan_procedure}
                      {validation?.pay_plan_procedure}
                    </span>
                  </div>
                  <div className={addUserClasses.each}>
                    <span style={{ fontWeight: 600 }}>USER NAME</span>
                    <input
                      type="text"
                      placeholder="User Name"
                      className={addUserClasses.selectCont}
                      value={userData.username}
                      onChange={e => {
                        setUserData({ ...userData, username: e.target.value })
                      }}
                      // required
                    />
                    <span style={{ color: "red" }}>
                      {formError?.username} {validation?.username}
                    </span>
                  </div>
                  <div className={addUserClasses.each}>
                    <span style={{ fontWeight: 600 }}>FIRST NAME</span>
                    <input
                      type="text"
                      placeholder="First"
                      className={addUserClasses.selectCont}
                      value={userData.first_name}
                      onChange={e => {
                        setUserData({ ...userData, first_name: e.target.value })
                      }}
                      //required
                    />
                    <span style={{ color: "red" }}>
                      {formError?.first_name} {validation?.first_name}
                    </span>
                  </div>
                  <div className={addUserClasses.each}>
                    <span style={{ fontWeight: 600 }}>MIDDLE NAME</span>
                    <input
                      type="text"
                      placeholder="Middle"
                      className={addUserClasses.selectCont}
                      value={userData.middle_name}
                      onChange={e => {
                        setUserData({
                          ...userData,
                          middle_name: e.target.value
                        })
                      }}
                      // required
                    />
                    <span style={{ color: "red" }}>
                      {formError?.middle_name}
                      {validation?.middle_name}
                    </span>
                  </div>
                  <div className={addUserClasses.each}>
                    <span style={{ fontWeight: 600 }}>LAST NAME</span>
                    <input
                      type="text"
                      placeholder="Last"
                      className={addUserClasses.selectCont}
                      value={userData.last_name}
                      onChange={e => {
                        setUserData({ ...userData, last_name: e.target.value })
                      }}
                      //required
                    />
                    <span style={{ color: "red" }}>
                      {formError?.last_name}
                      {validation?.last_name}
                    </span>
                  </div>
                  <div className={addUserClasses.each}>
                    <span style={{ fontWeight: 600 }}>DATE OF BIRTH</span>
                    <input
                      type="date"
                      placeholder="Type..."
                      className={addUserClasses.selectCont}
                      value={userData.date_of_birth}
                      onChange={e => {
                        setUserData({
                          ...userData,
                          date_of_birth: e.target.value
                        })
                      }}
                      //required
                    />
                    <span style={{ color: "red" }}>
                      {formError?.date_of_birth}
                      {validation?.date_of_birth}
                    </span>
                  </div>
                  <div className={addUserClasses.each}>
                    <span style={{ fontWeight: 600 }}>PAROLE OFFICER</span>
                    <SearchableDropDown                    
                      data={officersDropDownData()}
                      handleClick={val =>
                        setUserData({ ...userData, parole_officer: val })
                      }
                      openModalHandler={() => setOpenOfficerModal(true)}
                     inputValue={(input)=>setDropDownInput(input)}
                     selectedValue={userData.parole_officer}
                    />

                    <span style={{ color: "red" }}>
                      {formError?.parole_officer}
                      {validation?.parole_officer}
                    </span>
                  </div>
                  <div className={addUserClasses.each}>
                    <span style={{ fontWeight: 600 }}>FULL ADDRESS</span>
                    <input
                      type="text"
                      placeholder="Full address"
                      className={addUserClasses.selectCont}
                      value={userData.address}
                      onChange={e => {
                        setUserData({ ...userData, address: e.target.value })
                      }}
                      //required
                    />
                    <span style={{ color: "red" }}>
                      {formError?.address}
                      {validation?.address}
                    </span>
                  </div>
                  <div className={addUserClasses.each}>
                    <span style={{ fontWeight: 600 }}>EMERGENCY CONTACT</span>
                   
                    <input
                      type="number"
                      placeholder="(000) 000-0000"
                      className={addUserClasses.selectCont}
                      value={userData.emergency_contact}
                      onChange={e => {
                        setUserData({ ...userData, emergency_contact: e.target.value })
                      }}
                      // required
                    />
                    <span style={{ color: "red" }}>
                      {formError?.emergency_contact}
                      {validation?.emergency_contact}
                    </span>
                  </div>
                  <div className={addUserClasses.each}>
                    <span style={{ fontWeight: 600 }}>EMAIL ADDRESS</span>
                    <input
                      type="text"
                      placeholder="user@mail.com"
                      className={addUserClasses.selectCont}
                      value={userData.email}
                      onChange={e => {
                        setUserData({ ...userData, email: e.target.value })
                      }}
                      // required
                    />
                    <span style={{ color: "red" }}>
                      {formError?.email}
                      {validation?.email}
                    </span>
                  </div>
                  <div className={addUserClasses.each}>
                    <span style={{ fontWeight: 600 }}>RESIDENT ADDRESS</span>
                    <input
                      type="text"
                      placeholder="Address Name"
                      className={addUserClasses.selectCont}
                      // value={userData.residentAddress}
                      // onChange={e => {
                      //   setUserData({
                      //     ...userData,
                      //     residentAddress: e.target.value
                      //   })
                      // }}
                      // required
                    />
                  </div>
                  <div className={addUserClasses.each}>
                    <span style={{ fontWeight: 600 }}>HOME PHONE</span>
                    <input
                      type="number"
                      placeholder="(000) 000-0000"
                      className={addUserClasses.selectCont}
                      value={userData.home_phone}
                      onChange={e => {
                        setUserData({ ...userData, home_phone: e.target.value })
                      }}
                      // required
                    />
                    <span style={{ color: "red" }}>
                      {formError?.home_phone}
                      {validation?.home_phone}
                    </span>
                  </div>
                  <div className={addUserClasses.each}>
                    <span style={{ fontWeight: 600 }}>CELL PHONE</span>
                    <input
                      type="number"
                      placeholder="(000) 000-0000"
                      className={addUserClasses.selectCont}
                      value={userData.phone}
                      onChange={e => {
                        setUserData({ ...userData, phone: e.target.value })
                      }}
                      // required
                    />
                    <span style={{ color: "red" }}>
                      {formError?.phone}
                      {validation?.phone}
                    </span>
                  </div>
                  <div className={addUserClasses.each}>
                    <span style={{ fontWeight: 600 }}>ALTERNATIVE PHONE</span>
                    <input
                      type="number"
                      placeholder="(000) 000-0000"
                      className={addUserClasses.selectCont}
                      value={userData.alt_phone}
                      onChange={e => {
                        setUserData({
                          ...userData,
                          alt_phone: e.target.value
                        })
                      }}
                      //required
                    />
                    <span style={{ color: "red" }}>
                      {formError?.alt_phone}
                      {validation?.alt_phone}
                    </span>
                  </div>

                  <div className={addUserClasses.each}>
                    <span style={{ fontWeight: 600 }}>SERVICE</span>                   

                    <SearchableDropDown
                      isMulti
                      openModalHandler={() => setOpenServiceModal(true)}
                      data={servicesDropDownData()}
                      handleClick={val =>
                        setUserData({ ...userData, services: val })
                      }
                      inputValue={(input)=>setDropDownInput(input)}
                      selectedValue={userData.services}
                    />
                    <span style={{ color: "red" }}>
                      {formError?.services}
                      {validation?.services}
                    </span>
                  </div>

                  <div className={addUserClasses.each}></div>
                </div>

                <Button
                  variant="contained"
                  color="secondary"
                  className={addUserClasses.button}
                  style={{
                    marginTop: "20px",

                    alignSelf: "center",
                    width: "100%"
                  }}
                  disabled={isDisabled()}
                  type="submit"
                  // startIcon={<AddIcon />}
                >
                  {"ADD CLIENT"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : clientDetail ? (
        <Card classes={{ root: userClasses.root }}>
          <CardContent>
            <form>
              <div className={userClasses.majorDiv}>
                <div className={userClasses.flexer}>
                  <span className={userClasses.HorizontalLine}></span>
                  <div className={userClasses.each}>
                    <span style={{ fontWeight: 600 }}>USER TYPE</span>
                    <input
                      type="text"
                      className={userClasses.selectCont}
                      value={ShowUserType(currentData.user_type)}
                      // onChange=""
                      readOnly
                    />
                  </div>
                  <div className={userClasses.each}>
                    <span style={{ fontWeight: 600 }}>COURT SYSTEM</span>
                    <input
                      type="text"
                      className={userClasses.selectCont}
                      value={ShowCourt(currentData.court)}
                      //onChange=""
                      readOnly
                    />
                  </div>
                  <div className={userClasses.each}>
                    <span style={{ fontWeight: 600 }}>PAYMENT PLAN</span>
                    <input
                      type="text"
                      className={userClasses.selectCont}
                      value={ShowPaymentPlan(currentData.pay_plan_procedure)}
                      // onChange={e => {
                      //   setUserData({ ...userData, last_name: e.target.value })
                      // }}
                      readOnly
                    />
                  </div>
                  <div className={userClasses.each}>
                    <span style={{ fontWeight: 600 }}>USER NAME</span>
                    <input
                      type="text"
                      className={userClasses.selectCont}
                      value={currentData.username}
                      //onChange=""
                      readOnly
                    />
                  </div>
                  <div className={userClasses.each}>
                    <span style={{ fontWeight: 600 }}>FIRST NAME</span>
                    <input
                      type="text"
                      className={userClasses.selectCont}
                      value={currentData.first_name}
                      // onChange=""
                      readOnly
                    />
                  </div>
                  <div className={userClasses.each}>
                    <span style={{ fontWeight: 600 }}>MIDDLE NAME</span>
                    <input
                      type="text"
                      className={userClasses.selectCont}
                      value={currentData.middle_name}
                      //onChange=""
                      readOnly
                    />
                  </div>
                  <div className={userClasses.each}>
                    <span style={{ fontWeight: 600 }}>LAST NAME</span>
                    <input
                      type="text"
                      className={userClasses.selectCont}
                      value={currentData.last_name}
                      //onChange=""
                      readOnly
                    />
                  </div>
                  <div className={userClasses.each}>
                    <span style={{ fontWeight: 600 }}>DATE OF BIRTH</span>
                    <input
                      type="text"
                      className={userClasses.selectCont}
                      value={currentData.date_of_birth}
                      //onChange=""
                      readOnly
                    />
                  </div>
                  <div className={userClasses.each}>
                    <span style={{ fontWeight: 600 }}>PAROLE OFFICER</span>
                    <input
                      type="text"
                      className={userClasses.selectCont}
                      value={ShowParoleOfficer(currentData.parole_officer)}
                      // onChange=""
                      readOnly
                    />
                  </div>
                  <div className={userClasses.each}>
                    <span style={{ fontWeight: 600 }}>FULL ADDRESS</span>
                    <input
                      type="text"
                      className={userClasses.selectCont}
                      value={currentData.address}
                      //onChange=""
                      readOnly
                    />
                  </div>
                  <div className={userClasses.each}>
                    <span style={{ fontWeight: 600 }}>EMERGENCY CONTACT</span>
                    <input
                      type="text"
                      className={userClasses.selectCont}
                      value={currentData.emergency_contact}
                      //onChange=""
                      readOnly
                    />
                  </div>
                  <div className={userClasses.each}>
                    <span style={{ fontWeight: 600 }}>EMAIL ADDRESS</span>
                    <input
                      type="text"
                      className={userClasses.selectCont}
                      value={currentData.email}
                      // onChange=""
                      readOnly
                    />
                  </div>
                  <div className={userClasses.each}>
                    <span style={{ fontWeight: 600 }}>RESIDENT ADDRESS</span>
                    <input
                      type="text"
                      className={userClasses.selectCont}
                      value=""
                      //onChange=""
                      readOnly
                    />
                  </div>
                  <div className={userClasses.each}>
                    <span style={{ fontWeight: 600 }}>HOME PHONE</span>
                    <input
                      type="text"
                      className={userClasses.selectCont}
                      value={currentData.home_phone}
                      // onChange=""
                      readOnly
                    />
                  </div>
                  <div className={userClasses.each}>
                    <span style={{ fontWeight: 600 }}>CELL PHONE</span>
                    <input
                      type="text"
                      className={userClasses.selectCont}
                      value={currentData.phone}
                      // onChange=""
                      readOnly
                    />
                  </div>
                  <div className={userClasses.each}>
                    <span style={{ fontWeight: 600 }}>ALTERNATIVE PHONE</span>
                    <input
                      type="text"
                      className={userClasses.selectCont}
                      value={currentData.alt_phone}
                      //onChange=""
                      readOnly
                    />
                  </div>
                  <div className={userClasses.each}>
                    <span style={{ fontWeight: 600 }}>Services</span>
                    <select className={userClasses.selectCont}>
                      {ShowServices(currentData.services)?.map(item => (
                        <option value={item.id} disabled selected>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={userClasses.each}></div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : props?.passedIndex[0]?.selected ? (
        <div className={classes.Container}>
          <div className={classes.TableHeading}>
            <div className={classes.HeadingInner}>
              <p></p>
              <p className={classes.Heading1}>User name</p>
              <p className={classes.Heading}>Status</p>
            </div>
          </div>
          {manageUserData.length &&
            manageUserData?.map(i => {
              return i.is_administrator === true ? (
                <div className={classes.MainContainer}>
                  <div className={classes.ContainerInner}>
                    <p className={classes.ListItmes}>
                      {TextClipper(i.name, 15)}
                    </p>
                    <p className={classes.ListItmes}>
                      {TextClipper(i.statusName, 15)}
                    </p>

                    <MoreDropDown
                      usersEdit={() => {
                        setCurrentData(i)
                        setOpenEditModal(true)
                      }}
                      usersDelete={() => {
                        setCurrentData(i)
                        setOpenConfirmModal(true)
                      }}
                      usersDescriptionView={() => {
                        setArrayOfData([
                          {
                            title: "User Name",
                            val: i.UserName
                          },
                          {
                            title: "Status Name",
                            val: i.StatusName
                          }
                        ])
                        setCurrentData(i)
                        setOpenDescModal(true)
                      }}
                    />
                  </div>
                </div>
              ) : null
            })}
        </div>
      ) : props?.passedIndex[1]?.selected ? (
        <div className={newclasses.Container}>
          <div className={newclasses.TableHeading}>
            <div className={newclasses.HeadingInner}>
              <p className={newclasses.Heading1}>Client name</p>
              <p></p>
              <p className={newclasses.Heading}>Client ID</p>
              <p className={newclasses.Heading}>Court System</p>
              <p className={newclasses.Heading}>Payment Plan</p>
              <p className={newclasses.Heading}>Parole Officer</p>
              <p className={newclasses.Heading}>Address</p>
              <p className={newclasses.Heading}>Home Phone</p>

              <p></p>
            </div>
          </div>
          {manageUserData.length &&
            manageUserData?.map(i => {
              return (
                <div className={newclasses.MainContainer}>
                  <div className={newclasses.ContainerInner}>
                    <p className={newclasses.ListItmes}>
                      {i.username === null ? "-" : TextClipper(i.username, 15)}
                    </p>
                    <p className={newclasses.ListItmes}>{i.id}</p>
                    <p className={newclasses.ListItmes}>
                      {ShowCourt(i?.court) ?? "N/A"}
                    </p>
                    <p className={newclasses.ListItmes}>
                      {ShowPaymentPlan(i?.pay_plan_procedure) ?? "N/A"}
                    </p>
                    <p className={newclasses.ListItmes}>
                      {ShowParoleOfficer(i?.parole_officer) ?? "N/A"}
                    </p>
                    <p className={newclasses.ListItmes}>
                      {i?.address ?? "N/A"}
                    </p>

                    <p className={newclasses.ListItmes}>
                      {i?.home_phone ?? "N/A"}
                    </p>
                    <MoreDropDown
                      usersDescriptionView={() => dialogHandler(i)}
                    />
                  </div>
                </div>
              )
            })}
        </div>
      ) : props?.passedIndex[2]?.selected ? (
        <div className={newclasses.Container}>
          <div className={newclasses.TableHeading}>
            <div className={newclasses.HeadingInner}>
              <p className={newclasses.Heading1}>Court Admin Name</p>
              <p></p>
              <p className={newclasses.Heading}>ID</p>
              <p className={newclasses.Heading}>First Name</p>
              <p className={newclasses.Heading}>Last Name</p>

              <p></p>
              <p></p>
              <p></p>

              <p></p>
            </div>
          </div>
          {manageUserData.length &&
            manageUserData?.map(i => {
              return i.is_court_admin_user === true ? (
                <div className={newclasses.MainContainer}>
                  <div className={newclasses.ContainerInner}>
                    <p className={newclasses.ListItmes}>
                      {i.name === null || i.name === ""
                        ? "-"
                        : TextClipper(i.name, 15)}
                    </p>
                    <p className={newclasses.ListItmes}>{i.id}</p>
                    <p className={newclasses.ListItmes}>
                      {i.first_name === null || i.first_name === ""
                        ? "-"
                        : TextClipper(i.first_name, 15)}
                    </p>
                    <p className={newclasses.ListItmes}>
                      {i.last_name === null || i.last_name === ""
                        ? "-"
                        : TextClipper(i.last_name, 15)}
                    </p>

                    <MoreDropDown />
                  </div>
                </div>
              ) : null
            })}
        </div>
      ) : props?.passedIndex[3].selected ? (
        <div className={newclasses.Container}>
          <div className={newclasses.TableHeading}>
            <div className={newclasses.HeadingInner}>
              <p className={newclasses.Heading1}>Operator Name</p>
              <p></p>
              <p className={newclasses.Heading}>ID</p>
              <p className={newclasses.Heading}>First Name</p>
              <p className={newclasses.Heading}>Last Name</p>

              <p></p>
              <p></p>
              <p></p>

              <p></p>
            </div>
          </div>
          {manageUserData.length &&
            manageUserData?.map(i => {
              return i.is_operator_user === true ? (
                <div className={newclasses.MainContainer}>
                  <div className={newclasses.ContainerInner}>
                    <p className={newclasses.ListItmes}>
                      {i.name === null || i.name === ""
                        ? "-"
                        : TextClipper(i.name, 15)}
                    </p>
                    <p className={newclasses.ListItmes}>{i.id}</p>
                    <p className={newclasses.ListItmes}>
                      {i.first_name === null || i.first_name === ""
                        ? "-"
                        : TextClipper(i.first_name, 15)}
                    </p>
                    <p className={newclasses.ListItmes}>
                      {i.last_name === null || i.last_name === ""
                        ? "-"
                        : TextClipper(i.last_name, 15)}
                    </p>

                    <MoreDropDown />
                  </div>
                </div>
              ) : null
            })}
        </div>
      ) : null}

      <ViewModal
        signal={openDescModal}
        handleyes={() => setOpenDescModal(false)}
        arrayOfData={arrayOfData}
      />

      <Dialog
        open={userDetailModal}
        // keepMounted
        onClose={() => setUserDetailModal(false)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        overlayStyle={{ backgroundColor: "transparent" }}
        classes={{ paper: userClasses.paper }}
      >
        <div
          className={
            screenSize >= 702 ? userClasses.topDiv : userClasses.modalTopDiv
          }
        >
          <div className={userClasses.LogoWrapper}>
            <img
              src={Logo}
              className={userClasses.Logo}
              style={{ left: "48%" }}
            />
          </div>

          <div
            style={{ cursor: "pointer" }}
            onClick={() => setUserDetailModal(false)}
          >
            <i
              class="fal fa-times fa-lg"
              style={{ position: "absolute", top: "3%", right: "30px" }}
            ></i>
          </div>

          <form onSubmit="">
            <div className={userClasses.majorDiv}>
              <div
                className={
                  screenSize >= 702
                    ? userClasses.flexer
                    : screenSize >= 490
                    ? userClasses.flexerScreen700
                    : userClasses.flexerScreen490
                }
              >
                <span className={userClasses.HorizontalLine}></span>
                <div className={userClasses.each}>
                  <span style={{ fontWeight: 600 }}>USER TYPE</span>
                  <input
                    type="text"
                    placeholder="User Type"
                    className={userClasses.selectCont}
                    value=""
                    onChange=""
                    readOnly
                  />
                </div>
                <div className={userClasses.each}>
                  <span style={{ fontWeight: 600 }}>COURT SYSTEM</span>
                  <input
                    type="text"
                    placeholder="Last"
                    className={userClasses.selectCont}
                    value={currentData.court}
                    onChange=""
                    readOnly
                  />
                </div>
                <div className={userClasses.each}>
                  <span style={{ fontWeight: 600 }}>PAYMENT PLAN</span>
                  <input
                    type="text"
                    placeholder="Last"
                    className={userClasses.selectCont}
                    //value={userData.last_name}
                    // onChange={e => {
                    //   setUserData({ ...userData, last_name: e.target.value })
                    // }}
                    readOnly
                  />
                </div>
                <div className={userClasses.each}>
                  <span style={{ fontWeight: 600 }}>FIRST NAME</span>
                  <input
                    type="text"
                    placeholder="First"
                    className={userClasses.selectCont}
                    value={currentData.first_name}
                    onChange=""
                    readOnly
                  />
                </div>
                <div className={userClasses.each}>
                  <span style={{ fontWeight: 600 }}>MIDDLE NAME</span>
                  <input
                    type="text"
                    placeholder="Middle"
                    className={userClasses.selectCont}
                    value={currentData.middleName}
                    onChange=""
                    readOnly
                  />
                </div>
                <div className={userClasses.each}>
                  <span style={{ fontWeight: 600 }}>LAST NAME</span>
                  <input
                    type="text"
                    placeholder="Last"
                    className={userClasses.selectCont}
                    value={currentData.last_name}
                    onChange=""
                    readOnly
                  />
                </div>
                <div className={userClasses.each}>
                  <span style={{ fontWeight: 600 }}>DATE OF BIRTH</span>
                  <input
                    type="text"
                    placeholder="Type..."
                    className={userClasses.selectCont}
                    value={currentData.date_of_birth}
                    onChange=""
                    readOnly
                  />
                </div>
                <div className={userClasses.each}>
                  <span style={{ fontWeight: 600 }}>PAROLE OFFICER</span>
                  <input
                    type="text"
                    placeholder="Last"
                    className={userClasses.selectCont}
                    value=""
                    onChange=""
                    readOnly
                  />
                </div>
                <div className={userClasses.each}>
                  <span style={{ fontWeight: 600 }}>FULL ADDRESS</span>
                  <input
                    type="text"
                    placeholder="Full address"
                    className={userClasses.selectCont}
                    value={currentData.address}
                    onChange=""
                    readOnly
                  />
                </div>
                <div className={userClasses.each}>
                  <span style={{ fontWeight: 600 }}>EMERGENCY CONTACT</span>
                  <input
                    type="text"
                    placeholder="(000) 000-0000"
                    className={userClasses.selectCont}
                    value={currentData.emergency_contact}
                    onChange=""
                    readOnly
                  />
                </div>
                <div className={userClasses.each}>
                  <span style={{ fontWeight: 600 }}>EMAIL ADDRESS</span>
                  <input
                    type="text"
                    placeholder="user@mail.com"
                    className={userClasses.selectCont}
                    value={currentData.email}
                    onChange=""
                    readOnly
                  />
                </div>
                <div className={userClasses.each}>
                  <span style={{ fontWeight: 600 }}>RESIDENT ADDRESS</span>
                  <input
                    type="text"
                    placeholder="Address Name"
                    className={userClasses.selectCont}
                    value=""
                    onChange=""
                    readOnly
                  />
                </div>
                <div className={userClasses.each}>
                  <span style={{ fontWeight: 600 }}>HOME PHONE</span>
                  <input
                    type="text"
                    placeholder="(000) 000-0000"
                    className={userClasses.selectCont}
                    value={currentData.home_phone}
                    onChange=""
                    readOnly
                  />
                </div>
                <div className={userClasses.each}>
                  <span style={{ fontWeight: 600 }}>CELL PHONE</span>
                  <input
                    type="text"
                    placeholder="(000) 000-0000"
                    className={userClasses.selectCont}
                    value={currentData.phone}
                    onChange=""
                    readOnly
                  />
                </div>
                <div className={userClasses.each}>
                  <span style={{ fontWeight: 600 }}>ALTERNATIVE PHONE</span>
                  <input
                    type="text"
                    placeholder="(000) 000-0000"
                    className={userClasses.selectCont}
                    value={currentData.alt_phone}
                    onChange=""
                    readOnly
                  />
                </div>
                <div className={userClasses.each}>
                  <span style={{ fontWeight: 600 }}>Service</span>
                  <input
                    type="text"
                    placeholder="Service"
                    className={userClasses.selectCont}
                    value={currentData.alt_phone}
                    onChange=""
                    readOnly
                  />
                </div>
              </div>

              {/* <Button
                variant="contained"
                color="secondary"
                className={userClasses.button}
                style={{
                  marginTop: "20px",
                  alignSelf: "center",
                  width: "96.5%"
                }}
                // disabled={isDisabled()}
                type="submit"

                // startIcon={<AddIcon />}
              >
                {"SAVE CHANGES"}
              </Button> */}
            </div>
          </form>
        </div>
      </Dialog>
      <AddCourtDialog
        openModal={openCourtModal}
        closeModal={() => setOpenCourtModal(false)}
        data={dropDownInput}
      />
      <AddOfficerDialog
        openModal={openOfficerModal}
        closeModal={() => setOpenOfficerModal(false)}
        data={dropDownInput}
      />
      <AddPaymentModal
        open={openPaymentModal}
        close={() => setOpenPaymentModal(false)}
        data={dropDownInput}
      />
      <AddServicesDialog
        openModal={openServiceModal}
        closeModal={() => setOpenServiceModal(false)}
        data={dropDownInput}
      />
    </>
  )
}

const mapStateToProps = state => {
  return {
    accessToken: state.auth.accessToken
  }
}

export default connect(mapStateToProps, { auth })(UserDataTable)
