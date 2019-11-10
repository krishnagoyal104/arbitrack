const getHighestSpread = (assets) => {
	const result = assets.reduce((object, asset) => {
	  if(asset.arbitrage > object.arbitrage){
	    object = asset;
	  }
	  return object;
	}, {arbitrage: 0});
    const {symbol, arbitrage, high_exchange, low_exchange} = result;
    const high = result[high_exchange];
    const low = result[low_exchange];
    return {symbol, arbitrage, high_exchange, low_exchange, high, low}
}

const set24hHigh = () => {
	
}