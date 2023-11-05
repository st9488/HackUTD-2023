import { useState } from "react";
import { BsFillTrash3Fill } from 'react-icons/bs';
import { Id, Task } from "../kanban/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Container } from "@mui/material";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

function KanbanCard({ task, deleteTask, updateTask }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(true);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    margin: 10,
    // transition,
    // transform: CSS.Transform.toString(transform),
  };

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

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
      //   className="
      //   opacity-30
      // bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-rose-500  cursor-grab relative
      // "
      />
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        // className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
      >
        <textarea
        //   className="
        // h-[90%]
        // w-full resize-none border-none rounded bg-transparent text-white focus:outline-none
        // "
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              toggleEditMode();
            }
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      // className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative task"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <p 
      // className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap"
      >
        {task.content}
      </p>

      {mouseIsOver && (
        <Button sx={useStyle.Button}
          onClick={() => {
            deleteTask(task.id);
          }}
          // className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100"
        >
          <BsFillTrash3Fill />
        </Button>
      )}
    </div>
  );
}

export default KanbanCard;