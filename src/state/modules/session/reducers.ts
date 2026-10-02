import { createReducer } from '@reduxjs/toolkit'
import type { Role } from '../../../types'
import { setBranch, setRole } from './actions'

interface SessionState {
  role: Role
  branchId: string
}
const initialState: SessionState = { role: 'owner', branchId: 'all' }

export default createReducer(initialState, (builder) => {
  builder
    .addCase(setRole, (state, action) => {
      state.role = action.payload
      state.branchId = action.payload === 'owner' ? 'all' : 'centro'
    })
    .addCase(setBranch, (state, action) => {
      if (state.role === 'owner') state.branchId = action.payload
    })
})
