document.addEventListener('DOMContentLoaded', () => {
    // --- HTML Elementləri ---
    const allScreens = document.querySelectorAll('.screen');
    const menuGrid = document.querySelector('.menu-items-grid');
    const categoryButtonsContainer = document.querySelector('.category-buttons-container');
    const tableNumberInput = document.getElementById('table-num');
    const orderList = document.querySelector('.order-list');
    const totalPriceSpan = document.getElementById('total-price');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const confirmOrderBtn = document.getElementById('confirm-order-btn');
    const languageSelector = document.getElementById('language');
    const welcomeLangSelect = document.getElementById('welcome-language');
    const customModal = document.getElementById('custom-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalOkButton = document.getElementById('modal-ok-button');
    const closeModalButton = document.querySelector('.modal .close-button');
    const startOrderBtn = document.getElementById('start-order-btn');
    const callWaiterBtnWelcome = document.getElementById('call-waiter-btn-welcome');
    const requestBillBtnWelcome = document.getElementById('request-bill-btn-welcome');
    const waiterBackBtn = document.getElementById('waiter-back-btn');
    const billOkBtn = document.getElementById('bill-ok-btn');
    const addMoreBtn = document.getElementById('add-more-btn');
    const callWaiterBtnConfirmed = document.getElementById('call-waiter-btn-confirmed');
    const requestBillBtnConfirmed = document.getElementById('request-bill-btn-confirmed');
    const backToHomeFromMenu = document.getElementById('back-to-home-from-menu');
    const backToHomeFromHesabIste = document.getElementById('back-to-home-from-hesab-iste');
    const backToHomeFromConfirmed = document.getElementById('back-to-home-from-confirmed');
    const billTotalSpan = document.getElementById('bill-total');
    const activeOrderInfoWelcome = document.getElementById('active-order-info-welcome');
    const activeTableNumberWelcome = document.getElementById('active-table-number-welcome');
    const showOrderDetailsBtnWelcome = document.getElementById('show-order-details-btn-welcome');
    const activeOrderInfoConfirmed = document.getElementById('active-order-info-confirmed');
    const activeTableNumberConfirmed = document.getElementById('active-table-number-confirmed');
    const showOrderDetailsBtnConfirmed = document.getElementById('show-order-details-btn-confirmed');

    // --- Dəyişənlər və Məlumatlar ---
    let cart = [];
    let currentLang = 'az';
    let activeCategory = 'all';
    let lastConfirmedOrder = null;

    const menuItems = [{ id: 1, price: 4.90, image: "files/product1.jpg", category: "burger" }, { id: 2, price: 4.10, image: "files/product2.jpg", category: "burger" }, { id: 3, price: 4.35, image: "files/product3.jpg", category: "burger" }, { id: 4, price: 3.50, image: "files/product4.jpg", category: "sandwich" }, { id: 5, price: 4.50, image: "files/product5.jpg", category: "burger" }, { id: 6, price: 2.00, image: "files/product6.jpg", category: "side" }, { id: 7, price: 1.50, image: "files/product7.png", category: "drink" }, { id: 8, price: 1.00, image: "files/product8.png", category: "drink" }];
    const categories = [{ key: "all", az: "Hamısı", en: "All", ru: "Все" }, { key: "burger", az: "Burgerlər", en: "Burgers", ru: "Бургеры" }, { key: "sandwich", az: "Sendviçlər", en: "Sandwiches", ru: "Сэндвичи" }, { key: "side", az: "Əlavələr", en: "Sides", ru: "Гарниры" }, { key: "drink", az: "İçkilər", en: "Drinks", ru: "Напитки" }];
    const translations = { az: { title: "Yummi", tableNumberLabel: "Masa Nömrəsi:", languageLabel: "Dil:", yourOrder: "Sizin Sifarişiniz", emptyCart: "Səbətiniz boşdur.", totalPrice: "Ümumi Qiymət:", clearCart: "Səbəti Təmizlə", confirmOrder: "Sifarişi Təsdiqlə", orderConfirmed: "Sifarişiniz təsdiqləndi!", addToOrder: "Sifarişə əlavə et", callWaiter: "Ofisiantı çağır", requestBill: "Hesabı istə", selectItems: "Zəhmət olmasa sifariş etmək üçün məhsul seçin.", welcomeTitle: "Xoş gəlmisiniz!", selectLanguage: "Dil seçin:", startOrder: "Sifarişə başla", all: "Hamısı", burger: "Burgerlər", sandwich: "Sendviçlər", side: "Əlavələr", drink: "İçkilər", item_1_name: "Texas Burger", item_1_description: "Mal əti, cheddar pendiri, göbələk, pomidor, soğan, Barbekü sousu", item_2_name: "California Burger", item_2_description: "Mal əti, cheddar pendiri, kahı, pomidor, qırmızı soğan, Kaliforniya sousu", item_3_name: "Double Cheese Burger", item_3_description: "İkiqat mal əti, ikiqat cheddar pendiri, kahı, pomidor, qırmızı soğan, xüsusi sous", item_4_name: "Toyuq Sendviç", item_4_description: "Toyuq filesi, kahı, pomidor, xüsusi sous", item_5_name: "Vegan Burger", item_5_description: "Noxud kotleti, avokado, kahı, pomidor, vegan sousu", item_6_name: "Kartof Qızartması (böyük)", item_6_description: "Böyük porsiya kartof qızartması", item_7_name: "Coca-Cola (0.5L)", item_7_description: "Soyuq Coca-Cola", item_8_name: "Su (0.5L)", item_8_description: "Qazsız su", waiterComing: "Ofisiant tezliklə sizin yanınıza gələcək.", backToMain: "Əsas səhifəyə qayıt", totalAmount: "Yekun məbləğ:", selectPayment: "Ödəniş növünü seçin:", ok: "OK", back: "Geri", tableNumber: "Masa №", orderAdded: "Sifarişiniz əlavə edildi. Tezliklə hazır olacaq.", orderDetails: "Sifariş Detalları", cash: "Nağd", card: "Kart", activeTable: "Aktiv Masa:" }, en: { title: "Yummi", tableNumberLabel: "Table Number:", languageLabel: "Language:", yourOrder: "Your Order", emptyCart: "Your cart is empty.", totalPrice: "Total Price:", clearCart: "Clear Cart", confirmOrder: "Confirm Order", orderConfirmed: "Order Confirmed!", addToOrder: "Add to Order", callWaiter: "Call Waiter", requestBill: "Request Bill", selectItems: "Please select items to order.", welcomeTitle: "Welcome!", selectLanguage: "Select language:", startOrder: "Start Order", all: "All", burger: "Burgers", sandwich: "Sandwiches", side: "Sides", drink: "Drinks", item_1_name: "Texas Burger", item_1_description: "Beef, cheddar cheese, mushrooms, tomatoes, onions, BBQ sauce", item_2_name: "California Burger", item_2_description: "Beef, cheddar cheese, lettuce, tomatoes, red onion, California sauce", item_3_name: "Double Cheese Burger", item_3_description: "Double beef, double cheddar cheese, lettuce, tomatoes, red onion, special sauce", item_4_name: "Chicken Sandwich", item_4_description: "Chicken fillet, lettuce, tomatoes, special sauce", item_5_name: "Vegan Burger", item_5_description: "Chickpea patty, avocado, lettuce, tomatoes, vegan sauce", item_6_name: "Fries (large)", item_6_description: "Large portion of french fries", item_7_name: "Coca-Cola (0.5L)", item_7_description: "Cold Coca-Cola", item_8_name: "Water (0.5L)", item_8_description: "Still water", waiterComing: "The waiter will come to your table soon.", backToMain: "Back to main page", totalAmount: "Total amount:", selectPayment: "Select payment method:", ok: "OK", back: "Back", tableNumber: "Table №", orderAdded: "Your order has been added. It will be ready soon.", orderDetails: "Order Details", cash: "Cash", card: "Card", activeTable: "Active Table:" }, ru: { title: "Yummi", tableNumberLabel: "Номер Стола:", languageLabel: "Язык:", yourOrder: "Ваш Заказ", emptyCart: "Ваша корзина пуста.", totalPrice: "Общая Стоимость:", clearCart: "Очистить Корзину", confirmOrder: "Подтвердить Заказ", orderConfirmed: "Заказ Подтвержден!", addToOrder: "Добавить к Заказу", callWaiter: "Вызвать Официанта", requestBill: "Запросить Счет", selectItems: "Пожалуйста, выберите товары для заказа.", welcomeTitle: "Добро пожаловать!", selectLanguage: "Выберите язык:", startOrder: "Начать заказ", all: "Все", burger: "Бургеры", sandwich: "Сэндвичи", side: "Гарниры", drink: "Напитки", item_1_name: "Техасский Бургер", item_1_description: "Говядина, сыр чеддер, грибы, помидоры, лук, барбекю соус", item_2_name: "Калифорнийский Бургер", item_2_description: "Говядина, сыр чеддер, салат, помидоры, красный лук, калифорнийский соус", item_3_name: "Двойной Чизбургер", item_3_description: "Двойная говядина, двойной сыр чеддер, салат, помидоры, красный лук, специальный соус", item_4_name: "Куриный Сэндвич", item_4_description: "Куриное филе, салат, помидоры, специальный соус", item_5_name: "Веган Бургер", item_5_description: "Нутовая котлета, авокадо, салат, помидоры, веганский соус", item_6_name: "Картофель Фри (большой)", item_6_description: "Большая порция картофеля фри", item_7_name: "Кока-Кола (0.5Л)", item_7_description: "Холодная Кока-Кола", item_8_name: "Вода (0.5Л)", item_8_description: "Без газа", waiterComing: "Официант скоро подойдет к вашему столику.", backToMain: "Вернуться на главную страницу", totalAmount: "Общая сумма:", selectPayment: "Выберите способ оплаты:", ok: "ХОРОШО", back: "Назад", tableNumber: "Стол №", orderAdded: "Ваш заказ добавлен. Скоро будет готов.", orderDetails: "Детали Заказа", cash: "Наличные", card: "Карта", activeTable: "Активный стол:" } };

    // --- Vəziyyətin İdarə Edilməsi ---
    function saveState() { const activeScreen = document.querySelector('.screen.active'); if (!activeScreen) return; const state = { cart, lastConfirmedOrder, activeScreenId: activeScreen.id }; localStorage.setItem('yummiAppState', JSON.stringify(state)); }
    function loadState() { const savedState = localStorage.getItem('yummiAppState'); if (savedState) { const state = JSON.parse(savedState); cart = state.cart || []; lastConfirmedOrder = state.lastConfirmedOrder || null; return state.activeScreenId; } return 'welcome-screen'; }

    // --- Əsas Funksiyalar ---
    function updateActiveOrderDisplays() {
        if (lastConfirmedOrder) {
            activeTableNumberWelcome.textContent = lastConfirmedOrder.tableNumber;
            activeTableNumberConfirmed.textContent = lastConfirmedOrder.tableNumber;
            activeOrderInfoWelcome.style.display = 'block';
            activeOrderInfoConfirmed.style.display = 'block';
        } else {
            activeOrderInfoWelcome.style.display = 'none';
            activeOrderInfoConfirmed.style.display = 'none';
        }
    }

    function showScreen(screenToShowId) {
        allScreens.forEach(s => s.classList.remove('active'));
        const screen = document.getElementById(screenToShowId);
        if (screen) {
            screen.classList.add('active');
            updateActiveOrderDisplays();
        }
        saveState();
    }

    function showModal(content) {
        modalMessage.textContent = content;
        customModal.classList.add('show');
    }

    function getTranslation(key) { return (translations[currentLang] && translations[currentLang][key]) || translations['az'][key] || key; }
    function hideModal() { customModal.classList.remove('show'); }
    function updateTexts() { document.title = getTranslation('title'); document.querySelectorAll('[data-key]').forEach(el => { el.textContent = getTranslation(el.dataset.key); }); renderCategoryButtons(); renderMenuItems(); renderCart(); }
    function renderCategoryButtons() { categoryButtonsContainer.innerHTML = ''; categories.forEach(cat => { const btn = document.createElement('button'); btn.className = `category-button ${activeCategory === cat.key ? 'active' : ''}`; btn.dataset.category = cat.key; btn.textContent = getTranslation(cat.key); btn.addEventListener('click', () => { activeCategory = cat.key; renderCategoryButtons(); renderMenuItems(); }); categoryButtonsContainer.appendChild(btn); }); }
    function renderMenuItems() { if (!menuGrid) return; menuGrid.innerHTML = ''; const fItems = activeCategory === 'all' ? menuItems : menuItems.filter(item => item.category === activeCategory); fItems.forEach(item => { const div = document.createElement('div'); div.className = 'menu-item'; const name = getTranslation(`item_${item.id}_name`); const desc = getTranslation(`item_${item.id}_description`); div.innerHTML = `<img src="${item.image}" alt="${name}"><div class="item-info"><h3>${name}</h3><p>${desc}</p><div class="item-price">${item.price.toFixed(2)} AZN</div><div class="item-actions"><button data-id="${item.id}" data-action="decrease">-</button><span id="quantity-${item.id}">0</span><button data-id="${item.id}" data-action="increase">+</button></div></div>`; menuGrid.appendChild(div); const cItem = cart.find(ci => ci.id === item.id); if (cItem) document.getElementById(`quantity-${item.id}`).textContent = cItem.quantity; }); }
    function renderCart() { orderList.innerHTML = ''; let total = 0; if (cart.length === 0) { emptyCartMessage.style.display = 'block'; } else { emptyCartMessage.style.display = 'none'; cart.forEach(item => { const div = document.createElement('div'); div.className = 'order-item'; div.innerHTML = `<div class="order-item-details"><span>${item.quantity}x</span><span>${getTranslation(`item_${item.id}_name`)}</span></div><span class="order-item-price">${(item.quantity * item.price).toFixed(2)} AZN</span>`; orderList.appendChild(div); total += item.quantity * item.price; }); } totalPriceSpan.textContent = total.toFixed(2); billTotalSpan.textContent = total.toFixed(2); saveState(); }

    // --- Event Listeners ---
    modalOkButton.addEventListener('click', hideModal);
    closeModalButton.addEventListener('click', hideModal);

    const handleLanguageChange = (e) => { currentLang = e.target.value; languageSelector.value = currentLang; welcomeLangSelect.value = currentLang; updateTexts(); };
    welcomeLangSelect.addEventListener('change', handleLanguageChange);
    languageSelector.addEventListener('change', handleLanguageChange);

    startOrderBtn.addEventListener('click', () => showScreen('menu-screen'));
    addMoreBtn.addEventListener('click', () => showScreen('menu-screen'));

    [backToHomeFromMenu, backToHomeFromHesabIste, waiterBackBtn, backToHomeFromConfirmed].forEach(btn => {
        btn.addEventListener('click', () => showScreen('welcome-screen'));
    });

    [callWaiterBtnWelcome, callWaiterBtnConfirmed].forEach(btn => btn.addEventListener('click', () => showScreen('waiter-called-screen')));
    [requestBillBtnWelcome, requestBillBtnConfirmed].forEach(btn => btn.addEventListener('click', () => { if (lastConfirmedOrder) { renderCart(); } showScreen('bill-request-screen'); }));

    menuGrid.addEventListener('click', (e) => { const btn = e.target; if (btn.tagName === 'BUTTON' && btn.dataset.id) { const id = parseInt(btn.dataset.id); const action = btn.dataset.action; let cItem = cart.find(c => c.id === id); if (action === 'increase') { if (cItem) { cItem.quantity++; } else { cart.push({ ...menuItems.find(i => i.id === id), quantity: 1 }); } } else if (action === 'decrease' && cItem && cItem.quantity > 0) { cItem.quantity--; if (cItem.quantity === 0) cart = cart.filter(c => c.id !== id); } const qSpan = document.getElementById(`quantity-${id}`); if (qSpan) qSpan.textContent = cItem ? cItem.quantity : 0; renderCart(); } });

    clearCartBtn.addEventListener('click', () => { cart = []; renderCart(); renderMenuItems(); });

    confirmOrderBtn.addEventListener('click', () => {
        if (cart.length === 0) return;

        lastConfirmedOrder = {
            tableNumber: tableNumberInput.value,
            items: JSON.parse(JSON.stringify(cart)),
            total: totalPriceSpan.textContent
        };
        showScreen('order-confirmed-screen');
    });

    // Sifariş detallarını göstərmək üçün birbaşa funksiya
    const displayOrderDetails = () => {
        if (!lastConfirmedOrder || !lastConfirmedOrder.items || lastConfirmedOrder.items.length === 0) {
            showModal(getTranslation('selectItems'));
            return;
        }
    
        let detailsText = `${getTranslation('orderConfirmed')}\n--------------------\n`;
        detailsText += `${getTranslation('tableNumberLabel')} ${lastConfirmedOrder.tableNumber}\n\n`;
    
        lastConfirmedOrder.items.forEach(item => {
            detailsText += `${item.quantity}x ${getTranslation(`item_${item.id}_name`)} - ${(item.quantity * item.price).toFixed(2)} AZN\n`;
        });
    
        detailsText += `\n${getTranslation('totalPrice')} ${lastConfirmedOrder.total} AZN`;
    
        showModal(detailsText);
    };
    
    if (showOrderDetailsBtnWelcome) {
        showOrderDetailsBtnWelcome.addEventListener('click', displayOrderDetails);
    }
    if (showOrderDetailsBtnConfirmed) {
        showOrderDetailsBtnConfirmed.addEventListener('click', displayOrderDetails);
    }

    billOkBtn.addEventListener('click', () => {
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
        if (!paymentMethod) { alert("Zəhmət olmasa seçim edin."); showModal(getTranslation('selectPayment')); return; }
        showModal(`Hesab ${getTranslation(paymentMethod.value)} ödənişi üçün ofisianta yönləndirildi.`);
        cart = [];
        lastConfirmedOrder = null;
        renderCart();
        localStorage.removeItem('yummiAppState');
        showScreen('welcome-screen');
    });

    // --- İLK YÜKLƏNMƏ ---
    function initialize() {
        const lastScreenId = loadState();
        updateTexts();
        updateActiveOrderDisplays(); // <--- Bunu əlavə et!
        showScreen(lastScreenId || 'welcome-screen');
    }

    initialize();
});