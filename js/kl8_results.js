// 快乐8开奖结果处理脚本

// 获取DOM元素
const resultsBody = document.getElementById('results-body');
const pagination = document.getElementById('pagination');
const rowsPerPageSelect = document.getElementById('rows-per-page');

// 当前页码和每页显示行数
let currentPage = 1;
let totalPages = 1;
let rowsPerPage = rowsPerPageSelect.value === 'all' ? 'all' : parseInt(rowsPerPageSelect.value);
let allData = [];

// 初始化页面
function init() {
    loadData();
    setupEventListeners();
}

// 加载JSON数据
function loadData() {
    console.log('开始加载快乐8数据...');
    fetch('../data/kl8_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP错误! 状态码: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // 将对象转换为数组格式
            allData = Object.entries(data).sort((a, b) => b[0].localeCompare(a[0])).map(([period, numbers]) => {
                return {
                    period,
                    numbers: numbers.split(',')
                };
            });
            console.log('快乐8数据加载成功，共加载', allData.length, '条记录');
            updateDisplay();
        })
        .catch(error => {
            console.error('加载快乐8数据失败:', error);
            resultsBody.innerHTML = '<tr><td colspan="2">数据加载失败，请检查控制台查看详情</td></tr>';
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
    
    const spacerSelect = document.getElementById('spacer-select');
    const showConsecutive = document.getElementById('show-consecutive');
    
    if (spacerSelect) {
        spacerSelect.addEventListener('change', () => {
            updateDisplay();
        });
    }
    
    if (showConsecutive) {
        showConsecutive.addEventListener('change', () => {
            updateDisplay();
        });
    }
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
    
    const spacerValue = parseInt(document.getElementById('spacer-select').value);
    
    data.forEach(item => {
        const row = document.createElement('tr');
        
        // 期号
        const periodCell = document.createElement('td');
        periodCell.textContent = item.period;
        row.appendChild(periodCell);
        
        // 开奖号码
        const numbersCell = document.createElement('td');
        
        // 检测连号
        const consecutiveNumbers = new Set();
        const sortedNumbers = [...item.numbers].sort((a, b) => a - b);
        for (let i = 1; i < sortedNumbers.length; i++) {
            if (parseInt(sortedNumbers[i]) === parseInt(sortedNumbers[i-1]) + 1) {
                consecutiveNumbers.add(sortedNumbers[i]);
                consecutiveNumbers.add(sortedNumbers[i-1]);
            }
        }
        
        item.numbers.forEach((num, index) => {
            const ball = document.createElement('span');
            // 默认应用分组样式
            ball.className = `kl8-ball group-${Math.floor(index / spacerValue)}`;
            
            const showConsecutive = document.getElementById('show-consecutive');
            // 如果勾选了"展示连号"
            if (showConsecutive && showConsecutive.checked) {
                // 重置为默认蓝色
                ball.className = 'kl8-ball';
                // 如果是连号球则添加红色样式
                if (consecutiveNumbers.has(num)) {
                    ball.classList.add('consecutive');
                }
            }
            
            ball.textContent = num;
            ball.addEventListener('click', function() {
                this.classList.toggle('selected');
            });
            numbersCell.appendChild(ball);
            
            // 添加间隔
            if ((index + 1) % spacerValue === 0 && index !== item.numbers.length - 1) {
                const spacer = document.createElement('span');
                spacer.className = 'number-spacer';
                spacer.textContent = ' ';
                numbersCell.appendChild(spacer);
            }
        });
        row.appendChild(numbersCell);
        
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