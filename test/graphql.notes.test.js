const { graphql } = require("graphql");
const { schema } = require("../components/graphql/loadSchemas.js");
const db = require('../models/index.js');
const logger = require('../modules/logger');


afterAll(async () => {
  db.sequelize.close();
});

test("Retrieve all Notes using graphql", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      {
        notes {
          id
          name
          description
          image_filename
          doc_filename
          status
          createdAt
        }
      }
      `,
  });
  expect(result.data.notes).toBeDefined();
});


// Retrieve note(1)
test("get note(1) from graphql", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      {
        note(id:1) {
          ... on Note {
              name
              description
              status
        }
        ... on ErrorResults {
          errorID
          errorMessage
        }
      }
      }
      `,
  });
  logger.info("note 1 result is : " + JSON.stringify(result));
  expect(result.data.note).toBeDefined();
});

// Retrieve note(2)
test("get note(2) from graphql", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      {
        note(id:2) {
          ... on Note {
              name
              description
              status
              createdAt
          }
          ... on ErrorResults {
            errorID
            errorMessage
          }
        }
      }
      `,
  });
//logger.info("result is : " + JSON.stringify(result));
  expect(result.data.note).toBeDefined();
});


test("create Note mutation test", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      mutation DoNote {
        createNote(noteName:"cleaning rims",noteDescription:"using mothers aluminum,it works", noteImageFilename: null, noteDocFilename: null, noteStatus:1) {
          id
        }
      }
      `,
  });
  logger.info("***********************************")
  logger.info("createNote result: " + JSON.stringify(result));
  logger.info("***********************************")
});

test("update Note mutation test", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      mutation DoNote {
        updateNote(noteID: 5, noteName:"polish rims",noteDescription:"give the wheels a really good scrubbing", noteImageFilename: null, noteDocFilename: null,noteStatus:1) {
          id
        }
      }
      `,
  });
  logger.info("***********************************")
  logger.info("updateNote result: " + JSON.stringify(result));
  logger.info("***********************************")
});


test("update Note Status mutation test", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      mutation DoNote {
        updateNoteStatus(noteID: 5, noteStatus:1)  {
          id
        }
      }
      `,
  });
  logger.info("***********************************")
  logger.info("updateNote Status result: " + JSON.stringify(result));
  logger.info("***********************************")
});

test("delete Note mutation test", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      mutation DoNote {
        deleteNote(noteID: 7) {
          id
        }
      }
    `,
  });

  logger.info("***********************************");
  logger.info("deleteNote result: " + JSON.stringify(result));
  logger.info("***********************************");
});
