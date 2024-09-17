import {GetFormById, GetFormWithSubmissions} from '@/actions/form'
import FormLinkShare from '@/components/FormLinkShare'
import VisitBtn from '@/components/VisitBtn'
import {StatsCard} from '../../page'
import {LuView} from 'react-icons/lu'
import {FaWpforms} from 'react-icons/fa'
import {HiCursorClick} from 'react-icons/hi'
import {TbArrowBounce} from 'react-icons/tb'
import {ElementsType, FormElementInstance} from '@/components/FormElement'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {format, formatDistance} from 'date-fns'
import {ReactNode} from 'react'
import {Badge} from '@/components/ui/badge'
import {Checkbox} from '@radix-ui/react-checkbox'

async function FormPage({params}: {params: {id: string}}) {
  const {id} = params
  const form = await GetFormById(Number(id))

  if (!form) {
    throw new Error('form not found')
  }

  const {visits, submissions} = form
  let submissionRate = 0
  if (visits > 0) {
    submissionRate = (submissions / visits) * 100
  }
  const bounceRate = 100 - submissionRate

  return (
    <div className="container">
      <div className="py-10 border-b border-muted ">
        <div className="flex justify-between ">
          <h1 className="text-4xl font-bold truncate">{form.name}</h1>
          <VisitBtn shareURL={form.shareURL} />
        </div>
      </div>
      <div className="py-4 border-b border-muted ">
        <div className=" flex gap-2 items-center justify-between">
          <FormLinkShare shareURL={form.shareURL} />
        </div>
      </div>
      <div className="pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ">
        <StatsCard
          title="Total visits"
          icon={<LuView className="text-blue-600" />}
          helperText="All time form visits"
          value={visits.toLocaleString() || '0'}
          loading={false}
          className="shadow-md shadow-blue-600"
        />
        <StatsCard
          title="Total submissions"
          icon={<FaWpforms className="text-yellow-600" />}
          helperText="All time form submissions"
          value={submissions.toLocaleString() || '0'}
          loading={false}
          className="shadow-md shadow-yellow-600"
        />
        <StatsCard
          title="submissions rate"
          icon={<HiCursorClick className="text-green-600" />}
          helperText="visits that result in form submission"
          value={submissionRate.toLocaleString() + '%' || ''}
          loading={false}
          className="shadow-md shadow-green-600"
        />
        <StatsCard
          title="Bounce rate"
          icon={<TbArrowBounce className="text-red-600" />}
          helperText="visits that leaves without interacting"
          value={bounceRate.toLocaleString() + '%' || ''}
          loading={false}
          className="shadow-md shadow-red-600"
        />
      </div>

      <div className="pt-10">
        <SubmissionsTable id={form.id} />
      </div>
    </div>
  )
}

export default FormPage

async function SubmissionsTable({id}: {id: number}) {
  type Row = Record<string, string>

  const form = await GetFormWithSubmissions(id)

  if (!form) {
    throw new Error('form not found')
  }

  const formElements = JSON.parse(form.content) as FormElementInstance[]
  const columns: {
    id: string
    label: string
    required: boolean
    type: ElementsType
  }[] = []

  formElements.forEach((element) => {
    switch (element.type) {
      case 'TextField':
      case 'NumberField':
      case 'TextAreaField':
      case 'DateField':
      case 'SelectField':
      case 'CheckboxField':
        columns.push({
          id: element.id,
          label: (element.extraAttributes?.label ?? '') as string,
          required: (element.extraAttributes?.required ?? false) as boolean,
          type: element.type,
        })

        break

      default:
        break
    }
  })

  const rows: Row[] = []
  form.FormSubmisstions.forEach((submission) => {
    const content = JSON.parse(submission.content) as Record<string, string>
    rows.push({
      ...content,
      submittedAt: formatDistance(submission.createdAt, new Date(), {
        addSuffix: true,
      }),
    })
  })

  return (
    <div className="container">
      <h1 className="text-2xl font-bold my-4">Submissions</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="uppercase">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="text-muted-foreground text-right uppercase">Submitted at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <RowCell key={column.id} type={column.type} value={row[column.id as keyof typeof row]} />
                ))}
                <TableCell className="text-muted-foreground text-right">{row.submittedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function RowCell({type, value}: {type: ElementsType; value: string}) {
  let node: ReactNode = value

  switch (type) {
    case 'DateField':
      if (!value) break
      const date = new Date(value)
      node = <Badge variant={'outline'}>{format(date, 'yyyy-MM-dd')}</Badge>
      break
    case 'CheckboxField':
      const checked = value === 'true'
      node = <Checkbox checked={checked} disabled />
      break
  }

  return <TableCell>{node}</TableCell>
}
