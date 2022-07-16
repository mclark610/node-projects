const { graphql } = require("graphql");
const { schema } = require("../components/graphql/loadSchemas.js");
const db = require('../models/index.js');


afterAll(async () => {
  db.sequelize.close();
});

test("Retrieve all Parts using graphql", async () => {
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
  console.log("note 1 result is : " + JSON.stringify(result));
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
//console.log("result is : " + JSON.stringify(result));
  expect(result.data.note).toBeDefined();

});
