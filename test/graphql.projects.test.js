const { graphql } = require("graphql");
const { schema } = require("../components/graphql/loadSchemas.js");
const db = require('../models/index.js');


afterAll(async () => {
  db.sequelize.close();
});


test("get data from Project(1)", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      {
        project(id:1) {
          ... on Project {
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
            tasks {
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
  console.log("get data from graphql result: " + JSON.stringify(result));
//  expect(result.data.project).toBeDefined();
//  expect(result.data.project.part_id).toBe(1);
});


// Retrieve ALL PROJECTS
test("get all projects from graphql", async () => {
  const result = await graphql({
    schema,
    source:  /*Graphql*/ `
      {
        projects {
          id
          part_id
          part {
            name
          }
          parts {
            name
            description
          }
        }
      }
      `,
  });
  console.log("projects results are: " + JSON.stringify(result));
  expect(result.data.projects).toBeDefined();
//  expect(result.data.projects.length).toBe(5);
});

// Retrieve PROJECT(1)
test("get project(1) from graphql", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      {
        project(id:2) {
          ... on Project {
            part_id
            part {
              name
              description
            }
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
  console.log("result is : " + JSON.stringify(result));
  expect(result.data.project).toBeDefined();
});

// Retrieve PROJECT2(1)
test("get project 2 (2) from graphql", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      {
        project(id:1) {
          ... on Project {
            part_id
            part{
              name
              description
            }
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
  expect(result.data.project).toBeDefined();

});

test("create Project mutation test", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      mutation AddProject {
        createProject(projectName:"myProjectName",projectDescription:"vdescription",projectPartNumber:"vpart_nbr",projectStatus:1,projectPrice:0.00,projectVendor:"vvendor",projectImageFile:"vimagefile",projectNoteFile:"vnotefile") {
          id
          part_id
        }
      }
      `,
  })
  console.log("***********************************")
  console.log("createProject result: " + JSON.stringify(result));
  console.log("***********************************")
});
