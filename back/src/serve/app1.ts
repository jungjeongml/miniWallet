import express from 'express'
import Ingchain from '@core/ingchain'

export default (blockchain: Ingchain) => {
  const app = express()

  app.use(express.json())

  app.get('/', (req, res)=>{
    res.send('hello blockchain')
  })

  app.get('/getbalance', (req, res)=>{
    const {accounts} = req.body
    const balance = blockchain.getBalance(accounts)
    res.json({balance})
  })

  app.put('/accounts', (req, res)=>{
    const account = blockchain.accounts.create()
    res.json({...account})
  })

  app.get('/accounts', (req, res)=>{
    const accounts = blockchain.accounts.getAccounts()
    res.json(accounts)
  })

  app.post('/mineBlock', (req, res) => {
    const {account} = req.body
    const newBlock = blockchain.mineBlock(account)
    res.json(newBlock)
  })
  
  app.post('/transaction', (req, res) => {
    const {receipt} = req.body
    const transaction = blockchain.sendTransaction(receipt)
    res.json({
      transaction
    })
  })
  return app
}