import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { starklingsAPI } from '../../utils/api'

export interface WalletState {
  account?: string;
  status?: 'connected' | 'connecting' | 'disconnected';
  error: string;
}

const initialState: WalletState = {
  account: undefined,
  status: 'disconnected',
  error: ''
}

export const fetchUser = createAsyncThunk('user/fetchUserInfo', async (userData) => {
  const result = await starklingsAPI.registerUser(userData)
  console.log(result)
  return {
    'status': 'connected',
    'account': '0x...'
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
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'disconnected'
        state.error = action.error.message || 'An unknown error ocurred'
      })
  }
})

export const { disconnect } = userSlice.actions

export default userSlice.reducer

export const selectStarknetInfo = (state: RootState) => state.user