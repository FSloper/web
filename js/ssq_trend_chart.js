// 从URL参数获取期号
const urlParams = new URLSearchParams(window.location.search);
const period = urlParams.get('period');

// 获取数据
fetch('../data/ssq_data.json')
    .then(response => response.json())
    .then(data => {
        // 处理数据用于图表
        const chartData = processDataForChart(data, period);
        
        // 渲染图表
        renderTrendChart(chartData);
    });

function processDataForChart(data, targetPeriod) {
    // 处理数据为图表需要的格式
    // 返回包含labels和datasets的对象
    return {
        labels: [],
        datasets: []
    };
}

function renderTrendChart(chartData) {
    const ctx = document.getElementById('trendChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}