import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { BsFillTrash3Fill } from 'react-icons/bs';
import { GrAddCircle } from 'react-icons/gr';
import { Column, Id, Task } from "./types";
import { useMemo, useState } from "react";
import KanbanCard from "./KanbanCard";
import { Button } from "@mui/material";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;

  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void; 
  tasks: Task[];
}

function KanbanLane({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}: Props) {
  const [editMode, setEditMode] = useState(false);
  const [mouseIsOver, setMouseIsOver] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const useStyle = {
    Button: {
        backgroundColor: '#eee4f7',
        color: 'black',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '10px',
        margin: 1,
        boxShadow: '2px 2px 2px #D0D0D0',
        
      "&:hover": {
        backgroundColor: "#dbbff4 !important",
        color: 'black',
        boxShadow: "2px 2px 2px #D0D0D0 !important",
      },
      "&:active": {
        boxShadow: "none !important",
        backgroundColor: "#3c52b2 !important",
      },
    },
  };

  const style = {
    backgroundColor: '#F3F3F2',
    borderRadius: 4,
    justifyContent: 'center',
    padding: 15,
    margin: 15,
    boxShadow: '2px 2px 2px #E3E3E3',
    
  };
  

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={{backgroundColor: 'red', opacity: 40, border: 2, borderColor: 'pink', display: 'flex'}}
      ></div>
    );
    
  }

  return (
    
    <div
      ref={setNodeRef}
      style={style}
    >
      {/* Column title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        onMouseEnter={() => {
            setMouseIsOver(true);
          }}
          onMouseLeave={() => {
            setMouseIsOver(false);
          }}
        style={{fontWeight: 'bold'}}
      >
        <div>
          <div>
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        {mouseIsOver && (
        <Button sx={useStyle.Button}
          onClick={() => {
            deleteColumn(column.id);
          }}
        >
          <BsFillTrash3Fill />
        </Button>
        )}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, paddingBottom: 10, margin: 5}}>
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      <Button sx={useStyle.Button}
          onClick={() => {
            createTask(column.id);
          }}
          >
            <GrAddCircle style={{paddingRight: 10}}/>
            Add Task
          </Button>
    </div>
  );
}

export default KanbanLane;