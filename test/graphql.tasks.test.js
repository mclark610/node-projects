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
        tasks {
          id
          name
          description
          status
          createdAt
        }
      }
      `,
  });
  expect(result.data.tasks).toBeDefined();
});


// Retrieve task(1)
test("get task(1) from graphql", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      {
        task(id:1) {
          ... on Task {
              name
              description
              status
              parts {
                name
                description
              }
        }
        ... on ErrorResults {
          errorID
          errorMessage
        }
      }
      }
      `,
  });
  console.log("task 1 result is : " + JSON.stringify(result));
  expect(result.data.task).toBeDefined();
});

// Retrieve task(2)
test("get task(2) from graphql", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      {
        task(id:2) {
          ... on Task {
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
  expect(result.data.task).toBeDefined();

});


test("create Task mutation test", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      mutation DoTask {
        createTask(projectID:1, taskName:"clean rims",taskDescription:"give the wheels a good scrubbing", taskStatus:1,taskComplete:0) {
          id
        }
      }
      `,
  });
  console.log("***********************************")
  console.log("createTask result: " + JSON.stringify(result));
  console.log("***********************************")
});
