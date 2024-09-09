'use server'

import prisma from '@/lib/prisma'
import {formSchema, formSchemaType} from '@/schemas/form'
import {currentUser} from '@clerk/nextjs/server'

class UserNotFoundErr extends Error {}

export async function GetFormStats() {
  const user = await currentUser()
  if (!user) {
    throw new UserNotFoundErr()
  }

  const stats = await prisma.form.aggregate({
    where: {
      userId: user.id,
    },
    _sum: {
      visits: true,
      submissions: true,
    },
  })

  const visits = stats._sum.visits || 0
  const submissions = stats._sum.submissions || 0

  const submissionRate = visits > 0 ? (submissions / visits) * 100 : 0
  const bounceRate = 100 - submissionRate

  return {
    visits,
    submissions,
    submissionRate,
    bounceRate,
  }
}

export async function CreateForm(data: formSchemaType) {
  const validdation = formSchema.safeParse(data)
  if (!validdation.success) {
    throw new Error('form not valid')
  }

  const user = await currentUser()
  if (!user) {
    throw new UserNotFoundErr()
  }

  const {name, description} = validdation.data

  const form = await prisma.form.create({
    data: {
      userId: user.id,
      name,
      description,
    },
  })

  if (!form) {
    throw new Error('something went wrong')
  }

  return form.id
}

export async function GetForms() {
  const user = await currentUser()
  if (!user) {
    throw new UserNotFoundErr()
  }
  const forms = await prisma.form.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return forms
}

export async function GetFormById(id: number) {
  const user = await currentUser()
  if (!user) {
    throw new UserNotFoundErr()
  }
  const form = await prisma.form.findUnique({
    where: {
      userId: user.id,
      id,
    },
  })

  return form
}

export async function UpdateFormContent(id: number, jsonContent: string) {
  const user = await currentUser()
  if (!user) {
    throw new UserNotFoundErr()
  }
  return await prisma.form.update({
    where: {
      userId: user.id,
      id,
    },
    data: {
      content: jsonContent,
    },
  })
}
