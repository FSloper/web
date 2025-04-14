function checkPrize(userRedBalls, userBlueBall, latestResult) {
    // 处理08和8的等价性
    const normalizedUserRedBalls = userRedBalls.map(ball => parseInt(ball).toString());
    const normalizedLatestRedBalls = latestResult.redBalls.map(ball => parseInt(ball).toString());
    
    // 计算匹配的红球数量
    const redMatchCount = normalizedUserRedBalls.filter(ball => 
        normalizedLatestRedBalls.includes(ball)
    ).length;
    
    // 处理蓝球等价性
    const blueMatch = parseInt(userBlueBall) === parseInt(latestResult.blueBall);
    
    return {
        redMatchCount,
        blueMatch,
        prizeLevel: calculatePrizeLevel(redMatchCount, blueMatch)
    };
}

function calculatePrizeLevel(redMatchCount, blueMatch) {
    if (redMatchCount === 6 && blueMatch) return '一等奖';
    if (redMatchCount === 6) return '二等奖';
    if (redMatchCount === 5 && blueMatch) return '三等奖';
    if (redMatchCount === 5 || (redMatchCount === 4 && blueMatch)) return '四等奖';
    if (redMatchCount === 4 || (redMatchCount === 3 && blueMatch)) return '五等奖';
    if (blueMatch) return '六等奖';
    return '未中奖';
}

function showCheckModal() {
    // 创建模态框
    const modal = document.createElement('div');
    
    // 加载开奖数据
    fetch('data/ssq_data.json')
        .then(response => response.json())
        .then(data => {
            window.ssqData = data;
            const latestPeriod = Object.keys(data).sort().pop();
            const latestData = data[latestPeriod];
            window.latestResult = {
                redBalls: latestData.split(',').slice(0, 6),
                blueBall: latestData.split(',').slice(-1)[0]
            };
        })
        .catch(error => {
            console.error('加载开奖数据失败:', error);
            window.latestResult = { redBalls: [], blueBall: '' };
        });
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '2000';
    modal.style.transition = 'opacity 0.3s ease';
    modal.style.opacity = '0';
    setTimeout(() => { modal.style.opacity = '1'; }, 10);

    // 模态框内容
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#f8f9fa';
    modalContent.style.padding = '2rem';
    modalContent.style.borderRadius = '12px';
    modalContent.style.width = '450px';
    modalContent.style.maxWidth = '90%';
    modalContent.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    modalContent.style.transition = 'transform 0.3s ease';
    modalContent.style.transform = 'translateY(-20px)';
    setTimeout(() => { modalContent.style.transform = 'translateY(0)'; }, 10);

    // 标题
    const title = document.createElement('h2');
    title.textContent = '验奖';
    title.style.color = '#2c3e50';
    title.style.marginBottom = '1.5rem';
    title.style.fontSize = '1.5rem';
    title.style.fontWeight = '600';
    title.style.textAlign = 'center';
    modalContent.appendChild(title);

    // 期数输入
    const periodLabel = document.createElement('label');
    periodLabel.textContent = '请输入期号(留空使用最新一期)：';
    periodLabel.style.display = 'block';
    periodLabel.style.marginBottom = '0.5rem';
    modalContent.appendChild(periodLabel);

    const periodInput = document.createElement('input');
    periodInput.type = 'text';
    periodInput.style.width = '80%';
    periodInput.style.padding = '0.5rem';
    periodInput.style.margin = '0 auto 1rem';
    periodInput.style.display = 'block';
    modalContent.appendChild(periodInput);

    // 红球输入
    const redLabel = document.createElement('label');
    redLabel.textContent = '请输入6个红球号码(01-33)：';
    redLabel.style.display = 'block';
    redLabel.style.marginBottom = '0.5rem';
    modalContent.appendChild(redLabel);

    const redInput = document.createElement('input');
    redInput.type = 'text';
    redInput.style.width = '80%';
    redInput.style.padding = '0.5rem';
    redInput.style.margin = '0 auto 1rem';
    redInput.style.display = 'block';
    modalContent.appendChild(redInput);

    // 蓝球输入
    const blueLabel = document.createElement('label');
    blueLabel.textContent = '请输入1个蓝球号码(01-16)：';
    blueLabel.style.display = 'block';
    blueLabel.style.marginBottom = '0.5rem';
    modalContent.appendChild(blueLabel);

    const blueInput = document.createElement('input');
    blueInput.type = 'text';
    blueInput.style.width = '80%';
    blueInput.style.padding = '0.5rem';
    blueInput.style.margin = '0 auto 1rem';
    blueInput.style.display = 'block';
    modalContent.appendChild(blueInput);

    // 按钮
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.gap = '1rem';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.padding = '0.6rem 1.2rem';
    cancelBtn.style.backgroundColor = '#e74c3c';
    cancelBtn.style.color = 'white';
    cancelBtn.style.border = 'none';
    cancelBtn.style.borderRadius = '6px';
    cancelBtn.style.cursor = 'pointer';
    cancelBtn.style.fontWeight = '500';
    cancelBtn.style.transition = 'all 0.2s ease';
    cancelBtn.addEventListener('mouseenter', () => {
        cancelBtn.style.transform = 'translateY(-2px)';
        cancelBtn.style.boxShadow = '0 4px 8px rgba(231, 76, 60, 0.3)';
    });
    cancelBtn.addEventListener('mouseleave', () => {
        cancelBtn.style.transform = 'none';
        cancelBtn.style.boxShadow = 'none';
    });
    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    buttonContainer.appendChild(cancelBtn);

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '确认验奖';
    confirmBtn.style.padding = '0.6rem 1.2rem';
    confirmBtn.style.backgroundColor = '#2ecc71';
    confirmBtn.style.color = 'white';
    confirmBtn.style.border = 'none';
    confirmBtn.style.borderRadius = '6px';
    confirmBtn.style.cursor = 'pointer';
    confirmBtn.style.fontWeight = '500';
    confirmBtn.style.transition = 'all 0.2s ease';
    confirmBtn.addEventListener('mouseenter', () => {
        confirmBtn.style.transform = 'translateY(-2px)';
        confirmBtn.style.boxShadow = '0 4px 8px rgba(46, 204, 113, 0.3)';
    });
    confirmBtn.addEventListener('mouseleave', () => {
        confirmBtn.style.transform = 'none';
        confirmBtn.style.boxShadow = 'none';
    });
    confirmBtn.addEventListener('click', () => {
        // 验证输入格式
        const inputStr = redInput.value.trim().replace(/[^0-9]/g, '');
        
        // 支持无分隔符的12位数字输入
        let userRedBalls = [];
        if (inputStr.length === 12) {
            userRedBalls = [
                inputStr.substring(0, 2),
                inputStr.substring(2, 4),
                inputStr.substring(4, 6),
                inputStr.substring(6, 8),
                inputStr.substring(8, 10),
                inputStr.substring(10, 12)
            ];
        } else {
            userRedBalls = inputStr.match(/\d{2}/g) || [];
        }
        
        // 验证红球数量
        if (userRedBalls.length !== 6) {
            alert('请输入6个红球号码');
            return;
        }
        

        
        const userBlueBall = blueInput.value.trim();
        const period = periodInput.value.trim();
        
        let resultData;
        if (period && window.ssqData && window.ssqData[period]) {
            const periodData = window.ssqData[period];
            resultData = {
                redBalls: periodData.split(',').slice(0, 6),
                blueBall: periodData.split(',').slice(-1)[0]
            };
        } else {
            resultData = window.latestResult || { redBalls: [], blueBall: '' };
        }
        
        const { redMatchCount, blueMatch, prizeLevel } = checkPrize(userRedBalls, userBlueBall, resultData);
                
        // 在控制台输出调试信息
        console.log('最新开奖数据:', latestResult);
        console.log('用户输入红球:', userRedBalls);
        console.log('用户输入蓝球:', userBlueBall);
        console.log('匹配结果:', `红球${redMatchCount}个, 蓝球${blueMatch ? '匹配' : '不匹配'}`);

        
        const resultDiv = document.createElement('div');
        resultDiv.innerHTML = `
            <p>最新开奖数据: ${latestResult}</p>
            <h3>验奖结果</h3>
            <p>红球匹配数量: ${redMatchCount}</p>
            <p>蓝球匹配: ${blueMatch ? '是' : '否'}</p>
            <p>中奖等级: ${prizeLevel}</p>
        `;
        modalContent.insertBefore(resultDiv, buttonContainer);
        
        // 隐藏输入区域
        redLabel.style.display = 'none';
        redInput.style.display = 'none';
        blueLabel.style.display = 'none';
        blueInput.style.display = 'none';
        title.textContent = '验奖结果';
        
        // 修改确认按钮为关闭按钮
        confirmBtn.textContent = '关闭';
        confirmBtn.style.backgroundColor = '#3498db';
        confirmBtn.removeEventListener('click', arguments.callee);
        confirmBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    });
    buttonContainer.appendChild(confirmBtn);

    modalContent.appendChild(buttonContainer);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

// 导出函数供其他文件使用
window.showCheckModal = showCheckModal;

// 添加查奖按钮点击事件
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('check-prize-btn').addEventListener('click', showCheckModal);
});