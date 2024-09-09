import {GetFormById} from '@/actions/form'
import FormLinkShare from '@/components/FormLinkShare'
import VisitBtn from '@/components/VisitBtn'
import {StatsCard} from '../../page'
import {LuView} from 'react-icons/lu'
import {FaWpforms} from 'react-icons/fa'
import {HiCursorClick} from 'react-icons/hi'
import {TbArrowBounce} from 'react-icons/tb'

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
          value={submissions.toLocaleString() || '0'}
          loading={false}
          className="shadow-md shadow-green-600"
        />
        <StatsCard
          title="Bounce rate"
          icon={<TbArrowBounce className="text-red-600" />}
          helperText="visits that leaves without interacting"
          value={submissions.toLocaleString() || '0'}
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

function SubmissionsTable({id}: {id: number}) {
  return (
    <div className="container">
      <h1 className="text-2xl font-bold my-4">Submissions</h1>
    </div>
  )
}
