const fs = require('fs');
const path = require('path');
const acorn = require('acorn');
const sites = {
  '10gag': {brand:'Sidewalk',old:['Meme Flow','MemeFlow'],lang:'en',title:'Sidewalk | A little break from the ordinary',description:'Small discoveries, reaction clips and pictures worth passing around. Browse the latest finds on Sidewalk.',ink:'#172d43',panel:'#233f59',paper:'#edf4f8',accent:'#24678c',bright:'#4197bd',wash:'#d9edf6',second:'#d06a48',font:'"Trebuchet MS", Arial, sans-serif'},
  'convertit': {brand:'Cutlane',old:['VidCraft'],lang:'en',title:'Cutlane | Make room for your next story',description:'A workspace for short videos, captions and carefully timed edits. Shape a clip for the screen you have in mind.',ink:'#102832',panel:'#1a3945',paper:'#edf7f5',accent:'#68d0c2',bright:'#a3e2c5',wash:'#d9eee8',second:'#e6b284',font:'"Trebuchet MS", "Segoe UI", sans-serif'},
  'converter': {brand:'Formatwell',old:['ConvertMaster'],lang:'en',title:'Formatwell | Files in the format you need',description:'Choose a file, set the output format and keep your work moving. Explore document, image, video and audio options.',ink:'#282747',panel:'#3e3b60',paper:'#f1f2f9',accent:'#574d9b',bright:'#7568be',wash:'#e7e4f5',second:'#397d87',font:'"Segoe UI", Arial, sans-serif'},
  'downloader': {brand:'Parcelink',old:['SecureFlow','SecureTransfer'],lang:'en',title:'Parcelink | A place for your next transfer',description:'Organize download links, choose a media format and review available transfer locations in one workspace.',ink:'#142d35',panel:'#23434c',paper:'#eef5f2',accent:'#75c5ae',bright:'#a1ddbc',wash:'#d7ece4',second:'#e0b37d',font:'"Segoe UI", Verdana, sans-serif'},
  'filecloud': {brand:'Foliohaven',old:['CloudStore'],lang:'en',title:'Foliohaven | A home for the files you keep',description:'Keep folders, shared work and everyday documents together. Explore a calmer way to organize your file collection.',ink:'#163e3c',panel:'#285652',paper:'#f0f7f3',accent:'#247368',bright:'#3e9582',wash:'#dceee5',second:'#a77750',font:'"Segoe UI", Arial, sans-serif'},
  'games-site': {brand:'Cartridge Club',old:['RetroStream'],lang:'ru',title:'Cartridge Club | Ещё один уровень',description:'Коллекция браузерной классики: знакомые жанры, любимые платформы и клуб для тех, кто помнит первый картридж.',ink:'#18213d',panel:'#283553',paper:'#eef1f9',accent:'#8ca9f4',bright:'#b6c9fb',wash:'#e0e7fa',second:'#e8bb74',font:'"Lucida Console", Consolas, monospace'},
  'modmanager': {brand:'Patchbay',old:['Cloud Mods','CloudMod'],lang:'ru',title:'Patchbay | Ваша коллекция игровых сборок',description:'Моды, настройки и подборки для любимых игр. Соберите свою библиотеку и держите её под рукой.',ink:'#222b3e',panel:'#323e56',paper:'#eff3f9',accent:'#a5b8e8',bright:'#c6d3f1',wash:'#e0e7f5',second:'#e1a58c',font:'"Segoe UI", Arial, sans-serif'},
  'speedtest': {brand:'LineMeter',old:['SpeedCheck','SpeedRyzen LLC'],lang:'ru',title:'LineMeter | Проверка параметров соединения',description:'Проверьте доступность соединения, задержку и ход тестирования. Дополнительные файлы для ручной проверки канала.',ink:'#193a42',panel:'#2c5159',paper:'#edf5f5',accent:'#216e78',bright:'#39909a',wash:'#dbecef',second:'#bf704b',font:'"Segoe UI", Arial, sans-serif'},
  'YouTube': {brand:'Кадротека',old:['Видеоландия'],lang:'ru',title:'Кадротека | Истории, которые хочется посмотреть',description:'Небольшие фильмы, творческие заметки и новые открытия. Найдите следующую историю в Кадротеке.',ink:'#18263a',panel:'#263b52',paper:'#edf2f8',accent:'#91bce8',bright:'#bdd8f4',wash:'#deeaf6',second:'#e4bd83',font:'"Trebuchet MS", "Segoe UI", sans-serif'},
  '503-1': {brand:'Harbor Queue',old:[],lang:'ru',title:'Harbor Queue | Ресурс временно занят',description:'Запрос ожидает свободного обработчика. Здесь отображаются параметры обращения и время следующей попытки.',ink:'#213950',panel:'#324f68',paper:'#edf3f8',accent:'#276581',bright:'#4385a2',wash:'#dbe9f2',second:'#a96b42',font:'"Segoe UI", Arial, sans-serif'},
  '503-2': {brand:'Juniper Status',old:[],lang:'ru',title:'Juniper Status | Пауза в обработке запроса',description:'Сервису нужно немного времени. Сведения о запросе и отсчёт до следующей автоматической проверки.',ink:'#203f3c',panel:'#345952',paper:'#eff6f2',accent:'#286e5e',bright:'#478f7b',wash:'#ddece3',second:'#ab714b',font:'"Trebuchet MS", "Segoe UI", sans-serif'},
};

const copy = {
 '10gag': {
  'Your daily dose of laughter':'Good finds for your spare five minutes',
  'Loading more laughs...':'Looking around for the next good find…',
  'Trending':'Popular today','No content found':'Nothing in this collection yet',
  'Log in to MemeFlow':'Step into the Sidewalk conversation',
  'To view all comments and join the conversation':'Join in to read the whole conversation',
  'Invalid credentials. Please try again.':'Those details did not match an account. Check them and retry.',
  'Back to comments':'Return to the discussion','Verification Code':'Access code',
  'When Monday hits you like...':'The week started without asking',
  'Epic fail compilation 2025':'A collection of beautifully bad timing',
  'Cats vs Cucumbers - Ultimate Collection':'Cats investigating suspicious vegetables',
  'Try not to laugh challenge':'Keeping a straight face is optional',
  'Best programming memes compilation':'Notes from the other side of the keyboard',
 },
 'convertit': {
  'Create stunning videos for social media':'A small clip. A story of your own.',
  'Transform your content with our powerful online editor. Add effects, subtitles, music, and more to create viral-worthy videos for TikTok, Instagram, YouTube, and other platforms. Always free, with support for up to 8K resolution!':'Bring a video into your workspace, find its rhythm and finish with a caption, a soundtrack or a different crop. Keep the useful tools close and the story in focus.',
  'Start Creating':'Open the workspace','Create content for:':'Find your frame:',
  'Powerful Editing Tools':'The details that make the cut',
  'Everything you need to create professional-quality videos that stand out on any social media platform.':'Trim a moment, give it a voice and prepare a version for the place where you want to share it.',
  'Start Your Creation Journey':'Start with a video link',
  "Paste a link to your video from any popular platform, and we'll help you transform it into something amazing with our powerful editor.":'Add the address of a clip to choose the starting point for your next edit.',
  'Paste your video link here':'Add the address of your clip',
  'Supports YouTube, TikTok, Instagram, Facebook, Twitter, and more':'Bring a link from the video platform you use',
  'The ultimate video editing platform for creators who want to stand out on social media.':'A little space to assemble your next story, one well-timed cut at a time.',
  'Stunning Effects':'Finishing touches','Image Overlays':'Layers and details','Auto Subtitles':'A place for captions','Music Library':'Set the soundtrack','HD Export':'Prepare the final cut','Video Mashups':'Bring clips together','Fast Processing':'Keep the edit moving',
  'Create Without Limits':'Follow the shape of your idea',
  'Our intuitive editor makes it easy to create professional videos even if you have no experience.':'Keep the tools within reach while you find the right order for your scenes.',
  'Format Versatility':'One story, different screens',
  'Создавайте потрясающие видео для соцсетей':'Небольшой ролик. Ваша собственная история.',
  'Преобразите свой контент с помощью нашего мощного онлайн-редактора. Добавляйте эффекты, субтитры, музыку и многое другое для создания вирусных видео для TikTok, Instagram, YouTube и других платформ. Всегда бесплатно, с поддержкой разрешения до 8K!':'Соберите удачные моменты, найдите нужный ритм и добавьте последние детали: подпись, музыку или новый кадр. Рабочее пространство, в котором история остаётся на первом плане.',
  'Начать создание':'Открыть рабочую область','Создавайте контент для:':'Выберите свой формат:',
  'Мощные инструменты редактирования':'Всё, из чего складывается ролик',
  'Всё необходимое для создания профессиональных видео, которые выделяются в социальных сетях.':'Подрежьте сцену, добавьте звук и подготовьте вариант для площадки, на которой хотите его показать.',
  'Потрясающие эффекты':'Последние штрихи','Наложение изображений':'Слои и детали','Автоматические субтитры':'Место для подписей','Библиотека музыки':'Настроение в звуке','Мультиформат':'Для разных экранов','HD экспорт':'Финальный вариант','Видео-мэшапы':'Несколько сцен вместе','Быстрая обработка':'В ритме вашей работы','Творите без ограничений':'Придайте идее форму',
  'Наш интуитивный редактор позволяет легко создавать профессиональные видео даже без опыта.':'Держите нужные инструменты под рукой, пока выбираете лучший порядок сцен.',
  'Гибкость форматов':'Одна история — разные экраны',
  'Erstellen Sie beeindruckende Videos für soziale Medien':'Ein kurzer Clip. Ihre eigene Geschichte.',
  'Transformieren Sie Ihren Content mit unserem leistungsstarken Online-Editor. Fügen Sie Effekte, Untertitel, Musik und mehr hinzu, um virale Videos für TikTok, Instagram, YouTube und andere Plattformen zu erstellen. Immer kostenlos, mit Unterstützung für bis zu 8K Auflösung!':'Geben Sie Ihren Szenen einen Rhythmus. Fügen Sie Text, Ton und einen passenden Bildausschnitt hinzu und behalten Sie Ihre Geschichte im Blick.',
  'Leistungsstarke Bearbeitungswerkzeuge':'Die Details für Ihren nächsten Schnitt',
  'Alles, was Sie brauchen, um professionelle Videos zu erstellen, die sich in sozialen Medien abheben.':'Schneiden Sie einen Moment, ergänzen Sie den Ton und wählen Sie das passende Format.',
  'सोशल मीडिया के लिए आकर्षक वीडियो बनाएं':'एक छोटा वीडियो। आपकी अपनी कहानी।',
  'हमारे शक्तिशाली ऑनलाइन एडिटर के साथ अपनी सामग्री को बदलें। TikTok, Instagram, YouTube और अन्य प्लेटफॉर्म के लिए वायरल वीडियो बनाने के लिए प्रभाव, उपशीर्षक, संगीत और बहुत कुछ जोड़ें। हमेशा मुफ्त, 8K रिज़ॉल्यूशन के साथ!':'अपने वीडियो के अच्छे पलों को चुनें, उनका क्रम तय करें और संगीत या कैप्शन जोड़कर अपनी कहानी को आकार दें।',
 },
 'converter': {
  'Convert Any File Format with Ease':'The right format for the next step',
  'Fast, secure, and high-quality file conversion for all your needs. Support for videos, images, documents, and more - all in one place.':'A document for a colleague, an image for a page or a clip for a different screen. Start with your file and choose where it goes next.',
  'Convert Files Now':'Choose a file to begin','View Supported Formats':'Explore file types',
  'Convert Your File':'Set up your conversion','Drag & drop your file here':'Drop a file into this workspace','or click to browse':'or choose one from your device','Click to change file':'Choose a different file',
  'Input Format':'Starting format','Output Format':'Destination format','Convert Now':'Prepare this file',
  'Any File Format':'A range of file types','High Quality':'Keep the details','100% Secure':'A considered workflow',
  'Convert between hundreds of different file formats with perfect quality.':'Move between familiar document, image, sound and video formats.',
  'Industry-leading conversion algorithms to maintain quality and accuracy.':'Choose the output that fits your next task and review the format before continuing.',
  'Why Choose ConvertMaster?':'Make formats part of the workflow',
  'We offer the most advanced file conversion platform with features that set us apart from the competition.':'Keep the routine steps in one place, from choosing a source file to setting its destination.',
  'Lightning Fast':'Less time between tasks','Privacy First':'A focused workspace','Mobile Friendly':'Room for smaller screens','Batch Processing':'Work through a collection','Cloud Processing':'A workspace beyond the desktop','Global Access':'Pick up where you left off',
  'The ultimate tool for converting your files to any format you need. Fast, secure, and easy to use.':'Everyday files, ready for their next destination. Documents, images and media in one workspace.',
  'Supported File Formats':'Find a destination for your file',
  'Convert between hundreds of file formats with just a few clicks. Here are some of the most popular conversion options.':'Browse the format families below before choosing how to prepare your next file.',
  'Simple, Transparent Pricing':'Choose how you work',
  'Choose the plan that works for your needs. All plans include our core features.':'Compare the existing plans and choose the allowance that matches your routine.',
  'What Our Users Say':'From other people’s workflows',
  'Thousands of professionals and businesses trust ConvertMaster for their file conversion needs.':'A few notes about making file preparation part of the working day.',
  'Join thousands of satisfied users today!':'Find a place for your next file.',
  'Powerful Features for Your Needs':'A workspace around your files',
  'Discover all the powerful features that make our platform the perfect choice for your document processing needs.':'Explore the tools for preparing the documents and media that move through your day.',
 },
 'downloader': {
  'Advanced Download Management System with intelligent content detection, military-grade encryption, and distributed European network infrastructure.':'A workspace for incoming links, media choices and the next file in your queue. Choose a source and review the available transfer options.',
  'Beta Access Only - Invitation Required':'The workspace is open by invitation',
  'Enter Download URL':'Add a source address','Select File Type':'What are you bringing in?',
  'Lightning Fast':'A shorter path to your files','Secure Downloads':'A place for your links','Global Network':'Locations at a glance','Network Status':'Transfer locations',
  'Advanced P2P technology with distributed nodes across Europe. Experience unlimited speeds with our optimized network infrastructure.':'Choose a source and a file type before continuing to the transfer workspace.',
  'Enterprise-grade encryption and secure peer verification. Your downloads are protected with military-grade security protocols.':'Keep the source address and the selected output together as you prepare a transfer.',
  'Dynamic server pool that updates every 2 hours. Smart routing ensures optimal speeds from the nearest locations.':'Review the location list and the status shown for each available endpoint.',
  'Authentication Required':'Your invitation opens the next step','You need to be authenticated to access our download system':'Sign in with your invitation to continue from this workspace.',
  'European Server Network Status':'Location overview',
  'Our AI will automatically detect the content type and optimize the download settings. This is the recommended option for most users.':'Let the workspace choose a starting format, or select a media type to review its available options.',
  'Продвинутая система управления загрузками с интеллектуальным определением контента, военным шифрованием и распределенной европейской сетевой инфраструктурой.':'Рабочее место для ссылок, форматов и следующих файлов в очереди. Добавьте источник и выберите подходящий вариант передачи.',
  'Только бета-доступ - Требуется приглашение':'Рабочая область доступна по приглашению','Выберите тип файла':'Что будем загружать?','Введите URL для загрузки':'Добавьте адрес источника','Молниеносная скорость':'Меньше шагов до файла','Безопасные загрузки':'Ссылки в одном месте','Глобальная сеть':'Доступные направления','Статус сети':'Обзор подключений',
  'Передовая P2P технология с распределенными узлами по всей Европе. Испытайте неограниченные скорости с нашей оптимизированной сетевой инфраструктурой.':'Выберите источник и тип файла, затем переходите к подготовке передачи.',
  'Корпоративное шифрование и безопасная верификация пиров. Ваши загрузки защищены протоколами военного уровня безопасности.':'Адрес источника и выбранный формат остаются рядом, пока вы готовите следующую загрузку.',
  'Динамический пул серверов, обновляющийся каждые 2 часа. Умная маршрутизация обеспечивает оптимальную скорость с ближайших локаций.':'Откройте список направлений, чтобы посмотреть показанное состояние каждого подключения.',
  'Требуется аутентификация':'Следующий шаг — вход по приглашению','Для доступа к системе загрузки необходима аутентификация':'Чтобы продолжить работу, войдите с данными своего приглашения.',
  'Fortschrittliches Download-Management-System mit intelligenter Inhaltserkennung, militärischer Verschlüsselung und verteilter europäischer Netzwerkinfrastruktur.':'Ein Arbeitsplatz für Links, Medienformate und die nächste Datei in Ihrer Warteschlange. Wählen Sie eine Quelle und prüfen Sie die Übertragungsoptionen.',
  'Nur Beta-Zugang - Einladung erforderlich':'Zugang zum Arbeitsplatz mit Einladung',
 },
 'filecloud': {
  'Next Generation Cloud Storage':'A little order for everything you keep',
  'Secure, Fast, and Reliable':'Your folders. Your projects. A place for both.',
  'Powerful File Management':'Bring your collection into focus','Intuitive Interface & Desktop App':'From a single document to the whole project',
  'Intuitive Interface':'A familiar workspace','Modern and easy-to-use dashboard for managing your files':'Find a clear place for the files you return to every day.',
  'Quick Sharing':'Pass it along','Share files and folders with just a few clicks':'Keep a shared folder close to the work it belongs to.',
  'Smart Organization':'Give things a home','Automatic file categorization and powerful search':'Build a folder structure that makes sense to you.',
  'Desktop App':'A place on your desktop','Native application for Windows, macOS, and Linux':'Explore the desktop options for your usual operating system.',
  'Server Status':'Around the network','Why Choose Us':'A closer look at the workspace','Platform Statistics':'The collection in numbers','Storage Distribution':'How the space is arranged',
  'Next generation cloud storage for everyone.':'A home for the documents, folders and ideas that travel with your work.',
  "Best cloud storage I've ever used. Lightning fast!":'The project folders finally have a place of their own.',
  'The security features are outstanding.':'The layout makes it easy to find the folder I need.',
  'Incredible speeds and reliable service.':'A useful way to keep everyday work together.',
  'Stockage Cloud Nouvelle Génération':'Une place pour tout ce que vous gardez',
  'Sécurisé, Rapide et Fiable':'Vos dossiers, vos projets, un espace commun.',
  'Gestion de Fichiers Puissante':'Retrouvez le fil de vos dossiers',
  'Interface Intuitive & Application Bureau':'Du premier document au projet complet',
  'État des Serveurs':'Autour du réseau','Pourquoi Nous Choisir':'Regard sur votre espace','Statistiques de la Plateforme':'La collection en chiffres',
 },
 'games-site': {
  'Играй в классику.':'Знакомый картридж.','Прямо в браузере.':'Новый вечер за игрой.',
  'Тысячи культовых игр. Никаких установок.':'Аркады, платформеры и приключения прошлых лет.','Только по приглашениям.':'Свой круг любителей классики.',
  'Без скачиваний':'В окне браузера','Мгновенный запуск':'От выбора до старта','Закрытое сообщество':'Клуб по приглашениям',
  'Коллекция Игр':'Полка с картриджами','Библиотека классических игр для твоих ностальгических приключений.':'Выбирай платформу и находи игру под настроение сегодняшнего вечера.',
  'Поиск игры...':'Название с твоей полки…','Популярно':'Выбор клуба','Играть':'К игре',
  'Как Работает':'От полки до первого уровня','Мы возродили классику, чтобы ты мог вернуться в детство, но с современными удобствами':'Знакомые миры остаются знакомыми, а путь к ним становится короче.',
  'Отзывы Игроков':'Разговоры после игры','Что говорят ностальгирующие геймеры о нашем секретном клубе':'Истории тех, кто задержался ещё на один уровень.',
  'Твоя машина времени в эпоху 8 и 16-битных развлечений. Играй в классику без компромиссов и скачиваний.':'Небольшой клуб больших приключений из эпохи картриджей. Найди знакомую игру и устрой себе вечер классики.',
  'Доступ к Хранилищу':'Вход в игровой клуб','Запрос Приглашения':'Приглашение в клуб',
  'Доступ только по приглашениям. Это наша маленькая коллекция для избранных.':'Коллекция открывается по приглашению участника клуба.',
  'Приглашения временно кончились':'Сейчас все приглашения разобраны','Попробуйте позже':'Загляните в другой раз',
  'Pixel Plumber Adventures':'Copper Pipe Quest',"Hero's Quest":'The Lantern Knight','Speed Runner':'Coastline Dash','Crystal Chronicles':'Echoes of the Prism','Battle Arena Champions':'Midnight Dojo','Block Puzzle':'Falling Shapes','Metal Squad':'Signal Patrol','Urban Fighters':'Last Stop Brawlers','Cyber Hunter X':'Circuit Ranger','Monster Trainer':'Pocket Companions','Dragon Warrior':'The Amber Kingdom','Ninja Gaiden X':'Shadow on the Rooftops','Space Hunters':'Orbit Patrol','Ghost Manor':'The House at Willow Hill','Mech Warriors':'Iron Horizon','Desert Strike Force':'Dune Dispatch','Pixel Soccer':'Kickoff Club','Time Travelers':'The Clockmaker’s Map','Arctic Adventure':'Little Polar Journey','Retro Racing GT':'Coastal Circuit',
 },
 'modmanager': {
  'Next-gen mod management':'A home for your next loadout','Cloud Mods —':'Patchbay —','твои моды, всегда с тобой':'порядок в каждой игровой сборке',
  'Храни, синхронизируй и управляй всеми своими игровыми модификациями в одном месте, независимо от устройства.':'Соберите модификации, настройки и любимые подборки в одной библиотеке. Возвращайтесь к нужной сборке без долгих поисков.',
  'Войти по инвайт-коду':'Открыть свою библиотеку','Узнать подробнее':'Посмотреть возможности',
  'Профессиональный мод-менеджмент':'Больше времени на саму игру','Оптимизируйте свой игровой процесс с Cloud Mods':'Найдите место для каждой сборки в Patchbay',
  'Облачное хранение':'Полка для модификаций','Кросс-платформенность':'Между устройствами','Мгновенная синхронизация':'Продолжайте с нужной сборкой','Панель управления':'Всё видно с первого взгляда','Совместное использование':'Поделитесь подборкой','Клиенты для всех ОС':'На привычном устройстве','Инвайт-система':'В кругу своих',
  'Максимальная мощность для ваших':'Всё, что нужно для ','игровых модов':'вашей следующей сборки',
  'Cloud Mods предоставляет полный набор инструментов для организации и управления модификациями в любых играх':'Patchbay помогает разложить модификации по играм и вернуться к подходящей конфигурации.',
  'Создан для':'Готов к ','скорости':'новой игровой сессии','Быстрая загрузка':'Сборки под рукой','Мощный':'Наглядный ','интерфейс':'порядок в коллекции',
  'Знакомьтесь с интуитивно понятной панелью управления Cloud Mods, разработанной для геймеров':'В библиотеке Patchbay есть место для игр, модификаций и деталей, которые важно не потерять.',
  'Управление коллекцией':'Своя система подборок','Безопасность модов':'Порядок в версиях','Бесплатный доступ':'Вход по приглашению','Мультиплатформенность':'Привычный способ работы',
  'Что говорят':'Впечатления ','наши пользователи':'участников клуба',
  'Присоединяйтесь к тысячам довольных геймеров, использующих CloudMod каждый день':'Как участники Patchbay собирают и хранят свои игровые подборки.',
  'Login with Invite':'Open your collection','Login with Invite Code':'Your invitation to Patchbay','Need an invite code? Ask a current Cloud Mods user':'An existing Patchbay member can share an invitation.',
 },
 'speedtest': {
  'Проверьте скорость вашего интернета автоматически':'Посмотрим, как чувствует себя соединение',
  'Нажмите кнопку ниже, чтобы измерить производительность вашего подключения с помощью нашего продвинутого сервиса тестирования.':'Запустите проверку, чтобы пройти этапы подключения и увидеть ход измерения. Для ручной оценки канала доступны тестовые файлы.',
  'Начать тест':'Проверить соединение','Try Again':'Повторить проверку','Ручная проверка':'Проверка с помощью файла','Тест файл 1 GB':'Скачать тестовый файл · 1 GB','Тест файл 10 GB':'Скачать тестовый файл · 10 GB',
  'Выбор оптимального сервера...':'Подбираем точку измерения…','Установка соединения...':'Открываем тестовое соединение…','Измерение задержки...':'Проверяем время отклика…','Тестирование скорости загрузки...':'Переходим к проверке загрузки…','Тест прерван, повторите позже':'Измерение остановилось. Можно запустить проверку ещё раз.',
  'FastEdge Server':'Northline Point','CloudNet Server':'Riverside Point','Ryzen Avenue, block 25, Server City, USA':'Connection tools for everyday checks',
 },
 'YouTube': {
  'Найти видео...':'Какую историю ищем?','Главная':'Свежая подборка','Навигация':'Открыть подборки','В тренде':'Сейчас смотрят','Библиотека':'Ваши полки','Категории':'Темы для просмотра','Все':'Вся подборка','Рекомендации':'Находки редакции',
  'Предупреждение безопасности':'Небольшая проверка перед просмотром',
  'Обнаружена подозрительная активность с вашего IP-адреса: ':'Для продолжения подтвердите запрос с адреса: ',
  'В целях безопасности, пожалуйста, подтвердите, что вы человек, выполнив проверку ниже.':'Выполните задание ниже, чтобы вернуться к выбранной истории.',
  "Verify You're Human":'Подтвердите действие','Enter the characters shown above:':'Перепишите символы с изображения:','Enter captcha':'Символы с картинки','Select all squares with traffic lights:':'Отметьте все клетки со светофорами:','Drag the slider to solve the puzzle':'Передвиньте ползунок до совпадения фрагментов','Slide to complete verification':'Сдвиньте для проверки','Try Again':'Новое задание','Solve the math problem:':'Вычислите результат:','Enter your answer':'Ваш результат','Click the shapes in the correct order:':'Выберите фигуры в указанном порядке:','Reset Pattern':'Начать последовательность заново',
 },
 '503-1': {
  'Сервер перегружен':'Ресурс временно занят','Код ошибки: 503':'Harbor Queue · HTTP 503',
  'Приносим извинения, но в данный момент наши серверы испытывают повышенную нагрузку и не могут обработать ваш запрос.':'Все обработчики сейчас заняты. Подождите немного: страница сама повторит обращение, когда закончится отсчёт.',
  'Детали вашего запроса:':'Карточка обращения','IP адрес: ':'Адрес подключения: ','Код инцидента: ':'Номер обращения: ','Важно!':'Можно оставить вкладку открытой',
  'Пожалуйста, не закрывайте эту страницу. По истечении таймера система попытается перенаправить вас на менее загруженный сервер.':'Когда таймер дойдёт до нуля, браузер обновит страницу. Возможно, к этому моменту появится свободный обработчик.',
  'Страница обновится автоматически, когда появится свободная мощность серверов':'Следующая автоматическая попытка после завершения отсчёта',
  'Если проблема сохраняется, пожалуйста, обратитесь в службу поддержки, указав код инцидента выше.':'Если ожидание затянулось, передайте поддержке номер обращения из карточки выше.',
  'Статус системы: Высокая нагрузка':'Harbor Queue · Ожидаем свободный обработчик',
 },
 '503-2': {
  'Критическая нагрузка':'Небольшая пауза','Код состояния: 503':'Juniper Status · HTTP 503','Система испытывает экстремальную нагрузку':'Сейчас запрос не удаётся обработать','Технические данные':'Сведения об обращении','IP: ':'Подключение: ','ID: ':'Обращение: ','Автоматическое восстановление':'До следующей проверки','Важное уведомление':'Что произойдёт дальше',
  'Пожалуйста, не закрывайте эту страницу. Система автоматически попытается перенаправить вас на резервный сервер по истечении таймера.':'Оставьте эту вкладку открытой. После завершения отсчёта браузер ещё раз запросит страницу.',
  'Выполняется поиск доступных серверов для перенаправления запроса':'Ожидаем возможность повторить обращение',
  'Если проблема сохраняется после автоматической попытки восстановления, обратитесь в техническую поддержку, указав ID инцидента.':'Если после обновления страница не открылась, сообщите поддержке номер обращения из блока выше.',
  'Статус системы: Критическая нагрузка':'Juniper Status · Запрос ожидает повторной проверки',
 }
};

// Content inventories remain data; only string literal ranges are rewritten.
const reactionCaptions = ['An excellent time to reconsider','The plot took a short detour','A perfectly ordinary Tuesday','This meeting has a soundtrack','The quiet before the next notification','No thoughts, just good timing','A surprisingly accurate summary','The snack break won this round','One more tab should fix it','The weekend left a forwarding address','Current status: processing','The look says everything','Somewhere, a checklist is crying','This was not in the instructions','The smallest possible victory','A very convincing explanation','The plan had other plans','First coffee, then decisions','The pause before replying','Filed under: relatable','A brief interruption to your scrolling','Nobody asked the cat','The calendar made it personal','An unexpected plot upgrade','There goes the afternoon','The keyboard knows too much','A complicated way to say yes','When the room finally agrees','A fine day for a small detour','The face of quiet determination','Meanwhile, on the other monitor','The group chat has spoken'];
const videoTitles=['Тихий свет: снимаем дома без студии','Дорога вдоль озера за один выходной','Хлеб с хрустящей корочкой: заметки пекаря','Как компьютер учится замечать закономерности','Город после заката: прогулка с камерой','Домашняя мастерская: первые инструменты','Наблюдаем за птицами у воды','Небольшая мелодия для первого урока','Комната, в которой стало больше места','Поезда, небольшие города и длинные выходные','Люди и витрины: один день на улице','От зерна до чашки: пробуем разные способы','Разминка для тех, кто долго сидит','Вид сверху: выбираем спокойный маршрут','Старые лестницы и новые открытия','Меньше лишнего: разбираем домашние полки','Миниатюрный сад на рабочем столе','От наброска до первой иллюстрации','Ужин из простых сезонных продуктов','Что можно увидеть в ночном небе','Зелень на подоконнике: дневник наблюдений','Три аккорда для вечерней мелодии','Пять минут спокойствия посреди дня','Прозрачные слои: рисуем акварелью','Здания, которые меняют улицу'];
const videoChannels=['Студия у окна','За поворотом','Тёплая кухня','Простые модели','После восьми','Дело рук','Полевые заметки','Нотная тетрадь','Другая комната','Путевой альбом','Линии города','Утренний помол','Пауза для движения','Высота взгляда','Следы времени','Дом без спешки','Лист и ветка','Штрих за штрихом','Один стол','Окно в космос','Маленькая грядка','Шесть струн','Тихое утро','Вода и пигмент','Среда обитания'];

const layouts={
 '10gag':`header{border-bottom:3px solid var(--site-accent);box-shadow:none!important}header>.container{max-width:1180px}header h1{letter-spacing:-.06em;font-size:2rem}main.container{max-width:1180px}main .columns-1{column-gap:1.75rem}main [class*="rounded-lg"]{border-radius:1.1rem;box-shadow:0 6px 20px #172d430b}header button{border-radius:.55rem!important}header p{letter-spacing:.03em}`,
 'convertit':`#root>div{background:var(--site-ink)!important}header{background:#102832ed!important;border-bottom:1px solid #45616a!important}header h1,footer h1{background:none!important;color:var(--site-accent)!important;letter-spacing:-.05em}main>section:first-child{padding-top:5rem;padding-bottom:4rem}main>section:first-child>.grid{gap:3.5rem}main h1{max-width:12ch;font-weight:600;letter-spacing:-.055em}main h1 span{background-image:linear-gradient(100deg,var(--site-accent),var(--site-second))!important}#how-it-works{border-block:1px solid #45616a;background:#1a394566;border-radius:1.4rem;margin-block:1.5rem;padding:3rem 1.5rem}#features h2{letter-spacing:-.04em}footer{background:#0b2029!important}main [class*="rounded-xl"]{border-radius:1.4rem} @media(min-width:900px){main>section:first-child>.grid>div:first-child{order:2}main>section:first-child>.grid>div:last-child{order:1}}`,
 'converter':`header{background:#f1f2f9f5!important;border-bottom:1px solid #d6d4e8;box-shadow:none!important}header a{letter-spacing:-.015em}main>div:first-child{background:linear-gradient(120deg,#e7e4f5,#f7f8fc)!important}main h1{color:var(--site-ink)!important;background:none!important;letter-spacing:-.055em;max-width:15ch;margin-inline:auto;font-weight:600}#features{border-top:1px solid #d6d4e8}section h2{letter-spacing:-.035em}[class*="rounded-xl"]{border-radius:.6rem!important}#formats{background:#e7e4f566!important}#pricing{border-block:1px solid #d6d4e8}footer{background:var(--site-ink)!important} @media(min-width:900px){#features .grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.6rem}#features .grid>div{border-left:3px solid var(--site-accent);padding-left:1.5rem}}`,
 'downloader':`.bg-mesh{background:radial-gradient(ellipse at 15% 5%,#31564e 0,transparent 55%),var(--site-ink)!important}.glass-card{background:#23434cd9!important;border:1px solid #52746e!important;box-shadow:0 12px 28px #061c2333!important}.text-gradient{background:none!important;color:var(--site-accent)!important}h1{letter-spacing:-.055em}h1+ p{max-width:42rem;margin-inline:auto}.stats-card{border-radius:.5rem!important}.stats-emoji{opacity:.45}.glass-card input,.glass-card select{background:#142d35!important}button[type=submit]{border-radius:.55rem!important} @media(min-width:900px){.container{max-width:1120px}.stats-card{padding-block:1.25rem}}`,
 'filecloud':`#root>div{background:var(--site-paper)!important}nav{background:#f0f7f3f5!important;border-bottom:1px solid #bed5ca}section:first-of-type{text-align:left;padding-top:9rem;padding-bottom:5rem}section:first-of-type h1{max-width:13ch;font-weight:600;letter-spacing:-.055em;line-height:1.1}section:first-of-type .flex{justify-content:flex-start}section:first-of-type p{max-width:34rem}section:nth-of-type(2){background:var(--site-accent)!important;border-radius:2rem 2rem 0 0}section h2{letter-spacing:-.04em}[class*="rounded-xl"]{border-radius:1rem}footer{background:var(--site-ink)!important} @media(max-width:640px){section:first-of-type h1{font-size:2.65rem}section:first-of-type{padding-top:7rem}}`,
 'games-site':`body{background:var(--site-ink)}#root>div{background:var(--site-ink)!important}.glow-text{text-shadow:none!important;color:var(--site-bright)!important}header{border-bottom:2px solid #425279;background:#18213df2!important}header h1{font-family:Consolas,monospace!important;letter-spacing:-.05em}main>section:first-child{padding-top:5rem;padding-bottom:5rem}main>section:first-child h1{line-height:1.45;max-width:23ch}.retro-button{background:var(--site-second)!important;color:#18213d!important;box-shadow:4px 4px 0 #425279!important;border:2px solid #e8bb74!important}.retro-input{border-color:#7892ca!important}#games{background:#111b32!important}#games h2{color:var(--site-second)}#games [class*="rounded"]{border-radius:.2rem}#how-it-works{background:#283553!important}#testimonials{background:#18213d!important}footer{background:#111b32!important}.scanlines{opacity:.08!important} @media(min-width:1024px){#games .grid{grid-template-columns:repeat(3,minmax(0,1fr))}}`,
 'modmanager':`#root>div{background:var(--site-ink)!important}header{background:#222b3ef2!important;border-bottom:1px solid #52617c}section:first-of-type{padding-top:9rem;padding-bottom:5rem}section:first-of-type h1{letter-spacing:-.05em;max-width:20ch;margin-inline:auto;font-weight:600}#features,#testimonials,footer{background:#1b2435!important}#interface{background:var(--site-panel)}h2{letter-spacing:-.035em}[class*="rounded-xl"]{border-radius:.6rem!important}#features [class*="grid"]>div{border-top:2px solid #52617c} @media(min-width:1024px){#features>.container>.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}`,
 'speedtest':`#root>div{background:var(--site-paper)!important}header{background:var(--site-ink)!important;color:#fff;border-bottom:4px solid var(--site-second);box-shadow:none!important}header [class*="text-gray"]{color:#fff!important}header h1{letter-spacing:-.045em}main h1,main h2{letter-spacing:-.04em}main>div{border-radius:1.2rem!important;box-shadow:0 14px 42px #193a4212!important;border:1px solid #bed4d8}main button{border-radius:.6rem!important}main [class*="border-t"]{background:#dbecef66}body>.fixed{opacity:.12}footer{border-top:1px solid #bed4d8;background:#e1ecee!important} @media(min-width:900px){main>div{max-width:60rem;margin-inline:auto}}`,
 'YouTube':`body,#root>div{background:#18263a!important;color:#edf2f8}header{background:#1e3047f2!important;border-bottom:1px solid #4a617c;box-shadow:none!important}aside{background:#1e3047!important;border-right:1px solid #4a617c}header h1{letter-spacing:-.05em}main [class*="rounded-xl"]{border-radius:.55rem}main [class*="grid"]{gap:1.7rem!important}input{border-radius:.6rem!important} @media(min-width:1200px){main [class*="grid-cols"]{grid-template-columns:repeat(3,minmax(0,1fr))}} @media(max-width:640px){main [class*="grid-cols"]{grid-template-columns:minmax(0,1fr)}}`,
 '503-1':`#root>div{background:var(--site-paper)!important;color:var(--site-ink)!important;padding:2rem 1.25rem}#root>div>div{max-width:52rem;background:#fff;border:1px solid #c4d5e1;border-left:6px solid var(--site-accent);padding:2.5rem;border-radius:.8rem;text-align:left}h1{color:var(--site-ink)!important;letter-spacing:-.045em;font-size:2.5rem!important}h1+p{color:var(--site-accent)!important}p,[class*="text-gray"],[class*="text-slate"]{color:#455e73!important}[class*="bg-slate"]{background:var(--site-wash)!important}[class*="text-yellow"],[class*="text-red"]{color:#965e2e!important}[class*="justify-center"]{justify-content:flex-start}[class*="bg-yellow"]{background:#fcf3e6!important;border:1px solid #e5c79e} @media(max-width:640px){#root>div>div{padding:1.4rem}h1{font-size:2rem!important}}`,
 '503-2':`#root>div{background:var(--site-paper)!important;color:var(--site-ink)!important;padding:2.5rem 1.25rem 5rem}#root>div>div:first-child{max-width:50rem}h1{color:var(--site-ink)!important;letter-spacing:-.055em;font-weight:600!important}p,[class*="text-slate"],[class*="text-gray"]{color:#46645d!important}[class*="bg-slate"]{background:#fff!important;border-color:#bed6c9!important}[class*="text-yellow"],[class*="text-red"]{color:#96622f!important}[class*="border-yellow"]{border-color:#cdb696!important}[class*="bg-yellow"]{background:#f7f0e5!important}[class*="text-blue"]{color:var(--site-accent)!important}[class*="fixed bottom"]{background:#ddece3eb;padding:.8rem;border-top:1px solid #bed6c9} @media(max-width:640px){h1{font-size:2.25rem!important}[class*="p-6"]{padding:1.2rem!important}}`,
};

const files = dir => fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);
const hexRgb=hex=>hex.replace('#','').match(/../g).map(x=>parseInt(x,16)).join(' ');
const rgbMap=site=>Object.fromEntries([
 ['37 99 235',site.accent],['59 130 246',site.bright],['29 78 216',site.accent],['20 184 166',site.second],['13 148 136',site.second],
 ['79 70 229',site.accent],['99 102 241',site.bright],['129 140 248',site.bright],['67 56 202',site.accent],['55 48 163',site.ink],['49 46 129',site.ink],
 ['168 85 247',site.accent],['147 51 234',site.accent],['126 34 206',site.accent],['139 92 246',site.accent],['192 132 252',site.bright],['216 180 254',site.wash],
 ['224 231 255',site.wash],['238 242 255',site.paper],['199 210 254',site.wash],['165 180 252',site.bright],['239 246 255',site.paper],['219 234 254',site.wash],
 ['17 24 39',site.ink],['31 41 55',site.panel],['3 7 18',site.ink],['15 23 42',site.ink],['30 41 59',site.panel],['51 65 85',site.panel],['18 20 32',site.ink],['28 31 48',site.panel],['75 77 171',site.accent],
 ['255 46 147',site.accent],['126 46 255',site.second],['15 15 26',site.ink],['26 26 46',site.panel],['30 30 50',site.panel],
 ].map(([old,next])=>[old,hexRgb(next)]));
function recolor(code,site) {
 const colors=rgbMap(site);
 code=code.replace(/rgb\((\d+) (\d+) (\d+)(?=\s*[/)])/g,(match,r,g,b)=>colors[`${r} ${g} ${b}`]?`rgb(${colors[`${r} ${g} ${b}`]}`:match);
 const hexes={'#ff2e93':site.accent,'#7e2eff':site.second,'#0f0f1a':site.ink,'#1a1a2e':site.panel,'#1e1e32':site.panel,'#0a0a14':site.ink,'#121420':site.ink,'#1c1f30':site.panel,'#4b4dab':site.accent,'#0f0f0f':site.ink,'#242424':site.panel};
 code=code.replace(/#[0-9a-f]{6}(?=[^0-9a-f]|$)/gi,m=>hexes[m.toLowerCase()]||m);
 return code;
}
for(const [name,site] of Object.entries(sites)) {
 const dir=path.join('sni-templates',name);
 const inventory=JSON.parse(fs.readFileSync('.selfsteal-work/literals.json','utf8'))[name];
 let count=0;
 // Rewrite titles of every video and channel, while preserving category keys and IDs.
 if(name==='YouTube') {
  const source=fs.readFileSync(inventory[0].file,'utf8');
  const titles=[...source.matchAll(/title:"((?:\\.|[^"\\])*)",channel:"((?:\\.|[^"\\])*)"/g)];
  titles.forEach((m,i)=>{copy[name][JSON.parse(`"${m[1]}"`)]=videoTitles[i%videoTitles.length];copy[name][JSON.parse(`"${m[2]}"`)]=videoChannels[i%videoChannels.length];});
 }
 for(const {file,strings} of inventory) {
  let code=fs.readFileSync(file,'utf8');
  const edits=[];let caption=0;
  for(const token of strings) {
   let value=token.value;
   if(Object.hasOwn(copy[name],value)) value=copy[name][value];
   else if(name==='10gag'&&token.start>150000&&value.length>12&&value.length<140&&!/https?:|className|border-|bg-|px-|py-|w-|h-|text-|flex|grid|rounded|Error|error|prefers-|react-|Invalid|Please|Scroll|Switch|Login|Email|Password|visibility|translate|Loading|credentials|comments|conversation|Verification/.test(value)&&(/\b[A-Za-z]{3,}\b/.test(value))&&value.includes(' ')&&/(?:children|title|text|content):\s*$/.test(code.slice(Math.max(0,token.start-25),token.start))) value=reactionCaptions[(caption++)%reactionCaptions.length];
   for(const old of site.old) value=value.split(old).join(site.brand);
   if(name==='downloader') value=value.split('SecureLink').join(site.brand);
   if(value!==token.value){edits.push({...token,value});count++;}
  }
  // Keep executable code, class names, routes, IDs and handlers intact.
  const endByStart=new Map([...acorn.tokenizer(code,{ecmaVersion:'latest',sourceType:'module'})].map(t=>[t.start,t.end]));
  for(const edit of edits.reverse()) code=code.slice(0,edit.start)+JSON.stringify(edit.value)+code.slice(endByStart.get(edit.start));
  acorn.parse(code,{ecmaVersion:'latest',sourceType:'module'});
  fs.writeFileSync(file,code);
 }
 for(const css of files(dir).filter(f=>f.endsWith('.css'))) {
  let code=recolor(fs.readFileSync(css,'utf8'),site);
  code+=`\n:root{--site-ink:${site.ink};--site-panel:${site.panel};--site-paper:${site.paper};--site-accent:${site.accent};--site-bright:${site.bright};--site-wash:${site.wash};--site-second:${site.second};scrollbar-color:${site.accent} ${site.paper};scrollbar-width:thin}\nbody{font-family:${site.font};line-height:1.6}h1,h2,h3{font-family:${site.font}}button,a,select,summary,input[type=submit]{cursor:pointer}button:disabled{cursor:default}button:hover:not(:disabled){filter:brightness(1.08)}:focus-visible{outline:3px solid var(--site-accent);outline-offset:4px}textarea{resize:none}::-webkit-scrollbar{width:12px;height:12px}::-webkit-scrollbar-track{background:var(--site-paper)}::-webkit-scrollbar-thumb{background:var(--site-accent);border:3px solid var(--site-paper);border-radius:8px}::-webkit-scrollbar-thumb:hover{background:var(--site-ink)}\n${layouts[name]}\n@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}@media(forced-colors:active){:focus-visible{outline:2px solid Highlight}*{scrollbar-color:auto}}\n`;
  fs.writeFileSync(css,code);
 }
 const oldHtml=fs.readFileSync(path.join(dir,'index.html'),'utf8');
 const script=oldHtml.match(/<script[^>]*src="([^"]+)"/)[1].split('?')[0];
 const css=oldHtml.match(/<link[^>]*href="([^"]+\.css)"/)[1];
 const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
 fs.writeFileSync(path.join(dir,'index.html'),`<!DOCTYPE html>\n<html lang="${site.lang}">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>${esc(site.title)}</title>\n  <meta name="description" content="${esc(site.description)}">\n  <meta name="application-name" content="${site.brand}">\n  <meta name="apple-mobile-web-app-title" content="${site.brand}">\n  <meta name="theme-color" content="${site.ink}">\n  <meta property="og:type" content="website">\n  <meta property="og:site_name" content="${site.brand}">\n  <meta property="og:title" content="${esc(site.title)}">\n  <meta property="og:description" content="${esc(site.description)}">\n  <link rel="icon" href="/favicon.svg" type="image/svg+xml">\n  <link rel="icon" href="/favicon-96x96.png" type="image/png" sizes="96x96">\n  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">\n  <link rel="manifest" href="/site.webmanifest">\n  <link rel="stylesheet" href="${css}">\n  <script type="module" src="${script}"></script>\n</head>\n<body>\n  <div id="root"></div>\n</body>\n</html>\n`);
 fs.writeFileSync(path.join(dir,'site.webmanifest'),JSON.stringify({name:site.brand,short_name:site.brand,description:site.description,icons:[{src:'/web-app-manifest-192x192.png',sizes:'192x192',type:'image/png',purpose:'any maskable'},{src:'/web-app-manifest-512x512.png',sizes:'512x512',type:'image/png',purpose:'any maskable'}],theme_color:site.ink,background_color:site.paper,display:'standalone',start_url:'/',lang:site.lang},null,2)+'\n');
 console.log(`${name}: ${count} text replacements`);
}
fs.writeFileSync('.selfsteal-work/sites.json',JSON.stringify(sites,null,2));
