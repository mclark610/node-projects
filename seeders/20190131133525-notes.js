'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('notes', [
          {
              maintain_id: 1,
              name: "air filter",
              description: `replace air filter
                loosen the acorn nut and pull off the cover-remove
                squirt oil and work into foam
                replace cover.
              `,
              image_filename: "/dnload/images/test.png",
              doc_filename: null,
              status: 'active',
              complete: false
          }, {
              maintain_id: 1,
              name: "oil",
              description: `change oil:
                remove 7/16 square nut at base of engine and drain into pan.
                replace with pennzoil 30wt
                tighten 7/16 nut at base of engine
              `,
              image_filename: null,
              doc_filename: null,
              status: 'active',
              complete: false
          }, {
              maintain_id: 1,
              name: "wash",
              description: `cleanup:
                remove dirt using scrub brush and power washer.
              `,
              image_filename: null,
              doc_filename: null,
              status: 'active',
              complete: false
          }, {
              maintain_id: 3,
              name: "oil",
              description: `change oil:
                remove 7/16 square nut at base of engine and drain into pan.
                replace with pennzoil 30wt
                tighten 7/16 nut at base of engine
              `,
              image_filename: null,
              doc_filename: null,
              status: 'active',
              complete: false
          },

      ], {})
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('notes', null, {});
  }
};
