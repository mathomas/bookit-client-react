import { RootState } from 'Redux'

export const getBookingStatus = (state: RootState) => state.booking.bookingStatus
export const getBookingInstance = (state: RootState) => state.booking.instance