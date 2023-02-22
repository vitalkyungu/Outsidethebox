const pages = ["page1", "page2", "page3", "page4"];

function loadPage(page) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "data.json", true);
    xhr.onload = function () {
        if (this.status === 200) {
            const data = JSON.parse(this.responseText);
            document.getElementById("page-title").textContent = data[page].title;
            document.getElementById("page-content").textContent = data[page].content;
        }
    }};