function indicator() {
    return ["BB(20,2)"];
}

function analysisCandle(candle) {
    var upWick = 0, body = 0, downWick = 0;
    var total = candle.high - candle.low;
    print(total);
    var isGreen = true;
    if (candle.close > candle.open) {
        // Green candle
        upWick = calculatePercent(candle.high, candle.close, total);
        downWick = calculatePercent(candle.open, candle.low, total);
        body = calculatePercent(candle.close, candle.open, total);
    } else {
        // Red candle 
        isGreen = false;
        upWick = calculatePercent(candle.high, candle.open, total);
        downWick = calculatePercent(candle.close, candle.low, total);
        body = calculatePercent(candle.open, candle.close, total);
    }
    return { isGreen: isGreen, upWick: upWick, downWick: downWick, body: body };
}

function calculatePercent(var1, var2, total) {
    return ((var1 - var2) / total) * 100;
}

async function predict(bot) {
    var candle = await now("CANDLE");
    var bb = await now("BB(20,2)");
    var analysis = analysisCandle(candle);
    print(candle);
    print(analysis);
    // if (candle.high > bb.upper_band) {
    //     return "down";
    // }
    // if (candle.low < bb.lower_band) {
    //     return "up";
    // }
    return "skip";
}
