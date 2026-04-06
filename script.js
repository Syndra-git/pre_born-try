import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.33.1/+esm';
import { supabaseUrl, supabaseKey } from './supabaseConfig.js';

// 初始化 Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// 测试 Supabase 连接
async function testSupabaseConnection() {
    try {
        // 尝试执行一个简单的查询来测试连接
        const { data, error } = await supabase
            .from('shares')
            .select('*')
            .limit(1);
        
        if (error) {
            console.error('Supabase 连接失败:', error);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Supabase 连接异常:', error);
        return false;
    }
}

// 检查是否使用本地存储模式
let useLocalStorage = false;

// 页面加载时测试连接
window.onload = function() {
    testSupabaseConnection().then((connected) => {
        if (!connected) {
            console.warn('Supabase 连接失败，将使用本地存储模式');
            useLocalStorage = true;
        }
    });
};

// 全局变量，用于存储函数
window.loadShares = null;
window.searchResources = null;
window.searchByTag = null;
window.filterPosts = null;
window.toggleOtherOption = null;
window.submitShare = null;
window.showSection = null;
window.submitGroupForm = null;
window.loadGroups = null;
window.searchGroups = null;
window.filterGroups = null;

// 学习资源查询页面功能
function searchResources() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        filterPosts(searchTerm);
    } else {
        alert('请输入搜索关键词');
    }
}
window.searchResources = searchResources;

function searchByTag(tag) {
    const searchInput = document.getElementById('search-input');
    searchInput.value = tag;
    searchResources();
}
window.searchByTag = searchByTag;

// 根据关键词过滤帖子
async function filterPosts(searchTerm) {
    const searchResults = document.getElementById('search-results');
    try {
        let data = [];
        
        if (useLocalStorage) {
            // 从本地存储获取分享
            data = JSON.parse(localStorage.getItem('shares') || '[]');
        } else {
            // 从 Supabase 获取所有分享
            const { data: supabaseData, error } = await supabase
                .from('shares')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Error searching shares:', error);
                return;
            }
            
            data = supabaseData;
        }
        
        // 清空现有内容
        const existingPosts = searchResults.querySelectorAll('.post');
        existingPosts.forEach(post => post.remove());
        
        let found = false;
        // 为每个匹配的分享创建帖子元素
        data.forEach(share => {
            const title = share.title.toLowerCase();
            const courseInfo = `${share.courseName} ${share.shareType}`.toLowerCase();
            const content = share.content.toLowerCase();
            
            if (title.includes(searchTerm.toLowerCase()) || 
                courseInfo.includes(searchTerm.toLowerCase()) || 
                content.includes(searchTerm.toLowerCase())) {
                const post = document.createElement('div');
                post.className = 'post';
                
                // 检查是否有文件信息
                let contentHTML = share.content;
                if (share.fileInfo && share.fileInfo.url) {
                    contentHTML = `<a href="${share.fileInfo.url}" target="_blank">下载文件：${share.fileInfo.name}</a>`;
                }
                
                post.innerHTML = `
                    <h3>${share.title}</h3>
                    <div class="course-info">${share.courseName} ${share.shareType}</div>
                    <div class="content">${contentHTML}</div>
                `;
                searchResults.appendChild(post);
                found = true;
            }
        });
        
        if (!found) {
            alert('没有找到相关内容，请尝试其他关键词');
        }
    } catch (error) {
        console.error('Error searching shares:', error);
    }
}
window.filterPosts = filterPosts;

// 加载分享内容
async function loadShares() {
    const searchResults = document.getElementById('search-results');
    try {
        let data = [];
        
        if (useLocalStorage) {
            // 从本地存储获取分享
            data = JSON.parse(localStorage.getItem('shares') || '[]');
        } else {
            // 从 Supabase 获取分享
            const { data: supabaseData, error } = await supabase
                .from('shares')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Error loading shares:', error);
                return;
            }
            
            data = supabaseData;
        }
        
        // 清空现有内容
        const existingPosts = searchResults.querySelectorAll('.post');
        existingPosts.forEach(post => post.remove());
        
        // 为每个分享创建帖子元素
        data.forEach(share => {
            const post = document.createElement('div');
            post.className = 'post';
            
            // 检查是否有文件信息
            let contentHTML = share.content;
            if (share.fileInfo && share.fileInfo.url) {
                contentHTML = `<a href="${share.fileInfo.url}" target="_blank">下载文件：${share.fileInfo.name}</a>`;
            }
            
            post.innerHTML = `
                <h3>${share.title}</h3>
                <div class="course-info">${share.courseName} ${share.shareType}</div>
                <div class="content">${contentHTML}</div>
            `;
            searchResults.appendChild(post);
        });
    } catch (error) {
        console.error('Error loading shares:', error);
    }
}
window.loadShares = loadShares;

// 资源分享页面功能
function toggleOtherOption() {
    const shareType = document.getElementById('share-type');
    const otherTypeContainer = document.getElementById('other-type-container');
    if (shareType.value === '其他') {
        otherTypeContainer.style.display = 'block';
    } else {
        otherTypeContainer.style.display = 'none';
    }
}
window.toggleOtherOption = toggleOtherOption;

async function submitShare(event) {
    event.preventDefault();
    // 检查登录状态
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        alert('请先登录');
        window.location.href = 'login.html';
        return;
    }
    
    const courseName = document.getElementById('course-name').value;
    const shareType = document.getElementById('share-type').value;
    let finalShareType = shareType;
    if (shareType === '其他') {
        const otherType = document.getElementById('other-type').value;
        if (otherType) {
            finalShareType = otherType;
        }
    }
    const shareTitle = document.getElementById('share-title').value;
    const contentType = document.querySelector('input[name="content-type"]:checked').value;
    
    let content = '';
    let fileInfo = null;
    let fileUrl = null;
    
    if (contentType === 'text') {
        content = document.getElementById('share-content').value;
        if (!content) {
            alert('请输入文本内容');
            return;
        }
    } else if (contentType === 'file') {
        const fileInput = document.getElementById('share-file');
        const file = fileInput.files[0];
        if (!file) {
            alert('请选择要上传的文件');
            return;
        }
        
        // 检查文件类型
        const allowedTypes = ['.zip', '.pdf', '.doc', '.docx', '.txt'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!allowedTypes.includes(fileExtension)) {
            alert('不支持的文件类型，请上传 zip、pdf、word 或 txt 文件');
            return;
        }
        
        // 检查文件大小（限制为10MB）
        if (file.size > 10 * 1024 * 1024) {
            alert('文件大小超过限制，请上传小于10MB的文件');
            return;
        }
        
        // 上传文件到 Supabase Storage
        if (!useLocalStorage) {
            const { data, error } = await supabase
                .storage
                .from('share-files')
                .upload(`${Date.now()}-${file.name}`, file);
            
            if (error) {
                console.error('Error uploading file:', error);
                alert('文件上传失败，请重试');
                return;
            }
            
            // 生成签名 URL（有效期 7 天）
            const { data: urlData } = await supabase
                .storage
                .from('share-files')
                .createSignedUrl(data.path, 60 * 60 * 24 * 7); // 7 天有效期
            
            fileUrl = urlData.signedUrl;
        }
        
        fileInfo = {
            name: file.name,
            type: file.type,
            size: file.size,
            url: fileUrl
        };
        
        content = `[文件] ${file.name}`;
    }
    
    if (courseName && finalShareType && shareTitle) {
        try {
            if (useLocalStorage) {
                // 使用本地存储
                const shares = JSON.parse(localStorage.getItem('shares') || '[]');
                shares.unshift({
                    id: Date.now().toString(),
                    title: shareTitle,
                    courseName: courseName,
                    shareType: finalShareType,
                    content: content,
                    fileInfo: fileInfo,
                    created_at: new Date().toISOString()
                });
                localStorage.setItem('shares', JSON.stringify(shares));
                alert('分享提交成功！');
                // 跳转到学习资源查询页面
                window.location.href = 'resources.html';
            } else {
                // 存储到 Supabase
                const { error } = await supabase
                    .from('shares')
                    .insert({
                        title: shareTitle,
                        courseName: courseName,
                        shareType: finalShareType,
                        content: content,
                        fileInfo: fileInfo
                    });
                
                if (error) {
                    console.error('Error inserting share:', error);
                    alert('提交失败，请重试');
                } else {
                    alert('分享提交成功！');
                    // 跳转到学习资源查询页面
                    window.location.href = 'resources.html';
                }
            }
        } catch (error) {
            console.error('Error submitting share:', error);
            alert('提交失败，请重试');
        }
    } else {
        alert('请填写完整的分享信息');
    }
}
window.submitShare = submitShare;

// 互助小组页面功能
function showSection(sectionId) {
    // 隐藏所有部分
    document.getElementById('fill-form').style.display = 'none';
    document.getElementById('browse-groups').style.display = 'none';
    
    // 显示选中的部分
    document.getElementById(sectionId).style.display = 'block';
}
window.showSection = showSection;

async function submitGroupForm(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const introduction = document.getElementById('introduction').value;
    const needs = document.getElementById('needs').value;
    const contact = document.getElementById('contact').value;
    
    if (name && introduction && needs && contact) {
        try {
            if (useLocalStorage) {
                // 使用本地存储
                const groups = JSON.parse(localStorage.getItem('groups') || '[]');
                groups.unshift({
                    id: Date.now().toString(),
                    name: name,
                    introduction: introduction,
                    needs: needs,
                    contact: contact,
                    created_at: new Date().toISOString()
                });
                localStorage.setItem('groups', JSON.stringify(groups));
                alert('表单提交成功！');
                // 显示浏览页面
                showSection('browse-groups');
                // 重新加载小组列表
                loadGroups();
            } else {
                // 存储到 Supabase
                const { error } = await supabase
                    .from('groups')
                    .insert({
                        name: name,
                        introduction: introduction,
                        needs: needs,
                        contact: contact
                    });
                
                if (error) {
                    console.error('Error inserting group:', error);
                    alert('提交失败，请重试');
                } else {
                    alert('表单提交成功！');
                    // 显示浏览页面
                    showSection('browse-groups');
                    // 重新加载小组列表
                    loadGroups();
                }
            }
        } catch (error) {
            console.error('Error submitting group form:', error);
            alert('提交失败，请重试');
        }
    } else {
        alert('请填写完整的表单信息');
    }
}
window.submitGroupForm = submitGroupForm;

// 加载小组申请
async function loadGroups() {
    const browseGroups = document.getElementById('browse-groups');
    const searchSection = browseGroups.querySelector('.search-section');
    
    // 移除所有帖子元素（保留标题和搜索栏）
    const children = Array.from(browseGroups.children);
    children.forEach(child => {
        if (child.tagName !== 'H2' && child !== searchSection) {
            browseGroups.removeChild(child);
        }
    });
    
    try {
        let data = [];
        
        if (useLocalStorage) {
            // 从本地存储获取小组申请
            data = JSON.parse(localStorage.getItem('groups') || '[]');
        } else {
            // 从 Supabase 获取小组申请
            const { data: supabaseData, error } = await supabase
                .from('groups')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Error loading groups:', error);
                return;
            }
            
            data = supabaseData;
        }
        
        // 为每个小组申请创建帖子元素
        data.forEach(group => {
            const post = document.createElement('div');
            post.className = 'post';
            post.innerHTML = `
                <h3>${group.name} - 互助小组申请</h3>
                <div class="meta">联系方式：${group.contact}</div>
                <div class="content">
                    <strong>简介：</strong>${group.introduction}<br>
                    <strong>需求：</strong>${group.needs}
                </div>
            `;
            // 添加到搜索栏下方
            browseGroups.appendChild(post);
        });
    } catch (error) {
        console.error('Error loading groups:', error);
    }
}
window.loadGroups = loadGroups;

// 互助小组搜索功能
function searchGroups() {
    const searchInput = document.getElementById('group-search-input');
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        filterGroups(searchTerm);
    } else {
        alert('请输入搜索关键词');
    }
}
window.searchGroups = searchGroups;

// 根据关键词过滤小组申请
async function filterGroups(searchTerm) {
    const browseGroups = document.getElementById('browse-groups');
    const searchSection = browseGroups.querySelector('.search-section');
    
    // 移除所有帖子元素（保留标题和搜索栏）
    const children = Array.from(browseGroups.children);
    children.forEach(child => {
        if (child.tagName !== 'H2' && child !== searchSection) {
            browseGroups.removeChild(child);
        }
    });
    
    try {
        let data = [];
        
        if (useLocalStorage) {
            // 从本地存储获取小组申请
            data = JSON.parse(localStorage.getItem('groups') || '[]');
        } else {
            // 从 Supabase 获取所有小组申请
            const { data: supabaseData, error } = await supabase
                .from('groups')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Error searching groups:', error);
                return;
            }
            
            data = supabaseData;
        }
        
        let found = false;
        // 为每个匹配的小组申请创建帖子元素
        data.forEach(group => {
            const title = `${group.name} - 互助小组申请`.toLowerCase();
            const meta = `联系方式：${group.contact}`.toLowerCase();
            const content = `简介：${group.introduction} 需求：${group.needs}`.toLowerCase();
            
            if (title.includes(searchTerm.toLowerCase()) || 
                meta.includes(searchTerm.toLowerCase()) || 
                content.includes(searchTerm.toLowerCase())) {
                const post = document.createElement('div');
                post.className = 'post';
                post.innerHTML = `
                    <h3>${group.name} - 互助小组申请</h3>
                    <div class="meta">联系方式：${group.contact}</div>
                    <div class="content">
                        <strong>简介：</strong>${group.introduction}<br>
                        <strong>需求：</strong>${group.needs}
                    </div>
                `;
                browseGroups.appendChild(post);
                found = true;
            }
        });
        
        if (!found) {
            alert('没有找到相关内容，请尝试其他关键词');
        }
    } catch (error) {
        console.error('Error searching groups:', error);
    }
}
window.filterGroups = filterGroups;