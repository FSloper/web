// 加载大乐透开奖数据并实现分页功能
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
    const savedRows = localStorage.getItem('dlt_rows_per_page');
    if (savedRows) {
        rowsPerPageSelect.value = savedRows;
    }
    loadData();
    setupEventListeners();
}

// 加载JSON数据
function loadData() {
    console.log('开始加载大乐透数据...');
    fetch('../data/dlt_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP错误! 状态码: ${response.status}`);
            }
            return response.text(); // 先获取文本内容
        })
        .then(text => {
            try {
                const data = JSON.parse(text);
                allData = Object.entries(data).sort((a, b) => b[0].localeCompare(a[0])).map(([period, numbers]) => {
                    const nums = numbers.split(',');
                    return {
                        period,
                        frontArea: nums.slice(0, 5),
                        backArea: nums.slice(5)
                    };
                });
                console.log('大乐透数据加载成功，共加载', allData.length, '条记录');
                updateDisplay();
            } catch (parseError) {
                console.error('JSON解析错误:', parseError);
                alert('数据格式错误，请检查JSON文件格式');
            }
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
        localStorage.setItem('dlt_rows_per_page', rowsPerPageSelect.value);
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
        
        // 前区
        const frontCell = document.createElement('td');
        item.frontArea.forEach(num => {
            const ball = document.createElement('span');
            ball.className = 'ball red-ball';
            ball.textContent = num;
            frontCell.appendChild(ball);
        });
        row.appendChild(frontCell);
        
        // 后区
        const backCell = document.createElement('td');
        item.backArea.forEach(num => {
            const ball = document.createElement('span');
            ball.className = 'ball blue-ball';
            ball.textContent = num;
            backCell.appendChild(ball);
        });
        row.appendChild(backCell);
        
        // 计算统计数据
        const stats = calculateStats(item.frontArea, item.backArea, index);
        
        // 和值
        const sumCell = document.createElement('td');
        sumCell.textContent = stats.sum;
        row.appendChild(sumCell);
        
        // 前区跨度
        const frontSpanCell = document.createElement('td');
        frontSpanCell.textContent = stats.frontSpan;
        row.appendChild(frontSpanCell);
        
        // 后区跨度
        const backSpanCell = document.createElement('td');
        backSpanCell.textContent = stats.backSpan;
        row.appendChild(backSpanCell);
        
        // 区间比
        const zoneCell = document.createElement('td');
        zoneCell.textContent = stats.zoneRatio;
        row.appendChild(zoneCell);
        
        // 奇偶比
        const oddEvenCell = document.createElement('td');
        oddEvenCell.textContent = stats.oddEvenRatio;
        row.appendChild(oddEvenCell);
        
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
    let totalFrontSpan = 0;
    let totalBackSpan = 0;
    let totalZone1 = 0, totalZone2 = 0, totalZone3 = 0;
    let totalOdd = 0, totalEven = 0;
    let totalPrime = 0, totalComposite = 0;

    data.forEach(item => {
        const stats = calculateStats(item.frontArea, item.backArea, data.indexOf(item));
        
        totalSum += stats.sum;
        totalFrontSpan += stats.frontSpan;
        totalBackSpan += stats.backSpan;
        
        const zones = stats.zoneRatio.split(':');
        totalZone1 += parseInt(zones[0]);
        totalZone2 += parseInt(zones[1]);
        totalZone3 += parseInt(zones[2]);
        
        const oddEven = stats.oddEvenRatio.split(':');
        totalOdd += parseInt(oddEven[0]);
        totalEven += parseInt(oddEven[1]);
        
        const primeComposite = stats.primeCompositeRatio.split(':');
        totalPrime += parseInt(primeComposite[0]);
        totalComposite += parseInt(primeComposite[1]);
    });

    const count = data.length;
    document.getElementById('avg-sum').textContent = Math.round(totalSum / count);
    document.getElementById('avg-front-span').textContent = Math.round(totalFrontSpan / count);
    document.getElementById('avg-back-span').textContent = Math.round(totalBackSpan / count);
    document.getElementById('avg-zone').textContent = 
        `${Math.round(totalZone1/count)}:${Math.round(totalZone2/count)}:${Math.round(totalZone3/count)}`;
    document.getElementById('avg-odd-even').textContent = 
        `${Math.round(totalOdd/count)}:${Math.round(totalEven/count)}`;
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
function calculateStats(frontArea, backArea, index) {
    const frontNums = frontArea.map(Number);
    const backNums = backArea.map(Number);
    const sortedFront = [...frontNums].sort((a, b) => a - b);
    const sortedBack = [...backNums].sort((a, b) => a - b);
    
    // 和值
    const sum = frontNums.reduce((a, b) => a + b, 0) + backNums.reduce((a, b) => a + b, 0);
    
    // 前区跨度
    const frontSpan = sortedFront[sortedFront.length - 1] - sortedFront[0];
    
    // 后区跨度
    const backSpan = sortedBack[sortedBack.length - 1] - sortedBack[0];
    
    // 区间比 (前区1-12, 13-24, 25-35)
    const zone1 = frontNums.filter(n => n <= 12).length;
    const zone2 = frontNums.filter(n => n > 12 && n <= 24).length;
    const zone3 = frontNums.filter(n => n > 24).length;
    const zoneRatio = `${zone1}:${zone2}:${zone3}`;
    
    // 奇偶比 (前区)
    const odd = frontNums.filter(n => n % 2 === 1).length;
    const even = frontNums.filter(n => n % 2 === 0).length;
    const oddEvenRatio = `${odd}:${even}`;
    
    // 质合比 (前区)
    const prime = frontNums.filter(n => isPrime(n)).length;
    const composite = frontNums.length - prime;
    const primeCompositeRatio = `${prime}:${composite}`;
    
    return {
        sum,
        frontSpan,
        backSpan,
        zoneRatio,
        oddEvenRatio,
        primeCompositeRatio
    };
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

// 初始化页面
window.addEventListener('DOMContentLoaded', () => {
    init();
});