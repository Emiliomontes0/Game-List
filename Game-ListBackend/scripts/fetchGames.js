const axios = require('axios');
const { Game } = require('../models'); 


const fetchAllApps = async (limit = 100) => {
    try {
      const response = await axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/');
      const apps = response.data.applist.apps;
      const filteredApps = apps.filter((app) => app.name && app.name.trim() !== '');
      const testApps = filteredApps.slice(0, limit); 
      console.log(`Total apps being processed: ${testApps.length}`);
      return testApps;
    } catch (error) {
      console.error('Error fetching app list:', error.message);
      return [];
    }
  };
  


  const fetchGameDetails = async (appId, retries = 3) => {
    try {
      const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
      const gameData = response.data[appId];
  
      if (gameData.success) {
        const details = gameData.data;
        console.log(`Raw Data for App ID ${appId}:`, JSON.stringify(gameData, null, 2));
        if (details.type === 'demo') {
          console.log(`Skipping demo: ${details.name}`);
          return null;
        }
  
        if (details.type === 'dlc' || details.type === 'music') {
          console.log(`Skipping DLC or content pack: ${details.name}`);
          return null;
        }
  
        const price = details.price_overview;
  
        if (price && price.final === 0) {
          console.log(`Skipping free game: ${details.name}`);
          return null;
        }
  
        const finalPrice = price ? price.final / 100 : null;
        const currency = price ? price.currency : 'USD';
        const discount = price ? price.discount_percent : 0;
  
        // Check for sale duration (hypothetical sale_end_time field)
        const saleEndTime = details.sale_end_time || null; // Replace with actual field if it exists
        let saleEndDate = null;
  
        if (saleEndTime) {
          saleEndDate = new Date(saleEndTime * 1000); // Convert UNIX timestamp to date
          console.log(`Sale for ${details.name} ends on: ${saleEndDate}`);
        } else {
          console.log(`No sale duration found for ${details.name}`);
        }
  
        return {
          app_id: appId,
          name: details.name,
          price: finalPrice,
          currency: currency,
          discount: discount,
          store_link: `https://store.steampowered.com/app/${appId}`,
          sale_end_date: saleEndDate, // Include sale end date in the return object
        };
      } else {
        return null;
      }
    } catch (error) {
      if (error.response && error.response.status === 429 && retries > 0) {
        console.log(`Rate limit hit for App ID ${appId}. Retrying in 10 seconds... (Retries left: ${retries - 1})`);
        await new Promise((resolve) => setTimeout(resolve, 10000));
        return fetchGameDetails(appId, retries - 1);
      }
  
      console.error(`Error fetching details for App ID ${appId}:`, error.message);
      return null;
    }
  };
  
  fetchGameDetails(837470).then((result) => {
    console.log('Game Details:', result);
  });
  
const populateGames = async () => {
    try {
      console.log(`Starting script at ${new Date().toLocaleTimeString()}`);
  
      const allApps = await fetchAllApps(100); 
      let count = 0;
  
      for (const app of allApps) {
        const gameDetails = await fetchGameDetails(app.appid);
  
        if (gameDetails) {
          await Game.upsert(gameDetails);
          console.log(`Added/Updated: ${gameDetails.name}`);
          count++;
          await new Promise((resolve) => setTimeout(resolve, 500)); 
        }
      }
  
      console.log(`Total games added/updated: ${count}`);
      console.log(`Script completed at ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      console.error('Error populating games:', error.message);
    }
  };
  
populateGames();
