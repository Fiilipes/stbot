// Import the needed functions from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore, onSnapshot } from "firebase/firestore";
import {collection, getDocs, setDoc, addDoc, doc, deleteDoc} from "firebase/firestore";


// Initialize Firebase
class Firebase {

    _firebaseConfig
    app
    constructor( firebaseConfig) {
        this._firebaseConfig = firebaseConfig;
        this.app = initializeApp(firebaseConfig);
    }

}


// Create a Firestore reference
const myFirebase = new Firebase({
    apiKey: "AIzaSyARxkaimi8XP2OYqci8XMYU-PFyhhtMvr0",
    authDomain: "survival-server-org.firebaseapp.com",
    projectId: "survival-server-org",
    storageBucket: "survival-server-org.appspot.com",
    messagingSenderId: "45781323100",
    appId: "1:45781323100:web:e952c1b5e78ca255764599",
    measurementId: "G-Y8E982JSFL"
});

// Setup some constants
const app = myFirebase.app;
const db = getFirestore(app);
const postCollectionRef  = collection(db, "ssbot");
const notesRef = collection(db, "notes");
const eventsRef = collection(db, "events");

// Functions to get data from Firebase
const getSS = async () => {
    const data = await getDocs(postCollectionRef);
    return data.docs.map((doc) => ({...doc.data(), id: doc.id} ))
}
const getNotes = async () => {
    const data = await getDocs(notesRef);
    return data.docs.map((doc) => ({...doc.data(), id: doc.id} ))
}

const getNotes = async () => {
    const data = await getDocs(notesRef);
    return data.docs.map((doc) => ({...doc.data(), id: doc.id} ))
}

const getEvents = async () => {
    const data = await getDocs(eventsRef);
    return data.docs.map((doc) => ({...doc.data(), id: doc.id} ))
}

export {
    getSS,
    getNotes,
    getEvents,
}
// export db
export default db;
