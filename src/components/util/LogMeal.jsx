import db from '../../firebaseConfig.js'
import { collection, addDoc } from "firebase/firestore";
import {useState} from "react";
import { Timestamp } from "firebase/firestore";

export default function LogMeal({user}) {
    const [foodList, setFoodList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [mealDetails, setMealDetails] = useState({
        email: user.email,
        takenTime: '',
        mealType: '',
        foodName: '',
        quantity: 0.0,
        nutrient: {
            carbs: 0.0,
            fat: 0.0,
            protein: 0.0,
            calories: 0.0,
            cholesterol: 0.0,
            sodium: 0.0,
        }
    });

    const handleMainChange = (e) => {
        const { name, value } = e.target;
        setMealDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleNutrientChange = (e) => {
        const { name, value } = e.target;
        setMealDetails(prevState => ({
            ...prevState,
            nutrient: {
                ...prevState.nutrient,
                [name]: parseFloat(value) || 0.0
            }
        }));
    };

    const logMeal = async () => {
        try {
            setLoading(true);
            setMessage('');

            // Add timestamp only when submitting
            const mealDataWithTimestamp = {
                ...mealDetails,
                takenTime: Timestamp.now() // Set timestamp here
            };

            await addDoc(collection(db, "nutrition"), mealDataWithTimestamp);
            setMessage('Meal logged successfully!');

            // Reset form - keep takenTime empty for next entry
            setMealDetails({
                email: user.email,
                takenTime: '', // Keep this empty
                mealType: '',
                foodName: '',
                quantity: 0.0,
                nutrient: {
                    carbs: 0.0,
                    fat: 0.0,
                    protein: 0.0,
                    calories: 0.0,
                    cholesterol: 0.0,
                    sodium: 0.0,
                }
            });

        } catch (e) {
            console.error("Error adding document: ", e);
            setMessage('Error logging meal. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formSubmitHandler = async (e) => {
        e.preventDefault();
        await logMeal();
    }

    return (
        <div className="flex flex-row mx-auto bg-amber-100 lg:w-2/3 rounded-lg p-4">
            <form className="flex flex-col w-full" onSubmit={formSubmitHandler}>
                <h3 className={'text-center text-2xl font-serif'}>Log meal</h3>

                {/* Success/Error Message */}
                {message && (
                    <div className={`p-3 rounded mb-4 text-center ${
                        message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                        {message}
                    </div>
                )}

                {/* Food Name */}
                <div className={'flex flex-row justify-center'}>
                    <label htmlFor={'foodName'} className={'my-auto text-lg font-bold w-40'}>
                        Food Name:
                    </label>
                    <input
                        type="text"
                        name="foodName"
                        id="foodName"
                        placeholder="Enter food name..."
                        value={mealDetails.foodName}
                        onChange={handleMainChange}
                        required
                        className={'bg-gradient-to-br from-gray-500 to-white h-12 rounded-lg w-50 lg:w-100 text-black px-3'}
                    />
                </div>

                {/* Meal Type */}
                <div className={'flex flex-row justify-center mt-3 p-0'}>
                    <label htmlFor={'mealType'} className={'my-auto text-lg font-bold w-40 text-left'}>
                        Meal Type:
                    </label>
                    <select
                        name="mealType"
                        id="mealType"
                        value={mealDetails.mealType}
                        onChange={handleMainChange}
                        required
                        className={'bg-gradient-to-br from-gray-500 to-white h-12 text-center text-lg rounded-lg w-50 lg:w-100 text-black'}
                    >
                        <option value="">Select meal type</option>
                        <option value="breakfast">BreakFast</option>
                        <option value="lunch">Lunch</option>
                        <option value="snack">Snack</option>
                        <option value="dinner">Dinner</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {/* Quantity */}
                <div className={'flex flex-row justify-center mt-3 p-0'}>
                    <label htmlFor={'quantity'} className={'my-auto text-lg font-bold w-40 text-left'}>
                        Quantity:
                    </label>
                    <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        value={mealDetails.quantity}
                        onChange={handleMainChange}
                        required={true}
                        step="0.1"
                        min="0"
                        className={'bg-gradient-to-br from-gray-500 to-white h-12 text-center text-lg rounded-lg w-50 lg:w-100 text-black'}
                    />
                </div>

                <div className={'flex flex-row mt-3 p-0'}>
                    <hr className={'w-1/5 ml-5 mr-10 my-auto'}/>
                    <p className={'w-2/5 italic'}>all of the following fields are in grams</p>
                    <hr className={'w-1/5 mx-3 my-auto'}/>
                </div>

                {/* Nutrient Fields */}
                <div className={'flex flex-row justify-center mt-3 p-0'}>
                    <label htmlFor={'carbs'} className={'my-auto text-lg text-gray-800 italic font-mono font-bold w-40 text-left'}>
                        carbs:
                    </label>
                    <input
                        type="number"
                        name="carbs"
                        id="carbs"
                        value={mealDetails.nutrient.carbs}
                        onChange={handleNutrientChange}
                        required={true}
                        step="0.1"
                        min="0"
                        className={'bg-gradient-to-br from-gray-500 to-white h-12 text-center text-lg rounded-lg w-50 lg:w-100 text-black'}
                    />
                </div>

                <div className={'flex flex-row justify-center mt-3 p-0'}>
                    <label htmlFor={'fat'} className={'my-auto text-lg text-gray-800 italic font-mono font-bold w-40 text-left'}>
                        fat:
                    </label>
                    <input
                        type="number"
                        name="fat"
                        id="fat"
                        value={mealDetails.nutrient.fat}
                        onChange={handleNutrientChange}
                        required={true}
                        step="0.1"
                        min="0"
                        className={'bg-gradient-to-br from-gray-500 to-white h-12 text-center text-lg rounded-lg w-50 lg:w-100 text-black'}
                    />
                </div>

                <div className={'flex flex-row justify-center mt-3 p-0'}>
                    <label htmlFor={'protein'} className={'my-auto text-lg text-gray-800 italic font-mono font-bold w-40 text-left'}>
                        protein:
                    </label>
                    <input
                        type="number"
                        name="protein"
                        id="protein"
                        value={mealDetails.nutrient.protein}
                        onChange={handleNutrientChange}
                        required={true}
                        step="0.1"
                        min="0"
                        className={'bg-gradient-to-br from-gray-500 to-white h-12 text-center text-lg rounded-lg w-50 lg:w-100 text-black'}
                    />
                </div>

                <div className={'flex flex-row justify-center mt-3 p-0'}>
                    <label htmlFor={'calories'} className={'my-auto text-lg text-gray-800 italic font-mono font-bold w-40 text-left'}>
                        calories:
                    </label>
                    <input
                        type="number"
                        name="calories"
                        id="calories"
                        value={mealDetails.nutrient.calories}
                        onChange={handleNutrientChange}
                        required={true}
                        step="0.1"
                        min="0"
                        className={'bg-gradient-to-br from-gray-500 to-white h-12 text-center text-lg rounded-lg w-50 lg:w-100 text-black'}
                    />
                </div>

                <div className={'flex flex-row justify-center mt-3 p-0'}>
                    <label htmlFor={'cholesterol'} className={'my-auto text-lg text-gray-800 italic font-mono font-bold w-40 text-left'}>
                        cholesterol:
                    </label>
                    <input
                        type="number"
                        name="cholesterol"
                        id="cholesterol"
                        value={mealDetails.nutrient.cholesterol}
                        onChange={handleNutrientChange}
                        required={true}
                        step="0.1"
                        min="0"
                        className={'bg-gradient-to-br from-gray-500 to-white h-12 text-center text-lg rounded-lg w-50 lg:w-100 text-black'}
                    />
                </div>

                <div className={'flex flex-row justify-center mt-3 p-0'}>
                    <label htmlFor={'sodium'} className={'my-auto text-lg text-gray-800 italic font-mono font-bold w-40 text-left'}>
                        sodium:
                    </label>
                    <input
                        type="number"
                        name="sodium"
                        id="sodium"
                        value={mealDetails.nutrient.sodium}
                        onChange={handleNutrientChange}
                        required={true}
                        step="0.1"
                        min="0"
                        className={'bg-gradient-to-br from-gray-500 to-white h-12 text-center text-lg rounded-lg w-50 lg:w-100 text-black'}
                    />
                </div>

                <div className={'flex flex-row justify-center mt-3 p-0'}>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-gradient-to-br from-green-300 to-green-800 py-3 px-5 text-black font-bold text-lg rounded-2xl ${
                            loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-green-400 hover:to-green-900'
                        }`}
                    >
                        {loading ? 'Logging...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
}