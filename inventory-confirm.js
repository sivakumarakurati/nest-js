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
            Authorization: "bearer " + "1HfRj8iYOun70Kd2yGQ750kQI_c",
        }
    }
    const ids = ["310-1-SSB_1031220","155-1-SSB_1031221","130-1-SSB_1031223","901-1-MAC_1031227","901-1-MAC_1031228","901-1-MAC_1031231","122-1-SSB_1031232","901-1-MAC_1031233","901-1-CL_1031234","912-1-SSB_1031236","901-1-MAC_1031240","901-1-MAC_1031239","901-1-CL_1031242","901-1-MAC_1031244","110-1-SSB_1031249","902-1-SSB_1031252","901-1-BB_1031255","901-1-MAC_1031258","901-1-MAC_1031259","112-1-SSB_1031266","147-2-SSB_1031138","294-1-SSB_1031274","294-1-SSB_1031276"];
    const results = [];
    for (const id of ids) {
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
makeGraphqlPostRequest();