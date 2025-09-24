const addKdoBtn = document.getElementById("addKdoBtn");
const inputTag = document.getElementById("kdoInput");
const kdoListUl = document.getElementById("kdoList");
const itemsLeftSpan = document.getElementById("remaining-count");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const filterBtns = document.querySelectorAll(".filter-btn");

let kdos = JSON.parse(localStorage.getItem("kdos")) || [];
let currentFilter = "all";

const saveKdos = () => {
    localStorage.setItem("kdos", JSON.stringify(kdos));
};

const renderKdos = () => {
    kdoListUl.innerHTML = "";

    const filteredKdos = kdos.filter(kdo => {
        if (currentFilter === "active") return !kdo.isCompleted;
        if (currentFilter === "completed") return kdo.isCompleted;
        return true;
    });

    filteredKdos.forEach((kdo) => {
        const li = document.createElement("li");
        li.id = kdo.id;
        li.classList.add("kdo-item");
        if (kdo.isCompleted) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <input type="checkbox" class="kdo-checkbox" ${kdo.isCompleted ? "checked" : ""}>
            <span class="kdo-text">${kdo.title}</span>
            <button class="delete-btn">×</button>
        `;
        kdoListUl.appendChild(li);
    });

    const activeKdos = kdos.filter(kdo => !kdo.isCompleted).length;
    itemsLeftSpan.textContent = activeKdos;
};

addKdoBtn.addEventListener("click", () => {
    const kdoText = inputTag.value.trim();
    if (kdoText === "") return;

    const newKdo = {
        id: "kdo-" + Date.now(),
        title: kdoText,
        isCompleted: false
    };
    kdos.push(newKdo);
    saveKdos();
    renderKdos();
    inputTag.value = "";
});

kdoListUl.addEventListener("click", (e) => {
    const target = e.target;
    const parentLi = target.closest(".kdo-item");
    if (!parentLi) return;

    const kdoId = parentLi.id;

    if (target.classList.contains("kdo-checkbox")) {
        const kdoIndex = kdos.findIndex(kdo => kdo.id === kdoId);
        if (kdoIndex > -1) {
            kdos[kdoIndex].isCompleted = target.checked;
            saveKdos();
            renderKdos();
        }
    }

    if (target.classList.contains("delete-btn")) {
        if (confirm("Do you want to delete this task?")) {
            kdos = kdos.filter(kdo => kdo.id !== kdoId);
            saveKdos();
            renderKdos();
        }
    }
});

clearCompletedBtn.addEventListener("click", () => {
    kdos = kdos.filter(kdo => !kdo.isCompleted);
    saveKdos();
    renderKdos();
});

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderKdos();
    });
});

renderKdos();