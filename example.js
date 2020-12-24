function indicator() {
    return ["MA(10,close,0)"]; // Khai báo chỉ báo Ma10
}

async function predict() {
    var ma10 = await now("MA(10,close,0)"); 
    var candle = await now("candle"); 
    if(candle.open < ma10.value) { // Giá đóng cửa nằm dưới MA10
        if(candle.close > ma10.value) { // Giá đóng cửa nằm trên MA10
            return "up";  // Trả về dự đoán tăng
        }
    }
    return "skip"; // Trả về dự đoán skip nếu không phù hợp 2 điều kiện trên
}