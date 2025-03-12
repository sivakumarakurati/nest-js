const axios = require('axios');
const fs = require('fs');
async function makeGraphqlPostRequest() {
    const apiUrl = 'https://shoppersstop.api.fluentretail.com/graphql'
    const config = {
        method: 'post',
        headers: {
            Authorization: "bearer " + "Ph1jToSb8gMQckVIEU-FdQYROJA",
        }
    }
    const results = [];
    const graphqlQuery = queryFunction()
    {
        try {
            const response = await axios.post(apiUrl, { query: graphqlQuery }, config);
            results.push(response.data);
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }

    }
    let products = [];
    let prodEdgeNodes = results[0].data.standardProducts.edges;
    for (const edgeData of prodEdgeNodes) {
        product = new Product();
        product.name = edgeData.node.name;
        product.ref = edgeData.node.ref;
        product.gtin = edgeData.node.gtin;
        if (edgeData.node.categories.edges.length !== 0) {
            product.categories = [];
            for (const catRef of edgeData.node.categories.edges) {
                product.categories.push(catRef.node.ref);
            }
        }
        let attributes = edgeData.node.attributes;
        if (attributes !== null) {
            for (const attribute of attributes) {
                if (attribute.name === 'Brand') product.brand = attribute.value;
                if (attribute.name === 'EAN') product.ean = attribute.value;
                if (attribute.name === 'color') product.color = attribute.value;
                if (attribute.name === 'Size') product.size = attribute.value;
                if (attribute.name === 'imageUrl') product.images.push(attribute.value);
            }
        }
        if (edgeData.node.prices.length !== 0) {
            product.prices = [];
            for (const attr of edgeData.node.prices) {
                price = new Price();
                price.type = attr.type;
                price.value = attr.value;
                price.currency = attr.currency;
                price.catalog = edgeData.node.catalogue.ref;
                product.prices.push(price);
            }
        }
        products.push(product);
    }
    const fileName = `standard-products.json`;
    await new Promise(resolve => setTimeout(resolve, 1000));
    await fs.promises.appendFile(fileName, JSON.stringify(products) + '\n');
}
class Product {
    ref = '';
    name = '';
    gtin = '';
    categories = [];
    brand = '';
    ean = '';
    color = '';
    size = '';
    images = [];
    prices = [];
}
class Price {
    type = '';
    currency = '';
    value = '';
}
function queryFunction() {
    const graphqlQuery = `query {
        standardProducts(first : 1000  
        catalogue : {    
            ref : "PC:MASTER:1"    
        }    
        ) {    
            edges {    
                node {    
                    ref    
                    name
                    gtin
                    categories {
                        edges {
                            node {
                                ref
                            }
                        }
                    }
                    attributes {
                        name
                        type
                        value
                    }
                    prices {
                        currency
                        type
                        value
                    }
                    catalogue {
                        ref
                    }
                 }    
            }    
        }    
    }`
    return graphqlQuery;
}
makeGraphqlPostRequest();