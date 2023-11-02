const axios = require('axios');
const fs = require('fs'); // Import the fs module
async function makeGraphqlPostRequest() {
    const apiUrl = 'https://shoppersstop.api.fluentretail.com/graphql'
    const config = {
        method: 'post',
        headers: {
            Authorization: "bearer " + "21NMH2HfVCcJd07VJSAo1miaajY",
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

                const inventoryQtyRefObject = { "items": [] };

                for (const edgeData of fulfilmentRes.data.fulfilments.edges) {
                    inventoryQtyRefObject.locationRef = edgeData.node.fromLocation.ref;
                    inventoryQtyRefObject.fulfilmentRef = edgeData.node.ref;
                    for (const itemEdgeData of edgeData.node.items.edges) {
                        const nodeItem = {};
                        nodeItem.catalogueRef = "DEFAULT:1";
                        nodeItem.positionRef = itemEdgeData.node.ref + ":" + edgeData.node.fromLocation.ref + ":DEFAULT";
                        nodeItem.RESERVED = itemEdgeData.node.ref + ":" + edgeData.node.fromLocation.ref + ":DEFAULT:RESERVED:" + edgeData.node.id;
                        if (itemEdgeData.node.rejectedQuantity != 0) {
                            nodeItem.CORRECTION = itemEdgeData.node.ref + ":" + edgeData.node.fromLocation.ref + ":DEFAULT:CORRECTION:" + edgeData.node.id;
                        }
                        if (itemEdgeData.node.filledQuantity != 0) {
                            nodeItem.SALE = itemEdgeData.node.ref + ":" + edgeData.node.fromLocation.ref + ":DEFAULT:SALE:" + edgeData.node.id;
                        }
                        inventoryQtyRefObject.items.push(nodeItem);
                    }
                }

                const inventoryFulfilmentObject = { "items": [] };
                for (const inventoryItem of inventoryQtyRefObject.items) {
                    const fulfilment = {};
                    fulfilment.locationRef = inventoryQtyRefObject.locationRef;
                    fulfilment.ref = inventoryQtyRefObject.fulfilmentRef;
                    const saleGql = await axios.post(apiUrl, { query: queryFunction1(inventoryItem.positionRef, inventoryItem.catalogueRef, inventoryItem.SALE) }, config);
                    const correctionGql = await axios.post(apiUrl, { query: queryFunction1(inventoryItem.positionRef, inventoryItem.catalogueRef, inventoryItem.CORRECTION) }, config);
                    const reservedGql = await axios.post(apiUrl, { query: queryFunction1(inventoryItem.positionRef, inventoryItem.catalogueRef, inventoryItem.RESERVED) }, config);
                    fulfilment.sale = saleGql.data;
                    fulfilment.correction = correctionGql.data;
                    fulfilment.reserve = reservedGql.data;
                    inventoryFulfilmentObject.items.push(fulfilment);
                }

                console.log("processing... ", id);
                const fileName = `confirm-inventory.json`;
                await new Promise(resolve => setTimeout(resolve, 1000));
                await fs.promises.appendFile(fileName, JSON.stringify(inventoryFulfilmentObject) + '\n');

            } catch (error) {
                console.error('Error:', error.response ? error.response.data : error.message);
            }

        }
    }
}
function queryFunction(id) {
    const graphqlQuery = `
    query{
        fulfilments(ref : ["${id}"]){
            edges{
                node{
                    id
                    ref
                    status
                    items{
                        edges{
                            node{
                                ref
                                filledQuantity
                                rejectedQuantity
                                requestedQuantity
                            }
                        }
                    }
                    fromLocation {
                        ref
                    }
                }
            }
        }
    }`
    return graphqlQuery;
}
function queryFunction1(positionRef, catalogueRef, quantityRef) {
    const graphqlQuery = `
    query  {
      inventoryPositions(ref: "${positionRef}", catalogue: {ref: "${catalogueRef}"}) {
          edges {
              node {
                  quantities(ref: "${quantityRef}") {
                      edges {
                          node {
                              ref
                              status
                          }
                      }
                  }
              }
          }
      }
    } `
    return graphqlQuery;
}
makeGraphqlPostRequest();