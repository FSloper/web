// 显示最新一期彩票开奖结果
const updateTimeElement = document.getElementById('update-time');
const ssqLatestResults = document.getElementById('ssq-latest');
const kl8LatestResults = document.getElementById('kl8-latest');
const fc3dLatestResults = document.getElementById('fc3d-latest');
const dltLatestResults = document.getElementById('dlt-latest');
const tc7xcLatestResults = document.getElementById('tc7xc-latest');
const plLatestResults = document.getElementById('pl-latest');
const qlcLatestResults = document.getElementById('qlc-latest');

// 加载最新一期数据
function loadSSQLatestData() {
    // 显示加载状态
    ssqLatestResults.innerHTML = '<div class="loading">加载中...</div>';
    
    fetch('data/ssq_data_first3.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            return response.json();
        })
        .then(data => {
            // 获取最新一期数据
            const latestPeriod = Object.keys(data).sort().pop();
            const latestData = data[latestPeriod];
            const redBalls = latestData.split(',').slice(0, 6);
            const blueBall = latestData.split(',').slice(-1)[0];
            
            // 渲染最新一期结果
            renderSSQResults(latestPeriod, redBalls, blueBall);
        })
        .catch(error => {
            console.error('加载双色球数据失败:', error);
            ssqLatestResults.innerHTML = '<div class="error">数据加载失败，请稍后重试</div>';
        });
}

function loadKL8LatestData() {
    // 显示加载状态
    kl8LatestResults.innerHTML = '<div class="loading">加载中...</div>';
    
    fetch('data/kl8_data_first3.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            // 获取最后修改时间
            const lastModified = new Date(response.headers.get('last-modified'));
            updateTimeElement.innerHTML = `数据更新时间: ${lastModified.toLocaleString()}`;
            return response.json();
        })
        .then(data => {
            // 获取最新一期数据
            const latestPeriod = Object.keys(data).sort().pop();
            const latestData = data[latestPeriod];
            const balls = latestData.split(',');
            
            // 渲染最新一期结果
            renderKL8Results(latestPeriod, balls);
        })
        .catch(error => {
            console.error('加载快乐8数据失败:', error);
            kl8LatestResults.innerHTML = '<div class="error">数据加载失败，请稍后重试</div>';
        });
}

// 渲染最新一期结果
function renderSSQResults(period, redBalls, blueBall) {
    const container = document.createElement('div');
    container.className = 'latest-results';
    
    // 期号
    const periodElement = document.createElement('h3');
    periodElement.textContent = `双色球    第${period}期`;
    container.appendChild(periodElement);
    
    // 球号
    const ballsContainer = document.createElement('div');
    ballsContainer.className = 'balls-container';
    
    // 红球
    redBalls.forEach(ball => {
        const ballSpan = document.createElement('span');
        ballSpan.className = 'ball red-ball';
        ballSpan.textContent = ball;
        ballsContainer.appendChild(ballSpan);
    });
    
    // 蓝球
    const blueBallSpan = document.createElement('span');
    blueBallSpan.className = 'ball blue-ball';
    blueBallSpan.textContent = blueBall;
    ballsContainer.appendChild(blueBallSpan);
    
    container.appendChild(ballsContainer);
    
    // 添加到页面
    ssqLatestResults.innerHTML = '';
    ssqLatestResults.appendChild(container);
}

function renderKL8Results(period, balls) {
    const container = document.createElement('div');
    container.className = 'latest-results';
    
    // 期号
    const periodElement = document.createElement('h3');
    periodElement.textContent = `快乐8    第${period}期`;
    container.appendChild(periodElement);
    
    // 球号
    const ballsContainer = document.createElement('div');
    ballsContainer.className = 'balls-container';
    
    // 快乐8号码
    balls.forEach((ball, index) => {
        const ballSpan = document.createElement('span');
        ballSpan.className = `ball kl8-ball group-${Math.floor(index / 5)}`;
        ballSpan.textContent = ball;
        ballsContainer.appendChild(ballSpan);
    });
    
    container.appendChild(ballsContainer);
    
    // 添加到页面
    kl8LatestResults.innerHTML = '';
    kl8LatestResults.appendChild(container);
}

// 加载3D最新一期数据
function loadFC3DLatestData() {
    // 显示加载状态
    fc3dLatestResults.innerHTML = '<div class="loading">加载中...</div>';
    
    fetch('data/fc3d_data_first3.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            return response.json();
        })
        .then(data => {
            // 获取最新一期数据
            const latestPeriod = Object.keys(data).sort().pop();
            const latestData = data[latestPeriod];
            const balls = latestData.split(',');
            
            // 渲染最新一期结果
            renderFC3DResults(latestPeriod, balls);
        })
        .catch(error => {
            console.error('加载3D数据失败:', error);
            fc3dLatestResults.innerHTML = '<div class="error">数据加载失败，请稍后重试</div>';
        });
}

// 加载大乐透最新一期数据
function loadDLTLatestData() {
    dltLatestResults.innerHTML = '<div class="loading">加载中...</div>';
    
    fetch('../data/dlt_data_first3.json')
        .then(response => {
            if (!response.ok) throw new Error('网络响应不正常');
            return response.json();
        })
        .then(data => {
            const latestPeriod = Object.keys(data).sort().pop();
            const latestData = data[latestPeriod];
            const redBalls = latestData.split(',').slice(0, 5);
            const blueBalls = latestData.split(',').slice(5, 7);
            
            renderDLTResults(latestPeriod, redBalls, blueBalls);
        })
        .catch(error => {
            console.error('加载大乐透数据失败:', error);
            dltLatestResults.innerHTML = '<div class="error">数据加载失败，请稍后重试</div>';
        });
}

// 加载排列最新一期数据
function loadPLLatestData() {
    plLatestResults.innerHTML = '<div class="loading">加载中...</div>';
    
    fetch('../data/pl_data_first3.json')
        .then(response => {
            if (!response.ok) throw new Error('网络响应不正常');
            return response.json();
        })
        .then(data => {
            const latestPeriod = Object.keys(data).sort().pop();
            const latestData = data[latestPeriod];
            const balls = latestData.split(',');
            
            renderPLResults(latestPeriod, balls);
        })
        .catch(error => {
            console.error('加载排列数据失败:', error);
            plLatestResults.innerHTML = '<div class="error">数据加载失败，请稍后重试</div>';
        });
}

// 渲染排列结果
function renderPLResults(period, balls) {
    const container = document.createElement('div');
    container.className = 'latest-results';
    
    const periodElement = document.createElement('h3');
    periodElement.textContent = `排列    第${period}期`;
    container.appendChild(periodElement);
    
    const ballsContainer = document.createElement('div');
    ballsContainer.className = 'balls-container';
    
    balls.forEach(ball => {
        const ballSpan = document.createElement('span');
        ballSpan.className = 'ball pl-ball';
        ballSpan.textContent = ball;
        ballsContainer.appendChild(ballSpan);
    });
    
    container.appendChild(ballsContainer);
    plLatestResults.innerHTML = '';
    plLatestResults.appendChild(container);
}

// 渲染大乐透结果
function renderDLTResults(period, redBalls, blueBalls) {
    const container = document.createElement('div');
    container.className = 'latest-results';
    
    const periodElement = document.createElement('h3');
    periodElement.textContent = `大乐透    第${period}期`;
    container.appendChild(periodElement);
    
    const ballsContainer = document.createElement('div');
    ballsContainer.className = 'balls-container';
    
    redBalls.forEach(ball => {
        const ballSpan = document.createElement('span');
        ballSpan.className = 'ball red-ball';
        ballSpan.textContent = ball;
        ballsContainer.appendChild(ballSpan);
    });
    
    blueBalls.forEach(ball => {
        const ballSpan = document.createElement('span');
        ballSpan.className = 'ball blue-ball';
        ballSpan.textContent = ball;
        ballsContainer.appendChild(ballSpan);
    });
    
    container.appendChild(ballsContainer);
    dltLatestResults.innerHTML = '';
    dltLatestResults.appendChild(container);
}
function loadTC7XCLatestData() {
    tc7xcLatestResults.innerHTML = '<div class="loading">加载中...</div>';
    
    fetch('data/tc7xc_data.json')
        .then(response => {
            if (!response.ok) throw new Error('网络响应不正常');
            return response.json();
        })
        .then(data => {
            const latestPeriod = Object.keys(data).sort().pop();
            const latestData = data[latestPeriod];
            const balls = latestData.split(',');
            
            renderTC7XCResults(latestPeriod, balls);
        })
        .catch(error => {
            console.error('加载7星彩数据失败:', error);
            tc7xcLatestResults.innerHTML = '<div class="error">数据加载失败，请稍后重试</div>';
        });
}

function renderTC7XCResults(period, balls) {
    const container = document.createElement('div');
    container.className = 'latest-results';
    
    const periodElement = document.createElement('h3');
    periodElement.textContent = `7星彩    第${period}期`;
    container.appendChild(periodElement);
    
    const ballsContainer = document.createElement('div');
    ballsContainer.className = 'balls-container';
    
    balls.forEach(ball => {
        const ballSpan = document.createElement('span');
        ballSpan.className = 'ball red-ball';
        ballSpan.textContent = ball;
        ballsContainer.appendChild(ballSpan);
    });
    
    container.appendChild(ballsContainer);
    tc7xcLatestResults.innerHTML = '';
    tc7xcLatestResults.appendChild(container);
}



function loadQLCLatestData() {
    qlcLatestResults.innerHTML = '<div class="loading">加载中...</div>';
    
    fetch('data/qlc_data.json')
        .then(response => {
            if (!response.ok) throw new Error('网络响应不正常');
            return response.json();
        })
        .then(data => {
            const latestPeriod = Object.keys(data).sort().pop();
            const latestData = data[latestPeriod];
            const balls = latestData.split(' ');
            
            renderQLCResults(latestPeriod, balls);
        })
        .catch(error => {
            console.error('加载7乐彩数据失败:', error);
            qlcLatestResults.innerHTML = '<div class="error">数据加载失败，请稍后重试</div>';
        });
}

function renderQLCResults(period, balls) {
    const container = document.createElement('div');
    container.className = 'latest-results';
    
    const periodElement = document.createElement('h3');
    periodElement.textContent = `七乐彩    第${period}期`;
    container.appendChild(periodElement);
    
    const ballsContainer = document.createElement('div');
    ballsContainer.className = 'balls-container';
    
    // 主号码(前7个)
    balls.slice(0,7).forEach(ball => {
        const ballSpan = document.createElement('span');
        ballSpan.className = 'ball red-ball';
        ballSpan.textContent = ball;
        ballsContainer.appendChild(ballSpan);
    });
    
    // 特别号(第8个)
    const specialBall = document.createElement('span');
    specialBall.className = 'ball blue-ball';
    specialBall.textContent = balls[7];
    ballsContainer.appendChild(specialBall);
    
    container.appendChild(ballsContainer);
    qlcLatestResults.innerHTML = '';
    qlcLatestResults.appendChild(container);
}

function getFileLastModified(filePath) {
    return fetch(filePath, { method: 'HEAD' })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.headers.get('Last-Modified');
      })
      .then(lastModified => {
        if (!lastModified) throw new Error('Last-Modified header not found');
        return new Date(lastModified);
      });
}
// 渲染3D最新一期结果
function renderFC3DResults(period, balls) {
    const container = document.createElement('div');
    container.className = 'latest-results';
    
    // 期号
    const periodElement = document.createElement('h3');
    periodElement.textContent = `3D    第${period}期`;
    container.appendChild(periodElement);
    
    // 球号
    const ballsContainer = document.createElement('div');
    ballsContainer.className = 'balls-container';
    
    // 3D号码
    balls.forEach(ball => {
        const ballSpan = document.createElement('span');
        ballSpan.className = 'ball fc3d-ball';
        ballSpan.textContent = ball;
        ballsContainer.appendChild(ballSpan);
    });
    
    container.appendChild(ballsContainer);
    
    // 添加到页面
    fc3dLatestResults.innerHTML = '';
    fc3dLatestResults.appendChild(container);
}

// 更新最后修改时间
function updateLastModifiedTime() {
    const files = ['data/ssq_data.json', 'data/kl8_data.json', 'data/fc3d_data.json'];
    
    Promise.all(files.map(file => getFileLastModified(file)))
        .then(dates => {
            const latestDate = new Date(Math.max(...dates.map(d => d.getTime())));
            const timeElement = document.createElement('div');
            timeElement.className = 'last-updated';
            timeElement.textContent = `数据最后更新时间: ${latestDate.toLocaleString()}`;
            document.body.appendChild(timeElement);
        })
        .catch(error => {
            console.error('获取文件最后修改时间失败:', error);
        });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    loadSSQLatestData();
    loadKL8LatestData();
    loadFC3DLatestData();
    loadDLTLatestData();
    loadTC7XCLatestData();
    loadPLLatestData();
    loadQLCLatestData();
});
