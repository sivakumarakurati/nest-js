const axios = require('axios');
const fs = require('fs'); // Import the fs module
async function makeGraphqlPostRequest() {
  const apiUrl = 'https://shoppersstop.api.fluentretail.com/graphql'
  const config = {
    method: 'post',
    headers: {
      Authorization: "bearer " + "ueVJjvyiDeVVXul94GsdqrNtNRQ",
    }
  }
  const ids = ["EL-PR2H40", "EL-PMWE010", "FREL-G34H02", "FREL-GXCT01", "FREL-PN0L15", "FREL-WPF101", "FREL-PR2H01", "FREL-PR2J01", "FREL-PTLH01", "EL-PMWE010", "FRCL-KTJM01", "FRCL-KTJM02", "FRCL-KTJM03", "FRCL-KTJM05", "FRCL-KTJM06", "FRCL-KTJM07", "MAC-MCIN88", "MAC-MCIN86", "MAC-MCIN87", "MAC-MCIN80", "MAC-MCIN77", "BB-BBIN22", "BB-BBIN23"];
  const results = [];
  for (const id of ids) {
    const graphqlQuery = queryFunction(id)
    {
      try {
        const response = await axios.post(apiUrl, { query: graphqlQuery }, config);
        results.push(response.data);
        console.log("processing... ", id)
        // console.log(response?.data)
        const fileName = `product-inventory.json`;
        await new Promise(resolve => setTimeout(resolve, 1000));
        await fs.promises.appendFile(fileName, JSON.stringify(response.data) + '\n');
      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
      }

    }
    const fileName = `standardProducts.json`;
    await fs.promises.writeFile(fileName, JSON.stringify(results, null, 2));
  }
}
function queryFunction(id) {
  const graphqlQuery = `
    query {
        inventoryCatalogue(ref: "DEFAULT:1") {
          ref
          inventoryPositions(productRef: "${id}") {
            edges {
              node {
                id
                ref
                type
                status
                onHand
              }
            }
          }
        }
      }
      `
  return graphqlQuery;
}
makeGraphqlPostRequest();