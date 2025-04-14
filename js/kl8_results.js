// 快乐8开奖结果处理脚本

// 获取DOM元素
const resultsBody = document.getElementById('results-body');
const pagination = document.getElementById('pagination');
const rowsPerPageSelect = document.getElementById('rows-per-page');

// 当前页码和每页显示行数
let currentPage = 1;
let rowsPerPage = rowsPerPageSelect.value === 'all' ? 'all' : parseInt(rowsPerPageSelect.value);

// 从kl8_data.json获取数据
let allData = {};

fetch('data/kl8_data.json')
    .then(response => response.json())
    .then(data => {
        allData = data;
        // 渲染表格数据
        function renderTable(page, data = allData) {
            resultsBody.innerHTML = '';
            
            let paginatedKeys = Object.keys(data).sort().reverse();
            if (rowsPerPage !== 'all') {
                const start = (page - 1) * rowsPerPage;
                const end = start + rowsPerPage;
                paginatedKeys = paginatedKeys.slice(start, end);
            }
            
            paginatedKeys.forEach(issue => {
                const row = document.createElement('tr');
                
                // 期号
                const issueCell = document.createElement('td');
                issueCell.textContent = issue;
                row.appendChild(issueCell);
                

                
                // 开奖号码
                const numbersCell = document.createElement('td');
                data[issue].split(',').forEach((num, index) => {
                    const ball = document.createElement('span');
                    ball.className = `kl8-ball group-${Math.floor(index / 5)}`;
                    ball.textContent = num;
                    numbersCell.appendChild(ball);
                });
                row.appendChild(numbersCell);
                
                resultsBody.appendChild(row);
            });
        }
        
        // 渲染分页按钮
        function renderPagination() {
    const rowsPerPage = rowsPerPageSelect.value;
    totalPages = rowsPerPage === 'all' ? 1 : Math.ceil(Object.keys(data).length / (rowsPerPage === 'all' ? Object.keys(data).length : parseInt(rowsPerPage)));
    
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
        
        // 更新显示
        function updateDisplay() {
            renderTable(currentPage);
            renderPagination();
        }
        
        // 每页行数变化事件
        rowsPerPageSelect.addEventListener('change', () => {
            rowsPerPage = rowsPerPageSelect.value === 'all' ? 'all' : parseInt(rowsPerPageSelect.value);
            currentPage = 1;
            updateDisplay();
        });
        
        // 搜索按钮事件
        document.getElementById('search-btn').addEventListener('click', () => {
            const searchTerm = document.getElementById('period-search').value.trim();
            if (searchTerm) {
                const filteredData = Object.keys(allData)
                    .filter(issue => issue.startsWith(searchTerm))
                    .reduce((obj, key) => {
                        obj[key] = allData[key];
                        return obj;
                    }, {});
                rowsPerPage = 'all';
                renderTable(1, filteredData);
                document.getElementById('pagination').style.display = 'none';
            } else {
                document.getElementById('pagination').style.display = 'flex';
                updateDisplay();
            }
        });
        
        // 重置按钮事件
        document.getElementById('reset-btn').addEventListener('click', () => {
            document.getElementById('period-search').value = '';
            document.getElementById('pagination').style.display = 'flex';
            updateDisplay();
        });
        
        // 初始渲染
        updateDisplay();
    })
    .catch(error => {
        console.error('Error loading kl8 data:', error);
        resultsBody.innerHTML = '<tr><td colspan="3">加载数据失败，请稍后再试</td></tr>';
    });