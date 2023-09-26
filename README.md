# Event Trigger Server

This project must work in conjunction with [audit-trigger](https://github.com/herzog0/audit-trigger).  
This service aims to provide similar functionality to that of Hasura Event Triggers, where Hasura creates an 
audit schema alongside your main database schema and enables you to select specific columns and tables to listen to.  
After choosing your tables and columns, the engine creates a trigger to run after CRUD operations, that inserts them 
in a new `audit` schema, for event sourcing.  
  
Currently, the project is very simple and narrow in features, but the ultimate goal is to provide a reliable 
replacement for this scarce requirement in the tech community. Although you could use hasura for this, there's not 
a lot of room for improvement to the engine right now, in terms of features. Also, their pricing model turned bananas.  

### Description

At the server startup, the following procedures are made:

1) A connection to the database is made;
2) The server searches for unprocessed lines in the database and process all of them;
3) The server tries to create a notification trigger function for new entries in the `audit.event_queue` table,
   if it doesn't already exist;
4) The server initiates a PubSub connection with Postgres, listening for events and processing them;

The current standard behavior of the event processor is to simply deliver the event payload to an endpoint, 
and update the record stating the error or the success.  

## Running

#### Development

```shell
$ npm run dev
```

#### Production

```shell
$ npm run build && npm run start
```

## Roadmap

- [ ] Concurrent servers
- [ ] Fix race condition between the server initialization and the start of the listener
- [ ] Take connections from a connection pool
- [ ] Web interface
- [ ] Allow customization of behaviors of the event processor

