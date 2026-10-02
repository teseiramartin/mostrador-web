import { createAction } from '@reduxjs/toolkit'
import { BranchesProxy, ProductsProxy } from '../../../services'
import type { Branch, Product } from '../../../types'
import type { CreateProductRequest } from '../../../services/types'
import type { AppThunk } from '../../store'
import * as types from './types'

export const loadCatalogAttempt = createAction(types.LOAD_CATALOG_ATTEMPT)
export const loadCatalogSuccess = createAction<{
  branches: Branch[]
  products: Product[]
}>(types.LOAD_CATALOG_SUCCESS)
export const loadCatalogFailure = createAction<string>(
  types.LOAD_CATALOG_FAILURE,
)
export const createProductAttempt = createAction(types.CREATE_PRODUCT_ATTEMPT)
export const createProductSuccess = createAction<Product>(
  types.CREATE_PRODUCT_SUCCESS,
)
export const createProductFailure = createAction<string>(
  types.CREATE_PRODUCT_FAILURE,
)

export const createProduct =
  (payload: CreateProductRequest): AppThunk<Promise<Product>> =>
  async (dispatch) => {
    dispatch(createProductAttempt())
    try {
      const product = await new ProductsProxy().post(payload)
      dispatch(createProductSuccess(product))
      return product
    } catch (error) {
      dispatch(
        createProductFailure(
          error instanceof Error
            ? error.message
            : 'No se pudo crear el producto.',
        ),
      )
      throw error
    }
  }

export const loadCatalog = (): AppThunk<Promise<void>> => async (dispatch) => {
  dispatch(loadCatalogAttempt())
  try {
    const [branches, products] = await Promise.all([
      new BranchesProxy().getAll(),
      new ProductsProxy().getAll(),
    ])
    dispatch(loadCatalogSuccess({ branches, products }))
  } catch (error) {
    dispatch(
      loadCatalogFailure(
        error instanceof Error
          ? error.message
          : 'No se pudo cargar el catálogo.',
      ),
    )
  }
}
