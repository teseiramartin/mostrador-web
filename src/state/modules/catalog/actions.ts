import { createAction } from '@reduxjs/toolkit'
import { BranchesProxy, ProductsProxy } from '../../../services'
import type { Branch, Product } from '../../../types'
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
