'use client'

import {ElementsType, FormElement, FormElementInstance} from '../FormElement'
import {Label} from '../ui/label'
import {Input} from '../ui/input'
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useEffect} from 'react'
import useDesigner from '../hooks/useDesigner'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '../ui/form'
import {BsTextParagraph} from 'react-icons/bs'
import {Textarea} from '../ui/textarea'

const type: ElementsType = 'ParagraphField'
const extraAttributes = {
  text: 'Text here',
}

const propertiesSchema = z.object({
  text: z.string().min(2).max(500),
})

export const ParagraphFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: BsTextParagraph,
    label: 'Paragraph Field',
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true,
}

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes
}

function DesignerComponent({elementInstance}: {elementInstance: FormElementInstance}) {
  const element = elementInstance as CustomInstance
  const {text} = element.extraAttributes

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-foreground">Paragraph field</Label>
      <p>{text}</p>
    </div>
  )
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>
function PropertiesComponent({elementInstance}: {elementInstance: FormElementInstance}) {
  const element = elementInstance as CustomInstance
  const {updateElement} = useDesigner()
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onBlur',
    defaultValues: {
      text: element.extraAttributes.text,
    },
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
  }, [element, form])

  function applyChanges(values: propertiesFormSchemaType) {
    updateElement(element.id, {
      ...element,
      extraAttributes: values,
    })
  }

  return (
    <Form {...form}>
      <form onBlur={form.handleSubmit(applyChanges)} onSubmit={(e) => e.preventDefault()} className="space-y-3">
        {/* label */}
        <FormField
          control={form.control}
          name="text"
          render={({field}) => (
            <FormItem>
              <FormLabel>Text</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={8}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      e.currentTarget.blur()
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

function FormComponent({elementInstance}: {elementInstance: FormElementInstance}) {
  const element = elementInstance as CustomInstance
  const {text} = element.extraAttributes

  return <p>{text}</p>
}
