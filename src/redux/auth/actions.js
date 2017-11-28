import { createAction } from 'redux-actions'

export const loginRequest = createAction('LOGIN_REQUEST')
export const loginSuccess = createAction('LOGIN_SUCCESS')

export const refreshAuthSuccess = createAction('REFRESH_AUTH_SUCCESS')

export const actionCreators = {
  loginRequest,
  loginSuccess,
  refreshAuthSuccess,
}
