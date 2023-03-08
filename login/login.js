//извлекаем данные из формы - username, password
//событие - нажата кнопка submit
const formElem = document.querySelector('form[name="login"]');
const domain = 'http://127.0.0.1:8000/api/v1/letterlist/';

formElem.addEventListener("submit", (e) => {
    // on form submission, prevent default
    e.preventDefault();
    // construct a FormData object, which fires the formdata event
    new FormData(formElem);
});

formElem.addEventListener("formdata", (e) => {
    console.log("formdata fired");

    // Get the form data from the event object
    const data = e.formData;
    let user = data.get('username');
    console.log(user);
    let password = data.get('password');
    console.log(password);

    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open("GET", domain, true, user, password);
    xhr.responseType = 'json';

    xhr.onload = function () {
        if (xhr.status != 200) {
            console.log('Статус ответа: ', xhr.status);
        } else {
            let responseObj = xhr.response;
            const result = JSON.stringify(responseObj);

            console.log(responseObj);
            console.log(result);

        }
    };

    xhr.onerror = function () {
        console.log('Ошибка! Статус ответа: ', xhr.status);
    };

    xhr.send(data);

    // проверка наличия токена у ользователя
    let tokenSaved = localStorage.getItem("token");
    alert(`localStorage проверка состояния пользователя token = ${tokenSaved}`);
    if (tokenSaved != null) {
        //есть сохраненный токен
        alert(`Пользователь ${user} зарегистрирован и аутентифицирован токеном`);
        console.log(`token = ${tokenSaved}`)
    } else { 

        //есть пользователь, но у него отсутствует
        alert(`${user} Завершите регистрацию - получите токен`);
        
        //получение токена из базы данных - POST запрос
        domainToGetToken = "http://127.0.0.1:8000/auth/token/login/";
        
        let xhr1 = new XMLHttpRequest();
        xhr1.withCredentials = true;
        xhr1.open("POST", domainToGetToken, true);
        xhr1.responseType = 'json';
        // для получения токен требуется войти с логином и паролем
        // перевод в формат Base64 "user:password" для заголовка Авторизация
        credentialsToBase64 = btoa(`${user}:${password}`)
        console.log(`зашифрованная в Base64 пара user:password ${credentialsToBase64}`);
        xhr1.setRequestHeader('Authorization', `Basic ${credentialsToBase64}`);
        alert('точка 1')

        xhr1.onload = function () {
            if (xhr1.status != 200) {
                console.log('Статус ответа: ', xhr1.status);
            } else {
                let responseObj1 = xhr1.response;
                const result1 = JSON.stringify(responseObj1);
    
                console.log(responseObj1);
                console.log(`token = ${responseObj1.auth_token}`)
                console.log(result1);
                
                //сохраняем токен
                localStorage.setItem("token", responseObj1.auth_token);
                console.log("токен успешно сохранен в localStorage");
    
            }
        }

        xhr1.onerror = function () {
            console.log('Ошибка! Статус ответа: ', xhr1.status);
        };
    
        xhr1.send(data);
    }

});
        
