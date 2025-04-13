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
    fetch('data/ssq_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP错误! 状态码: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // 将对象转换为数组格式
            allData = Object.entries(data).map(([period, value]) => {
                const [redBalls, blueBall] = value.split(',').slice(0, 6).join(',').split(',').slice(-1)[0];
                return {
                    period,
                    redBalls: value.split(',').slice(0, 6),
                    blueBall: value.split(',').slice(-1)[0]
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
}

// 更新显示
function updateDisplay() {
    const rowsPerPage = parseInt(rowsPerPageSelect.value) || ROWS_PER_PAGE;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = rowsPerPage === 'all' ? allData.length : startIndex + rowsPerPage;
    const pageData = rowsPerPage === 'all' ? allData : allData.slice(startIndex, endIndex);
    
    renderTable(pageData);
    renderPagination();
}

// 渲染表格数据
function renderTable(data) {
    resultsBody.innerHTML = '';
    
    data.forEach(item => {
        const row = document.createElement('tr');
        
        // 期号
        const periodCell = document.createElement('td');
        periodCell.textContent = item.period;
        row.appendChild(periodCell);
        
        // 红球
        const redBallsCell = document.createElement('td');
        item.redBalls.forEach(ball => {
            const ballSpan = document.createElement('span');
            ballSpan.className = 'ball red-ball';
            ballSpan.textContent = ball;
            redBallsCell.appendChild(ballSpan);
        });
        row.appendChild(redBallsCell);
        
        // 蓝球
        const blueBallCell = document.createElement('td');
        const blueBallSpan = document.createElement('span');
        blueBallSpan.className = 'ball blue-ball';
        blueBallSpan.textContent = item.blueBall;
        blueBallCell.appendChild(blueBallSpan);
        row.appendChild(blueBallCell);
        
        resultsBody.appendChild(row);
    });
}

// 渲染分页控件
function renderPagination() {
    const rowsPerPage = parseInt(rowsPerPageSelect.value) || ROWS_PER_PAGE;
    totalPages = rowsPerPage === 'all' ? 1 : Math.ceil(allData.length / rowsPerPage);
    
    pagination.innerHTML = '';
    
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

// 初始化页面
window.addEventListener('DOMContentLoaded', init);