import { Fragment } from "react"
import { Outlet } from "react-router-dom"

const BlankLayout = () => {
  return (

    <Fragment>
      <div className="container-fluid">
        <Outlet />
      </div>
    </Fragment >
  )
}

export default BlankLayout
