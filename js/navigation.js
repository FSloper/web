// 导航菜单配置
const navLinks = [
    { href: "../", text: "首页", isLogo: true },
    { href: "../", text: "首页" },
    { href: "../html/ssq.html", text: "双色球" },
    { href: "../html/kl8.html", text: "快乐8" },
    { href: "../html/fc3d.html", text: "福彩3D" },
    { href: "../html/dlt.html", text: "大乐透" },
    { href: "../html/tc7xc.html", text: "七星彩" },
    { href: "../html/pl.html", text: "排列" },
    { href: "../html/qlc.html", text: "七乐彩" },
];

// 生成导航菜单
function generateNavigation() {
    const navContainer = document.getElementById('nav-container');
    const nav = document.createElement('nav');
    const navDiv = document.createElement('div');
    navDiv.className = 'nav-links';

    navLinks.forEach(link => {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.text;
        
        if (link.isLogo) {
            const img = document.createElement('img');
            img.src = '../img/favicon.ico';
            img.className = 'logo';
            a.innerHTML = '';
            a.appendChild(img);
        }
        
        navDiv.appendChild(a);
    });

    nav.appendChild(navDiv);
    navContainer.appendChild(nav);
}

// 下载功能
function setupDownloadButton(buttonId, fileName) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.addEventListener('click', () => {
            const filePath = `../data/${fileName}`;
            const link = document.createElement('a');
            link.href = filePath;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
}

// 页面加载完成后生成导航和设置下载按钮
document.addEventListener('DOMContentLoaded', () => {
    generateNavigation();
    setupDownloadButton('ssq-download-data', 'ssq_data.json');
    setupDownloadButton('kl8-download-data','kl8_data.json');
    setupDownloadButton('fc3d-download-data','fc3d_data.json');
    setupDownloadButton('dlt-download-data','dlt_data.json');
    setupDownloadButton('tc7xc-download-data','tc7xc_data.json');
    setupDownloadButton('pl-download-data','pl_data.json');
    setupDownloadButton('qlc-download-data','qlc_data.json');
});