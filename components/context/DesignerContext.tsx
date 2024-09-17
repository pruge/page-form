'use client'

import {createContext, Dispatch, SetStateAction, useState} from 'react'
import {FormElementInstance} from '../FormElement'

type DesignerContextType = {
  elements: FormElementInstance[]
  setElements: Dispatch<SetStateAction<FormElementInstance[]>>
  addElement: (index: number, element: FormElementInstance) => void
  removeElement: (id: string) => void
  updateElement: (id: string, element: FormElementInstance) => void
  moveElement: (id: string, overId: string, addOverIndex?: number) => void

  selectedElement: FormElementInstance | null
  setSelectedElement: Dispatch<SetStateAction<FormElementInstance | null>>

  isChanged: boolean
  setIsChanged: Dispatch<SetStateAction<boolean>>
}

export const DesignerContext = createContext<DesignerContextType | null>(null)

export default function DesignerContextProvider({children}: {children: React.ReactNode}) {
  const [elements, setElements] = useState<FormElementInstance[]>([])
  const [selectedElement, setSelectedElement] = useState<FormElementInstance | null>(null)
  const [isChanged, setIsChanged] = useState(false)

  const addElement = (index: number, element: FormElementInstance) => {
    setElements((prev) => {
      const newElements = [...prev]
      newElements.splice(index, 0, element)
      return newElements
    })
    setIsChanged(true)
  }

  const removeElement = (id: string) => {
    setElements((prev) => prev.filter((element) => element.id !== id))
    setIsChanged(true)
  }

  const updateElement = (id: string, element: FormElementInstance) => {
    setElements((prev) => {
      const newElements = [...prev]
      const index = newElements.findIndex((element) => element.id === id)
      newElements[index] = element
      return newElements
    })
    setIsChanged(true)
  }

  const moveElement = (activeId: string, overId: string, addOverIndex: number = 0) => {
    setElements((prev) => {
      const activeElementIndex = elements.findIndex((element) => element.id === activeId)
      const activeElement = {...elements[activeElementIndex]}
      const newElements = prev.filter((element) => element.id !== activeId)
      const overElementIndex = newElements.findIndex((element) => element.id === overId)
      const newOverElementIndex = overElementIndex !== -1 ? overElementIndex + addOverIndex : elements.length
      newElements.splice(newOverElementIndex, 0, activeElement)
      return newElements
    })
    setIsChanged(true)
  }

  return (
    <DesignerContext.Provider
      value={{
        elements,

        setElements,
        addElement,
        removeElement,
        updateElement,
        moveElement,
        selectedElement,
        setSelectedElement,

        isChanged,
        setIsChanged,
      }}
    >
      {children}
    </DesignerContext.Provider>
  )
}
