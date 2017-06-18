const Promise = require('bluebird');
const MongoClient = require('mongodb').MongoClient;

const MONGODB_URL = 'mongodb://localhost:27017/bookshelf';


function mongoPromiseToFind(collection, query, projection = {fields: {_id: 0}}, options = {}) {
    return new Promise(function (resolve, reject) {
        if (collection) {
            resolve({
                "collection": collection,
                "query": query,
                "projection": projection,
                "options": options
            })
        }
        else {
            reject(new Error("No mongo collection specified"))
        }
    }).then(function ({collection, query, projection, options}) {
        let cursor = collection.find(query, projection);
        if (options["limit"]) {
            cursor.limit(options["limit"]);
        }
        /* promise to find data */
        return cursor.toArray();
    }).then(function (documents) {
        /* promise to process result */
        console.log(documents);
        return documents;
    }).catch(function (result) {
        console.log("Catch: " + result);
        return [{name: "The Great Book of All Errors", color: [1, 2, 3]}];
    });
}

function mongoFind(collection_name, query = msg => ({}), projection = msg => ({}), options = msg => ({})) {
    return (msg, respond) => {
        console.log(options(msg));
        return MongoClient
            .connect(MONGODB_URL, {promiseLibrary: Promise})
            .catch(err => console.error(err.stack)
            ).then(db => {
                const collection = db.collection(collection_name);
                return mongoPromiseToFind(collection, query(msg), projection(msg), options(msg))
            })
            .then(function (documents) {
                console.log(documents);
                respond(null, documents);
            });
    }
}

findOneBookshelfRow = mongoFind("rows", query = msg => ({"name": msg.rowName}));
findAllBookshelfRows = mongoFind("rows", msg => {
}, msg = {}, options = msg => ({"limit": msg.limit}));

module.exports = function bookshelf(options) {
    this.add('role:bookshelf,cmd:findOneBookshelfRow', findOneBookshelfRow);
    console.log('findBookshelfRow added to Seneca');
    this.add('role:bookshelf,cmd:findAllBookshelfRows', findAllBookshelfRows);
    console.log('findAllBookshelfRows added to Seneca');

    console.log('mongodb url is ' + MONGODB_URL);
};
