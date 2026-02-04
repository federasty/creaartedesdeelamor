
import { MongoClient } from 'mongodb';

async function main() {
    const uri = 'mongodb+srv://fede_labestiaazul:fede123@cluster0.ilpnwag.mongodb.net/creaartedesdeelamor';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Conectado a MongoDB');

        const db = client.db('creaartedesdeelamor');
        const collections = await db.listCollections().toArray();
        console.log('Colecciones en "creaartedesdeelamor":');
        collections.forEach(c => console.log(` - ${c.name}`));

        const users = await db.collection('users').find().toArray();
        console.log(`Usuarios encontrados: ${users.length}`);

        const products = await db.collection('products').find().toArray();
        console.log(`Productos encontrados: ${products.length}`);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main();
