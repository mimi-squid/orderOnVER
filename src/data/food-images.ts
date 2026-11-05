// Dish-specific demo photos. Attribution: public/food/credits.html.
export const foodImages:Record<string,string>={
  "Masala Dosa": "/food/masala-dosa.webp",
  "Idli & Sambar": "/food/idli-sambar.webp",
  "Medu Vada": "/food/medu-vada.webp",
  "South Indian Meals": "/food/south-indian-meals.webp",
  "Lemon Rice": "/food/lemon-rice.webp",
  "Curd Rice": "/food/curd-rice.webp",
  "Filter Coffee": "/food/filter-coffee.webp",
  "Gulab Jamun": "/food/gulab-jamun.webp",
  "Egg Dosa": "/food/egg-dosa.webp",
  "Cappuccino": "/food/cappuccino.webp",
  "Cold Coffee": "/food/cold-coffee.webp",
  "Masala Chai": "/food/masala-chai.webp",
  "Grilled Sandwich": "/food/grilled-sandwich.webp",
  "Paneer Sandwich": "/food/paneer-sandwich.webp",
  "Chocolate Brownie": "/food/chocolate-brownie.webp",
  "Lemon Iced Tea": "/food/lemon-iced-tea.webp",
  "French Fries": "/food/french-fries.webp",
  "Samosa": "/food/samosa.webp",
  "Veg Noodles": "/food/veg-noodles.webp",
  "Fried Rice": "/food/fried-rice.webp",
  "Paneer Roll": "/food/paneer-roll.webp",
  "Chicken Roll": "/food/chicken-roll.webp",
  "Fresh Lime Juice": "/food/fresh-lime-juice.webp",
  "Mango Juice": "/food/mango-juice.webp",
  "Pav Bhaji": "/food/pav-bhaji.webp"
};
const legacyImages=new Set([
 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80'
]);
// Upgrade only original demo photographs; never replace a merchant's uploaded image.
export function correctedDemoImage(item:{id:string;name:string;image:string}){
 return /^item-[123]-[0-9]+$/.test(item.id)&&legacyImages.has(item.image)?foodImages[item.name]??item.image:item.image;
}
