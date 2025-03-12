const axios = require('axios');
const fs = require('fs'); // Import the fs module
async function makeGraphqlPostRequest() {
    const apiUrl = 'https://shoppersstop.api.fluentretail.com/graphql'
    const config = {
        method: 'post',
        headers: {
            Authorization: "bearer " + "IZHKgyI1_O0QwircWX9nFwTaJyg",
        }
    }
    const results = [];
    const graphqlQuery = queryFunction()
    {
        try {
            const response = await axios.post(apiUrl, { query: graphqlQuery }, config);
            results.push(response.data);
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }

    }
    let positions = [];
    let posEdgeNodes = results[0].data.inventoryPositions.edges;
    for (const edgeData of posEdgeNodes) {
        position = new Position();
        position.productRef = edgeData.node.productRef;
        position.locationRef = edgeData.node.locationRef;
        position.onHand = edgeData.node.onHand;
        position.catalogRef = edgeData.node.catalogue.ref;
        positions.push(position);
    }

    const fileName = `positions.json`;
    await new Promise(resolve => setTimeout(resolve, 1000));
    await fs.promises.appendFile(fileName, JSON.stringify(positions) + '\n');
}
class Position {
    productRef = '';
	locationRef = '';
	onHand = 0.0;
	catalogRef = '';
}
function queryFunction(id) {
    const graphqlQuery = `query {
    inventoryPositions(first : 1000, status: "ACTIVE") {
        edges {
            node {
                locationRef
                productRef
                onHand
                catalogue {
                    ref
                }
                status
            }
        }
    }
}
      `
    return graphqlQuery;
}
makeGraphqlPostRequest();