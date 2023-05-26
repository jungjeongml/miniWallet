import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';


export interface Account {
  publicKey:string,
  privateKey:string,
  account:string,
  balance:number
}

export interface AccountState {
  accounts:Account[]
  selectedAccounts:Account | null
  isLoading:boolean
}

const initialState:AccountState = {
  accounts: [],
  selectedAccounts: null,
  isLoading: false
}

export const fetchAccount = createAsyncThunk('account/fetch', async(thunkAPI)=>{
  const response = await fetch('http://127.0.0.1:8545/createAccountnBalance', {
    method:'PUT'
  })
  const data = await response.json()
  return data
})

export const fetchSelectedAccount = createAsyncThunk('selectedAccount/fetch', async(account:string, thunkAPI)=>{
  const response = await fetch('http://127.0.0.1:8545/getAccountnBalance', {
    method:'POST',
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      account
    }),
  })
  const data = await response.json()
  return data
})

export const fetchSubmit = createAsyncThunk('transaction/fetch', async(args: {received:string, amount:string, sender:string}, thunkAPI)=>{
  const {received, amount, sender} = args
  const response = await fetch('http://127.0.0.1:8545/signAndtransaction', {
    method:'POST',
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      received, amount, sender
    })
  })
  const data = await response.json()
  console.log(data);
  return data
})

const accountSlice = createSlice({
  name:'account',
  initialState,
  reducers:{
    // setAccount: (state, action: PayloadAction<Account[]>) => {
    //   state.accounts = action.payload
    // },
    // setSelectedAccount:(state, action:PayloadAction<Account>)=>{
    //   state.selectedAccounts = action.payload
    // }
  },
  extraReducers:(builder)=>{
    builder.addCase(fetchAccount.fulfilled,(state,action)=>{
      state.accounts.push(action.payload)
    })
    builder.addCase(fetchSelectedAccount.pending,(state,action)=>{
      state.isLoading = true
    })
    builder.addCase(fetchSelectedAccount.fulfilled,(state,action)=>{
      state.selectedAccounts = action.payload
      state.isLoading = false
    })
    builder.addCase(fetchSubmit.pending, (state, action)=>{
      state.isLoading = true
    })
    builder.addCase(fetchSubmit.fulfilled, (state, action)=>{
      state.isLoading = false
    })
    builder.addCase(fetchSubmit.rejected, (state, action)=>{
      state.isLoading = true
    })
  },
})
export default accountSlice
// export const {setAccount, setSelectedAccount} = accountSlice.actions


