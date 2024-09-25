import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { handleError, post } from 'data/fetchers'
import type { ResponseError } from 'types'
import { apiKeysKeys } from './keys'

export type APIKeyCreateVariables = {
  ref: string
  description: string
} & (
  | {
      type: 'publishable'
    }
  | {
      type: 'secret'
      secret_jwt_template?: {
        role: string
      }
    }
)

export async function createAPIKey(payload: APIKeyCreateVariables) {
  const { data, error } = await post('/v1/projects/{ref}/api-keys', {
    params: { path: { ref: payload.ref } },
    body:
      payload.type === 'secret'
        ? {
            type: payload.type,
            description: payload.description || null,
            secret_jwt_template: payload.secret_jwt_template || null,
          }
        : {
            type: payload.type,
            description: payload.description || null,
          },
  })

  if (error) handleError(error)
  return data
}

type APIKeyCreateData = Awaited<ReturnType<typeof createAPIKey>>

export const useCreateAPIKeyMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<APIKeyCreateData, ResponseError, APIKeyCreateVariables>,
  'mutationFn'
> = {}) => {
  const queryClient = useQueryClient()

  return useMutation<APIKeyCreateData, ResponseError, APIKeyCreateVariables>(
    (vars) => createAPIKey(vars),
    {
      async onSuccess(data, variables, context) {
        const { projectRef } = variables

        await queryClient.invalidateQueries(apiKeysKeys.list(projectRef))

        await onSuccess?.(data, variables, context)
      },
      async onError(data, variables, context) {
        if (onError === undefined) {
          toast.error(`Failed to mutate: ${data.message}`)
        } else {
          onError(data, variables, context)
        }
      },
      ...options,
    }
  )
}
