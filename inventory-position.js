const axios = require('axios');
const fs = require('fs'); // Import the fs module
async function makeGraphqlPostRequest() {
    const apiUrl = 'https://shoppersstop.api.fluentretail.com/graphql'
    const config = {
        method: 'post',
        headers: {
            Authorization: "bearer " + "zAfBQKPExWmlNibbSFU_7ZwWOvw",
        }
    }
    const ids = ["EL-PKTJ02", "EL-PKTJ10", "EL-PKTJ12", "EL-PKTJ36", "EL-PKTJ39", "EL-PLT202", "EL-PLT203", "EL-PLT204", "EL-PLT205", "EL-PLT206", "EL-PLT207", "EL-PMC701", "EL-PMG501", "EL-PMWC01", "EL-PMWC03", "EL-PMWC06", "EL-PMXX01", "EL-PMY401", "EL-PN0L05", "EL-PN0L06", "EL-PN0L10", "EL-PN0L11", "EL-PN0L12", "EL-PN0L13", "EL-PYL501", "EL-R8RA01"];
    const results = [];
    for (const id of ids) {
        const graphqlQuery = queryFunction(id)
        {
            try {
                const response = await axios.post(apiUrl, { query: graphqlQuery }, config);
                results.push(response.data);
                console.log("processing... ", id)
                // console.log(response?.data)
                const fileName = `InventoryPositions.json`;
                await fs.promises.appendFile(fileName, JSON.stringify(response.data) + '\n');
            } catch (error) {
                console.error('Error:', error.response ? error.response.data : error.message);
            }

        }
        const fileName = `InventoryPositions.json`;
        await fs.promises.writeFile(fileName, JSON.stringify(results, null, 2));
    }
}
function queryFunction(id) {
    const graphqlQuery = `
    query {
        virtualPositions(productRef: "${id}", groupRef: 901, first: 1000) {
            edges {
                node {
                    productRef
                    groupRef
                    quantity
                }
            }
        }
    }
      `
    return graphqlQuery;
}
makeGraphqlPostRequest();