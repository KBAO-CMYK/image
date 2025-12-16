// 1. 定义图片列表（文件名 + 手动标注的文件大小，方便展示）
const imageList = [
    { name: 'img1.jpg', size: '50KB' },
    { name: 'img2.jpg', size: '100KB' },
    { name: 'img3.jpg', size: '500KB' },
    { name: 'img4.jpg', size: '1MB' },
    { name: 'img5.jpg', size: '2MB' },
    { name: 'img6.jpg', size: '3MB' },
    { name: 'img7.jpg', size: '5MB' },
    { name: 'img8.jpg', size: '8MB' },
    { name: 'img9.jpg', size: '10MB' },
    { name: 'img10.jpg', size: '15MB' }
];

// 2. 获取图片列表容器
const imageListContainer = document.getElementById('image-list');

// 3. 遍历图片列表，逐个加载并计算耗时
async function loadAllImages() {
    for (const imgItem of imageList) {
        // 创建图片卡片
        const card = document.createElement('div');
        card.className = 'image-card';

        // 加载中提示
        card.innerHTML = `<div class="loading">加载中...(${imgItem.size})</div>`;
        imageListContainer.appendChild(card);

        try {
            // 记录加载开始时间
            const startTime = performance.now();

            // 创建图片对象
            const img = new Image();
            img.src = `./images/${imgItem.name}`; // 图片路径

            // 等待图片加载完成
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            // 计算加载耗时（毫秒，保留2位小数）
            const loadTime = (performance.now() - startTime).toFixed(2);

            // 更新卡片内容（显示图片+信息）
            card.innerHTML = `
                <img src="${img.src}" alt="测试图片 ${imgItem.size}">
                <div class="info">
                    <p>文件大小：<span>${imgItem.size}</span></p>
                    <p>加载耗时：<span>${loadTime} 毫秒</span></p>
                </div>
            `;
        } catch (err) {
            // 加载失败提示
            card.innerHTML = `<div class="error">加载失败(${imgItem.size})：${err.message}</div>`;
        }
    }
}

// 页面加载完成后执行
window.onload = loadAllImages;