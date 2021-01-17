function indicator() {
    return ["EMA(3,close,0)", "EMA(6,close,0)"];
}

function userInput() {
    let inputs = [];
    inputs.push(createInput("Vào lệnh khi (...) liên tiếp", "win", "select", ["win", "loss", "none"]));
    inputs.push(createInput("Số lệnh (thắng/thua) liên tiếp", 2, "number"));
    return inputs;
}

async function predict(bot) {
    print("");
    print("Script name: " + bot.getScript().name);

    // Chart data
    var candle = await now("CANDLE");
    var ema3 = await now("EMA(3,close,0)");
    var ema6 = await now("EMA(6,close,0)");

    let result = "skip";

    // User inputs 
    var inputs = bot.getUserInput();
    var simulateType = inputs[0];
    var simulateAmount = inputs[1];

    print("Simulate type: " + simulateType);
    print("Simulate amount: " + simulateAmount);
    print("Simulate history: ");
    var displayHistory = bot.getSimulateHistory().slice(0, 10);
    printTable(displayHistory);

    // Caculating chart data
    if (ema3.value > ema6.value) {
        if (candle.close > ema6.value)
            result = "up";
    }
    if (ema3.value < ema6.value) {
        if (candle.close < ema6.value)
            result = "down";
    }

    // Simulator
    if (simulateType == "win" || simulateType == "loss") {
        if (simulateAmount <= 0) return result;
        var simulateHistory = bot.getSimulateHistory();
        var typeAsBoolean = simulateType === "win" ? true : false;
        var canOrder = true;
        if (simulateHistory.length < simulateAmount)
            canOrder = false;
        else {
            for (var i = 0; i < simulateAmount; i++)
            if (simulateHistory[i] != typeAsBoolean)
                canOrder = false;
        }
        bot.simulate(result);
        if (canOrder)
            return result;
        else return "skip";
    } else 
        return result;
}
