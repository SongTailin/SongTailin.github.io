// 当前显示的组索引
let currentIndex = 0;

// 获取图片+文本组滑动区域元素
const slider = document.querySelector('.slider');

// 获取所有图片+文本组的容器
const slides = document.querySelectorAll('.slide');

// 组总数
const totalSlides = slides.length;

// 切换到下一组
function nextSlide() {
    if (currentIndex < totalSlides - 1) {
        currentIndex++; // 如果未到最后一组，索引加1
    } else {
        currentIndex = 0; // 如果已经是最后一组，回到第一组
    }
    updateSlider(); // 更新滑动区域位置
}

// 切换到上一组
function prevSlide() {
    if (currentIndex > 0) {
        currentIndex--; // 如果未到第一组，索引减1
    } else {
        currentIndex = totalSlides - 1; // 如果已经是第一组，跳到最后一组
    }
    updateSlider(); // 更新滑动区域位置
}

// 更新滑动区域位置
function updateSlider() {
    const offset = -currentIndex * 100; // 计算滑动偏移量
    slider.style.transform = `translateX(${offset}%)`; // 应用滑动效果
}

// 自动切换功能
let autoSlideInterval;

// 启动自动切换
function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000); // 每5秒切换到下一组
}

// 停止自动切换
function stopAutoSlide() {
    clearInterval(autoSlideInterval); // 清除定时器
}

// 初始化自动切换
startAutoSlide();

// 鼠标悬停时停止自动切换
slider.addEventListener('mouseenter', stopAutoSlide);

// 鼠标离开时恢复自动切换
slider.addEventListener('mouseleave', startAutoSlide);