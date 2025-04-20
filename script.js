// Spring animation system cho card
document.addEventListener('DOMContentLoaded', function() {
    const card = document.querySelector('.card');
    const cardHolo = document.querySelector('.card-holo');
    const cardShine = document.querySelector('.card-shine');
    const cardGlitter = document.querySelector('.card-glitter');
    
    // Xóa mọi phần tử hiệu ứng cũ
    document.querySelectorAll('.light-effect, .card-highlight, .card-light-effect, .light-overlay, .light-sweep, canvas').forEach(el => {
        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }
    });
    
    // Tạo phần tử mới cho hiệu ứng
    const lightEffect = document.createElement('div');
    lightEffect.className = 'light-effect';
    
    // Thiết lập style trực tiếp
    lightEffect.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, 
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.1) 20%,
            rgba(255, 255, 255, 0.3) 30%,
            rgba(255, 255, 255, 0.5) 40%,
            rgba(255, 255, 255, 0.7) 50%,
            rgba(255, 255, 255, 0.5) 60%,
            rgba(255, 255, 255, 0.3) 70%,
            rgba(255, 255, 255, 0.1) 80%,
            rgba(255, 255, 255, 0.1) 100%);
        background-size: 200% 200%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s;
    `;
    
    // Thêm vào card
    card.insertBefore(lightEffect, card.firstChild);
    
    // Thêm animation keyframes cho vệt sáng chỉ chạy trong card
    const styleAnimation = document.createElement('style');
    styleAnimation.textContent = `
        @keyframes lightMoveUp {
            0% { transform: translate(-50%, 100%); }
            100% { transform: translate(-50%, -100%); }
        }
        
        .beam-animation {
            position: absolute !important;
            width: 300% !important;
            height: 30px !important;
            background: linear-gradient(90deg,
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, 0.3) 40%,
                rgba(255, 255, 255, 0.5) 45%,
                rgba(255, 255, 255, 1) 50%,
                rgba(255, 255, 255, 0.5) 55%,
                rgba(255, 255, 255, 0.3) 60%,
                rgba(255, 255, 255, 0) 100%) !important;
            left: 50% !important;
            top: 0 !important;
            transform: translate(-50%, 100%) rotate(45deg) !important;
            z-index: 9999 !important;
            opacity: 0 !important;
            mix-blend-mode: overlay !important;
        }
    `;
    document.head.appendChild(styleAnimation);
    
    // Tạo phần tử mới cho vệt sáng
    const lightBeam = document.createElement('div');
    lightBeam.className = 'beam-animation';
    
    // Container giới hạn vệt sáng trong card
    const beamContainer = document.createElement('div');
    beamContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
    `;
    
    card.appendChild(beamContainer);
    beamContainer.appendChild(lightBeam);
    
    // Tạo hiệu ứng ánh sáng trực tiếp (không qua CSS)
    const lightOverlay = document.createElement('div');
    lightOverlay.id = 'card-light-overlay';
    lightOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: 0;
        mix-blend-mode: overlay;
        z-index: 9999;
        transition: opacity 0.3s;
    `;
    card.appendChild(lightOverlay);
    
    // Thêm animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes lightMove {
            0% { background-position: 0% 0%; }
            100% { background-position: 100% 100%; }
        }
    `;
    document.head.appendChild(style);
    
    // Phát hiện màu chủ đạo và áp dụng glow tương ứng
    colorAnalyzer.detectDominantColorAndApplyGlow('cardnoshade.png');
    
    // Spring animation configuration
    const spring = {
        stiffness: 0.066,  // độ cứng của lò xo (thấp hơn = mềm hơn)
        damping: 0.25,     // độ giảm chấn (thấp hơn = dao động lâu hơn)
        maxRotateX: 16.5,    // góc xoay tối đa
        maxRotateY: 16.5,
        maxRotateZ: 2.5,
        
        // Trạng thái hiện tại
        current: { x: 0, y: 0, z: 0, glareX: 50, glareY: 50, glareOpacity: 0 },
        
        // Trạng thái đích
        target: { x: 0, y: 0, z: 0, glareX: 50, glareY: 50, glareOpacity: 0 },
        
        // Vận tốc
        velocity: { x: 0, y: 0, z: 0, glareX: 0, glareY: 0, glareOpacity: 0 },
        
        // Cập nhật trạng thái dựa trên spring physics
        update: function() {
            // Cho mỗi thuộc tính, tính lực tác động từ spring
            ['x', 'y', 'z', 'glareX', 'glareY', 'glareOpacity'].forEach(prop => {
                // Tính lực (khoảng cách từ target đến current * stiffness)
                const force = (this.target[prop] - this.current[prop]) * this.stiffness;
                
                // Cập nhật vận tốc (trừ đi phần damping)
                this.velocity[prop] = this.velocity[prop] * (1 - this.damping) + force;
                
                // Cập nhật vị trí hiện tại
                this.current[prop] += this.velocity[prop];
            });
            
            // Áp dụng transform mới
            card.style.transform = `translate(-50%, -50%) 
                perspective(810px) 
                rotateX(${this.current.x}deg) 
                rotateY(${this.current.y}deg) 
                rotateZ(${this.current.z}deg)`;
                
            // Cập nhật hiệu ứng shine
            cardShine.style.background = `linear-gradient(
                ${45 + this.current.y * 2}deg, 
                rgba(255, 255, 255, 0) 30%, 
                rgba(255, 255, 255, ${0.3 + this.current.glareOpacity * 0.3}) 48%, 
                rgba(255, 255, 255, 0) 70%
            )`;
            
            // Cập nhật hiệu ứng holo
            cardHolo.style.opacity = this.current.glareOpacity * 0.4;
            
            // Ẩn glare effect
            cardShine.style.transform = `translateX(0%)`;
            cardShine.style.opacity = 0;
        }
    };
    
    // Hàm animation loop
    function animationLoop() {
        spring.update();
        requestAnimationFrame(animationLoop);
    }
    
    // Khởi chạy animation loop
    animationLoop();
    
    // Tính toán vị trí chuột
    function updateMousePosition(e) {
        const bounds = card.getBoundingClientRect();
        
        // Tính toán vị trí tương đối của chuột (0-1)
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const percentX = (mouseX - bounds.left) / bounds.width;
        const percentY = (mouseY - bounds.top) / bounds.height;
        
        // Tính toán góc xoay dựa trên vị trí chuột
        const rotateY = -((percentX - 0.5) * 2) * spring.maxRotateY; // -15 đến 15 độ
        const rotateX = -((0.5 - percentY) * 2) * spring.maxRotateX; // -15 đến 15 độ
        
        // Tính toán rotateZ dựa trên vị trí chuột (góc xoay tinh tế)
        const rotateZ = -((percentX - 0.5) * (percentY - 0.5)) * spring.maxRotateZ;
        
        // Cập nhật target để spring animation đi đến
        spring.target.x = rotateX;
        spring.target.y = rotateY;
        spring.target.z = rotateZ;
        
        // Cập nhật vị trí ánh sáng glare
        spring.target.glareX = percentX * 100;
        spring.target.glareY = percentY * 100;
        spring.target.glareOpacity = 1;
        
        // Hiệu ứng lấp lánh ngẫu nhiên
        if (Math.random() < 0.03) {
            cardGlitter.style.opacity = Math.random() * 0.15;
            setTimeout(() => cardGlitter.style.opacity = 0, 150);
        }
    }
    
    // Thêm sự kiện di chuột
    card.addEventListener('mousemove', updateMousePosition);
    
    // Thêm sự kiện khi di chuột vào
    card.addEventListener('mouseenter', function() {
        // Đặt transition cho holographic
        cardHolo.style.transition = 'opacity 0.3s ease-in-out';
        
        // Hiệu ứng ánh sáng
        lightEffect.style.opacity = '0.15';
        lightBeam.style.opacity = '0.3';
        lightBeam.style.animation = 'lightMoveUp 2s ease-in-out infinite';
        
        // Bắt đầu hiệu ứng ánh sáng
        let pos = 0;
        let animationId = null;
        function updateGradient() {
            lightOverlay.style.background = `linear-gradient(45deg, 
                rgba(255, 255, 255, 0.2) 0%,
                rgba(255, 255, 255, 0.1) 20%,
                rgba(255, 255, 255, 0.3) 30%,
                rgba(255, 255, 255, 0.6) 40%,
                rgba(255, 255, 255, 0.8) 50%,
                rgba(255, 255, 255, 0.6) 60%,
                rgba(255, 255, 255, 0.3) 70%,
                rgba(255, 255, 255, 0.1) 80%,
                rgba(255, 255, 255, 0.2) 100%)`;
            lightOverlay.style.backgroundSize = '200% 200%';
            lightOverlay.style.backgroundPosition = `50% 50%`;
            
            animationId = requestAnimationFrame(updateGradient);
        }
        updateGradient();
        lightOverlay.style.opacity = '0.05';
    });
    
    // Thêm sự kiện khi di chuột ra
    card.addEventListener('mouseleave', function() {
        // Reset spring về trạng thái ban đầu
        spring.target.x = 0;
        spring.target.y = 0;
        spring.target.z = 0;
        spring.target.glareOpacity = 0;
        spring.target.glareX = 50;
        spring.target.glareY = 50;
        
        // Đổi mức độ damping khi reset (để trở về nhanh hơn, mượt hơn)
        const oldDamping = spring.damping;
        spring.damping = 0.15;
        
        // Đặt lại damping sau khi animation hoàn tất
        setTimeout(() => {
            spring.damping = oldDamping;
        }, 800);
        
        // Ẩn hiệu ứng ánh sáng
        lightEffect.style.opacity = '0';
        lightOverlay.style.opacity = '0';
        lightBeam.style.opacity = '0';
        lightBeam.style.animation = '';
        
        // Đảm bảo hủy bỏ mọi animation
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    });
    
    // Thêm hiệu ứng click
    card.addEventListener('click', function() {
        // Lưu trạng thái trước đó
        const prevValues = {
            x: spring.target.x,
            y: spring.target.y,
            z: spring.target.z
        };
        
        // Animation mở rộng (zoom out nhẹ) rồi quay lại
        const expandCard = () => {
            // Tạm thởi ngừng mousemove
            card.removeEventListener('mousemove', updateMousePosition);
            
            // Animation xoay 360 độ
            let startTime = null;
            const duration = 1000;
            
            function rotateAnimation(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Tính toán góc xoay dựa trên sin để có hiệu ứng nhịp nhàng
                const angle = progress * Math.PI * 2; // 0 -> 2PI (một vòng tròn)
                const scale = 1 + 0.05 * Math.sin(progress * Math.PI); // Phóng to nhẹ ở giữa
                
                // Tính toán góc xoay mới
                spring.target.z = 180 * Math.sin(angle);
                
                // Áp dụng scale
                card.style.transform = `translate(-50%, -50%) 
                    perspective(810px) 
                    rotateX(${spring.current.x}deg) 
                    rotateY(${spring.current.y}deg) 
                    rotateZ(${spring.current.z}deg)
                    scale(${scale})`;
                
                if (progress < 1) {
                    requestAnimationFrame(rotateAnimation);
                } else {
                    // Trở về bình thường
                    spring.target.x = prevValues.x;
                    spring.target.y = prevValues.y;
                    spring.target.z = prevValues.z;
                    
                    // Trả lại sự kiện mousemove
                    card.addEventListener('mousemove', updateMousePosition);
                }
            }
            
            requestAnimationFrame(rotateAnimation);
        };
        
        expandCard();
    });
});
