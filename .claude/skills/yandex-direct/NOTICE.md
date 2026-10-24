# Атрибуция

Скилл `yandex-direct` — производная работа, адаптированная под проект WinWinBot
из открытого скилла **`yandex-direct-campaign-builder`**.

- **Источник:** репозиторий `awaik/direct-mcp-ai-project`
  (https://github.com/awaik/direct-mcp-ai-project)
- **Автор оригинала:** © 2025 Aleksei Savinykh
- **Лицензия оригинала:** MIT

## Что изменено при адаптации

- Исполнение отвязано от платного **LidFly MCP v3**; вместо него — три пути:
  Директ Коммандер (XLSX-импорт), ручная сборка в кабинете через headed-браузер,
  опционально свой Direct MCP на собственном OAuth.
- Подставлен контекст WinWinBot: продукт, кластеры ядра (гипотезы под проверку
  Wordstat), минус-слова, оффер и ограничения, регион 225, лендинг `winwinbot.ru` —
  в `references/WINWINBOT_CONTEXT.md`.
- Добавлен обязательный маршрут текстов объявлений: черновик → вычитка →
  проверка по 38-ФЗ «О рекламе» до модерации.
- Сохранены ключевые гардрейлы оригинала (read-before-write, план+подтверждение,
  бюджет в рублях, «не выдумывать данные») и браузерный контур безопасности.

## Текст лицензии MIT (оригинала)

```
MIT License

Copyright (c) 2025 Aleksei Savinykh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Перенос в Praxen AI

24 октября 2026 года скилл перенесён из репозитория WinWinBot в Praxen AI: контекст WinWinBot заменён на `references/PRAXEN_CONTEXT.md`, правила текстов — на закон о рекламе страны показа, учёт результата — через UTM и amoCRM.
