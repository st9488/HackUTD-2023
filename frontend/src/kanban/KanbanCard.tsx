import { useState } from "react";
import { BsFillTrash3Fill } from 'react-icons/bs';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { GrUpdate } from 'react-icons/gr';
import { Id, Task } from "../kanban/types";
import { useSortable } from "@dnd-kit/sortable";
import { Button, Container } from "@mui/material";
import setCompleted from "../api/set_completed";
import deleteSuggestion from "../api/delete_suggestion";

interface Props {
  task: Task;
  columnName: string;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

function toggleTaskCompletion(task: Task): Task {
  return {
    ...task,
    completed: !task.completed,
  };
}

function KanbanCard({ task, columnName, deleteTask, updateTask }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [isButtonClicked, setIsButtonClicked] = useState(task.completed);
  const [currentTask, setCurrentTask] = useState(task);

  const handleButtonClick = () => {
    setCompleted(currentTask.content, !isButtonClicked, columnName);
    setIsButtonClicked(!isButtonClicked);
    const updatedTask = toggleTaskCompletion(currentTask);
    setCurrentTask(updatedTask);
    console.log('Task marked as completed:', updatedTask);
  };

  const {
    setNodeRef,
    attributes,
    listeners,
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
    backgroundColor: isButtonClicked ? '#d9ead3' : 'white',
    borderRadius: 8,
    padding: 10,
    margin: 10,
    boxShadow: '2px 2px 2px #D0D0D0',
  };

  const useStyle = {
    Button: {
        backgroundColor: '#E5F4FF',
        color: 'black',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '10px',
        margin: '5px',
        boxShadow: '1px 1px 1px #D0D0D0',
        
      "&:hover": {
        backgroundColor: "#A9DAFF !important",
        color: 'black',
        boxShadow: "'1px 1px 1px #D0D0D0' !important",
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
      >
        <textarea
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
      onDoubleClick={toggleEditMode}
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <p 
      >
        {task.content}
      </p>

      {mouseIsOver && (
        <Container>
          <Button sx={useStyle.Button}
          onClick={() => {
            handleButtonClick()
          }}
        >
          <AiOutlineCheckCircle />
        </Button>
        <Button sx={useStyle.Button}
          onClick={() => {
            deleteTask(task.id);
            deleteSuggestion(task.content);
          }}
        >
          <BsFillTrash3Fill />
        </Button>
        </Container>
      )}
    </div>
  );
}

export default KanbanCard;

