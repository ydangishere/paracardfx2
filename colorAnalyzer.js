// Module phân tích màu cho card
const colorAnalyzer = {
    // Phát hiện màu chủ đạo và áp dụng glow
    detectDominantColorAndApplyGlow: function(cardImageUrl) {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = cardImageUrl || 'cardnoshade.png';
        
        img.onload = () => {
            // Tạo canvas để phân tích ảnh
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Kích thước phù hợp để phân tích
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Vẽ ảnh lên canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Lấy dữ liệu pixel
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Phân tích màu
            let totalRed = 0;
            let totalGreen = 0;
            let totalBlue = 0;
            let pixelCount = 0;
            
            // Chỉ lấy các pixel không trong suốt
            for (let i = 0; i < data.length; i += 4) {
                const alpha = data[i + 3];
                if (alpha > 128) { // Bỏ qua các pixel gần như trong suốt
                    totalRed += data[i];
                    totalGreen += data[i + 1];
                    totalBlue += data[i + 2];
                    pixelCount++;
                }
            }
            
            // Tính trung bình
            const avgRed = Math.round(totalRed / pixelCount);
            const avgGreen = Math.round(totalGreen / pixelCount);
            const avgBlue = Math.round(totalBlue / pixelCount);
            
            console.log(`Màu trung bình: RGB(${avgRed}, ${avgGreen}, ${avgBlue})`);
            
            // Xác định màu chủ đạo
            const dominantColor = this.getDominantColor(avgRed, avgGreen, avgBlue);
            
            // Áp dụng glow tương ứng
            this.applyGlowColor(dominantColor);
        };
    },
    
    getDominantColor: function(avgRed, avgGreen, avgBlue) {
        // Mặc định là xanh lá
        let dominantColor = "green"; 
        
        // Xác định các ngưỡng cơ bản
        if (avgRed > avgGreen && avgRed > avgBlue) {
            dominantColor = "red"; // Đỏ
        } else if (avgGreen > avgRed && avgGreen > avgBlue) {
            dominantColor = "green"; // Xanh lá
        } else if (avgBlue > avgRed && avgBlue > avgGreen) {
            if (avgRed > 100) {
                dominantColor = "purple"; // Tím (xanh dương + đỏ)
            } else {
                dominantColor = "blue"; // Xanh dương
            }
        } else if (avgRed > 150 && avgGreen > 150 && avgBlue < 100) {
            dominantColor = "yellow"; // Vàng (đỏ + xanh lá)
        }
        
        console.log(`Màu chủ đạo: ${dominantColor}`);
        return dominantColor;
    },
    
    // Áp dụng màu glow dựa vào màu chủ đạo
    applyGlowColor: function(dominantColor) {
        // Thiết lập các màu glow
        const glowColors = {
            red: "rgba(255, 51, 51, 0.64)",     // Đỏ
            green: "rgba(63, 251, 185, 0.64)",  // Xanh lá (ngọc)
            blue: "rgba(51, 153, 255, 0.64)",   // Xanh dương
            yellow: "rgba(255, 204, 0, 0.64)",  // Vàng
            purple: "rgba(162, 85, 217, 0.64)"  // Tím
        };
        
        // Lấy màu glow phù hợp hoặc mặc định là xanh lá
        const glowColor = glowColors[dominantColor] || glowColors.green;
        
        // Điều chỉnh glow theo kích thước màn hình
        this.updateGlowSize();
        
        // Cập nhật CSS cho lớp ::after (glow) bằng cách thay đổi inline style
        document.documentElement.style.setProperty('--glow-color', glowColor);
        console.log(`Đã đặt màu glow: ${glowColor} cho màu chủ đạo: ${dominantColor}`);
    },
    
    // Điều chỉnh kích thước glow dựa vào kích thước màn hình
    updateGlowSize: function() {
        const screenWidth = window.innerWidth;
        
        let glowSize, glowBlur;
        
        if (screenWidth <= 480) {
            // Điện thoại - glow vừa phải
            glowSize = '8px';  
            glowBlur = '4px';   
        } else if (screenWidth <= 768) {
            // Tablet - glow trung bình
            glowSize = '6px';  
            glowBlur = '3px';   
        } else {
            // Desktop - glow nhỏ
            glowSize = '5px';  
            glowBlur = '2.5px';  
        }
        
        document.documentElement.style.setProperty('--glow-size', glowSize);
        document.documentElement.style.setProperty('--glow-blur', glowBlur);
        console.log(`Điều chỉnh glow: blur=${glowBlur}, size=${glowSize} cho màn hình ${screenWidth}px`);
    }
};

// Export module
window.colorAnalyzer = colorAnalyzer;

// Gọi updateGlowSize ngay khi script được tải
console.log("Kiểm tra cập nhật glow size ban đầu");
colorAnalyzer.updateGlowSize();

// Thêm sự kiện resize để cập nhật glow
window.addEventListener('resize', function() {
    console.log("Resize được phát hiện, đang cập nhật glow size");
    colorAnalyzer.updateGlowSize();
});
