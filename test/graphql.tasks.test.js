const { graphql } = require("graphql");
const { schema } = require("../components/graphql/loadSchemas.js");
const db = require('../models/index.js');
const logger = require('../modules/logger');

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
  logger.info("task 1 result is : " + JSON.stringify(result));
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
//logger.info("result is : " + JSON.stringify(result));
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
  logger.info("***********************************")
  logger.info("createTask result: " + JSON.stringify(result));
  logger.info("***********************************")
});

test("update Task mutation test", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      mutation DoTask {
        updateTask(taskID: 5, taskName:"polish rims",taskDescription:"give the wheels a really good scrubbing", taskStatus:1,taskComplete:0) {
          id
        }
      }
      `,
  });
  logger.info("***********************************")
  logger.info("updateTask result: " + JSON.stringify(result));
  logger.info("***********************************")
});

test("update Task Complete mutation test", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      mutation DoTask {
        updateTaskComplete(taskID: 5, taskComplete:1)  {
          id
        }
      }
      `,
  });
  logger.info("***********************************")
  logger.info("updateTask Complete result: " + JSON.stringify(result));
  logger.info("***********************************")
});

test("update Task Complete Status mutation test", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      mutation DoTask {
        updateTaskStatus(taskID: 5, taskStatus:1)  {
          id
        }
      }
      `,
  });
  logger.info("***********************************")
  logger.info("updateTask Status result: " + JSON.stringify(result));
  logger.info("***********************************")
});


test("delete Task mutation test", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      mutation DoTask {
        deleteTask(taskID: 7) {
          id
        }
      }
    `,
  });

  logger.info("***********************************");
  logger.info("deleteTask result: " + JSON.stringify(result));
  logger.info("***********************************");
});
test("remove Task from Project mutation test", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      mutation DoTask {
        removeTaskFromProject(projectID: 5, taskID: 8) {
          id
        }
      }
      `,
  });
  logger.info("***********************************")
  logger.info("removeTaskFromProject result: " + JSON.stringify(result));
  logger.info("***********************************")
});

test("associate Task with Project mutation test", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      mutation DoTask {
        associateTaskWithProject(projectID: 5, taskID: 8) {
          id
        }
      }
      `,
  });
  logger.info("***********************************")
  logger.info("associateTaskWithProject result: " + JSON.stringify(result));
  logger.info("***********************************")
});