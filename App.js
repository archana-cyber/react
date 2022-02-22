import React, { useState, useEffect } from "react"
import { ThemeProvider } from "@material-ui/core/styles"
import theme from "../src/Theme/theme"
import Routes from "../src/Routes/Routes"
import ResponsiveRoutes from "../src/Routes/ResponsiveRoutes"
import { Provider } from "react-redux"
import ConfigureStore from "../src/Store/Store"
import { ScreenContext } from "./context/context"
import { ReportProvider } from "./context/ReportContext"
import { useLocation } from "react-router"
import Toast from "./Components/Toast"
import { ToastProvider } from "./Components/Toast/useToast"
const { store } = ConfigureStore()

const App = () => {
  const [location, setLocation] = useState("")
  const [screenSize, setScreenSize] = useState(window.innerWidth)

  useEffect(() => {
    setScreenSize(window.innerWidth)
  }, [screenSize])

  const changed = () => {
    setScreenSize(window.innerWidth)
  }

  window.addEventListener("resize", changed)

  return (
    <Provider store={store}>
      <ReportProvider>
        <ScreenContext.Provider value={{ screenSize, setScreenSize }}>
          <ThemeProvider theme={theme}>
            <ToastProvider>
              <Toast />
              {screenSize < 800 ? <ResponsiveRoutes /> : <Routes />}
            </ToastProvider>
          </ThemeProvider>
        </ScreenContext.Provider>
      </ReportProvider>
    </Provider>
  )
}

export default App
