// 加载七星彩开奖数据并实现分页功能
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
    // 从localStorage读取保存的行数选择
    const savedRows = localStorage.getItem('tc7xc_rows_per_page');
    if (savedRows) {
        rowsPerPageSelect.value = savedRows;
    }
    loadData();
    setupEventListeners();
}

// 加载JSON数据
function loadData() {
    console.log('开始加载七星彩数据...');
    fetch('../data/tc7xc_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP错误! 状态码: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            allData = Object.entries(data).sort((a, b) => b[0].localeCompare(a[0])).map(([period, numbers]) => {
                const nums = numbers.split(',').slice(0, 7); // 取前7位数字
                return {
                    period,
                    numbers: nums
                };
            });
            console.log('七星彩数据加载成功，共加载', allData.length, '条记录');
            updateDisplay();
        })
        .catch(error => {
            console.error('加载数据失败:', error);
            alert('数据加载失败，请检查: 1.文件路径是否正确 2.文件是否存在 3.文件格式是否有效');
        });
}

// 设置事件监听器
function setupEventListeners() {
    rowsPerPageSelect.addEventListener('change', () => {
        currentPage = 1;
        localStorage.setItem('tc7xc_rows_per_page', rowsPerPageSelect.value);
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

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        
        // 期号
        const periodCell = document.createElement('td');
        periodCell.textContent = item.period;
        row.appendChild(periodCell);
        
        // 开奖号码
        const numbersCell = document.createElement('td');
        item.numbers.forEach(num => {
            const ball = document.createElement('span');
            ball.className = 'ball red-ball';
            ball.textContent = num;
            numbersCell.appendChild(ball);
        });
        row.appendChild(numbersCell);
        
        // 计算统计数据
        const stats = calculateStats(item.numbers);
        
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
        
        // 大小比
        const sizeCell = document.createElement('td');
        sizeCell.textContent = stats.sizeRatio;
        row.appendChild(sizeCell);
        
        // 质合比
        const primeCompositeCell = document.createElement('td');
        primeCompositeCell.textContent = stats.primeCompositeRatio;
        row.appendChild(primeCompositeCell);
        
        resultsBody.appendChild(row);
    });

    // 计算并显示平均值
    calculateAndDisplayAverages(data);
}

// 计算并显示平均值
function calculateAndDisplayAverages(data) {
    if (data.length === 0) return;

    let totalSum = 0;
    let totalSpan = 0;
    let totalOdd = 0, totalEven = 0;
    let totalBig = 0, totalSmall = 0;
    let totalPrime = 0, totalComposite = 0;

    data.forEach(item => {
        const stats = calculateStats(item.numbers);
        
        totalSum += stats.sum;
        totalSpan += stats.span;
        
        const oddEven = stats.oddEvenRatio.split(':');
        totalOdd += parseInt(oddEven[0]);
        totalEven += parseInt(oddEven[1]);
        
        const size = stats.sizeRatio.split(':');
        totalBig += parseInt(size[0]);
        totalSmall += parseInt(size[1]);
        
        const primeComposite = stats.primeCompositeRatio.split(':');
        totalPrime += parseInt(primeComposite[0]);
        totalComposite += parseInt(primeComposite[1]);
    });

    const count = data.length;
    document.getElementById('avg-sum').textContent = Math.round(totalSum / count);
    document.getElementById('avg-span').textContent = Math.round(totalSpan / count);
    document.getElementById('avg-odd-even').textContent = 
        `${Math.round(totalOdd/count)}:${Math.round(totalEven/count)}`;
    document.getElementById('avg-size').textContent = 
        `${Math.round(totalBig/count)}:${Math.round(totalSmall/count)}`;
    document.getElementById('avg-prime').textContent = 
        `${Math.round(totalPrime/count)}:${Math.round(totalComposite/count)}`;
}

// 判断是否为质数
function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

// 计算统计数据
function calculateStats(numbers) {
    const nums = numbers.map(Number);
    const sortedNums = [...nums].sort((a, b) => a - b);
    
    // 和值
    const sum = nums.reduce((a, b) => a + b, 0);
    
    // 跨度
    const span = sortedNums[sortedNums.length - 1] - sortedNums[0];
    
    // 奇偶比
    const odd = nums.filter(n => n % 2 === 1).length;
    const even = nums.length - odd;
    const oddEvenRatio = `${odd}:${even}`;
    
    // 大小比 (0-4为小，5-9为大)
    const big = nums.filter(n => n >= 5).length;
    const small = nums.length - big;
    const sizeRatio = `${big}:${small}`;
    
    // 质合比
    const prime = nums.filter(n => isPrime(n)).length;
    const composite = nums.length - prime;
    const primeCompositeRatio = `${prime}:${composite}`;
    
    return {
        sum,
        span,
        oddEvenRatio,
        sizeRatio,
        primeCompositeRatio
    };
}

// 渲染分页控件 (与dlt_results.js中的renderPagination函数相同)
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

// 初始化页面
window.addEventListener('DOMContentLoaded', () => {
    init();
});