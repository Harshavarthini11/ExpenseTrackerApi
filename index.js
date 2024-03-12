/*
*Expense Tracker
*
*adding a new expense ->/add-expense
*post:expense user details
*displaying existing records ->/get expense
*get
*delete an expense ->/delete expense
post:id of the entry
*updating an existing expense ->/update expense
post:id of the entry,expense details
 */
const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const{Expense}=require('./schema')
const app=express()
app.use(bodyParser.json())
async function connectToDb(){
   
   try{ 
    await mongoose.connect('mongodb+srv://harsha07:KSGeeU1jMDje4nri@cluster0.zty6gdn.mongodb.net/ExpenseTracker?retryWrites=true&w=majority&appName=Cluster0')
   console.log('DB connection established')
   app.listen(8000,function(){
       console.log('Listening on port 8000...')
   })

   }catch(error){
   console.log(error)
   console.log('couldnot establish connection')
   }
}
connectToDb()
app.post('/add-expense', async function(request,response){
  try{
   await Expense.create({
       "amount":request.body.amount ,
       "category": request.body.category,
       "date": request.body.date
   })
   response.status(201).json({
       "status":"success",
       "message":"entry created"
   })
  }catch(error){
   response.status(500).json({
       "status":"failed",
       "message":"entry not created",
       "error":error
   })
  }
})
app.get('/get-expense',async function(request,response){
    
   try{
       const expenseDetails=await Expense.find()
       response.status(200).json(expenseDetails)
   }catch(error){
       response.status(500).json({
           "status":"failed",
           "message":"could not fetch data",
           "error":error
       })

   }
})
app.patch('/update-expense/:id',async function(request,response){
   try{
     const expenseEntry=await Expense.findById(request.params.id)
   if(expenseEntry){
       await expenseEntry.updateOne({
           "amount":request.body.amount,
           "category":request.body.category,
           "date":request.body.date
        })
        response.status(200).json({
         "status":"success",
         "message":"entry update"
        })
   }else{
     response.status(404).json({
         "status":"failed",
         "message":"entry not update"
     })
       
   }
   }catch(error){
     response.status(500).json({
         "status":"failed",
         "message":"could not update data",
         "error":error
})
}
})
app.delete('/delete-expense/:id',async function(request,response){
   try{
     const expenseEntry=await Expense.findById(request.params.id)
   if(expenseEntry){
        await Expense.findByIdAndDelete(request.params.id)
        response.status(200).json({
         "status":"success",
         "message":"entry deleted"
        })
   }else{
     response.status(404).json({
         "status":"failed",
         "message":"entry not deleted"
     })
       
   }
   }catch(error){
     response.status(500).json({
         "status":"failed",
         "message":"could not delete data",
         "error":error
     })
   }
 })
 