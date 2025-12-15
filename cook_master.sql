

DROP DATABASE IF EXISTS `cook_master`;
CREATE DATABASE `cook_master` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `cook_master`;

-- Table structure for table `users`
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'user',
  `status` varchar(50) DEFAULT 'active',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `categories`
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `cat_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`cat_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `recipes`
DROP TABLE IF EXISTS `recipes`;
CREATE TABLE `recipes` (
  `recipe_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `category_id` int DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `ingredients` text NOT NULL,
  `instructions` text NOT NULL,
  `prep_time` int DEFAULT NULL,
  `cook_time` int DEFAULT NULL,
  `servings` int DEFAULT NULL,
  `difficulty` varchar(50) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'active',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`recipe_id`),
  KEY `user_id` (`user_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `recipes_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`cat_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `comments`
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `recipe_id` int NOT NULL,
  `parent_id` int DEFAULT NULL,
  `content` text NOT NULL,
  `is_question` tinyint(1) DEFAULT '0',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  KEY `user_id` (`user_id`),
  KEY `recipe_id` (`recipe_id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`comment_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `favorites`
DROP TABLE IF EXISTS `favorites`;
CREATE TABLE `favorites` (
  `fav_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `recipe_id` int NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fav_id`),
  UNIQUE KEY `user_recipe` (`user_id`, `recipe_id`),
  KEY `user_id` (`user_id`),
  KEY `recipe_id` (`recipe_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `ratings`
DROP TABLE IF EXISTS `ratings`;
CREATE TABLE `ratings` (
  `rat_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `recipe_id` int NOT NULL,
  `rating` int NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`rat_id`),
  UNIQUE KEY `user_recipe_rating` (`user_id`, `recipe_id`),
  KEY `user_id` (`user_id`),
  KEY `recipe_id` (`recipe_id`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =============================================
-- INSERT SAMPLE DATA
-- =============================================

-- Insert admin user (password: admin123)
INSERT INTO `users` (`name`, `email`, `password`, `role`, `status`) VALUES
('Admin', 'admin@cookmaster.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active'),
('Giovanni Rossi', 'giovanni@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'active'),
('Maria Romano', 'maria@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'active'),
('Chef Pierre', 'pierre@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'active'),
('Anna Chef', 'anna@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'active');

-- Insert categories
INSERT INTO `categories` (`name`, `description`) VALUES
('Breakfast', 'Start your day with delicious breakfast recipes'),
('Lunch', 'Quick and satisfying lunch ideas'),
('Dinner', 'Hearty dinner recipes for the whole family'),
('Dessert', 'Sweet treats and indulgent desserts'),
('Snacks', 'Quick bites and appetizers'),
('Beverages', 'Refreshing drinks and smoothies');

-- Insert sample recipes
INSERT INTO `recipes` (`user_id`, `category_id`, `title`, `description`, `ingredients`, `instructions`, `prep_time`, `cook_time`, `servings`, `difficulty`, `image_url`, `status`) VALUES
(2, 3, 'Classic Margherita Pizza', 'Authentic Italian pizza with fresh mozzarella, basil, and tomato sauce. A classic that never disappoints!', 
'500g pizza dough
200g fresh mozzarella
300g tomato sauce
Fresh basil leaves
2 tbsp olive oil
Salt and pepper to taste', 
'1. Preheat oven to 250°C (480°F)
2. Roll out pizza dough to desired thickness
3. Spread tomato sauce evenly
4. Add sliced mozzarella
5. Bake for 10-12 minutes until crust is golden
6. Top with fresh basil and olive oil
7. Serve hot and enjoy!', 
30, 15, 4, 'medium', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=500&fit=crop', 'active'),

(3, 3, 'Creamy Carbonara', 'Rich and creamy pasta with bacon, eggs, and parmesan cheese. A Roman classic!', 
'400g spaghetti
200g pancetta or bacon
3 egg yolks
100g parmesan cheese
Black pepper
Salt to taste', 
'1. Cook spaghetti according to package directions
2. Fry pancetta until crispy
3. Beat egg yolks with grated parmesan
4. Mix hot pasta with pancetta (off heat)
5. Add egg mixture, tossing quickly
6. Season with black pepper
7. Serve immediately', 
10, 20, 4, 'medium', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=500&fit=crop', 'active'),

(4, 4, 'Chocolate Lava Cake', 'Decadent chocolate cake with a molten center. Perfect for chocolate lovers!', 
'200g dark chocolate
100g butter
3 eggs
100g sugar
50g flour
1 tsp vanilla extract', 
'1. Melt chocolate and butter together
2. Beat eggs with sugar until fluffy
3. Fold in chocolate mixture
4. Add flour gently
5. Pour into greased ramekins
6. Bake at 200°C for 12 minutes
7. Serve warm with ice cream', 
15, 12, 6, 'hard', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=500&fit=crop', 'active'),

(5, 2, 'Fresh Garden Salad', 'Crispy vegetables with homemade vinaigrette dressing. Light and refreshing!', 
'Mixed lettuce
Cherry tomatoes
Cucumber
Red onion
3 tbsp olive oil
1 tbsp balsamic vinegar
Salt and pepper', 
'1. Wash and dry lettuce thoroughly
2. Cut cherry tomatoes in half
3. Slice cucumber and red onion
4. Mix olive oil with vinegar for dressing
5. Toss salad with dressing
6. Season with salt and pepper
7. Serve immediately', 
15, 0, 4, 'easy', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', 'active'),

(2, 2, 'Buddha Bowl', 'Nutritious bowl with quinoa, roasted vegetables, and tahini dressing.', 
'1 cup quinoa
1 sweet potato
1 can chickpeas
Kale
Avocado
Tahini
Lemon juice', 
'1. Cook quinoa according to package
2. Roast sweet potato cubes at 200°C
3. Roast chickpeas until crispy
4. Massage kale with olive oil
5. Arrange all in a bowl
6. Top with sliced avocado
7. Drizzle with tahini-lemon dressing', 
20, 30, 2, 'medium', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop', 'active'),

(3, 3, 'Gourmet Beef Burger', 'Juicy beef patty with caramelized onions and special sauce.', 
'500g ground beef
4 burger buns
2 onions
Lettuce
Tomato
Cheese slices
Special sauce', 
'1. Form beef into patties, season well
2. Caramelize onions slowly
3. Grill patties to desired doneness
4. Toast burger buns
5. Layer lettuce, patty, cheese
6. Add caramelized onions
7. Top with special sauce', 
15, 15, 4, 'medium', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', 'active');

-- Insert sample comments
INSERT INTO `comments` (`user_id`, `recipe_id`, `content`, `is_question`) VALUES
(3, 1, 'This pizza turned out amazing! The dough was perfect.', 0),
(4, 1, 'How long should I let the dough rest before using?', 1),
(2, 2, 'The carbonara sauce was so creamy. Family loved it!', 0),
(5, 3, 'Best lava cake I''ve ever made! Center was perfectly gooey.', 0),
(3, 4, 'Quick and healthy! Added some grilled chicken for protein.', 0);

-- Insert sample ratings
INSERT INTO `ratings` (`user_id`, `recipe_id`, `rating`) VALUES
(3, 1, 5),
(4, 1, 4),
(5, 1, 5),
(2, 2, 5),
(4, 2, 4),
(3, 3, 5),
(5, 3, 5),
(2, 4, 4),
(3, 5, 5);

-- Insert sample favorites
INSERT INTO `favorites` (`user_id`, `recipe_id`) VALUES
(3, 1),
(3, 3),
(4, 2),
(5, 1),
(5, 4);
