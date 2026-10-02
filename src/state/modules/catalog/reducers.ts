import { createReducer } from '@reduxjs/toolkit'
import type { Branch, Product } from '../../../types'
import { saleCreated } from '../sales/actions'
import {
  createProductAttempt,
  createProductFailure,
  createProductSuccess,
  loadCatalogAttempt,
  loadCatalogFailure,
  loadCatalogSuccess,
} from './actions'

interface CatalogState {
  branches: Branch[]
  products: Product[]
  pending: boolean
  saving: boolean
  saveError: string | null
  loaded: boolean
  error: string | null
}

const initialState: CatalogState = {
  branches: [],
  products: [],
  pending: false,
  saving: false,
  saveError: null,
  loaded: false,
  error: null,
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(createProductAttempt, (state) => {
      state.saving = true
      state.saveError = null
    })
    .addCase(createProductSuccess, (state, action) => {
      state.products.push(action.payload)
      state.saving = false
    })
    .addCase(createProductFailure, (state, action) => {
      state.saving = false
      state.saveError = action.payload
    })
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
