function indicator() {
    return [];
}

function userInput() {
    let inputs = [];
    inputs.push(createInput("Kiểu Orderbook", "xuôi", "select", ["xuôi", "ngược"]));
    inputs.push(createInput("Vào lệnh khi (...) liên tiếp", "không sử dụng", "select", ["thắng", "thua", "không sử dụng"]));
    inputs.push(createInput("Số lệnh (thắng/thua) liên tiếp", 2, "number"));
    return inputs;
}

function predictWithOrderbook(orderbook, predictType) {
    var tradeHistory = orderbook.trade_history;
    var order = orderbook.order;
    print(tradeHistory);
    print(order);
    var buyOrder = sumArr(order.buy_order);
    var sellOrder = sumArr(order.sell_order);
    var result = "skip";
    if (buyOrder > sellOrder && buyOrder > 2) {
        if (tradeHistory.buy > tradeHistory.sell)
            result = "up";
    } 
    if(sellOrder > buyOrder && sellOrder > 2) {
        if (tradeHistory.sell > tradeHistory.buy)
            result = "down";
    }
    if (predictType == "ngược")
        result = reverse(result);
    return result;
}

function reverse(result) {
    if (result == "up")
        return "down";
    if (result == "down")
        return "up";
    return "skip";
}

function sumArr(arr) {
    var total = 0;
    for (var element of arr)
        total += element;
    return total;
}

async function predict(bot) {
    print("");
    print("Script name: " + bot.getScript().name);

    let result = "skip";

    // User inputs 
    var inputs = bot.getUserInput();
    var predictType = inputs[0];
    var simulateType = inputs[1];
    var simulateAmount = inputs[2];

    print("Orderbook type: " + predictType);
    print("Simulate type: " + simulateType);
    print("Simulate amount: " + simulateAmount);
    print("Simulate history: ");
    var displayHistory = bot.getSimulateHistory().slice(0, 10);
    printTable(displayHistory);

    var orderbook = await now("orderbook");
    result = predictWithOrderbook(orderbook, predictType);

    // Simulator
    if (simulateType == "thắng" || simulateType == "thua") {
        if (simulateAmount <= 0) return result;
        var simulateHistory = bot.getSimulateHistory();
        var typeAsBoolean = simulateType === "thắng" ? true : false;
        var canOrder = true;
        if (simulateHistory.length < simulateAmount)
            canOrder = false;
        else {
            for (var i = 0; i < simulateAmount; i++)
                if (simulateHistory[i].win != typeAsBoolean)
                    canOrder = false;
        }
        bot.simulate(result);
        if (canOrder)
            return result;
        else return "skip";
    } else
        return result;
}
