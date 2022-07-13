
const projects = [
  { id: 1, part_id: 1, status: 1, complete: 1},
  { id: 2, part_id: 2, status: 1, complete: 1},
];

const parts = [
  {id: 1,name:'Ranger',part_nbr: 'XLT',price:0.00,description:'Awesome truck', vendor: 'Ford'},
  {id: 2,name:'Elantra',part_nbr: 'GLS',price:0.00,description:'Awesome car', vendor: 'Hyundai'},
  {id: 3,name:'Oil:5-20',part_nbr:'Mobil1',price:14.97,description:'Mobil 1',vendor:'Mobil'},
  {id: 4,name:'Oil Filter',part_nbr:'PH3600',price:6.00,description:'Fram',vendor:'Autozone'},
  {id: 5,name:'Oil Filter',part_nbr:'HY101',price:7.95,description:'Hyundai',vendor:'Dealer'},
  {id: 6,name:'Honda Generator',part_nbr:'3500GX',price:0.00,description:'Honda Generator',vendor:'Honda'},
];

const project_part = [
  {project_id: 1, part_id: 3},
  {project_id: 1, part_id: 4},
  {project_id: 2,part_id: 3},
  {project_id: 2, part_id:5},
];

module.exports = {projects,parts,project_part};