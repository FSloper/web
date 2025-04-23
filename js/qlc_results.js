// 七乐彩开奖数据处理
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
    fetch('../data/qlc_data.json')
        .then(response => response.json())
        .then(data => {
            allData = Object.entries(data).sort((a, b) => b[0].localeCompare(a[0])).map(([period, numbers]) => {
                const nums = numbers.split(' ');
                return {
                    period,
                    mainNumbers: nums.slice(0, 7),
                    specialNumber: nums[7]
                };
            });
            updateDisplay();
        })
        .catch(error => {
            console.error('加载七乐彩数据失败:', error);
            alert('数据加载失败，请检查JSON文件格式');
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
    
    data.forEach(item => {
        const row = document.createElement('tr');
        
        // 期号
        const periodCell = document.createElement('td');
        periodCell.textContent = item.period;
        row.appendChild(periodCell);
        
        // 主号码
        const mainCell = document.createElement('td');
        item.mainNumbers.forEach(num => {
            const ball = document.createElement('span');
            ball.className = 'ball red-ball';
            ball.textContent = num;
            mainCell.appendChild(ball);
        });
        row.appendChild(mainCell);
        
        // 特别号
        const specialCell = document.createElement('td');
        const specialBall = document.createElement('span');
        specialBall.className = 'ball blue-ball';
        specialBall.textContent = item.specialNumber;
        specialCell.appendChild(specialBall);
        row.appendChild(specialCell);
        
        // 计算统计数据
        const stats = calculateStats(item.mainNumbers);
        
        // 和值
        const sumCell = document.createElement('td');
        sumCell.textContent = stats.sum;
        row.appendChild(sumCell);
        
        // 跨度
        const spanCell = document.createElement('td');
        spanCell.textContent = stats.span;
        row.appendChild(spanCell);
        
        // 奇偶比
        const oddEvenCell = document.createElement('td');
        oddEvenCell.textContent = stats.oddEvenRatio;
        row.appendChild(oddEvenCell);
        
        // 区间比
        const zoneCell = document.createElement('td');
        zoneCell.textContent = stats.zoneRatio;
        row.appendChild(zoneCell);
        
        resultsBody.appendChild(row);
    });
}

// 计算统计数据
function calculateStats(numbers) {
    const nums = numbers.map(Number);
    const sorted = [...nums].sort((a, b) => a - b);
    
    // 和值
    const sum = nums.reduce((a, b) => a + b, 0);
    
    // 跨度
    const span = sorted[sorted.length - 1] - sorted[0];
    
    // 奇偶比
    const oddCount = nums.filter(n => n % 2 === 1).length;
    const oddEvenRatio = `${oddCount}:${7 - oddCount}`;
    
    // 区间比
    const zone1 = nums.filter(n => n <= 10).length;
    const zone2 = nums.filter(n => n > 10 && n <= 20).length;
    const zone3 = nums.filter(n => n > 20).length;
    const zoneRatio = `${zone1}:${zone2}:${zone3}`;
    
    return { sum, span, oddEvenRatio, zoneRatio };
}

// 渲染分页
function renderPagination() {
    // ... existing code ...
}

// 初始化页面
document.addEventListener('DOMContentLoaded', init);