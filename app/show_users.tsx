import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STORAGE_KEY = '@users';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function ShowUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersJson = await AsyncStorage.getItem(STORAGE_KEY);
      const loadedUsers = usersJson ? JSON.parse(usersJson) : [];
      setUsers(loadedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Unknown date';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-1 px-6 py-8">
        <View className="mb-6">
          <Text className="text-white text-4xl font-bold mb-2 text-center">Users List</Text>
          <Text className="text-purple-300 text-lg text-center">
            {users.length} {users.length === 1 ? 'user' : 'users'} registered
          </Text>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-white text-lg">Loading users...</Text>
          </View>
        ) : users.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <View className="bg-white/10 border border-white/20 rounded-2xl p-8 max-w-sm">
              <Text className="text-white text-xl font-semibold mb-2 text-center">
                No users yet
              </Text>
              <Text className="text-gray-400 text-sm text-center mb-6">
                Start by adding your first user
              </Text>
              <Pressable
                onPress={() => router.push('/add-users')}
                className="bg-indigo-500 rounded-xl py-3 px-6"
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                <Text className="text-white text-base font-semibold text-center">
                  Add User
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <View
                className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-4"
                style={{
                  shadowColor: '#6366f1',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View className="flex-row items-center mb-3">
                  <View className="bg-indigo-500 rounded-full w-12 h-12 items-center justify-center mr-3">
                    <Text className="text-white text-lg font-bold">
                      {item.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-lg font-semibold">
                      {item.name}
                    </Text>
                    <Text className="text-purple-300 text-sm mt-1">
                      {item.email}
                    </Text>
                  </View>
                </View>
                <View className="border-t border-white/10 pt-3">
                  <Text className="text-gray-400 text-xs">
                    Added: {formatDate(item.createdAt)}
                  </Text>
                </View>
              </View>
            )}
            ListFooterComponent={
              <Pressable
                onPress={() => router.back()}
                className="bg-transparent rounded-2xl py-5 px-6 border-2 border-purple-400 mt-6"
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
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}