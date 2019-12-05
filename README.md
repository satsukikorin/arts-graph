# Arts-Graph

Author: Colin May (email: satsukikorin@gmail.com)

Arts-Graph is GraphQL server for data about artists, their associations, their works, genres, etc.

This project was conceived as a vehicle for me (Colin) to learn GraphQL and basic database management. 
I play band-based music and figured I could make use of that domain knowledge to build a realistic 
application. 

The code is written in NodeJS using natively the recent (circa 2019) ES6+ syntax including module imports
via ```import ... from ...```.  

## The arts domain

Each real human being is unique, but also has a variety of roles or personas under which they operate
in the world: family member, team member, worker, lover, owner, customer, farmer, hunter, etc., etc. 
"Artist" is one such persona type. A person can have multiple personas of the same type,
and artists often do, since artists often go by aliases. Our graph needs to be able to relate differently
aliased personas to their respective unique humans so that 1) we can trace an (artist) person's entire body of  
work under all any aliases, and 2) artists working under the same name, e.g. in different fields or time periods, 
can be distinguished.

Artists often form named associations or groups under which their collaborative work is recognized. Any group member
has a label-able or describable role, even if in the vague cases it's just "member" or "collaborator".    

Fundamentally, artists and artist groups only exist as such if they have produced some artistic work. 
Works are completed at some point in time, or at least have a date of last modification. 
They may be released, published and/or debuted at a particular time and (usually?) 
place, but sometimes they are not released publicly—they just live in someone's bedroom or workshop or hard drive. 
Works usually but not necessarily have titles—they can still be recognized by combination of creator, creation date,
creation location, etc. (Could multiple untitled works be created simultaneously by the same creator and need to be
distinguished? That could be tough to model.) 

Works come in all forms—durable, ephemeral, live, recorded, static, mobile, etc., in many possible media, often
mixed. Our graph must accommodate and facilitate search by those various classifications. Furthermore, works may 
come in multiple editions or versions and we need to be able to trace those connections. 
 
Works are often collected as, for example, albums or anthologies. A given work may belong to more than one
one collection, such as a song recording that is released first on a regular album, then later in a greatest hits 
anthology. 

In addition to the author-creators, works of arts may have performers and other contributors (producers, engineers, 
tech crew, agents and so on and on). Those non-creator, non-performer contributors are non-Artist personas traceable
to unique humans (who may or may not also have Artist personas).

This schema is an abstraction, but the graph data should point to or even include real works, e.g. recordings or
electronic images (via links or actual binaries), actual texts and/or ISBN's of literature, etc.  