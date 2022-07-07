/* ***************************************************************************************** *
 * Test data for projects
 * ***************************************************************************************** */

-- create project
call create_project(
  'Truck',
  'Ranger Red',
  'XLT',
  1,
  0.00,
  'Ford',
  null,
  null
);

SET @new_part_id=1;

-- associate parts with project
call create_part(
  1,
  'Oil Filter',
  'FRAM',
  'PH3600',
  1,
  0.00,
  'Fram',
  null,
  null,
  @new_part_id
);

select @new_part_id;

call create_part(
  1,
  'Gas Filter',
  'Jug',
  'Wix',
  1,
  0.00,
  'Wix',
  null,
  null,
  @new_part_id
);

select @new_part_id;

call create_part(
  1,
  'Oil 5w-20',
  'Mobil',
  'Silver',
  1,
  0.00,
  'Mobil 1',
  null,
  null,
  @new_part_id
);

call create_part(
  1,
  'Oil Filter',
  'Hyundai',
  'Standard',
  1,
  0.00,
  'Hyundai',
  null,
  null,
  @new_part_id
);
-- create project
call create_project(
  'Car',
  'Elantra',
  'XLT',
  1,
  0.00,
  'Hyundai',
  null,
  null
);

call associate_part_with_project(5,4);
call associate_part_with_project(5,6);

call associate_part_with_project(1,2);
call associate_part_with_project(1,3);
call associate_part_with_project(1,4);

call associate_part_with_task(3,1);
call associate_part_with_task(4,1);

SET @new_task_id = 22;

call create_task(
  1,
  'Change Oil',
  'time to get dirty',
  1,
  0,
  @new_task_id
);

select @new_task_id

call associate_part_with_task(4,1);

call retrieve_task_parts(1);

select
  t.id,
  t.name,
  t.description
from
  tasks t
where
  t.id = 1;

select
  task_id,
  part_id
 from
   task_part tp 
 where
   tp.task_id = 1;
  
select 
	  p.id,
	  p.name,
	  p.description,
	  p.status,
	  p.complete,
	  p.createdAt,
	  p.updatedAt
 from
   parts p
 inner join task_part tp on tp.task_id = task_id



delete from tasks where id = 2;

	
alter table tasks auto_increment = 2;

call associate_part_with_task(2,1);

call associate_part_with_task(4,1);
	
call retrieve_task_parts(1);



select * from task_part;

select 
  p.name
 from parts p
inner join task_part tp on tp.task_id = 1 and 
  tp.part_id = p.id;
	

-- parts associated with project and
 -- parts assigned to tasks
 
select 
  p.name
 from parts p
inner join project_part prp on prp.project_id = 1 and 
  prp.part_id = p.id;
 
call retrieve_task_parts(1);

select  * from projects;
select * from parts;

select
  pr.id,
  pr.part_id,
  p.name,
  p.description
from
  projects pr
inner join parts p on p.id = pr.part_id;

call retrieve_project_parts(1);
call retrieve_project_parts(5);
 delete from projects where id = 6;


call create_doc_for_part
(
 5,
  'doc-file-one'
)

select * from part_note;

call retrieve_part_notes(5);

select * from part_note;

select 
	  n.id,
	  n.name,
	  n.description,
	  n.image_filename,
	  n.doc_filename,
	  n.status,
	  n.complete,
	  n.createdAt,
	  n.updatedAt,
	  np.part_id
	 from
	   notes n
	 inner join part_note np on np.note_id = n.id
	 and np.part_id=5;
	

	-- get all data.
	-- good
	select
	  pr.id as 'project id',
	  pr.part_id as 'part id',
	  p.name,
	  p.description
	from 
	  projects pr
	inner join parts p on p.id = pr.part_id;
	  

    -- good : displays all parts associated with project
	select
	  pr.id as 'project id',
	  pr.part_id as 'part id',
	  p.name,
	  p.description,
	  p2.name,
	  p2.description
	from 
	  projects pr
	inner join parts p on p.id = pr.part_id
	inner join project_part prp on prp.project_id = pr.id
	inner join parts p2 on p2.id = prp.part_id
	
	-- task list
	select
	  pr.id,
	  t.name,
	  t.description
	from
	  projects pr
	inner join project_task prt on prt.project_id = pr.id
	inner join tasks t on t.id = prt.task_id
	 
	set @mytaskid=1
	call create_task(1,'change oil','glug glug',1,0,@mytaskid);

select * from tasks;
call associate_task_with_project(1,1);

	select
	  pt.project_id as 'project_task project_id',
	  pt.task_id as 'project_task task_id',
	  t.id as 'task id',
      p.name,	    
	  t.name,
	  t.description
	from
	  tasks t
-- 	inner join task_part tp on tp.task_id = t.id
    inner join project_task pt on pt.task_id = t.id
    inner join projects pr on pr.id = pt.project_id
	inner join parts p on p.id = pr.part_id;
  
-- task parts 
select
	pr.id as 'projectID',
	p.name as 'project name',
	p.description as 'project description',
	t.id as 'taskID',
	t.name,
	t.description,
	p2.name,
	p2.description
from
	projects pr
inner join project_task prt on	prt.project_id = pr.id
inner join tasks t on	t.id = prt.task_id
inner join parts p on	p.id = pr.part_id
inner join project_part prp on	prp.project_id = pr.id
inner join parts p2 on	p2.id = prp.part_id
group by taskID

select
  t.id,
  t.name,
  t.description,
  p.name,
  p.description
 from
   tasks t
 inner join project_task prt on prt.project_id = 1
 inner join task_part tp on tp.task_id = prt.task_id
 inner join parts p on p.id = tp.part_id;

-- get all tasks associated with projectid
select pt.task_id from project_task pt where pt.project_id = 1

-- get all parts associated with above tasks
explain
select 
  p.name,
  p.description
from
  parts p
where 
  p.id in (
    select tp.part_id from task_part tp where tp.task_id in (
    	select prt.task_id from project_task prt where prt.project_id = 1
    )
  )

-- select project info
select
  pr.id,
  pr.part_id,
  p.name,
  p.description
from
  projects pr,
  parts p
where
  pr.id = 1
  and p.id = pr.part_id

  -- select active tasks
  select 
    t.name,
    t.description
  from
    tasks t
  where
    t.id in (select prt.task_id from project_task prt where prt.project_id = 1)
    
    -- select parts required
    select 
      p.name,
      p.description
    from
      parts p
    where
      p.id in ( select tp.part_id from task_part tp where tp.task_id in(select prt.task_id from project_task prt where prt.project_id = 1))
      
select 
	  t.id,
	  t.name,
	  t.description,
	  t.status,
	  t.complete,
	  t.dateDue,
	  t.createdAt,
	  t.updatedAt
	 from
	   tasks t
	 inner join project_task prt on prt.task_id = t.id 
	 and prt.project_id = 1;	

select 
	  p.id,
	  p.name,
	  p.part_nbr,
	  p.price,
	  p.description,
	  p.image_filename,
	  p.doc_filename,
	  p.vendor,
	  p.status,
	  p.complete,
	  p.createdAt,
	  p.updatedAt
	 from
	   parts p
	 inner join project_part prp on prp.part_id = p.id 
	 and prp.project_id = 1;
	 
call retrieve_task_parts(1);	
call retrieve_project_parts(1);
-- you are here.
-- need to fix retrieve_task_parts and retrieve_project_parts with select queries above.
-- thanks!!
	select 
	  p.id,
	  p.name,
	  p.part_nbr,
	  p.price,
	  p.description,
	  p.image_filename,
	  p.doc_filename,
	  p.vendor,
	  p.status,
	  p.complete,
	  p.createdAt,
	  p.updatedAt
	 from
	   parts p
    where
      p.id in ( 
       select prp.part_id from project_part prp where prp.project_id = 1
       )

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`retrieve_project_parts`(
  vproject_id int
)
begin
	select 
	  p.id,
	  p.name,
	  p.part_nbr,
	  p.price,
	  p.description,
	  p.image_filename,
	  p.doc_filename,
	  p.vendor,
	  p.status,
	  p.complete,
	  p.createdAt,
	  p.updatedAt
	 from
	   parts p
    where
      p.id in ( 
       select prp.part_id from project_part prp where prp.project_id = vproject_id
       )
end

call retrieve_project_tasks(1);
call retrieve_project(1);
call update_project(
  1,
  1,
  '1995 Ranger',
  '3.0L Maroon XLT',
  'XLT',
  1,
  0,
  0.00,
  'Ford',
  null,
  null
)
call fetch_complete_project(1);
/*
PROJECTS crud complete
  create projects : done
  retrieve projects: 
    - all projects, 
    - parts for project not assigned to tasks 
    - parts that are assigned to tasks
    - tasks assigned to project
  update projects - change project descriptive data.  
  delete 
*/
/*
 * PARTS crud complete
 * create parts: done
 * create part with project: done
 * create part for task: done
 * retrieve parts
 *   - temporarily assigned to projects until they are assigned to tasks
 *  - assigned to tasks
 *  - retrieve part notes
 * update parts: 
 *   - part data 
 *   - part status
 *   - part completed
 * delete part 
 *   - from database
 *   - from project
 *   - from task
 */
  
/*
 * TASKS crud
 * create tasks:
 * create tasks for project
 * retrieve tasks
 * 	- retrieve tasks in project
 * - retrieve task parts
 * update tasks
 * - task status
 * - task data
 * - task complete
 * delete task
 */

/*
 * NOTES crud
 * create notes 
 * retrieve note
 * retrieve_part_notes
 * retrieve_project_notes
 * update_notes
 * delete_note
 */




