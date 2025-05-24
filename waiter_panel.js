// waiter_panel.js

document.addEventListener('DOMContentLoaded', () => {
    const newOrdersList = document.getElementById('newOrdersList');
    const activeOrdersList = document.getElementById('activeOrdersList');
    const serviceRequestsList = document.getElementById('serviceRequestsList');

    const noNewOrdersMessage = document.getElementById('noNewOrdersMessage');
    const noActiveOrdersMessage = document.getElementById('noActiveOrdersMessage');
    const noServiceRequestsMessage = document.getElementById('noServiceRequestsMessage');

    let orders = []; // Bütün sifarişləri saxlayacaq massiv
    let serviceRequests = []; // Bütün xidmət sorğularını saxlayacaq massiv

    // Sifarişləri və sorğuları yerli yaddaşdan yükləmək (səhifə yenilənəndə itməməsi üçün)
    function loadFromLocalStorage() {
        const storedOrders = localStorage.getItem('waiterPanelOrders');
        const storedRequests = localStorage.getItem('waiterPanelRequests');

        if (storedOrders) {
            orders = JSON.parse(storedOrders);
        }
        if (storedRequests) {
            serviceRequests = JSON.parse(storedRequests);
        }
    }

    // Sifarişləri və sorğuları yerli yaddaşa saxlamaq
    function saveToLocalStorage() {
        localStorage.setItem('waiterPanelOrders', JSON.stringify(orders));
        localStorage.setItem('waiterPanelRequests', JSON.stringify(serviceRequests));
    }

    // Sifariş kartını yaradan funksiya
    function createOrderCard(order) {
        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card');
        orderCard.dataset.orderId = order.id;

        let itemsHtml = order.items.map(item => `
            <li>${item.name} x ${item.quantity} (${item.price.toFixed(2)} AZN)</li>
        `).join('');

        orderCard.innerHTML = `
            <h3>Masa #${order.tableNumber} - Sifariş #${order.id}</h3>
            <p><strong>Ümumi Qiymət:</strong> ${order.totalPrice.toFixed(2)} AZN</p>
            <p><strong>Vaxt:</strong> ${new Date(order.timestamp).toLocaleTimeString()}</p>
            <h4>Məhsullar:</h4>
            <ul>${itemsHtml}</ul>
            <div class="order-actions">
                ${order.status === 'new' ? `<button class="btn btn-accept" data-action="accept">Qəbul et</button>` : ''}
                ${order.status === 'preparing' ? `<button class="btn btn-ready" data-action="ready">Hazırdır</button>` : ''}
                ${order.status === 'ready' ? `<button class="btn btn-deliver" data-action="deliver">Çatdırıldı</button>` : ''}
                <button class="btn btn-cancel" data-action="cancel">Ləğv et</button>
            </div>
            <p><strong>Status:</strong> <span class="order-status status-${order.status}">${getStatusText(order.status)}</span></p>
        `;
        return orderCard;
    }

    // Xidmət sorğusu kartını yaradan funksiya
    function createRequestCard(request) {
        const requestCard = document.createElement('div');
        requestCard.classList.add('request-card');
        requestCard.dataset.requestId = request.id;

        requestCard.innerHTML = `
            <h3>Masa #${request.tableNumber} - ${request.type === 'callWaiter' ? 'Ofisiantı Çağırır' : 'Hesab İstəyir'}</h3>
            <p><strong>Vaxt:</strong> ${new Date(request.timestamp).toLocaleTimeString()}</p>
            <div class="request-actions">
                <button class="btn resolve-request" data-action="resolve">Həll edildi</button>
            </div>
        `;
        return requestCard;
    }

    // Status mətnini qaytaran funksiya
    function getStatusText(status) {
        switch (status) {
            case 'new': return 'Yeni';
            case 'preparing': return 'Hazırlanır';
            case 'ready': return 'Hazırdır';
            case 'delivered': return 'Çatdırıldı';
            case 'cancelled': return 'Ləğv Edildi';
            default: return status;
        }
    }

    // Bütün siyahıları yeniləyən funksiya
    function updateLists() {
        newOrdersList.innerHTML = '';
        activeOrdersList.innerHTML = '';
        serviceRequestsList.innerHTML = '';

        const newOrders = orders.filter(order => order.status === 'new');
        const activeOrders = orders.filter(order => order.status === 'preparing' || order.status === 'ready');

        if (newOrders.length === 0) {
            noNewOrdersMessage.style.display = 'block';
        } else {
            noNewOrdersMessage.style.display = 'none';
            newOrders.forEach(order => newOrdersList.appendChild(createOrderCard(order)));
        }

        if (activeOrders.length === 0) {
            noActiveOrdersMessage.style.display = 'block';
        } else {
            noActiveOrdersMessage.style.display = 'none';
            activeOrders.forEach(order => activeOrdersList.appendChild(createOrderCard(order)));
        }

        if (serviceRequests.length === 0) {
            noServiceRequestsMessage.style.display = 'block';
        } else {
            noServiceRequestsMessage.style.display = 'none';
            serviceRequests.forEach(request => serviceRequestsList.appendChild(createRequestCard(request)));
        }
        
        saveToLocalStorage(); // Hər yeniləmədən sonra yaddaşa yaz
    }

    // Sifariş statusunu dəyişən funksiya
    function changeOrderStatus(orderId, newStatus) {
        const orderIndex = orders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
            orders[orderIndex].status = newStatus;
            updateLists(); // Siyahıları yenilə
        }
    }

    // Xidmət sorğusunu həll edən funksiya
    function resolveServiceRequest(requestId) {
        serviceRequests = serviceRequests.filter(req => req.id !== requestId);
        updateLists(); // Siyahıları yenilə
    }

    // Event Listener-lar (Sifariş və Sorğu düymələrinə klik)
    newOrdersList.addEventListener('click', (e) => {
        const button = e.target;
        const orderCard = button.closest('.order-card');
        if (!orderCard) return;

        const orderId = parseInt(orderCard.dataset.orderId);
        const action = button.dataset.action;

        if (action === 'accept') {
            changeOrderStatus(orderId, 'preparing');
        } else if (action === 'cancel') {
            changeOrderStatus(orderId, 'cancelled');
        }
    });

    activeOrdersList.addEventListener('click', (e) => {
        const button = e.target;
        const orderCard = button.closest('.order-card');
        if (!orderCard) return;

        const orderId = parseInt(orderCard.dataset.orderId);
        const action = button.dataset.action;

        if (action === 'ready') {
            changeOrderStatus(orderId, 'ready');
        } else if (action === 'deliver') {
            changeOrderStatus(orderId, 'delivered');
        } else if (action === 'cancel') {
            changeOrderStatus(orderId, 'cancelled');
        }
    });

    serviceRequestsList.addEventListener('click', (e) => {
        const button = e.target;
        const requestCard = button.closest('.request-card');
        if (!requestCard) return;

        const requestId = parseInt(requestCard.dataset.requestId);
        const action = button.dataset.action;

        if (action === 'resolve') {
            resolveServiceRequest(requestId);
        }
    });

    // --- SİMULYASİYA HİSSƏSİ (Real-time Backend Olmadığı üçün) ---
    let nextOrderId = 1;
    let nextRequestId = 1;

    // Yeni sifariş əlavə etmə funksiyası (simulyasiya üçün)
    window.addNewSimulatedOrder = function(tableNum, items) {
        const newOrder = {
            id: nextOrderId++,
            tableNumber: tableNum,
            items: items,
            totalPrice: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            timestamp: Date.now(),
            status: 'new'
        };
        orders.push(newOrder);
        updateLists();
        console.log("Yeni sifariş əlavə edildi (simulyasiya):", newOrder);
    }

    // Yeni xidmət sorğusu əlavə etmə funksiyası (simulyasiya üçün)
    window.addNewSimulatedRequest = function(tableNum, type) {
        const newRequest = {
            id: nextRequestId++,
            tableNumber: tableNum,
            type: type, // 'callWaiter' or 'billRequest'
            timestamp: Date.now()
        };
        serviceRequests.push(newRequest);
        updateLists();
        console.log("Yeni xidmət sorğusu əlavə edildi (simulyasiya):", newRequest);
    }

    // Səhifə yüklənəndə əvvəlki məlumatları yüklə
    loadFromLocalStorage();
    updateLists();

    // Hər 5 saniyədən bir test sifarişləri və sorğuları əlavə et (yalnız test məqsədi ilə)
    // Bu hissəni real layihədə silməlisiniz.
    // let testOrderCount = 0;
    // setInterval(() => {
    //     if (testOrderCount < 3) { // 3 test sifarişindən sonra dayandır
    //         addNewSimulatedOrder(Math.floor(Math.random() * 10) + 1, [
    //             { name: "Pizza Margherita", quantity: 1, price: 12.50 },
    //             { name: "Coca-Cola", quantity: 2, price: 2.00 }
    //         ]);
    //         testOrderCount++;
    //     }
    //     if (Math.random() < 0.5) { // 50% ehtimalla xidmət sorğusu
    //         const requestType = Math.random() < 0.5 ? 'callWaiter' : 'billRequest';
    //         addNewSimulatedRequest(Math.floor(Math.random() * 10) + 1, requestType);
    //     }
    // }, 5000);

});