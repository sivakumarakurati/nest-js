const axios = require('axios');
const fs = require('fs'); // Import the fs module
async function makeGraphqlPostRequest() {
    const apiUrl = 'https://shoppersstop.api.fluentretail.com/graphql'
    const config = {
        method: 'post',
        headers: {
            Authorization: "bearer " + "lxFp0lUQfPjPCRvYD3rbV_AYSyM",
        }
    }
    const ids = ["S23BTR076435016","S23BTR076435023","S23BTR076441727","S23BTR076451269","S23BTR076451276","S23BTR076451283","S23BTR076451290","S23BTR076451313","S23BTR076451337","S23BTR076451344","S23BTR076451351","S23BTR076451375","S23BTR076451382","S23BTR076451405","S23BTR076454321","S23BTR076454345","S23BTR076454352","S23BTR076454369","S23BTR076454451","S23BTR076454468","S23BTR076454475","S23BTR076454482","S23BTR076454499","S23BTR076454505","S23BTR076454512","S23BTR076456028","S23BTR076456035","S23BTR076456042","S23BTR076456059","S23BTR076456066","S23BTR076456073","S23BTR076456080","S23BTR076456097","S23BTR076456103","S23BTR076456110","S23BTR076456127","S23BTR076456134","S23BTR076456141","S23BTR076456158","S23BTR076456455","S23BTR076457087","S23BTR076457223","S23BTR076457230","S23BTR076457247","S23BTR076457261","S23BTR076457285","S23BTR076457889","S23BTR076458015","S23BTR076458022","S23BTR076458039","S23BTR076458046","S23BTR076458053","S23BTR076458060","S23BTR076458275","S23BTR076458282"];
    const results = [];
    for (const id of ids) {
        const graphqlQuery = queryFunction(id)
        {
            try {
                const response = await axios.post(apiUrl, { query: graphqlQuery }, config);
                results.push(response.data);
                console.log("processing... ", id)
                // console.log(response?.data)
                const fileName = `standardProducts.json`;
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
    query{
        standardProducts(ref : ["${id}"]){    
            edges{    
                node{    
                    ref    
                    status    
                    variants{    
                        edges{    
                            node{    
                                ref    
                                status    
                            }    
                        }    
                    }    
                }    
            }    
        }    
    }
      `
    return graphqlQuery;
}
makeGraphqlPostRequest();