import db from '../../firebaseConfig.js'
import { collection, addDoc } from "firebase/firestore";
import {useState} from "react";


export default function LogMeal({user}) {
const [foodList, setFoodList] = useState([]);
const [mealDetails, setMealDetails] = useState({
    email: user.email,
    takenTime:'',
    mealType:'',
    foodName:'',
    quantity:'',
    nutrient:{
        carbs: 0.0,
        fat:0.0,
        protein:0.0,
        calories:0.0,
        cholesterol:0.0,
        sodium:0.0,
        amount:0.0,
    }
});


    const logMeal = async () => {
      try {
        await addDoc(collection(db, "nutrition/"+user.email), ()=>(mealDetails));
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    };

    return (
        <div className="grid grid-cols-10 mx-auto bg-amber-100">
            hi
            <form className="form-horizontal" onSubmit={logMeal}>

            </form>

        </div>
    )


}