// Khai báo hàm trả về chỉ báo sử dụng trong thuật toán (Bắt buộc)
function indicator() {
    return ["MA(5,close,0)", "MA(10,close,0)"]; 
}

// Khai báo hàm trả về dự đoán (Bắt buộc)
async function predict(bot) {
    var candle = await now("candle"); // Lấy dữ liệu nến
    var ma5 = await now("MA(5,close,0)"); // Lấy dữ liệu đường MA5
    var ma10 = await now("MA(10,close,0)"); // Lấy dữ liệu đường MA10
    // Kiểm tra đường MA5 nằm trên đường MA10
    if(ma5.value > ma10.value) {
        if(candle.close > ma10.value) // Kiểm tra nến nằm trên MA10
            return "up"; // Trả về dự đoán tăng
    }
    if(ma5.value < ma10.value) {
        if(candle.close < ma10.value) // Kiểm tra nến nằm dưới MA10
            return "down"; // Trả về dự đoán giảm
    }
    return "skip"; // Trả về dự đoán skip lệnh
}