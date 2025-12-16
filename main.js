// 1. 核心变量
const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const imageGallery = document.getElementById('image-gallery');
// 模拟“存储文件夹”：用LocalStorage存储图片（Base64格式）
const STORAGE_KEY = 'uploaded_images';

// 2. 工具函数：字节转换为易读单位（KB/MB）
function formatFileSize(bytes) {
    if (!bytes) return '未知大小';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
}

// 3. 从LocalStorage读取所有图片（页面加载时执行）
function loadAllStoredImages() {
    const storedImages = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (storedImages.length === 0) {
        imageGallery.innerHTML = '<div class="empty-tip">暂无上传的图片</div>';
        return;
    }

    // 清空画廊，重新渲染所有图片
    imageGallery.innerHTML = '';
    storedImages.forEach((imgData, index) => {
        renderImageCard(imgData, index);
    });
}

// 4. 渲染单张图片卡片（显示图片+尺寸+加载耗时）
function renderImageCard(imgData, index) {
    const card = document.createElement('div');
    card.className = 'image-card';
    card.innerHTML = `<div class="loading">加载中...</div>`;
    imageGallery.appendChild(card);

    try {
        // 记录从本地存储加载的开始时间
        const startTime = performance.now();
        const img = new Image();
        img.src = imgData.base64; // 从LocalStorage读取Base64图片

        img.onload = () => {
            // 计算加载耗时
            const loadTime = (performance.now() - startTime).toFixed(2);
            // 更新卡片内容
            card.innerHTML = `
                <img src="${imgData.base64}" alt="上传的图片 ${index+1}">
                <div class="image-info">
                    <p>图片名称：<span>${imgData.name}</span></p>
                    <p>文件大小：<span>${formatFileSize(imgData.size)}</span></p>
                    <p>加载耗时：<span>${loadTime} 毫秒</span></p>
                </div>
            `;
        };

        img.onerror = () => {
            card.innerHTML = `<div class="error">图片加载失败</div>`;
        };
    } catch (err) {
        card.innerHTML = `<div class="error">加载异常：${err.message}</div>`;
    }
}

// 5. 处理图片上传
function handleUpload() {
    const files = fileInput.files;
    if (files.length === 0) {
        alert('请选择要上传的图片！');
        return;
    }

    // 读取已存储的图片
    const storedImages = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    // 遍历选中的文件，转Base64并存入LocalStorage
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            // 存储图片信息：名称、大小、Base64数据
            storedImages.push({
                name: file.name,
                size: file.size, // 字节数
                base64: e.target.result
            });
            // 保存到LocalStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(storedImages));
            // 重新渲染所有图片
            loadAllStoredImages();
        };
        // 读取文件为Base64格式
        reader.readAsDataURL(file);
    });

    // 清空文件选择框
    fileInput.value = '';
    alert(`成功选择 ${files.length} 张图片，已存储到本地！`);
}

// 6. 绑定事件
uploadBtn.addEventListener('click', handleUpload);
// 页面加载时读取并展示所有已存储的图片
window.onload = loadAllStoredImages;