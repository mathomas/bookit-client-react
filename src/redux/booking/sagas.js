import { call, fork, race, take, put } from 'redux-saga/effects'

export function* doSomething(action) {
  yield call(console.log, 'GOT ACTION:', action)
}

export function* watchForCreateBooking() {
  while (true) {
    yield take('CREATE_BOOKING_PENDING')
    yield put({ type: 'CLEAR_ERRORS' })
    const { failure, success } = yield race({
      failure: take('CREATE_BOOKING_FAILURE'),
      success: take('CREATE_BOOKING_SUCCESS'),
    })

    if (success) {
      yield call(doSomething, success)
    }

    if (failure) {
      yield put({ type: 'APPEND_ERROR', payload: failure.payload })
      yield call(doSomething, failure)
    }
  }
}

export const sagas = function* bookingSagas() {
  yield fork(watchForCreateBooking)
}