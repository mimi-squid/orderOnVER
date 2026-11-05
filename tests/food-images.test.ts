import {describe,it,expect} from 'vitest';
import {menuItems} from '../src/data/seed';
import {foodImages,correctedDemoImage} from '../src/data/food-images';
import {existsSync} from 'node:fs';
describe('dish-specific demo photos',()=>{
 it('gives every seeded dish a unique local photo',()=>{expect(menuItems).toHaveLength(25);expect(new Set(menuItems.map(i=>i.image)).size).toBe(25);for(const item of menuItems){expect(item.image).toBe(foodImages[item.name]);expect(existsSync('public'+item.image)).toBe(true)}});
 it('corrects old demo photos while preserving merchant edits',()=>{const old='https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=800&q=80';expect(correctedDemoImage({id:'item-1-1',name:'Masala Dosa',image:old})).toBe('/food/masala-dosa.webp');expect(correctedDemoImage({id:'item-1-1',name:'Masala Dosa',image:'data:image/webp;base64,custom'})).toBe('data:image/webp;base64,custom');expect(correctedDemoImage({id:'custom-item',name:'Masala Dosa',image:old})).toBe(old)});
});
