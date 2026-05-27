import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let databaseUrl: string | undefined = undefined

if (process.env.VERCEL) {
  const tmpDbPath = '/tmp/custom.db'
  const sourceDbPath = path.join(process.cwd(), 'prisma', 'db', 'custom.db')
  
  try {
    let shouldCopy = false
    if (!fs.existsSync(tmpDbPath)) {
      shouldCopy = true
    } else if (fs.existsSync(sourceDbPath)) {
      const sourceStats = fs.statSync(sourceDbPath)
      const tmpStats = fs.statSync(tmpDbPath)
      if (sourceStats.mtimeMs > tmpStats.mtimeMs) {
        shouldCopy = true
      }
    }

    if (shouldCopy) {
      console.log(`Prisma Init: Copying database from ${sourceDbPath} to ${tmpDbPath}`)
      const tmpDir = path.dirname(tmpDbPath)
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true })
      }
      
      if (fs.existsSync(sourceDbPath)) {
        fs.copyFileSync(sourceDbPath, tmpDbPath)
        fs.chmodSync(tmpDbPath, 0o666)
        console.log(`Prisma Init: Database copied successfully`)
      } else {
        console.warn(`Prisma Init: Source database not found at ${sourceDbPath}`)
      }
    } else {
      console.log(`Prisma Init: Database in /tmp is up-to-date`)
    }
    databaseUrl = `file:${tmpDbPath}`
  } catch (error) {
    console.error('Prisma Init: Failed to copy database to /tmp:', error)
  }
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: databaseUrl
      ? {
          db: {
            url: databaseUrl,
          },
        }
      : undefined,
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db