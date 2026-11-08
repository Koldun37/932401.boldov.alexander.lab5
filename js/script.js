// =========================================================
// ЧАСТЬ 1. Лабораторная работа №4 (расчёты в консоли)
// =========================================================
const magnitudes = [-2.4, -1.46, -0.05, 0.03, 2.1, 5.2, 5.8];

function findMinMagnitude(arr) {
    let min = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < min) min = arr[i];
    }
    return min;
}

function findMaxMagnitude(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i];
    }
    return max;
}

function filterBrightObjects(arr, limit = 3) {
    const brightObjects = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < limit) brightObjects.push(arr[i]);
    }
    return brightObjects;
}

function calculateSum(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

const brightestObject = findMinMagnitude(magnitudes);
const dimmestObject = findMaxMagnitude(magnitudes);
const brightList = filterBrightObjects(magnitudes, 3);
const totalSum = calculateSum(magnitudes);
const averageMagnitude = (totalSum / magnitudes.length).toFixed(2);

console.log(`ЛР №4 | Средняя яркость: ${averageMagnitude}m, ярких объектов: ${brightList.length}`);
if (brightestObject <= -2) {
    console.log("ЛР №4 | Среди объектов есть очень яркие – возможно, это планеты!");
}


// =========================================================
// ЧАСТЬ 2. Лабораторная работа №5 (DOM и localStorage)
// =========================================================

const defaultSpaceObjects = [
    { id: 1, name: "Сириус", type: "Звезда", brightness: "−1,46 mag" },
    { id: 2, name: "Вега", type: "Звезда", brightness: "+0,03 mag" },
    { id: 3, name: "Арктур", type: "Звезда", brightness: "−0,05 mag" },
    { id: 4, name: "Бетельгейзе", type: "Красный сверхгигант", brightness: "0 – 1,3 mag" }
];

const STORAGE_KEYS = {
    OBJECTS: "astro_space_objects",
    THEME: "astro_theme",
    HIDDEN: "astro_objects_hidden"
};

// Проверка существования элемента (обработка ошибок)
function checkElement(element, selectorName) {
    if (!element) {
        console.warn(`Предупреждение: элемент "${selectorName}" не найден в DOM.`);
        return false;
    }
    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    // 1. Поиск элементов через getElementById, querySelector, querySelectorAll
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    const themeLabel = document.getElementById("theme-label");
    const toggleObjectsBtn = document.getElementById("toggle-objects-btn");
    const objectsContent = document.getElementById("objects-content");
    const addObjectBtn = document.getElementById("add-object-btn");
    const objectsCountSpan = document.getElementById("objects-count");

    const nameInput = document.getElementById("object-name-input");
    const typeInput = document.getElementById("object-type-input");
    const brightnessInput = document.getElementById("object-brightness-input");

    const objectsSection = document.querySelector("#objects");
    const objectsContainer = document.querySelector(".objects-container");
    const navLinks = document.querySelectorAll(".nav-link");

    console.log(`Найдено ссылок в навигации: ${navLinks.length}`);

    // Демонстрация проверки несуществующего элемента
    const missingElement = document.getElementById("non-existent-block");
    checkElement(missingElement, "#non-existent-block");

    // 2. Загрузка и сохранение списка объектов в localStorage
    function loadObjectsFromStorage() {
        const saved = localStorage.getItem(STORAGE_KEYS.OBJECTS);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (error) {
                console.error("Ошибка чтения данных из localStorage:", error);
                return [...defaultSpaceObjects];
            }
        }
        return [...defaultSpaceObjects];
    }

    function saveObjectsToStorage(objectsArray) {
        localStorage.setItem(STORAGE_KEYS.OBJECTS, JSON.stringify(objectsArray));
    }

    let spaceObjects = loadObjectsFromStorage();

    // 3. Отрисовка карточек объектов в DOM
    function renderObjects() {
        if (!checkElement(objectsContainer, ".objects-container")) return;

        objectsContainer.innerHTML = "";

        spaceObjects.forEach((obj) => {
            const card = document.createElement("article");
            card.className = "object-card";
            card.setAttribute("data-id", obj.id);

            const title = document.createElement("h3");
            title.textContent = obj.name;

            const typeParagraph = document.createElement("p");
            const typeStrong = document.createElement("strong");
            typeStrong.textContent = "Тип: ";
            typeParagraph.appendChild(typeStrong);
            typeParagraph.append(obj.type);

            const brightnessParagraph = document.createElement("p");
            const brightnessStrong = document.createElement("strong");
            brightnessStrong.textContent = "Яркость: ";
            brightnessParagraph.appendChild(brightnessStrong);
            brightnessParagraph.append(obj.brightness);

            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "delete-btn";
            deleteBtn.textContent = "Удалить";
            deleteBtn.setAttribute("aria-label", `Удалить объект ${obj.name}`);

            deleteBtn.addEventListener("click", () => {
                deleteObject(obj.id);
            });

            card.appendChild(title);
            card.appendChild(typeParagraph);
            card.appendChild(brightnessParagraph);
            card.appendChild(deleteBtn);

            objectsContainer.appendChild(card);
        });

        if (checkElement(objectsCountSpan, "#objects-count")) {
            objectsCountSpan.textContent = spaceObjects.length;
        }
    }

    // 4. Добавление нового объекта
    function addObject() {
        if (
            !checkElement(nameInput, "#object-name-input") ||
            !checkElement(typeInput, "#object-type-input") ||
            !checkElement(brightnessInput, "#object-brightness-input")
        ) {
            return;
        }

        let name = nameInput.value.trim();
        let type = typeInput.value.trim();
        let brightness = brightnessInput.value.trim();

        if (!name) {
            name = prompt("Введите название объекта:", "Туманность Андромеды");
            if (!name || !name.trim()) return;
        }
        if (!type) {
            type = prompt("Введите тип объекта (Звезда, Планета, Галактика):", "Галактика") || "Неизвестный тип";
        }
        if (!brightness) {
            brightness = prompt("Введите видимую звёздную величину:", "+3,4 mag") || "—";
        }

        const newObject = {
            id: Date.now(),
            name: name.trim(),
            type: type.trim(),
            brightness: brightness.trim()
        };

        spaceObjects.push(newObject);
        saveObjectsToStorage(spaceObjects);
        renderObjects();

        nameInput.value = "";
        typeInput.value = "";
        brightnessInput.value = "";
    }

    // 5. Удаление объекта по ID
    function deleteObject(id) {
        spaceObjects = spaceObjects.filter((item) => item.id !== id);
        saveObjectsToStorage(spaceObjects);
        renderObjects();
    }

    // 6. Переключение темы (светлая / тёмная) + сохранение в localStorage
    function applyTheme(theme) {
        if (!checkElement(themeToggleBtn, "#theme-toggle-btn")) return;

        if (theme === "light") {
            document.body.classList.add("light-theme");
            themeToggleBtn.setAttribute("aria-pressed", "true");
            if (themeLabel) themeLabel.textContent = "Светлая";
        } else {
            document.body.classList.remove("light-theme");
            themeToggleBtn.setAttribute("aria-pressed", "false");
            if (themeLabel) themeLabel.textContent = "Тёмная";
        }
    }

    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || "dark";
    applyTheme(savedTheme);

    if (checkElement(themeToggleBtn, "#theme-toggle-btn")) {
        themeToggleBtn.addEventListener("click", () => {
            const isLight = document.body.classList.contains("light-theme");
            const nextTheme = isLight ? "dark" : "light";
            applyTheme(nextTheme);
            localStorage.setItem(STORAGE_KEYS.THEME, nextTheme);
        });
    }

    // 7. Скрытие и показ содержимого секции объектов + сохранение состояния
    function applySectionVisibility(isHidden) {
        if (!checkElement(objectsContent, "#objects-content") || !checkElement(toggleObjectsBtn, "#toggle-objects-btn")) {
            return;
        }

        if (isHidden) {
            objectsContent.classList.add("hidden");
            toggleObjectsBtn.textContent = "Показать объекты";
            toggleObjectsBtn.setAttribute("aria-expanded", "false");
        } else {
            objectsContent.classList.remove("hidden");
            toggleObjectsBtn.textContent = "Скрыть объекты";
            toggleObjectsBtn.setAttribute("aria-expanded", "true");
        }
    }

    const savedHiddenState = localStorage.getItem(STORAGE_KEYS.HIDDEN) === "true";
    applySectionVisibility(savedHiddenState);

    if (checkElement(toggleObjectsBtn, "#toggle-objects-btn")) {
        toggleObjectsBtn.addEventListener("click", () => {
            if (!checkElement(objectsContent, "#objects-content")) return;
            const willBeHidden = !objectsContent.classList.contains("hidden");
            applySectionVisibility(willBeHidden);
            localStorage.setItem(STORAGE_KEYS.HIDDEN, String(willBeHidden));
        });
    }

    if (checkElement(addObjectBtn, "#add-object-btn")) {
        addObjectBtn.addEventListener("click", addObject);
    }

    // Первичная отрисовка карточек при загрузке страницы
    renderObjects();
});