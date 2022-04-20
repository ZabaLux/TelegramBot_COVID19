require('dotenv').config();

const { Telegraf, Markup } = require('telegraf');
const api = require('covid19-api');
const COUNTRIES_LIST = require('./constants');
const bot = new Telegraf(process.env.COVID19BotToken);

bot.start((ctx) => ctx.reply(`
Hello ${ctx.message.from.first_name}!
Here you can check Coronovirus (COVID-19) statistic by counrty. Enter the name of the country you want to know statistics.
To view the entire list of countries enter: /help.
`, Markup.keyboard([
    ['US','Russia'],
    ['Ukrain', 'Kazakhstan'],
]).resize()
));

bot.help((ctx) => ctx.reply(COUNTRIES_LIST));

bot.on('text', async (ctx) => {
    let data = {};

    try {
    data = await api.getReportsByCountries(ctx.message.text);
    
    const formatData = `
Country: ${data[0][0].country}
Cases: ${data[0][0].cases}
Deaths: ${data[0][0].deaths}
Recovered: ${data[0][0].recovered}
    `; 
    ctx.reply(formatData);
    } catch {
        ctx.reply('Error, no country in list, check country list using /help'); 
    };
});

bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();
console.log('bot start');