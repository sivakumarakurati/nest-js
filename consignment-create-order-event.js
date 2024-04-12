const axios = require('axios');
const fs = require('fs'); // Import the fs module
async function makeGraphqlPostRequest() {
    const apiUrl = 'https://shoppersstop.api.fluentretail.com/graphql'
    const config = {
        method: 'post',
        headers: {
            Authorization: "bearer " + "Rh5fbooP_wjLc2WLmMS3-x5RfeQ",
        }
    }
    const ids = [];
    
}
makeGraphqlPostRequest();