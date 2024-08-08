import { Db, MongoClient, ServerApiVersion } from 'mongodb'

class MongoDbService {
    client: MongoClient;
    booted = false;
    db: Db;
    constructor() {
        this.boot();
    }

    async boot(){
        if(this.booted) {
            return;
        }

        if(!process.env.DB_URL || !process.env.DB_NAME) {
            throw new Error("DB_URL is not defined ");
        }
        this.client = new MongoClient(process.env.DB_URL, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true
            },
        })
        await this.client.connect().then(() => {
            console.log("Connected to MongoDB");
            this.db = this.client.db(process.env.DB_NAME);
            this.booted = true;
        }).catch((err) => {
            console.log(err);
            throw new Error("Failed to connect to MongoDB");
        })
    }

    async close() {
        if(!this.booted) {
            return;
        }
        await this.client.close();
        this.booted = false;
    }
}

export default new MongoDbService();