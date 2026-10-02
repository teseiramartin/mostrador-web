import { configureStore, type Action, type ThunkAction } from '@reduxjs/toolkit'
import catalog from './modules/catalog'
import clients from './modules/clients'
import sales from './modules/sales'
import session from './modules/session'

export const store = configureStore({
  reducer: { catalog, clients, sales, session },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<Return = void> = ThunkAction<
  Return,
  RootState,
  unknown,
  Action
>
