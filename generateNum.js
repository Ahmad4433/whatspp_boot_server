// function generateRandomMobileNumber() {

//     let arrayNum = [];

//     const networkPrefixes = {
//         Zong: ["300", "301", "302", "303", "304", "305", "306", "307", "308", "309"],
//         Jazz: ["310", "311", "312", "313", "314", "315", "316", "317", "318", "319"],
//         Ufone: ["320", "321", "322", "323", "324", "325", "325", "327", "328", "329"],
//         Telenor: ["330", "331", "332", "333", "334", "335", "336", "337", "338", "339"],
//         Warid: ["340", "341", "342", "343", "344", "345", "346", "347", "348", "349"],
//     };

//     const networks = Object.keys(networkPrefixes);
//     const network = networks[Math.floor(Math.random() * networks.length)];
//     const prefixes = networkPrefixes[network];
//     const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];

//     const remainingDigits = Math.floor(Math.random() * 10000000)
//         .toString()
//         .padStart(7, "0");

//     arrayNum.push(`92${prefix}${remainingDigits}`)

//     return arrayNum
// }

// module.exports = generateRandomMobileNumber


function generateRandomMobileNumber() {

    let arrayNum = [];

    const networkPrefixes = {
        Zong: ["300", "301", "302", "303", "304", "305", "306", "307", "308", "309"],
        Jazz: ["310", "311", "312", "313", "314", "315", "316", "317", "318", "319"],
        Ufone: ["320", "321", "322", "323", "324", "325", "326", "327", "328", "329"],
        Telenor: ["330", "331", "332", "333", "334", "335", "336", "337", "338", "339"],
        Warid: ["340", "341", "342", "343", "344", "345", "346", "347", "348", "349"],
    };

    const networks = Object.keys(networkPrefixes);

    for (let i = 0; i < 200; i++) {
        const network = networks[Math.floor(Math.random() * networks.length)];
        const prefixes = networkPrefixes[network];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];

        const remainingDigits = Math.floor(Math.random() * 10000000)
            .toString()
            .padStart(7, "0");

        arrayNum.push(`92${prefix}${remainingDigits}`);
    }

    return arrayNum;
}

module.exports = generateRandomMobileNumber;
