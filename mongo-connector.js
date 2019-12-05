import MongoClient from "mongodb";

export default async function (opts) {

  const { dbURL, mongoOpts } = opts;

  const client = await MongoClient.connect(dbURL, mongoOpts);
  const db = await client.db('artsdb');
  const collections = [
    'Person',
    'ArtistGroup',
    'Track',
    'Album',
    'Show',
    'Venue'
  ];

  const connections = await Promise.all(collections.map(name => db.collection(name)));

  const collectionsAPI = collections.reduce((map, collectionName, i) => {
    map[collectionName] = connections[i];
    return map;
  }, {});
  /* This should get us
    {
      Album: <Album collection API>,
      ArtistGroup: <ArtistGroup collection API>,
      ...
    }
  */
  return {
    db: db,
    collections: collectionsAPI
  };
}