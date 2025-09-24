const dialog = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
let lastFocusedElement = null;


function openModal() {
    // Сохраняем последний активный элемент
    lastFocusedElement = document.activeElement;
    
    // Показываем модальное окно
    dialog.showModal();
    
    // Фокус на первое поле формы (для доступности)
    const firstInput = dialog.querySelector('input, select, textarea');
    if (firstInput) {
        firstInput.focus();
    }
    
    // Ловушка фокуса внутри модалки
    trapFocus();
}

/**
 * Закрытие модального окна
 */
function closeModal() {
    dialog.close();
    
    // Возвращаем фокус на элемент, который открыл модалку
    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

/**
 * Ловушка фокуса для доступности
 */
function trapFocus() {
    const focusableElements = dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    dialog.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
}

/**
 * Валидация формы с кастомными сообщениями
 */
function validateForm() {
    let isValid = true;
    
    // Сброс предыдущих ошибок
    const formElements = form.elements;
    for (let element of formElements) {
        if (element.willValidate) {
            element.setCustomValidity('');
            element.removeAttribute('aria-invalid');
        }
    }
    
    // Проверка встроенных ограничений
    if (!form.checkValidity()) {
        isValid = false;
        
        // Кастомные сообщения для каждого поля
        const nameField = form.elements.name;
        if (nameField && nameField.validity.valueMissing) {
            nameField.setCustomValidity('Пожалуйста, введите ваше имя');
        }
        
        const emailField = form.elements.email;
        if (emailField) {
            if (emailField.validity.valueMissing) {
                emailField.setCustomValidity('Пожалуйста, введите email адрес');
            } else if (emailField.validity.typeMismatch) {
                emailField.setCustomValidity('Введите корректный email адрес, например: name@example.com');
            }
        }
        
        const phoneField = form.elements.phone;
        if (phoneField) {
            if (phoneField.validity.valueMissing) {
                phoneField.setCustomValidity('Пожалуйста, введите номер телефона');
            } else if (phoneField.validity.patternMismatch) {
                phoneField.setCustomValidity('Формат: +7 (900) 000-00-00');
            }
        }
        
        const messageField = form.elements.message;
        if (messageField && messageField.validity.valueMissing) {
            messageField.setCustomValidity('Пожалуйста, введите ваше сообщение');
        }
        
        // Показываем ошибки и подсвечиваем поля
        form.reportValidity();
        
        // ARIA-атрибуты для доступности
        for (let element of formElements) {
            if (element.willValidate && !element.checkValidity()) {
                element.setAttribute('aria-invalid', 'true');
            }
        }
    }
    
    return isValid;
}

/**
 * Обработка успешной отправки формы
 */
function handleFormSuccess() {
    // Сообщение об успехе (вместо реальной отправки)
    alert('✅ Форма успешно отправлена! Спасибо за обратную связь!\n\nВ реальном приложении здесь будет отправка на сервер.');
    
    // Закрываем модалку и сбрасываем форму
    closeModal();
    form.reset();
    
    // Сбрасываем ARIA-атрибуты
    const formElements = form.elements;
    for (let element of formElements) {
        if (element.hasAttribute('aria-invalid')) {
            element.removeAttribute('aria-invalid');
        }
    }
}

// ОБРАБОТЧИКИ СОБЫТИЙ

// Открытие модалки
openBtn.addEventListener('click', openModal);

// Закрытие модалки по кнопке
closeBtn.addEventListener('click', closeModal);

// Закрытие модалки по клику на подложку
dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
        closeModal();
    }
});

// Обработка отправки формы
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateForm()) {
        handleFormSuccess();
    }
});

// Валидация в реальном времени для улучшения UX
form.addEventListener('input', (e) => {
    const field = e.target;
    if (field.willValidate) {
        if (field.checkValidity()) {
            field.removeAttribute('aria-invalid');
        } else {
            field.setAttribute('aria-invalid', 'true');
        }
    }
});

// Закрытие по Escape
dialog.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        e.preventDefault(); // Предотвращаем стандартное поведение если нужно
        closeModal();
    }
});

console.log('✅ Практика 3: Модальная форма загружена и готова к работе!');