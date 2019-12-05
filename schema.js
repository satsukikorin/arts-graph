//import {GraphQLDate} from "graphql-iso-date";
import ApolloServer from 'apollo-server';

const { gql } = ApolloServer;

export default gql`
  
  scalar Date

  type Query {
    node(
      id: ID!
    ): Node
    
    Person(
      fullBirthName: String!
      birthdate: Date
    ): [Person]

    Artist(
      name: String!
    ): [Artist]
    
    getArtistGroup(
      name: String!
    ): [ArtistGroup]
    
    getTrack(
      name: String
      creators: [String]
    ): [Track]
    
#    artists(
#      # The number of results to show. Must be >= 1. Default = 20
#      pageSize: Int
#
#      # If you add a cursor here, it will only return results _after_ this cursor
#      after: String
#    ): ArtistsConnection!
  }

  """
  Wrapper around our list contains a cursor to the last item in the list.
  Pass this cursor to the artists query to fetch results after these.
  """
  type ArtistsConnection {
    cursor: String!
    hasMore: Boolean!
    artists: [Artist]!
  }

  enum ARTISTICMEDIUM {
    BOOK
    CLOTH # for weaving et al
    COSTUME # includes fashion
    DANCE
    INSTALLATION
    ILLUSTRATION
    LITERATURE
    MOVIE # Is this redundant with VIDEO?
    MUSIC
    PAINTING
    PHOTOGRAPH
    SCULPTURE
    SOUND # non-musical
    SPOKENWORD
    THEATER # Do we need to care about localization ('theatre')? Technically it's just a search keyword.
    THREEDIMENSIONALIMAGE # holography or volumetric imagery
    VIDEO
  }

  enum DIGITALMEDIAFORMAT {
    AAC
    AIFF
    ASF
    DSD
    DTS
    FLAC
    LPCM
    MP3
    MP4
    OGG
    WAV
    WMA

    GIF
    JPG
    PNG
    TIFF

    MPG
    MPG2
    MPG4
  }
  
  enum CONTACTDEVICETYPE {
    MOBILEPHONE,
    LANDPHONE,
    EMAIL,
    SNAILMAIL
  }

  interface Node {
    id: ID!
  }

  interface Persona {
    uniquePerson: Person!
  }

  type Person implements Node {
    fullBirthName: String!
    birthdate: Date!
    birthplace: String # change to be a Location, if such can be implemented
    deathdate: Date

    # These are meant to point to nodes describing human role types like Artist, Parent, User. IDs feels like an
    # unsatisfactory way to do this. Maybe should be a dynamic value, or an enum of such allowed types...but how? 
    personas: [Persona!]

    id: ID!
  }

  type MediaSource {
    format: DIGITALMEDIAFORMAT
    url: String!
    # raw: BinaryFile | FileStream ????
    # streamingUrl ?
  }

  type Artist implements Node & Persona {
    name: String!
    credits: [Work!]! # You're not an artist until you have a credit.
    memberOf: [ArtistGroup!]

    id: ID!
    uniquePerson: Person!  
  }

  type GroupMember {
    role: String! # e.g. "secretary", "right fullback", "lead guitarist"
    datesActive: String # Actually should be a collection of DateRange objects
    is: Persona!
    name: String
  }
  
  type ArtistGroup implements Node {
    # Name is required because free colloborations between artists can be expressed as just array values, e.g. authors: [Author]
    name: String!
    members: [GroupMember!]!
    credits: [Work!]! # You're not a group until you have a credit.

    id: ID!
  }

  union ArtistOrGroup = Artist | ArtistGroup

  interface Work {
    title: String
    description: String
    creators: [ArtistOrGroup!]!
    contributors: [GroupMember] # e.g. engineers, producers, tech crew, agents, lawyers  
    creationDate: Date
    debutDate: Date # = when first published/released/performed. Could create a Debut type?
    mediaTags: [ARTISTICMEDIUM!]!
    genreTags: [String!]
  }

  # A performance could be live or recorded
  interface Performance {
    performers: [ArtistOrGroup!]!
  }

  type Track implements Node & Work & Performance {
    releaseDate: Date # (might be an unreleased track)
    sourceFiles: [MediaSource!]!
    url: String # resolver tries to return the one for the file of requested format, from sourceFiles

    id: ID!
    title: String
    description: String
    creators: [ArtistOrGroup!]!
    creationDate: Date
    debutDate: Date
    mediaTags: [ARTISTICMEDIUM!]! # How to automate/require MEDIUM.MUSIC value?
    genreTags: [String!]
    performers: [ArtistOrGroup!]!
    contributors: [GroupMember] 
  }

  type Album implements Node & Work & Performance {
    tracks: [Track!]!

    id: ID!
    title: String
    description: String
    creators: [ArtistOrGroup!]!
    creationDate: Date
    debutDate: Date
    mediaTags: [ARTISTICMEDIUM!]! # How to automate/require MEDIUM.MUSIC value?
    genreTags: [String!]
    performers: [ArtistOrGroup!]!
    contributors: [GroupMember] 
  }

  type Dance implements Node & Work & Performance {
    choreographers: [Artist!]!

    id: ID!
    title: String
    description: String
    creators: [ArtistOrGroup!]!
    creationDate: Date
    debutDate: Date
    mediaTags: [ARTISTICMEDIUM!]! # How to automate/require MEDIUM.DANCE value?
    genreTags: [String!]
    performers: [ArtistOrGroup!]!
    contributors: [GroupMember] 
  }

  # This should probably be renamed to distinguish it from a visual art show. Maybe call it "LiveShow"?
  type Show implements Node & Work & Performance {
    venue: Venue! # Need to make this accomodate synchronized multi-location shows.  
    date: Date!

    id: ID!
    title: String
    description: String
    creators: [ArtistOrGroup!]!
    creationDate: Date
    debutDate: Date
    mediaTags: [ARTISTICMEDIUM!]!
    genreTags: [String!]
    performers: [ArtistOrGroup!]!
    contributors: [GroupMember] 
  }
  
  type Contact {
    person: Person
    deviceType: CONTACTDEVICETYPE
    detail: String! # number or address
  }
  
  type Venue implements Node {
    name: String!
    address: String!
    decription: String,
    contacts: [Contact!]
    
    id: ID!
  }
  type Mutation {
    _dummy: Boolean
  }
`;

