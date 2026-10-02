import { configureStore, type Action, type ThunkAction } from '@reduxjs/toolkit'
import catalog from './modules/catalog'
import sales from './modules/sales'
import session from './modules/session'

export const store = configureStore({ reducer: { catalog, sales, session } })
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<Return = void> = ThunkAction<
  Return,
  RootState,
  unknown,
  Action
>
