/* eslint-disable import/no-unresolved */
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <View className="flex-1 justify-center items-center px-6 py-12">
          {/* Welcome Section */}
          <View className="items-center mb-16">
            <Text className="text-white text-5xl font-bold mb-4 text-center tracking-tight">
              Welcome
            </Text>
            <Text className="text-purple-300 text-xl font-medium text-center">
              Your journey starts here
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="w-full max-w-sm">
            <Pressable
              onPress={() => router.push('/add-users')}
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
                Add Users
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/add-products')}
              className="bg-white/10 rounded-2xl py-5 px-6 mb-4 border border-white/20"
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <Text className="text-white text-lg font-semibold text-center">
                Add Products
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/adjust-products')}
              className="bg-transparent rounded-2xl py-5 px-6 mb-4 border-2 border-purple-400"
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]} 
            >
              <Text className="text-purple-300 text-lg font-semibold text-center">
                Adjust Products
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/transactions-history' as any)}
              className="bg-transparent rounded-2xl py-5 px-6 border-2 border-purple-400"
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <Text className="text-purple-300 text-lg font-semibold text-center">
                Transactions History
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
