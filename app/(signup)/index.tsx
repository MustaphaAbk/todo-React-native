import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function Signup(){
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    const handleSignup = async () => {
        if (!username || !email || !password) {
            alert("Please fill in all fields.");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                // Handle successful signup
                alert("Signup successful!");
                //redirect to login 
                router.push("/(login)")
            } else {
                // Handle signup error
                alert(data.message || "Signup failed. Please try again.");
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert("An error occurred. Please try again later.");
        }
        setLoading(false);
    };//hjhkjh@gmail.com
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    } else {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 , backgroundColor: 'orange', paddingTop: -50 }}>
                <View style={{ width: '100%', maxWidth: 400, padding: 20, backgroundColor: '#fff', borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 , textAlign:"center", color:"orange" }}>Signup</Text>
                    <TextInput
                        style={{ height: 40, borderColor: 'orange', borderWidth: 1, borderRadius: 5, marginBottom: 10, paddingHorizontal: 10 }}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                    />
                    <TextInput
                        style={{ height: 40, borderColor: 'orange', borderWidth: 1, borderRadius: 5, marginBottom: 10, paddingHorizontal: 10 }}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={{ height: 40, borderColor: 'orange', borderWidth: 1, borderRadius: 5, marginBottom: 30, paddingHorizontal: 10 }}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity
                        onPress={handleSignup}
                        style={{ backgroundColor: 'orange', padding: 15, borderRadius: 5, alignItems: 'center' ,marginBottom: 20}}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold' , textAlign: 'center' , textTransform: 'uppercase'}}>Sign Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push('/(login)')}
                        style={{ marginTop: 10, alignItems: 'center' }}
                    >
                        <Text style={{ color: 'orange' }}>Already have an account? Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}