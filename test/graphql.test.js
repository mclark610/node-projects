const { graphql } = require("graphql");
const { schema } = require("../components/graphql/loadSchemas.js");

test("get data from graphql", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      {
        parts {
          id
          name
          description
        }
      }
    `,
  });
  // console.log("result: " + JSON.stringify(result));
  expect(result.data.parts).toBeDefined();
  expect(result.data.parts.length).toBe(6);
});

test("get part 1 fom graphql", async () => {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      {
        part(id:1) {
          id
          name
          description
        }
      }
    `,
  });
   console.log("result: " + JSON.stringify(result));
  expect(result.data.part).toBeDefined();
  expect(result.data.part.name).toBe("Ranger");
})

test("Get error if part id is invalid", async () => {
  const result = await graphql( {
    schema,
    source:`
    {
      part(id:'a') {
        id
        name
        description
      }
    }
    `,
  });

  console.log("result: " + JSON.stringify(result));
  expect(result.errors).toBeDefined();

})

