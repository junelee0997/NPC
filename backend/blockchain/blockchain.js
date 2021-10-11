const sha256 = require('sha256')
function BlockChain(){
	this.chain = []
	this.pendingTransaction = []
	this.createNewBlock(100, '0', '0')
}

BlockChain.prototype.createNewBlock = function(nonce, previousBlockHash, hash){
	const newblock = {
		index: this.chain.length + 1,
		timestamp: Date.now(),
		transactions: this.pendingTransaction,
		nonce: nonce,
		hash: hash,
		previousBlockHash: previousBlockHash
	}
	this.chain.push(newblock)
	this.pendingTransaction = []
}
BlockChain.prototype.getLastBlock = function(){
	return this.chain[this.chain.length-1]
}
BlockChain.prototype.createNewTransaction = function(amount, sender, recipient){
	const newTransaction = {
		amount: amount,
		sender: sender,
		recipient: recipient
	}
	this.pendingTransaction.push(newTransaction)
	return this.getLastBlock()['index'] + 1
}
BlockChain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce){
	const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData)
	const hash = sha256(dataAsString)
	return hash
}
BlockChain.prototype.proofOfWork = function(previousBlockHash, currentBlockData){
	let nonce = 0
	let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
	while(hash.substring(0, 4) != '0000'){
		nonce++
		hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
	}
	return nonce
}
module.exports = BlockChain