import { type ChangeEvent, useCallback, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'

import { type AudioFile, db } from '@/lib/db'

import { Settings } from './components/settings'
import { StemList } from './components/stem-list'

interface StartViewProps {
  onStart: () => void
}

export const StartView = (props: StartViewProps) => {
  const { onStart } = props

  const [uploadError, setUploadError] = useState<string | null>(null)

  const audioStems = useLiveQuery(
    () => db.audioFiles.toArray(),
    [],
    [] as AudioFile[],
  )
  const canStartRound = audioStems.length > 0

  // TODO: Prevent loading corrupted audio
  const handleStemUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length < 1) return

    setUploadError(null)

    try {
      const newStems = Array.from(files).map(
        (file): Omit<AudioFile, 'id'> => ({ name: file.name, blob: file }),
      )
      await db.audioFiles.bulkAdd(newStems)
    } catch {
      setUploadError('Failed to upload stems')
    } finally {
      e.target.value = ''
    }
  }

  const handleStemRemove = useCallback(async (id: number) => {
    try {
      await db.audioFiles.delete(id)
    } catch {
      alert('Failed to remove stem')
    }
  }, [])

  return (
    <div className='start-view'>
      <Settings />
      <button
        className='start-round-btn'
        onClick={onStart}
        disabled={!canStartRound}
      >
        Start Round
      </button>
      <div className='stems-container'>
        <div>
          <input
            type='file'
            multiple
            accept='audio/*'
            onChange={(e) => void handleStemUpload(e)}
          />
          {uploadError && <span style={{ color: 'red' }}>{uploadError}</span>}
        </div>
        <StemList
          stems={audioStems}
          onRemove={handleStemRemove}
        />
      </div>
    </div>
  )
}
