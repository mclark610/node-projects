const { graphql } = require("graphql");
const { schema } = require("../src/components/graphql/loadSchemas.js");
const db = require('../src/models/index.js');
const logger = require('../src/modules/logger');

afterAll(async () => {
  db.sequelize.close();
});

test("Retrieve all Parts using graphql", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      {
        parts {
          id
          name
          description
          vendor
          part_nbr
          price
          image_filename
          doc_filename
          status
          createdAt
        }
      }
      `,
  });
  expect(result.data.parts).toBeDefined();
});


// Retrieve part(1)
test("get part(1) from graphql", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      {
        part(id:1) {
          ... on Part {
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
  logger.info("part 1 result is : " + JSON.stringify(result));
  expect(result.data.part).toBeDefined();
});

// Retrieve part(2)
test("get part(2) from graphql", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      {
        part(id:2) {
          ... on Part {
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
  expect(result.data.part).toBeDefined();

});
test("create Part mutation test", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      mutation AddPart {
        createPart(projectID:-1, partName:"myPartName",partDescription:"vdescription",partNumber:"vpart_nbr",partStatus:1,partPrice:0.00,partVendor:"vvendor",partImageFile:"vimagefile",partNoteFile:"vnotefile") {
          part_id
        }
      }
      `,
  })
  logger.info("***********************************")
  logger.info("createPart result: " + JSON.stringify(result));
  logger.info("***********************************")
});

test("create Document for Part mutation test", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      mutation AddDocumentNote {
        createDocForPart(partID:1, docFilename:"myDocumentPath") {
          id
        }
      }
      `,
  })
  logger.info("***********************************")
  logger.info("createPart result: " + JSON.stringify(result));
  logger.info("***********************************")
});

test("create Image for Part mutation test", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      mutation AddImageNote {
        createImageForPart(partID:1, imageFilename:"myImageFilePath") {
          id
        }
      }
      `,
  })
  logger.info("***********************************")
  logger.info("createPart result: " + JSON.stringify(result));
  logger.info("***********************************")
});

test("update Part mutation test", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      mutation DoPart {
        updatePart(partID: 5, partName:"Hyundai",partDescription:"Grey Elantra", partNumber: "GLS",partImageFilename: null, partDocFilename: null,partStatus:1,partPrice:13995.32,partVendor:"Hyundai") {
          id
        }
      }
      `,
  });
  logger.info("***********************************")
  logger.info("updatePart result: " + JSON.stringify(result));
  logger.info("***********************************")
});

test("update Part Status mutation test", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      mutation DoPart {
        updatePartStatus(partID: 5, partStatus:1)  {
          id
        }
      }
      `,
  });
  logger.info("***********************************")
  logger.info("updatePart Status result: " + JSON.stringify(result));
  logger.info("***********************************")
});

test("remove Part from Project mutation test", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      mutation DoPart {
        removePartFromProject(projectID: 5, partID: 8) {
          id
        }
      }
      `,
  });
  logger.info("***********************************")
  logger.info("removePartFromProject result: " + JSON.stringify(result));
  logger.info("***********************************")
});

test("associate Part with Project mutation test", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      mutation DoPart {
        associatePartWithProject(projectID: 5, partID: 8) {
          id
        }
      }
      `,
  });
  logger.info("***********************************")
  logger.info("associatePartWithProject result: " + JSON.stringify(result));
  logger.info("***********************************")
});
