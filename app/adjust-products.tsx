import { showToast } from '@/components/Toast';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';

const STORAGE_KEY = '@products';
const TRANSACTIONS_KEY = '@transactions';

interface Product {
  id: string;
  name: string;
  price: number;
  sku: string;
  quantity: number;
  createdAt: string;
}

export default function AdjustProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const [adjustmentType, setAdjustmentType] = useState<'+' | '-'>('+');
    const [adjustmentAmount, setAdjustmentAmount] = useState('');
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    
    const getProducts = async () => {
        try {
            const productsJson = await AsyncStorage.getItem(STORAGE_KEY);
            const loadedProducts = productsJson ? JSON.parse(productsJson) : [];
            setProducts(loadedProducts);
        } catch (error) {
            console.error('Error loading products:', error);
        }
    };
    
    useEffect(() => {
        getProducts();
    }, []);

    // Handle quantity input - allow only whole numbers
    const handleAmountChange = (text: string) => {
        const cleaned = text.replace(/[^0-9]/g, '');
        setAdjustmentAmount(cleaned);
    };

    const handleAdjustProduct = async () => {
        // Validate inputs
        if (!selectedProduct) {
            showToast('Please select a product', 'error');
            return;
        }

        if (!adjustmentAmount.trim()) {
            showToast('Please enter an adjustment amount', 'error');
            return;
        }

        const amount = parseInt(adjustmentAmount, 10);
        if (isNaN(amount) || amount <= 0) {
            showToast('Please enter a valid amount', 'error');
            return;
        }

        try {
            // Find product by SKU (unique identifier)
            const productIndex = products.findIndex(
                (p) => p.sku.toLowerCase() === selectedProduct.sku.toLowerCase()
            );

            if (productIndex === -1) {
                showToast('Product not found', 'error');
                return;
            }

            // Calculate new quantity
            const currentQuantity = products[productIndex].quantity;
            let newQuantity: number;

            if (adjustmentType === '+') {
                newQuantity = currentQuantity + amount;
            } else {
                newQuantity = currentQuantity - amount;
                if (newQuantity < 0) {
                    showToast('Quantity cannot be negative', 'error');
                    return;
                }
            }

            // Update product quantity
            const updatedProducts = [...products];
            updatedProducts[productIndex] = {
                ...updatedProducts[productIndex],
                quantity: newQuantity,
            };

            // Save to AsyncStorage
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
            setProducts(updatedProducts);

            // Create transaction record
            const transaction = {
                id: Date.now().toString(),
                type: 'quantity_adjusted',
                productId: updatedProducts[productIndex].id,
                productName: updatedProducts[productIndex].name,
                sku: updatedProducts[productIndex].sku,
                adjustmentType: adjustmentType,
                adjustmentAmount: amount,
                oldQuantity: currentQuantity,
                newQuantity: newQuantity,
                timestamp: new Date().toISOString(),
            };

            // Save transaction to storage
            const existingTransactionsJson = await AsyncStorage.getItem(TRANSACTIONS_KEY);
            const existingTransactions = existingTransactionsJson ? JSON.parse(existingTransactionsJson) : [];
            const updatedTransactions = [transaction, ...existingTransactions];
            await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));

            // Update selected product to reflect new quantity
            setSelectedProduct(updatedProducts[productIndex]);

            // Clear adjustment amount
            setAdjustmentAmount('');

            showToast(
                `Quantity ${adjustmentType === '+' ? 'increased' : 'decreased'} by ${amount}. New quantity: ${newQuantity}`,
                'success'
            );
        } catch (error) {
            console.error('Error adjusting product:', error);
            showToast('Failed to adjust product. Please try again.', 'error');
        }
    };
  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <ScrollView className="flex-1">
        <View className="flex-1 justify-center items-center px-6 py-12">
          <Text className="text-white text-4xl font-bold mb-2 text-center">Adjust Products</Text>
          <Text className="text-purple-300 text-lg mb-8 text-center">Adjust the quantity of your products</Text>
        </View>
        <View className="w-full max-w-sm mx-auto">
          <View className="mb-4">
            <Text className="text-white text-sm mb-2">
              Product Name <Text className="text-red-400">*</Text>
            </Text>
            <Pressable
              onPress={() => setShowProductDropdown(true)}
              className="bg-white/10 border border-white/20 rounded-2xl px-4 py-4 flex-row items-center justify-between"
            >
              <Text className="text-white text-base">
                {selectedProduct ? selectedProduct.name : 'Select a product'}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#ffffff" />
            </Pressable>
          </View>
          
          <View className="mb-4">
            <Text className="text-white text-sm mb-2">
              Quantity Adjustment <Text className="text-red-400">*</Text>
            </Text>
            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={() => setShowTypeDropdown(true)}
                className="bg-white/10 border border-white/20 rounded-2xl px-4 py-4 flex-row items-center justify-between min-w-[80px]"
              >
                <Text className="text-white text-lg font-semibold">{adjustmentType}</Text>
                <MaterialIcons name="arrow-drop-down" size={20} color="#ffffff" />
              </Pressable>
              <TextInput
                placeholder="Amount"
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
                value={adjustmentAmount}
                onChangeText={handleAmountChange}
                className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white text-base"
              />
            </View>
          </View>

          <Pressable
            onPress={handleAdjustProduct}
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
              Adjust Product
            </Text>
          </Pressable>

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
        </View>
      </ScrollView>

      {/* Product Selection Modal */}
      <Modal
        visible={showProductDropdown}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowProductDropdown(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-slate-800 rounded-t-3xl p-6 max-h-[80%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-xl font-bold">Select Product</Text>
              <Pressable onPress={() => setShowProductDropdown(false)}>
                <MaterialIcons name="close" size={24} color="#ffffff" />
              </Pressable>
            </View>
            <FlatList
              data={products}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setSelectedProduct(item);
                    setShowProductDropdown(false);
                  }}
                  className="bg-white/10 border border-white/20 rounded-xl p-4 mb-2"
                >
                  <Text className="text-white text-base font-semibold">{item.name}</Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Adjustment Type Modal */}
      <Modal
        visible={showTypeDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTypeDropdown(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setShowTypeDropdown(false)}
        >
          <View className="bg-slate-800 rounded-2xl p-4 w-48">
            <Pressable
              onPress={() => {
                setAdjustmentType('+');
                setShowTypeDropdown(false);
              }}
              className="bg-white/10 rounded-xl p-4 mb-2"
            >
              <Text className="text-white text-xl font-bold text-center">+</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setAdjustmentType('-');
                setShowTypeDropdown(false);
              }}
              className="bg-white/10 rounded-xl p-4"
            >
              <Text className="text-white text-xl font-bold text-center">-</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}