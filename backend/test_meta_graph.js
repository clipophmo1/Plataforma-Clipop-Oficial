const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const token = process.env.META_ACCESS_TOKEN;

async function checkMetaGraph() {
  console.log('--- 1. Testing Page Access Token (/me) ---');
  try {
    const resMe = await fetch(`https://graph.facebook.com/v21.0/me?access_token=${token}`);
    const meData = await resMe.json();
    console.log('Page Data:', meData);
  } catch (err) {
    console.error('Error /me:', err.message);
  }

  console.log('\n--- 2. Checking Subscribed Apps (/me/subscribed_apps) ---');
  try {
    const resSub = await fetch(`https://graph.facebook.com/v21.0/me/subscribed_apps?access_token=${token}`);
    const subData = await resSub.json();
    console.log('Subscribed Apps:', subData);
  } catch (err) {
    console.error('Error /subscribed_apps:', err.message);
  }

  console.log('\n--- 3. Ensuring Page is Subscribed to messages and messaging_postbacks ---');
  try {
    const resPostSub = await fetch(`https://graph.facebook.com/v21.0/me/subscribed_apps?subscribed_fields=messages,messaging_postbacks&access_token=${token}`, {
      method: 'POST'
    });
    const postSubData = await resPostSub.json();
    console.log('Subscription Result:', postSubData);
  } catch (err) {
    console.error('Error subscribing:', err.message);
  }

  console.log('\n--- 4. Checking Page Conversations to get Real User PSID ---');
  try {
    const resConv = await fetch(`https://graph.facebook.com/v21.0/me/conversations?fields=id,snippet,updated_time,participants,messages{id,message,from,created_time}&access_token=${token}`);
    const convData = await resConv.json();
    console.log('Conversations:', JSON.stringify(convData, null, 2));
  } catch (err) {
    console.error('Error conversations:', err.message);
  }
}

checkMetaGraph();
