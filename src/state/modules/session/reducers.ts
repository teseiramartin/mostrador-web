import { createReducer } from '@reduxjs/toolkit'
import type { Role, User } from '../../../types'
import {
  loginAttempt,
  loginFailure,
  loginSuccess,
  logout,
  setBranch,
} from './actions'

interface SessionState {
  user: User | null
  role: Role
  branchId: string
  pending: boolean
  error: string | null
}
const initialState: SessionState = {
  user: null,
  role: 'owner',
  branchId: 'all',
  pending: false,
  error: null,
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(loginAttempt, (state) => {
      state.pending = true
      state.error = null
    })
    .addCase(loginSuccess, (state, action) => {
      state.user = action.payload
      state.role = action.payload.role
      state.branchId =
        action.payload.role === 'owner'
          ? 'all'
          : (action.payload.branchId ?? 'centro')
      state.pending = false
      state.error = null
    })
    .addCase(loginFailure, (state, action) => {
      state.pending = false
      state.error = action.payload
    })
    .addCase(logout, () => initialState)
    .addCase(setBranch, (state, action) => {
      if (state.role === 'owner') state.branchId = action.payload
    })
})
