// AJAX - это технология, которая подразумевает общение с сервером и дальнейшее изменение страницы без ее перезагрузки

// 1. С помощью специального метода в js мы делаем запрос к серверу
// 2. Подписываемся на ответ с сервера (на сам запрос, мы его слушаем)
// 3. Когда ответ пришел, мы в js получаем данные от сервера и делаем изменения какие-то на странице

// Для создания запроса - XMLHttpRequest - она позволяет создать экземпляр запроса и потом с помощью его вызывать специальные методы для того, чтобы совершить запрос. Возвращает нам объект, который позволяет нам создавать, изменять, удалять запросы.

// теперь нам нужно перебрать этот массив пользователей, вывести его на страницу, предварительно мы повесим обработчик события на кнопку, при клике по которой мы будем вызывать наш get post.

const btn = document.querySelector('.btn-get-posts');
const btnAddPost = document.querySelector('.btn-add-posts');

// находим наш контейнер
const container = document.querySelector('.container');

function getPosts(cb) { // эта функция после ее вызова должна будет возвращать ответ от сервера
    const xhr = new XMLHttpRequest(); // создали экземпляр и получили методы объекта

    // сначала нужно открыть запрос
    xhr.open("GET", "https://jsonplaceholder.typicode.com/posts");

    // теперь нужно подписаться на получение данных от сервера load и error
    // load - это событие, когда наше общение с сервером произошло успешно
    xhr.addEventListener("load", () => {
        // console.log(xhr.responseText); // ответ от сервера будет храниться в этом свойстве (responseText) 

        const response = JSON.parse(xhr.responseText);
        // console.log(response);
        cb(response); // мы вызовем callback и передадим наш ответ от сервера внутри события load
    });

    // также можем обрабатывать ошибки
    xhr.addEventListener('error', () => {
        console.log('Error');
    });

    xhr.send(); // это метод принимает тело запроса в случае, если мы делаем передачу каки-то данных на сервер (хотим просто получить данные от сервера)

    // Запросы асинхнронные - это значит, что мы не значем, когда к нам придут данные от сервера (это зависит от множества факторов)
}

// Создаем POST запросы:
function createPost(body, cb) { // функция принимает тело запроса, которое мы хотим отпреаивть и callback, который должен выполнится в результате этого запроса при успешном ответе сервера
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://jsonplaceholder.typicode.com/posts");
    xhr.addEventListener("load", () => {
        const response = JSON.parse(xhr.responseText);
        cb(response);
    });

    xhr.setRequestHeader("Content-type", 'application/json; charset=UTF-8');

    xhr.addEventListener('error', () => {
        console.log('Error');
    });

    xhr.send(JSON.stringify(body));
}

// вынесем отдельно создание карточки в новую функцию
function cardTemplate(post) {
    // создаем карточку
    const card = document.createElement("div");
    card.classList.add('card'); // присваиваем div класс

    // создаем body
    const cardBody = document.createElement('div');
    cardBody.classList.add('cardBody');

    // создаем сначала title
    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = post.title;

    // создаем параграф
    const article = document.createElement('p');
    article.classList.add('card-text');
    article.textContent = post.body;

    // вкладываем title и параграф в нашу карточку
    cardBody.appendChild(title);
    cardBody.appendChild(article);

    // теперь саму карточку добавляем в cardBody
    card.appendChild(cardBody);
    return card;
}

function renderPosts(response) {
    // создаем фрагмент
    const fragment = document.createDocumentFragment(); // потом выбросим это все в разметку
    response.forEach(post => {
        const card = cardTemplate(post);
        fragment.appendChild(card); // таким образом, у нас на выходе есть готовый фрагмент после получения и перебора, который мы можем добавить теперь в наш контейнер
    });

    container.appendChild(fragment); // сформировали контейнер с фрагментом
}

btn.addEventListener('click', e => { // вешаем обработчик события на кнопку
    getPosts(renderPosts);
});


btnAddPost.addEventListener('click', e => { // создаем новый объект поста
    const newPost = {
        title: 'foo',
        body: 'bar',
        userId: 1,
    };

    createPost(newPost, response => {
        const card = cardTemplate(response);
        container.insertAdjacentElement('afterbegin', card);
    });
});


function myHttpRequest({ method, url } = {}, cb) {
    // try/catch нам нужен для обработки синхронных ошибок
    try { // ReferenceError: xhr is not defined at myHttpRequest(app.js: 126) at app.js: 155
        const xhr = new XMLHttpRequest(); // создали экземпляр и получили методы объекта

        // сначала нужно открыть запрос
        xhr.open(method, url);

        // теперь нужно подписаться на получение данных от сервера load и error
        // load - это событие, когда наше общение с сервером произошло успешно
        xhr.addEventListener("load", () => {
            // пищем условие на загрузку, где мы проверяем, что наш статус в объекте xhr (200, 201)

            // обработка асинхронных ошибок
            if (Math.floor(xhr.status / 100) !== 2) { // если результат этого деления не равен 2, то статус неуспешный и мы должны сказать о том, что у нас ошибка
                cb(`Error. Status code: ${xhr.status}`, xhr); // Error. Status code: 404
                return; // callback должен принимать объект-ошибку, а вторым параметром ответ от сервера
            }
            // иначе:
            const response = JSON.parse(xhr.responseText);
            // // console.log(response);
            cb(null, response); // мы вызовем callback и передадим наш ответ от сервера внутри события load
        });

        // также можем обрабатывать ошибки
        xhr.addEventListener('error', () => {
            console.log('Error');
        });

        xhr.send();
    } catch (error) {
        cb(error);
    }
}

myHttpRequest({
        method: 'GET',
        url: "https://jsonplaceholder.typicode.com/posts",
    },
    (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(res);
    },
);







// мы можем создать некий универсальный объект с набором методов для наших будущих запросов
function http() {
    // она будет возвращать объект, в котором будут два метода
    return {
        get(url, cb) {
            // try/catch нам нужен для обработки синхронных ошибок
            try { // ReferenceError: xhr is not defined at myHttpRequest(app.js: 126) at app.js: 155
                const xhr = new XMLHttpRequest(); // создали экземпляр и получили методы объекта

                // сначала нужно открыть запрос
                xhr.open('GET', url);

                // теперь нужно подписаться на получение данных от сервера load и error
                // load - это событие, когда наше общение с сервером произошло успешно
                xhr.addEventListener("load", () => {
                    // пищем условие на загрузку, где мы проверяем, что наш статус в объекте xhr (200, 201)

                    // обработка асинхронных ошибок
                    if (Math.floor(xhr.status / 100) !== 2) { // если результат этого деления не равен 2, то статус неуспешный и мы должны сказать о том, что у нас ошибка
                        cb(`Error. Status code: ${xhr.status}`, xhr); // Error. Status code: 404
                        return; // callback должен принимать объект-ошибку, а вторым параметром ответ от сервера
                    }
                    // иначе:
                    const response = JSON.parse(xhr.responseText);
                    // // console.log(response);
                    cb(null, response); // мы вызовем callback и передадим наш ответ от сервера внутри события load
                });

                // также можем обрабатывать ошибки
                xhr.addEventListener('error', () => {
                    console.log('Error');
                });

                xhr.send();
            } catch (error) {
                cb(error);
            }
        },
        post(url, body, headers, cb) { // заголовки будем передавать в качестве объекта
            // try/catch нам нужен для обработки синхронных ошибок
            try { // ReferenceError: xhr is not defined at myHttpRequest(app.js: 126) at app.js: 155
                const xhr = new XMLHttpRequest(); // создали экземпляр и получили методы объекта

                // сначала нужно открыть запрос
                xhr.open('POST', url);

                // теперь нужно подписаться на получение данных от сервера load и error
                // load - это событие, когда наше общение с сервером произошло успешно
                xhr.addEventListener("load", () => {
                    // пищем условие на загрузку, где мы проверяем, что наш статус в объекте xhr (200, 201)

                    // обработка асинхронных ошибок
                    if (Math.floor(xhr.status / 100) !== 2) { // если результат этого деления не равен 2, то статус неуспешный и мы должны сказать о том, что у нас ошибка
                        cb(`Error. Status code: ${xhr.status}`, xhr); // Error. Status code: 404
                        return; // callback должен принимать объект-ошибку, а вторым параметром ответ от сервера
                    }
                    // иначе:
                    const response = JSON.parse(xhr.responseText);
                    // // console.log(response);
                    cb(null, response); // мы вызовем callback и передадим наш ответ от сервера внутри события load
                });

                // также можем обрабатывать ошибки
                xhr.addEventListener('error', () => {
                    cb(`Error. Status code: ${xhr.status}`, xhr);
                });

                // пишем условие для headers
                if (headers) {
                    Object.entries(headers).forEach(([key, value]) => {
                        xhr.setRequestHeader(key, value); // так мы зададим заголовки при запросе и сервер нам ответит более развернуто 
                    });
                }

                xhr.send(JSON.stringify(body));
            } catch (error) {
                cb(error);
            }
        },
    };
}

const myHttp = http();

// !! теперь мы можем вызвать, например, метод POST
myHttp.post(
    "https://jsonplaceholder.typicode.com/posts", {
        title: 'foo',
        body: 'bar',
        userId: 1,
    }, {
        'Content-Type': 'application/json',
        'x-auth': 'asd9387ydh9iuashdis' // все заголовки, которые мы захотим передать, будут попадать в консоль
    },
    (err, res) => {
        console.log(err, res);
    },
);













/////////////////////////////////
// CORS
function getGmail(cb) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://gmail.com");
    xhr.addEventListener("load", () => {

        console.log(xhr.responseText);
    });

    xhr.addEventListener('error', () => {
        console.log('Error');
    });

    xhr.send();
}

// getGmail(); - мы получаем ошибку (index):1 Access to XMLHttpRequest at 'https://gmail.com/' from origin 'http://127.0.0.1:5500' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

// это означает, что наш gmail не дает нам доступа и ругается на корсы

// !! CORS (Cross-Origin Resource Sharing) - Совместное использование ресурсов между разными источниками - позволяет описать политику или правила как один сайт будет предоставлять доступ к данным другого сайта. Если не будет такой политики, то тогда один сайт может пойти на другой сайт и забрать от туда какие-то данные и т.д. CORS говорит нам о том, что удаленный сервер должен предварительно нам разршить операции те, которые к нему приходят.

// !! Есть специальные access-заголовки, откуда и определяется откуда могут приходить запросы, с какими методами. (Приходят запросы OPTION (204), браузер сначала перед тем, как делает запрос, делает запрос и спрашивает у сервера, какие методы он разрешает, с каких адресов запросы и какие заголовки. После этого уже делается соответствующий запрос POST (201))