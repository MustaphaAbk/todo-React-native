import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    dueDate: string;
    userId: string; // Add this if your backend includes it
}

export default function ListTask() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const router = useRouter();

    const fetchTasks = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const id = await AsyncStorage.getItem('userId');
            const apiUrl = await AsyncStorage.getItem('apiUrl') || 'http://localhost:8080';

            console.log('Debug - API URL:', apiUrl);
            console.log('Debug - User ID:', id);
            console.log('Debug - Token exists:', !!token);

            if (!token || !id) {
                console.error('No token or userId found');
                router.replace('/(login)');
                return;
            }

            const response = await fetch(`${apiUrl}/api/tasks/user/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            console.log('Debug - Response status:', response.status);
            const responseText = await response.text();
            console.log('Debug - Response body:', responseText);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
            }

            // Parse the response text as JSON only if it's not empty
            const data = responseText ? JSON.parse(responseText) : [];
            
            if (!Array.isArray(data)) {
                throw new Error('Expected array of tasks from server');
            }

            setTasks(data);
            setFilteredTasks(data);
        } catch (error) {
            console.error("Detailed error fetching tasks:", error);
            Alert.alert(
                "Error",
                `Could not load tasks: ${error instanceof Error ? error.message : String(error)}`
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (taskId: string) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const apiUrl = await AsyncStorage.getItem('apiUrl') || 'http://localhost:8080';

            const response = await fetch(`${apiUrl}/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.ok) {
                fetchTasks();
            } else {
                alert("Failed to delete task.");
            }
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("An error occurred while deleting the task.");
        }
    };

    useEffect(() => {
        const loadTasks = async () => {
            try {
                await fetchTasks();
            } catch (error) {
                console.error('Failed to load tasks:', error);
                Alert.alert(
                    "Connection Error",
                    "Please check your internet connection and try again"
                );
            }
        };

        loadTasks();

        // Add refresh interval
        const refreshInterval = setInterval(loadTasks, 30000); // Refresh every 30 seconds

        return () => clearInterval(refreshInterval);
    }, []);

    const handleSearch = (text: string) => {
        setSearchText(text);
        if (!text.trim()) {
            setFilteredTasks(tasks);
        } else {
            const filtered = tasks.filter(task =>
                task.title.toLowerCase().includes(text.toLowerCase()) ||
                task.description.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredTasks(filtered);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'orange' }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18 }}>Loading tasks...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'orange' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <View style={{ width: '100%', maxWidth: 500 }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
                        Task List
                    </Text>

                    <TextInput
                        style={{
                            height: 40,
                            borderColor: '#ccc',
                            borderWidth: 1,
                            borderRadius: 5,
                            marginBottom: 20,
                            paddingHorizontal: 10,
                            backgroundColor: '#fff',
                        }}
                        placeholder="Search tasks by title or description"
                        value={searchText}
                        onChangeText={handleSearch}
                    />

                    <ScrollView style={{ maxHeight: '75%' }}>
                        {filteredTasks.length === 0 ? (
                            <Text>No tasks available.</Text>
                        ) : (
                            filteredTasks.map(task => (
                                <View key={task.id} style={{
                                    marginBottom: 15,
                                    backgroundColor: '#fff',
                                    padding: 15,
                                    borderRadius: 10,
                                    shadowColor: '#000',
                                    shadowOpacity: 0.1,
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowRadius: 5,
                                }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{task.title}</Text>
                                    <Text>{task.description}</Text>
                                    <Text style={{ color: task.completed ? 'green' : 'red', fontWeight: 'bold' }}>
                                        {task.completed ? 'Completed' : 'Pending'}
                                    </Text>
                                    <Text>Due: {new Date(task.dueDate).toLocaleDateString()}</Text>

                                    <TouchableOpacity
                                        onPress={() => router.push(`/(update-task)?id=${task.id}`)}
                                        style={{
                                            marginTop: 10,
                                            padding: 10,
                                            backgroundColor: '#007BFF',
                                            borderRadius: 5
                                        }}
                                    >
                                        <Text style={{ color: '#fff', textAlign: 'center' }}>Update Task</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            Alert.alert(
                                                "Are you sure you want to delete this task?",
                                                "This action cannot be undone.",
                                                [
                                                    { text: "Cancel", style: "cancel" },
                                                    {
                                                        text: "Delete", style: "destructive", onPress: () => {
                                                            handleDelete(task.id);
                                                        }
                                                    }
                                                ]
                                            );
                                        }}
                                        style={{
                                            marginTop: 5,
                                            padding: 10,
                                            backgroundColor: '#FF0000',
                                            borderRadius: 5
                                        }}
                                    >
                                        <Text style={{ color: '#fff', textAlign: 'center' }}>Delete Task</Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        )}
                    </ScrollView>

                    <TouchableOpacity
                        onPress={() => router.push('/(new-task)')}
                        style={{
                            marginTop: 20,
                            backgroundColor: '#28a745',
                            padding: 15,
                            borderRadius: 5,
                            alignItems: 'center'
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 16 }}>Create New Task</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
