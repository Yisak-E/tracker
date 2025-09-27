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
    quantity:0.0,
    nutrient:{
        carbs: 0.0,
        fat:0.0,
        protein:0.0,
        calories:0.0,
        cholesterol:0.0,
        sodium:0.0,
    }
});

const handleMainChange = (e) => {
    const { name, value } = e.target;
    setMealDetails(prevState => ({
        ...prevState,
        [name]: value
    }));
};


const handleChange = (e) => {
    const { name, value } = e.target;

    setMealDetails(prevState => {
        // Check if it's a nested nutrient property
        if (name.startsWith('nutrient.')) {
            const nutrientField = name.split('.')[1];
            return {
                ...prevState,
                nutrient: {
                    ...prevState.nutrient,
                    [nutrientField]: value
                }
            };
        }

        // Regular top-level property
        return {
            ...prevState,
            [name]: value
        };
    });
};

    const logMeal = async () => {
      try {
        await addDoc(collection(db, "nutrition"), ()=>(mealDetails));
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    };

    return (
        <div className="flex flex-row mx-auto bg-amber-100 lg:w-2/3 rounded-lg p-4">

            <form className="flex flex-col " onSubmit={logMeal}>
                <h3 className={'text-center text-2xl font-serif'}>Log meal</h3>
                    <div className={'flex flex-row justify-center '}>
                        <label htmlFor={'foodName' }
                                className={'my-auto text-lg font-bold w-40'}
                        >Food Name: </label>
                        <input type="text"
                               name="foodName"
                               id="foodName" placeholder="Enter food name..."
                        className={'bg-gradient-to-br from-gray-500 to-white h-12 rounded-lg w-50 lg:w-100 text-black'}
                        />

                    </div>

                <div className={'flex flex-row justify-center mt-3 p-0'}>
                        <label htmlFor={'mealType' }
                                className={'my-auto text-lg font-bold w-40 text-left'}
                        >Meal Type: </label>
                        <select name="mealType" id="mealType"

                        className={'bg-gradient-to-br from-gray-500 to-white h-12 text-center text-lg rounded-lg w-50 lg:w-100 text-black'}
                        >
                            <option value="breakfast" >BreakFast</option>
                            <option value="lunch">Lunch</option>
                            <option value="snack">Snack</option>
                            <option value="dinner">Dinner</option>
                            <option value="other">Other</option>
                        </select>

                    </div>

                <div className={'flex flex-row justify-center mt-3 p-0'}>
                    <label htmlFor={'quantity'}
                    className={'my-auto text-lg font-bold w-40 text-left'}
                    >Quantity: </label>
                    <input type="number" name={'quantity'}
                        value={mealDetails.quantity}
                           onChange={handleMainChange}
                           required={true}
                           className={'bg-gradient-to-br from-gray-500 to-white h-12 text-center text-lg rounded-lg w-50 lg:w-100 text-black'}
                    />
                </div>

                <div className={'flex flex-row justify-center mt-3 p-0'}>
                     <label htmlFor={'carbs'}
                    className={'my-auto text-lg text-gray-800 italic font-mono font-bold w-40 text-left'}
                    > carbs: </label>
                    <input type="number" name={'carbs'}
                        value={mealDetails.nutrient.carbs}
                           onChange={handleChange}
                           required={true}
                           className={'bg-gradient-to-br from-gray-500 to-white h-12 text-center text-lg rounded-lg w-50 lg:w-100 text-black'}
                    />
                </div>


                <div className={'flex flex-row justify-center mt-3 p-0'}>
                     <label htmlFor={'fat'}
                    className={'my-auto text-lg text-gray-800 italic font-mono font-bold w-40 text-left'}
                    > fat: </label>
                    <input type="number" name={'fat'}
                        value={mealDetails.nutrient.fat}
                           onChange={handleChange}
                           required={true}
                           className={'bg-gradient-to-br from-gray-500 to-white h-12 text-center text-lg rounded-lg w-50 lg:w-100 text-black'}
                    />
                </div>

                <div className={'flex flex-row justify-center mt-3 p-0'}>
                     <label htmlFor={'protein'}
                    className={'my-auto text-lg text-gray-800 italic font-mono font-bold w-40 text-left'}
                    > protein: </label>
                    <input type="number" name={'protein'}
                        value={mealDetails.nutrient.protein}
                           onChange={handleChange}
                           required={true}
                           className={'bg-gradient-to-br from-gray-500 to-white h-12 text-center text-lg rounded-lg w-50 lg:w-100 text-black'}
                    />
                </div>

                <div className={'flex flex-row justify-center mt-3 p-0'}>
                     <label htmlFor={'calories'}
                    className={'my-auto text-lg text-gray-800 italic font-mono font-bold w-40 text-left'}
                    > calories: </label>
                    <input type="number" name={'calories'}
                        value={mealDetails.nutrient.calories}
                           onChange={handleChange}
                           required={true}
                           className={'bg-gradient-to-br from-gray-500 to-white h-12 text-center text-lg rounded-lg w-50 lg:w-100 text-black'}
                    />
                </div>
                <div className={'flex flex-row justify-center mt-3 p-0'}>
                     <label htmlFor={'cholesterol'}
                    className={'my-auto text-lg text-gray-800 italic font-mono font-bold w-40 text-left'}
                    > cholesterol: </label>
                    <input type="number" name={'cholesterol'}
                        value={mealDetails.nutrient.cholesterol}
                           onChange={handleChange}
                           required={true}
                           className={'bg-gradient-to-br from-gray-500 to-white h-12 text-center text-lg rounded-lg w-50 lg:w-100 text-black'}
                    />
                </div>

                <div className={'flex flex-row justify-center mt-3 p-0'}>
                     <label htmlFor={'sodium'}
                    className={'my-auto text-lg text-gray-800 italic font-mono font-bold w-40 text-left'}
                    > sodium: </label>
                    <input type="number" name={'sodium'}
                        value={mealDetails.nutrient.sodium}
                           onChange={handleChange}
                           required={true}
                           className={'bg-gradient-to-br from-gray-500 to-white h-12 text-center text-lg rounded-lg w-50 lg:w-100 text-black'}
                    />
                </div>


            </form>

        </div>
    )


}