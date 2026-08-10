import Dexie, { type EntityTable } from 'dexie'

import { DB_NAME } from '@/utils/constants'

export interface AudioFile {
  id: number
  name: string
  blob: Blob
}

export class AudioQuizDB extends Dexie {
  audioFiles!: EntityTable<AudioFile, 'id'>

  constructor() {
    super(DB_NAME)
    this.version(1).stores({
      audioFiles: '++id, name',
    })
  }
}

export const db = new AudioQuizDB()
