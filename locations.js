const axios = require('axios');
const fs = require('fs'); // Import the fs module
async function makeGraphqlPostRequest() {
    const apiUrl = 'https://shoppersstop.api.fluentretail.com/graphql'
    const config = {
        method: 'post',
        headers: {
            Authorization: "bearer " + "hq4qJ0vujWpQ2O_POqoFEWfDsmk",
        }
    }
    const results = [];
    const graphqlQuery = queryFunction(id)
    {
        try {
            const response = await axios.post(apiUrl, { query: graphqlQuery }, config);
            const locationRes = response.data
            for (const edgeData of locationRes.data.fulfilments.edges) {
                const data = {};
                data.ref = edgeData.node.ref;
                data.name = edgeData.node.name;
            }
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }

        }
        const fileName = `locations.json`;
        await fs.promises.writeFile(fileName, JSON.stringify(results, null, 2));
}
function queryFunction(id) {
    const graphqlQuery = `
    query {
        locations(first: 1000) {
            edges {
                node {
                    ref
                    name
                    networks {
                        edges {
                            node {
                                ref
                            }
                        }
                    }
                    primaryAddress {
                        companyName
                        street
                        city
                        postcode
                        state
                        country
                    }
                    supportPhoneNumber
                    attributes {
                        name
                        value
                    }
                }
            }
        }
    }`
    return graphqlQuery;
}
makeGraphqlPostRequest();