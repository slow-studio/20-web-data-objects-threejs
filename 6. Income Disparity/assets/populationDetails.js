console.log("population details")

let populationWealthDistribution=[

    //population segment 1
    {
        "populationRepresentationId": 1,  "wealthDistribution": 0.1,      "color": 0xffcc66,    "story": "popSegment 1", 
        "radius": 1, "populationSphereLabelId": "bottom 1%",    
        "targetPositionX": -38,    "targetPositionY":-11.5,    "targetPositionZ":0
        },
     //population segment 2
     {
        "populationRepresentationId": 2,  "wealthDistribution": 0.3,      "color": 0xffcc66,    "story": "popSegment 2",
        "radius": 1, "populationSphereLabelId": "2%",
        "targetPositionX": -35.5,    "targetPositionY":-11.3,    "targetPositionZ":0
        },
    //population segment 3
    {
        "populationRepresentationId": 3,  "wealthDistribution": 0.7,      "color": 0xffcc66,    "story": "popSegment 3",
        "radius": 1, "populationSphereLabelId": "3%",
        "targetPositionX": -32,    "targetPositionY":-10.7,    "targetPositionZ":0
        },
    //population segment 4
    {
        "populationRepresentationId": 4,  "wealthDistribution": 1.2,      "color": 0xffcc66,    "story": "popSegment 4",
        "radius": 1, "populationSphereLabelId": "4%",
        "targetPositionX": -28,    "targetPositionY":-10.5,    "targetPositionZ":0
        },
    //population segment 5
    {
        "populationRepresentationId": 5,  "wealthDistribution": 1.8,      "color": 0xffcc66,    "story": "popSegment 5",
        "radius": 1, "populationSphereLabelId": "5%",
        "targetPositionX": -23,    "targetPositionY":-10,    "targetPositionZ":0
        },
    //population segment 6
    {
        "populationRepresentationId": 6,  "wealthDistribution": 2.7,      "color": 0xffcc66,    "story": "popSegment 6",
        "radius": 1, "populationSphereLabelId": "6%",
        "targetPositionX": -16.5,    "targetPositionY":-9,    "targetPositionZ":0    
        }, 
    //population segment 7
    {
        "populationRepresentationId": 7,  "wealthDistribution": 4.1,      "color": 0xffcc66,    "story": "popSegment 7",
        "radius": 1, "populationSphereLabelId": "7%",
        "targetPositionX": -7.5,    "targetPositionY":-7.5,    "targetPositionZ":0
        },    
    //population segment 8
    {
        "populationRepresentationId": 8,  "wealthDistribution": 6.4,      "color": 0xffcc66,    "story": "popSegment 8",
        "radius": 1, "populationSphereLabelId": "8%",
        "targetPositionX": 5,    "targetPositionY":-5,    "targetPositionZ":0 
        },    
    //population segment 9
    {
        "populationRepresentationId": 9,  "wealthDistribution": 11.2,     "color": 0xffcc66,    "story": "popSegment 9",
        "radius": 1, "populationSphereLabelId": "9%",
        "targetPositionX": 25,    "targetPositionY":0,    "targetPositionZ":0 
        },
    //population segment 10
    {
        "populationRepresentationId": 10,  "wealthDistribution": 72.5,    "color": 0xff9933,    "story": "popSegment 10",
        "radius": 1, "populationSphereLabelId": "Top 10%",
        "targetPositionX": 75,    "targetPositionY":3,    "targetPositionZ":-50
        },        
]

//here we store the position of al the spheres once they are generated form the matrix
let objectPosition={
    "positionX":[], "positionY":[], "positionZ":[]}
