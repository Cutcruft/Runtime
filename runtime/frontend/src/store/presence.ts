import { signal } from '@preact/signals'
import type { ParticipantPayload } from '../protocol/envelope'
import { globalSingleton } from '../utils/globalSingleton'

interface PresenceState {
  participants: ParticipantPayload[]
  localSessionId: string | null
}

const state = globalSingleton('__cc_presence', () => signal<PresenceState>({
  participants: [],
  localSessionId: null
}))

export const presenceStore = {
  get participants(): ParticipantPayload[] {
    return state.value.participants
  },
  get count(): number {
    return state.value.participants.length
  },
  get localSessionId(): string | null {
    return state.value.localSessionId
  },
  get localParticipant(): ParticipantPayload | undefined {
    return state.value.participants.find(p => p.sessionId === state.value.localSessionId)
  },
  setLocalSessionId(sessionId: string) {
    state.value = { ...state.value, localSessionId: sessionId }
  },
  updateParticipants(participants: ParticipantPayload[]) {
    state.value = { ...state.value, participants }
  },
  addParticipant(participant: ParticipantPayload) {
    if (!state.value.participants.find(p => p.sessionId === participant.sessionId)) {
      state.value = { ...state.value, participants: [...state.value.participants, participant] }
    }
  },
  removeParticipant(sessionId: string) {
    state.value = { ...state.value, participants: state.value.participants.filter(p => p.sessionId !== sessionId) }
  },
  clear() {
    state.value = { participants: [], localSessionId: null }
  }
}
