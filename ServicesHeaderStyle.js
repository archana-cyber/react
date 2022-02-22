import { makeStyles } from "@material-ui/core/styles";


export const useStyles = makeStyles((theme) => ({
  MainContainer: {
    width: "100%",
    height: 97,
    background: "#FFFFFF",
    boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.25)",
    display:'flex',
    flexDirection:'column',
    justifyContent:'space-around'
  },
  HeaderInner: {
    padding: "2px 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },

  IconWrapper: {
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#81A4FF",
    margin: "0px 20px",
    width: 47,
    height: 44,
  },
  icon: {
    width: 24,
    height: 24
  },
  MainHeading: {
    color: "#363E51",
    fontFamily: theme.fonts.family.Medium,
    fontSize: theme.fonts.sizes.fontXL,
    fontWeight: 500,
    textTransform: "uppercase"
  },
  Wrapper: {
    display: "flex",
    alignItems: "center",
  },
  
}));
