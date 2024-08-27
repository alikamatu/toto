"use client"
import Todo from "@/Components/Todo";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {

    const [formData, setFormData] = useState({
        title: "",
        description: ""
    });

    const [todoData, setTodoData] = useState([]);

    const fetchData = async () => {
        const response = await axios('/api');
        setTodoData(response.data.todos)
    }

    const DeleteTodo = async (mongoId) => {
        const response = await axios.delete("/api", {
            params: {
                mongoId: mongoId
            }
        })
        console.log("Task Deleted");
        fetchData();
    }

    const completeTodo = async (id) => {
        const response =  await axios.put("/api", {}, {
            params: {
                mongoId: id
            }
        })
        console.log(response.data.msg);
        fetchData();
    }

    useEffect(() => {
        fetchData();
    },[] )

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData(form => ({...form,[name]:value}));
        console.log(formData);
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api', formData);
            console.log(response.data.msg);
            setFormData({
                title: "",
                description: ""
            })
            await fetchData();
        } catch (error) {
            console.log("Error");
            
        }
    }

  return (
    <div className="">
    <form onSubmit={onSubmitHandler} className="flex items-start flex-col gap-5 w-[80%] max-w-[600px] mt-24 px-2 mx-auto">
      <input value={formData.title} onChange={onChangeHandler} type="text" name="title" placeholder="Enter title" className="px-3 py-2 border-2 rounded-lg dark:bg-gray-700 text-gray-50 w-full focus:outline-none" />
      <textarea value={formData.description} onChange={onChangeHandler} name="description" placeholder="Enter descriptioon" className="px-4 py-2 border-2 w-full hover:outline-none rounded-lg dark:bg-gray-700 text-white"></textarea>
      <button type="submit" className="bg-orange-600 py-3 px-8 rounded-xl text-white hover:bg-black">Add Todo</button>
    </form>
<div className="relative overflow-x-auto mt-24 w-[60%] mx-auto rounded-3xl">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Id
                </th>
                <th scope="col" className="px-6 py-3">
                    Title
                </th>
                <th scope="col" className="px-6 py-3">
                    Description
                </th>
                <th scope="col" className="px-6 py-3">
                    Status
                </th>
                <th scope="col" className="px-6 py-3">
                    Actions
                </th>
            </tr>
        </thead>
        <tbody>
           {todoData.map((items, index) => {
            return <Todo key={index} id={index} title={items.title} description={items.description} complete={items.isComplete} mongoId={items._id}
            DeleteTodo={DeleteTodo} completeTodo={completeTodo} />
           })}
        </tbody>
    </table>
</div>
    </div>
  );
}
