import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransactionsHistory() {
  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <View className="flex-1 justify-center items-center px-6 py-12">
          <Text className="text-white text-4xl font-bold mb-2 text-center">Transactions History</Text>
          <Text className="text-purple-300 text-lg mb-8 text-center">View all your transaction records</Text>
          
          <View className="w-full max-w-sm">
            <View className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-4">
              <Text className="text-white text-base mb-2">No transactions yet</Text>
              <Text className="text-gray-400 text-sm">Your transaction history will appear here</Text>
            </View>
            
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
      </ScrollView>
    </SafeAreaView>
  );
}