const express = require('express');
const app = express();
const storage = require('node-persist');

// initializing node-persist
storage.init();
app.use(express.json())

// populating students via postman.

app.post('/createStudent',async(req,res)=>
{

    const students = req.body;
    await storage.setItem('students',students);
    res.send(req.body);
})

// Id will be dynamically passed along with our url

app.get('/student/:id',async (req,res)=>
{
    const id= parseInt(req.params.id);
    console.log(req.params)
    const allStudents = await storage.getItem('students')
    let html = `<h1>Student detail</h1>`
    const student = allStudents.filter(student=>id===student.id);

    console.log(student);

    student.forEach((studentObject)=>
    {
        html+=`<h2>Student id:${studentObject.id}</h2>`
        html+=`<h2>Name:${studentObject.name}</h2>`
        html+=`<h2>GPA:${studentObject.gpa}</h2>`
    })
    res.send(html)
})

// Getting all students details
app.get('/allStudents',async(req,res)=>
{
    let html = `<h1>All students data!</h1>`
    const allStudents = await storage.getItem('students')
    allStudents.forEach((student)=>
    {
        html+= `
        <h2>Student id:${student.id}</h2>
        <h2>Name:${student.name}</h2>
        <h2>GPA:${student.gpa}</h2>
        <hr>
        `
    })
    res.send(html);
})

//  Getting the topper student
app.get('/topper',async(req,res)=>
{
    const allStudents = await storage.getItem('students')
    const allGPAs = allStudents.map(a=>a.gpa);
    let highest = allGPAs[0];
    for (var i = 0; i < allGPAs.length; i++) 
    {
        if (highest < allGPAs[i] ) 
        {
            highest = allGPAs[i];
        }
    }

    console.log(highest);

    const topper = allStudents.filter((student)=>
    {
        return student.gpa === highest ? student : null
    })

    let html = `<h1>Student detail</h1>`
    topper.forEach((topperObject)=>
    {
        html+=`
        <h2>Student id:${topperObject.id}</h2>
        <h2>Name:${topperObject.name}</h2>
        <h2>GPA:${topperObject.gpa}</h2>
        `
    })
    res.send(html);
})

app.listen(5000, () => {
  console.log('Server is listening on the port 5000....')
})