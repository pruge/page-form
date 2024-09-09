import {ImSpinner2} from 'react-icons/im'

function Loading() {
  return (
    <div className="flex w-full h-full flex-col items-center justify-center">
      <ImSpinner2 className="animate-spin h-12 w-12" />
    </div>
  )
}

export default Loading
