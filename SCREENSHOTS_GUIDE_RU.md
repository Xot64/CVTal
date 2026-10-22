# CVTal v0.8 — инструкция по изображениям

## Куда класть скриншоты

Скриншоты промышленных проектов помещайте в папки:

- `assets/screenshots/khimki/` — бизнес-центр в Химках
- `assets/screenshots/kulikovo/` — музей «Куликово поле»
- `assets/screenshots/smartgrid/` — стенд SmartGrid
- `assets/screenshots/gres/` — ГРЭС, Kinco

Можно использовать JPG, PNG или WebP. Названия файлов лучше писать латиницей без пробелов, например `main-screen.png`, `ventilation.jpg`, `alarms.webp`.

## Куда вписывать названия

Откройте `data/industrial-projects.json`. Найдите объект по полю `id` и заполните массив `screenshots`.

Пример для Химок:

```json
"screenshots": [
  "assets/screenshots/khimki/main-screen.png",
  "assets/screenshots/khimki/ventilation.jpg",
  "assets/screenshots/khimki/heating.png"
]
```

Это **относительные пути от корня сайта**, не от JSON-файла. Порядок в массиве задаёт порядок изображений в галерее. Если массив пуст, кнопка «Скриншоты» скрыта.

## Как задать обложку карточки

В том же объекте замените поле:

```json
"image": "assets/screenshots/khimki/main-screen.png"
```

Можно использовать одно изображение одновременно и для обложки, и для галереи. Пока не заменили `image`, используется нейтральная заглушка.

## Остальные разделы

- Игры: `data/projects.json`
- Музейные интерактивные экспонаты: `data/museum-projects.json`
- Промышленная автоматизация: `data/industrial-projects.json`

Везде действует поле `screenshots` с массивом путей и `image` для обложки.

## Видео

Если есть публичный URL видео, впишите его в `video`, например `"video": "https://example.com/video"`. При пустой строке кнопка просмотра видео скрыта.

## Публикация

Загрузите **содержимое** архива в корень репозитория `CVTal` с сохранением папок и имён. При обновлении файлов из архива не удаляйте дополнительные файлы изображений и видео, которые уже лежат в вашем репозитории.

Для локального просмотра запускайте простой HTTP-сервер из корня проекта (`python -m http.server 8000`), поскольку JSON загружается через fetch.

## Новые игры v0.9

Папки `assets/screenshots/phasmaslotia/`, `assets/screenshots/monster/`, `assets/screenshots/sea-turtles/` созданы. Для каждой игры найдите соответствующий `id` в `data/projects.json` и заполните `screenshots` путями от корня сайта. Поле `image` отвечает за обложку. Для Phasmaslotia и My Little Monster использованы уже существовавшие `Fasma.png` и `Monster.png`; для черепашек создана временная SVG-обложка.
