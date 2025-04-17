function checkPrize(userNumbers, latestResult) {
    // 处理数字的等价性（如08和8）
    const normalizedUserNumbers = userNumbers.map(num => parseInt(num).toString());
    const normalizedLatestNumbers = latestResult.numbers.map(num => parseInt(num).toString());
    
    // 计算匹配的数字数量
    const matchCount = normalizedUserNumbers.filter((num, index) => 
        num === normalizedLatestNumbers[index]
    ).length;
    
    return {
        matchCount,
        prizeLevel: calculatePrizeLevel(matchCount)
    };
}

function calculatePrizeLevel(matchCount) {
    if (matchCount === 3) return '一等奖';
    if (matchCount === 2) return '二等奖';
    if (matchCount === 1) return '三等奖';
    return '未中奖';
}

function showCheckModal() {
    // 创建模态框
    const modal = document.createElement('div');
    
    // 加载开奖数据
    fetch('../data/fc3d_data.json')
        .then(response => response.json())
        .then(data => {
            window.fc3dData = data;
            const latestPeriod = Object.keys(data).sort().pop();
            const latestData = data[latestPeriod];
            window.latestResult = {
                numbers: latestData.split(',')
            };
        })
        .catch(error => {
            console.error('加载开奖数据失败:', error);
            window.latestResult = { numbers: [] };
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
    title.textContent = '福彩3D验奖';
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

    // 百位输入
    const hundredLabel = document.createElement('label');
    hundredLabel.textContent = '百位号码(0-9)：';
    hundredLabel.style.display = 'block';
    hundredLabel.style.marginBottom = '0.5rem';
    modalContent.appendChild(hundredLabel);

    const hundredInput = document.createElement('input');
    hundredInput.type = 'text';
    hundredInput.style.width = '80%';
    hundredInput.style.padding = '0.5rem';
    hundredInput.style.margin = '0 auto 1rem';
    hundredInput.style.display = 'block';
    modalContent.appendChild(hundredInput);

    // 十位输入
    const tenLabel = document.createElement('label');
    tenLabel.textContent = '十位号码(0-9)：';
    tenLabel.style.display = 'block';
    tenLabel.style.marginBottom = '0.5rem';
    modalContent.appendChild(tenLabel);

    const tenInput = document.createElement('input');
    tenInput.type = 'text';
    tenInput.style.width = '80%';
    tenInput.style.padding = '0.5rem';
    tenInput.style.margin = '0 auto 1rem';
    tenInput.style.display = 'block';
    modalContent.appendChild(tenInput);

    // 个位输入
    const unitLabel = document.createElement('label');
    unitLabel.textContent = '个位号码(0-9)：';
    unitLabel.style.display = 'block';
    unitLabel.style.marginBottom = '0.5rem';
    modalContent.appendChild(unitLabel);

    const unitInput = document.createElement('input');
    unitInput.type = 'text';
    unitInput.style.width = '80%';
    unitInput.style.padding = '0.5rem';
    unitInput.style.margin = '0 auto 1rem';
    unitInput.style.display = 'block';
    modalContent.appendChild(unitInput);

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
        // 获取用户输入
        const hundred = hundredInput.value.trim();
        const ten = tenInput.value.trim();
        const unit = unitInput.value.trim();
        const period = periodInput.value.trim();
        
        // 验证输入
        if (!hundred || !ten || !unit) {
            alert('请输入完整的3位号码');
            return;
        }
        
        const userNumbers = [hundred, ten, unit];
        
        let resultData;
        if (period && window.fc3dData && window.fc3dData[period]) {
            const periodData = window.fc3dData[period];
            resultData = {
                numbers: periodData.split(',')
            };
        } else {
            resultData = window.latestResult || { numbers: [] };
        }
        
        const { matchCount, prizeLevel } = checkPrize(userNumbers, resultData);
        
        // 显示结果
        const resultDiv = document.createElement('div');
        resultDiv.innerHTML = `
            <p>最新开奖数据: 百位 ${resultData.numbers[0]} 十位 ${resultData.numbers[1]} 个位 ${resultData.numbers[2]}</p>
            <h3>验奖结果</h3>
            <p>匹配数字数量: ${matchCount}</p>
            <p>中奖等级: ${prizeLevel}</p>
        `;
        modalContent.insertBefore(resultDiv, buttonContainer);
        
        // 隐藏输入区域
        periodLabel.style.display = 'none';
        periodInput.style.display = 'none';
        hundredLabel.style.display = 'none';
        hundredInput.style.display = 'none';
        tenLabel.style.display = 'none';
        tenInput.style.display = 'none';
        unitLabel.style.display = 'none';
        unitInput.style.display = 'none';
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