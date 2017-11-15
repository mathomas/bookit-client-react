import React from 'react'
import PropTypes from 'prop-types'

import { formatTime } from 'Utils'

import styles from 'Styles/booking-item.scss'

export const BaseBookingItem = ({ id, subject, start, end, bookableName }) => {
  return (
    <div className={styles.bookingItem} id={ `booking-${id}` }>
      <p>{ formatTime(start) } - { formatTime(end) }</p>
      <p>{ subject }</p>
      <h3>{ bookableName } Room</h3>
    </div>
  )
}

BaseBookingItem.propTypes = {
  id: PropTypes.number,
  subject: PropTypes.string,
  start: PropTypes.string,
  end: PropTypes.string,
  bookableName: PropTypes.string,
}

export default BaseBookingItem
