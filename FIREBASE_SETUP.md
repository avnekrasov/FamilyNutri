# Настройка облачной синхронизации (Firebase)

## Зачем это нужно
Облачная синхронизация позволяет:
- Сохранять данные в облаке
- Восстанавливать данные при переустановке
- Синхронизировать между устройствами

## Пошаговая инструкция

### Шаг 1: Создать проект Firebase
1. Перейди на https://console.firebase.google.com/
2. Нажми **"Добавить проект"** (Add project)
3. Введи название проекта: `familynutri-app` (или любое другое)
4. Google Analytics можно отключить (необязательно)
5. Нажми **"Создать проект"**

### Шаг 2: Добавить веб-приложение
1. На главной странице проекта нажми иконку **`</>`** (Web)
2. Введи имя приложения: `FamilyNutri`
3. **НЕ** ставь галочку "Firebase Hosting"
4. Нажми **"Зарегистрировать приложение"**
5. Скопируй конфигурацию — она будет выглядеть так:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### Шаг 3: Включить аутентификацию
1. В боковом меню Firebase выбери **Authentication**
2. Нажми **"Начать"** (Get started)
3. Перейди на вкладку **"Способ входа"** (Sign-in method)
4. Включи **"Ссылка электронной почты/Email link"** (Email/Password):
   - Включи переключатель
   - Также включи **"Вход по ссылке (без пароля)"**
5. Нажми **"Сохранить"**

### Шаг 4: Настроить Firestore
1. В боковом меню выбери **Firestore Database**
2. Нажми **"Создать базу данных"**
3. Выбери режим **"Рабочий"** (Production mode)
4. Выбери ближайший регион (europe-west1 для Европы)
5. Нажми **"Создать"**
6. Перейди на вкладку **"Правила"** (Rules) и замени содержимое на:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
7. Нажми **"Опубликовать"**

### Шаг 5: Добавить домен в авторизованные
1. Перейди в **Authentication** → **Settings** → **Authorized domains**
2. Добавь домен: `avnekrasov.github.io` (или свой домен)

### Шаг 6: Вставить конфигурацию в приложение
1. Открой файл `index.html`
2. Найди блок `FIREBASE_CONFIG` (поиск по "placeholder")
3. Замени значения на свои из Шага 2:
```javascript
const FIREBASE_CONFIG = {
  apiKey: "AIzaSy...",          // ← твой apiKey
  authDomain: "xxx.firebaseapp.com", // ← твой authDomain
  projectId: "xxx",             // ← твой projectId
  storageBucket: "xxx.appspot.com", // ← твой storageBucket
  messagingSenderId: "123...",  // ← твой messagingSenderId
  appId: "1:123...:web:abc..."  // ← твой appId
};
```
4. Сохрани файл и задеплой (git push)

### Шаг 7: Проверить
1. Открой приложение
2. Перейди в **Настройки** → раздел **Аккаунт и бэкап**
3. Введи email и нажми **"Войти по email-ссылке"**
4. Проверь почту — придёт ссылка для входа
5. После входа: кнопки **"Сохранить в облако"** и **"Загрузить из облака"** станут активны

## Бесплатный план Firebase (Spark)
- Аутентификация: бесплатно (до 10,000 пользователей)
- Firestore: 1 ГБ хранилища, 50,000 чтений/день
- Этого более чем достаточно для семейного использования

## Если что-то не работает
- **Ошибка auth/api-key-not-valid**: проверь правильность apiKey
- **Ошибка auth/unauthorized-domain**: добавь домен в Authorized domains (Шаг 5)
- **Ошибка firestore/permission-denied**: проверь правила безопасности (Шаг 4.6)
