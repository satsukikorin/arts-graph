const artistPersonaSearch = (args) => {
    return {
      personas: {
        $elemMatch: {type: "Artist", ...args}
      }
    };
};

export default {
  Query: {
    getPerson: async (root, args, { Person }) => {
      return await Person.find(args)
    },

    getArtist: async (root, {name}, { Person }) => {
      // Look for any Person with an Artist persona with matching name.
      const search = artistPersonaSearch({name});

      const candidates = await Person.find(search); // Does this really always result in an array?

      if (candidates.length) {
        // We're only going to return the Artist persona...
        const artists = candidates.map(candidate => candidate.personas.find(p => p.name === name));
        // ...but first we need to back-refer to the persona-owning Person.
        artists.forEach((artist, i) => {
          artist.uniquePerson = candidates[i];
        });
        return artists;
      }
      // If no matches were found, is it OK not to return, i.e. return undefined?
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

