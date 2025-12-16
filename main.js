// 1. 仅保留图片文件名（无需手动标注大小）
const imageList = [
    { name: 'img1.jpg' },
    { name: 'img2.jpg' },
    { name: 'img3.jpg' },
    { name: 'img4.jpg' },
    { name: 'img5.jpg' },
    { name: 'img6.jpg' },
    { name: 'img7.jpg' },
    { name: 'img8.jpg' },
    { name: 'img9.jpg' },
    { name: 'img10.jpg' }
];

// 2. 工具函数：字节转换为 KB/MB（保留1位小数）
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
}

// 3. 工具函数：获取图片文件的实际大小（通过Content-Length响应头）
async function getImageSize(imgName) {
    const imgUrl = `./images/${imgName}`;
    try {
        const response = await fetch(imgUrl, { method: 'HEAD' }); // 只请求响应头，不下载图片
        if (!response.ok) throw new Error('获取大小失败');
        // 获取文件字节数（Content-Length）
        const contentLength = response.headers.get('Content-Length');
        if (!contentLength) return '未知大小';
        // 转换为易读格式
        return formatFileSize(Number(contentLength));
    } catch (err) {
        console.error(`获取${imgName}大小失败：`, err);
        return '获取失败';
    }
}

// 4. 获取图片列表容器
const imageListContainer = document.getElementById('image-list');

// 5. 遍历图片列表，自动获取大小 + 加载图片 + 计算耗时
async function loadAllImages() {
    for (const imgItem of imageList) {
        // 创建图片卡片
        const card = document.createElement('div');
        card.className = 'image-card';

        // 先获取图片大小
        const imgSize = await getImageSize(imgItem.name);
        // 加载中提示（显示文件名+获取到的大小）
        card.innerHTML = `<div class="loading">加载中...(${imgItem.name} - ${imgSize})</div>`;
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

            // 更新卡片内容（显示图片+自动获取的大小+加载耗时）
            card.innerHTML = `
                <img src="${img.src}" alt="测试图片 ${imgSize}">
                <div class="info">
                    <p>文件大小：<span>${imgSize}</span></p>
                    <p>加载耗时：<span>${loadTime} 毫秒</span></p>
                </div>
            `;
        } catch (err) {
            // 加载失败提示
            card.innerHTML = `<div class="error">加载失败(${imgItem.name} - ${imgSize})：${err.message}</div>`;
        }
    }
}

// 页面加载完成后执行
window.onload = loadAllImages;