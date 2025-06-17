import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    // Optional: Prefill last used email
    useEffect(() => {
        const loadLastEmail = async () => {
            const lastEmail = await AsyncStorage.getItem('lastEmail');
            if (lastEmail) setEmail(lastEmail);
        };
        loadLastEmail();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        setLoading(true);
        try {
            const apiUrl = (await AsyncStorage.getItem('apiUrl')) || 'http://localhost:8080';

            const response = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: email.trim(),
                    password: password 
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                // Validate response data
                if (!data.token || !data.userId || !data.username) {
                    throw new Error('Invalid response format from server');
                }

                // Store user data
                await AsyncStorage.multiSet([
                    ['token', data.token],
                    ['userId', data.userId.toString()],
                    ['username', data.username]
                ]);

                router.replace('/(list-task)');
            } else {
                // Handle error response
                const errorMessage = data.error || 'Login failed. Please try again.';
                Alert.alert('Login Error', errorMessage);
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert(
                'Error',
                'Unable to connect to the server. Please check your connection and try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: 'orange' }}
        >
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
                <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    marginBottom: 30,
                    textAlign: "center",
                    color: "orange"
                }}>Login</Text>

                <TextInput
                    style={{
                        height: 40,
                        borderColor: 'black',
                        borderWidth: 1,
                        borderRadius: 5,
                        marginBottom: 10,
                        paddingHorizontal: 10
                    }}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    style={{
                        height: 40,
                        borderColor: 'black',
                        borderWidth: 1,
                        borderRadius: 5,
                        marginBottom: 30,
                        paddingHorizontal: 10
                    }}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    onPress={handleLogin}
                    disabled={loading}
                    style={{
                        backgroundColor: '#423D45',
                        padding: 15,
                        borderRadius: 5,
                        alignItems: 'center',
                        marginBottom: 20
                    }}
                >
                    <Text style={{
                        color: '#fff',
                        fontSize: 16,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                    }}>{loading ? 'Logging in...' : 'Login'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/(signup)')}
                    style={{ marginTop: 10, alignItems: 'center' }}
                >
                    <Text style={{ color: 'black' }}>Don't have an account? Register</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
