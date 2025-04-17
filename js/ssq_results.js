// 加载双色球开奖数据并实现分页功能
const ROWS_PER_PAGE = 50;
let currentPage = 1;
let totalPages = 1;
let allData = [];

// 获取DOM元素
const resultsBody = document.getElementById('results-body');
const pagination = document.getElementById('pagination');
const rowsPerPageSelect = document.getElementById('rows-per-page');

// 初始化页面
function init() {
    loadData();
    setupEventListeners();
}

// 加载JSON数据
function loadData() {
    console.log('开始加载数据...');
    fetch('../data/ssq_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP错误! 状态码: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // 将对象转换为数组格式
            allData = Object.entries(data).sort((a, b) => b[0].localeCompare(a[0])).map(([period, numbers]) => {
                const nums = numbers.split(',');
                return {
                    period,
                    numbers: nums,
                    redBalls: nums.slice(0, 6),
                    blueBall: nums[6]
                };
            });
            console.log('数据加载成功，共加载', allData.length, '条记录');
            updateDisplay();
        })
        .catch(error => {
            console.error('加载数据失败:', error);
            alert('数据加载失败，请检查控制台查看详情');
        });
}

// 设置事件监听器
function setupEventListeners() {
    rowsPerPageSelect.addEventListener('change', () => {
        currentPage = 1;
        updateDisplay();
    });
    
    document.getElementById('search-btn').addEventListener('click', () => {
        const searchTerm = document.getElementById('period-search').value.trim();
        if (searchTerm) {
            const filteredData = allData.filter(item => item.period.startsWith(searchTerm));
            rowsPerPageSelect.value = 'all';
            renderTable(filteredData);
            document.getElementById('pagination').style.display = 'none';
        } else {
            document.getElementById('pagination').style.display = 'flex';
            updateDisplay();
        }
    });
    
    
    document.getElementById('reset-btn').addEventListener('click', () => {
        document.getElementById('period-search').value = '';
        currentPage = 1;
        document.getElementById('pagination').style.display = 'flex';
        updateDisplay();
    });
}

// 更新显示
function updateDisplay() {
    const rowsPerPage = rowsPerPageSelect.value;
    const startIndex = (currentPage - 1) * (rowsPerPage === 'all' ? allData.length : parseInt(rowsPerPage));
    const endIndex = rowsPerPage === 'all' ? allData.length : startIndex + parseInt(rowsPerPage);
    const pageData = rowsPerPage === 'all' ? allData : allData.slice(startIndex, endIndex);
    
    renderTable(pageData);
    renderPagination();
}

// 渲染表格数据
function renderTable(data) {
    resultsBody.innerHTML = '';
    
    if (!Array.isArray(data)) {
        console.error('renderTable: data参数必须是数组', data);
        return;
    }
    
    data.forEach(item => {
        const row = document.createElement('tr');
        
        // 期号
        const periodCell = document.createElement('td');
        periodCell.textContent = item.period;
        row.appendChild(periodCell);
        
        // 红球
        const redCell = document.createElement('td');
        item.redBalls.forEach(num => {
            const ball = document.createElement('span');
            ball.className = 'ball red-ball';  // 修改为与首页相同的类名
            ball.textContent = num;
            redCell.appendChild(ball);
        });
        row.appendChild(redCell);
        
        // 蓝球
        const blueCell = document.createElement('td');
        const blueBall = document.createElement('span');
        blueBall.className = 'ball blue-ball';  // 修改为与首页相同的类名
        blueBall.textContent = item.blueBall;
        blueCell.appendChild(blueBall);
        row.appendChild(blueCell);
        
        // 计算统计数据
        const stats = calculateStats(item.redBalls, item.blueBall);  // 改为使用item.redBalls和item.blueBall
        
        // 和值
        const sumCell = document.createElement('td');
        sumCell.textContent = stats.sum;
        row.appendChild(sumCell);
        
        // 跨度
        const spanCell = document.createElement('td');
        spanCell.textContent = stats.span;
        row.appendChild(spanCell);
        
        // 区间比
        const zoneCell = document.createElement('td');
        zoneCell.textContent = stats.zoneRatio;
        row.appendChild(zoneCell);
        
        // 奇偶比
        const oddEvenCell = document.createElement('td');
        oddEvenCell.textContent = stats.oddEvenRatio;
        row.appendChild(oddEvenCell);
        
        resultsBody.appendChild(row);
    });
}

// 渲染分页控件
function renderPagination() {
    const rowsPerPage = rowsPerPageSelect.value;
    totalPages = rowsPerPage === 'all' ? 1 : Math.ceil(allData.length / parseInt(rowsPerPage));
    
    pagination.innerHTML = '';
    
    if (rowsPerPage === 'all') {
        const pageButton = document.createElement('button');
        pageButton.textContent = '1';
        pageButton.className = 'active';
        pagination.appendChild(pageButton);
        return;
    }
    
    // 上一页按钮
    const prevButton = document.createElement('button');
    prevButton.textContent = '上一页';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateDisplay();
        }
    });
    pagination.appendChild(prevButton);
    
    // 页码按钮
    const maxVisiblePages = 7;
    let startPage = Math.max(1, currentPage - 3);
    let endPage = Math.min(totalPages, currentPage + 3);
    
    // 确保显示7个页码
    if (endPage - startPage + 1 < maxVisiblePages) {
        if (startPage === 1) {
            endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        } else {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
    }
    
    // 第一页按钮
    if (startPage > 1) {
        const firstButton = document.createElement('button');
        firstButton.textContent = '1';
        firstButton.className = currentPage === 1 ? 'active' : '';
        firstButton.addEventListener('click', () => {
            currentPage = 1;
            updateDisplay();
        });
        pagination.appendChild(firstButton);
        
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            pagination.appendChild(ellipsis);
        }
    }
    
    // 中间页码
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = currentPage === i ? 'active' : '';
        pageButton.addEventListener('click', () => {
            currentPage = i;
            updateDisplay();
        });
        pagination.appendChild(pageButton);
    }
    
    // 最后一页按钮
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            pagination.appendChild(ellipsis);
        }
        
        const lastButton = document.createElement('button');
        lastButton.textContent = totalPages;
        lastButton.className = currentPage === totalPages ? 'active' : '';
        lastButton.addEventListener('click', () => {
            currentPage = totalPages;
            updateDisplay();
        });
        pagination.appendChild(lastButton);
    }
    
    // 下一页按钮
    const nextButton = document.createElement('button');
    nextButton.textContent = '下一页';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updateDisplay();
        }
    });
    pagination.appendChild(nextButton);
}

// 返回顶部按钮功能
function setupBackToTopButton() {
    const backToTop = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 初始化页面
window.addEventListener('DOMContentLoaded', () => {
    init();
    setupBackToTopButton();
});

// 在renderTable函数中添加以下计算逻辑
function calculateStats(redBalls, blueBall) {
    // 计算和值（红球号码总和）
    const sum = redBalls.reduce((total, num) => total + parseInt(num), 0);
    
    // 计算跨度（最大红球号 - 最小红球号）
    const sorted = [...redBalls].sort((a, b) => a - b);
    const span = sorted[sorted.length - 1] - sorted[0];
    
    // 计算区间比（1-11为一区，12-22为二区，23-33为三区）
    let zones = [0, 0, 0];
    redBalls.forEach(num => {
        if(num <= 11) zones[0]++;
        else if(num <= 22) zones[1]++;
        else zones[2]++;
    });
    const zoneRatio = zones.join(':');
    
    // 计算奇偶比
    let oddEven = [0, 0];
    redBalls.forEach(num => {
        num % 2 === 0 ? oddEven[1]++ : oddEven[0]++;
    });
    const oddEvenRatio = oddEven.join(':');
    
    return {
        sum,
        span,
        zoneRatio,
        oddEvenRatio
    };
}