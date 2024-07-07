'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('maintains', [
        {
            name: 'Air compressor',
            description: 'Honda GSX-160 on air compressor',
            part_nbr: 'GSX-160',
            status: 'active',
            complete: false
        },{
            name: 'Weed eater',
            description: '21 cc echo weed eater',
            part_nbr: 'SRE-102',
            status: 'active',
            complete: false
        },{
            name: 'Chipper',
            description: 'B&S 11hp on Sears Chipper',
            part_nbr: '11hp',
            status: 'active',
            complete: false
        }
    ], {})
  },


  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('maintains', null, {});
  }
};
