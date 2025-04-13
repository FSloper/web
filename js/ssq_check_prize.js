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
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '2000';

    // 模态框内容
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '2rem';
    modalContent.style.borderRadius = '8px';
    modalContent.style.width = '400px';
    modalContent.style.maxWidth = '90%';

    // 标题
    const title = document.createElement('h2');
    title.textContent = '验奖';
    modalContent.appendChild(title);

    // 红球输入
    const redLabel = document.createElement('label');
    redLabel.textContent = '请输入6个红球号码(01-33)，用空格分隔：';
    redLabel.style.display = 'block';
    redLabel.style.marginBottom = '0.5rem';
    modalContent.appendChild(redLabel);

    const redInput = document.createElement('input');
    redInput.type = 'text';
    redInput.style.width = '100%';
    redInput.style.padding = '0.5rem';
    redInput.style.marginBottom = '1rem';
    modalContent.appendChild(redInput);

    // 蓝球输入
    const blueLabel = document.createElement('label');
    blueLabel.textContent = '请输入1个蓝球号码(01-16)：';
    blueLabel.style.display = 'block';
    blueLabel.style.marginBottom = '0.5rem';
    modalContent.appendChild(blueLabel);

    const blueInput = document.createElement('input');
    blueInput.type = 'text';
    blueInput.style.width = '100%';
    blueInput.style.padding = '0.5rem';
    blueInput.style.marginBottom = '1rem';
    modalContent.appendChild(blueInput);

    // 按钮
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.gap = '1rem';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.padding = '0.5rem 1rem';
    cancelBtn.style.backgroundColor = '#e74c3c';
    cancelBtn.style.color = 'white';
    cancelBtn.style.border = 'none';
    cancelBtn.style.borderRadius = '4px';
    cancelBtn.style.cursor = 'pointer';
    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    buttonContainer.appendChild(cancelBtn);

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '确认验奖';
    confirmBtn.style.padding = '0.5rem 1rem';
    confirmBtn.style.backgroundColor = '#2ecc71';
    confirmBtn.style.color = 'white';
    confirmBtn.style.border = 'none';
    confirmBtn.style.borderRadius = '4px';
    confirmBtn.style.cursor = 'pointer';
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
        const latestResult = window.latestResult || { redBalls: [], blueBall: '' };
        const { redMatchCount, blueMatch, prizeLevel } = checkPrize(userRedBalls, userBlueBall, latestResult);
        
        // 在页面上显示调试信息
        const debugDiv = document.createElement('div');
        debugDiv.style.marginBottom = '1rem';
        debugDiv.style.padding = '0.5rem';
        debugDiv.style.backgroundColor = '#f5f5f5';
        debugDiv.style.borderRadius = '4px';
        debugDiv.innerHTML = `
            <h4>调试信息</h4>
            <p>最新开奖数据: ${JSON.stringify(latestResult)}</p>
            <p>用户输入红球: ${JSON.stringify(userRedBalls)}</p>
            <p>用户输入蓝球: ${userBlueBall}</p>
            <p>匹配结果: 红球${redMatchCount}个, 蓝球${blueMatch ? '匹配' : '不匹配'}</p>
        `;
        
        // 在控制台输出调试信息
        console.log('最新开奖数据:', latestResult);
        console.log('用户输入红球:', userRedBalls);
        console.log('用户输入蓝球:', userBlueBall);
        console.log('匹配结果:', `红球${redMatchCount}个, 蓝球${blueMatch ? '匹配' : '不匹配'}`);

        
        const resultDiv = document.createElement('div');
        resultDiv.innerHTML = `
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