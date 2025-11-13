import { showToast } from '@/components/Toast';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STORAGE_KEY = '@products';

interface Product {
  id: string;
  name: string;
  price: number;
  sku: string;
  quantity: number;
  createdAt: string;
}

export default function ShowProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editSku, setEditSku] = useState('');
  const [editQuantity, setEditQuantity] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const productsJson = await AsyncStorage.getItem(STORAGE_KEY);
      const loadedProducts = productsJson ? JSON.parse(productsJson) : [];
      setProducts(loadedProducts);
    } catch (error) {
      // console.error('Error loading products:', error);
      showToast('Failed to load products. Please try again.', 'error');
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

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(product.price.toString());
    setEditSku(product.sku);
    setEditQuantity(product.quantity.toString());
  };

  // Handle price input - allow only numbers and one decimal point
  const handleEditPriceChange = (text: string) => {
    // Remove any non-numeric characters except decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      setEditPrice(parts[0] + '.' + parts.slice(1).join(''));
    } else {
      setEditPrice(cleaned);
    }
  };

  // Handle quantity input - allow only whole numbers
  const handleEditQuantityChange = (text: string) => {
    // Remove any non-numeric characters
    const cleaned = text.replace(/[^0-9]/g, '');
    setEditQuantity(cleaned);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    if (!editName.trim() || !editPrice.trim() || !editSku.trim() || !editQuantity.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    // Validate price is a valid decimal number
    const priceNum = parseFloat(editPrice);
    if (isNaN(priceNum) || priceNum <= 0 || !isFinite(priceNum)) {
      showToast('Please enter a valid price (numbers only, decimals allowed)', 'error');
      return;
    }

    // Validate quantity is a valid whole number
    const quantityNum = parseInt(editQuantity, 10);
    if (isNaN(quantityNum) || quantityNum <= 0 || !Number.isInteger(quantityNum)) {
      showToast('Please enter a valid quantity (whole numbers only)', 'error');
      return;
    }

    // Check if SKU is being changed and if new SKU already exists (to make sure the SKU is unique)
    const skuLower = editSku.trim().toLowerCase();
    if (skuLower !== editingProduct.sku.toLowerCase()) {
      const skuExists = products.some(
        (product) => product.id !== editingProduct.id && product.sku?.toLowerCase() === skuLower
      );

      if (skuExists) {
        showToast('SKU already exists. Please use a unique SKU.', 'error');
        return;
      }
    }

    try {
      const updatedProducts = products.map((product) =>
        product.id === editingProduct.id
          ? {
              ...product,
              name: editName.trim(),
              price: priceNum,
              sku: editSku.trim(),
              quantity: quantityNum,
            }
          : product
      );

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
      setEditingProduct(null);
      setEditName('');
      setEditPrice('');
      setEditSku('');
      setEditQuantity('');
      showToast('Product updated successfully!', 'success');
    } catch (error) {
      // console.error('Error updating product:', error);
      showToast('Failed to update product. Please try again.', 'error');
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditName('');
    setEditPrice('');
    setEditSku('');
    setEditQuantity('');
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-1 px-6 py-8">
        <View className="mb-6">
          <Text className="text-white text-4xl font-bold mb-2 text-center">Products List</Text>
          <Text className="text-purple-300 text-lg text-center">
            {products.length} {products.length === 1 ? 'product' : 'products'} registered
          </Text>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-white text-lg">Loading products...</Text>
          </View>
        ) : products.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <View className="bg-white/10 border border-white/20 rounded-2xl p-8 max-w-sm">
              <Text className="text-white text-xl font-semibold mb-2 text-center">
                No products yet
              </Text>
              <Text className="text-gray-400 text-sm text-center mb-6">
                Start by adding your first product
              </Text>
              <Pressable
                onPress={() => router.push('/add-products')}
                className="bg-indigo-500 rounded-xl py-3 px-6"
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                <Text className="text-white text-base font-semibold text-center">
                  Add Product
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <FlatList
            data={products}
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
                      {item.price} USD, Quantity: {item.quantity}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => handleEdit(item)}
                    className="bg-purple-500 rounded-lg p-2"
                    style={({ pressed }) => [
                      {
                        opacity: pressed ? 0.8 : 1,
                        transform: [{ scale: pressed ? 0.95 : 1 }],
                      },
                    ]}
                  >
                    <MaterialIcons name="edit" size={20} color="#ffffff" />
                  </Pressable>
                </View>
                <View className="border-t border-white/10 pt-3">
                  <Text className="text-gray-400 text-xs">
                    Added: {formatDate(item.createdAt)}, SKU: {item.sku}
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

        {/* Edit Modal */}
        <Modal
          visible={editingProduct !== null}
          transparent={true}
          animationType="slide"
          onRequestClose={handleCancelEdit}
        >
          <View className="flex-1 bg-black/50 justify-center items-center px-6">
            <View className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm border border-white/20">
              <Text className="text-white text-2xl font-bold mb-4 text-center">
                Edit Product
              </Text>

              <View className="mb-4">
                <Text className="text-white text-sm mb-1">
                  Product Name <Text className="text-red-400">*</Text>
                </Text>
                <TextInput
                  placeholder="Product Name"
                  placeholderTextColor="#9ca3af"
                  value={editName}
                  onChangeText={setEditName}
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-base"
                />
              </View>

              <View className="mb-4">
                <Text className="text-white text-sm mb-1">
                  Price <Text className="text-red-400">*</Text>
                </Text>
                <TextInput
                  placeholder="Price (e.g., 19.99)"
                  placeholderTextColor="#9ca3af"
                  keyboardType="decimal-pad"
                  value={editPrice}
                  onChangeText={handleEditPriceChange}
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-base"
                />
              </View>

              <View className="mb-4">
                <Text className="text-white text-sm mb-1">
                  SKU <Text className="text-red-400">*</Text>
                </Text>
                <TextInput
                  placeholder="SKU"
                  placeholderTextColor="#9ca3af"
                  value={editSku}
                  onChangeText={setEditSku}
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-base"
                />
              </View>

              <View className="mb-6">
                <Text className="text-white text-sm mb-1">
                  Quantity <Text className="text-red-400">*</Text>
                </Text>
                <TextInput
                  placeholder="Quantity (whole number)"
                  placeholderTextColor="#9ca3af"
                  keyboardType="number-pad"
                  value={editQuantity}
                  onChangeText={handleEditQuantityChange}
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-base"
                />
              </View>

              <View className="flex-row gap-3">
                <Pressable
                  onPress={handleCancelEdit}
                  className="flex-1 bg-white/10 rounded-xl py-3 border border-white/20"
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text className="text-white text-base font-semibold text-center">
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleSaveEdit}
                  className="flex-1 bg-indigo-500 rounded-xl py-3"
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text className="text-white text-base font-semibold text-center">
                    Save
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}