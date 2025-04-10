document.addEventListener('DOMContentLoaded', function() {
    // 获取所有滑块容器
    const sliderContainers = document.querySelectorAll('.slider-container');
    
    sliderContainers.forEach(container => {
        // 为每个滑块创建独立的状态
        let currentIndex = 0;
        const slider = container.querySelector('.slider');
        const slides = container.querySelectorAll('.slide');
        const totalSlides = slides.length;
        let autoSlideInterval;
        
        // 初始化滑块
        updateSlider();
        startAutoSlide();
        
        // 获取当前滑块的按钮并添加事件监听
        const prevBtn = container.querySelector('.prev-btn');
        const nextBtn = container.querySelector('.next-btn');
        
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // 鼠标悬停控制
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
        
        // 切换到下一组
        function nextSlide() {
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateSlider();
        }
        
        // 切换到上一组
        function prevSlide() {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = totalSlides - 1;
            }
            updateSlider();
        }
        
        // 更新滑动区域位置
        function updateSlider() {
            const offset = -currentIndex * 100;
            slider.style.transform = `translateX(${offset}%)`;
        }
        
        // 启动自动切换
        function startAutoSlide() {
            stopAutoSlide(); // 先停止现有的定时器
            autoSlideInterval = setInterval(nextSlide, 5000);
        }
        
        // 停止自动切换
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }
    });
});