// 导航菜单配置
const navLinks = [
    { href: "../index.html", text: "首页", isLogo: true },
    { href: "../index.html", text: "首页" },
    { href: "../html/ssq.html", text: "双色球" },
    { href: "../html/kl8.html", text: "快乐8" },
    { href: "../html/fc3d.html", text: "福彩3D" },
    { href: "../html/dlt.html", text: "大乐透" },
    { href: "../html/tc7xc.html", text: "七乐彩" },
    { href: "../html/pl.html", text: "排列" }
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

// 页面加载完成后生成导航
document.addEventListener('DOMContentLoaded', generateNavigation);