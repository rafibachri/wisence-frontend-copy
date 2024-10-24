import { Fragment } from "react";

const LayoutWrapper = (props) => {
  const { children } = props;

  return (
    <Fragment>
      {children}
    </Fragment>
  )
}

export default LayoutWrapper