const dotenv = require('dotenv');
dotenv.config();

const TelegramApi = require('node-telegram-bot-api');
const token = process.env.API_TOKEN;

if (!token) {
    console.error('Ошибка! API_TOKEN не найден. Убедись, что .env файл существует и правильно подключён.');
    process.exit(1);
}

const webAppUrl = "https://verdant-jalebi-a3725c.netlify.app/";

const bot = new TelegramApi(token, { polling: true });

const userSessions = {};

const start = () => {
    bot.setMyCommands([
        { command: "/start", description: "Запуск бота" },
        { command: "/object", description: "Рассчитать замер" },
        { command: "/manager", description: "Связаться с менеджером" },
        { command: "/adress", description: "Адрес офисов" },
        { command: "/catalog", description: "Получить каталог" },
        { command: "/menu", description: "Меню" },

    ])
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const userName = msg.chat.username || 'Пользователь';

        if (text === '/start') {
            await bot.sendMessage(chatId, `👋 Привет, ${userName}! Добро пожаловать в Еврострой. Выбери интересующую тему:`, {
                reply_markup: {
                    keyboard: [
                        ['Записаться на бесплатный замер'],
                        ['Замер форма'],
                        ['Получить промокод', 'Купить плитку'],
                        ['Получить каталог', 'Адреса офисов'],
                        ['Закрыть меню']
                    ],
                    resize_keyboard: true
                }
            });
        }

        if (text === '/menu') {
            await bot.sendMessage(chatId, `📋 Меню бота`, {
                reply_markup: {
                    keyboard: [
                        ['Записаться на бесплатный замер'],
                        ['Замер форма'],
                        ['Получить промокод', 'Купить плитку'],
                        ['Контакт', 'Адреса офисов'],
                        ['Закрыть меню']
                    ],
                    resize_keyboard: true
                }
            });
        }

        if (text === 'Закрыть меню') {
            await bot.sendMessage(chatId, `Меню закрыто. Чтобы открыть снова, введите /menu.`, {
                reply_markup: {
                    remove_keyboard: true,

                }
            });
        }

        if (text === 'Получить каталог') {
            await bot.sendMessage(chatId, "Введите номер телефона для того, чтобы наши сотрудники отправили актуальный каталог на WhatsApp", {
                reply_markup: {
                    remove_keyboard: true,

                }
            });
        }


        if (text === 'Замер форма') {
            await bot.sendMessage(chatId, "Заполни форму", {
                reply_markup: {
                    keyboard: [
                        [{ text: 'Заполнить форму', web_app: { url: webAppUrl } }]

                    ]

                }
            });
        }


        if (text === 'Адреса офисов') {
            await bot.sendMessage(chatId, "Выберите интересующий Вас офис", {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Ростов-на-Дону', callback_data: 'address_Rostov' }],
                        [{ text: 'Краснодар', callback_data: 'address_Krasnodar' }],
                        [{ text: 'Сочи', callback_data: 'address_Sochi' }],
                        [{ text: 'Москва', callback_data: 'address_Moscow' }],
                    ]

                }
            });
        }

        if (text === 'Записаться на бесплатный замер') {
            userSessions[chatId] = { step: 'region' };

            await bot.sendMessage(chatId, 'Укажите регион:', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Ростовская область', callback_data: 'Ростовская область' }],
                        [{ text: 'Краснодарский край', callback_data: 'Краснодарский край' }],
                        [{ text: 'Сочи', callback_data: 'Сочи' }],
                        [{ text: 'Другой', callback_data: 'Другой' }],
                        [{ text: 'Закрыть Меню', callback_data: 'closeMenu' }]
                    ]
                }
            });
        }

        if (userSessions[chatId]?.step === 'area') {
            userSessions[chatId].area = text;
            userSessions[chatId].step = 'phone';
            await bot.sendMessage(chatId, 'Пожалуйста, введите номер телефона:');
            return;
        }

        if (userSessions[chatId]?.step === 'phone') {
            userSessions[chatId].phone = text;

            const { region, area, phone } = userSessions[chatId];
            await bot.sendMessage(chatId, `✅ Готово! Скоро наш менеджер свяжется с Вами.
    📍 Регион: ${region}
    📏 Площадь: ${area} м2
    📞 Телефон: ${phone}`);

            // Здесь можно отправить данные в amoCRM
            console.log(userSessions[chatId])
            delete userSessions[chatId];
            return;
        }
    });

    // Обработчик выбора региона
    bot.on('callback_query', async query => {
        const chatId = query.message.chat.id;
        const region = query.data;

        if (region === 'closeMenu') {
            await bot.sendMessage(chatId, 'Меню закрыто.', {
                reply_markup: { remove_keyboard: true }
            });
            return;
        }

        if (userSessions[chatId]) {
            userSessions[chatId].region = region;
            userSessions[chatId].step = 'area';

            await bot.sendMessage(chatId, 'Укажите площадь в м²:');
        }
    })

    // Обработчик выбора города для адресов
    bot.on('callback_query', async query => {
        const chatId = query.message.chat.id;
        const data = query.data;

        const addresses = {
            address_Rostov: {
                text: '📍 Ростов-на-Дону: Троллейбусная улица, 16В',
                location: { latitude: 47.266857, longitude: 39.765327 }
            },
            address_Krasnodar: {
                text: '📍 Краснодар: Восточно-Кругликовская ул., 42/3к1,',
                location: { latitude: 45.052609, longitude: 39.028828 }
            },
            address_Sochi: {
                text: '📍 Сочи: Армянский пер. 1',
                location: { latitude: 43.641917, longitude: 39.749220 }
            },
            address_Moscow: {
                text: '📍 Москва: ул. Большая Якиманка, 38',
                location: { latitude: 55.734532, longitude: 37.611140 }
            }
        };

        if (addresses[data]) {
            const { text, location } = addresses[data];
            await bot.sendMessage(chatId, text);
            await bot.sendLocation(chatId, location.latitude, location.longitude);
        }
    });












}
start()

