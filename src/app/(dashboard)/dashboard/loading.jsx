import React from 'react'
import styles from "../dashboard/page.module.scss"
import { SpinnerDiamond } from 'spinners-react'

function loading() {
  return (
    <div className={styles.loader}>
      <SpinnerDiamond size={100} thickness={100} speed={100} color="rgba(255, 255, 255, 1)" secondaryColor="rgba(74, 172, 57, 1)" />
      <p>loading Roggers Portfolio ...</p>
    </div>
  )
}

export default loading