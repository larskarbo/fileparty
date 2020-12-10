
```
stripe trigger checkout.session.completed
stripe events resend evt_1HoZa1AtEfCrIWZM8jjB7Ni0
```

```
stripe listen --forward-to localhost:8888/.netlify/functions/money/webhook
```

make sure to update WEBHOOK_SECRET (but often it's the same)