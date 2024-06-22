import { useUser } from '@clerk/clerk-react'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { useEffect, useState } from 'react'
import { HighlightMode, NotesShowingStatus, Settings } from './useSettings'

interface useRetroProps {
  retroId: Id<'retros'>
}

const useRetro = (props: useRetroProps) => {
  const { retroId } = props
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useUser()

  const UpdateTimer = useMutation(api.retros.updateTimer)
  const retro = useQuery(api.retros.get, { id: retroId })
  const notes = retro?.notes
  const users = retro?.users

  const me = users?.find((u) => u?.tokenIdentifier === user?.id)
  const settings : Settings = {
    notesShowingStatus: {
      key: 'notes_showing_status',
      label: 'Hide notes',
      value: <NotesShowingStatus>(retro?.notesShowingStatus || 'showing')
    },
    highlightMode: {
      key: 'higlight_mode',
      label: 'Highlight mode',
      value: <HighlightMode>(String(retro?.highlightMode).length ? retro?.highlightMode : 'disabled')
    }
  }

  const setTimer = (timer: number) => UpdateTimer({ id: retroId, timer })
  const startTimer = () => UpdateTimer({ id: retroId, timerStatus: 'started', startTimer: new Date().getTime() })
  const resetTimer = () => UpdateTimer({ id: retroId, timerStatus: 'not_started', startTimer: 0 })

  useEffect(() => {
    if (retro && notes && users && settings) {
      setIsLoading(false)
    }
  }, [retro, notes, users, settings])

  return {
    isLoading,
    retro,
    notes,
    users,
    me,
    settings,
    setTimer,
    startTimer,
    resetTimer
  }
}

export default useRetro