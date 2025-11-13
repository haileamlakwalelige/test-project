import { showToast } from '@/components/Toast';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddProducts() {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const handleAddProduct = () => {
    if (!productName.trim() || !price.trim() || !description.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    // Validate price is a valid number
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast('Please enter a valid price', 'error');
      return;
    }

    try {
      // Product added logic here
      console.log('Product added:', {
        name: productName.trim(),
        price: priceNum,
        description: description.trim()
      });

      // Clear form
      setProductName('');
      setPrice('');
      setDescription('');

      // Show success toast
      showToast('Product added successfully!', 'success');
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('Failed to save product. Please try again.', 'error');
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-1 justify-center items-center px-6 py-12">
        <Text className="text-white text-4xl font-bold mb-2 text-center">Add Products</Text>
        <Text className="text-purple-300 text-lg mb-8 text-center">Create a new product listing</Text>
        
        <View className="w-full max-w-sm">
          <View className="mb-4">
            <Text className="text-white text-sm mb-1">
              Product Name <Text className="text-red-400">*</Text>
            </Text>
            <TextInput 
              placeholder="Product Name (required)" 
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
              placeholder="Price (required)" 
              placeholderTextColor="#9ca3af"
              keyboardType="decimal-pad"
              value={price}
              onChangeText={setPrice}
              className="bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white text-base"
            />
          </View>
          <View className="mb-6">
            <Text className="text-white text-sm mb-1">
              Description <Text className="text-red-400">*</Text>
            </Text>
            <TextInput 
              placeholder="Description (required)" 
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
              className="bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white text-base"
              style={{ textAlignVertical: 'top', minHeight: 100 }}
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
    </SafeAreaView>
  );
}