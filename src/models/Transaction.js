import mongoose from 'mongoose';

const txSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true },
  type: { type:String, enum:['INCOME','EXPENSE'], required:true },
  category: { type:String, required:true },
  amount: { type:Number, required:true, min:0 },
  date: { type:Date, required:true },
  comment: { type:String }
},{ timestamps:true });

export default mongoose.model('Transaction', txSchema);
