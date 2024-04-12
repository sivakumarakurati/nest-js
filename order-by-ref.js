const axios = require('axios');
const fs = require('fs'); // Import the fs module
async function makeGraphqlPostRequest() {
    const apiUrl = 'https://shoppersstop.api.fluentretail.com/graphql'
    const config = {
        method: 'post',
        headers: {
            Authorization: "bearer " + "tV9XWgf9h4wF91hxlkp8TGi-fos",
        }
    }
    const ids = ["MAC_1073808", "EL_1073983", "EL_1074410", "CL_1074166", "MAC_1073868", "EL_1074489", "EL_1074742", "EL_1074556", "BB_1073510", "BB_1074937", "CL_1074229", "MAC_1074278", "CL_1075062", "EL_1075066", "MAC_1075131", "EL_1075218", "CL_1075319", "EL_1075316", "EL_1075383", "BB_1070215", "BB_1070225", "BB_1070438", "BB_1070690", "CL_1071406", "CL_1071468", "CL_1071468", "CL_1071592", "CL_1072094", "CL_1072240", "CL_1072478", "CL_1072710", "CL_1072898", "CL_1073279", "EL_1069720", "EL_1069821", "EL_1070503", "EL_1070536", "EL_1070649", "EL_1070845", "EL_1071002", "EL_1071294", "EL_1071548", "EL_1071667", "EL_1071690", "EL_1071897", "EL_1072005", "EL_1072162", "EL_1072562", "EL_1072909", "MAC_1068602", "MAC_1069298", "MAC_1069687", "MAC_1069687", "MAC_1072801", "MAC_1009422", "BB_1010494", "BB_1012416", "BB_1016243", "BB_1016323", "BB_1016754", "BB_1019255", "BB_1021441", "BB_1021596", "BB_1021729", "BB_1022247", "BB_1022650", "BB_1027881", "BB_1034614", "BB_1035364", "BB_1036639", "BB_1056776", "BB_1057193", "BB_1057464", "BB_1058292", "BB_1058349", "BB_1059083", "BB_1059363", "BB_1059869", "BB_1060373", "BB_1060603", "BB_1060825", "BB_1061489", "BB_1063244", "BB_1063367", "CL_1008763", "CL_1009418", "CL_1009731", "CL_1010751", "CL_1010808", "CL_1011676", "CL_1011737", "CL_1012415", "CL_1012975", "CL_1013120", "CL_1013163", "CL_1013270", "CL_1013595", "CL_1013596", "CL_1013697", "CL_1013795", "CL_1013850", "CL_1013897", "CL_1013993", "CL_1014094", "CL_1014096", "CL_1014238", "CL_1014467", "CL_1014476", "CL_1014543", "CL_1016299", "CL_1017398", "CL_1017422", "CL_1019068", "CL_1020268", "CL_1020598", "CL_1020607", "CL_1020689", "CL_1021149", "CL_1021174", "CL_1021658", "CL_1021903", "CL_1032644", "CL_1032651", "CL_1032985", "CL_1033089", "CL_1033158", "CL_1035419", "CL_1036831", "CL_1037791", "CL_1058496", "CL_1058574", "CL_1058664", "CL_1060726", "CL_1060871", "CL_1060901", "CL_1061147", "CL_1061220", "CL_1061242", "CL_1061299", "CL_1061588", "CL_1061928", "CL_1061962", "CL_1061988", "CL_1062286", "CL_1062480", "CL_1063023", "CL_1063258", "CL_1063922", "EL_1007927", "EL_1009927", "EL_1011049", "EL_1012350", "EL_1013678", "EL_1013693", "EL_1013700", "EL_1013705", "EL_1013936", "EL_1014946", "EL_1016098", "EL_1017288", "EL_1019648", "EL_1019648", "EL_1019775", "EL_1020174", "EL_1020337", "EL_1020691", "EL_1056907", "EL_1057077", "EL_1057422", "EL_1057754", "EL_1058365", "EL_1058511", "EL_1058617", "EL_1059249", "EL_1059390", "EL_1059920", "EL_1059961", "EL_1060353", "EL_1060642", "EL_1060649", "EL_1060860", "EL_1060971", "EL_1061436", "EL_1061543", "EL_1061611", "EL_1061728", "EL_1061848", "EL_1062303", "EL_1062521", "EL_1063096", "EL_1063344", "MAC_1008024", "MAC_1008042", "MAC_1008599", "MAC_1008671", "MAC_1008736", "MAC_1008760", "MAC_1008766", "MAC_1008804", "MAC_1008867", "MAC_1009057", "MAC_1009237", "MAC_1009461", "MAC_1010037", "MAC_1011315", "MAC_1011568", "MAC_1011604", "MAC_1011648", "MAC_1011665", "MAC_1011799", "MAC_1011811", "MAC_1011828", "MAC_1011837", "MAC_1011882", "MAC_1011941", "MAC_1012010", "MAC_1012193", "MAC_1012195", "MAC_1012204", "MAC_1012224", "MAC_1012377", "MAC_1012449", "MAC_1012463", "MAC_1012482", "MAC_1013055", "MAC_1013064", "MAC_1013102", "MAC_1013107", "MAC_1013145", "MAC_1013173", "MAC_1013248", "MAC_1013257", "MAC_1013260", "MAC_1013288", "MAC_1013310", "MAC_1013314", "MAC_1013318", "MAC_1013361", "MAC_1013393", "MAC_1013405", "MAC_1013407", "MAC_1013459", "MAC_1013471", "MAC_1013526", "MAC_1013544", "MAC_1013549", "MAC_1013561", "MAC_1013566", "MAC_1013568", "MAC_1013599", "MAC_1013704", "MAC_1013736", "MAC_1013828", "MAC_1013865", "MAC_1013919", "MAC_1014009", "MAC_1014031", "MAC_1014039", "MAC_1014061", "MAC_1014088", "MAC_1014180", "MAC_1014211", "MAC_1014226", "MAC_1014228", "MAC_1014254", "MAC_1014318", "MAC_1014353", "MAC_1014923", "MAC_1014481", "MAC_1014484", "MAC_1014503", "MAC_1014530", "MAC_1014531", "MAC_1014566", "MAC_1014579", "MAC_1014623", "MAC_1014625", "MAC_1014648", "MAC_1014744", "MAC_1014764", "MAC_1014771", "MAC_1014786", "MAC_1014834", "MAC_1014839", "MAC_1014865", "MAC_1014868", "MAC_1014882", "MAC_1014918", "MAC_1014925", "MAC_1014939", "MAC_1014940", "MAC_1014943", "MAC_1014945", "MAC_1014948", "MAC_1014978", "MAC_1015036", "MAC_1015053", "MAC_1015066", "MAC_1015105", "MAC_1015201", "MAC_1015242", "MAC_1015251", "MAC_1015253", "MAC_1015257", "MAC_1015262", "MAC_1015264", "MAC_1015279", "MAC_1015308", "MAC_1015315", "MAC_1015317", "MAC_1015321", "MAC_1015359", "MAC_1015378", "MAC_1015379", "MAC_1015394", "MAC_1015396", "MAC_1015396", "MAC_1015424", "MAC_1015427", "MAC_1015428", "MAC_1015453", "MAC_1015455", "MAC_1015460", "MAC_1015463", "MAC_1015469", "MAC_1015470", "MAC_1015480", "MAC_1015485", "MAC_1015488", "MAC_1015494", "MAC_1015500", "MAC_1015501", "MAC_1015506", "MAC_1015526", "MAC_1015528", "MAC_1015532", "MAC_1015536", "MAC_1015565", "MAC_1015566", "MAC_1015576", "MAC_1015600", "MAC_1015607", "MAC_1015614", "MAC_1015623", "MAC_1015674", "MAC_1015770", "MAC_1015790", "MAC_1016270", "MAC_1017147", "MAC_1017393", "MAC_1018394", "MAC_1018674", "MAC_1020621", "MAC_1022200", "MAC_1036897", "MAC_1037378", "MAC_1057314", "MAC_1057315", "MAC_1059176", "MAC_1059177", "MAC_1060864", "MAC_1061566", "CL_1019776", "CL_1061544", "MAC_1061997", "MAC_1062024", "CL_1012886", "CL_1013087", "CL_1020601", "EL_1014706", "MAC_1010125", "MAC_1011361", "MAC_1011420", "MAC_1011640", "MAC_1011704", "MAC_1012205", "MAC_1012422", "MAC_1012665", "MAC_1012677", "MAC_1012796", "MAC_1013107", "MAC_1013252", "MAC_1013400", "MAC_1011418", "MAC_1012694", "BB_1064331", "BB_1065159", "BB_1065259", "BB_1065534", "BB_1066799", "BB_1066894", "BB_1066938", "BB_1067010", "BB_1068250", "BB_1068454", "BB_1069036", "BB_1069324", "CL_1064218", "CL_1066758", "CL_1069040", "EL_1063993", "EL_1064252", "EL_1064364", "EL_1064463", "EL_1065355", "EL_1065429", "EL_1065577", "EL_1065914", "EL_1066130", "EL_1066366", "EL_1066465", "EL_1066769", "EL_1066771", "EL_1067038", "EL_1067073", "EL_1067405", "EL_1067442", "EL_1067574", "EL_1067934", "EL_1067941", "EL_1068267", "EL_1068521", "EL_1068621", "EL_1068877", "EL_1069031", "EL_1069099", "MAC_1064232"];
    const results = [];
    for (const id of ids) {
        const graphqlQuery = queryFunction(id)
        {
            try {
                const response = await axios.post(apiUrl, { query: graphqlQuery }, config);
                const orderRes = response.data
                for (const orderEdgeData of orderRes.data.orders.edges) {
                    for (const fulfilmentEdgeData of orderEdgeData.node.fulfilments.edges) {
                        const fulfilmentRef = fulfilmentEdgeData.node.ref;
                        const fulfilmentStatus = fulfilmentEdgeData.node.status;

                        if (fulfilmentStatus != "ESCALATED") {
                            const graphqlQuery1 = queryFunction1(fulfilmentRef)
                            const response1 = await axios.post(apiUrl, { query: graphqlQuery1 }, config);

                            results.push(response1.data);
                            console.log("processing... ", fulfilmentRef)
                            const fileName = `fulfilments.json`;
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            await fs.promises.appendFile(fileName, JSON.stringify(response1.data) + '\n');
                        }
                    }
                }
            } catch (error) {
                console.error('Error:', error.response ? error.response.data : error.message);
            }

        }
        const fileName = `orderByRef.json`;
        await fs.promises.writeFile(fileName, JSON.stringify(results, null, 2));
    }
}
function queryFunction(id) {
    const graphqlQuery = `
    query {
        orders(ref: "${id}") {
            edges {
                node {
                    ref
                    fulfilments {
                        edges {
                            node {
                                id
                                ref
                                status
                            }
                        }
                    }
                }
            }
        }
    }`
    return graphqlQuery;
}
function queryFunction1(id) {
    const graphqlQuery = `
    query{
        fulfilments(ref : ["${id}"]){
            edges{
                node{
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