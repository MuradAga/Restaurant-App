document.addEventListener('DOMContentLoaded', () => {
    // HTML elementlərini seçirik
    const mainContent = document.getElementById('main-content');
    const header = document.querySelector('header');
    const menuGrid = document.querySelector('.menu-items-grid');
    const orderList = document.querySelector('.order-list');
    const totalPriceSpan = document.getElementById('total-price');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const confirmOrderBtn = document.getElementById('confirm-order-btn');
    const languageSelector = document.getElementById('language');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const tableNumberInput = document.getElementById('table-num');
    const categoryButtonsContainer = document.querySelector('.category-buttons-container'); // Kateqoriya düymələri üçün konteyner

    // Sifariş təsdiq səhifəsinin elementləri
    const confirmationPage = document.getElementById('confirmation-page');
    const addToOrderBtn = document.getElementById('add-to-order-btn');
    const callWaiterBtn = document.getElementById('call-waiter-btn');
    const requestBillBtn = document.getElementById('request-bill-btn');
    const paymentOptions = document.getElementById('payment-options');
    const paymentCashBtn = document.querySelector('.payment-cash');
    const paymentCardBtn = document.querySelector('.payment-card');
    const estimatedTimeDisplay = document.getElementById('estimated-time');

    // Custom Modal elementləri
    const customModal = document.getElementById('custom-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalOkButton = document.getElementById('modal-ok-button');
    const closeModalButton = document.querySelector('.modal .close-button');

    let cart = []; // Səbətdəki məhsulları saxlayan array
    let currentLang = 'az'; // Cari dil, default Azərbaycan
    let activeCategory = 'all'; // Aktiv kateqoriya, default 'all'
    // SPA üçün ekran history-si
    let screenHistory = [];

    // Menyu məlumatları (hər məhsula `category` sahəsi əlavə edildi)
    const menuItems = [
        { id: 1, price: 4.90, image: "files/product1.jpg", category: "burger" },
        { id: 2, price: 4.10, image: "files/product2.jpg", category: "burger" },
        { id: 3, price: 4.35, image: "files/product3.jpg", category: "burger" },
        { id: 4, price: 3.50, image: "files/product4.jpg", category: "sandwich" },
        { id: 5, price: 4.50, image: "files/product5.jpg", category: "burger" },
        { id: 6, price: 2.00, image: "files/product6.jpg", category: "side" },
        { id: 7, price: 1.50, image: "files/product7.png", category: "drink" },
        { id: 8, price: 1.00, image: "files/product8.png", category: "drink" }
    ];

    // Kateqoriya məlumatları
    const categories = [
        { key: "all", az: "Hamısı", en: "All", ru: "Все" },
        { key: "burger", az: "Burgerlər", en: "Burgers", ru: "Бургеры" },
        { key: "sandwich", az: "Sendviçlər", en: "Sandwiches", ru: "Сэндвичи" },
        { key: "side", az: "Əlavələr", en: "Sides", ru: "Гарниры" },
        { key: "drink", az: "İçkilər", en: "Drinks", ru: "Напитки" }
    ];

    // Tərcümə məlumatları (Rus dili üçün fallback ilə)
    const translations = {
        az: {
            title: "Yummi",
            tableNumberLabel: "Masa Nömrəsi:",
            languageLabel: "Dil:",
            yourOrder: "Sizin Sifarişiniz",
            emptyCart: "Səbətiniz boşdur.",
            totalPrice: "Ümumi Qiymət:",
            clearCart: "Səbəti Təmizlə",
            confirmOrder: "Sifarişi Təsdiqlə",
            orderConfirmed: "Sifarişiniz Təsdiqləndi!",
            orderSuccess: "Sifarişiniz uğurla qəbul edildi. Ofisiant qısa zamanda sizinlə əlaqə saxlayacaq.",
            addToOrder: "Sifarişə Əlavə Et",
            callWaiter: "Ofisiantı Çağır",
            requestBill: "Hesabı İstə",
            cash: "Nağd",
            card: "Kart",
            estimatedTime: "Təxmini bitmə müddəti:",
            waiterCalled: "Ofisiant çağırıldı! Qısa zamanda sizə yaxınlaşacaq.",
            billRequested: "Hesab tələbi göndərildi! Ödəniş növünü seçin.",
            paymentMethodSelected: "Ödəniş növü: {method} seçildi. Ofisiant hesabı gətirəcək.",
            backToMenu: "Menyuya Qayıt",
            selectItems: "Zəhmət olmasa sifariş etmək üçün məhsul seçin.",
            welcomeTitle: "Xoş gəlmisiniz!",
            selectLanguage: "Dil seçin:",
            startOrder: "Sifarişə başla",
            // Categories
            all: "Hamısı",
            burger: "Burgerlər",
            sandwich: "Sendviçlər",
            side: "Əlavələr",
            drink: "İçkilər",
            // Menu item translations
            item_1_name: "Texas Burger",
            item_1_description: "Mal əti, cheddar pendiri, göbələk, pomidor, soğan, Barbekü sousu",
            item_2_name: "California Burger",
            item_2_description: "Mal əti, cheddar pendiri, kahı, pomidor, qırmızı soğan, Kaliforniya sousu",
            item_3_name: "Double Cheese Burger",
            item_3_description: "İkiqat mal əti, ikiqat cheddar pendiri, kahı, pomidor, qırmızı soğan, xüsusi sous",
            item_4_name: "Toyuq Sendviç",
            item_4_description: "Toyuq filesi, kahı, pomidor, xüsusi sous",
            item_5_name: "Vegan Burger",
            item_5_description: "Noxud kotleti, avokado, kahı, pomidor, vegan sousu",
            item_6_name: "Kartof Qızartması (böyük)",
            item_6_description: "Böyük porsiya kartof qızartması",
            item_7_name: "Coca-Cola (0.5L)",
            item_7_description: "Soyuq Coca-Cola",
            item_8_name: "Su (0.5L)",
            item_8_description: "Qazsız su",
            waiterComing: "Ofisiant tezliklə sizin yanınıza gələcək.",
            backToMain: "Əsas səhifəyə qayıt",
            totalAmount: "Yekun məbləğ:",
            selectPayment: "Ödəniş növünü seçin:",
            ok: "OK",
            tableNumber: "Masa №",
            orderAdded: "Sifarişiniz əlavə edildi. Tezliklə hazır olacaq.",
        },
        en: {
            title: "Yummi",
            tableNumberLabel: "Table Number:",
            languageLabel: "Language:",
            yourOrder: "Your Order",
            emptyCart: "Your cart is empty.",
            totalPrice: "Total Price:",
            clearCart: "Clear Cart",
            confirmOrder: "Confirm Order",
            orderConfirmed: "Order Confirmed!",
            orderSuccess: "Your order has been successfully received. The waiter will contact you shortly.",
            addToOrder: "Add to Order",
            callWaiter: "Call Waiter",
            requestBill: "Request Bill",
            cash: "Cash",
            card: "Card",
            estimatedTime: "Estimated completion time:",
            waiterCalled: "Waiter called! They will approach you shortly.",
            billRequested: "Bill request sent! Please select payment method.",
            paymentMethodSelected: "Payment method: {method} selected. The waiter will bring the bill.",
            backToMenu: "Back to Menu",
            selectItems: "Please select items to order.",
            welcomeTitle: "Welcome!",
            selectLanguage: "Select language:",
            startOrder: "Start Order",
            // Categories
            all: "All",
            burger: "Burgers",
            sandwich: "Sandwiches",
            side: "Sides",
            drink: "Drinks",
            // Menu item translations
            item_1_name: "Texas Burger",
            item_1_description: "Beef, cheddar cheese, mushrooms, tomatoes, onions, BBQ sauce",
            item_2_name: "California Burger",
            item_2_description: "Beef, cheddar cheese, lettuce, tomatoes, red onion, California sauce",
            item_3_name: "Double Cheese Burger",
            item_3_description: "Double beef, double cheddar cheese, lettuce, tomatoes, red onion, special sauce",
            item_4_name: "Chicken Sandwich",
            item_4_description: "Chicken fillet, lettuce, tomatoes, special sauce",
            item_5_name: "Vegan Burger",
            item_5_description: "Chickpea patty, avocado, lettuce, tomatoes, vegan sauce",
            item_6_name: "Fries (large)",
            item_6_description: "Large portion of french fries",
            item_7_name: "Coca-Cola (0.5L)",
            item_7_description: "Cold Coca-Cola",
            item_8_name: "Water (0.5L)",
            item_8_description: "Still water",
            waiterComing: "The waiter will come to your table soon.",
            backToMain: "Back to main page",
            totalAmount: "Total amount:",
            selectPayment: "Select payment method:",
            ok: "OK",
            tableNumber: "Table №",
            orderAdded: "Your order has been added. It will be ready soon.",
        },
        ru: {
            // Rus dili üçün tərcümələr. Əgər bir tərcümə yoxdursa, Azərbaycan dilindən götürüləcək.
            title: "Yummi",
            tableNumberLabel: "Номер Стола:",
            languageLabel: "Язык:",
            yourOrder: "Ваш Заказ",
            emptyCart: "Ваша корзина пуста.",
            totalPrice: "Общая Стоимость:",
            clearCart: "Очистить Корзину",
            confirmOrder: "Подтвердить Заказ",
            orderConfirmed: "Заказ Подтвержден!",
            orderSuccess: "Ваш заказ успешно принят. Официант свяжется с вами в ближайшее время.",
            addToOrder: "Добавить к Заказу",
            callWaiter: "Вызвать Официанта",
            requestBill: "Запросить Счет",
            cash: "Наличные",
            card: "Карта",
            estimatedTime: "Примерное время выполнения:",
            waiterCalled: "Официант вызван! Он подойдет к вам в ближайшее время.",
            billRequested: "Запрос счета отправлен! Пожалуйста, выберите способ оплаты.",
            paymentMethodSelected: "Способ оплаты: {method} выбран. Официант принесет счет.",
            backToMenu: "Вернуться в Меню",
            selectItems: "Пожалуйста, выберите товары для заказа.",
            welcomeTitle: "Добро пожаловать!",
            selectLanguage: "Выберите язык:",
            startOrder: "Начать заказ",
            // Categories
            all: "Все",
            burger: "Бургеры",
            sandwich: "Сэндвичи",
            side: "Гарниры",
            drink: "Напитки",
            // Menu item translations
            item_1_name: "Техасский Бургер",
            item_1_description: "Говядина, сыр чеддер, грибы, помидоры, лук, барбекю соус",
            item_2_name: "Калифорнийский Бургер",
            item_2_description: "Говядина, сыр чеддер, салат, помидоры, красный лук, калифорнийский соус",
            item_3_name: "Двойной Чизбургер",
            item_3_description: "Двойная говядина, двойной сыр чеддер, салат, помидоры, красный лук, специальный соус",
            item_4_name: "Куриный Сэндвич",
            item_4_description: "Куриное филе, салат, помидоры, специальный соус",
            item_5_name: "Веган Бургер",
            item_5_description: "Нутовая котлета, авокадо, салат, помидоры, веганский соус",
            item_6_name: "Картофель Фри (большой)",
            item_6_description: "Большая порция картофеля фри",
            item_7_name: "Кока-Кола (0.5Л)",
            item_7_description: "Холодная Кока-Кола",
            item_8_name: "Вода (0.5Л)",
            item_8_description: "Без газа",
        }
    };

    // Tərcüməni əldə etmək üçün köməkçi funksiya (fallback ilə)
    function getTranslation(key) {
        if (translations[currentLang] && translations[currentLang][key]) {
            return translations[currentLang][key];
        }
        // Rus dili üçün Azərbaycan dilindən fallback
        if (currentLang === 'ru' && translations['az'][key]) {
            return translations['az'][key];
        }
        return key; // Tərcümə tapılmasa, açarı qaytar
    }

    // Custom Modalı göstərən funksiya
    function showModal(message) {
        modalMessage.textContent = message;
        customModal.classList.add('show');
    }

    // Custom Modalı gizlədən funksiya
    function hideModal() {
        customModal.classList.remove('show');
    }

    // Modal düymələrinə event listenerlər
    modalOkButton.addEventListener('click', hideModal);
    closeModalButton.addEventListener('click', hideModal);
    window.addEventListener('click', (event) => {
        if (event.target === customModal) {
            hideModal();
        }
    });

    // Mətnləri cari dilə uyğun yeniləyən funksiya
    function updateTexts() {
        document.title = getTranslation('title');
        // data-key atributu olan bütün elementləri yeniləyirik
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            element.textContent = getTranslation(key);
        });
        // Sadece "Ümumi Qiymət:" hissəsini yeniləyirik, rəqəmi renderCart() idarə edir.
        document.querySelector('.order-totals p span[data-key="totalPrice"]').textContent = getTranslation('totalPrice');

        renderCategoryButtons(); // Kateqoriya düymələrini yeniləmək üçün
        renderMenuItems(); // Menyu elementlərinin adlarını və təsvirlərini yeniləmək üçün
        renderCart(); // Dili dəyişdikdə səbətdəki mətnləri və qiyməti yeniləmək üçün
    }

    // Dil dəyişəndə
    languageSelector.addEventListener('change', (e) => {
        currentLang = e.target.value;
        updateTexts();
    });

    // Kateqoriya düymələrini yaratma funksiyası
    function renderCategoryButtons() {
        categoryButtonsContainer.innerHTML = '';
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = `category-button ${activeCategory === category.key ? 'active' : ''}`;
            button.dataset.category = category.key;
            button.textContent = getTranslation(category.key); // Kateqoriya adlarını tərcümə et
            button.addEventListener('click', () => {
                activeCategory = category.key;
                renderCategoryButtons(); // Aktiv kateqoriya stilini yeniləmək üçün
                renderMenuItems(); // Yeni kateqoriyaya uyğun menyunu yüklə
            });
            categoryButtonsContainer.appendChild(button);
        });
    }

    // Menyu məhsullarını dinamik yükləmə
    function renderMenuItems() {
        if (!menuGrid) {
            console.error("Xəta: '.menu-items-grid' elementi HTML-də tapılmadı. Menyu məhsulları göstərilə bilməz.");
            return;
        }

        menuGrid.innerHTML = '';
        const filteredItems = activeCategory === 'all'
            ? menuItems
            : menuItems.filter(item => item.category === activeCategory);

        filteredItems.forEach(item => {
            const menuItemDiv = document.createElement('div');
            menuItemDiv.className = 'menu-item';

            const itemName = getTranslation(`item_${item.id}_name`) || "Unknown Item";
            const itemDescription = getTranslation(`item_${item.id}_description`) || "No description available.";

            menuItemDiv.innerHTML = `
                <img src="${item.image}" alt="${itemName}" onerror="this.onerror=null;this.src='https://placehold.co/400x300/FF6600/FFFFFF?text=Image+Not+Found';">
                <div class="item-info">
                    <h3>${itemName}</h3>
                    <p>${itemDescription}</p>
                    <div class="item-price">${item.price.toFixed(2)} AZN</div>
                    <div class="item-actions">
                        <button data-id="${item.id}" data-action="decrease">-</button>
                        <span id="quantity-${item.id}">0</span>
                        <button data-id="${item.id}" data-action="increase">+</button>
                    </div>
                </div>
            `;
            menuGrid.appendChild(menuItemDiv);

            const existingItem = cart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                document.getElementById(`quantity-${item.id}`).textContent = existingItem.quantity;
            }
        });
    }

    // Səbətə məhsul əlavə etmək/çıxmaq
    menuGrid.addEventListener('click', (e) => {
        const button = e.target;
        if (button.tagName === 'BUTTON' && button.dataset.id) {
            const itemId = parseInt(button.dataset.id);
            const action = button.dataset.action;
            const item = menuItems.find(i => i.id === itemId);

            if (!item) return;

            let cartItem = cart.find(c => c.id === itemId);

            if (action === 'increase') {
                if (cartItem) {
                    cartItem.quantity++;
                } else {
                    cart.push({
                        ...item,
                        name: getTranslation(`item_${item.id}_name`) || "Unknown Item", // Tərcümə olunmuş adı əlavə et
                        quantity: 1
                    });
                }
            } else if (action === 'decrease') {
                if (cartItem && cartItem.quantity > 0) {
                    cartItem.quantity--;
                    if (cartItem.quantity === 0) {
                        cart = cart.filter(c => c.id !== itemId);
                    }
                }
            }
            updateQuantityDisplay(itemId);
            renderCart();
        }
    });

    // Menyu gridində miqdar göstəricisini yeniləmə
    function updateQuantityDisplay(itemId) {
        const quantitySpan = document.getElementById(`quantity-${itemId}`);
        if (quantitySpan) {
            const cartItem = cart.find(c => c.id === itemId);
            quantitySpan.textContent = cartItem ? cartItem.quantity : 0;
        }
    }

    // Səbəti yeniləmə funksiyası
    function renderCart() {
        orderList.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
        } else {
            emptyCartMessage.style.display = 'none';
            cart.forEach(item => {
                const orderItemDiv = document.createElement('div');
                orderItemDiv.className = 'order-item';
                // Səbətdəki məhsulun adını tərcümə obyektindən götürürük
                const displayItemName = getTranslation(`item_${item.id}_name`) || item.name;

                orderItemDiv.innerHTML = `
                    <div class="order-item-details">
                        <span>${item.quantity}x</span>
                        <span>${displayItemName}</span>
                    </div>
                    <span class="order-item-price">${(item.quantity * item.price).toFixed(2)} AZN</span>
                `;
                orderList.appendChild(orderItemDiv);
                total += item.quantity * item.price;
            });
        }
        totalPriceSpan.textContent = total.toFixed(2);
    }

    // Səbəti təmizlə düyməsi
    clearCartBtn.addEventListener('click', () => {
        cart = [];
        renderCart();
        renderMenuItems(); // Miqdarları sıfırlamaq üçün menyunu yenidən çəkirik
    });

    // Sifarişi təsdiqlə düyməsi
    confirmOrderBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showModal(getTranslation('selectItems'));
            return;
        }

        const tableNumber = tableNumberInput.value;
        const orderDetails = {
            tableNumber: tableNumber,
            items: cart.map(item => ({
                id: item.id,
                name: getTranslation(`item_${item.id}_name`) || item.name,
                quantity: item.quantity,
                price: item.price
            })),
            total: parseFloat(totalPriceSpan.textContent)
        };

        console.log("Sifariş Göndərildi:", orderDetails);
        // Sifariş məlumatlarını daha oxunaqlı şəkildə formatla
        let orderMessage = getTranslation('orderConfirmed') + "\n\n";
        orderMessage += getTranslation('tableNumber') + ": " + orderDetails.tableNumber + "\n";
        orderDetails.items.forEach(item => {
            orderMessage += item.name + " x " + item.quantity + "\n";
        });
        orderMessage += getTranslation('totalPrice') + ": " + orderDetails.total.toFixed(2) + " AZN\n";
        showModal(orderMessage);

        mainContent.style.display = 'none';
        header.style.display = 'none';
        confirmationPage.classList.add('active');

        estimatedTimeDisplay.textContent = '';
        setTimeout(() => {
            const estimatedTime = Math.floor(Math.random() * 10) + 15;
            estimatedTimeDisplay.textContent = `${getTranslation('estimatedTime')} ${estimatedTime} dəqiqə.`;
        }, 3000);
    });

    // Sifarişə əlavə et düyməsi
    addToOrderBtn.addEventListener('click', () => {
        confirmationPage.classList.remove('active');
        mainContent.style.display = 'flex';
        header.style.display = 'flex';
        paymentOptions.style.display = 'none';
        estimatedTimeDisplay.textContent = '';
    });

    // Ofisiantı çağır düyməsi
    callWaiterBtn.addEventListener('click', () => {
        showModal(getTranslation('waiterCalled'));
    });

    // Hesabı istə düyməsi
    requestBillBtn.addEventListener('click', () => {
        paymentOptions.style.display = 'flex';
        showModal(getTranslation('billRequested'));
    });

    // Nağd ödəniş seçimi
    paymentCashBtn.addEventListener('click', () => {
        showModal(getTranslation('paymentMethodSelected').replace('{method}', getTranslation('cash')));
        setTimeout(() => {
            cart = [];
            renderCart();
            renderMenuItems();
            confirmationPage.classList.remove('active');
            mainContent.style.display = 'flex';
            header.style.display = 'flex';
            paymentOptions.style.display = 'none';
            estimatedTimeDisplay.textContent = '';
            showModal(getTranslation('backToMenu'));
        }, 2000);
    });

    // Kartla ödəniş seçimi
    paymentCardBtn.addEventListener('click', () => {
        showModal(getTranslation('paymentMethodSelected').replace('{method}', getTranslation('card')));
        setTimeout(() => {
            cart = [];
            renderCart();
            renderMenuItems();
            confirmationPage.classList.remove('active');
            mainContent.style.display = 'flex';
            header.style.display = 'flex';
            paymentOptions.style.display = 'none';
            estimatedTimeDisplay.textContent = '';
            showModal(getTranslation('backToMenu'));
        }, 2000);
    });

    // Yeni mərhələ ekranları üçün elementləri seçirik
    const welcomeScreen = document.getElementById('welcome-screen');
    const startOrderBtn = document.getElementById('start-order-btn');
    const welcomeLangSelect = document.getElementById('welcome-language');
    const callWaiterBtnWelcome = document.getElementById('call-waiter-btn-welcome');
    const requestBillBtnWelcome = document.getElementById('request-bill-btn-welcome');

    const waiterCalledScreen = document.getElementById('waiter-called-screen');
    const waiterBackBtn = document.getElementById('waiter-back-btn');

    const billRequestScreen = document.getElementById('bill-request-screen');
    const billTotalSpan = document.getElementById('bill-total');
    const billOkBtn = document.getElementById('bill-ok-btn');

    const orderConfirmedScreen = document.getElementById('order-confirmed-screen');
    const confirmedTableNum = document.getElementById('confirmed-table-num');
    const addMoreBtn = document.getElementById('add-more-btn');
    const callWaiterBtnConfirmed = document.getElementById('call-waiter-btn-confirmed');
    const requestBillBtnConfirmed = document.getElementById('request-bill-btn-confirmed');

    const orderAddedScreen = document.getElementById('order-added-screen');
    const orderAddedBackBtn = document.getElementById('order-added-back-btn');
    const backToMenuBtn = document.getElementById('back-to-menu');
    const backToMainMenuBtn = document.getElementById('back-to-main-menu2');


    backToMenuBtn.addEventListener('click', () => {
        goBack();
    });

    backToMainMenuBtn.addEventListener('click', () => {
        goBack();
    });
    
    function goBack() {
        // Əgər əsas menyudayıqsa və ya yalnız bir ekran varsa, əsas ekrana qayıt
        if (screenHistory.length <= 1) {
            showMain();
            screenHistory = [];
            return;
        }
        // Sonuncu ekrana qayıt
        screenHistory.pop(); // cari ekrani sil
        const prevScreen = screenHistory[screenHistory.length - 1];
        if (prevScreen) {
            showScreen(prevScreen, true); // true: history-yə əlavə etmə
        } else {
            showMain();
        }
    }
    // Ekranlar arasında keçid funksiyası
    function showScreen(screen, skipHistory) {
        // Bütün .screen-ləri gizlət
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        if (screen) {
            screen.classList.add('active');
            // Əgər history-yə əlavə etmək lazımdırsa
            if (!skipHistory) {
                // Eyni ekranı təkrar əlavə etmə
                if (screenHistory[screenHistory.length - 1] !== screen) {
                    screenHistory.push(screen);
                }
            }
        }
        // Əsas header və main-i də gizlət
        header.style.display = 'none';
        mainContent.style.display = 'none';
    }
    function showMain() {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        header.style.display = 'flex';
        mainContent.style.display = 'flex';
        // Əsas menyuya qayıdanda history-ni sıfırla
        screenHistory = [];
    }

    // Giriş ekranında dil seçimi
    welcomeLangSelect.addEventListener('change', (e) => {
        currentLang = e.target.value;
        languageSelector.value = currentLang;
        updateTexts();
    });
    // Əsas header-də dil dəyişəndə də sinxron saxla
    languageSelector.addEventListener('change', (e) => {
        currentLang = e.target.value;
        welcomeLangSelect.value = currentLang;
        updateTexts();
    });

    // Sifarişə başla düyməsi
    startOrderBtn.addEventListener('click', () => {
        showMain();
    });

    // Ofisiantı çağır (giriş ekranı)
    callWaiterBtnWelcome.addEventListener('click', () => {
        showScreen(waiterCalledScreen);
    });
    // Ofisiantı çağır (sifariş təsdiqləndi ekranı)
    callWaiterBtnConfirmed.addEventListener('click', () => {
        showScreen(waiterCalledScreen);
    });
    // Ofisiantı çağır (əsas menyudan)
    callWaiterBtn.addEventListener('click', () => {
        showScreen(waiterCalledScreen);
    });
    // Ofisiant çağırıldı ekranından geri
    waiterBackBtn.addEventListener('click', () => {
        goBack();
    });

    // Hesabı istə (giriş ekranı)
    requestBillBtnWelcome.addEventListener('click', () => {
        billTotalSpan.textContent = totalPriceSpan.textContent;
        showScreen(billRequestScreen);
    });
    // Hesabı istə (əsas menyudan)
    requestBillBtn.addEventListener('click', () => {
        billTotalSpan.textContent = totalPriceSpan.textContent;
        showScreen(billRequestScreen);
    });
    // Hesabı istə (sifariş təsdiqləndi ekranı)
    requestBillBtnConfirmed.addEventListener('click', () => {
        billTotalSpan.textContent = totalPriceSpan.textContent;
        showScreen(billRequestScreen);
    });
    // Hesab OK düyməsi
    billOkBtn.addEventListener('click', () => {
        // Ödəniş növü seçilibsə, təsdiq modalı göstərə bilərik və ya əsas ekrana qayıda bilərik
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
        if (!paymentMethod) {
            showModal(getTranslation('selectPayment')); // Ödəniş növü seçilmədi mesajı
            alert(getTranslation('selectPayment'));
            return;
        }

        showScreen(welcomeScreen);
        cart = [];
        renderCart();
        renderMenuItems();
    });

    // Sifarişi təsdiqlə (əsas menyudan)
    confirmOrderBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showModal(getTranslation('selectItems'));
            return;
        }
        confirmedTableNum.textContent = tableNumberInput.value;
        showScreen(orderConfirmedScreen);
        cart = [];
        renderCart();
        renderMenuItems();
    });
    // Sifarişə əlavə et (sifariş təsdiqləndi ekranı)
    addMoreBtn.addEventListener('click', () => {
        showMain();
    });
    // Sifariş əlavə edildi təsdiqi (hazırda sadəcə əsas ekrana qayıdır)
    orderAddedBackBtn.addEventListener('click', () => {
        goBack();
    });

    // İlk açılışda yalnız welcome-screen aktiv olsun
    showScreen(welcomeScreen);

    // Başlanğıcda hər şeyi yüklə
    renderCategoryButtons(); // Əvvəlcə kateqoriya düymələrini yüklə
    renderMenuItems();
    renderCart();
    updateTexts(); // Başlanğıcda mətnləri cari dilə uyğun yenilə

    // DOMContentLoaded daxilində, səhifə yüklənəndə aktiv ekranı history-yə əlavə et
    const initialScreen = document.querySelector('.screen.active');
    if (initialScreen) {
        screenHistory = [initialScreen];
    }
});