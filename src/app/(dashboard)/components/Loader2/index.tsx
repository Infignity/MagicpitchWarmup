import React from 'react'
import styles from "./styles.module.css"

const Loader2 = () => {
  return (
    <div className='relative h-full w-full flex justify-center items-center p-3'>
      <svg className={styles.spinner} viewBox="0 0 50 50">
        <circle className={styles.path} cx="25" cy="25" r="15" fill="none" strokeWidth="5"></circle>
      </svg>
    </div>
  )
}

export default Loader2
