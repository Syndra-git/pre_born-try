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

// 尝试加载 Supabase SDK
let supabase = null;
let supabaseLoaded = false;

// 初始化函数
async function initializeApp() {
    try {
        // 尝试从 CDN 加载 Supabase SDK
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.33.1/+esm');
        const { supabaseUrl, supabaseKey } = await import('./supabaseConfig.js');
        
        // 初始化 Supabase
        supabase = createClient(supabaseUrl, supabaseKey);
        supabaseLoaded = true;
        console.log('Supabase SDK 加载成功');
    } catch (error) {
        console.error('Supabase SDK 加载失败:', error);
        supabaseLoaded = false;
        // 提供基本功能，即使 Supabase 加载失败
        initializeBasicFunctions();
    }
}

// 初始化基本功能
function initializeBasicFunctions() {
    // 基本的 showSection 函数
    window.showSection = function(sectionId) {
        try {
            // 隐藏所有部分
            const fillForm = document.getElementById('fill-form');
            const browseGroups = document.getElementById('browse-groups');
            if (fillForm) fillForm.style.display = 'none';
            if (browseGroups) browseGroups.style.display = 'none';
            
            // 显示选中的部分
            const section = document.getElementById(sectionId);
            if (section) section.style.display = 'block';
        } catch (error) {
            console.error('showSection 函数执行失败:', error);
        }
    };
    
    // 基本的 toggleOtherOption 函数
    window.toggleOtherOption = function() {
        try {
            const shareType = document.getElementById('share-type');
            const otherTypeContainer = document.getElementById('other-type-container');
            if (shareType && otherTypeContainer) {
                if (shareType.value === '其他') {
                    otherTypeContainer.style.display = 'block';
                } else {
                    otherTypeContainer.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('toggleOtherOption 函数执行失败:', error);
        }
    };
    
    // 基本的搜索函数
    window.searchResources = function() {
        alert('搜索功能暂时不可用，请稍后再试');
    };
    
    window.searchGroups = function() {
        alert('搜索功能暂时不可用，请稍后再试');
    };
    
    // 基本的提交函数
    window.submitShare = function(event) {
        event.preventDefault();
        alert('提交功能暂时不可用，请稍后再试');
    };
    
    window.submitGroupForm = function(event) {
        event.preventDefault();
        alert('提交功能暂时不可用，请稍后再试');
    };
    
    // 基本的加载函数
    window.loadShares = function() {
        console.log('加载分享内容...');
    };
    
    window.loadGroups = function() {
        console.log('加载小组申请...');
    };
}

// 立即初始化应用
initializeApp();

// 学习资源查询页面功能
async function searchResources() {
    if (!supabaseLoaded) {
        alert('搜索功能暂时不可用，请稍后再试');
        return;
    }
    
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        await filterPosts(searchTerm);
    } else {
        alert('请输入搜索关键词');
    }
}

async function searchByTag(tag) {
    const searchInput = document.getElementById('search-input');
    searchInput.value = tag;
    await searchResources();
}

// 根据关键词过滤帖子
async function filterPosts(searchTerm) {
    if (!supabaseLoaded) {
        alert('搜索功能暂时不可用，请稍后再试');
        return;
    }
    
    const searchResults = document.getElementById('search-results');
    try {
        // 从 Supabase 获取所有分享
        const { data, error } = await supabase
            .from('shares')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error searching shares:', error);
            alert('搜索失败，请重试');
            return;
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
                post.innerHTML = `
                    <h3>${share.title}</h3>
                    <div class="course-info">${share.courseName} ${share.shareType}</div>
                    <div class="content">${share.content}</div>
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
        alert('搜索失败，请重试');
    }
}

// 加载分享内容
async function loadShares() {
    if (!supabaseLoaded) {
        console.log('Supabase 未加载，无法加载分享内容');
        return;
    }
    
    const searchResults = document.getElementById('search-results');
    try {
        // 从 Supabase 获取分享
        const { data, error } = await supabase
            .from('shares')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error loading shares:', error);
            return;
        }
        
        // 清空现有内容
        const existingPosts = searchResults.querySelectorAll('.post');
        existingPosts.forEach(post => post.remove());
        
        // 为每个分享创建帖子元素
        data.forEach(share => {
            const post = document.createElement('div');
            post.className = 'post';
            post.innerHTML = `
                <h3>${share.title}</h3>
                <div class="course-info">${share.courseName} ${share.shareType}</div>
                <div class="content">${share.content}</div>
            `;
            searchResults.appendChild(post);
        });
    } catch (error) {
        console.error('Error loading shares:', error);
    }
}

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

async function submitShare(event) {
    event.preventDefault();
    
    if (!supabaseLoaded) {
        alert('提交功能暂时不可用，请稍后再试');
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
    const shareContent = document.getElementById('share-content').value;
    
    if (courseName && finalShareType && shareTitle && shareContent) {
        // 存储到 Supabase
        const { error } = await supabase
            .from('shares')
            .insert({
                title: shareTitle,
                courseName: courseName,
                shareType: finalShareType,
                content: shareContent
            });
        
        if (error) {
            console.error('Error inserting share:', error);
            alert('提交失败，请重试');
        } else {
            alert('分享提交成功！');
            // 跳转到学习资源查询页面
            window.location.href = 'resources.html';
        }
    } else {
        alert('请填写完整的分享信息');
    }
}

// 互助小组页面功能
function showSection(sectionId) {
    // 隐藏所有部分
    document.getElementById('fill-form').style.display = 'none';
    document.getElementById('browse-groups').style.display = 'none';
    
    // 显示选中的部分
    document.getElementById(sectionId).style.display = 'block';
}

async function submitGroupForm(event) {
    event.preventDefault();
    
    if (!supabaseLoaded) {
        alert('提交功能暂时不可用，请稍后再试');
        return;
    }
    
    const name = document.getElementById('name').value;
    const introduction = document.getElementById('introduction').value;
    const needs = document.getElementById('needs').value;
    const contact = document.getElementById('contact').value;
    
    if (name && introduction && needs && contact) {
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
            await loadGroups();
        }
    } else {
        alert('请填写完整的表单信息');
    }
}

// 加载小组申请
async function loadGroups() {
    if (!supabaseLoaded) {
        console.log('Supabase 未加载，无法加载小组申请');
        return;
    }
    
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
        // 从 Supabase 获取小组申请
        const { data, error } = await supabase
            .from('groups')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error loading groups:', error);
            return;
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

// 互助小组搜索功能
async function searchGroups() {
    if (!supabaseLoaded) {
        alert('搜索功能暂时不可用，请稍后再试');
        return;
    }
    
    const searchInput = document.getElementById('group-search-input');
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        await filterGroups(searchTerm);
    } else {
        alert('请输入搜索关键词');
    }
}

// 根据关键词过滤小组申请
async function filterGroups(searchTerm) {
    if (!supabaseLoaded) {
        alert('搜索功能暂时不可用，请稍后再试');
        return;
    }
    
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
        // 从 Supabase 获取所有小组申请
        const { data, error } = await supabase
            .from('groups')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error searching groups:', error);
            alert('搜索失败，请重试');
            return;
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
        alert('搜索失败，请重试');
    }
}

// 暴露函数到全局作用域
window.searchResources = searchResources;
window.searchByTag = searchByTag;
window.filterPosts = filterPosts;
window.loadShares = loadShares;
window.toggleOtherOption = toggleOtherOption;
window.submitShare = submitShare;
window.showSection = showSection;
window.submitGroupForm = submitGroupForm;
window.loadGroups = loadGroups;
window.searchGroups = searchGroups;
window.filterGroups = filterGroups;