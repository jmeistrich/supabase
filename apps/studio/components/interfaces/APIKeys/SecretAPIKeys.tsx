import { useMemo } from 'react'

import { useParams } from 'common'
import {
  useIsProjectActive,
  useProjectContext,
} from 'components/layouts/ProjectLayout/ProjectContext'
import { useProjectApiQuery } from 'data/config/project-api-query'
import { useCheckPermissions } from 'hooks/misc/useCheckPermissions'
import { AlertDescription_Shadcn_, Alert_Shadcn_, Button } from 'ui'
import { GenericSkeletonLoader } from 'ui-patterns'

import Table from 'components/to-be-cleaned/Table'
import { FormHeader } from 'components/ui/Forms/FormHeader'
import NoPermission from 'components/ui/NoPermission'
import Panel from 'components/ui/Panel'

import CreateSecretAPIKeyModal from './CreateSecretAPIKeyModal'

import { useAPIKeysQuery } from 'data/api-keys/api-keys-query'

const SecretAPIKeys = () => {
  const { ref: projectRef } = useParams()
  const isProjectActive = useIsProjectActive()
  const { project, isLoading: projectIsLoading } = useProjectContext()

  const { data: projectAPI } = useProjectApiQuery({ projectRef: projectRef })

  const { data: apiKeysData } = useAPIKeysQuery({ ref: projectRef })

  const secretApiKeys = useMemo(
    () => apiKeysData?.filter(({ type }) => type === 'secret') ?? [],
    [apiKeysData]
  )

  return (
    <div>
      <FormHeader
        title="Secret API keys"
        description="These API keys allow privileged access to your project's APIs. Use in servers, functions, workers or other backend components of your application. Keep secret and never publish."
        actions={<CreateSecretAPIKeyModal />}
      />

      <Table
        head={[
          <Table.th key="">API Key</Table.th>,
          <Table.th key="">Postgres Role for RLS</Table.th>,
          <Table.th key="">Description</Table.th>,
          <Table.th key="actions" />,
        ]}
        body={
          secretApiKeys.length === 0 ? (
            <Table.tr>
              <Table.td colSpan={4} className="!rounded-b-md overflow-hidden">
                <p className="text-sm text-foreground">No secret API keys created yet</p>
                <p className="text-sm text-foreground-light">
                  Your project can't be accessed from your servers using secret API keys.
                </p>
              </Table.td>
            </Table.tr>
          ) : (
            secretApiKeys.map((apiKey) => (
              <Table.tr key={apiKey.id}>
                <Table.td>{apiKey.api_key}</Table.td>
                <Table.td>{apiKey.description}</Table.td>
              </Table.tr>
            ))
          )
        }
      />
    </div>
  )
}

export default SecretAPIKeys
