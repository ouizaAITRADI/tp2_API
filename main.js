import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const headers = {
  'X-Api-Key': process.env.RANDOMMER_API_KEY
};

async function getRandomUser() {
  const res = await axios.get('https://randomuser.me/api/');
  const user = res.data.results[0];

  return {
    name: `${user.name.first} ${user.name.last}`,
    email: user.email,
    location: `${user.location.city}, ${user.location.country}`
  };
}

async function getPhoneNumber() {
  const res = await axios.get('https://randommer.io/api/Phone/Generate', {
    headers,
    params: { countryCode: 'FR', Quantity: 1 }
  });
  return res.data[0];
}

async function getIban() {
  const res = await axios.get('https://randommer.io/api/Finance/Iban/FR', { headers });
  return res.data;
}

async function getCreditCard() {
  const res = await axios.get('https://randommer.io/api/Card', { headers });
  const card = res.data;
  return {
    type: card.type,
    date: card.date,
    fullName: card.fullName,
    cardNumber: card.cardNumber,
    cvv: card.cvv,
    pin: card.pin
  };
}

async function getDogImage() {
  const res = await axios.get('https://dog.ceo/api/breeds/image/random');
  return res.data.message;
}

async function getQuote() {
  const res = await axios.get('https://api.quotable.io/random');
  return {
    content: res.data.content,
    author: res.data.author
  };
}

async function main() {
  try {
    const user = await getRandomUser();
    const phone = await getPhoneNumber();
    const iban = await getIban();
    const card = await getCreditCard();
    const dogImage = await getDogImage();
    const quote = await getQuote();

    console.log(`Nom : ${user.name}`);
    console.log(`Email : ${user.email}`);
    console.log(`Localisation : ${user.location}`);
    console.log(`Téléphone : ${phone}`);
    console.log(`IBAN : ${iban}`);
    console.log(`Carte de crédit :`, card);
    console.log(`Animal de compagnie (image) : ${dogImage}`);
    console.log(`Citation du jour : "${quote.content}" — ${quote.author}`);
  } catch (err) {
    console.error('Erreur :', err.message);
  }
}

main();
