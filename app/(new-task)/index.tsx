import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";

export default function NewTask() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();

    const handleCreateTask = async () => {
        if (!title || !description || !dueDate) {
            alert("Please fill in all fields.");
            return;
        }

        setLoading(true);

        try {
            const token = await AsyncStorage.getItem('token'); // ✅ Corrected with await

            const response = await fetch('https://j2g0n1dx-8080.uks1.devtunnels.ms/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, description, dueDate }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Task created successfully!");
                router.push('/(list-task)');
            } else {
                alert(data.message || "Failed to create task. Please try again.");
            }

        } catch (error) {
            console.error("Error creating task:", error);
            alert("An error occurred. Please try again later.");
        }

        setLoading(false);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <View style={{
                width: '100%',
                maxWidth: 400,
                padding: 20,
                backgroundColor: '#fff',
                borderRadius: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4
            }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>New Task</Text>

                <TextInput
                    style={{
                        height: 40,
                        borderColor: '#ccc',
                        borderWidth: 1,
                        borderRadius: 5,
                        marginBottom: 10,
                        paddingHorizontal: 10
                    }}
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    style={{
                        height: 80,
                        borderColor: '#ccc',
                        borderWidth: 1,
                        borderRadius: 5,
                        marginBottom: 10,
                        paddingHorizontal: 10
                    }}
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />
                <TextInput
                    style={{
                        height: 40,
                        borderColor: '#ccc',
                        borderWidth: 1,
                        borderRadius: 5,
                        marginBottom: 20,
                        paddingHorizontal: 10
                    }}
                    placeholder="Due Date (YYYY-MM-DD)"
                    value={dueDate}
                    onChangeText={setDueDate}
                />

                <TouchableOpacity
                    onPress={handleCreateTask}
                    style={{
                        backgroundColor: loading ? '#aaa' : '#007BFF',
                        padding: 15,
                        borderRadius: 5,
                        alignItems: 'center'
                    }}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={{ color: '#fff', fontSize: 16 }}>Create Task</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/(list-task)')}
                    style={{ marginTop: 10, alignItems: 'center' }}
                >
                    <Text style={{ color: '#007BFF' }}>Back to Task List</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
