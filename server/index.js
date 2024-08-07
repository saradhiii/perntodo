import express from 'express'
import cors from 'cors'
import pool from '../server/db.js';


const app = express();
app.use(express.json()); //req.body
app.use(cors());

//create a todo

app.post("/todos", async (req,res) => {
    try{
        const {description} = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *",
            [description]
        );
        res.json(newTodo.rows[0]);
    } catch(err){
        console.error(err.message);
        res.status(500).json({error: "internal server error"});
    }
});

//get all todos

app.get('/todos',async (req,res) =>{
    try{
        const allToDos = await pool.query("SELECT * FROM todo");
        res.json(allToDos.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).json({error: "internal server error"});
    }

});

// get a todo

app.get('/todos/:id', async (req,res) =>{
    try{
        const {id} = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1",[id]);

        res.json(todo.rows[0]);
    }catch(err){
        console.error(err.message);
    }
});

//update a todo
app.post('/todos/:id',async(req,res) =>{
    try{
        const {id} = req.params;
        const {description} = req.body;
        const updateToDo = await pool.query(
            "UPDATE todo SET description = $1 WHERE todo_id = $2",[description,id]);
        res.json("todo was updated")
    }catch(err){
        console.error(err.message);
    }
});

// delete todo

app.delete('/todos/:id', async (req,res)=>{
    try{
        const {id} = req.params;
        const deleteToDo = pool.query(
            "DELETE FROM todo WHERE todo_id = $1",[id]);
        res.json("todo was deleted succesfully");
    }catch(err){
        console.error(err.message);
    }
});









app.listen(5000, () =>{
    console.log(`server has started on port 5000`);
});