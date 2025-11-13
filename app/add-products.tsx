import { showToast } from '@/components/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STORAGE_KEY = '@products';

export default function AddProducts() {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState('');

  // Handle price input - allow only numbers and one decimal point
  const handlePriceChange = (text: string) => {
    // Remove any non-numeric characters except decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      setPrice(parts[0] + '.' + parts.slice(1).join(''));
    } else {
      setPrice(cleaned);
    }
  };

  // Handle quantity input - allow only whole numbers
  const handleQuantityChange = (text: string) => {
    // Remove any non-numeric characters
    const cleaned = text.replace(/[^0-9]/g, '');
    setQuantity(cleaned);
  };

  const handleAddProduct = async () => {
    if (!productName.trim() || !price.trim() || !sku.trim() || !quantity.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    // Validate price is a valid decimal number
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0 || !isFinite(priceNum)) {
      showToast('Please enter a valid price (numbers only, decimals allowed)', 'error');
      return;
    }

    // Validate quantity is a valid whole number
    const quantityNum = parseInt(quantity, 10);
    if (isNaN(quantityNum) || quantityNum <= 0 || !Number.isInteger(quantityNum)) {
      showToast('Please enter a valid quantity (whole numbers only)', 'error');
      return;
    }

    try {
      // Get existing products from storage
      const existingProductsJson = await AsyncStorage.getItem(STORAGE_KEY);
      const existingProducts = existingProductsJson ? JSON.parse(existingProductsJson) : [];
      
      // Check if SKU already exists (case-insensitive)
      const skuLower = sku.trim().toLowerCase();
      const skuExists = existingProducts.some(
        (product: any) => product.sku?.toLowerCase() === skuLower
      );

      if (skuExists) {
        showToast('SKU already exists. Please use a unique SKU.', 'error');
        return;
      }

      // Create new product object with ID and timestamp
      const newProduct = {
        id: Date.now().toString(),
        name: productName.trim(),
        price: priceNum,
        sku: sku.trim(),
        quantity: quantityNum,
        createdAt: new Date().toISOString(),
      };

      // Add new product to array
      const updatedProducts = [...existingProducts, newProduct];

      // Save updated array to storage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));

      // Clear form
      setProductName('');
      setPrice('');
      setSku('');
      setQuantity('');

      // Show success toast
      showToast('Product added successfully!', 'success');
      
      console.log('Product added:', newProduct);
      console.log('All products:', updatedProducts);
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('Failed to save product. Please try again.', 'error');
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
        <ScrollView>
        <Text className="text-white text-sm font-light my-2 mt-4 text-end px-2 md:px-6 lg:px-12 md:my-4 lg:my-8 hover:text-purple-300 cursor-pointer hover:font-semibold " onPress={() => router.push('/show_products')}>List of Products</Text>
      <View className="flex-1 justify-center items-center px-6 py-12">
        <Text className="text-white text-4xl font-bold mb-2 text-center">Add Products</Text>
        <Text className="text-purple-300 text-lg mb-8 text-center">Create a new product listing</Text>
        
        <View className="w-full max-w-sm">
          <View className="mb-4">
            <Text className="text-white text-sm mb-1">
              Product Name <Text className="text-red-400">*</Text>
            </Text>
            <TextInput 
              placeholder="Enter your product name" 
              placeholderTextColor="#9ca3af"
              value={productName}
              onChangeText={setProductName}
              className="bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white text-base"
            />
          </View>
            <View className="mb-4">
                <Text className="text-white text-sm mb-1">
                Price <Text className="text-red-400">*</Text>
                </Text>
                <TextInput 
                placeholder="Enter your price (e.g., 19.99)" 
                placeholderTextColor="#9ca3af"
                keyboardType="decimal-pad"
                value={price}
                onChangeText={handlePriceChange}
                className="bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white text-base"
                />
            </View>
          
          <View className="mb-4">
            <Text className="text-white text-sm mb-1">
              SKU <Text className="text-red-400">*</Text>
            </Text>
            <TextInput 
              placeholder="Enter your SKU" 
              placeholderTextColor="#9ca3af"
              value={sku}
              onChangeText={setSku}
              className="bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white text-base"
            />
          </View>

          <View className="mb-4">
            <Text className="text-white text-sm mb-1">
              Quantity <Text className="text-red-400">*</Text>
            </Text>
            <TextInput 
              placeholder="Enter your quantity" 
              placeholderTextColor="#9ca3af"
              keyboardType="number-pad"
              value={quantity}
              onChangeText={handleQuantityChange}
              className="bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white text-base"
            />
          </View>
          <Pressable
            onPress={handleAddProduct}
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
              Add Product
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
      </ScrollView>
    </SafeAreaView>
  );
}