import React, { useState, useEffect, useContext } from "react"
import ServicesIcon from "../../assets/ServicesIcon.png"
import AddButton from "../Buttons/AddButton"
import { useStyles } from "./ServicesHeaderStyle"
import { connect, useDispatch } from "react-redux"
import { auth } from "../../Store/Actions/Auth"
import { barStyles } from "../SearchBar/SearchBarStyle"
import SearchIcon from "@material-ui/icons/Search"
import InputBase from "@material-ui/core/InputBase"
import { ScreenContext } from "./../../context/context"
import { finalStyles } from "./../CourtsHeader/CourtsHeaderStyle"

import AddServicesDialog from "../AddServicesDialog/AddServicesDialog"

const ServicesHeader = props => {
  const classes = useStyles()
 
  const barclasses = barStyles() 
  const [openAddModal, setOpenAddModal] = useState(false)
 

  const finalclasses = finalStyles()
  const { screenSize, setScreenSize } = useContext(ScreenContext)

  useEffect(() => {
    setScreenSize(window.innerWidth)
  }, [screenSize])


  return (
    <div
      className={
        screenSize > 800 ? classes.MainContainer : finalclasses.MainCont
      }
    >
      {screenSize > 800 ? (
        <div className={classes.HeaderInner}>
          <div className={classes.Wrapper}>
            <div className={classes.IconWrapper}>
              <img src={ServicesIcon} className={classes.icon} />
            </div>
            <p className={classes.MainHeading}>Services management</p>
            <div onClick={() => setOpenAddModal(true)}>
              <AddButton lable="+ Add service" />
            </div>
          </div>
          <div className={barclasses.SearchContainer}>
            <div className={barclasses.search}>
              <div className={barclasses.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: barclasses.inputRoot,
                  input: barclasses.inputInput
                }}
                inputProps={{ "aria-label": "search" }}
                onChange={props.searchText}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={finalclasses.topMain}>
          <div className={finalclasses.upperMain}>
            <div className={finalclasses.flex}>
              <div className={classes.IconWrapper} style={{ width: "57px" }}>
                <img src={ServicesIcon} className={classes.icon} alt="" />
              </div>
              <p className={classes.MainHeading} style={{ fontSize: "12px" }}>
                Services Management
              </p>
            </div>
            <div className={barclasses.SearchContainer}>
              <div className={barclasses.search}>
                <div className={barclasses.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search…"
                  classes={{
                    root: barclasses.inputRoot,
                    input: barclasses.inputInput
                  }}
                  inputProps={{ "aria-label": "search" }}
                  onChange={props.searchText}
                />
              </div>
            </div>
          </div>

          <div className={finalclasses.bottomCont}>
            <div onClick={() => setOpenAddModal(true)}>
              <AddButton lable="+ Add service" />
            </div>
          </div>
        </div>
      )}
       <AddServicesDialog openModal={openAddModal} closeModal={() => setOpenAddModal(false)} />
      
    </div>
  )
}

const mapStateToProps = state => {
  return {
    accessToken: state.auth.accessToken
  }
}

export default connect(mapStateToProps, { auth })(ServicesHeader)
