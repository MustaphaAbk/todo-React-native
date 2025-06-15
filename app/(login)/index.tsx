import { useRouter } from "expo-router";
import { useState } from "react";
import { TextInput, TouchableOpacity, View, Text } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('https://j2g0n1dx-8080.uks1.devtunnels.ms/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                // Handle successful login
                alert("Login successful!");
                // You can save the token or user data in a global state or context here with context or AsyncStorage
                // For example, you might use AsyncStorage to save the token:
                await AsyncStorage.setItem('token', data.token);
                
                router.push('/(list-task)'); // Navigate to home screen
            }
            else {
                // Handle login error
                alert(data.message || "Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred. Please try again later.");
        }
        setLoading(false);
    };
    return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 , backgroundColor: 'orange',paddingTop: -50 }}>
        <View style={{ width: '100%', maxWidth: 400, padding: 20, backgroundColor: '#fff', borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 30 ,textAlign:"center" ,color : "orange" }}>Login</Text>
        <TextInput
            style={{ height: 40, borderColor: 'black', borderWidth: 1, borderRadius: 5, marginBottom: 10, paddingHorizontal: 10 }}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
        />
        <TextInput
            style={{ height: 40, borderColor: 'black', borderWidth: 1, borderRadius: 5, marginBottom: 30, paddingHorizontal: 10 }}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
        />
        <TouchableOpacity
            onPress={handleLogin}
            style={{ backgroundColor: '#423D45', padding: 15, borderRadius: 5, alignItems: 'center' , marginBottom: 20}}
        >
            <Text style={{ color: '#fff', fontSize: 16 , textAlign: 'center' , fontWeight: 'bold' , textTransform: 'uppercase' }}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => router.push('/(signup)')}
            style={{ marginTop: 10, alignItems: 'center' }}
        >
            <Text style={{ color: 'black' }}>Don't have an account? Register</Text>
        </TouchableOpacity>
        </View>
    </View>);
}