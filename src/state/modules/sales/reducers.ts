import { createReducer } from '@reduxjs/toolkit'
import type { Sale } from '../../../types'
import {
  createSaleAttempt,
  createSaleFailure,
  loadSalesAttempt,
  loadSalesFailure,
  loadSalesSuccess,
  saleCreated,
} from './actions'

interface SalesState {
  items: Sale[]
  pending: boolean
  pendingCreate: boolean
  loaded: boolean
  error: string | null
}

const initialState: SalesState = {
  items: [],
  pending: false,
  pendingCreate: false,
  loaded: false,
  error: null,
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(loadSalesAttempt, (state) => {
      state.pending = true
      state.error = null
    })
    .addCase(loadSalesSuccess, (state, action) => {
      state.items = action.payload
      state.pending = false
      state.loaded = true
      state.error = null
    })
    .addCase(loadSalesFailure, (state, action) => {
      state.pending = false
      state.error = action.payload
    })
    .addCase(createSaleAttempt, (state) => {
      state.pendingCreate = true
      state.error = null
    })
    .addCase(saleCreated, (state, action) => {
      state.items.unshift(action.payload.sale)
      state.pendingCreate = false
      state.error = null
    })
    .addCase(createSaleFailure, (state, action) => {
      state.pendingCreate = false
      state.error = action.payload
    })
})
