// 生成双色球随机号码函数
function generateSSQNumbers() {
    const resultDiv = document.getElementById('ssq-random-result');
    resultDiv.innerHTML = '';
    
    const redBalls = [];
    const blueBalls = [];
    
    // 生成6个红球(1-33)
    while(redBalls.length < 6) {
        const num = Math.floor(Math.random() * 33) + 1;
        if(!redBalls.includes(num)) {
            redBalls.push(num);
        }
    }
    
    // 生成1个蓝球(1-16)
    blueBalls.push(Math.floor(Math.random() * 16) + 1);
    
    // 排序
    redBalls.sort((a, b) => a - b);
    
    redBalls.forEach(num => {
        const ball = document.createElement('span');
        ball.className = 'ball red-ball';
        ball.textContent = num;
        resultDiv.appendChild(ball);
    });
    
    const blueBall = document.createElement('span');
    blueBall.className = 'ball blue-ball';
    blueBall.textContent = blueBalls[0];
    resultDiv.appendChild(blueBall);
}

// 生成快乐8随机号码函数(金字塔式布局)
function generateAllKL8Numbers() {
    for(let i = 1; i <= 10; i++) {
        const resultDiv = document.getElementById('kl8-random-' + i);
        resultDiv.innerHTML = '';
        
        const balls = [];
        
        // 生成指定数量的球(1-80)
        while(balls.length < i) {
            const num = Math.floor(Math.random() * 80) + 1;
            if(!balls.includes(num)) {
                balls.push(num);
            }
        }
        
        // 排序
        balls.sort((a, b) => a - b);
        
        balls.forEach(num => {
            const ball = document.createElement('span');
            ball.className = 'ball kl8-ball group-' + Math.floor((num - 1) / 16);
            ball.textContent = num;
            resultDiv.appendChild(ball);
        });
    }
}

// 生成福彩3D随机号码函数
function generateFC3DNumbers() {
    const resultDiv = document.getElementById('fc3d-random-result');
    resultDiv.innerHTML = '';
    
    // 生成3个数字(0-9)
    for(let i = 0; i < 3; i++) {
        const num = Math.floor(Math.random() * 10);
        const ball = document.createElement('span');
        ball.className = 'ball fc3d-ball';
        ball.textContent = num;
        resultDiv.appendChild(ball);
    }
}

// 生成大乐透随机号码函数
function generateDLTNumbers() {
    const resultDiv = document.getElementById('dlt-random-result');
    resultDiv.innerHTML = '';
    
    const frontBalls = [];
    const backBalls = [];
    
    // 生成5个前区球(1-35)
    while(frontBalls.length < 5) {
        const num = Math.floor(Math.random() * 35) + 1;
        if(!frontBalls.includes(num)) {
            frontBalls.push(num);
        }
    }
    
    // 生成2个后区球(1-12)
    while(backBalls.length < 2) {
        const num = Math.floor(Math.random() * 12) + 1;
        if(!backBalls.includes(num)) {
            backBalls.push(num);
        }
    }
    
    // 排序
    frontBalls.sort((a, b) => a - b);
    backBalls.sort((a, b) => a - b);
    
    frontBalls.forEach(num => {
        const ball = document.createElement('span');
        ball.className = 'ball red-ball';
        ball.textContent = num;
        resultDiv.appendChild(ball);
    });
    
    backBalls.forEach(num => {
        const ball = document.createElement('span');
        ball.className = 'ball blue-ball';
        ball.textContent = num;
        resultDiv.appendChild(ball);
    });
}

// 生成七星彩随机号码函数
function generateTC7XCNumbers() {
    const resultDiv = document.getElementById('tc7xc-random-result');
    resultDiv.innerHTML = '';
    
    // 生成7个数字(0-9)
    for(let i = 0; i < 7; i++) {
        const num = Math.floor(Math.random() * 10);
        const ball = document.createElement('span');
        ball.className = 'ball fc3d-ball';
        ball.textContent = num;
        resultDiv.appendChild(ball);
    }
}

// 生成排列随机号码函数
function generatePLNumbers() {
    const resultDiv = document.getElementById('pl-random-result');
    resultDiv.innerHTML = '';
    
    // 生成5个数字(0-9)
    for(let i = 0; i < 5; i++) {
        const num = Math.floor(Math.random() * 10);
        const ball = document.createElement('span');
        ball.className = 'ball pl-ball';
        ball.textContent = num;
        resultDiv.appendChild(ball);
    }
}

// 生成七乐彩随机号码函数
function generateQLCNumbers() {
    const resultDiv = document.getElementById('qlc-random-result');
    resultDiv.innerHTML = '';
    
    const balls = [];
    
    // 生成7个球(1-30)
    while(balls.length < 7) {
        const num = Math.floor(Math.random() * 30) + 1;
        if(!balls.includes(num)) {
            balls.push(num);
        }
    }
    
    // 排序
    balls.sort((a, b) => a - b);
    
    balls.forEach(num => {
        const ball = document.createElement('span');
        ball.className = 'ball red-ball';
        ball.textContent = num;
        resultDiv.appendChild(ball);
    });
}

// 更新页面加载事件监听器
document.addEventListener('DOMContentLoaded', function() {
    generateSSQNumbers();
    generateAllKL8Numbers();
    generateFC3DNumbers();
    generateDLTNumbers();
    generateTC7XCNumbers();
    generatePLNumbers();
    generateQLCNumbers();
});