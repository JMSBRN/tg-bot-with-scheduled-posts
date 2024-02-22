```
https://api.telegram.org/bot{my_bot_token}/setWebhook?url={url_to_send_updates_to}
```
// delete without params
```
https://api.telegram.org/bot{my_bot_token}/getWebhookInfo
```

cron help: 
```
const cronVariants = [
    { cronTime: '0 0 1 1 *', description: 'Midnight on January 1st every year' },
    { cronTime: '0 0 1 * *', description: 'Midnight on the 1st of every month' },
    { cronTime: '0 0 * * *', description: 'Midnight every day' },
    { cronTime: '0 9 * * 1-5', description: '9:00 AM every working day (Monday to Friday)' },
    { cronTime: '0 12 * * 1-5', description: 'Noon every working day (Monday to Friday)' },
    { cronTime: '0 0 * * 0', description: 'Midnight every Sunday' },
    { cronTime: '0 0 * * 6', description: 'Midnight every Saturday' },
    { cronTime: '0 0 15 * *', description: 'Midnight on the 15th of every month' }
    // Add more variants as needed
];
```

```
const cronVariants = [
    { cronTime: '0 0 1 1 *', description: 'Midnight on January 1st every year' },
    { cronTime: '0 0 1 * *', description: 'Midnight on the 1st of every month' },
    { cronTime: '0 0 * * *', description: 'Midnight every day' },
    { cronTime: '0 9 * * 1-5', description: '9:00 AM every working day (Monday to Friday)' },
    { cronTime: '0 12 * * 1-5', description: 'Noon every working day (Monday to Friday)' },
    { cronTime: '0 * * * *', description: 'Every hour' },
    { cronTime: '* 0 * * * *', description: 'Every minute' },
    { cronTime: '* * * * * *', description: 'Every second' }
    // Add more variants as needed
];
```
