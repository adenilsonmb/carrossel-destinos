// -----------------------------
// 🔹 Seleção de elementos
// -----------------------------
let prevButton = document.querySelector('.back');
let nextButton = document.querySelector('.next');
const container = document.querySelector('.container');
const list = document.querySelector('.container .list');
const thumb = document.querySelector('.container .thumb');

let prevTimer, nextTimer; // timers para botões
let hoverTimer;           // timer para thumbs
let currentActiveIndex = 0; // para evitar disparo repetido no hover

// -----------------------------
// 🔹 Função para animar o conteúdo
// -----------------------------
function animateContent(listItem) {
    const content = listItem.querySelector('.content');
    if(!content) return;

    // Remove a classe para reiniciar
    content.classList.remove('animate');

    // Força reflow para reiniciar animação
    void content.offsetWidth;

    // Adiciona a classe para disparar animação
    content.classList.add('animate');
}

// -----------------------------
// 🔹 Função para mover itens (botões)
// -----------------------------
function moveItemsOnclick(type){
    const ListItems = Array.from(list.children);
    const ThumbItems = Array.from(thumb.children);

    // Move elementos no DOM
    if(type === 'next'){
        list.appendChild(ListItems[0]);
        thumb.appendChild(ThumbItems[0]);
        container.classList.add('animationAvanco');
        nextButton.disabled = true;
    } else {
        list.prepend(ListItems[ListItems.length -1]);
        thumb.prepend(ThumbItems[ThumbItems.length -1]);
        container.classList.add('animatioVolta');
        prevButton.disabled = true;
    }

    // Atualiza lista após movimentação
    const updatedListItems = Array.from(list.children);
    updatedListItems.forEach(item => item.classList.remove('ativo'));

    // Define o item ativo correto
    let activeItem;
    currentActiveIndex = type === 'next' ? updatedListItems.length -1 : 0;
    activeItem = updatedListItems[currentActiveIndex];

    activeItem.classList.add('ativo');
    animateContent(activeItem);

    setTimeout(() => {
        container.classList.remove('animationAvanco');
        container.classList.remove('animatioVolta');
        nextButton.disabled = false;
        prevButton.disabled = false;
    }, 1000);
}

// -----------------------------
// 🔹 Botões com hover + delay
// -----------------------------
prevButton.addEventListener("mouseenter", () => {
    clearTimeout(prevTimer);
    prevTimer = setTimeout(() => moveItemsOnclick('back'), 400);
});
prevButton.addEventListener("mouseleave", () => clearTimeout(prevTimer));

nextButton.addEventListener("mouseenter", () => {
    clearTimeout(nextTimer);
    nextTimer = setTimeout(() => moveItemsOnclick('next'), 400);
});
nextButton.addEventListener("mouseleave", () => clearTimeout(nextTimer));

// -----------------------------
// 🔹 Hover nos thumbs + delay (só dispara em item novo)
// -----------------------------
thumb.addEventListener('mousemove', e => {
    const ThumbItems = Array.from(thumb.children);
    const ListItems = Array.from(list.children);

    const hoveredThumb = e.target.closest('.thumb-item');
    if(!hoveredThumb) return;

    const hoveredIndex = ThumbItems.indexOf(hoveredThumb);
    if(hoveredIndex === -1 || hoveredIndex === currentActiveIndex) return; // só se for item novo

    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
        ListItems.forEach(item => item.classList.remove('ativo'));
        ListItems[hoveredIndex].classList.add('ativo');
        animateContent(ListItems[hoveredIndex]);
        currentActiveIndex = hoveredIndex; // atualiza índice ativo
    }, 300);
});

thumb.addEventListener('mouseleave', () => clearTimeout(hoverTimer));

