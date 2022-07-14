const { graphql } = require("graphql");
const { schema } = require("../components/graphql/loadSchemas.js");
const { app } = require("../server.js")
const db = require('../models/index.js');


test("get data from graphql", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      {
        project(id:1) {
          id
          part_id
          part {
            name
          }
          parts {
            name
            description
            vendor
          }
        }
      }
      `,
  });
  console.log("result: " + JSON.stringify(result));
  expect(result.data.project).toBeDefined();
//  expect(result.data.project.length).toBe(1);
});