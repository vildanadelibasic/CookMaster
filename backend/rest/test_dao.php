<?php
require_once 'dao/CategoryDAO.php';
require_once 'dao/CommentDAO.php';
require_once 'dao/FavoriteDAO.php';
require_once 'dao/RatingDAO.php';
require_once 'dao/RecipeDAO.php';
require_once 'dao/UserDAO.php';

echo "<h1>DAO Test - CookMaster Backend</h1><hr>";

$userDAO = new UserDAO();
$categoryDAO = new CategoryDAO();
$recipeDAO = new RecipeDAO();
$commentDAO = new CommentDAO();
$favoriteDAO = new FavoriteDAO();
$ratingDAO = new RatingDAO();

// ---------- USER DAO ----------
echo "<h2>Users</h2>";
$users = $userDAO->getAll();
echo "<pre>";
print_r($users);
echo "</pre>";

// ---------- CATEGORY DAO ----------
echo "<h2>Categories</h2>";
$categories = $categoryDAO->getAll();
echo "<pre>";
print_r($categories);
echo "</pre>";

// ---------- RECIPE DAO ----------
echo "<h2>Recipes</h2>";
$recipes = $recipeDAO->getAll();
echo "<pre>";
print_r($recipes);
echo "</pre>";

// ---------- COMMENT DAO ----------
echo "<h2>Comments</h2>";
$comments = $commentDAO->getAll();
echo "<pre>";
print_r($comments);
echo "</pre>";

// ---------- FAVORITE DAO ----------
echo "<h2>Favorites</h2>";
$favorites = $favoriteDAO->getAll();
echo "<pre>";
print_r($favorites);
echo "</pre>";

// ---------- RATING DAO ----------
echo "<h2>Ratings</h2>";
$ratings = $ratingDAO->getAll();
echo "<pre>";
print_r($ratings);
echo "</pre>";

echo "<hr><p> DAO test completed.</p>";
?>
