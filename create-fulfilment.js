const axios = require('axios');
const fs = require('fs'); // Import the fs module
async function makeGraphqlPostRequest() {
    const apiUrl = 'https://shoppersstop.api.fluentretail.com/graphql'
    const config = {
        method: 'post',
        headers: {
            Authorization: "bearer " + "hUyGLL5O8NaBB4OGwH4iRDkcXyI",
        }
    }
    const ids = ["203251730", "203251734", "203251733", "9749294", "9749295", "FA0CLBR34078", "FA0CLBR34252", "FA0CLBR34313", "FA0CLBR34184", "FA0CLBR34061", "FA0CLBR34245", "FA0CLBR34306", "FA0CLBR34177", "FA0CLBR34238", "FA0CLBR34290", "FA0CLBR34221", "FA0CLBR34276", "FA0CLBR34153", "FA0CLBR34214", "FA0CLBR34016", "FA0CLBR34191", "203438524", "203438522", "201748986", "201748984", "202726001", "202726000", "A21FACES18691", "A21FACES18752", "A21FACES18684", "A21FACES18745", "A21FACES18738", "A21FACES18653", "A21FACES18646", "A21FACES18721", "200487543", "205569909", "205569900", "205569908", "205569907", "205569906", "205569911", "205569903", "205569910", "205569902", "FA0LRL5800194", "FA0LRL5800279", "FA0LRL5800224", "FA0LRL5800231", "FA0LRL5800217", "201573712", "201573718", "201573717", "S23LKM030964527", "S23LKM030964596", "S23LKM030964572", "S23LKM030964589", "S23LKM030964541", "S23LKM030964565", "205580681", "205580677", "205580671", "205580680", "200587674", "205580678", "203179962", "203179967", "206809548", "6528774", "205580672", "205580674", "206809542", "206809541", "206809546", "206809545", "206809538", "206809544", "206809537", "206809543"];
    const results = [];
    for (const id of ids) {
        const graphqlQuery = queryFunction(id)
        {
            try {
                const response = await axios.post(apiUrl, { query: graphqlQuery }, config);
                results.push(response.data);
                console.log("processing... ", id)
                const virtualPositions = response.data
                for (const edgeData of virtualPositions.data.edges) {
                    const productRef = edgeData.node.productRef;
                    const locationRef = edgeData.node.groupRef;
                    const quantity = edgeData.node.quantity;

                    if (quantity >= 1) {
                        // Create Fulfilment Of That Store
                    } else {
                        // Create Rejected Fulfilment
                    }
                }
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
      virtualPositions(status: "ACTIVE", productRef: "${id}") {
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
makeGraphqlPostRequest();