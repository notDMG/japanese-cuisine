import { prisma } from "./prisma"

export default async function getUserFromDb(email: string) {
  return await prisma.user.findFirst({
    where: {
      email
    }
  })
}