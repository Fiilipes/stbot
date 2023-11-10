const production = true

const channels = {
    "pravidla": production ? "1146374271929688064" : "1130870152892776558",
    "atext": production ? "1146332760697470986" : "1131374398759243806",
    "history": production ? "1131374722005864539" : "1131374722005864539",
    "soutěže": production ? "1146378357743812658" : "1130949408989663274",
    "obecné": production ? "1131551310970355742" : "1131551310970355742",
    "support": production ? "1131551509805547611" : "1131551509805547611",
    "návrhy": production ? "1131551561856843836" : "1131551561856843836",
    "info": production ? "1146379157178163310" : "1130969267270066306",
    "npctalk": production ? "1141388557303431218" : "1141388557303431218"
}

const categories = {
    "text-channels": production ? "1130637843631440023" : "1130637843631440023"
}

export { channels, categories }