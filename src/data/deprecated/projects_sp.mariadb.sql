CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`associate_part_with_project`(projectid integer, partid integer)
begin
	insert into project_part ( project_id, part_id) values (projectid,partid);

  select projectid as 'id';
end;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`associate_part_with_task`(taskid integer, partid integer)
begin
	insert into task_part ( part_id,task_id ) values (partid,taskid);

   select partid as 'id';
end;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`associate_task_with_project`(projectid integer, taskid integer)
begin
	insert into project_task ( project_id, task_id) values (projectid,taskid);

   select taskid as 'id';
  
end;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`create_doc_for_part`(
  vpart_id int,
  doc_file varchar(255)
)
begin
  insert into notes (doc_filename) values (doc_file);
  SET @note_id = LAST_INSERT_ID();
  
 
  insert into part_note (part_id,note_id) values 
  (
    vpart_id,
    @note_id
  );
  
  SELECT @note_id as 'id';
end;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`create_image_for_part`(
  vpart_id int,
  image_file varchar(255)
)
begin
  insert into notes (image_filename) values (image_file);
  SET @note_id = LAST_INSERT_ID();
  
 
  insert into part_note (part_id,note_id) values 
  (
    vpart_id,
    @note_id
  );
  
  SELECT @note_id as 'id';
end;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`create_note`(
  vname varchar(255),
  vdescription text,
  vimage_filename varchar(255),
  vdoc_filename varchar(255),
  vstatus integer
)
BEGIN
	insert into notes
	  (name,description,image_filename,doc_filename,status)
	values
	  (vname,vdescription,vimage_filename,vdoc_filename,vstatus);
	 
	SELECT
	  LAST_INSERT_ID() as 'id';
END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`create_part`(
    in project_id integer,
    in name varchar(128), 
    in description text,
    in part_nbr varchar(48),
    in status int,
    in price numeric(5,2),
    in vendor varchar(128),
    in imagefile varchar(255),
    in notefile varchar(255)
 )
begin

   insert into parts 
     (name,description,part_nbr,status,price,vendor,image_filename,doc_filename) 
   values
   (
     name,
     description,
     part_nbr,
     status,
     price,
     vendor,
     imagefile,
     notefile
   );

  SET @lastID = LAST_INSERT_ID();
 
 INSERT INTO project_part (project_id, part_id)
   SELECT 
     project_id,
     @last_id
   WHERE
     (SELECT 1 FROM projects WHERE id = project_id) = 1;


  SELECT
   @lastID as 'part_id';
     
END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`create_project`(
    in vname varchar(128), 
    in vdescription text,
    in vpart_nbr varchar(48),
    in vstatus int,
    in vprice numeric(5,2),
    in vvendor varchar(128),
    in vimagefile varchar(255),
    in vnotefile varchar(255)
 )
begin

   insert into parts 
     (name,description,part_nbr,status,price,vendor,image_filename,doc_filename) 
   values
   (
     vname,
     vdescription,
     vpart_nbr,
     vstatus,
     vprice,
     vvendor,
     vimagefile,
     vnotefile
   );
 	
  SET @lastID = LAST_INSERT_ID();
 
 INSERT INTO projects
  (
   part_id
  )
  values
  (
    @lastID
  );
  
 SELECT
   LAST_INSERT_ID() as 'id',
   @lastID as 'part_id';
END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`create_task`(
    in project_id integer,
    in name varchar(128), 
    in description text,
    in status int,
    in complete int
 )
begin

   insert into tasks 
     (name,description,status,complete) 
   values
   (
     name,
     description,
     status,
     complete
   );

 INSERT INTO project_task (project_id, task_id)
   SELECT 
     project_id,
     LAST_INSERT_ID()
   WHERE
     (SELECT 1 FROM projects WHERE id = project_id) = 1;

   SELECT
     LAST_INSERT_ID() as 'id';
END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`delete_note`( 
vnoteid int
)
BEGIN
delete from
	  notes
	where 
	  id = vnoteid; 
  
	 delete from 
	   task_note 
	  where 
	   note_id = vnoteid;

	  delete from 
	    project_note
	  where
	    note_id = vnoteid;
	   
	   select vnoteid as 'id';
	  
END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`delete_part`(
    in vpartid integer
  )
BEGIN
	delete from
	  parts
	where 
	  id = vpartid; 
  
	 delete from 
	   task_part 
	  where 
	   part_id = vpartid;

	  delete from 
	    project_part
	  where
	    part_id = vpartid;
	   
	   select vpartid as 'id';
END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`delete_project`(
    in vprojectid integer
  )
BEGIN
	delete from
	  projects
	where 
	  id = vprojectid; 
	 
	 -- remove links to project id from 
	 -- - project_part
	 -- - project_task
	 -- - project_note
	 delete from
	   project_part
	 where
	   project_id = vprojectid;
	  
	 delete from
	   project_task
	 where
	   project_id = vprojectid;
	  
	  delete from
	    project_note
	  where
	    project_id = vprojectid;
	   
	 select vprojectid as 'id';
END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`delete_task`(
    in vtaskid integer
  )
BEGIN
	delete from
	  tasks
	where 
	  id = vtaskid; 
	 
	 delete from 
	   project_task 
	 where 
	  task_id = vtaskid;
	  
	 delete from 
	   task_part 
	  where 
	   task_id = vtaskid;
	  
	  delete from 
	    task_note
	  where
	    task_id = vtaskid;
	   
	   select vtaskid as 'id';
END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`remove_part_from_project`( projectid integer, partid integer)
begin
	delete from project_part where partid = partid and projectid=projectid;

    select projectid as 'id';
end;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`remove_task_from_project`(projectid integer, taskid integer)
begin
	delete from project_task where task_id = taskid and project_id=projectid;
    select projectid as 'id';
end;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`retrieve_all_notes`()
BEGIN
	select
	  n.id,
 	  n.name,
 	  n.description,
 	  n.image_filename,
 	  n.doc_filename,
	  n.status,
	  n.complete,
	  n.createdAt,
	  n.updatedAt	
	from
	  notes n;
END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`retrieve_all_parts`()
begin
	select
	  p.id,
 	  p.name,
 	  p.part_nbr,
 	  p.price,
 	  p.description,
 	  p.vendor,
 	  p.image_filename,
 	  p.doc_filename,
	  p.status,
	  p.complete,
	  p.createdAt,
	  p.updatedAt	
	  
	from
	  parts p;
end;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`retrieve_all_projects`(
)
begin
	select 
	  id,
	  part_id,
	  status,
	  complete,
	  createdAt,
	  updatedAt	
	from
	  projects;
end;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`retrieve_all_tasks`()
BEGIN
	select
	  t.id,
 	  t.name,
 	  t.description,
	  t.status,
	  t.complete,
	  t.createdAt,
	  t.updatedAt	
	from
	  tasks t;
END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`retrieve_note`(
  note_id int
)
begin
	select 
	  n.id as 'note ID',
 	  n.name as 'note Name',
 	  n.description as 'note Description',
	  n.status as 'note Status',
	  n.complete,
	  n.createdAt,
	  n.updatedAt	
	from
	  notes n
   where
     n.id = note_id;
end;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`retrieve_part`(
  part_id int
)
begin
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
   where
     p.id = part_id;
end;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`retrieve_project`(
  project_id int
)
begin
	select 
	  id,
	  part_id,
	  status,
	  complete,
	  createdAt,
	  updatedAt	
	from
	  projects
   where
     id = project_id;
end;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`retrieve_projects`()
begin
	select
	 pr.id,
	 pr.part_id,
	 pr.status,
	 pr.complete,
	 pr.createdAt,
	 pr.updatedAt,
	 p.name,
	 p.description
	from 
	  projects pr,
	  parts p
	where 
	  pr.part_id = p.id;
end;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`retrieve_project_notes`(
  vproject_id int
)
begin
	select 
	  n.id,
	  n.name,
	  n.description,
	  n.status,
	  n.complete,
	  n.createdAt,
	  n.updatedAt
	 from
	   notes n
	 where
	   n.id in   (SELECT note_id from project_note where project_id = vproject_id);
	  
end;

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
       );
    
end;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`retrieve_project_tasks`(
  project_id int
)
begin
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
	 and prt.project_id = project_id;	
end;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`retrieve_task`(
  task_id int
)
begin
	select 
	  t.id,
 	  t.name,
 	  t.description,
	  t.status,
	  t.complete,
	  t.createdAt,
	  t.updatedAt	
	from
	  tasks t
   where
     t.id = task_id;
end;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`retrieve_task_parts`(
  vtask_id int
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
       select tp.part_id from task_part tp where tp.task_id in (
        select prt.task_id from project_task prt where prt.task_id = vtask_id
       )
    );
end;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`update_note`(
  in vnote_id integer,
  in vname varchar(128),
  in vdescription text,
  in vimage_filename varchar(255),
  in vdoc_filename varchar(255),
  in vstatus int
)
BEGIN
	update 
	  notes
	set 
	  name=vname,
	  description=vdescription,
	  image_filename=vimage_filename,
	  doc_filename=vdoc_filename,
	  status=vstatus,
	  updatedAt=now()
	where
	  id=vnote_id;
	 
	select vnote_id;

END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`update_note_status`(
  vnoteid int,
  vstatus int
)
BEGIN 
	update
	  notes 
	set status = vstatus
	WHERE 
		id = vnoteid;	  
	
	select vnoteid as 'id';
END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`update_part`(
    in vpartid integer,
    in vname varchar(128), 
    in vdescription text,
    in vpart_nbr varchar(48),
    in vprice numeric(8,2),
    in vvendor varchar(128),
    in vstatus int,
    in vimagefile varchar(255),
    in vnotefile varchar(255)
 )
begin
  
   update parts  
	   set name = vname,
	     description = vdescription,
	     part_nbr = vpart_nbr,
	     status = vstatus,
	     price = vprice,
	     vendor = vvendor,
	     image_filename = vimagefile,
	     doc_filename = vnotefile,
	     updatedat= NOW()
   where 
      id = vpartid;

     select 
       vpartid as 'id';
      
  END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`update_part_status`(
  vpartid int,
  vstatus int 
)
BEGIN 
	update
	  parts 
	set status = vstatus
	WHERE 
		id = vpartid;	  
	
	select vpartid as 'id';
END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`update_project`(
    in vprojectid integer,
    in vpartid integer,
    in vname varchar(128), 
    in vdescription text,
    in vpart_nbr varchar(48),
    in vstatus int,
    in vcomplete int,
    in vprice numeric(5,2),
    in vvendor varchar(128),
    in vimagefile varchar(255),
    in vnotefile varchar(255)
 )
begin
  
   update parts  
	   set name = vname,
	     description = vdescription,
	     part_nbr = vpart_nbr,
	     status = vstatus,
	     price = vprice,
	     vendor = vvendor,
	     image_filename = vimagefile,
	     doc_filename = vnotefile,
	     updatedat= NOW()
   where 
      id = vpartid;

   update projects 
     set part_id = vpartid,
		status = vstatus,
		complete = vcomplete
	WHERE 
	  id = vprojectid;
	 
	 SELECT
	   vprojectid as 'id';
  END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`update_project_complete`(
  vprojectid integer,
  vcomplete integer
)
BEGIN
	update projects
	  set complete = vcomplete,
	  updatedAt = now()
	where
	  id=vprojectid;
	 
	 SELECT vprojectid as 'id';
END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`update_project_status`(
  vprojectid int,
  vstatus int
)
BEGIN 
	update
	  projects 
	set status = vstatus
	WHERE 
		id = vprojectid;	  
	
	select
	  vprojectid as 'id';
END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`update_task`(
    in vtaskid integer,
    in vname varchar(128), 
    in vdescription text,
    in vstatus int,
    in vcomplete int
 )
begin
  
   update tasks  
	   set name = vname,
	     description = vdescription,
	     status = vstatus,
	     complete = vcomplete,
	     updatedat= NOW()
   where 
      id = vtaskid;

     SELECT vtaskid as 'id';
  END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`update_task_complete`(
  vtaskid integer,
  vcomplete integer
)
BEGIN
	update tasks
	  set complete = vcomplete,
	  updatedAt = now()
	where
	  id=vtaskid;
	 
	 SELECT vtaskid as 'id';
END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`update_task_status`(
  vtaskid int,
  vstatus int
)
BEGIN 
	update
	  tasks 
	set status = vstatus
	WHERE 
		id = vtaskid;	  
	
	select vtaskid as 'id';
END;
