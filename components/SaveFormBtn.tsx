import React, {useTransition} from 'react'
import {Button} from './ui/button'
import {HiSaveAs} from 'react-icons/hi'
import useDesigner from './hooks/useDesigner'
import {UpdateFormContent} from '@/actions/form'
import {toast} from '@/hooks/use-toast'
import {FaSpinner} from 'react-icons/fa'

function SaveFormBtn({id}: {id: number}) {
  const {elements, isChanged, setIsChanged} = useDesigner()
  const [loading, startTransition] = useTransition()

  const updateFormContent = async () => {
    try {
      const JsonElements = JSON.stringify(elements)
      await UpdateFormContent(id, JsonElements)
      setIsChanged(false)
      toast({
        title: 'Success',
        description: 'Form saved successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      })
    }
  }

  return (
    <Button
      variant={'outline'}
      className="gap-2"
      disabled={loading || !isChanged}
      onClick={() => startTransition(updateFormContent)}
    >
      <HiSaveAs className="h-4 w-4" />
      Save
      {loading && <FaSpinner className="animate-spin" />}
    </Button>
  )
}

export default SaveFormBtn
