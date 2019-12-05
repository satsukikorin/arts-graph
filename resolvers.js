const artistPersonaSearch = (args) => {
    return {
      personas: {
        $elemMatch: {personaType: "Artist", ...args}
      }
    };
};

export default {
  Query: {
    Person: async (root, args, { Person }) => {
      const result = await Person.find(args);
      return (await result.toArray()).map(person => {
        person.id = person._id.toString();
        return person;
      });
    },

    Artist: async (root, {name}, { Person }) => {
      // Look for any Person with an Artist persona with matching name.
      const search = artistPersonaSearch({name});

      const candidates = await Person.find(search).toArray(); // Does this really always result in an array?

      if (candidates.length) {
        // We're only going to return the Artist persona...
        const artists = candidates.map(candidate => candidate.personas.find(p => p.name === name));
        // ...but first we need to back-refer to the persona-owning Person. Or should this only be done if the
        // request query asked for uniquePerson data?
        artists.forEach((artist, i) => {
          const person = candidates[i];
          person.id = person._id.toString();
          artist.uniquePerson = person;
        });
        return artists;
      }
    },

    getArtistGroup: async (root, {name}, { ArtistGroup }) => {
      return await ArtistGroup.find({name});
    },

    getTrack: async (root, args, { Track }) => {
      // If more than creators' names were requested, details will need to be filled out from Artist.
      return await Track.find(args);
    }
  },

  Person: {

  },

  Artist: {

  },

  ArtistGroup: {
/*
    node.members = node.members.map(async member => {
      member.is = await fetch(member.href);
      // delete member.href?
    }
*/
  },

  ArtistOrGroup: {

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

  // const peeps = await db.collection('Person');
  //
  // let colin = await peeps.findOne({fullBirthName: "Colin Eugene May"});
  //
  // console.log(`Colin was ${colin && colin.length ? '' : 'not'} found`);
  //
  // if (colin && colin.personas) {
  //   console.log(colin.personas.map(p => p.name).toString());
  // }

