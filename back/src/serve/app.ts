import Ingchain from '@core/ingchain'
import express from 'express'
import P2PNetwork from './p2p'
import cors from 'cors'



export default (blockchain: Ingchain, p2p:P2PNetwork) => {
  const app = express()
  
  app.use(express.json())
  app.use(cors({
    origin:true,
    credentials:true,
  }))
  
  app.get('/', (req, res)=>{
    res.send('hello blockchain')
  })

  app.put('/createAccountnBalance', (req, res)=>{
    const accounts = blockchain.accounts.createOnlyAccount()
    const account = accounts.account
    const balance = blockchain.getBalance(account)
    res.json({...accounts, balance})
  })

  app.post('/getAccountnBalance', (req, res)=>{
    const data = req.body
    console.log('data', data);
    const account: string = data.account
    const response = blockchain.getAccountnBalance(account)
    console.log('res',response);
    res.json(response)
  })
  
  app.put('/accounts', (req, res)=>{
    console.log(req)
    const account = blockchain.accounts.create()
    res.json({...account})
  })

  app.get('/accounts', (req, res) => {
    const accounts = blockchain.accounts.getAccounts()
    res.json(accounts)
  })

  app.post('/mineBlock', (req, res)=>{
    const {account} = req.body
    const newBlock = blockchain.mineBlock(account)

    p2p.broadcast(p2p.message.getAllBlockMessage())
    res.json(newBlock)
  })
  
  app.post('/getbalance', (req,res)=>{
    const { account } = req.body
    console.log(account);
    const balance = blockchain.getBalance(account)
    console.log(balance);
    res.json({
      balance
    })
  })

  app.post('/signAndtransaction', (req, res)=>{
    try{
      const {sender, received, amount}:{ sender: string; received: string; amount: string }  = req.body
      const parseAmount = parseFloat(amount)
      const transaction = blockchain.getSignAndTransaction({sender, received, amount:parseAmount})
      
      p2p.broadcast(p2p.message.getReceivedTransactionMessage(transaction))
      res.json({
        transaction
      })
    } catch(e){
      console.error(e)
    }
  })

  app.post('/transaction', (req, res)=>{
    try{
      const {receipt} = req.body
      receipt.amount = parseInt(receipt.amount)
      const transaction = blockchain.sendTransaction(receipt)

      p2p.broadcast(p2p.message.getReceivedTransactionMessage(transaction))
      res.json({
        transaction
      })
    } catch(e){
      console.error(e)
    }
  })
  
  app.post('/addPeer', (req, res) => {
    const {host, port} = req.body

    p2p.connect(parseInt(port), host)
    res.send('connection')
  })

  app.get('/peers', (req, res) => {
    const sockets = p2p.sockets.map((socket) => {
      return `${socket.remoteAddress}:${socket.remotePort}`
    })
    res.json(sockets)
  })

  return app
}