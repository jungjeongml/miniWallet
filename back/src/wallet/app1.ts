import Wallet from '@core/wallet/wallet';
import express from 'express'
import nunjucks from 'nunjucks'
import axios from 'axios'
import path from 'path'

export default (accounts: Wallet) => {
  const app = express()
  const viewDir = path.join(__dirname, "views")

  app.use(express.json())
  app.set('view engine', 'html')
  nunjucks.configure(viewDir, {
    express: app
  })

  app.get('/', (req, res) => {
    res.render('index')
  })
  app.post('/wallet', (req, res) => {
    const account = accounts.create()
    const balance = axios.post('http://127.0.0.1:8545/getBalance', {
      account: account.account
    })
    res.json({
      ...account,
      balance
    })
  })
  return app
}