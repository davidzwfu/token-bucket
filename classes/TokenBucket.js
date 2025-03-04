class TokenBucket {
  constructor(burst, sustained) {
    this.burst = burst;
    this.tokens = burst;
    this.sustained = sustained;
    this.fillRate = 60000 / this.sustained;
    this.lastRefill = Date.now();
  }
  
  consumeToken() {
    const tokensToAdd = Math.floor((Date.now() - this.lastRefill) / this.fillRate);
    this.tokens = Math.min(this.tokens + tokensToAdd, this.burst);
    this.lastRefill = this.lastRefill + (tokensToAdd * this.fillRate);

    if (this.tokens <= 0)
			return false;
        
    this.tokens--;
    return true;
  }
}

module.exports = {
  TokenBucket,
}
