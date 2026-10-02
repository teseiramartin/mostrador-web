import { createAction } from '@reduxjs/toolkit'
import type { Role } from '../../../types'
import * as types from './types'

export const setRole = createAction<Role>(types.SET_ROLE)
export const setBranch = createAction<string>(types.SET_BRANCH)
