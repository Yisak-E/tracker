import {Chart} from "react-google-charts";
import {useEffect, useState} from "react";
import {collection, getDocs, query, where} from "firebase/firestore";
import db from "../../firebaseConfig.js";

export default function Tracker(props) {
    const [dataList, setDataList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [nutritionData, setNutritionData] = useState({
        carbs: 0,
        fat: 0,
        protein: 0,
        calories: 0,
        sodium: 0,
    });

    // Fetch data when component mounts or user changes
    useEffect(() => {
        if (props.user) {
            fetchData();
        }
    }, [props.user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');

            // Query only the current user's nutritional data
            const q = query(
                collection(db, "nutrition"),
                where("email", "==", props.user.email)
            );

            const querySnapshot = await getDocs(q);
            const nutritionDataArray = [];

            // Initialize totals
            let totalCarbs = 0;
            let totalFat = 0;
            let totalProtein = 0;
            let totalCalories = 0;
            let totalSodium = 0;

            querySnapshot.forEach(doc => {
                const data = doc.data();
                nutritionDataArray.push({
                    id: doc.id,
                    ...data
                });

                // Accumulate nutrient values - fix the path to access nutrient object
                if (data.nutrient) {
                    totalCarbs += data.nutrient.carbs || 0;
                    totalFat += data.nutrient.fat || 0;
                    totalProtein += data.nutrient.protein || 0;
                    totalCalories += data.nutrient.calories || 0;
                    totalSodium += data.nutrient.sodium || 0;
                }
            });

            setDataList(nutritionDataArray);

            // Update nutrition data state once after the loop
            setNutritionData({
                carbs: totalCarbs,
                fat: totalFat,
                protein: totalProtein,
                calories: totalCalories,
                sodium: totalSodium,
            });

            console.log("Fetched data:", nutritionDataArray);
            console.log("Nutrition totals:", {
                carbs: totalCarbs,
                fat: totalFat,
                protein: totalProtein,
                calories: totalCalories,
                sodium: totalSodium,
            });

        } catch (err) {
            console.error("Error fetching data:", err);
            setError('Failed to fetch nutrition data');
        } finally {
            setLoading(false);
        }
    };

    // Prepare chart data
    const data = [
        ["Nutrition", "Taken", "To be Taken"],
        ["Carbs (g)", nutritionData.carbs, 1000 - nutritionData.carbs], // Example: 300g daily goal
        ["Fat (g)", nutritionData.fat, 200 - nutritionData.fat],       // Example: 70g daily goal
        ["Protein (g)", nutritionData.protein, 150 - nutritionData.protein], // Example: 150g daily goal
        ["Calories(KCal)", nutritionData.calories/1000, 2 - nutritionData.calories/1000], // Example: 2000 calorie goal
        ["Sodium (g)", nutritionData.sodium/1000, 2.3 - nutritionData.sodium/1000], // Example: 2300mg daily limit
    ];

    const options = {
        chart: {
            title: "Nutrition Tracker",
            subtitle: "Covered vs Remaining Daily Goals",
        },
        bars: "vertical",
        colors: ["#34A853", "#EA4335"], // green for covered, red for remaining
        vAxis: {
            title: "Amount"
        },
        hAxis: {
            title: "Nutrition Type"
        },
        isStacked: false,
    };

    if (loading) {
        return <div className="p-4">Loading nutrition data...</div>;
    }

    if (error) {
        return (
            <div className="p-4 w-sm">
                <div className="text-red-600">Error: {error}</div>
                <button
                    onClick={fetchData}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Nutrition Tracker</h2>

            {/* Summary Cards */}
            <div className="flex flex-col space-y-2 md:grid md:grid-cols-5 gap-2 lg:gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="text-green-800 font-bold">Carbs</div>
                    <div className="text-2xl font-bold">{nutritionData.carbs.toFixed(1)}g</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-blue-800 font-bold">Protein</div>
                    <div className="text-2xl font-bold">{nutritionData.protein.toFixed(1)}g</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="text-yellow-800 font-bold">Fat</div>
                    <div className="text-2xl font-bold">{nutritionData.fat.toFixed(1)}g</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="text-red-800 font-bold">Calories</div>
                    <div className="text-2xl font-bold">{nutritionData.calories.toFixed(0)}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="text-purple-800 font-bold">Sodium</div>
                    <div className="text-2xl font-bold">{nutritionData.sodium.toFixed(0)}mg</div>
                </div>
            </div>

            {/* Chart */}
            <div className="flex flex-col space-y-4 bg-white p-4 rounded-lg shadow">
                <Chart
                    chartType="Bar"
                    width="100%"
                    height="400px"
                    data={data}
                    options={options}
                />
            </div>

            {/* Refresh Button */}
            <button
                onClick={fetchData}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
                Refresh Data
            </button>

            {/* Data Table (Optional) */}
            {dataList.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-bold mb-2">Recent Meals</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border ">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">Food</th>
                                    <th className="border px-4 py-2">Carbs</th>
                                    <th className="border px-4 py-2">Protein</th>
                                    <th className="border px-4 py-2">Fat</th>
                                    <th className="border px-4 py-2">Calories</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataList.slice(0, 5).map((item) => (
                                    <tr key={item.id}>
                                        <td className="border px-4 py-2">{item.foodName || 'N/A'}</td>
                                        <td className="border px-4 py-2">{item.nutrient?.carbs?.toFixed(1) || 0}g</td>
                                        <td className="border px-4 py-2">{item.nutrient?.protein?.toFixed(1) || 0}g</td>
                                        <td className="border px-4 py-2">{item.nutrient?.fat?.toFixed(1) || 0}g</td>
                                        <td className="border px-4 py-2">{item.nutrient?.calories?.toFixed(0) || 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}