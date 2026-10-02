import { createAction } from '@reduxjs/toolkit'
import { ClientsProxy } from '../../../services'
import type { CreateClientRequest } from '../../../services/types'
import type { Client } from '../../../types'
import type { AppThunk } from '../../store'
import * as types from './types'

export const loadClientsAttempt = createAction(types.LOAD_CLIENTS_ATTEMPT)
export const loadClientsSuccess = createAction<Client[]>(
  types.LOAD_CLIENTS_SUCCESS,
)
export const loadClientsFailure = createAction<string>(
  types.LOAD_CLIENTS_FAILURE,
)
export const createClientAttempt = createAction(types.CREATE_CLIENT_ATTEMPT)
export const createClientSuccess = createAction<Client>(
  types.CREATE_CLIENT_SUCCESS,
)
export const createClientFailure = createAction<string>(
  types.CREATE_CLIENT_FAILURE,
)

export const loadClients = (): AppThunk<Promise<void>> => async (dispatch) => {
  dispatch(loadClientsAttempt())
  try {
    dispatch(loadClientsSuccess(await new ClientsProxy().getAll()))
  } catch (error) {
    dispatch(
      loadClientsFailure(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar los clientes.',
      ),
    )
  }
}

export const createClient =
  (request: CreateClientRequest): AppThunk<Promise<Client>> =>
  async (dispatch) => {
    dispatch(createClientAttempt())
    try {
      const client = await new ClientsProxy().post(request)
      dispatch(createClientSuccess(client))
      return client
    } catch (error) {
      dispatch(
        createClientFailure(
          error instanceof Error
            ? error.message
            : 'No se pudo crear el cliente.',
        ),
      )
      throw error
    }
  }
