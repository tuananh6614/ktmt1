cd C:\xampp\htdocs\epulearn\web_backend
pm2 start app.js --name "epulearn-api"
pm2 restart app.js --name "epulearn-api"

pm2 stop all
pm2 delete all
