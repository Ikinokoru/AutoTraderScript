// Khai báo hàm trả về chỉ báo sử dụng trong thuật toán (Bắt buộc)
function indicator() {
    return ["BB(20,2)"];
}

// Khai báo hàm trả về dự đoán (Bắt buộc)
async function predict() {
    var candle = await now("candle"); // Lấy dữ liệu nến
    var bollingerBands = await now("BB(20,2)"); // Lấy dữ liệu Bollinger Bands
    if(candle.close > bollingerBands.upper_band) // Kiểm tra giá nằm trên band trên
        return "down"; // Trả về dự đoán giảm                             
    if(candle.close < bollingerBands.lower_band) // Kiểm tra giá nằm dưới band dưới
        return "up"; // Trả về dự đoán tăng
    return "skip"; // Trả về dự đoán skip lệnh nếu không nằm trong 2 trường hợp trên
}