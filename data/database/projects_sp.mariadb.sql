CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`associate_part_with_project`(projectid integer, partid integer)
begin
	insert into project_part ( project_id, part_id) values (projectid,partid);
end;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`associate_part_with_task`(taskid integer, partid integer)
begin
	insert into task_part ( part_id,task_id ) values (partid,taskid);
end;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`associate_task_with_project`(projectid integer, taskid integer)
begin
	insert into project_task ( project_id, task_id) values (projectid,taskid);
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
  
  SELECT @note_id;
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
  
  SELECT @note_id;
end;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`create_part`(
    in project_id integer,
    in name varchar(128), 
    in description text,
    in part_nbr varchar(48),
    in status int,
    in price numeric(5,2),
    in vendor varchar(128),
    in imagefile varchar(255),
    in notefile varchar(255),
    inout new_part_id integer
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
  SET new_part_id = @lastID;
 
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
   @lastID as 'part_id',
   LAST_INSERT_ID() as 'project_id';
  
END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`create_task`(
    in project_id integer,
    in name varchar(128), 
    in description text,
    in status int,
    in complete boolean,
    inout new_task_id integer
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
END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`delete_part_from_task`(
    in vpartid integer,
    In vtaskid integer
  )
BEGIN
	delete from 
	  task_part
	where
	  task_id = vtaskid
	  and part_id = vpartid;
END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`delete_project`(
    in vprojectid integer
  )
BEGIN
	delete from
	  projects
	where 
	  id = vprojectid; 
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
END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`remove_part_from_project`(partid integer, projectid integer)
begin
	delete from project_part where partid = partid and projectid=projectid;
end;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`remove_task_from_project`(taskid integer, projectid integer)
begin
	delete from project_task where task_id = taskid and project_id=projectid;
end;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`retrieve_all_parts`()
begin
	select
	  p.id as 'Part ID',
 	  p.name as 'Part Name',
 	  p.description as 'Part Description',
	  p.status as 'Part Status',
	  p.complete,
	  p.createdAt,
	  p.updatedAt	
	from
	  parts p;
end;

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
	  p.id as 'Part ID',
 	  p.name as 'Part Name',
 	  p.description as 'Part Description',
	  pr.status as 'Part Status',
	  pr.complete,
	  pr.createdAt,
	  pr.updatedAt	
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
	  pr.id as 'Project ID',
	  pr.part_id as  'Part (Project information)',
 	  p.name as 'Project Name',
 	  p.description as 'Project Description',
	  pr.status as 'Project Status',
	  pr.complete,
	  pr.createdAt,
	  pr.updatedAt	
	from
	  projects pr
    inner join parts p on p.id = pr.part_id
   where
     pr.id = project_id;
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
	  n.dateDue,
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
	  t.id as 'Task ID',
 	  t.name as 'Task Name',
 	  t.description as 'Task Description',
	  t.status as 'Task Status',
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

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`update_part`(
    in vpartid integer,
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
  END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`update_project_status`(
  vprojectid int,
  vstatus enum('active','inactive')
)
BEGIN 
	update
	  projects 
	set status = vstatus
	WHERE 
		id = vprojectid;	  
END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`update_task`(
    in vtaskid integer,
    in vname varchar(128), 
    in vdescription text,
    in vstatus int,
    in vcomplete boolean
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

  END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`update_task_complete`(
  vtaskid integer,
  vcomplete integer
)
BEGIN
	update task
	  set complete = vcomplete,
	  updatedAt = now()
	where
	  id=vtaskid;
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
END;

CREATE PROCEDURE projects.update_note
(
  in vnote_id integer,
  in vname varchar(128),
  in vdescription text,
  in vimage_filename varchar(255),
  in vdoc_filename varchar(255),
  in vstatus int,
  in vcomplete int
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
	  complete=vcomplete,
	  updatedAt=now()
	where
	  id=vnote_id;
END;

CREATE PROCEDURE projects.delete_note
( 
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
END;

CREATE DEFINER=`root`@`%` PROCEDURE `projects`.`retrieve_projects` ()
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
end ;