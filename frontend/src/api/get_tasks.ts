import { Task, Column, Id } from "../kanban/types";

const getTasks = async (setTasks : React.Dispatch<React.SetStateAction<Task[]>>, setColumns : React.Dispatch<React.SetStateAction<Column[]>>) => {
    
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/2023.5.8',
        'ngrok-skip-browser-warning': true
      },
    };
    
    fetch('https://highly-boss-dodo.ngrok-free.app/get_suggestions', options)
      .then(response => response.json())
      .then(response => {
        const tasks = [];
        const columns = [];
        let taskID = 0;
        let columnID = 0;
        response.forEach((task : any, index : number) => {
            if (columns.filter((column) => column.title === task.phase).length === 0) {
                columns.push({id: columnID, title: task.phase});
                columnID++;
            }
            const newID : Id = taskID;
            tasks.push({id: newID, columnId: columns.filter((column) => column.title === task.phase)[0].id, content: task.message});
            taskID++;
        
        });
        setTasks(tasks);
        setColumns(columns);
        })
      .catch(err => console.error(err));

}

export default getTasks;