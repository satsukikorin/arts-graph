import mongodb from 'mongodb';
const { ObjectId } = mongodb;

const strungId = (node) => {
  node.id = node._id.toString();
  return node;
};

const getUniquePerson = async (persona, Person) => {
  const p = await Person.findOne({_id: persona.uniquePerson.href});
  return strungId(p);
};

const ResolverThang = {
  Query: {
    Person: async (root, args, { Person }) => {
      const result = await Person.find(args).toArray();
      return strungId(result);
    },

    /*
        id may be for a Person node or a Persona node. In the latter case it means looking up the Persona's uniquePerson
        before getting all Personas (optionally filtering for the given type).
     */
    aliases: async (root, {id, type}, { Artist, Person }, info) => {
      const _id = ObjectId(id);
      let person = await Person.findOne({_id});
      if (!person) {
        // preferably delegate to Artist query with uniquePerson filled out, and that Person's fulfilled personas
        const persona = await ResolverThang.Person.personas({ //Passing in an ad-hoc person object
          personas: [
            {href: _id}
          ]
        });
        person = persona.uniquePerson = await getUniquePerson(persona, Person);
      }
      return Promise.all(
        person.personas.map(p => Artist.find({_id: p.href}).toArray() )
      );
    },

    Artist: async (root, {name, realName}, { Artist, Person }, info) => {

      const candidates = await Artist.find({name}).toArray();
      /*
      * Insert Wikipedia-like disambiguation logic here. We want to return the most popular
      * artist result first, which means we'd need have/track that popularity metadata
      * in the first place (which we don't...yet).
      */

      const artists = realName ? candidates.filter(c => c.uniquePerson.name === realName) : candidates;

      const result = artists.map(strungId);
      return Promise.all(result);
    },

    ArtistGroup: async (root, { name }, { ArtistGroup }, info) => {
      return (await ArtistGroup.find({name})).toArray();
    },

    Track: async (root, args, { Track }) => {
      // If more than creators' names were requested, details will need to be filled out from Artist.
      return await Track.find(args);
    }
  },

  // --------- SUBFIELD & TYPE RESOLVERS ---------- //

  Person: {

    // How can we make this respond to queries for only specific persona types?
    personas: async (person, a, b, c) => {
      const result = await Promise.all(
        person.personas.map(async (p) => {
          const source = context[p.type];
          if (!source) {
            console.error(`Don't know how to search for '${type}' persona on Person ${p._id.toString()}`);
          } else {
            const persona = await source.findOne({_id: p.href});
            if (persona) {
              persona.__type = persona.type = p.type;
            }
            return persona
          }
        })
      );
      return result;
    }
  },

  Persona: {
    __resolveType (obj, a, b, c) {
      return obj.type || obj[0].type;
    }
  },

  Artist: {
    __resolveType: () => {
      return 'Artist';
    },

    uniquePerson: async (artist, args, {Person}, info) => {
      return getUniquePerson(artist, Person);
    }
  },

  ArtistGroup: {
    __resolveType (obj, a, b, c) {
      return 'ArtistGroup';
    },
    members: async (obj, args, {Artist}, info) => {
      // do stuff
    }
  },

  ArtistOrGroup: {
    __resolveType (obj, a, b, c) {
      return obj.type;
    }
  },

  Contact: {

  },

  Dance: {

  },

  Show: {
    // If "creators" field is null, fill it with "performers" data?
  },

  Track: {

  },

  Venue: {

  },

  Mutation: {

  }
};

export default ResolverThang;