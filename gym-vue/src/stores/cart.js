// stores/cart.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useCartStore = defineStore('cart', () => {
  const API_URL = import.meta.env.VITE_API_URL;

  // --- 狀態 (State) ---
  const cartItems = ref([]);          
  const addonProducts = ref([]);      
  const subtotal = ref(0);           
  const shippingFee = ref(0);        
  const totalAmount = ref(0);         
  const loadingCart = ref(false);     

  // 結帳頁面所需資料
  const deliveryMethod = ref('');     // 送貨方式
  const paymentMethod = ref('');      // 付款方式
  const orderForm = ref({
  customerName: '王小明',      // 預填假資料
  customerPhone: '0912345678', // 預填假資料
  receiverEmail: 'ming@example.com', // 預填假資料
  receiverName: '',
  receiverPhone: '',
  receiverAddress: '',
  note: ''
});

  // --- 非同步動作 (Actions) ---

  const loadCart = async () => {
  loadingCart.value = true;
  try {
    // 【關鍵修正】：如果推薦清單還沒抓（例如重新整理時），先等它抓完
    // 這樣下方的 isRecommended 才能比對到資料
    if (addonProducts.value.length === 0) {
      await loadRecommendations();
    }

    const resp = await axios.get(`${API_URL}SCarts/User/1`);
    const rawItems = resp.data.Items || [];

    cartItems.value = rawItems.map(item => {
      // 這裡的比對現在 100% 會成功，因為我們上面 await 確保了推薦清單存在
      const isRecommended = addonProducts.value.some(addon => addon.SpecId === item.SpecId);
      
      return {
        ...item,
        // 只有在推薦清單裡的才叫加價購，一般折扣品不會在推薦清單裡
        IsAddon: isRecommended || item.IsAddon || false 
      };
    });

    subtotal.value = resp.data.Subtotal || 0;
    shippingFee.value = resp.data.ShippingFee || 0;
    totalAmount.value = resp.data.TotalAmount || 0;
  } catch (err) {
    console.error("載入購物車失敗", err);
  } finally {
    loadingCart.value = false;
  }
};

  // 2. 載入推薦加價購商品
  const loadRecommendations = async () => {
    try {
      const res = await axios.get(`${API_URL}SCarts/Recommendations/1`);
      addonProducts.value = res.data || [];
    } catch (err) {
      console.error("載入推薦失敗", err);
    }
  };

  // 3. 加入加價購商品 (限制只能加 1 件)
  const addAddonToCart = async (addon) => {
    // 前端檢查：如果已在購物車，就不再發送請求
    const isAlreadyInCart = cartItems.value.some(item => item.SpecId === addon.SpecId);
    if (isAlreadyInCart) {
      alert('此加價購商品已在購物車中，限購一件');
      return;
    }

    try {
      await axios.post(`${API_URL}SCarts/AddToCart`, {
        UserId: 1,
        SpecId: addon.SpecId,
        Quantity: 1,
        IsAddon: true
      });
      await loadCart(); // 重新整理購物車內容與金額
    } catch (err) {
      console.error("加入加價購失敗", err);
    }
  };

  const updateQty = async (index, delta) => {
  const item = cartItems.value[index];
  if (!item) return;

  const isAddonItem = item.IsAddon || item.isAddon || item.is_addon;
  if (isAddonItem && delta > 0) return;

  const nextQty = item.Quantity + delta;

  if (nextQty >= 1) {
    // --- 1. 樂觀更新：直接改前端資料，不觸發 loading 狀態 ---
    item.Quantity = nextQty; 
    
    // 手動重新計算小計與總計（避免畫面金額沒變）
    // 這裡簡單計算，之後 loadCart 會校正回正確的後端金額
    subtotal.value += (item.Price * delta);
    totalAmount.value += (item.Price * delta);

    try {
      // --- 2. 背景發送 API，不需要 await 阻止畫面更新 ---
      await axios.post(`${API_URL}SCarts/AddToCart`, {
        UserId: 1,
        SpecId: item.SpecId,
        Quantity: delta 
      });
      
      // --- 3. 靜默更新：重新整理資料，但不要設 loadingCart.value = true ---
      // 我們另外寫一個不帶 loading 狀態的 refreshCart
      await refreshCartSilently(); 
      
    } catch (err) {
      console.error("更新失敗，恢復原始狀態", err);
      await loadCart(); // 失敗了才顯示載入中並刷回正確資料
    }
  } else {
    removeItem(index);
  }
};

// 增加一個「靜默重新載入」的方法
const refreshCartSilently = async () => {
  try {
    const resp = await axios.get(`${API_URL}SCarts/User/1`);
    const rawItems = resp.data.Items || [];
    
    // 保持 IsAddon 邏輯
    cartItems.value = rawItems.map(item => ({
      ...item,
      IsAddon: addonProducts.value.some(addon => addon.SpecId === item.SpecId) || item.IsAddon
    }));

    subtotal.value = resp.data.Subtotal || 0;
    shippingFee.value = resp.data.ShippingFee || 0;
    totalAmount.value = resp.data.TotalAmount || 0;
  } catch (err) {
    console.error("靜默載入失敗", err);
  }
};

  // 5. 移除商品
  const removeItem = async (index) => {
  const item = cartItems.value[index];
  if (!item) return;

  // 1. 樂觀更新：直接從前端陣列移除，畫面會立刻反應
  const backupItems = [...cartItems.value]; // 備份一份，萬一 API 失敗可以還原
  cartItems.value.splice(index, 1);

  try {
    // 2. 背景發送刪除 API
    await axios.delete(`${API_URL}SCarts/${item.CartId}`);

    // 3. 靜默刷新（不觸發 loading 狀態）
    // 使用我們之前寫好的 refreshCartSilently 
    await refreshCartSilently();

  } catch (err) {
    console.error("移除商品失敗，還原列表", err);
    cartItems.value = backupItems; // 失敗時還原
    alert('移除失敗，請稍後再試');
  }
};

  // 6. 清空表單 (下單成功後使用)
  const resetOrderForm = () => {
    orderForm.value = {
      receiverName: '',
      receiverPhone: '',
      receiverEmail: '',
      receiverAddress: '',
      note: ''
    };
    deliveryMethod.value = '';
    paymentMethod.value = '';
  };

  return {
    // 狀態
    cartItems,
    addonProducts,
    subtotal,
    shippingFee,
    totalAmount,
    loadingCart,
    deliveryMethod,
    paymentMethod,
    orderForm,
    // 方法
    loadCart,
    loadRecommendations,
    addAddonToCart,
    updateQty,
    removeItem,
    resetOrderForm
  };
});