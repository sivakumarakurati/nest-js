const axios = require('axios');
const fs = require('fs'); // Import the fs module
async function makeGraphqlPostRequest() {
  const apiUrl = 'https://shoppersstop.api.fluentretail.com/graphql'
  const config = {
    method: 'post',
    headers: {
      Authorization: "bearer " + "mAQj3DQr53VAbg885dvpSZNqa-g",
    }
  }
  const ids = ["7166448","203460498","6521124","206319261","203511673","6909736"];
  const results = [];
  for (const id of ids) {
    const graphqlQuery = queryFunction(id)
    {
      try {
        const response = await axios.post(apiUrl, { query: graphqlQuery }, config);
        results.push(response.data);
        console.log("processing... ", id)
        /* for (const edgeData of virtualPositionRes.data.virtualPositions.edges) {
          const productRef = edgeData.node.productRef;
          const locationRef = edgeData.node.groupRef;
          const quantity = edgeData.node.quantity;
          const graphqlQuery1 = queryFunction1(locationRef);
          const response1 = await axios.post(apiUrl, { query: graphqlQuery1 }, config);
          const locationRes = response1.data
          const locationStatus = locationRes.data.location.status;
          if (quantity >= 1 && locationStatus == 'ACTIVE') {
            console.log(productRef + " :: " + locationRef + "(" + locationStatus + ") = " + quantity);
            break;
          }
        } */
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
      virtualPositions(first: 100, productRef: "${id}") {
            edges {
              node {
                productRef
                groupRef
                quantity
                status
              }
            }
          }
      }
      `
  return graphqlQuery;
}
function queryFunction1(id) {
  const graphqlQuery = `
  query{
    location(ref: "${id}") {
        primaryAddress {
            id
        }
        ref
        status
    }
}
      `
  return graphqlQuery;
}
makeGraphqlPostRequest();