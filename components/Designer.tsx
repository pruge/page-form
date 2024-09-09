'use client'

import React, {useContext, useState} from 'react'
import DesignerSidebar from './DesignerSidebar'
import {DragEndEvent, useDndMonitor, useDraggable, useDroppable} from '@dnd-kit/core'
import {cn} from '@/lib/utils'
import {ElementsType, FormElementInstance, FormElements} from './FormElement'
import useDesigner from './hooks/useDesigner'
import {idGenerator} from '@/lib/idGenerate'
import {Button} from './ui/button'
import {BiSolidTrash} from 'react-icons/bi'
import {FaSpinner} from 'react-icons/fa'

function Designer() {
  const {elements, addElement, removeElement, moveElement, selectedElement, setSelectedElement} = useDesigner()

  const droppable = useDroppable({
    id: 'designer-drop-area',
    data: {
      isDesignerDropArea: true,
    },
  })

  // console.log('elements', elements)

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      const {active, over} = event
      if (!active || !over) return

      const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement

      // senario 1: dropping a sidebar btn element over the designer drop area
      const isDroppingOverDesignerDropArea = over.data?.current?.isDesignerDropArea
      const droppingSidebarBtnOverDesignerDropArea = isDesignerBtnElement && isDroppingOverDesignerDropArea
      if (droppingSidebarBtnOverDesignerDropArea) {
        const type = active.data?.current?.type as ElementsType
        const newElement = FormElements[type].construct(idGenerator())
        addElement(elements.length, newElement)
        return
      }

      // senario 2: dropping a sidebar btn element over the designer element
      const isDroppingOverDesignerElementTopHalf = over.data?.current?.isTopHalfDesignerElement
      const isDroppingOverDesignerElementBottomHalf = over.data?.current?.isBottomHalfDesignerElement
      const isDroppingOverDesignerElement =
        isDroppingOverDesignerElementTopHalf || isDroppingOverDesignerElementBottomHalf
      const droppingSidebarBtnDesignerElement = isDesignerBtnElement && isDroppingOverDesignerElement
      if (droppingSidebarBtnDesignerElement) {
        const type = active.data?.current?.type as ElementsType
        const newElement = FormElements[type].construct(idGenerator())
        const overElementIndex = elements.findIndex((element) => element.id === over.data?.current?.elementId)
        if (overElementIndex === -1) {
          throw new Error('element not found')
        }
        const indexForNewElement = overElementIndex + (isDroppingOverDesignerElementTopHalf ? 0 : 1)
        addElement(indexForNewElement, newElement)
        return
      }

      // senario 3: dropping a designer element over the another designer element
      const isDraggingDesignerElement = active.data?.current?.isDesignerElement
      const draggingDesignerElementOverAnotherDesignerElement =
        isDroppingOverDesignerElement && isDraggingDesignerElement
      if (draggingDesignerElementOverAnotherDesignerElement) {
        const activeId = active.data?.current?.elementId
        const overId = over.data?.current?.elementId

        const activeElementIndex = elements.findIndex((element) => element.id === activeId)
        const overElementIndex = elements.findIndex((element) => element.id === overId)

        if (activeElementIndex === -1 || overElementIndex === -1) {
          throw new Error('element not found')
        }

        const addOverIndex = isDroppingOverDesignerElementTopHalf ? 0 : 1

        moveElement(activeId, overId, addOverIndex)
      }

      // senario 4: dropping a designer element next the last designer element
      const draggingDesignerElementNextToLastDesignerElement =
        !isDroppingOverDesignerElement && isDraggingDesignerElement
      if (draggingDesignerElementNextToLastDesignerElement) {
        const activeId = active.data?.current?.elementId
        const activeElementIndex = elements.findIndex((element) => element.id === activeId)

        if (activeElementIndex === -1) {
          throw new Error('element not found')
        }

        moveElement(activeId, 'last')
      }
    },
  })

  return (
    <div className="flex w-full h-full">
      <div
        className="p-4 w-full"
        onClick={() => {
          setSelectedElement(null)
        }}
      >
        <div
          ref={droppable.setNodeRef}
          className={cn(
            'bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto',
            droppable.isOver && 'ring-2 ring-primary/20',
          )}
        >
          {!droppable.isOver && elements.length === 0 && (
            <p className="text-3xl text-muted-foreground flex flex-grow items-center font-bold">Drop here</p>
          )}
          <div className="flex flex-col flex-grow text-background w-full gap-2 p-4">
            {elements.length > 0 &&
              elements.map((element, index) => <DesignerElementWrapper key={element.id} element={element} />)}
            {droppable.isOver && <div className="h-[120px] rounded-md bg-primary/20"></div>}
          </div>
        </div>
      </div>

      <DesignerSidebar />
    </div>
  )
}

function DesignerElementWrapper({element}: {element: FormElementInstance}) {
  const {removeElement, selectedElement, setSelectedElement} = useDesigner()
  const [mouseIsOver, setMouseIsOver] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  useDndMonitor({
    onDragMove: () => {
      setIsDragging(true)
    },
    onDragEnd: () => {
      setIsDragging(false)
    },
  })

  const topHalf = useDroppable({
    id: element.id + '-top',
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  })
  const bottomHalf = useDroppable({
    id: element.id + '-bottom',
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  })

  const draggable = useDraggable({
    id: element.id + '-drag-handler',
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  })

  if (draggable.isDragging) return null

  const DesignerElement = FormElements[element.type].designerComponent

  return (
    <div
      className="relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset"
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={(e) => {
        e.stopPropagation()
        setSelectedElement(element)
      }}
    >
      <div ref={topHalf.setNodeRef} className="absolute w-full h-1/2 rounded-t-md"></div>
      <div ref={bottomHalf.setNodeRef} className="absolute w-full bottom-0 h-1/2 rounded-b-md"></div>

      <div className="flex w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100">
        <DesignerElement elementInstance={element} />
      </div>

      {mouseIsOver && !isDragging && (
        <div className="absolute right-0 h-full w-full">
          <div className="absolute right-0 h-full">
            <Button
              className="flex justify-center h-full border rounded-md rounded-l-none bg-red-500 hover:bg-red-500/90"
              variant={'outline'}
              onClick={(e) => {
                e.stopPropagation()
                removeElement(element.id)
              }}
            >
              <BiSolidTrash className="h-6 w-6" />
            </Button>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <p className="text-muted-foreground text-sm">Click for properties or drag to move</p>
          </div>
        </div>
      )}
      {topHalf.isOver && <div className="absolute top-0 w-full rounded-md h-[7px] bg-primary rounded-b-none "></div>}
      {bottomHalf.isOver && (
        <div className="absolute bottom-0 w-full rounded-md h-[7px] bg-primary rounded-t-none"></div>
      )}
    </div>
  )
}

export default Designer
