import {useEffect, useState} from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import db from "../../firebaseConfig.js";

export default function Report({ user }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch data when component mounts or user changes
    useEffect(() => {
        if (user) {
            readData();
        }
    }, [user]);

    const readData = async () => {
        try {
            setLoading(true);
            setError('');

            // Query only the current user's nutrition data
            const q = query(
                collection(db, "nutrition"),
                where("email", "==", user.email) // or where("userId", "==", user.uid) if you added userId
            );

            const querySnapshot = await getDocs(q);
            const nutritionData = [];

            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} =>`, doc.data());
                nutritionData.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            setData(nutritionData);
            console.log("Fetched data:", nutritionData);

        } catch (error) {
            console.error("Error fetching data:", error);
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }

    // If you want to fetch all nutrition data (without user filtering):
    const readAllData = async () => {
        try {
            setLoading(true);
            setError('');

            const querySnapshot = await getDocs(collection(db, "nutrition"));
            const allData = [];

            querySnapshot.forEach((doc) => {
                allData.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            setData(allData);
            console.log("Fetched all data:", allData);

        } catch (error) {
            console.error("Error fetching data:", error);
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="p-4">Loading nutrition data...</div>;
    }

    if (error) {
        return (
            <div className="p-4">
                <div className="text-red-600">Error: {error}</div>
                <button
                    onClick={readData}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Nutrition Report</h2>
            <button
                onClick={readData}
                className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
            >
                Refresh Data
            </button>

            {data.length === 0 ? (
                <p>No nutrition data found.</p>
            ) : (
                <div className="grid gap-4">
                    {data.map((item) => (
                        <div key={item.id} className="border p-4 rounded-lg shadow">
                            <h3 className="font-bold text-lg">{item.foodName || 'Unnamed Food'}</h3>
                            <p><strong>Meal Type:</strong> {item.mealType}</p>
                            <p><strong>Quantity:</strong> {item.quantity}</p>
                            <p><strong>Calories:</strong> {item.nutrient?.calories || 0}</p>
                            <p><strong>Carbs:</strong> {item.nutrient?.carbs || 0}g</p>
                            <p><strong>Protein:</strong> {item.nutrient?.protein || 0}g</p>
                            <p><strong>Fat:</strong> {item.nutrient?.fat || 0}g</p>
                            <p className="text-sm text-gray-500">
                                <strong>Logged at:</strong> {item.createdAt?.toDate?.().toLocaleString() || 'Unknown date'}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}