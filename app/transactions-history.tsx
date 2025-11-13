import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TRANSACTIONS_KEY = '@transactions';

interface Transaction {
  id: string;
  type: 'product_added' | 'quantity_adjusted';
  productId: string;
  productName: string;
  sku: string;
  timestamp: string;
  price?: number;
  quantity?: number;
  adjustmentType?: '+' | '-';
  adjustmentAmount?: number;
  oldQuantity?: number;
  newQuantity?: number;
}

export default function TransactionsHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const transactionsJson = await AsyncStorage.getItem(TRANSACTIONS_KEY);
      const loadedTransactions = transactionsJson ? JSON.parse(transactionsJson) : [];
      setTransactions(loadedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
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
          <Text className="text-white text-4xl font-bold mb-2 text-center">Transactions History</Text>
          <Text className="text-purple-300 text-lg text-center">
            {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'} recorded
          </Text>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-white text-lg">Loading transactions...</Text>
          </View>
        ) : transactions.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <View className="bg-white/10 border border-white/20 rounded-2xl p-8 max-w-sm">
              <Text className="text-white text-xl font-semibold mb-2 text-center">
                No transactions yet
              </Text>
              <Text className="text-gray-400 text-sm text-center">
                Your transaction history will appear here
              </Text>
            </View>
          </View>
        ) : (
          <FlatList
            data={transactions}
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
                <View className="flex-row items-start mb-3">
                  <View className={`rounded-full w-10 h-10 items-center justify-center mr-3 ${
                    item.type === 'product_added' ? 'bg-green-500' : 'bg-blue-500'
                  }`}>
                    <MaterialIcons
                      name={item.type === 'product_added' ? 'add' : 'edit'}
                      size={20}
                      color="#ffffff"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-lg font-semibold">
                      {item.productName}
                    </Text>
                    <Text className="text-purple-300 text-sm mt-1">
                      SKU: {item.sku}
                    </Text>
                    {item.type === 'product_added' ? (
                      <Text className="text-gray-400 text-xs mt-2">
                        Added: {item.quantity} units @ ${item.price?.toFixed(2)} each
                      </Text>
                    ) : (
                      <Text className="text-gray-400 text-xs mt-2">
                        {item.adjustmentType === '+' ? 'Increased' : 'Decreased'} by {item.adjustmentAmount} units
                        {' '}({item.oldQuantity} → {item.newQuantity})
                      </Text>
                    )}
                  </View>
                </View>
                <View className="border-t border-white/10 pt-3">
                  <Text className="text-gray-400 text-xs">
                    {formatDate(item.timestamp)}
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