let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskList = document.getElementById("taskList");

function render(){

taskList.innerHTML="";

tasks.forEach((task,index)=>{

let li = document.createElement("li");

li.innerHTML = `
<span class="${task.done ? "completed":""}">
${task.subject} - ${task.hours}h
</span>