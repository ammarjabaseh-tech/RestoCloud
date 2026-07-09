-- ==========================================
-- RestoCloud - Seed Data (بيانات أولية تجريبية)
-- ==========================================

-- TENANTS
INSERT INTO tenants (id, subdomain, name_ar, logo, theme_color, currency, tax_rate, address, phone, owner_name, owner_email, password_hash, status, slogan, wifi_password, subscription_plan, subscription_amount, created_at) VALUES
('tenant-1', 'shami',  'مذاق الشام للأكلات السورية والمشاوي',    '🥙', 'emerald', 'ر.س', 15, 'الرياض، طريق الملك فهد - حي العليا', '0501234567', 'أبو وليد الشامي',   'owner@shami-food.com',   '123', 'active', 'أصل النكهة الشامية العريقة، من دمشق إلى طاولتك', 'shami2026_wifi', 'starter', 199, '2025-01-10'),
('tenant-2', 'burger', 'برجر كنج دوم - أصل البرجر الأمريكي',      '🍔', 'amber',   'ر.س', 15, 'جدة، شارع التحلية - مركز الجرموق',    '0559876543', 'م. خالد الحربي',    'khaled@burger-king.com', '123', 'active', 'برجر مشوي على الفحم مع الصوص السري الحصري',     'bk_guest_fast',  'starter', 199, '2025-02-14'),
('tenant-3', 'napoli', 'بيتزا نابولي الإيطالية - فرن الحطب',      '🍕', 'rose',    'ر.س', 15, 'الخبر، الكورنيش الشمالي',              '0543322110', 'الشيف ماركو وتامر', 'marco@napoli-pizza.com', '123', 'active', 'عجينة تخمير بطيء لمدة 48 ساعة، مخبوزة بفرن الحطب النابولي', 'napoli_pizza', 'starter', 199, '2025-03-01'),
('tenant-4', 'qahwa',  'قهوة وسكر - كافيه ومحمصة مختصة',         '☕', 'indigo',  'ر.س', 15, 'الرياض، بوليفارد سيتي',               '0561122334', 'سارة العتيبي',      'sara@qahwa-sugar.com',   '123', 'active', 'بن مختص محمص بعناية مع أشهى المخبوزات الفرنسية', 'coffee_lovers', 'pro',     399, '2025-03-15'),
('tenant-5', 'sushi',  'تولوم سوشي - مطعم مأكولات بحرية ويابانية','🍣', 'violet',  'ر.س', 15, 'الرياض، حي السليمانية - شارع الضباب', '0587654321', 'م. طارق عبد المطلب','tarek@tulum-sushi.com',  '123', 'pending_approval', 'سوشي طازج على الطريقة اليابانية', 'sushi_guest', 'pro', 399, '2026-07-04')
ON CONFLICT (id) DO NOTHING;

-- CATEGORIES - Tenant 1 (Shami)
INSERT INTO categories (id, tenant_id, name_ar, icon, order_index) VALUES
('cat-101','tenant-1','مشاوي على الفحم','🔥',1),
('cat-102','tenant-1','شاورما وسندويشات','🥙',2),
('cat-103','tenant-1','مقبلات شرفية وسلطات','🥗',3),
('cat-104','tenant-1','أطباق كبة ومحاشي','🧆',4),
('cat-105','tenant-1','حلويات ومشروبات','🍹',5),
-- Tenant 2 (Burger)
('cat-201','tenant-2','برجر لحم أنجوس','🍔',1),
('cat-202','tenant-2','برجر دجاج كرسبي','🍗',2),
('cat-203','tenant-2','بطاطس ومقبلات ساخنة','🍟',3),
('cat-204','tenant-2','ميلك شيك ومشروبات','🥤',4),
-- Tenant 3 (Napoli)
('cat-301','tenant-3','بيتزا نابوليتانا (فرن الحطب)','🍕',1),
('cat-302','tenant-3','باستا إيطالية طازجة','🍝',2),
('cat-303','tenant-3','مقبلات وخبز بالثوم','🥖',3),
('cat-304','tenant-3','تيراميسو وحلويات','🍰',4),
-- Tenant 4 (Qahwa)
('cat-401','tenant-4','قهوة مختصة ساخنة','☕',1),
('cat-402','tenant-4','آيس كوفي وماتشا','🧋',2),
('cat-403','tenant-4','كرواسون ومخبوزات فرنسية','🥐',3),
('cat-404','tenant-4','كيك وسان سيباستيان','🧁',4)
ON CONFLICT (id) DO NOTHING;

-- MENU ITEMS - Tenant 1 (Shami)
INSERT INTO menu_items (id, tenant_id, category_id, name_ar, description_ar, price, cost_price, calories, image, is_available, is_best_seller, preparation_time_min) VALUES
('item-101','tenant-1','cat-101','مشاوي مشكلة حلبي (كيلو)','كباب لحم، كباب دجاج، شيش طاووق، وأوصال لحم نعيمي طازج مشوي على فحم السنديان',145,65,1250,'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',true,true,20),
('item-102','tenant-1','cat-101','كباب باذنجان دمشقي','أسياخ كباب اللحم البلدي بالتناوب مع باذنجان مشوي، متبل بالدبس السوري',48,20,680,'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',true,false,18),
('item-103','tenant-1','cat-102','وجبة شاورما دجاج عربي دبل','قطع شاورما دجاج متبلة بالبهارات الشامية، ملفوفة بخبز الصاج مع بطاطس مقلية',34,14,820,'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80',true,true,10),
('item-104','tenant-1','cat-103','تبولة شامية بزيت الزيتون والرمان','بقدونس مفروم ناعم، طماطم، برغل ناعم، نعناع طازج مع عصير الليمون',22,7,190,'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',true,true,8),
('item-105','tenant-1','cat-104','كبة مقلية مقرمشة (5 حبات)','أقراص كبة البرغل المحشوة باللحم المفروم والبصل والصنوبر المحمص',28,11,450,'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',true,false,12),
-- Tenant 2 (Burger)
('item-201','tenant-2','cat-201','سماش برجر دبل ترافل وبايت','شريحتا لحم أنجوس فاخر مهروس على الصاج مع جبنة الشيدر الذائبة وصوص الترافل',42,18,890,'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',true,true,12),
('item-202','tenant-2','cat-202','كرسبي تشيكن سبايسي ميجا','صدر دجاج طازج مقرمش وحار، كولسلو مقرمش، مخلل خيار حلو',36,15,780,'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=600&auto=format&fit=crop&q=80',true,true,10),
('item-203','tenant-2','cat-203','بطاطس بالجبنة والبيكون المقرمش','بطاطس كرينكل كوت مغطاة بصلصة جبنة الشيدر الدافئة',24,8,610,'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&auto=format&fit=crop&q=80',true,false,7),
-- Tenant 3 (Napoli)
('item-301','tenant-3','cat-301','بيتزا مارغريتا دي بافالا الملكية','صلصة طماطم سان مارزانو، جبنة موزاريلا البافالو الطازجة، أوراق الريحان',58,22,850,'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80',true,true,15),
('item-302','tenant-3','cat-301','بيتزا بيبروني ترافل وهاني','شرائح بيبروني بقري مدخن، جبنة فيور دي لاتيه، زيت الكمأة والعسل الحار',65,26,960,'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80',true,true,15),
('item-303','tenant-3','cat-302','فيتوتشيني ألفريدو بالدجاج والفطر','باستا فيتوتشيني محضرة طازجة في صلصة كريمة البارميزان الغنية',52,20,820,'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=600&auto=format&fit=crop&q=80',true,false,18),
-- Tenant 4 (Qahwa)
('item-401','tenant-4','cat-401','سبانيش لاتيه ساخن (مختص)','شوت اسبريسو مزدوج من بن إثيوبي فاخر مع حليب مبخر وحليب مكثف محلى',24,6,230,'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=80',true,true,5),
('item-402','tenant-4','cat-402','آيس ماتشا لاتيه احترافي','بودرة شاي الماتشا الياباني العضوي الفاخر مع حليب لوز أو حليب طبيعي',28,8,160,'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80',true,true,4),
('item-403','tenant-4','cat-404','كيكة سان سيباستيان المحروقة','تشيز كيك سان سيباستيان إسباني بقوام كريمي ذائب من الداخل مع صوص شوكولاتة',38,14,550,'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80',true,true,3)
ON CONFLICT (id) DO NOTHING;

-- RESTAURANT TABLES
INSERT INTO restaurant_tables (id, tenant_id, table_number, capacity, status) VALUES
('tbl-101','tenant-1',1,4,'available'),
('tbl-102','tenant-1',2,4,'available'),
('tbl-103','tenant-1',3,6,'available'),
('tbl-104','tenant-1',4,8,'available'),
('tbl-105','tenant-1',5,2,'available'),
('tbl-106','tenant-1',6,4,'available'),
('tbl-201','tenant-2',1,2,'available'),
('tbl-202','tenant-2',2,4,'available'),
('tbl-203','tenant-2',3,4,'available'),
('tbl-204','tenant-2',4,6,'available'),
('tbl-301','tenant-3',1,4,'available'),
('tbl-302','tenant-3',2,4,'available'),
('tbl-303','tenant-3',3,6,'available'),
('tbl-401','tenant-4',1,2,'available'),
('tbl-402','tenant-4',2,2,'available'),
('tbl-403','tenant-4',3,4,'available')
ON CONFLICT (tenant_id, table_number) DO NOTHING;

-- TENANT USERS
INSERT INTO tenant_users (id, tenant_id, name, email, phone, password_hash, role, status, avatar, can_manage_pos, can_manage_menu, can_manage_users, can_view_reports, can_manage_settings) VALUES
('user-101','tenant-1','أبو وليد الشامي','owner@shami-food.com','0501234567','123','owner','active','👨‍🍳',true,true,true,true,true),
('user-102','tenant-1','سمير الميداني','manager@shami-food.com','0509988771','123','manager','active','👔',true,true,false,true,false),
('user-103','tenant-1','أحمد عبد الله','cashier@shami-food.com','0543322119','123','cashier','active','🖥️',true,false,false,false,false),
('user-104','tenant-1','بلال السوري','waiter@shami-food.com','0561122338','123','waiter','active','🍽️',true,false,false,false,false),
('user-201','tenant-2','م. خالد الحربي','khaled@burger-king.com','0559876543','123','owner','active','👨‍💼',true,true,true,true,true),
('user-202','tenant-2','فهد الغامدي','fahad@burger-king.com','0551122334','123','cashier','active','🖥️',true,false,false,false,false),
('user-301','tenant-3','الشيف ماركو وتامر','marco@napoli-pizza.com','0543322110','123','owner','active','👨‍🍳',true,true,true,true,true),
('user-401','tenant-4','سارة العتيبي','sara@qahwa-sugar.com','0561122334','123','owner','active','👩‍💼',true,true,true,true,true),
('user-501','tenant-5','م. طارق عبد المطلب','tarek@tulum-sushi.com','0587654321','123','owner','active','👨‍💼',true,true,true,true,true)
ON CONFLICT (tenant_id, email) DO NOTHING;

-- INVOICES
INSERT INTO invoices (id, invoice_number, tenant_id, tenant_name, plan, amount, billing_period, issue_date, due_date, status) VALUES
('inv-1','INV-2026-0101','tenant-1','مذاق الشام للأكلات السورية والمشاوي','starter',199,'شهري - 1 يوليو 2026 إلى 1 أغسطس 2026','2026-07-01','2026-07-05','paid'),
('inv-2','INV-2026-0102','tenant-4','قهوة وسكر - كافيه ومحمصة مختصة','pro',399,'شهري - 15 يونيو 2026 إلى 15 يوليو 2026','2026-06-15','2026-06-20','paid'),
('inv-3','INV-2026-0103','tenant-2','برجر كنج دوم - أصل البرجر الأمريكي','starter',199,'شهري - 1 يوليو 2026 إلى 1 أغسطس 2026','2026-07-01','2026-07-06','pending'),
('inv-4','INV-2026-0104','tenant-5','تولوم سوشي - مطعم مأكولات بحرية ويابانية','pro',399,'شهري - 4 يوليو 2026 إلى 4 أغسطس 2026','2026-07-04','2026-07-09','pending')
ON CONFLICT (id) DO NOTHING;
