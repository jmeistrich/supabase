import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogSection,
  DialogSectionSeparator,
  DialogTitle,
  DialogTrigger,
  FormControl_Shadcn_,
  FormField_Shadcn_,
  Form_Shadcn_,
  Input_Shadcn_,
  AlertDescription_Shadcn_,
  AlertTitle_Shadcn_,
  Alert_Shadcn_,
  WarningIcon,
} from 'ui'
import { FormItemLayout } from 'ui-patterns/form/FormItemLayout/FormItemLayout'

const FORM_ID = 'create-secret-api-key'
const SCHEMA = z.object({
  role: z.string(),
  description: z.string(),
})

const CreateSecretAPIKeyModal = () => {
  const form = useForm<z.infer<typeof SCHEMA>>({
    resolver: zodResolver(SCHEMA),
    defaultValues: {
      role: 'service_role',
      description: '',
    },
  })
  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (values) => {
    console.log('@@@@@@@@@@@@@@', values)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="default" className="pointer-events-auto">
          Create new
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new secret API key</DialogTitle>
          <DialogDescription>
            Secret API keys are used to authorize requests to your project from servers, functions,
            workers or other backend components of your application. Keep them secret, don't publish
            them online and don't check them in source code.
          </DialogDescription>
        </DialogHeader>
        <DialogSectionSeparator />
        <DialogSection className="flex flex-col gap-4">
          <Form_Shadcn_ {...form}>
            <form
              className="flex flex-col gap-4"
              id={FORM_ID}
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField_Shadcn_
                key="role"
                name="role"
                control={form.control}
                render={({ field }) => (
                  <>
                    <FormItemLayout
                      label="Postgres Role for RLS"
                      description="API calls to your project will use this Postgres role to authorize requests."
                    >
                      <FormControl_Shadcn_>
                        <Input_Shadcn_ {...field} />
                      </FormControl_Shadcn_>
                    </FormItemLayout>
                    {field.value.trim() === 'service_role' && (
                      <Alert_Shadcn_ variant="warning">
                        <WarningIcon className="h-4 w-4" strokeWidth={2} />
                        <AlertTitle_Shadcn_>Row-Level Security Bypass</AlertTitle_Shadcn_>
                        <AlertDescription_Shadcn_>
                          Using <code>service_role</code> will bypass all RLS policies on your
                          project. Use with care!
                        </AlertDescription_Shadcn_>
                      </Alert_Shadcn_>
                    )}
                  </>
                )}
              />

              <FormField_Shadcn_
                key="description"
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItemLayout
                    label="Description"
                    description="Provide a description about what this key is used for."
                  >
                    <FormControl_Shadcn_>
                      <Input_Shadcn_ {...field} placeholder="(Optional)" />
                    </FormControl_Shadcn_>
                  </FormItemLayout>
                )}
              />
            </form>
          </Form_Shadcn_>
        </DialogSection>
        <DialogFooter>
          <Button form={FORM_ID} htmlType="submit">
            Create API key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateSecretAPIKeyModal
