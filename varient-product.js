const axios = require('axios');
const fs = require('fs'); // Import the fs module
async function makeGraphqlPostRequest() {
    const apiUrl = 'https://shoppersstop.api.fluentretail.com/graphql'
    const config = {
        method: 'post',
        headers: {
            Authorization: "bearer " + "3ezEQZKhVhCH7SBbaE8rt20WBps",
        }
    }
    const ids = [];
    const results = [];
    for (const id of ids) {
        const graphqlQuery = queryFunction(id)
        {
            try {
                const response = await axios.post(apiUrl, { query: graphqlQuery }, config);
                results.push(response.data);
                console.log("processing... ", id)
                // console.log(response?.data)
                const fileName = `StandardProducts.json`;
                await new Promise(resolve => setTimeout(resolve, 1000));
                await fs.promises.appendFile(fileName, JSON.stringify(response.data) + '\n');
            } catch (error) {
                console.error('Error:', error.response ? error.response.data : error.message);
            }

        }
        const fileName = `varientProducts.json`;
        await fs.promises.writeFile(fileName, JSON.stringify(results, null, 2));
    }
}
function queryFunction(id) {
    const graphqlQuery = `
    query{
        variantProducts(ref : ["${id}"]    
         catalogue : {    
             ref : "PC:MASTER:1"    
         }    
        ){    
            edges{    
                 node{    
                     ref    
                     status    
                 }    
            }    
        }    
    }
      `
    return graphqlQuery;
}
makeGraphqlPostRequest();