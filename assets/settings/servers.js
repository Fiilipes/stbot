const production = {
    survivalServer: false,
    soutezeTryhard: true
}

const servers = {
    "survivalServer": {
        "name": "Survival Server",
        "id": production.survivalServer ? "858063706058653776" : "1130282306683277423",
    },
    "soutezeTryhard": {
        "name": "Soutěže Tryhard",
        "id": production.soutezeTryhard ? "907310998560600114" : "1130637842276683909",
    }
}

export default servers;