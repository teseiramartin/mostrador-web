import { createReducer } from '@reduxjs/toolkit'
import type { Branch, Product } from '../../../types'
import { saleCreated } from '../sales/actions'
import {
  loadCatalogAttempt,
  loadCatalogFailure,
  loadCatalogSuccess,
} from './actions'

interface CatalogState {
  branches: Branch[]
  products: Product[]
  pending: boolean
  loaded: boolean
  error: string | null
}

const initialState: CatalogState = {
  branches: [],
  products: [],
  pending: false,
  loaded: false,
  error: null,
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(loadCatalogAttempt, (state) => {
      state.pending = true
      state.error = null
    })
    .addCase(loadCatalogSuccess, (state, action) => {
      state.branches = action.payload.branches
      state.products = action.payload.products
      state.pending = false
      state.loaded = true
      state.error = null
    })
    .addCase(loadCatalogFailure, (state, action) => {
      state.pending = false
      state.error = action.payload
    })
    .addCase(saleCreated, (state, action) => {
      for (const updated of action.payload.updatedProducts) {
        const index = state.products.findIndex(
          (product) => product.id === updated.id,
        )
        if (index !== -1) state.products[index] = updated
      }
    })
})
