import { createAction } from '@reduxjs/toolkit'
import {
  SalesProxy,
  type CreateSaleRequest,
  type CreateSaleResponse,
} from '../../../services'
import type { Sale } from '../../../types'
import type { AppThunk } from '../../store'
import * as types from './types'

export const loadSalesAttempt = createAction(types.LOAD_SALES_ATTEMPT)
export const loadSalesSuccess = createAction<Sale[]>(types.LOAD_SALES_SUCCESS)
export const loadSalesFailure = createAction<string>(types.LOAD_SALES_FAILURE)
export const createSaleAttempt = createAction(types.CREATE_SALE_ATTEMPT)
export const saleCreated = createAction<CreateSaleResponse>(
  types.CREATE_SALE_SUCCESS,
)
export const createSaleFailure = createAction<string>(types.CREATE_SALE_FAILURE)

export const loadSales = (): AppThunk<Promise<void>> => async (dispatch) => {
  dispatch(loadSalesAttempt())
  try {
    dispatch(loadSalesSuccess(await new SalesProxy().getAll()))
  } catch (error) {
    dispatch(
      loadSalesFailure(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar las ventas.',
      ),
    )
  }
}

export const createSale =
  (request: CreateSaleRequest): AppThunk<Promise<Sale>> =>
  async (dispatch) => {
    dispatch(createSaleAttempt())
    try {
      const result = await new SalesProxy().post(request)
      dispatch(saleCreated(result))
      return result.sale
    } catch (error) {
      dispatch(
        createSaleFailure(
          error instanceof Error
            ? error.message
            : 'No se pudo registrar la venta.',
        ),
      )
      throw error
    }
  }
