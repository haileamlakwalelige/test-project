import { showToast } from '@/components/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STORAGE_KEY = '@users';

export default function AddUsers() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    
    const handleAddUser = async () => {
        if (!name.trim() || !email.trim()) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        try {
            // Get existing users from storage
            const existingUsersJson = await AsyncStorage.getItem(STORAGE_KEY);
            const existingUsers = existingUsersJson ? JSON.parse(existingUsersJson) : [];
            
            // Create new user object with ID and timestamp
            const newUser = {
                id: Date.now().toString(),
                name: name.trim(),
                email: email.trim(),
                createdAt: new Date().toISOString()
            };
            
            // Add new user to array
            const updatedUsers = [...existingUsers, newUser];
            
            // Save updated array to storage
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
            
            // Clear form
            setName('');
            setEmail('');
            
            // Show success toast
            showToast('User added successfully!', 'success');
        } catch (error) {
            showToast('Failed to save user. Please try again.', 'error');
        }
    }



  return (
    <SafeAreaView className="flex-1 bg-slate-900">
        <Text className="text-white text-sm font-light my-2 mt-8 text-end px-2 md:px-6 lg:px-12 md:my-4 lg:my-8 hover:text-purple-300 cursor-pointer hover:font-semibold " onPress={() => router.push('/show_users')}>List of Users</Text>
      <View className="flex-1 justify-center items-center px-6 py-12">
        <Pressable onPress={() => router.push('/show_users')}>
        </Pressable>
        <Text className="text-white text-4xl font-bold mb-2 text-center">Add Users</Text>
        <Text className="text-purple-300 text-lg mb-8 text-center">Create a new user account</Text>
        
        <View className="w-full max-w-sm">
          <View className="mb-2">
            <Text className="text-white text-sm mb-1">
              Name <Text className="text-red-400">*</Text>
            </Text>
            <TextInput 
              placeholder="Name" 
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={setName}
              className="bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white text-base"
            />
          </View>
          <View className="mb-6">
            <Text className="text-white text-sm mb-1">
              Email <Text className="text-red-400">*</Text>
            </Text>
            <TextInput 
              placeholder="Email" 
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              className="bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white text-base"
            />
          </View>
          
          <Pressable
            onPress={handleAddUser}
            className="bg-indigo-500 rounded-2xl py-5 px-6 mb-4 shadow-lg"
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
                shadowColor: '#6366f1',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              },
            ]}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Add User
            </Text>
          </Pressable>
          
          <Pressable 
            onPress={() => router.back()}
            className="bg-transparent rounded-2xl py-5 px-6 border-2 border-purple-400"
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <Text className="text-purple-300 text-lg font-semibold text-center">
              Go Back
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

