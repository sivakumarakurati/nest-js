const axios = require('axios');
const fs = require('fs'); // Import the fs module
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

    let locations = [];
    let locEdgeNodes = results[0].data.locations.edges;
    for (const edgeData of locEdgeNodes) {
        location = new Location();
        location.name = edgeData.node.name;
        location.ref = edgeData.node.ref;
        location.phoneNo = edgeData.node.supportPhoneNumber;
        let attributes = edgeData.node.attributes;
        if (attributes !== null) {
            for (const attribute of attributes) {
                if (attribute.name === 'locationType') location.type = attribute.value;
                if (attribute.name === 'ETA') location.etaInHours = attribute.value;
            }
        }
        location.street = edgeData.node.primaryAddress.street;
        location.city = edgeData.node.primaryAddress.city;
        location.state = edgeData.node.primaryAddress.state;
        location.postcode = parseInt(edgeData.node.primaryAddress.postcode);
        location.country = edgeData.node.primaryAddress.country;
        location.latitude = parseFloat(edgeData.node.primaryAddress.latitude);
        location.longitude = parseFloat(edgeData.node.primaryAddress.longitude);

        location.networks = [];
        for (const networkEdgeData of edgeData.node.networks.edges) {
            location.networks.push(networkEdgeData.node.type);
        }

        location.openingSchedule = {};
        location.openingSchedule.open24HoursAvailable = edgeData.node.openingSchedule.allHours
        location.openingSchedule.sundayTiming = edgeData.node.openingSchedule.monStart + ':' + edgeData.node.openingSchedule.monEnd;
        location.openingSchedule.mondayTiming = edgeData.node.openingSchedule.tueStart + ':' + edgeData.node.openingSchedule.tueEnd;
        location.openingSchedule.tuesdayTiming = edgeData.node.openingSchedule.wedStart + ':' + edgeData.node.openingSchedule.wedEnd;
        location.openingSchedule.wednesdayTiming = edgeData.node.openingSchedule.thuStart + ':' + edgeData.node.openingSchedule.thuEnd;
        location.openingSchedule.thursdayTiming = edgeData.node.openingSchedule.friStart + ':' + edgeData.node.openingSchedule.friEnd;
        location.openingSchedule.fridayTiming = edgeData.node.openingSchedule.satStart + ':' + edgeData.node.openingSchedule.satEnd;
        location.openingSchedule.saturdayTiming = edgeData.node.openingSchedule.sunStart + ':' + edgeData.node.openingSchedule.sunEnd;

        locations.push(location);
    }

    const fileName = `locations.json`;
    await new Promise(resolve => setTimeout(resolve, 1000));
    await fs.promises.appendFile(fileName, JSON.stringify(locations) + '\n');
}
class Location {
    ref;
	name;
	emailId;
	phoneNo;
	type;
	city;
	street;
	postcode;
	state;
	country;
	latitude;
	longitude;
	stateIsoCode;
	gtinNo;
	cinNo;
	networks;
	sellerRef = 'SSL:SSB';
    timezone;
    etaInHours;
    openingSchedule;
}

class OpeningSchedule {
    open24HoursAvailable = false;
    mondayTiming = '';
    tuesdayTiming = '';
    wednesdayTiming = '';
    thursdayTiming = '';
    fridayTiming = '';
    saturdayTiming = '';
    sundayTiming = '';
}
function queryFunction(id) {
    const graphqlQuery = `
    query {
    locations(first : 1000 status : "ACTIVE") {
        edges {
            node {
                ref
                name
                attributes {
                    name
                    value
                }
                networks {
                    edges {
                        node {
                            type
                        }
                    }
                }
                openingSchedule {
                    allHours
                    sunStart
                    sunEnd
                    monStart
                    monEnd
                    tueStart
                    tueEnd
                    wedStart
                    wedEnd
                    thuStart
                    thuEnd
                    friStart
                    friEnd
                    satStart
                    satEnd
                }
                primaryAddress {
                    street
                    city
                    state
                    postcode
                    country
                    timeZone
                    latitude
                    longitude
                }
                supportPhoneNumber
            }
        }
    }
}`
    return graphqlQuery;
}
makeGraphqlPostRequest();