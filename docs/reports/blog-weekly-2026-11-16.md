# Блоги praxenai.com и praxenai.ge: неделя 9–15 ноября 2026

Отчёт от 16.11.2026. Источники: git (ветка main), даты статей в `lib/intl-blog.ts` и `lib/ge-blog.ts`, календари `docs/blog-com/CALENDAR-2026-11.md` и `docs/blog-ge/CALENDAR-2026-11.md`. Все ссылки ниже 16.11 открываются (ответ 200).

## 1. Что вышло, план и факт

**praxenai.com: 5 новых статей за 7 дней** (по плану одна в день):
- 9 ноября: [ChatGPT for business](https://praxenai.com/blog/chatgpt-for-business) (в плане было 8 ноября), [Copilot training for staff](https://praxenai.com/blog/copilot-training-for-staff)
- 10 ноября: [GDPR and AI](https://praxenai.com/blog/gdpr-and-ai)
- 11 ноября: [AI for construction firms](https://praxenai.com/blog/ai-for-construction)
- 15 ноября: [AI email assistant](https://praxenai.com/blog/ai-email-assistant)
- Обновлены: [WhatsApp Business API](https://praxenai.com/blog/whatsapp-business-api) (11.11, новые цены Meta), [AI receptionist cost UK](https://praxenai.com/blog/ai-receptionist-cost-uk) (12.11, по плану), [AI for recruitment agencies](https://praxenai.com/blog/ai-for-recruitment-agencies) (12.11, вне плана: новые правила UK GDPR).
- 12–14 ноября новых статей не было. [HubSpot AI](https://praxenai.com/blog/hubspot-ai) (в плане 14.11) вышла 16.11. Intelligent document processing (в плане 15.11) не вышла. Отставание от календаря: 1 статья плюс сегодняшняя по плану.

**praxenai.ge: 2 новые статьи и 1 обновление из 6 пунктов плана** (план начинается 10 ноября):
- 10 ноября: [Нейросети для бизнеса](https://praxenai.ge/ru/blog/ai-tools-for-business)
- 11 ноября: обновлена [WhatsApp и Telegram чат-бот](https://praxenai.ge/ru/blog/whatsapp-telegram-ai-chatbot) (доступ к WhatsApp Business API, цены Meta)
- 12 ноября: [ИИ-агент](https://praxenai.ge/ru/blog/what-is-ai-agent)
- Не вышли статьи на 13, 14 и 15 ноября: подключение мессенджеров к amoCRM и Битрикс24, автоматизация бизнеса с ИИ, ИИ-сотрудник. Отставание: 3 статьи плюс сегодняшняя «Речевая аналитика».

## 2. Цифры из поиска

Цифр нет. В этом окружении нет доступа ни к одной системе:
- Google Search Console: в `.claude/skills/google-search/config/` нет ключей (OAuth-клиент и токен не выданы).
- Яндекс Вебмастер и Метрика: нет токенов `YANDEX_WEBMASTER_TOKEN` и `YANDEX_METRIKA_TOKEN`.
- Bing Webmaster: нет `BING_API_KEY`.
Показы, клики и позиции блогов за неделю не приводим.

## 3. Вывод и действие

**Вывод.** Статьи выходят, но медленнее плана «одна в день»: на .com 5 новых за 7 дней, на .ge 2 из 5 запланированных. Работают ли статьи, сказать нельзя: нет доступа к Search Console и Вебмастеру.

**Что сделать на этой неделе.** Владельцу — вернуть доступ к поиску. Search Console: заново пройти вход по ссылке из навыка `google-search` (инструкция в `.claude/skills/google-search/config/README.md`, около 10 минут). Яндекс Вебмастер: выдать токен по инструкции `.claude/skills/yandex-webmaster/config/README.md`. Тогда в следующий понедельник в отчёте будут показы, клики и позиции по каждой статье. Чтобы цифры не попали в открытые логи, отчёт собираем в шифрованном виде.
