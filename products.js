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
        products.push(productGQLToObject(edgeData, '', 'STANDARD'));
    }
    const fileName = `products.json`;
    await new Promise(resolve => setTimeout(resolve, 1000));
    await fs.promises.appendFile(fileName, JSON.stringify(products) + '\n');
}
class Product {
    ref;
    name;
    type;
    gtinNo;
    categories;
    brandRef;
    eanNo;
    colorName;
    sizeName;
    images;
    prices;
    variants;
    parentRef;
}
class Category {
    ref;
    name;
}
class Price {
    type;
    currency;
    value;
    catalogRef;
    sellerRef;
}

function productGQLToObject(edgeData, parentRef, type) {
    let product = new Product();
    product.name = edgeData.node.name;
    product.ref = edgeData.node.ref;
    product.gtinNo = edgeData.node.gtin;
    product.type = type;
    if (parentRef !== '')
        product.parentRef = parentRef;
    if (edgeData.node.categories.edges.length !== 0) {
        product.categories = [];
        for (const catRef of edgeData.node.categories.edges) {
            let category = new Category();
            category.ref = catRef.node.ref;
            category.name = catRef.node.name;
            product.categories.push(category);
        }
    }
    let attributes = edgeData.node.attributes;
    if (attributes !== null) {
        product.images = [];
        for (const attribute of attributes) {
            if (attribute.name === 'Brand') product.brandRef = attribute.value;
            if (attribute.name === 'EAN') product.eanNo = attribute.value;
            if (attribute.name === 'color') product.colorName = attribute.value;
            if (attribute.name === 'Size') product.sizeName = attribute.value;
            if (attribute.name === 'imageUrl') product.images.push(attribute.value);
        }
    }
    if (edgeData.node.prices.length !== 0) {
        product.prices = [];
        for (const attr of edgeData.node.prices) {
            let price = new Price();
            price.type = attr.type;
            price.value = attr.value;
            price.currency = attr.currency;
            price.catalogRef = 'PC:MASTER';
            price.sellerRef = 'SSL:SSB';
            product.prices.push(price);
        }
    }

    if (edgeData.node.variants !== undefined) {
        product.variants = [];
        let prodEdgeNodes = edgeData.node.variants.edges;
        for (const edgeData of prodEdgeNodes) {
            product.variants.push(productGQLToObject(edgeData, product.ref, 'VARIANT'));
        }
    }

    return product;
}

function queryFunction() {
    const graphqlQuery = `query {
        standardProducts(first : 100 
        catalogue : {    
            ref : "PC:MASTER:1"    
        }    
        ) {    
            edges {    
                node {    
                    ref    
                    name
                    gtin
                    type
                    categories {
                        edges {
                            node {
                                ref
                                name
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
                    variants {
                        edges {
                            node {
                                ref    
                    name
                    gtin
                    categories {
                        edges {
                            node {
                                ref
                                name
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
                 }    
            }    
        }    
    }`
    return graphqlQuery;
}
makeGraphqlPostRequest();