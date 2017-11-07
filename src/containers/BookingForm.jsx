import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Link } from 'react-router-dom'

import { Field, reduxForm, isSubmitting, formValueSelector, getFormInitialValues } from 'redux-form'

import Moment from 'moment-timezone'

import { actionCreators } from 'Redux'
import { BookingSelectors } from 'Redux/booking'
import { AppSelectors } from 'Redux/app'

import Button from 'Components/Button'

import styles from 'Styles/form.scss'

const required = value => (value ? undefined : 'Required')

const endAfterStart = (value, {start}) => {
  try {
    if (Moment(value).isBefore(start)) {
      return 'End must be after start'
    }
  }
  catch (error) { } // eslint-disable-line
}

const startBeforeEnd = (value, {end}) => {
  try {
    if (Moment(value).isAfter(end)) {
      return 'Start must be before end'
    }
  }
  catch (error) { } // eslint-disable-line
}

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} placeholder={label} type={type} />
      {touched &&
        ((error && <span className={styles.errorSpan}>{error}</span>) ||
          (warning && <span>{warning}</span>))}
    </div>
  </div>
)

renderField.propTypes = {
  input: PropTypes.any,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
}

const renderSuccessMessage = bookingId => <h1>Booking Created with booking ID {bookingId}!</h1>
const renderErrorMessages = errors => <h1>Booking Failed: {errors.map((error, index) => <p key={index}>{error}</p>)}</h1>

export class BookingForm extends React.Component {
  componentDidMount() {
    const values = {
      bookableId: 1,
      end: Moment().tz('America/New_York').add(2, 'hours').format('YYYY-MM-DDTHH:mm'),
      start: Moment().tz('America/New_York').add(1, 'hours').format('YYYY-MM-DDTHH:mm'),
    }
    this.props.initialize(values)
    this.props.getBookablesForLocation(1)
  }

  render() {
    const { handleSubmit, createBooking, submitting, bookingInstanceId, pristine, invalid, errorMessages, setBookablesVisible, bookable } = this.props

    let bookableLabel = ''
    if (bookable) {
      bookableLabel = `${bookable.get('name')} Room`
    }

    return (
      <div className={styles.bookingForm}>
        <div className={styles.heading}>
          <h2 className={styles.title}>Book A Room</h2>
          <Link to="/" className={styles.cancel}>X</Link>
        </div>
        <form onSubmit={ handleSubmit(createBooking) }>
          <Field name="start" component={ renderField } label="Start" type="text" validate={[required, startBeforeEnd]} />
          <Field name="end" component={ renderField } label="End" type="text" validate={[required, endAfterStart]} />
          <a href="#" onClick={(event) => {
            event.preventDefault()
            setBookablesVisible(true)}}>Rooms</a>
          <Field name="bookableId" component={ renderField } type="hidden" label={bookableLabel} />
          <Field name="subject" component={ renderField } label="Event Name" type="text" validate={required} />
          <Button type="submit" disabled={ pristine || submitting || invalid } id="bookit" className={styles.submitButton}>
            BookIt
          </Button>
        </form>
        { bookingInstanceId && renderSuccessMessage(bookingInstanceId) }
        { errorMessages && renderErrorMessages(errorMessages) }
      </div>
    )
  }
}

BookingForm.propTypes = {
  handleSubmit: PropTypes.func,
  createBooking: PropTypes.func,
  getBookablesForLocation: PropTypes.func,
  submitting: PropTypes.bool,
  bookingInstanceId: PropTypes.number,
  initialize: PropTypes.func,
  pristine: PropTypes.bool,
  invalid: PropTypes.bool,
  errorMessages: PropTypes.arrayOf(PropTypes.string),
  setBookablesVisible: PropTypes.func,
  bookable: PropTypes.any,
}

const mapStateToProps = (state) => {
  const bookableId = formValueSelector('booking')(state, 'bookableId')
  const formValues = getFormInitialValues('booking')(state)
  const bookable = BookingSelectors.getBookableEntity(state, bookableId)
  return {
    formValues,
    bookingInstanceId: BookingSelectors.getBookingInstanceId(state),
    errorMessages: AppSelectors.getErrorMessages(state),
    bookable,
    submitting: isSubmitting('booking')(state),
  }
}

const formed = reduxForm({ form: 'booking' })(BookingForm)

const connected = connect(
  mapStateToProps,
  {
    createBooking: actionCreators.createBooking,
    getBookablesForLocation: actionCreators.getBookablesForLocation,
  }
)(formed)

export default connected
