<template>
  <div class="diet-card">
    <!-- Header -->
    <div class="header">
      <div class="title-wrap">
        <i class="fa fa-cutlery icon"></i>
        <div>
          <h5>飲食紀錄 <span class="en">Diet Records</span></h5>
          <p class="sub">TODAY’S NUTRITION SUMMARY</p>
        </div>
      </div>
      <button class="add-btn">＋</button>
    </div>

    <!-- Summary -->
    <div class="summary">
      <div class="summary-item">
        <p class="num">1,840</p>
        <span class="label orange">CALORIES</span>
      </div>
      <div class="summary-item">
        <p class="num">142g</p>
        <span class="label blue">PROTEIN</span>
      </div>
      <div class="summary-item">
        <p class="num">58g</p>
        <span class="label yellow">FATS</span>
      </div>
    </div>

    <!-- Meal list -->
    <ul class="meal-list">
      <li
        v-for="meal in meals"
        :key="meal.name"
        class="meal-item"
      >
        <div class="meal-left">
          <div class="meal-icon">
            <i :class="meal.icon"></i>
          </div>
          <div>
            <p class="meal-name">{{ meal.name }}</p>
            <p class="meal-desc">{{ meal.desc }}</p>
          </div>
        </div>

        <div class="meal-right">
          <span class="time">{{ meal.time }}</span>
          <span class="kcal">{{ meal.kcal }}<small> kcal</small></span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
const meals = [
  {
    name: 'Breakfast',
    desc: 'Oatmeal with Blueberries & Whey',
    time: '08:30 AM',
    kcal: 420,
    icon: 'fa fa-coffee',
  },
  {
    name: 'Lunch',
    desc: 'Grilled Chicken Salad with Avocado',
    time: '12:45 PM',
    kcal: 650,
    icon: 'fa fa-cutlery',
  },
  {
    name: 'Snack',
    desc: 'Greek Yogurt & Almonds',
    time: '04:15 PM',
    kcal: 280,
    icon: 'fa fa-apple',
  },
]
</script>

<style scoped>
.diet-card {
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
}

/* header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-wrap {
  display: flex;
  gap: 12px;
}

.icon {
  color: #f38d00;
  font-size: 20px;
}

.en {
  font-size: 13px;
  color: #999;
  margin-left: 6px;
}

.sub {
  font-size: 12px;
  color: #bbb;
}

.add-btn {
  background: #fff2e0;
  color: #f38d00;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 20px;
}

/* summary */
.summary {
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  text-align: center;
}

.summary-item {
  flex: 1;
}

.num {
  font-size: 22px;
  font-weight: bold;
}

.label {
  display: inline-block;
  margin-top: 6px;
  font-size: 11px;
  font-weight: 600;
  padding-bottom: 4px;
  border-bottom: 3px solid transparent;
}

.orange {
  color: #f38d00;
  border-color: #f38d00;
}

.blue {
  color: #3b82f6;
  border-color: #3b82f6;
}

.yellow {
  color: #facc15;
  border-color: #facc15;
}

/* meal list */
.meal-list {
  
  list-style: none;
  padding: 0;
  margin: 0;
}

.meal-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-top: 1px solid #f0f0f0;
}

.meal-left {
  display: flex;
  gap: 12px;
    min-width: 0;
}

.meal-icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: #fff2e0;
  color: #f38d00;
  display: flex;
  align-items: center;
  justify-content: center;
}

.meal-name {
  font-weight: 600;
}

.meal-desc {
  font-size: 13px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meal-right {
  text-align: right;
}

.time {
  font-size: 12px;
  color: #999;
}

.kcal {
  font-weight: bold;
  font-size: 16px;
}
</style>
