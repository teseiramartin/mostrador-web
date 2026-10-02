import { createReducer } from '@reduxjs/toolkit'
import type { Client } from '../../../types'
import {
  createClientAttempt,
  createClientFailure,
  createClientSuccess,
  loadClientsAttempt,
  loadClientsFailure,
  loadClientsSuccess,
} from './actions'

interface ClientsState {
  items: Client[]
  pending: boolean
  saving: boolean
  error: string | null
  saveError: string | null
}

const initialState: ClientsState = {
  items: [],
  pending: false,
  saving: false,
  error: null,
  saveError: null,
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(loadClientsAttempt, (state) => {
      state.pending = true
      state.error = null
    })
    .addCase(loadClientsSuccess, (state, action) => {
      state.items = action.payload
      state.pending = false
    })
    .addCase(loadClientsFailure, (state, action) => {
      state.pending = false
      state.error = action.payload
    })
    .addCase(createClientAttempt, (state) => {
      state.saving = true
      state.saveError = null
    })
    .addCase(createClientSuccess, (state, action) => {
      state.items.push(action.payload)
      state.saving = false
    })
    .addCase(createClientFailure, (state, action) => {
      state.saving = false
      state.saveError = action.payload
    })
})
