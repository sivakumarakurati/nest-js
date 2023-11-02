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
    const ids = ["5043262","5043206","5042674","5043456","5042621","5042969","5043285","5042623","5042692","5042631","5043201","5042703","5042573","5042541","5042761","5042555","5042729","5042840","5042809","5042953","5042612","5042742","5042896","5043203","5043044","5042778","5042580","5043047","5042675","5043348","5042652","5042852","5042599","5042660","5043039","5042961","5042819","5042857","5043296","5042741","5043036","5042984","5043346","5042986","5043334","5043358","5042762","5043122","5042917","5043309","5042617","5043363","5043034","5042882","5043103","5042835","5042997","5042895","5043361","5043116","5042671","5042608","5042931","5043357","5042625","5043097","5043329","5042826","5043322","5042976","5042853","5043319","5043198","5042775","5043328","5042696","5043320","5042955","5043292","5043318","5042730","5042776","5043294","5043310","5042556","5043307","5043051","5043372","5043280","5043344","5043196","5043147","5043336","5043264","5043088","5042957","5043287","5043241","5042517","5043256","5043152","5042530","5043185","5043194","5043242","5043316","5043279","5042990","5042344","5042321","5042320","5042412","5042963","5042874","5042856","5043007","5042771","5042839","5042654","5042550","5042163","5042109","5041742","5041708","5041322","5041448","5041447","5041935","5041921","5041786","5041717","5041133","5041202","5040591","5041008","5040930","5040712"]
    const results = [];
    for (const id of ids) {
        const graphqlQuery = updateFunction(id)
        {
            try {
                const response = await axios.post(apiUrl, { query: graphqlQuery }, config);
                console.log(JSON.stringify(response.data));                
            } catch (error) {
                console.error('Error:', error?.response ? JSON.stringify(error.response.data) : JSON.stringify(error.message));
            }

        }
    }
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
     console.log("updated ...");
}
makeGraphqlPostRequest();