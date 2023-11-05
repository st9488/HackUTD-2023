import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { BsFillTrash3Fill } from 'react-icons/bs';
import { GrAddCircle } from 'react-icons/gr';
import { Column, Id, Task } from "./types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import KanbanCard from "./KanbanCard";
import { Button } from "@mui/material";
import { withStyles } from "@material-ui/core";

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
    transform,
    transition,
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
        backgroundColor: '#E5F4FF',
        color: 'black',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '10px',
        
      "&:hover": {
        backgroundColor: "#A9DAFF !important",
        color: 'black',
        boxShadow: "none !important",
      },
      "&:active": {
        boxShadow: "none !important",
        backgroundColor: "#3c52b2 !important",
      },
    },
  };

//   const StyledButton = withStyles({
//   root: {
//     color: 'black',
//     backgroundColor: 'black',
//     justifyContent: 'center',
//     textAlign: 'center',
//     '&:hover': {
//       color: 'pink',
//       backgroundColor: 'red',
//   },
// }})(Button);

  const style = {
    backgroundColor: '#E7E7E7',
    borderRadius: 4,
    justifyContent: 'center',
    padding: 15,
    // transition,
    // transform: CSS.Transform.toString(transform),
  };
  

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={{backgroundColor: 'red', opacity: 40, border: 2, borderColor: 'pink', display: 'flex'}}
    //     className="
    //   bg-columnBackgroundColor
    //   opacity-40
    //   border-2
    //   border-pink-500
    //   w-[350px]
    //   h-[500px]
    //   max-h-[500px]
    //   rounded-md
    //   flex
    //   flex-col
    //   "
      ></div>
    );
    
  }

  return (
    
    <div
      ref={setNodeRef}
      style={style}
//       className="
//   bg-columnBackgroundColor
//   w-[350px]
//   h-[500px]
//   max-h-[500px]
//   rounded-md
//   flex
//   flex-col
//   "
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
    //     className="
    //   bg-mainBackgroundColor
    //   text-md
    //   h-[60px]
    //   cursor-grab
    //   rounded-md
    //   rounded-b-none
    //   p-3
    //   font-bold
    //   border-columnBackgroundColor
    //   border-4
    //   flex
    //   items-center
    //   justify-between
    //   "
      >
        <div 
        //className="flex gap-2"
        >
          <div
        //     className="
        // flex
        // justify-center
        // items-center
        // bg-columnBackgroundColor
        // px-2
        // py-1
        // text-sm
        // rounded-full
        // "
          >
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
            //   className="bg-black focus:border-rose-500 border rounded outline-none px-2"
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
        //   className="
        // stroke-gray-500
        // hover:stroke-white
        // hover:bg-columnBackgroundColor
        // rounded
        // px-1
        // py-2
        // "
        >
          <BsFillTrash3Fill />
        </Button>
        )}
      </div>

      {/* Column task container */}
      <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, paddingBottom: 10}}>
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
      {/* Column footer */}
      <Button sx={useStyle.Button}
        //   style={{backgroundColor: '#D2EDFF', justifyContent: 'center', textAlign: 'center', color: 'black'}}
          onClick={() => {
            createTask(column.id);
          }}
          >
            <GrAddCircle style={{paddingRight: 10}}/>
            Add Task
          </Button>
      {/* <button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
        onClick={() => {
          createTask(column.id);
        }}
      >
        <GrAddCircle />
        Add task
      </button> */}
    </div>
  );
}

export default KanbanLane;