import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface Balance {
  balance: number
}

const initialState:Balance = {
  balance: 0
}

export const fetchBalance = createAsyncThunk('balance/fetch', async(account:string, thunkAPI)=>{
  const response = await fetch('http://127.0.0.1:8545/getBalance', {
    method:'POST',
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      account
    })
  })
  const data = await response.json()
  console.log(data);
  return data
})

export const BalanceSlice = createSlice({
  name:'balance',
  initialState,
  reducers:{},
  extraReducers:(builder)=>{
    builder.addCase(fetchBalance.fulfilled,(state,action)=>{
      state.balance = action.payload
    })
  }
})

export default BalanceSlice.reducer