// 显示最新一期彩票开奖结果
const ssqLatestResults = document.getElementById('ssq-latest');
const kl8LatestResults = document.getElementById('kl8-latest');

// 加载最新一期数据
function loadSSQLatestData() {
    // 显示加载状态
    ssqLatestResults.innerHTML = '<div class="loading">加载中...</div>';
    
    fetch('data/ssq_data.json')
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
    
    fetch('data/kl8_data.json')
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

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', () => {
    if (ssqLatestResults) loadSSQLatestData();
    if (kl8LatestResults) loadKL8LatestData();
});