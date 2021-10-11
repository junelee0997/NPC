const BlockChain = require('./blockchain.js')
const bitcoin = new BlockChain()
bitcoin.createNewTransaction(100, "hojoon", "minsoo")
var previousBlockHash = bitcoin.getLastBlock().hash
var pendingTransaction = bitcoin.pendingTransaction
var nonce = bitcoin.proofOfWork(previousBlockHash, pendingTransaction)
var hash = bitcoin.hashBlock(previousBlockHash, pendingTransaction, nonce)
bitcoin.createNewBlock(nonce, previousBlockHash, hash)
console.log(nonce)
console.log(hash)
console.log(bitcoin)