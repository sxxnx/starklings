import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { starklingsAPI } from '../../utils/api'

export interface UserState {
  account?: string;
  github?: string;
  username?: string;
  score?: string;
  validatedExercises: object;
  status?: 'connected' | 'connecting' | 'disconnected';
  error: string;
}

const initialState: UserState = {
  account: '',
  github: '',
  username: '',
  score: '',
  validatedExercises: {},
  status: 'disconnected',
  error: ''
}


export const fetchUser = createAsyncThunk('user/fetchUserInfo', async (userData: object) => {
  const result = await starklingsAPI.getUserInfo(userData)
  if (result.status === 200) {
    const user = result.data
    return {
      'status': 'connected',
      'account': user.wallet_address,
      'github': user.github,
      'username': user.username,
      'score': user.score,
      'validatedExercises': user.validated_exercises,
    }
  } else {
    return {
      'status': 'disconnected',
      'account': '0x0'
    }
  }
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    disconnect (state) {
      state.status = 'disconnected'
      state.error = ''
    }
  },
  extraReducers (builder) {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'connecting'
        state.error = ''
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = action.payload?.status as 'disconnected' | 'connected' | 'connecting'
        state.account = action.payload?.account
        state.github = action.payload?.github
        state.username = action.payload?.username
        state.score = action.payload?.score
        state.validatedExercises = action.payload?.validatedExercises
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'disconnected'
        state.error = action.error.message || 'An unknown error ocurred'
      })
  }
})


export default userSlice.reducer
export const { disconnect } = userSlice.actions
export const selectStarknetInfo = (state: RootState) => state.user
