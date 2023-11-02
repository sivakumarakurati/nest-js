const axios = require('axios');
const fs = require('fs'); // Import the fs module
async function makeGraphqlPostRequest() {
    const apiUrl = 'https://shoppersstop.api.fluentretail.com/graphql'
    const config = {
        method: 'post',
        headers: {
            Authorization: "bearer " + "GK-yCkeOAN3R4iPCnKlxm_tXnWc",
        }
    }
    const ids = [];
    const results = [];
    for (const id of ids) {
        const graphqlQuery = queryFunction(id)
        {
            try {
                const response = await axios.post(apiUrl, { query: graphqlQuery }, config);
                const fulfilmentRes = response.data
                // console.log(JSON.stringify(fulfilmentRes));
                // const waveFulfilmentObject = { "items": [] };
                for (const edgeData of fulfilmentRes.data.waveById.fulfilments.edges) {                    
                        
                    console.log(fulfilmentRes.data.waveById.id, ",", edgeData.node.ref, ",", edgeData.node.id, ",", edgeData.node.fromLocation.ref, ",", edgeData.node.status); 

                    if (edgeData.node.status === 'AWAITING_COURIER_COLLECTION') {
                        var ManifestGenerateEligiblePicked = edgeData.node.attributes.find(attribute => attribute.name === 'ManifestGenerateEligible');
                        if (ManifestGenerateEligiblePicked == undefined) {
                            const graphqlQuery = updateFunction(edgeData.node.id)
                            {
                                try {
                                    const response = await axios.post(apiUrl, { query: graphqlQuery }, config);
                                    console.log(JSON.stringify(response.data));                
                                } catch (error) {
                                    console.error('Error:', error?.response ? JSON.stringify(error.response.data) : JSON.stringify(error.message));
                                }
                    
                            }
                            // waveFulfilmentObject.waveId = fulfilmentRes.data.waveById.id;
                            // waveFulfilmentObject.fulfilmentRef = edgeData.node.ref;
                            // waveFulfilmentObject.items.push(edgeData.node.attributes);
                        }
                    }
                }
                // const fileName = `fulfillmentsByWaveId.json`;
                // await new Promise(resolve => setTimeout(resolve, 1000));
                // await fs.promises.appendFile(fileName, JSON.stringify(waveFulfilmentObject) + '\n');
            } catch (error) {
                console.error('Error:', error.response ? error.response.data : error.message);
            }

        }
    }
}
function queryFunction(id) {
    const graphqlQuery = `
    query  {
        waveById(id: "${id}") {
            id
            fulfilments {
                edges {
                    node {
                        id
                        ref
                        fromLocation {
                            ref
                        }
                        attributes {
                            name
                            value
                        }
                        status
                    }
                }
            }
        }
    }`
    return graphqlQuery;
}
function updateFunction(id) {
    return graphqlQuery = `
  mutation updaeFulfilment{
      updateFulfilment(input:{
           id:"${id}",
           attributes:[{name:"ManifestGenerateEligible",
           value:"true",
           type:"STRING"
           }]
       }){
           id
       }
   }`
}
makeGraphqlPostRequest();