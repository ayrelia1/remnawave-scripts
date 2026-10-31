<div align="center">

# 🎭 Selfsteal — Caddy/Nginx для Reality

[![Версия](https://img.shields.io/badge/selfsteal.sh-2.14.0-blue.svg)](#-что-нового)
[![Веб-сервер](https://img.shields.io/badge/Caddy_%7C_Nginx-supported-brightgreen.svg)](#-сравнение-caddy-vs-nginx)
[![Шаблоны](https://img.shields.io/badge/шаблонов-11_standalone-purple.svg)](#-шаблоны-сайтов)
[![Лицензия MIT](https://img.shields.io/badge/Лицензия-MIT-yellow.svg)](./LICENSE)

<img src="assets/preview-selfsteal.svg" alt="Меню selfsteal" width="640">

**[Установка](#-установка)** · **[Команды](#-команды)** · **[Caddy vs Nginx](#-сравнение-caddy-vs-nginx)** · **[Шаблоны](#-шаблоны-сайтов)** · **[Конфиг Xray](#-конфигурация-xray-reality)** · **[Главный README](./README_RU.md)**

</div>

Автоматическая установка и управление веб-сервером (**Caddy** или **Nginx**) для маскировки трафика **Reality** в связке с Xray. Порт 443 остаётся полностью за Xray — веб-сервер получает трафик от него через внутренний порт или Unix socket с proxy_protocol и отдаёт сайт-обманку с антифингерпринт-уникализацией.

Проект [gig.ovh](https://gig.ovh) · Автор: [DigneZzZ](https://github.com/DigneZzZ)

## 🆕 Что нового

| Версия | Главное |
|---|---|
| **2.14.0** | №2 — форум, №5 — редакционный кабинет; 14 HTML-страниц, отдельные CSS/JS/SVG/JSON и манифесты; все 11 каталогов переименованы, загрузка проверяет полный состав ресурсов |
| **2.13.0** | 11 сайтов; у 503 сохранены IP, код обращения, таймер и автообновление |
| **2.11.1** | `--nginx`: перед установкой acme.sh проверяется и при необходимости ставится cron — без `crontab` установщик acme.sh завершается ошибкой, и выпуск сертификата срывался |
| **2.11.0** | Проверка сертификата в главном меню и в `status`: выдан ли он на используемый домен, доверенный ли (не self-signed / Caddy Local Authority), сколько дней осталось — для Nginx и Caddy (ACME-сертификат Caddy читается прямо из Docker-тома) |
| **2.10.1** | Исправлен выпуск SSL для Nginx: ACME-контакт больше не собирается из `hostname` (`user35123@debian.debian` отклонялся Let's Encrypt), битый аккаунт чинится автоматически ([#47](https://github.com/DigneZzZ/remnawave-scripts/issues/47)) |
| **2.10.0** | `selfsteal reissue-cert` — принудительный перевыпуск сертификата Caddy одной командой (с бэкапом и автооткатом при неудаче) |
| **2.9.0** | Устойчивое получение Docker-образов: fallback на зеркала, когда Docker Hub недоступен/заблокирован |
| **2.8.x** | Антифингерпринт-мутация шаблонов при установке, HTTP/3 выключен по умолчанию (`--h3` для включения), Caddy 2.11.4, `admin off` против boot-loop |

## 🏗 Архитектура

Веб-сервер **не слушает порт 443** — он полностью принадлежит Xray. При активной пробе Reality форвардит соединение на dest, и пробер получает настоящий сайт.

```
Интернет ──:443──▶ Xray (Reality, VLESS) ──proxy_protocol──▶ веб-сервер
                                                │
                     Caddy:  127.0.0.1:9443 (TCP)
                     Nginx:  /dev/shm/nginx.sock (Unix socket, по умолчанию) или TCP
```

**Порты:** `443` — только Xray · `9443` — внутренний TCP веб-сервера (Caddy или Nginx `--tcp`) · `80` — HTTP→HTTPS редирект · `8443+` — ACME TLS-ALPN для Nginx (автоперебор 8443→9443→10443→18443→28443 или `--acme-port`).

## ⚡ Установка

```bash
# Caddy (по умолчанию)
bash <(curl -Ls https://github.com/ayrelia1/remnawave-scripts/raw/main/selfsteal.sh) @ install

# Nginx с Unix socket (рекомендуется — см. сравнение ниже)
bash <(curl -Ls https://github.com/ayrelia1/remnawave-scripts/raw/main/selfsteal.sh) @ --nginx install

# Nginx с TCP-портом вместо socket
bash <(curl -Ls https://github.com/ayrelia1/remnawave-scripts/raw/main/selfsteal.sh) @ --nginx --tcp install
```

<details>
<summary><b>🚀 Force-режим для автоматизации (CI/CD, массовый деплой)</b></summary>

```bash
# Базовая force-установка (без интерактивных запросов и DNS-проверки)
bash <(curl -Ls https://github.com/ayrelia1/remnawave-scripts/raw/main/selfsteal.sh) @ --nginx --force --domain reality.example.com install

# С конкретным портом и шаблоном
bash <(curl -Ls https://github.com/ayrelia1/remnawave-scripts/raw/main/selfsteal.sh) @ --nginx --force --domain reality.example.com --port 8443 --template 5 install

# С ручным wildcard-сертификатом (Nginx или Caddy)
bash <(curl -Ls https://github.com/ayrelia1/remnawave-scripts/raw/main/selfsteal.sh) @ --nginx --force --domain reality.example.com \
    --ssl-cert /path/to/fullchain.crt --ssl-key /path/to/private.key install
```

| Опция | Описание |
|---|---|
| `--force`, `-f` | Пропустить проверку DNS и все интерактивные запросы |
| `--domain <domain>` | Домен (обязателен с `--force`) |
| `--port <port>` | Внутренний HTTPS-порт (по умолчанию 9443) |
| `--template <1-11>` | Номер шаблона (иначе случайный) |
| `--ssl-cert` / `--ssl-key` | Ручной сертификат (fullchain) и ключ |
| `--h3`, `--quic` | Включить HTTP/3 у Caddy (по умолчанию **выкл**) |
| `--socket` / `--tcp` | Nginx: Unix socket (дефолт) / TCP-порт |
| `--acme-port <port>` | Nginx: конкретный порт для ACME TLS-ALPN |
| `--no-randomize` | Отключить антифингерпринт-мутацию шаблона |

Без `--ssl-cert` в force-режиме скрипт пробует ACME; при неудаче — self-signed.

</details>

## 📋 Команды

### Обновление установленной команды после переименования шаблонов

Начиная с 2.14.0 имена каталогов шаблонов изменились. Перед сменой сайта обновите
CLI: предыдущая версия будет искать старые пути. От `root` выполните:

```bash
(
    set -e
    cli_tmp=$(mktemp)
    trap 'rm -f "$cli_tmp"' EXIT
    curl -fsSL https://raw.githubusercontent.com/ayrelia1/remnawave-scripts/main/selfsteal.sh -o "$cli_tmp"
    bash -n "$cli_tmp"
    if [ -f /usr/local/bin/selfsteal ]; then
        cp -p /usr/local/bin/selfsteal "/usr/local/bin/selfsteal.bak.$(date +%Y%m%d-%H%M%S)"
    fi
    install -m 0755 "$cli_tmp" /usr/local/bin/selfsteal
)
/usr/local/bin/selfsteal --version
```

Ожидается версия **2.14.0**. Команда обновляет только CLI с резервной копией;
сайт, конфигурация и сервисы Caddy/Nginx не переустанавливаются. Затем выберите
новый сайт через `/usr/local/bin/selfsteal template` (или с `--no-randomize`).
Запуск свежего скрипта через `curl` с командой `template` сам по себе не заменяет
сохранённую команду `/usr/local/bin/selfsteal`.

```bash
selfsteal          # интерактивное меню
```

| Команда | Описание |
|---|---|
| `install` / `uninstall` | Установка / удаление (только один веб-сервер одновременно) |
| `up` / `down` / `restart` / `status` / `logs` | Управление сервисами; `status` показывает сертификат: домен, издатель, доверие, срок (для Caddy — из Docker-тома) |
| `template` | Выбор/смена шаблона (с бэкапом предыдущего) |
| `edit` | Редактирование конфигурации |
| `renew-ssl` | Обновить сертификат (Caddy — форс-перевыпуск, Nginx — acme.sh) |
| `reissue-cert [-f]` | Caddy: принудительный перевыпуск с бэкапом и автооткатом |
| `guide` | Гайд по интеграции с Reality |
| `update` | Обновление скрипта |

## ⚖️ Сравнение Caddy vs Nginx

| | Caddy | Nginx |
|---|---|---|
| SSL | Автоматически (ACME HTTP-01 на :80) | ACME TLS-ALPN (8443+, автоперебор) через acme.sh |
| Ручные сертификаты | ✅ `--ssl-cert/--ssl-key` | ✅ `--ssl-cert/--ssl-key` |
| Подключение от Xray | TCP `127.0.0.1:9443` | **Unix socket** `/dev/shm/nginx.sock` (или TCP) |
| Путь установки | `/opt/caddy` | `/opt/nginx-selfsteal` |
| HTTP/3 (QUIC) | Выкл по умолчанию (вкл `--h3`) | Не используется |
| **TLS-отпечаток** | Go `crypto/tls` — узнаваемый JARM/JA3S | **OpenSSL — как у обычных сайтов** |
| Обновление SSL | Автоматически / `reissue-cert` | `renew-ssl` |

> 🛡️ **Устойчивость к активному пробингу (РКН/ТСПУ).** При пробе Reality пробер завершает настоящее TLS-рукопожатие с веб-сервером. Отпечаток Go `crypto/tls` у Caddy (JARM/JA3S, HTTP/2 SETTINGS) **нельзя изменить средствами Caddy**; Nginx на OpenSSL выглядит как обычный сайт. При жёстком пробинге **Nginx как dest объективно «тише»** — если бан повторяется даже после отключения h3, переходите на `--nginx`. В острые периоды также помогает увод Reality с 443 на высокий порт (47000+).

> 🔒 **Почему HTTP/3 выключен.** Reality проксирует только TCP, поэтому dest, анонсирующий QUIC по UDP (которого там нет), создаёт лишний отпечаток. Включайте `--h3` только осознанно.

**Unix socket у Nginx**: быстрее (нет TCP-стека), не занимает порт, нет конфликтов. Требует проброса `/dev/shm` в контейнер Xray — см. [настройку ниже](#-unix-socket--xray-в-docker).

## 🎨 Шаблоны сайтов

11 самостоятельных сайтов из [`sni-templates/`](https://github.com/ayrelia1/remnawave-scripts/tree/main/sni-templates) этого форка. Стили, JavaScript, SVG-иконки и манифесты находятся в отдельных файлах; у форума и кабинета есть внутренние HTML-страницы и JSON-данные. Старые сборки, картинки, пути ресурсов и подписи генераторов заменены. Контент читается без JavaScript; инструменты работают локально.

| № | Сайт | Назначение |
|---|---|---|
| 1 | Bracken Fieldbook | Справочник деревьев с фильтром |
| 2 | Клуб Практика | Форум: разделы, поиск, темы, создание темы и ответы |
| 3 | Steep Hour | Чайный таймер с паузой и сбросом |
| 4 | Spoon Ratio | Пересчёт ингредиентов рецепта |
| 5 | Folio Desk | Кабинет: материалы, поиск, фильтры, отдельный редактор |
| 6 | Fold Studies | Пошаговая инструкция оригами |
| 7 | Chroma Deck | Подбор цветов и расчёт контраста |
| 8 | Seven Small Days | Недельный трекер привычки |
| 9 | Orbit Almanac | Интерактивный атлас планет |
| 10 | Slate Workshop | Страница 503: IP, код обращения, таймер |
| 11 | Still Service | Другая страница 503: IP, ID, таймер |

Все каталоги переименованы: `bracken`, `courtyard`, `steep-hour`, `spoon-ratio`,
`editorial`, `fold-studies`, `chroma-deck`, `seven-days`, `orbit-almanac`,
`slate-status`, `still-status`. Номера выбора 1–11 сохраняются. Имена `index.html`
и `site.webmanifest` стандартные; остальные файлы имеют собственные имена.

Форум использует `discussions/thread.html`, `discussions/new.html` и
`community/{styles,scripts,records}`. Кабинет использует `workspace/editor.html`
и `desk/{styles,scripts,records}`. Сохранение работает в браузере: аккаунтов,
доступа к серверу, общей многопользовательской базы и удалённой публикации нет.
Список `files.list` используется для проверки загрузки и удаляется до раздачи.

У обеих 503 сохранены уникальный код при каждом открытии, пятиминутный отсчёт,
автоматическое и ручное обновление. Добавлено копирование кода с запасным
вариантом ручного выделения. IP запрашивается через ipify только с
`--no-randomize`; в обычном режиме внешний запрос отключён, как у донора.
ID и IP меняют видимый текст, а не исходный HTML. Число 503 — содержимое
статической страницы; HTTP-статус задаётся сохранённой конфигурацией сервера.

```bash
selfsteal template          # интерактивный выбор с превью и бэкапом текущего
```

### 🛡️ Антифингерпринт-уникализация (v2.8.0+)

При установке/смене страницы варьируются заголовок, описание, имя сайта в
метаданных и логотипе, Open Graph, палитра CSS, цвета собственной иконки, токен
версии документа и версии ссылок на CSS/JS/SVG. Все HTML-страницы и манифест
обновляются согласованно. Светлый/тёмный режим и контраст сохраняются. Общий фильтр
`hue-rotate`, одинаковая генерируемая иконка, шумовые комментарии и запрос
`/_s/ip` не добавляются. С `--no-randomize` остаётся авторский HTML без мутации.
Рандомизация не выполняется на каждый просмотр или перезапуск сервиса.

Сценарий установки, вопросы, команды, флаги, порядок методов скачивания и
конфигурации Caddy/Nginx сохранены. Меняется только техническая загрузка ресурсов:
методы получают полный набор файлов, включая вложенные пути, и проверяют состав.
API понимает форматированный JSON. Сохраняется исправление Git-метода:
переход обратно в каталог сайта перед удалением временного checkout.
`install` запускает установку и спрашивает домен; `template` меняет страницу
существующей установки и не заменяет установленный `/usr/local/bin/selfsteal`.
Случайный выбор допускает повторы; `--template N` задаёт конкретный номер.

Новые страницы тоже публичны и могут сопоставляться с этим форком. Замена
HTML не гарантирует нераспознаваемость; измерений работы ТСПУ не проводилось.
Серверное HTTP/TLS-поведение намеренно не менялось.

## 🔧 Конфигурация Xray Reality

### Nginx с Unix socket (рекомендуется)

```json
{
    "inbounds": [{
        "tag": "VLESS_REALITY_NGINX_SOCKET",
        "port": 443,
        "protocol": "vless",
        "settings": { "clients": [], "decryption": "none" },
        "sniffing": { "enabled": true, "destOverride": ["http", "tls", "quic"] },
        "streamSettings": {
            "network": "raw",
            "security": "reality",
            "realitySettings": {
                "show": false,
                "xver": 1,
                "target": "/dev/shm/nginx.sock",
                "spiderX": "/",
                "shortIds": [""],
                "privateKey": "#REPLACE_WITH_YOUR_PRIVATE_KEY",
                "serverNames": ["reality.example.com"]
            }
        }
    }]
}
```

### Caddy или Nginx с TCP-портом

Отличие одно: `"target": "127.0.0.1:9443"` вместо пути к сокету.

| Параметр | Значение |
|---|---|
| `target` | `/dev/shm/nginx.sock` (socket) или `127.0.0.1:9443` (TCP) |
| `xver` | Всегда `1` (proxy_protocol v1) |
| `serverNames` | Домен, указанный при установке |
| `privateKey` / `shortIds` | Ваши ключи Reality |

> ⚠️ При добавлении хоста в панели принудительно укажите **SNI** и **Host** такими же, как в `serverNames`.

<img width="438" alt="Настройки хоста в панели" src="https://github.com/user-attachments/assets/57f00a62-1cad-4225-825c-23ed6a779744" />

## 🐳 Unix socket + Xray в Docker

Socket создаётся в `/dev/shm/nginx.sock`; Docker-контейнер Xray (например, remnanode) имеет **изолированный** `/dev/shm` и не видит его. При установке скрипт **сам находит** контейнеры `remnanode`/`xray`/`marzban` и предлагает автоматически добавить volume. Вручную:

```yaml
services:
  remnanode:
    volumes:
      - /dev/shm:/dev/shm   # ← добавить
```

```bash
cd /opt/remnanode && docker compose down && docker compose up -d
docker exec remnanode ls -la /dev/shm/nginx.sock   # проверка
```

## 🛠 Устранение неполадок

<details>
<summary><b>Caddy «застрял» на self-signed / старом сертификате</b></summary>

```bash
selfsteal reissue-cert        # интерактивно
selfsteal reissue-cert -f     # без подтверждения
```

Останавливает Caddy, **бэкапит** текущий сертификат, чистит `/data/caddy/certificates` и запускает Caddy заново — тот запрашивает свежий сертификат (ACME HTTP-01 на :80). Скрипт ждёт до 90 с и проверяет, что выдан публично доверенный сертификат; при неудаче (закрыт :80, кривой DNS, лимиты CA) **автоматически восстанавливает прежний**, чтобы маскировка не осталась без TLS.

> ⚠️ Let's Encrypt лимитирует дубликаты (~5/неделю на домен) — используйте для восстановления, не по расписанию.

</details>

<details>
<summary><b>Контейнер не стартует / образ не тянется</b></summary>

```bash
selfsteal logs
docker logs caddy-selfsteal 2>&1 | tail -30
ss -tlnp | grep ':80\|:9443'      # порты свободны?
```

С v2.9.0 при недоступном Docker Hub образы автоматически тянутся через зеркала — если и они недоступны, проверьте сетевую связность/registry-mirrors.

</details>

<details>
<summary><b>SSL не выдаётся / сайт не отображается</b></summary>

```bash
dig your-domain.com A             # DNS указывает на сервер?
ls -la /opt/nginx-selfsteal/html/ # файлы шаблона на месте?
selfsteal status                  # статус + проверка сертификата
```

Строка `SSL:` в шапке главного меню сразу показывает, выдан ли сертификат на используемый домен, доверенный ли он (не self-signed) и сколько дней осталось; подробности — в `status`, лечение — `renew-ssl` / `reissue-cert`.

Для Nginx ACME нужен свободный порт из ряда 8443+ (или задайте `--acme-port`); порт нужен только на время выпуска/обновления.

До v2.10.1 email ACME-аккаунта собирался из `hostname -f`, из-за чего на типовом VPS получалось `user35123@debian.debian` — Let's Encrypt такой контакт отклоняет (*contact email has invalid domain*), а скрипт затем перебирал резервные порты и выдавал это за проблему с портами. С v2.10.1 контактом становится `admin@<ваш-домен>`, а уже сохранённый битый аккаунт чинится автоматически. Ручное лечение на старых версиях:

```bash
rm -rf ~/.acme.sh/ca/acme-v02.api.letsencrypt.org
~/.acme.sh/acme.sh --register-account -m you@example.com
```

</details>

**Файлы:** `/opt/caddy/` или `/opt/nginx-selfsteal/` (docker-compose.yml, Caddyfile/nginx.conf, `.env`, `html/`, `logs/`) · CLI: `/usr/local/bin/selfsteal`. Логи ротируются (лимит 50 МБ, очистка из меню). `.env` и конфиги содержат домен и настройки TLS — берегите их.

---

<div align="center">

**Ресурсы:** [Reality (XTLS)](https://github.com/XTLS/REALITY) · [Caddy](https://caddyserver.com/docs/) · [шаблоны сайтов](https://github.com/DigneZzZ/remnawave-scripts/tree/main/sni-templates)

[Сообщить об ошибке](https://github.com/DigneZzZ/remnawave-scripts/issues) · [Сообщество gig.ovh](https://gig.ovh) · Автор: **DigneZzZ** · [MIT License](./LICENSE)

</div>
