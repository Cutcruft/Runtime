import { reactive } from 'vue'
import type { ParticipantPayload } from '../protocol/envelope'

interface PresenceState {
  participants: ParticipantPayload[]
  localSessionId: string | null
}

const state = reactive<PresenceState>({
  participants: [],
  localSessionId: null
})

export const presenceStore = {
  get participants(): ParticipantPayload[] {
    return state.participants
  },
  get count(): number {
    return state.participants.length
  },
  get localSessionId(): string | null {
    return state.localSessionId
  },
  get localParticipant(): ParticipantPayload | undefined {
    return state.participants.find(p => p.sessionId === state.localSessionId)
  },
  setLocalSessionId(sessionId: string) {
    state.localSessionId = sessionId
  },
  updateParticipants(participants: ParticipantPayload[]) {
    state.participants = participants
  },
  addParticipant(participant: ParticipantPayload) {
    if (!state.participants.find(p => p.sessionId === participant.sessionId)) {
      state.participants.push(participant)
    }
  },
  removeParticipant(sessionId: string) {
    state.participants = state.participants.filter(p => p.sessionId !== sessionId)
  },
  clear() {
    state.participants = []
    state.localSessionId = null
  }
}
