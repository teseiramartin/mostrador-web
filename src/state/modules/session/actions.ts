import { createAction } from '@reduxjs/toolkit'
import { AuthProxy } from '../../../services'
import type { LoginRequest } from '../../../services/types'
import type { User } from '../../../types'
import type { AppThunk } from '../../store'
import * as types from './types'

export const setBranch = createAction<string>(types.SET_BRANCH)
export const loginAttempt = createAction(types.LOGIN_ATTEMPT)
export const loginSuccess = createAction<User>(types.LOGIN_SUCCESS)
export const loginFailure = createAction<string>(types.LOGIN_FAILURE)
export const logout = createAction(types.LOGOUT)

export const login =
  (credentials: LoginRequest): AppThunk<Promise<void>> =>
  async (dispatch) => {
    dispatch(loginAttempt())
    try {
      const user = await new AuthProxy().login(credentials)
      dispatch(loginSuccess(user))
    } catch (error) {
      dispatch(
        loginFailure(
          error instanceof Error ? error.message : 'No se pudo iniciar sesión.',
        ),
      )
      throw error
    }
  }
