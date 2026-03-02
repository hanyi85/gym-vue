// stores/cart.js
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import axios from 'axios';

export const useCartStore = defineStore('cart', () => {
  const API_URL = import.meta.env.VITE_API_URL;

  // --- 狀態 ---
  const cartItems = ref([]);
  const addonProducts = ref([]);
  const subtotal = ref(0);
  const shippingFee = ref(0);
  const totalAmount = ref(0);
  const loadingCart = ref(false);

  // ✅【關鍵修正】初始化就從 localStorage 讀
  const deliveryMethod = ref(localStorage.getItem('deliveryMethod') || '');
  const paymentMethod = ref(localStorage.getItem('paymentMethod') || '');

  // 結帳表單（完全保留你原本結構）
  const orderForm = ref({
    customerName: '王小明',
    customerPhone: '0912345678',
    receiverEmail: 'ming@example.com',
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    note: ''
  });

  // --- 同步 localStorage ---
  watch(deliveryMethod, v => localStorage.setItem('deliveryMethod', v));
  watch(paymentMethod, v => localStorage.setItem('paymentMethod', v));

  // --- 載入購物車 ---
  const loadCart = async () => {
    loadingCart.value = true;
    try {
      if (addonProducts.value.length === 0) {
        await loadRecommendations();
      }

      const resp = await axios.get(`${API_URL}SCarts/User/1`);
      const rawItems = resp.data.Items || [];

      cartItems.value = rawItems.map(item => ({
        ...item,
        IsAddon:
          addonProducts.value.some(addon => addon.SpecId === item.SpecId) ||
          item.IsAddon ||
          false
      }));

      subtotal.value = resp.data.Subtotal || 0;
      shippingFee.value = resp.data.ShippingFee || 0;
      totalAmount.value = resp.data.TotalAmount || 0;
    } catch (err) {
      console.error('載入購物車失敗', err);
    } finally {
      loadingCart.value = false;
    }
  };

  // --- 推薦商品 ---
  const loadRecommendations = async () => {
    try {
      const res = await axios.get(`${API_URL}SCarts/Recommendations/1`);
      addonProducts.value = res.data || [];
    } catch (err) {
      console.error('載入推薦失敗', err);
    }
  };

  // --- 加入加價購 ---
  const addAddonToCart = async addon => {
    const exists = cartItems.value.some(i => i.SpecId === addon.SpecId);
    if (exists) {
      alert('此加價購商品已在購物車中');
      return;
    }

    await axios.post(`${API_URL}SCarts/AddToCart`, {
      UserId: 1,
      SpecId: addon.SpecId,
      Quantity: 1,
      IsAddon: true
    });
    await loadCart();
  };

  // --- 更新數量 ---
  const updateQty = async (index, delta) => {
    const item = cartItems.value[index];
    if (!item) return;

    if (item.IsAddon && delta > 0) return;

    const nextQty = item.Quantity + delta;
    if (nextQty < 1) {
      await removeItem(index);
      return;
    }

    item.Quantity = nextQty;
    subtotal.value += item.Price * delta;
    totalAmount.value += item.Price * delta;

    try {
      await axios.post(`${API_URL}SCarts/AddToCart`, {
        UserId: 1,
        SpecId: item.SpecId,
        Quantity: delta
      });
      await refreshCartSilently();
    } catch {
      await loadCart();
    }
  };

  const refreshCartSilently = async () => {
    const resp = await axios.get(`${API_URL}SCarts/User/1`);
    cartItems.value = resp.data.Items || [];
    subtotal.value = resp.data.Subtotal || 0;
    shippingFee.value = resp.data.ShippingFee || 0;
    totalAmount.value = resp.data.TotalAmount || 0;
  };

  // --- 移除商品 ---
  const removeItem = async index => {
    const item = cartItems.value[index];
    if (!item) return;

    const backup = [...cartItems.value];
    cartItems.value.splice(index, 1);

    try {
      await axios.delete(`${API_URL}SCarts/${item.CartId}`);
      await refreshCartSilently();
    } catch {
      cartItems.value = backup;
    }
  };

  // --- 清空 ---
  const resetOrderForm = () => {
    orderForm.value = {
      customerName: '',
      customerPhone: '',
      receiverEmail: '',
      receiverName: '',
      receiverPhone: '',
      receiverAddress: '',
      note: ''
    };
    deliveryMethod.value = '';
    paymentMethod.value = '';
  };

  const clearCart = () => {
    cartItems.value = [];
    resetOrderForm();
    localStorage.removeItem('deliveryMethod');
    localStorage.removeItem('paymentMethod');
  };

  return {
    cartItems,
    addonProducts,
    subtotal,
    shippingFee,
    totalAmount,
    loadingCart,
    deliveryMethod,
    paymentMethod,
    orderForm,
    loadCart,
    loadRecommendations,
    addAddonToCart,
    updateQty,
    removeItem,
    clearCart
  };
});