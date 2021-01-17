function indicator() {
    return ["EMA(3,close,0)", "EMA(6,close,0)"];
}

async function predict(bot) {
    var candle = await now("CANDLE");
    var ema3 = await now("EMA(3,close,0)");
    var ema6 = await now("EMA(6,close,0)");
    if (ema3.value > ema6.value) {
        if (candle.close > ema6.value)
            return "up";
    } 
    if (ema3.value < ema6.value) {
        if (candle.close < ema6.value)
            return "down";
    }
    return "skip";
}
