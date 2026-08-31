// Comprehensive Vietnamese-English culinary dictionary & intelligent translator

export const CATEGORY_MAP: Record<string, { en: string; vi: string }> = {
  Chicken: { en: "Chicken", vi: "Thịt gà" },
  Beef: { en: "Beef", vi: "Thịt bò" },
  Seafood: { en: "Seafood", vi: "Hải sản" },
  Vegetarian: { en: "Vegetarian", vi: "Món chay" },
  Pasta: { en: "Pasta", vi: "Mì Ý" },
  Dessert: { en: "Dessert", vi: "Tráng miệng" },
  Breakfast: { en: "Breakfast", vi: "Bữa sáng" },
  Pork: { en: "Pork", vi: "Thịt heo" },
  Lamb: { en: "Lamb", vi: "Thịt cừu" },
  Side: { en: "Side Dish", vi: "Món phụ" },
  Starter: { en: "Starter", vi: "Khai vị" },
  Vegan: { en: "Vegan", vi: "Thuần chay" },
  Miscellaneous: { en: "Miscellaneous", vi: "Món tổng hợp" },
  Goat: { en: "Goat", vi: "Thịt dê" },
};

export const AREA_MAP: Record<string, { en: string; vi: string }> = {
  Vietnamese: { en: "Vietnamese", vi: "Việt Nam" },
  Japanese: { en: "Japanese", vi: "Nhật Bản" },
  Italian: { en: "Italian", vi: "Ý" },
  American: { en: "American", vi: "Mỹ" },
  British: { en: "British", vi: "Anh" },
  Canadian: { en: "Canadian", vi: "Canada" },
  Chinese: { en: "Chinese", vi: "Trung Hoa" },
  Croatian: { en: "Croatian", vi: "Croatia" },
  Dutch: { en: "Dutch", vi: "Hà Lan" },
  Egyptian: { en: "Egyptian", vi: "Ai Cập" },
  Filipino: { en: "Filipino", vi: "Philippines" },
  French: { en: "French", vi: "Pháp" },
  Greek: { en: "Greek", vi: "Hy Lạp" },
  Indian: { en: "Indian", vi: "Ấn Độ" },
  Irish: { en: "Irish", vi: "Ireland" },
  Jamaican: { en: "Jamaican", vi: "Jamaica" },
  Kenyan: { en: "Kenyan", vi: "Kenya" },
  Malaysian: { en: "Malaysian", vi: "Malaysia" },
  Mexican: { en: "Mexican", vi: "Mexico" },
  Moroccan: { en: "Moroccan", vi: "Maroc" },
  Polish: { en: "Polish", vi: "Ba Lan" },
  Portuguese: { en: "Portuguese", vi: "Bồ Đào Nha" },
  Russian: { en: "Russian", vi: "Nga" },
  Spanish: { en: "Spanish", vi: "Tây Ban Nha" },
  Thai: { en: "Thai", vi: "Thái Lan" },
  Tunisian: { en: "Tunisian", vi: "Tunisia" },
  Turkish: { en: "Turkish", vi: "Thổ Nhĩ Kỳ" },
  Ukrainian: { en: "Ukrainian", vi: "Ukraine" },
  International: { en: "International", vi: "Quốc tế" },
};

export const DIFFICULTY_MAP: Record<string, { en: string; vi: string }> = {
  Easy: { en: "Easy", vi: "Dễ" },
  Medium: { en: "Medium", vi: "Vừa" },
  Hard: { en: "Hard", vi: "Khó" },
};

export const RECIPE_TITLE_MAP: Record<string, string> = {
  "teriyaki chicken casserole": "Gà nướng Teriyaki rau củ kiểu Nhật",
  "chicken handi": "Cà ri gà nấu niêu truyền thống (Chicken Handi)",
  "chicken & mushroom hotpot": "Lẩu gà nấm hầm thơm ngon",
  "chicken couscous": "Cơm hạt Couscous gà hầm rau củ",
  "chicken fajita macaroni & cheese": "Mì nui phô mai đút lò gà Fajita",
  "chicken ham and leek pie": "Bánh nướng nhân thịt gà, giăm bông và tỏi tây",
  "chicken marengo": "Gà sốt vang Marengo kiểu Pháp",
  "chicken parmigiana": "Gà chiên giòn phủ sốt cà chua và phô mai Parmigiana",
  "miso butter garlic noodles": "Mì tỏi bơ sốt Miso thơm lừng",
  "harvest roasted veggie bowl": "Tô rau củ nướng mùa thu dinh dưỡng",
  "pan-seared citrus salmon": "Cá hồi áp chảo sốt cam chanh",
};

export const INGREDIENT_MAP: Record<string, string> = {
  "soy sauce": "Nước tương (Xì dầu)",
  "dark soy sauce": "Hắc xì dầu",
  "light soy sauce": "Nước tương nhạt",
  "water": "Nước lọc",
  "warm water": "Nước ấm",
  "cold water": "Nước lạnh",
  "boiling water": "Nước sôi",
  "brown sugar": "Đường nâu",
  "sugar": "Đường kính",
  "white sugar": "Đường trắng",
  "caster sugar": "Đường bột mịn",
  "icing sugar": "Đường bột",
  "ground ginger": "Bột gừng",
  "ginger": "Gừng tươi",
  "fresh ginger": "Gừng tươi",
  "minced garlic": "Tỏi băm nhỏ",
  "garlic cloves": "Tép tỏi",
  "garlic clove": "Tép tỏi",
  "garlic": "Tỏi",
  "cornstarch": "Bột bắp (ngô)",
  "cornflour": "Bột bắp",
  "chicken breasts": "Ức gà phi lê",
  "chicken breast": "Ức gà",
  "chicken thighs": "Má đùi gà",
  "chicken thigh": "Đùi gà",
  "chicken legs": "Đùi gà",
  "chicken wings": "Cánh gà",
  "chicken": "Thịt gà",
  "minced beef": "Thịt bò băm",
  "ground beef": "Thịt bò xay",
  "beef steak": "Bít tết bò",
  "beef": "Thịt bò",
  "pork chops": "Sườn cốt lết heo",
  "pork": "Thịt heo",
  "minced pork": "Thịt heo xay",
  "bacon": "Thịt xông khói",
  "ham": "Giăm bông",
  "salmon": "Cá hồi",
  "tuna": "Cá ngừ",
  "prawns": "Tôm tươi",
  "shrimp": "Tôm",
  "stir fry vegetables": "Rau củ xào thập cẩm",
  "mixed vegetables": "Rau củ hỗn hợp",
  "vegetables": "Rau củ",
  "brown rice": "Gạo lứt",
  "basmati rice": "Gạo Basmati",
  "jasmine rice": "Gạo thơm Jasmine",
  "rice": "Gạo / Cơm trắng",
  "butter": "Bơ lạt",
  "unsalted butter": "Bơ lạt không muối",
  "salted butter": "Bơ mặn",
  "olive oil": "Dầu ô liu",
  "extra virgin olive oil": "Dầu ô liu nguyên chất",
  "vegetable oil": "Dầu thực vật",
  "cooking oil": "Dầu ăn",
  "sunflower oil": "Dầu hướng dương",
  "salt": "Muối ăn",
  "sea salt": "Muối biển",
  "kosher salt": "Muối hạt",
  "black pepper": "Tiêu đen xay",
  "white pepper": "Tiêu trắng",
  "pepper": "Hạt tiêu",
  "onion": "Hành tây",
  "onions": "Hành tây",
  "red onion": "Hành tây đỏ",
  "yellow onion": "Hành tây vàng",
  "shallots": "Hành tím",
  "shallot": "Hành tím",
  "green onions": "Hành lá",
  "spring onions": "Hành hoa",
  "scallions": "Hành lá",
  "egg": "Trứng gà",
  "eggs": "Trứng gà",
  "egg yolk": "Lòng đỏ trứng",
  "egg whites": "Lòng trắng trứng",
  "milk": "Sữa tươi không đường",
  "whole milk": "Sữa tươi nguyên kem",
  "flour": "Bột mì",
  "plain flour": "Bột mì đa dụng",
  "all purpose flour": "Bột mì đa dụng",
  "self-raising flour": "Bột mì tự nở",
  "bread flour": "Bột làm bánh mì",
  "cheese": "Phô mai",
  "parmesan": "Phô mai Parmesan",
  "parmesan cheese": "Phô mai Parmesan",
  "mozzarella": "Phô mai Mozzarella",
  "mozzarella cheese": "Phô mai Mozzarella",
  "cheddar": "Phô mai Cheddar",
  "cheddar cheese": "Phô mai Cheddar",
  "tomatoes": "Cà chua",
  "tomato": "Cà chua",
  "cherry tomatoes": "Cà chua bi",
  "canned tomatoes": "Cà chua đóng hộp",
  "chopped tomatoes": "Cà chua băm nhỏ",
  "diced tomatoes": "Cà chua thái hạt lựu",
  "plum tomatoes": "Cà chua quả dài",
  "tomato paste": "Sốt cà chua cô đặc",
  "tomato sauce": "Sốt cà chua",
  "tomato puree": "Cà chua nghiền mịn",
  "mushrooms": "Nấm tươi",
  "button mushrooms": "Nấm mỡ",
  "shiitake mushrooms": "Nấm hương",
  "potato": "Khoai tây",
  "potatoes": "Khoai tây",
  "carrot": "Cà rốt",
  "carrots": "Cà rốt",
  "lemon": "Chanh vàng",
  "lemon juice": "Nước cốt chanh vàng",
  "lemon zest": "Vỏ chanh vàng bào",
  "lime": "Chanh xanh",
  "lime juice": "Nước cốt chanh xanh",
  "fish sauce": "Nước mắm",
  "sesame oil": "Dầu mè thơm",
  "sesame seeds": "Mè rang (vừng)",
  "chili": "Ớt tươi",
  "red chili": "Ớt đỏ",
  "chili flakes": "Ớt bột vảy",
  "chili powder": "Bột ớt",
  "paprika": "Bột ớt Paprika",
  "smoked paprika": "Bột ớt xông khói",
  "cayenne pepper": "Bột ớt Cayenne",
  "cilantro": "Rau mùi (ngò rí)",
  "coriander": "Rau mùi / Ngò rí",
  "parsley": "Ngò tây (Parsley)",
  "fresh parsley": "Ngò tây tươi",
  "basil": "Lá húng quế",
  "fresh basil": "Lá húng quế tươi",
  "oregano": "Lá kinh giới Oregano",
  "dried oregano": "Lá Oregano khô",
  "thyme": "Cỏ xạ hương (Thyme)",
  "fresh thyme": "Cỏ xạ hương tươi",
  "rosemary": "Lá hương thảo (Rosemary)",
  "bay leaf": "Lá nguyệt quế",
  "bay leaves": "Lá nguyệt quế",
  "cinnamon": "Quế",
  "cinnamon stick": "Thanh quế",
  "cumin": "Bột thì là Cumin",
  "ground cumin": "Bột thì là Ai Cập",
  "turmeric": "Bột nghệ",
  "curry powder": "Bột cà ri",
  "garam masala": "Bột gia vị Garam Masala",
  "heavy cream": "Kem béo Heavy Cream",
  "double cream": "Kem tươi béo",
  "sour cream": "Kem chua Sour Cream",
  "cream": "Kem tươi",
  "coconut milk": "Nước cốt dừa",
  "coconut cream": "Nước cốt dừa đậm đặc",
  "honey": "Mật ong nguyên chất",
  "maple syrup": "Siro cây phong",
  "vinegar": "Giấm ăn",
  "white vinegar": "Giấm trắng",
  "apple cider vinegar": "Giấm táo",
  "red wine vinegar": "Giấm rượu vang đỏ",
  "white wine vinegar": "Giấm rượu vang trắng",
  "balsamic vinegar": "Giấm đen Balsamic",
  "rice vinegar": "Giấm gạo",
  "white wine": "Rượu vang trắng",
  "red wine": "Rượu vang đỏ",
  "chicken broth": "Nước dùng gà",
  "chicken stock": "Nước hầm gà",
  "beef broth": "Nước dùng bò",
  "beef stock": "Nước hầm bò",
  "vegetable broth": "Nước hầm rau củ",
  "vegetable stock": "Nước hầm rau củ",
  "water / stock": "Nước lọc hoặc nước dùng",
  "pasta": "Mì Ý (Pasta)",
  "spaghetti": "Mì Spaghetti",
  "penne": "Mì nui Penne",
  "macaroni": "Mì nui Macaroni",
  "lasagne sheets": "Lá mì Lasagne",
  "noodles": "Mì sợi",
  "egg noodles": "Mì trứng",
  "rice noodles": "Bánh phở / Bún gạo",
  "bread": "Bánh mì",
  "breadcrumbs": "Vụn bánh mì (bột chiên xù)",
  "bell pepper": "Ớt chuông",
  "red pepper": "Ớt chuông đỏ",
  "green pepper": "Ớt chuông xanh",
  "yellow pepper": "Ớt chuông vàng",
  "cucumber": "Dưa leo (dưa chuột)",
  "zucchini": "Bí ngòi xanh",
  "eggplant": "Cà tím",
  "spinach": "Rau chân vịt (cải bó xôi)",
  "cabbage": "Bắp cải",
  "lettuce": "Xà lách",
  "broccoli": "Bông cải xanh (súp lơ xanh)",
  "cauliflower": "Súp lơ trắng",
  "green beans": "Đậu que (đậu cô ve)",
  "peas": "Đậu Hà Lan",
  "chickpeas": "Đậu gà Chickpeas",
  "lentils": "Đậu lăng",
  "kidney beans": "Đậu đỏ Kidney",
  "peanuts": "Đậu phộng (lạc)",
  "cashews": "Hạt điều",
  "almonds": "Hạnh nhân",
  "walnuts": "Quả óc chó",
  "mayonnaise": "Sốt Mayonnaise",
  "mustard": "Mù tạt",
  "dijon mustard": "Mù tạt Dijon",
  "ketchup": "Tương cà",
  "hot sauce": "Tương ớt cay",
  "worcestershire sauce": "Sốt Worcestershire",
  "vanilla extract": "Chiết xuất Vani",
  "vanilla": "Vani",
  "baking powder": "Bột nở (Baking powder)",
  "baking soda": "Muối nở (Baking soda)",
  "yeast": "Men nở",
  "cocoa powder": "Bột cacao",
  "dark chocolate": "Sô-cô-la đen",
  "chocolate": "Sô-cô-la",
};

export const MEASURE_MAP: Record<string, string> = {
  "cup": "cốc / chén",
  "cups": "cốc / chén",
  "tsp": "muỗng cà phê",
  "tbsp": "muỗng canh",
  "tablespoon": "muỗng canh",
  "tablespoons": "muỗng canh",
  "tbs": "muỗng canh",
  "teaspoon": "muỗng cà phê",
  "teaspoons": "muỗng cà phê",
  "pinch": "nhúm nhỏ",
  "pinches": "nhúm",
  "clove": "tép",
  "cloves": "tép",
  "slice": "lát",
  "slices": "lát",
  "sliced": "thái lát",
  "chopped": "băm nhỏ",
  "diced": "thái hạt lựu",
  "minced": "băm nhuyễn",
  "grated": "bào sợi",
  "bag": "gói / túi",
  "can": "lon / hộp",
  "cans": "lon / hộp",
  "dash": "vài giọt",
  "dashes": "vài giọt",
  "handful": "nắm tay",
  "bunch": "bó nhỏ",
  "head": "bắp / củ",
  "sprig": "nhánh",
  "sprigs": "nhánh",
  "stalk": "cọng",
  "stalks": "cọng",
  "bottle": "chai",
  "piece": "miếng",
  "pieces": "miếng",
  "gram": "g",
  "grams": "g",
  "kg": "kg",
  "ml": "ml",
  "litre": "lít",
  "liter": "lít",
  "oz": "oz (khoảng 28g)",
  "lb": "lb (khoảng 450g)",
  "to taste": "vừa ăn (tùy khẩu vị)",
  "as needed": "khi cần",
  "for frying": "để chiên",
  "for garnish": "để trang trí",
  "optional": "tùy chọn",
};

// Comprehensive English-Vietnamese culinary phrases & actions
const CULINARY_PATTERNS: Array<[RegExp, string]> = [
  // Temperatures & Preheating
  [/Preheat oven to (\d+)°F \((\d+)°C\)/gi, "Làm nóng lò nướng trước ở mức $1°F ($2°C)"],
  [/Preheat oven to (\d+)°C/gi, "Làm nóng lò nướng trước ở mức $1°C"],
  [/Preheat oven to (\d+)°F/gi, "Làm nóng lò nướng trước ở mức $1°F"],
  [/Preheat the oven to (\d+)°C/gi, "Làm nóng lò nướng trước ở mức $1°C"],
  [/Preheat the oven to (\d+)°F/gi, "Làm nóng lò nướng trước ở mức $1°F"],
  [/Preheat the grill/gi, "Làm nóng vỉ nướng trước"],
  [/Preheat the oven/gi, "Làm nóng lò nướng trước"],

  // Mixing & Combining
  [/In a small bowl, combine/gi, "Trong một bát nhỏ, trộn đều"],
  [/In a large bowl, combine/gi, "Trong một tô lớn, trộn đều"],
  [/In a medium bowl, combine/gi, "Trong một bát cỡ vừa, trộn đều"],
  [/In a bowl, combine/gi, "Trong một chiếc bát, trộn đều"],
  [/In a small bowl, mix/gi, "Trong một bát nhỏ, khuấy đều"],
  [/In a large bowl, mix/gi, "Trong một tô lớn, trộn đều"],
  [/In a bowl, mix/gi, "Trong một chiếc bát, trộn đều"],
  [/In a small bowl/gi, "Trong một chiếc bát nhỏ"],
  [/In a large bowl/gi, "Trong một chiếc tô lớn"],
  [/In a bowl/gi, "Trong một chiếc bát"],
  [/Combine all ingredients in a bowl/gi, "Trộn đều tất cả nguyên liệu trong tô"],
  [/Combine the ingredients/gi, "Trộn đều các nguyên liệu"],
  [/Combine/gi, "Trộn đều"],
  [/Whisk together/gi, "Đánh đều hỗn hợp"],
  [/Whisk the eggs/gi, "Đánh tan trứng gà"],
  [/Whisk until smooth/gi, "Đánh đều đến khi hỗn hợp mịn"],
  [/Mix well/gi, "Trộn đều tay"],
  [/Mix together/gi, "Trộn đều với nhau"],
  [/Stir continuously/gi, "Khuấy đều liên tục"],
  [/Stir well/gi, "Khuấy đều"],
  [/Stir in the/gi, "Cho vào và khuấy đều"],
  [/Stir in/gi, "Cho vào và khuấy đều"],
  [/to create a slurry/gi, "để tạo hỗn hợp sánh mịn"],

  // Heating & Frying
  [/In a small saucepan over medium heat/gi, "Trong một nồi nhỏ đun trên lửa vừa"],
  [/In a medium saucepan over medium heat/gi, "Trong một nồi vừa đun trên lửa vừa"],
  [/In a large saucepan over medium heat/gi, "Trong một nồi lớn đun trên lửa vừa"],
  [/In a large skillet over medium-high heat/gi, "Trong chảo lớn đun trên lửa vừa-cao"],
  [/In a large skillet over medium heat/gi, "Trong chảo lớn đun trên lửa vừa"],
  [/In a skillet over medium heat/gi, "Trong chảo đun trên lửa vừa"],
  [/In a large pan over medium heat/gi, "Trong chảo lớn đun trên lửa vừa"],
  [/In a frying pan over medium heat/gi, "Trong chảo rán đun trên lửa vừa"],
  [/In a pan over medium heat/gi, "Trong chảo đun trên lửa vừa"],
  [/In a large pot/gi, "Trong một chiếc nồi lớn"],
  [/Heat the oil in a pan/gi, "Đun nóng dầu trong chảo"],
  [/Heat the olive oil in a pan/gi, "Đun nóng dầu ô liu trong chảo"],
  [/Heat oil in a large skillet/gi, "Đun nóng dầu trong chảo lớn"],
  [/Heat oil in a pan/gi, "Đun nóng dầu ăn trong chảo"],
  [/Heat olive oil/gi, "Đun nóng dầu ô liu"],
  [/Heat the oil/gi, "Đun nóng dầu ăn"],
  [/Heat the butter/gi, "Làm tan chảy bơ"],
  [/over medium-high heat/gi, "trên lửa vừa-cao"],
  [/over medium-low heat/gi, "trên lửa vừa-nhỏ"],
  [/over medium heat/gi, "trên lửa vừa"],
  [/over high heat/gi, "trên lửa lớn"],
  [/over low heat/gi, "trên lửa nhỏ"],

  // Sauté & Cook Actions
  [/Fry the chopped onion/gi, "Phi thơm hành tây băm"],
  [/Fry the onion/gi, "Phi thơm hành tây"],
  [/Fry for (\d+) minutes/gi, "Xào rán trong $1 phút"],
  [/Fry until golden brown/gi, "Chiên rán đến khi vàng ươm"],
  [/Sauté for (\d+) minutes/gi, "Xào đều trong $1 phút"],
  [/Sauté until tender/gi, "Xào đến khi chín mềm"],
  [/Sauté until fragrant/gi, "Xào đều đến khi tỏa mùi thơm"],
  [/Cook until golden brown/gi, "Nấu/áp chảo đến khi vàng óng"],
  [/Cook until tender/gi, "Nấu đến khi chín mềm"],
  [/Cook until fragrant/gi, "Nấu đến khi tỏa mùi thơm"],
  [/Cook until thickened/gi, "Nấu đến khi nước sốt sánh lại"],
  [/Cook for (\d+) to (\d+) minutes/gi, "Nấu trong $1 đến $2 phút"],
  [/Cook for (\d+) minutes/gi, "Nấu trong $1 phút"],
  [/Cook for about (\d+) minutes/gi, "Nấu trong khoảng $1 phút"],

  // Boiling & Simmering
  [/Bring to a simmer/gi, "Đun sôi lăn tăn nhẹ"],
  [/Bring to a boil/gi, "Đun sôi bùng lên"],
  [/Bring to the boil/gi, "Đun sôi"],
  [/Simmer gently for (\d+) minutes/gi, "Đun nhỏ lửa lăn tăn trong $1 phút"],
  [/Simmer for (\d+) minutes/gi, "Đun nhỏ lửa trong $1 phút"],
  [/Simmer for about (\d+) minutes/gi, "Đun nhỏ lửa khoảng $1 phút"],
  [/Boil for (\d+) minutes/gi, "Luộc sôi trong $1 phút"],
  [/Boil until tender/gi, "Luộc đến khi chín mềm"],
  [/Reduce heat and simmer/gi, "Hạ nhỏ lửa và đun liu riu"],
  [/Reduce heat to low/gi, "Hạ lửa về mức nhỏ nhất"],
  [/Reduce the heat/gi, "Hạ bớt lửa"],

  // Baking & Roasting
  [/Bake in the preheated oven for (\d+) minutes until chicken is cooked through and sauce is bubbly/gi, "Nướng trong lò đã làm nóng khoảng $1 phút đến khi thịt gà chín đều và nước sốt sôi lăn tăn"],
  [/Bake in the preheated oven for (\d+) to (\d+) minutes/gi, "Nướng trong lò đã làm nóng trước trong $1 đến $2 phút"],
  [/Bake in the preheated oven for (\d+) minutes/gi, "Nướng trong lò đã làm nóng trong $1 phút"],
  [/Bake in the oven for (\d+) minutes/gi, "Nướng trong lò khoảng $1 phút"],
  [/Bake for (\d+) to (\d+) minutes/gi, "Nướng trong $1 đến $2 phút"],
  [/Bake for (\d+) minutes/gi, "Nướng trong $1 phút"],
  [/Roast in the oven for (\d+) minutes/gi, "Nướng trong lò khoảng $1 phút"],
  [/Roast for (\d+) minutes/gi, "Nướng khoảng $1 phút"],

  // Pouring & Placing
  [/Place sliced chicken breasts and mixed vegetables into a 9x13 inch baking dish/gi, "Xếp ức gà thái lát và rau củ hỗn hợp vào khay nướng"],
  [/Pour the warm teriyaki sauce evenly over the chicken and vegetables/gi, "Rưới đều nước sốt Teriyaki ấm nóng lên thịt gà và rau củ"],
  [/Pour into the baking dish/gi, "Đổ vào khay nướng"],
  [/Pour the sauce over/gi, "Rưới nước sốt lên"],
  [/Pour into a bowl/gi, "Rót vào một chiếc bát"],
  [/Pour in the/gi, "Rót / Đổ vào"],
  [/Place the chicken/gi, "Cho thịt gà vào"],
  [/Place in the oven/gi, "Cho vào lò nướng"],
  [/Place on a baking sheet/gi, "Xếp lên khay nướng"],
  [/Place on a plate/gi, "Bày ra đĩa"],

  // Seasoning & Garnishing
  [/Season with salt and black pepper to taste/gi, "Nêm nếm thêm muối và tiêu đen cho vừa khẩu vị"],
  [/Season with salt and pepper to taste/gi, "Nêm nếm muối và tiêu cho vừa ăn"],
  [/Season with salt and pepper/gi, "Nêm nếm thêm muối và tiêu"],
  [/Season to taste with/gi, "Nêm nếm vừa ăn với"],
  [/Season to taste/gi, "Nêm nếm cho vừa khẩu vị"],
  [/Garnish with fresh parsley/gi, "Trang trí phía trên với ngò tây tươi"],
  [/Garnish with fresh cilantro/gi, "Trang trí phía trên với rau mùi tươi"],
  [/Garnish with chopped green onions/gi, "Rắc thêm hành lá thái nhỏ lên trên"],
  [/Garnish with/gi, "Trang trí phía trên với"],
  [/Sprinkle with/gi, "Rắc đều lên trên"],

  // Serving & Plating
  [/Serve hot over a bowl of steamed brown rice/gi, "Múc ra và thưởng thức nóng cùng một bát cơm gạo lứt thơm ngon"],
  [/Serve hot with steamed rice/gi, "Thưởng thức nóng cùng cơm trắng"],
  [/Serve hot with/gi, "Thưởng thức nóng cùng"],
  [/Serve immediately/gi, "Dùng ngay khi còn nóng"],
  [/Serve warm/gi, "Thưởng thức khi còn ấm nóng"],
  [/Serve with/gi, "Dùng kèm với"],
  [/Enjoy your calm, touchless kitchen creation!/gi, "Chúc bạn ngon miệng với món ăn rảnh tay thông minh!"],
  [/Enjoy!/gi, "Chúc bạn ngon miệng!"],

  // Common prep actions
  [/Drain and set aside/gi, "Vớt ra để ráo nước"],
  [/Drain the pasta/gi, "Đổ mì ra rổ cho ráo nước"],
  [/Drain well/gi, "Để thật ráo nước"],
  [/Set aside to cool/gi, "Để riêng sang một bên cho nguội"],
  [/Set aside/gi, "Để riêng sang một bên"],
  [/Remove from heat/gi, "Nhấc nồi/chảo ra khỏi bếp"],
  [/Transfer to a plate/gi, "Gắp/trút ra đĩa"],
  [/Transfer to a bowl/gi, "Trút vào một chiếc tô"],
  [/Cover with foil/gi, "Bọc kín bằng giấy bạc"],
  [/Cover and cook for (\d+) minutes/gi, "Đậy nắp và nấu trong $1 phút"],
  [/Cover with a lid/gi, "Đậy nắp lại"],
  [/Cover and simmer/gi, "Đậy nắp và đun nhỏ lửa"],
  [/Let it rest for (\d+) minutes/gi, "Để món ăn nghỉ trong $1 phút"],
];

// Global translation cache for fast reuse
const translationCache = new Map<string, string>();

/**
 * High-accuracy sentence translation from English to Vietnamese.
 * Translates entire sentences naturally without word-by-word substitution errors.
 */
export async function translateTextToVietnamese(englishText: string): Promise<string> {
  if (!englishText || !englishText.trim()) return "";
  const trimmed = englishText.trim();

  // 1. Check in-memory cache
  if (translationCache.has(trimmed)) {
    return translationCache.get(trimmed)!;
  }

  // 2. Check localStorage cache
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(`trans_${trimmed}`);
      if (cached && cached.trim().toLowerCase() !== trimmed.toLowerCase()) {
        translationCache.set(trimmed, cached);
        return cached;
      }
    } catch {
      // ignore
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      trimmed
    )}&langpair=en|vi`;
    const res = await fetch(url, { signal: controller.signal });
    if (res.ok) {
      const data = await res.json();
      const translated = data?.responseData?.translatedText;
      if (
        translated &&
        typeof translated === "string" &&
        !translated.includes("MYMEMORY WARNING") &&
        translated.trim().toLowerCase() !== trimmed.toLowerCase()
      ) {
        translationCache.set(trimmed, translated);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(`trans_${trimmed}`, translated);
          } catch {
            // ignore quota exceeded
          }
        }
        return translated;
      }
    }
  } catch (err) {
    console.warn("Translation API call failed, falling back to rule-based parser:", err);
  } finally {
    clearTimeout(timeoutId);
  }

  // Fallback if network fails
  return fallbackTranslateInstruction(trimmed);
}

// Fallback rule-based translation if offline
export function fallbackTranslateInstruction(instruction: string): string {
  if (!instruction) return "";

  let text = instruction;

  // 1. Apply multi-word culinary phrase replacements
  for (const [pattern, replacement] of CULINARY_PATTERNS) {
    text = text.replace(pattern, replacement);
  }

  return text;
}

// Synchronous step instruction translation
export function translateStepInstruction(instruction: string, isVietnamese: boolean): string {
  if (!isVietnamese || !instruction) return instruction;
  if (translationCache.has(instruction.trim())) {
    return translationCache.get(instruction.trim())!;
  }
  return fallbackTranslateInstruction(instruction);
}

export function translateRecipeTitle(title: string, isVietnamese: boolean): string {
  if (!isVietnamese || !title) return title;
  const lower = title.toLowerCase().trim();
  if (RECIPE_TITLE_MAP[lower]) return RECIPE_TITLE_MAP[lower];

  // Partial matches for common titles
  for (const [key, val] of Object.entries(RECIPE_TITLE_MAP)) {
    if (lower.includes(key) || key.includes(lower)) {
      return val;
    }
  }

  // Translate key title components if title is unmapped
  let translatedTitle = title;
  const TITLE_WORDS: Record<string, string> = {
    "Chicken": "Gà",
    "Beef": "Bò",
    "Pork": "Heo",
    "Fish": "Cá",
    "Salmon": "Cá hồi",
    "Prawn": "Tôm",
    "Shrimp": "Tôm",
    "Curry": "Cà ri",
    "Soup": "Súp",
    "Stew": "Món hầm",
    "Pie": "Bánh nướng",
    "Salad": "Salad",
    "Roast": "Nướng",
    "Fried": "Chiên",
    "Rice": "Cơm",
    "Noodles": "Mì",
    "Pasta": "Mì Ý",
    "Casserole": "Đút lò",
    "Garlic": "Tỏi",
    "Mushroom": "Nấm",
    "Vegetable": "Rau củ",
  };

  for (const [enW, viW] of Object.entries(TITLE_WORDS)) {
    const reg = new RegExp(`\\b${enW}\\b`, "gi");
    if (reg.test(translatedTitle)) {
      translatedTitle = translatedTitle.replace(reg, viW);
    }
  }

  return translatedTitle;
}

export function translateCategory(cat: string, isVietnamese: boolean): string {
  if (!cat) return isVietnamese ? "Món chính" : "Main Course";
  const found = CATEGORY_MAP[cat];
  if (found) return isVietnamese ? found.vi : found.en;
  return cat;
}

export function translateArea(area: string, isVietnamese: boolean): string {
  if (!area) return isVietnamese ? "Quốc tế" : "International";
  const found = AREA_MAP[area];
  if (found) return isVietnamese ? found.vi : found.en;
  return area;
}

export function translateDifficulty(diff: string, isVietnamese: boolean): string {
  if (!diff) return isVietnamese ? "Dễ" : "Easy";
  const found = DIFFICULTY_MAP[diff];
  if (found) return isVietnamese ? found.vi : found.en;
  return diff;
}

export function translateIngredientName(name: string, isVietnamese: boolean): string {
  if (!isVietnamese || !name) return name;
  const lower = name.toLowerCase().trim();

  // 1. Direct match
  if (INGREDIENT_MAP[lower]) return INGREDIENT_MAP[lower];

  // 2. Match without trailing plurals
  const singular = lower.replace(/s$/, "");
  if (INGREDIENT_MAP[singular]) return INGREDIENT_MAP[singular];

  // 3. Substring keyword search
  for (const [engKey, viVal] of Object.entries(INGREDIENT_MAP)) {
    if (lower === engKey || lower.includes(engKey)) {
      return viVal;
    }
  }

  // 4. Strip preparation adjectives (e.g. "fresh", "chopped", "diced", "grated")
  const cleanName = lower
    .replace(/\b(fresh|dried|chopped|diced|sliced|minced|grated|peeled|cooked|raw|boneless|skinless|frozen|organic)\b/gi, "")
    .trim();

  if (INGREDIENT_MAP[cleanName]) return INGREDIENT_MAP[cleanName];

  for (const [engKey, viVal] of Object.entries(INGREDIENT_MAP)) {
    if (cleanName.includes(engKey)) {
      return viVal;
    }
  }

  return name;
}

export function translateMeasure(measure: string, isVietnamese: boolean): string {
  if (!isVietnamese || !measure) return measure;
  let translated = measure.trim();

  for (const [engKey, viVal] of Object.entries(MEASURE_MAP)) {
    const reg = new RegExp(`\\b${engKey}\\b`, "gi");
    translated = translated.replace(reg, viVal);
  }

  return translated;
}

export function translateDescription(
  area: string,
  category: string,
  isVietnamese: boolean
): string {
  const areaName = translateArea(area, isVietnamese);
  const catName = translateCategory(category, isVietnamese);

  if (isVietnamese) {
    return `Món ${catName.toLowerCase()} chuẩn phong vị ${areaName} - Công thức nấu ăn chính thống tuyển chọn.`;
  }
  return `${areaName} style ${catName.toLowerCase()} - Authentic culinary recipe curated from professional archives.`;
}
