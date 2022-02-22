import React, { useState, useEffect } from "react"
import { useStyles } from "./CourtsDataTableStyle"
import { DataArray } from "./DataTableArray"
import MoreDropDown from "../MoreDropDown/MoreDropDown"
import { useHistory } from "react-router"
import { connect, useDispatch } from "react-redux"
import { auth } from "../../Store/Actions/Auth"
import axios from "../../Store/request"
import ConfirmModal from "../ConfirmModal/ConfirmModal"
import ViewModal from "../ViewModal/ViewModal"
import { Button, Dialog } from "@material-ui/core"
import useToast from "../../Components/Toast/useToast"

const BasicTable = props => {
  const classes = useStyles()
  const { showToast } = useToast()
  const [pricingArray, setPricingArray] = useState([])
  const [currentData, setCurrentData] = useState({})
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [arrayOfData, setArrayOfData] = useState([])
  const [openEditModal, setOpenEditModal] = useState(false)
  const [USstates, setUSStates] = useState([
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI"
  ])

  useEffect(() => {
    axios
      .get("/api/v1/courts/")
      .then(function (response) {
        console.log(response.data)
        setPricingArray(response.data.results)
      })
      .catch(function (error) {
        console.log(error)
        setPricingArray([])
      })
  }, [])

  const deleteCourt = () => {
    axios
      .delete(`/api/v1/courts/${currentData.id}/`)
      .then(function (response) {
        console.log(response)
        setOpenConfirmModal(false)
        showToast("Court Deleted Succesfully", "success")
      })
      .catch(function (error) {
        console.log(error)
        setOpenConfirmModal(false)
        showToast("Unable to delete, please try again later", "error")
      })
  }

  const EditCourt = e => {
    e.preventDefault()

    let trueData = currentData

    if (currentData.address_2 === "" || currentData.address_2 === null) {
      console.log("here")

      trueData = { ...currentData, address_2: "-" }
    }
    let data = JSON.stringify(trueData)
    console.log(data)
    axios
      .put(`/api/v1/courts/${currentData.id}/`, data)
      .then(function (response) {
        console.log(response)
        setOpenEditModal(false)
        setCurrentData({})
        showToast("Court Edited Succesfully", "success")
      })
      .catch(function (error) {
        console.log(error)
        setOpenEditModal(false)
        setCurrentData({})
        showToast("Unable to edit please try again later", "error")
      })
  }

  console.log(pricingArray)

  const TextClipper = (bio, length) => {
    let vb = ""
    if (bio.length >= length) {
      for (var i = 0; i < length; i++) {
        vb += bio.charAt(i)
      }
      bio = `${vb}...`

      console.log(vb)
    }

    return bio
  }

  return (
    <div className={classes.Container} style={{ minHeight: "650px" }}>
      <div className={classes.TableHeading}>
        <div className={classes.HeadingInner}>
          <p className={classes.Heading1}>Court name</p>
          <p></p>
          <p className={classes.Heading}>Address 1</p>
          <p className={classes.Heading}>Address 2</p>
          <p className={classes.Heading}>City</p>
          <p className={classes.Heading}> State</p>
          <p className={classes.Heading}> ZIP Code </p>
          <p className={classes.Heading}>Territory</p>

          <p></p>
        </div>
      </div>
      {props.DataArray.map(i => {
        return (
          <div className={classes.MainContainer}>
            <div className={classes.ContainerInner}>
              <p className={classes.ListItmes}>{TextClipper(i.name, 15)}</p>
              <p className={classes.ListItmes}>
                {TextClipper(i.address_1, 15)}
              </p>
              <p className={classes.ListItmes}>
                {TextClipper(i.address_2, 15)}
              </p>
              <p className={classes.ListItmes}>{TextClipper(i.city, 15)}</p>
              <p className={classes.ListItmes}>{TextClipper(i.state, 15)}</p>
              <p className={classes.ListItmes}>
                {TextClipper(i.postal_code, 15)}
              </p>
              <p className={classes.ListItmes}>{TextClipper(i.state, 15)}</p>

              <MoreDropDown
                courtView={() => {
                  setArrayOfData([
                    {
                      title: "Court Name",
                      val: i.name
                    },
                    {
                      title: "City",
                      val: i.city
                    },
                    {
                      title: "Address 1",
                      val: i.address_1
                    },
                    {
                      title: "Address 2",
                      val: i.address_2
                    },
                    {
                      title: "Territory",
                      val: i.state
                    },
                    {
                      title: "State",
                      val: i.state
                    },
                    {
                      title: "ZIP Code",
                      val: i.postal_code
                    }
                  ])
                  setCurrentData(i)
                  setOpenViewModal(true)
                }}
                courtDelete={() => {
                  setCurrentData(i)
                  setOpenConfirmModal(true)
                }}
                courtEdit={() => {
                  setCurrentData(i)
                  setOpenEditModal(true)
                }}
              />
            </div>
          </div>
        )
      })}

      <ConfirmModal
        signal={openConfirmModal}
        handleyes={deleteCourt}
        handleno={() => setOpenConfirmModal(false)}
        msg={`Are you sure you want to delete court "${currentData.name}"?, this will also delete any officer or pricing associated with it`}
      />

      <ViewModal
        signal={openViewModal}
        handleyes={() => setOpenViewModal(false)}
        arrayOfData={arrayOfData}
      />

      <Dialog
        open={openEditModal}
        keepMounted
        onClose={() => setOpenEditModal(false)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        overlayStyle={{ backgroundColor: "transparent" }}
      >
        <div className={classes.topDiv}>
          {/*<div className={classes.LogoWrapper}>
          <img src={Logo} className={classes.Logo} />
    </div>*/}
          <p
            style={{
              position: "absolute",
              top: "5%",
              left: "40%",
              fontSize: "20px",
              fontWeight: "700"
            }}
          >
            Edit Court
          </p>
          <form onSubmit={EditCourt} className={classes.upperDiv}>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => setOpenEditModal(false)}
            >
              <i
                class="fal fa-times fa-lg"
                style={{ position: "absolute", top: "3%", right: "4%" }}
              ></i>
            </div>

            <div className={classes.firstDiv}>
              <p style={{ fontWeight: 600 }}>Court Name</p>
              <input
                type="text"
                placeholder={currentData.name}
                className={classes.selectCont}
                value={currentData.name}
                onChange={e => {
                  setCurrentData({ ...currentData, name: e.target.value })
                }}
                required
              />
            </div>
            <div className={classes.firstDiv}>
              <p style={{ fontWeight: 600 }}>City</p>
              <input
                type="text"
                placeholder={currentData.city}
                className={classes.selectCont}
                value={currentData.city}
                onChange={e => {
                  setCurrentData({ ...currentData, city: e.target.value })
                }}
                required
              />
            </div>
            <div className={classes.firstDiv}>
              <p style={{ fontWeight: 600 }}>Address 1</p>
              <input
                type="text"
                placeholder={currentData.address_1}
                className={classes.selectCont}
                value={currentData.address_1}
                onChange={e => {
                  setCurrentData({ ...currentData, address_1: e.target.value })
                }}
                required
              />
            </div>
            <div className={classes.firstDiv}>
              <p style={{ fontWeight: 600 }}>Address 2</p>
              <input
                type="text"
                placeholder={currentData.address_2}
                className={classes.selectCont}
                value={currentData.address_2}
                onChange={e => {
                  setCurrentData({ ...currentData, address_2: e.target.value })
                }}
              />
            </div>
            <div className={classes.firstDiv}>
              <p style={{ fontWeight: 600 }}>STATE</p>
              <select
                className={classes.selectCont}
                onChange={e => {
                  setCurrentData({ ...currentData, state: e.target.value })
                }}
                required
                name="courtTypes"
              >
                {USstates.map(dataObj => {
                  return <option value={dataObj}>{dataObj}</option>
                })}
              </select>
            </div>
            <div className={classes.firstDiv}>
              <p style={{ fontWeight: 600 }}>ZIP Code</p>
              <input
                type="text"
                placeholder={currentData.postal_code}
                className={classes.selectCont}
                value={currentData.postal_code}
                onChange={e => {
                  setCurrentData({
                    ...currentData,
                    postal_code: e.target.value
                  })
                }}
                required
              />
            </div>

            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              disabled={
                currentData.name === "" ||
                currentData.city === "" ||
                currentData.address_1 === "" ||
                currentData.state === "" ||
                currentData.postal_code === ""
              }
              type="submit"

              // startIcon={<AddIcon />}
            >
              {"SAVE COURT"}
            </Button>
          </form>
        </div>
      </Dialog>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    accessToken: state.auth.accessToken
  }
}

export default connect(mapStateToProps, { auth })(BasicTable)
