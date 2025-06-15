import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, TextInput, ScrollView} from "react-native";


interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    dueDate: string;
}

export default function ListTask(){
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
   
    const router= useRouter();

    const fetchTasks = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('https://j2g0n1dx-8080.uks1.devtunnels.ms/api/tasks', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);
    if (loading) {
        return <Text>Loading tasks...</Text>;
    }
    return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 , backgroundColor: 'orange',paddingTop: -50  }}>  
        <View style={{padding:20}}>
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Task List</Text>
            // i want to add a searchbar to search tasks by title or description
            <TextInput
                style={{ height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, marginBottom: 20, paddingHorizontal: 10 }}
                placeholder="Search tasks by title or description"
                onChangeText={(text) => {
                    const filteredTasks = tasks.filter(task =>
                        task.title.toLowerCase().includes(text.toLowerCase()) ||
                        task.description.toLowerCase().includes(text.toLowerCase())
                    );
                    setTasks(filteredTasks);
                }}
            />
            
            <ScrollView style={{ flex: 1 }}>
            {tasks.length === 0 ? (
                <Text>No tasks available.</Text>
            ) : (
                tasks.map(task => (
                    <View key={task.id} style={{ marginBottom: 10 }}>
                        <Text style={{ fontSize: 18 }}>{task.title}</Text>
                        <Text>{task.description}</Text>
                        <Text style={{ color: task.completed ? 'green' : 'red' }}>
                            {task.completed ? 'Completed' : 'Pending'}
                        </Text>
                        <Text>Due: {new Date(task.dueDate).toLocaleDateString()}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                // Navigate to update task screen with task id
                                router.push(`/(update-task)?id=${task.id}`);
                            }}
                            style={{ marginTop: 10, padding: 10, backgroundColor: '#007BFF', borderRadius: 5 }}
                        >
                            <Text style={{ color: '#fff' }}>Update Task</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                Alert.alert(
                                    "Are you sure you want to delete this task?",
                                    "This action cannot be undone.",
                                    [
                                        { text: "Cancel", style: "cancel" },
                                        {
                                            text: "Delete", onPress: () => {
                                            // Handle task deletion
                                            const token = AsyncStorage.getItem('token');
                                            fetch(`https://j2g0n1dx-8080.uks1.devtunnels.ms/api/tasks/${task.id}`, {
                                                method: 'DELETE',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${token}`
                                                },
                                            })
                                                .then(response => {
                                                    if (response.ok) {
                                                        // Refresh task list after deletion
                                                        fetchTasks();
                                                    } else {
                                                        alert("Failed to delete task.");
                                                    }
                                                })
                                                .catch(error => {
                                                    console.error("Error deleting task:", error);
                                                    alert("An error occurred while deleting the task.");
                                                }
                                            );
                                        }
                                    }
                                ]);
                            }}
                            style={{ marginTop: 5, padding: 10, backgroundColor: '#FF0000', borderRadius: 5 }}
                        >
                            <Text style={{ color: '#fff' }}>Delete Task</Text>
                        </TouchableOpacity>
                    </View>
                ))
            )}
            </ScrollView>
        </View>
        <TouchableOpacity
            onPress={() => router.push('/(new-task)')}
            style={{ backgroundColor: '#007BFF', padding: 15, borderRadius: 5, alignItems: 'center' }}
        >
            <Text style={{ color: '#fff', fontSize: 16 }}>Create New Task</Text>
        </TouchableOpacity>
        </View>
    </View>
    );
}