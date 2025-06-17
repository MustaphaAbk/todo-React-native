import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { TextInput, TouchableOpacity, View, Text } from "react-native";

export default function UpdateTask(){
// Get the task ID from the route parameters

const { id } = useLocalSearchParams();

const [task, setTask] = useState({
                                    title: '',
                                    description: '',
                                    completed: false,
                                    dueDate: ''
                                }   );
const [loading, setLoading] = useState(false);
const router = useRouter();
const handleUpdateTask = async () => {
    if (!task.title || !task.description || !task.dueDate) {
        alert("Please fill in all fields.");
        return;
    }
    setLoading(true);
    try {
        const token = await AsyncStorage.getItem('token'); // Ensure you have the token stored in AsyncStorage
        const response = await fetch(`http://localhost:8080/api/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(task),
        });
        const data = await response.json();
        if (response.ok) {
            alert("Task updated successfully!");
            router.push('/(list-task)'); // Navigate to task list
        } else {
            alert(data.message || "Failed to update task. Please try again.");
        }
    } catch (error) {
        console.error("Error updating task:", error);
        alert("An error occurred. Please try again later.");
    }
    setLoading(false);
};
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <View style={{ width: '100%', maxWidth: 400, padding: 20, backgroundColor: '#fff', borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Update Task</Text>
                <TextInput
                    style={{ height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, marginBottom: 10, paddingHorizontal: 10 }}
                    placeholder="Title"
                    value={task.title}
                    onChangeText={(text) => setTask({ ...task, title: text })}
                />
                <TextInput
                    style={{ height: 80, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, marginBottom: 10, paddingHorizontal: 10 }}
                    placeholder="Description"
                    value={task.description}
                    onChangeText={(text) => setTask({ ...task, description: text })}
                />
                <TextInput
                    style={{ height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, marginBottom: 10, paddingHorizontal: 10 }}
                    placeholder="Due Date (YYYY-MM-DD)"
                    value={task.dueDate}
                    onChangeText={(text) => setTask({ ...task, dueDate: text })}
                />
                <TouchableOpacity
                    onPress={handleUpdateTask}
                    style={{ padding: 10, backgroundColor: '#007BFF', borderRadius: 5, alignItems: 'center' }}
                >
                    <Text style={{ color: '#fff', fontSize: 16 }}>Update Task</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}