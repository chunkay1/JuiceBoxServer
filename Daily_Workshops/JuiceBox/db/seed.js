// grab our client with destructuring from the export in index.js
const {
    client,
    createUser,
    updateUser,
    getAllUsers,
    getUserById,
    createPost,
    updatePost,
    getAllPosts,
    getPostsByUser
} = require('./index');




// this function should call a query which drops all tables from our database
async function dropTables() {
    try {
        console.log("Starting to drop tables...");

        await client.query(`
            DROP TABLE IF EXISTS posts;
            DROP TABLE IF EXISTS users;
        `);

        console.log("Finished dropping tables!");
    } catch (error) {
        console.error("Error dropping tables!");
        throw error; // we pass the error up to the function that calls dropTables
    }
}

// this function should call a query which creates all tables for our database 
async function createTables() {
    try {
        console.log("Starting to build tables...");

        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username varchar(255) UNIQUE NOT NULL,
                password varchar(255) NOT NULL,
                name varchar(255) NOT NULL,
                location varchar(255) NOT NULL,
                active BOOLEAN DEFAULT true
            );
        `);

        await client.query(`
            CREATE TABLE posts (
                id SERIAL PRIMARY KEY,
                "authorId" INTEGER REFERENCES users(id) NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                active BOOLEAN DEFAULT true
            );
        `)

        console.log("Finished building tables!")
    } catch (error) {
        console.log("Error building tables!");
        throw error; // we pass the error up to the function that calls createTables
    }
}

async function createInitialUsers() {
    try {
        console.log("Starting to create users...");

        await createUser({ username: 'albert', password: 'bertie99', name: 'Al Bert', location: 'Sydney, Aussieland' });
        await createUser({ username: 'sandra', password: '2sandy4me', name: 'Sandy Cheeks', location: 'A bowl under the sea' });
        await createUser({ username: 'k1ll3rB33z', password: 'pr0t3cty@n3ck', name: 'Rza', location: 'Shaolin Land' });

        console.log("Finished creating users!");
    } catch (error) {
        console.error("Error creating users!");

        throw error;
    }
}

async function createInitialPosts() {
    try {
        const [albert, sandra, k1ll3rB33z] = await getAllUsers();
        console.log('Captured Users');

        await createPost({
            authorId: albert.id,
            title: "First Post",
            content: "This is my first post!"
        });


        await createPost({
            authorId: sandra.id,
            title: "Spongebob",
            content: "HIIYAAAH!"
        });

        await createPost({
            authorId: k1ll3rB33z.id,
            title: "Protect ya neck",
            content: "Killa bees on deck"
        });


    } catch (error) {
        console.log('Error Creating Initial Posts!');
        throw error;
    }
}

async function rebuildDB() {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialPosts();
        //This is where we're failing. 
    } catch (error) {
        throw error;
    }
}

async function testDB() {
    try {
        console.log("Starting to test database...");

        console.log("Calling getAllUsers")
        const users = await getAllUsers();
        console.log("Result:", users);

        console.log("Calling updateUser on users[0]")
        const updateUserResult = await updateUser(users[0].id, {
            name: "New Bert",
            location: "Queensland, Aussieland"
        });
        console.log("Result:", updateUserResult);

        console.log("Calling getAllPosts");
        const posts = await getAllPosts();
        console.log("Result:", posts);

        console.log("Calling updatePost on posts[0]");
        const updatePostResult = await updatePost(posts[0].id, {
            title: "New Title",
            content: "Updated Content"
        });
        console.log("Result:", updatePostResult);

        console.log("Calling getUserById with 1");
        const albert = await getUserById(1);
        console.log("Result", albert);

        console.log("Finished database tests!");
    } catch (error) {
        console.error("Error Testing Database!");
        throw error;
    }
}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());