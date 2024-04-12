const fluentApiHost = 'https://shoppersstop.api.fluentretail.com';
const retailerId = 1;

// const fluentApiHost = 'https://sstopdev.sandbox.api.fluentretail.com';
// const retailerId = 5;

const axios = require('axios');
const fs = require('fs'); // Import the fs module
async function makeGraphqlPostRequest() {
    const apiUrl = fluentApiHost + '/graphql'
    const config = {
        method: 'post',
        headers: {
            Authorization: "bearer " + "mAQj3DQr53VAbg885dvpSZNqa-g",
        }
    }
    const ids = ["5035458","5035074","5034468","5034456","5034453","5034432","5034416","5034413","5034398"];
    for (const id of ids) {
        const graphqlQuery1 = queryFunction1(id)
        {
            const response = await axios.post(apiUrl, { query: graphqlQuery1 }, config);
            const id = response.data.data.fulfilmentById.ref;
            const status = response.data.data.fulfilmentById.status;
            console.log(id + " = " + status);
            const graphqlQuery = queryFunction(id)
            {
                try {
                    const response = await axios.post(apiUrl, { query: graphqlQuery }, config);
                    const fulfilmentRes = response.data
                    // console.log(JSON.stringify(fulfilmentRes));

                    const inventoryQtyRefObject = { "items": [] };

                    const wrapperObj = {
                        "name": "UpdateInventoryQty",
                        "retailerId": retailerId,
                        "rootEntityRef": "DEFAULT:" + retailerId,
                        "entityRef": "DEFAULT:" + retailerId,
                        "entityType": "INVENTORY_CATALOGUE",
                        "rootEntityType": "INVENTORY_CATALOGUE",
                        "entitySubtype": "DEFAULT",
                        "attributes": { "items": [] }
                    }

                    for (const edgeData of fulfilmentRes.data.fulfilments.edges) {
                        for (const itemEdgeData of edgeData.node.items.edges) {
                            const item = {}, nodeItem = {};
                            item.fulfilmentId = edgeData.node.id;
                            item.locationRef = edgeData.node.fromLocation.ref;
                            item.skuRef = itemEdgeData.node.ref;

                            nodeItem.locationRef = item.locationRef;
                            nodeItem.productRef = item.skuRef;
                            nodeItem.RESERVED = item.skuRef + ":" + item.locationRef + ":DEFAULT:RESERVED:" + item.fulfilmentId;

                            if (itemEdgeData.node.rejectedQuantity != 0) {
                                item.correctionQty = -(itemEdgeData.node.rejectedQuantity);
                                nodeItem.CORRECTION = item.skuRef + ":" + item.locationRef + ":DEFAULT:CORRECTION:" + item.fulfilmentId;
                            } else {
                                item.correctionQty = 0;
                            }

                            if (itemEdgeData.node.filledQuantity != 0) {
                                item.saleQty = -(itemEdgeData.node.filledQuantity);
                                nodeItem.SALE = item.skuRef + ":" + item.locationRef + ":DEFAULT:SALE:" + item.fulfilmentId;
                            } else {
                                item.saleQty = 0;
                            }

                            wrapperObj.attributes.items.push(item);
                            inventoryQtyRefObject.items.push(nodeItem);
                        }
                    }

                    // console.log(JSON.stringify(wrapperObj));
                    const updateInventoryResponse = await axios.post(fluentApiHost + '/api/v4.1/event/async', wrapperObj, config);
                    console.log("processing... ", id, updateInventoryResponse.status);

                    const fileName = `inventoryConfirm.json`;
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await fs.promises.appendFile(fileName, JSON.stringify(inventoryQtyRefObject) + '\n');

                } catch (error) {
                    console.error('Error:', error.response ? error.response.data : error.message);
                }

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
function queryFunction1(id) {
    const graphqlQuery = `
    query {
        fulfilmentById(id: "${id}") {
                    ref
                    status
                    createdOn
                }
    }`
    return graphqlQuery;
}
makeGraphqlPostRequest();