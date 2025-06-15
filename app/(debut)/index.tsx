import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import AboutScreen from './slide'
import { Redirect, useRouter } from 'expo-router'

export default function debut () {
    const [count, setCount] = useState(1)
    const router = useRouter()
    
    const increment = () => {
        setCount(count + 1)
    }

    if (count === 1) {
        return (<View style={{ flex: 1, backgroundColor: 'orange' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20  }}>
            <AboutScreen
                title="Welcome to our app"
                description="This is the first slide of our app. Here we introduce the main features and benefits of using our application."
                />
            <TouchableOpacity onPress={increment} style={{ padding: 10, backgroundColor: '#fff', borderRadius: 5, marginTop: 20 , width: '100%', maxWidth: 200, alignItems: 'center' }}>
                <Text
                    style={{ fontSize: 16, color: 'orange', textAlign: 'center' , fontWeight: 'bold' , textTransform: 'uppercase' }} 
                >Next</Text>
                </TouchableOpacity>
            </View>
            </View>
        )}
    else if (count === 2) {
        return (
        <View style={{ flex: 1, backgroundColor: 'orange' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <AboutScreen
                    title="Our Mission"
                    description="To provide the best user experience through innovative solutions."
                />
                <TouchableOpacity onPress={increment} style={{ padding: 10, backgroundColor: '#fff', borderRadius: 5, marginTop: 20 , width: '100%', maxWidth: 200, alignItems: 'center' }}>
                    <Text
                        style={{ fontSize: 16, color: 'orange', textAlign: 'center' , fontWeight: 'bold' , textTransform: 'uppercase' }} 
                    >Next</Text>
                </TouchableOpacity>
            </View>
        </View>)
    }
    else if (count === 3) {
        return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 , backgroundColor: 'orange' }}>
            <AboutScreen
                title="Get Started"
                description="Now that you know about our app, let's get started!"
            />
            <TouchableOpacity onPress={increment} style={{ padding: 10, backgroundColor: '#fff', borderRadius: 5, marginTop: 20 , width: '100%', maxWidth: 200, alignItems: 'center' }}>
                <Text
                    style={{ fontSize: 16, color: 'orange', textAlign: 'center' , fontWeight: 'bold' , textTransform: 'uppercase' }} 
                >Next</Text>
            </TouchableOpacity>
        </View>
        )
    }
    else if (count === 4) {
        router.push('/(login)')
    }
}