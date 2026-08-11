-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 10, 2026 at 08:32 PM
-- Server version: 10.9.8-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `staialmannan_higo`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `model_type` varchar(255) DEFAULT NULL,
  `model_id` bigint(20) UNSIGNED DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `model_type`, `model_id`, `description`, `created_at`, `updated_at`) VALUES
(1, 2, 'deleted', 'User', 6, 'Menghapus User: Qoriatul Rofiqoh', '2026-08-07 16:14:30', '2026-08-07 16:14:30'),
(2, 2, 'deleted', 'User', 3, 'Menghapus User: Santri Dummy', '2026-08-07 16:14:34', '2026-08-07 16:14:34'),
(3, 2, 'deleted', 'Product', 1, 'Menghapus Product: Nasi Goreng Spesial', '2026-08-07 16:14:36', '2026-08-07 16:14:36'),
(4, 2, 'deleted', 'Product', 2, 'Menghapus Product: Es Teh Manis', '2026-08-07 16:14:36', '2026-08-07 16:14:36'),
(5, 2, 'deleted', 'Product', 3, 'Menghapus Product: Ayam Geprek Level 5', '2026-08-07 16:14:36', '2026-08-07 16:14:36'),
(6, 2, 'deleted', 'Canteen', 1, 'Menghapus Canteen: Kantin Barokah Pusat', '2026-08-07 16:14:36', '2026-08-07 16:14:36'),
(7, 2, 'deleted', 'Canteen', 2, 'Menghapus Canteen: Mc Donald', '2026-08-07 16:14:36', '2026-08-07 16:14:36'),
(8, 2, 'deleted', 'User', 4, 'Menghapus User: Kantin Dummy', '2026-08-07 16:14:36', '2026-08-07 16:14:36'),
(9, 2, 'deleted', 'User', 5, 'Menghapus User: Kurir Dummy', '2026-08-07 16:14:39', '2026-08-07 16:14:39'),
(10, 2, 'created', 'User', 7, 'Menambahkan User baru: kurir', '2026-08-08 12:31:25', '2026-08-08 12:31:25'),
(11, 2, 'created', 'User', 8, 'Menambahkan User baru: wali santri', '2026-08-08 12:31:49', '2026-08-08 12:31:49'),
(12, 2, 'created', 'User', 9, 'Menambahkan User baru: kantin', '2026-08-08 12:32:15', '2026-08-08 12:32:15'),
(13, NULL, 'updated', 'User', 7, 'Memperbarui User: kurir', '2026-08-08 12:32:25', '2026-08-08 12:32:25'),
(14, NULL, 'created', 'Canteen', 3, 'Menambahkan Canteen baru: padang', '2026-08-08 12:34:03', '2026-08-08 12:34:03'),
(15, NULL, 'updated', 'Canteen', 3, 'Memperbarui Canteen: padang', '2026-08-08 12:37:51', '2026-08-08 12:37:51'),
(16, 2, 'updated', 'Canteen', 3, 'Memperbarui Canteen: padang', '2026-08-08 12:38:18', '2026-08-08 12:38:18'),
(17, NULL, 'created', 'Product', 4, 'Menambahkan Product baru: sate padang', '2026-08-08 12:38:48', '2026-08-08 12:38:48'),
(18, NULL, 'updated', 'User', 8, 'Memperbarui User: wali santri', '2026-08-08 12:41:15', '2026-08-08 12:41:15'),
(19, NULL, 'updated', 'User', 8, 'Memperbarui User: wali santri', '2026-08-08 12:41:41', '2026-08-08 12:41:41'),
(20, NULL, 'created', 'Order', 1, 'Menambahkan Order baru: 1', '2026-08-08 12:41:48', '2026-08-08 12:41:48'),
(21, NULL, 'updated', 'Product', 4, 'Memperbarui Product: sate padang', '2026-08-08 12:41:48', '2026-08-08 12:41:48'),
(22, NULL, 'updated', 'Product', 4, 'Memperbarui Product: sate padang', '2026-08-08 12:41:48', '2026-08-08 12:41:48'),
(23, NULL, 'updated', 'Order', 1, 'Memperbarui Order: 1', '2026-08-08 12:41:48', '2026-08-08 12:41:48'),
(24, NULL, 'updated', 'Order', 1, 'Memperbarui Order: 1', '2026-08-08 12:42:09', '2026-08-08 12:42:09'),
(25, NULL, 'updated', 'Order', 1, 'Memperbarui Order: 1', '2026-08-08 12:44:04', '2026-08-08 12:44:04'),
(26, NULL, 'updated', 'Order', 1, 'Memperbarui Order: 1', '2026-08-08 12:44:34', '2026-08-08 12:44:34'),
(27, NULL, 'updated', 'Product', 4, 'Memperbarui Product: sate padang', '2026-08-08 12:44:34', '2026-08-08 12:44:34'),
(28, NULL, 'updated', 'Canteen', 3, 'Memperbarui Canteen: padang', '2026-08-08 12:44:34', '2026-08-08 12:44:34'),
(29, NULL, 'updated', 'Canteen', 3, 'Memperbarui Canteen: padang', '2026-08-08 12:44:34', '2026-08-08 12:44:34'),
(30, NULL, 'created', 'Order', 2, 'Menambahkan Order baru: 2', '2026-08-08 16:12:50', '2026-08-08 16:12:50'),
(31, NULL, 'updated', 'Product', 4, 'Memperbarui Product: sate padang', '2026-08-08 16:12:50', '2026-08-08 16:12:50'),
(32, NULL, 'updated', 'Product', 4, 'Memperbarui Product: sate padang', '2026-08-08 16:12:50', '2026-08-08 16:12:50'),
(33, NULL, 'updated', 'Order', 2, 'Memperbarui Order: 2', '2026-08-08 16:12:50', '2026-08-08 16:12:50'),
(34, NULL, 'updated', 'Order', 2, 'Memperbarui Order: 2', '2026-08-08 16:24:15', '2026-08-08 16:24:15'),
(35, NULL, 'updated', 'Order', 2, 'Memperbarui Order: 2', '2026-08-08 16:27:45', '2026-08-08 16:27:45'),
(36, 2, 'deleted', 'User', 7, 'Menghapus User: kurir', '2026-08-09 10:42:04', '2026-08-09 10:42:04'),
(37, 2, 'deleted', 'User', 8, 'Menghapus User: wali santri', '2026-08-09 10:42:07', '2026-08-09 10:42:07'),
(38, 2, 'deleted', 'Product', 4, 'Menghapus Product: sate padang', '2026-08-09 10:42:12', '2026-08-09 10:42:12'),
(39, 2, 'deleted', 'Canteen', 3, 'Menghapus Canteen: padang', '2026-08-09 10:42:12', '2026-08-09 10:42:12'),
(40, 2, 'deleted', 'User', 9, 'Menghapus User: kantin', '2026-08-09 10:42:12', '2026-08-09 10:42:12'),
(41, 2, 'created', 'User', 10, 'Menambahkan User baru: Kantin', '2026-08-09 10:42:41', '2026-08-09 10:42:41'),
(42, 2, 'created', 'User', 11, 'Menambahkan User baru: Wali', '2026-08-09 10:42:58', '2026-08-09 10:42:58'),
(43, 2, 'created', 'User', 12, 'Menambahkan User baru: Kurir', '2026-08-09 10:43:20', '2026-08-09 10:43:20'),
(44, 10, 'created', 'Canteen', 4, 'Menambahkan Canteen baru: Gacoan', '2026-08-09 10:43:38', '2026-08-09 10:43:38'),
(45, 10, 'updated', 'Canteen', 4, 'Memperbarui Canteen: Gacoan', '2026-08-09 10:44:02', '2026-08-09 10:44:02'),
(46, 2, 'updated', 'Canteen', 4, 'Memperbarui Canteen: Gacoan', '2026-08-09 10:44:09', '2026-08-09 10:44:09'),
(47, 10, 'created', 'Product', 5, 'Menambahkan Product baru: Mie', '2026-08-09 10:45:54', '2026-08-09 10:45:54'),
(48, 11, 'updated', 'User', 11, 'Memperbarui User: Wali', '2026-08-09 10:46:22', '2026-08-09 10:46:22'),
(49, 11, 'created', 'Order', 3, 'Menambahkan Order baru: 3', '2026-08-09 10:46:25', '2026-08-09 10:46:25'),
(50, 11, 'updated', 'Product', 5, 'Memperbarui Product: Mie', '2026-08-09 10:46:25', '2026-08-09 10:46:25'),
(51, 11, 'updated', 'Product', 5, 'Memperbarui Product: Mie', '2026-08-09 10:46:25', '2026-08-09 10:46:25'),
(52, 11, 'updated', 'Order', 3, 'Memperbarui Order: 3', '2026-08-09 10:46:25', '2026-08-09 10:46:25'),
(53, 10, 'updated', 'Order', 3, 'Memperbarui Order: 3', '2026-08-09 10:47:57', '2026-08-09 10:47:57'),
(54, 12, 'updated', 'Order', 3, 'Memperbarui Order: 3', '2026-08-09 10:48:36', '2026-08-09 10:48:36'),
(55, 12, 'updated', 'Order', 3, 'Memperbarui Order: 3', '2026-08-09 10:48:44', '2026-08-09 10:48:44'),
(56, 12, 'updated', 'Order', 3, 'Memperbarui Order: 3', '2026-08-09 10:48:47', '2026-08-09 10:48:47'),
(57, 11, 'created', 'Order', 4, 'Menambahkan Order baru: 4', '2026-08-09 15:43:55', '2026-08-09 15:43:55'),
(58, 11, 'updated', 'Product', 5, 'Memperbarui Product: Mie', '2026-08-09 15:43:55', '2026-08-09 15:43:55'),
(59, 11, 'updated', 'Product', 5, 'Memperbarui Product: Mie', '2026-08-09 15:43:55', '2026-08-09 15:43:55'),
(60, 11, 'updated', 'Order', 4, 'Memperbarui Order: 4', '2026-08-09 15:43:55', '2026-08-09 15:43:55'),
(61, 12, 'updated', 'User', 12, 'Memperbarui User: Kurir', '2026-08-09 15:45:13', '2026-08-09 15:45:13'),
(62, 12, 'updated', 'User', 12, 'Memperbarui User: Kurir', '2026-08-09 15:45:14', '2026-08-09 15:45:14'),
(63, 11, 'updated', 'User', 11, 'Memperbarui User: Wali', '2026-08-09 15:45:33', '2026-08-09 15:45:33'),
(64, 10, 'updated', 'Order', 4, 'Memperbarui Order: 4', '2026-08-09 15:49:30', '2026-08-09 15:49:30'),
(65, 12, 'updated', 'User', 12, 'Memperbarui User: Kurir', '2026-08-09 15:50:04', '2026-08-09 15:50:04'),
(66, 12, 'updated', 'User', 12, 'Memperbarui User: Kurir', '2026-08-09 15:51:12', '2026-08-09 15:51:12'),
(67, 12, 'updated', 'User', 12, 'Memperbarui User: Kurir', '2026-08-09 15:51:14', '2026-08-09 15:51:14'),
(68, 12, 'updated', 'Order', 4, 'Memperbarui Order: 4', '2026-08-09 15:51:38', '2026-08-09 15:51:38'),
(69, 11, 'created', 'Order', 5, 'Menambahkan Order baru: 5', '2026-08-10 10:52:19', '2026-08-10 10:52:19'),
(70, 11, 'updated', 'Product', 5, 'Memperbarui Product: Mie', '2026-08-10 10:52:19', '2026-08-10 10:52:19'),
(71, 11, 'updated', 'Product', 5, 'Memperbarui Product: Mie', '2026-08-10 10:52:19', '2026-08-10 10:52:19'),
(72, 11, 'updated', 'Order', 5, 'Memperbarui Order: 5', '2026-08-10 10:52:19', '2026-08-10 10:52:19'),
(73, 10, 'updated', 'Order', 5, 'Memperbarui Order: 5', '2026-08-10 10:55:38', '2026-08-10 10:55:38'),
(74, 12, 'updated', 'User', 12, 'Memperbarui User: Kurir', '2026-08-10 10:55:58', '2026-08-10 10:55:58'),
(75, 12, 'updated', 'User', 12, 'Memperbarui User: Kurir', '2026-08-10 10:56:00', '2026-08-10 10:56:00'),
(76, NULL, 'created', 'User', 13, 'Menambahkan User baru: Anma muniri', '2026-08-10 10:59:40', '2026-08-10 10:59:40'),
(77, 11, 'created', 'Order', 6, 'Menambahkan Order baru: 6', '2026-08-10 12:05:59', '2026-08-10 12:05:59'),
(78, 11, 'updated', 'Product', 5, 'Memperbarui Product: Mie', '2026-08-10 12:05:59', '2026-08-10 12:05:59'),
(79, 11, 'updated', 'Product', 5, 'Memperbarui Product: Mie', '2026-08-10 12:05:59', '2026-08-10 12:05:59'),
(80, 11, 'updated', 'Order', 6, 'Memperbarui Order: 6', '2026-08-10 12:05:59', '2026-08-10 12:05:59'),
(81, NULL, 'created', 'User', 14, 'Menambahkan User baru: Latifah Zumaila Iva', '2026-08-10 12:07:32', '2026-08-10 12:07:32'),
(82, 12, 'updated', 'User', 12, 'Memperbarui User: Kurir', '2026-08-10 12:12:41', '2026-08-10 12:12:41'),
(83, 12, 'updated', 'User', 12, 'Memperbarui User: Kurir', '2026-08-10 12:12:43', '2026-08-10 12:12:43'),
(84, 14, 'updated', 'User', 14, 'Memperbarui User: Latifah Zumaila Iva', '2026-08-10 12:15:04', '2026-08-10 12:15:04');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `canteens`
--

CREATE TABLE `canteens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` enum('kauman','kota') NOT NULL DEFAULT 'kauman',
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `delivery_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `admin_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `admin_debt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `delivery_rates` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`delivery_rates`)),
  `sold_count` int(11) NOT NULL DEFAULT 0,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `whatsapp_number` varchar(255) DEFAULT NULL,
  `rating` decimal(3,2) NOT NULL DEFAULT 0.00,
  `rating_count` int(11) NOT NULL DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `balance` decimal(12,2) NOT NULL DEFAULT 0.00,
  `open_time` time NOT NULL DEFAULT '09:00:00',
  `close_time` time NOT NULL DEFAULT '17:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `canteens`
--

INSERT INTO `canteens` (`id`, `user_id`, `name`, `category`, `description`, `image`, `status`, `delivery_fee`, `admin_fee`, `admin_debt`, `delivery_rates`, `sold_count`, `latitude`, `longitude`, `whatsapp_number`, `rating`, `rating_count`, `deleted_at`, `created_at`, `updated_at`, `balance`, `open_time`, `close_time`) VALUES
(4, 10, 'Gacoan', 'kauman', 'Mie', NULL, 'approved', 2000.00, 0.00, 0.00, NULL, 0, NULL, NULL, '6285777799988', 0.00, 0, NULL, '2026-08-09 10:43:38', '2026-08-09 10:44:09', 0.00, '09:00:00', '17:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `canteen_banners`
--

CREATE TABLE `canteen_banners` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `canteen_id` bigint(20) UNSIGNED NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `canteen_withdrawals`
--

CREATE TABLE `canteen_withdrawals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `canteen_id` bigint(20) UNSIGNED NOT NULL,
  `admin_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `drivers`
--

CREATE TABLE `drivers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `vehicle_info` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_06_26_105801_create_personal_access_tokens_table', 1),
(5, '2026_06_26_105802_create_permission_tables', 1),
(6, '2026_06_26_112407_create_canteens_table', 1),
(7, '2026_06_26_112407_create_products_table', 1),
(8, '2026_06_26_112408_create_drivers_table', 1),
(9, '2026_06_27_094804_create_canteen_banners_table', 1),
(10, '2026_06_27_115502_create_vouchers_table', 1),
(11, '2026_06_27_115513_create_user_vouchers_table', 1),
(12, '2026_06_27_121313_create_orders_table', 1),
(13, '2026_06_27_121314_create_order_items_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(1, 'App\\Domains\\Auth\\User', 2),
(2, 'App\\Domains\\Auth\\User', 11),
(2, 'App\\Domains\\Auth\\User', 13),
(2, 'App\\Domains\\Auth\\User', 14),
(3, 'App\\Domains\\Auth\\User', 10),
(4, 'App\\Domains\\Auth\\User', 12);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `canteen_id` bigint(20) UNSIGNED NOT NULL,
  `is_custom` tinyint(1) NOT NULL DEFAULT 0,
  `custom_notes` text DEFAULT NULL,
  `total_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `admin_fee` decimal(12,2) DEFAULT 0.00,
  `delivery_fee` decimal(12,2) DEFAULT 0.00,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `payment_status` varchar(255) NOT NULL DEFAULT 'unpaid',
  `courier_id` bigint(20) UNSIGNED DEFAULT NULL,
  `delivery_location` varchar(255) DEFAULT NULL,
  `proof_of_delivery` varchar(255) DEFAULT NULL,
  `proof_of_purchase` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`proof_of_purchase`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `is_courier_paid_by_canteen` tinyint(1) NOT NULL DEFAULT 0,
  `proof_courier_paid` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `canteen_id`, `is_custom`, `custom_notes`, `total_price`, `admin_fee`, `delivery_fee`, `status`, `payment_status`, `courier_id`, `delivery_location`, `proof_of_delivery`, `proof_of_purchase`, `created_at`, `updated_at`, `is_courier_paid_by_canteen`, `proof_courier_paid`) VALUES
(3, 11, 4, 0, NULL, 13000.00, 1000.00, 2000.00, 'completed', 'unpaid', 12, 'Al Majid 1', '[\"kurir_kurir\\/proofs\\/nEozZ3zmlQfnsbf5UeYr0mdGAbfGofYunC5oAVoV.jpg\"]', '[\"kurir_kurir\\/proofs\\/YZDQ8MQM2AhFdizUl8v3pNtw1Hpqo8u0H0OEbtCx.jpg\"]', '2026-08-09 10:46:25', '2026-08-09 10:48:47', 0, NULL),
(4, 11, 4, 0, NULL, 13000.00, 1000.00, 2000.00, 'completed', 'unpaid', 12, 'Al Majid 1', NULL, NULL, '2026-08-09 15:43:55', '2026-08-09 15:51:38', 0, NULL),
(5, 11, 4, 0, NULL, 13000.00, 1000.00, 2000.00, 'processing', 'unpaid', 12, 'Al Majid 1', NULL, NULL, '2026-08-10 10:52:19', '2026-08-10 10:55:38', 0, NULL),
(6, 11, 4, 0, NULL, 13000.00, 1000.00, 2000.00, 'pending', 'unpaid', 12, 'Al Majid 1', NULL, NULL, '2026-08-10 12:05:59', '2026-08-10 12:05:59', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(12,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`, `subtotal`, `notes`, `created_at`, `updated_at`) VALUES
(3, 3, 5, 1, 10000.00, 10000.00, NULL, '2026-08-09 10:46:25', '2026-08-09 10:46:25'),
(4, 4, 5, 1, 10000.00, 10000.00, NULL, '2026-08-09 15:43:55', '2026-08-09 15:43:55'),
(5, 5, 5, 1, 10000.00, 10000.00, NULL, '2026-08-10 10:52:19', '2026-08-10 10:52:19'),
(6, 6, 5, 1, 10000.00, 10000.00, NULL, '2026-08-10 12:05:59', '2026-08-10 12:05:59');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_logs`
--

CREATE TABLE `payment_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `type` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payment_logs`
--

INSERT INTO `payment_logs` (`id`, `user_id`, `order_id`, `amount`, `type`, `description`, `created_at`, `updated_at`) VALUES
(1, NULL, NULL, 15500.00, 'order_payment', 'Penerimaan hasil pesanan #1 (Kantin bayar kurir tunai)', '2026-08-08 12:44:34', '2026-08-08 12:44:34');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Domains\\Auth\\User', 3, 'auth_token', 'a995bc767beb4f8824271cbb1e941dd31eafe48e9c05873e905f1a96a1b8ab3f', '[\"*\"]', '2026-06-29 01:06:54', NULL, '2026-06-28 10:04:40', '2026-06-29 01:06:54'),
(2, 'App\\Domains\\Auth\\User', 2, 'auth_token', 'd4c523dd539b550cc2db5a2b9aa147bca82e9035f1fe6980f67a2b50d94206ec', '[\"*\"]', '2026-08-08 12:29:36', NULL, '2026-06-29 01:07:12', '2026-08-08 12:29:36'),
(3, 'App\\Domains\\Auth\\User', 2, 'auth_token', 'aced8bf4fe0369041938b358d90241f73a0f74bf6bb7be0d85b61b12ffea7918', '[\"*\"]', '2026-07-14 04:29:08', NULL, '2026-06-29 01:17:07', '2026-07-14 04:29:08'),
(8, 'App\\Domains\\Auth\\User', 2, 'auth_token', 'fa99ac7a104476e1196a31917808e7a327e990762208c20b8d30f055c657ef15', '[\"*\"]', '2026-07-13 02:52:10', NULL, '2026-07-13 01:54:59', '2026-07-13 02:52:10'),
(9, 'App\\Domains\\Auth\\User', 3, 'auth_token', '6f61232780f899d7ad0d5d1f29b827512f4e78c7ec58c096c484861dec223e4d', '[\"*\"]', '2026-07-13 02:55:06', NULL, '2026-07-13 02:52:52', '2026-07-13 02:55:06'),
(10, 'App\\Domains\\Auth\\User', 5, 'auth_token', '9a9fc24eba532415ddac22296830043c882c65bde1264b6eb35dee3fecf46979', '[\"*\"]', '2026-07-13 02:56:20', NULL, '2026-07-13 02:55:52', '2026-07-13 02:56:20'),
(11, 'App\\Domains\\Auth\\User', 2, 'auth_token', '1b4ef2922ce065bd9ecec6f5590be4fd40b87eb19f9d55fcd61a27e7bf4ebe91', '[\"*\"]', '2026-07-13 05:04:47', NULL, '2026-07-13 02:56:49', '2026-07-13 05:04:47'),
(12, 'App\\Domains\\Auth\\User', 2, 'auth_token', '2c6bbb9fb466c92eaed5e952ae0d28eec0d672cbb6f138d080c85a4499e49575', '[\"*\"]', '2026-07-13 05:04:57', NULL, '2026-07-13 05:04:57', '2026-07-13 05:04:57'),
(13, 'App\\Domains\\Auth\\User', 3, 'auth_token', 'e225307e8c5c802a2ea3077ce17f938e393bb4a5058a0a8b203ecacf2239e3b7', '[\"*\"]', '2026-07-27 07:04:49', NULL, '2026-07-13 05:05:40', '2026-07-27 07:04:49'),
(14, 'App\\Domains\\Auth\\User', 2, 'auth_token', '3cd4941325629962d3408eb5d66948013229a2e702ff6afcc19152095c0ad00e', '[\"*\"]', '2026-07-14 04:29:49', NULL, '2026-07-14 04:29:23', '2026-07-14 04:29:49'),
(16, 'App\\Domains\\Auth\\User', 3, 'impersonation_token', 'da237f4c8833e51f86b3dc231bea9ec80b607b16a7be5e8028130a1117766e60', '[\"*\"]', '2026-07-14 04:29:55', NULL, '2026-07-14 04:29:49', '2026-07-14 04:29:55'),
(19, 'App\\Domains\\Auth\\User', 2, 'auth_token', '8cbe7212eb1b115e284a7fc6570c819cde20a2b054cb97c7c37c18e7c7aeb3aa', '[\"*\"]', '2026-07-27 11:00:20', NULL, '2026-07-27 10:38:05', '2026-07-27 11:00:20'),
(20, 'App\\Domains\\Auth\\User', 6, 'auth_token', '10e2d5f7e99cd76f9c8ea3831984197d3c78ca4e30a562f5be37ca94db89ceff', '[\"*\"]', '2026-08-05 20:05:53', NULL, '2026-08-05 20:04:13', '2026-08-05 20:05:53'),
(21, 'App\\Domains\\Auth\\User', 2, 'auth_token', '31c4037791c9735e5a63504c8a78eb2426a869f399d974c21e186dfc8df95b9f', '[\"*\"]', '2026-08-07 09:25:10', NULL, '2026-08-07 09:24:04', '2026-08-07 09:25:10'),
(22, 'App\\Domains\\Auth\\User', 4, 'impersonation_token', '3e63ab5da492442f5163ad9e48f6f1b6210d322f90ed418018a1daa8fa71d301', '[\"*\"]', '2026-08-07 09:25:11', NULL, '2026-08-07 09:25:10', '2026-08-07 09:25:11'),
(23, 'App\\Domains\\Auth\\User', 2, 'auth_token', '9441b522a17eed05e369368c8c28ef1729e9c6788f0f5958a1b090b944d4931f', '[\"*\"]', '2026-08-08 12:31:30', NULL, '2026-08-08 12:30:27', '2026-08-08 12:31:30'),
(24, 'App\\Domains\\Auth\\User', 2, 'auth_token', 'c062e8ea8518169d2337fea827e3b2388644679d4362823d803230d60008b64a', '[\"*\"]', '2026-08-08 12:31:55', NULL, '2026-08-08 12:30:33', '2026-08-08 12:31:55'),
(25, 'App\\Domains\\Auth\\User', 2, 'auth_token', '2e0797b1a08811d63955e5c0130ae543618c221627a1454d4a5b24e57139fb37', '[\"*\"]', '2026-08-08 12:38:31', NULL, '2026-08-08 12:31:00', '2026-08-08 12:38:31'),
(26, 'App\\Domains\\Auth\\User', 7, 'impersonation_token', 'e67bb0fe2d0c9ea997692fdb7eb3c2d013c41084cbb174fd58f6fd8138a0fd79', '[\"*\"]', '2026-08-08 16:16:48', NULL, '2026-08-08 12:31:30', '2026-08-08 16:16:48'),
(27, 'App\\Domains\\Auth\\User', 8, 'impersonation_token', '299cb8d0c9212aebb2f029d2cfea013a3ba28a9bf7d659e2ecffdc3cff90b9e9', '[\"*\"]', '2026-08-08 12:47:04', NULL, '2026-08-08 12:31:55', '2026-08-08 12:47:04'),
(29, 'App\\Domains\\Auth\\User', 9, 'impersonation_token', 'b4edde92094ecef1a93048f3ec4cc013c6b1f7f84e5c4b313967825d21c5dac9', '[\"*\"]', '2026-08-08 16:16:44', NULL, '2026-08-08 12:38:31', '2026-08-08 16:16:44'),
(30, 'App\\Domains\\Auth\\User', 2, 'auth_token', '5a538f1f3f4120b7a8f55457f052da694fffa33a26119d5ce7c8957ffbd144cf', '[\"*\"]', '2026-08-08 16:11:48', NULL, '2026-08-08 16:11:21', '2026-08-08 16:11:48'),
(31, 'App\\Domains\\Auth\\User', 9, 'impersonation_token', '2532746d169a581583b684d435c9a75e79610dac3d87ed4a7b8b8d4b0d1afb5c', '[\"*\"]', '2026-08-08 19:37:01', NULL, '2026-08-08 16:11:48', '2026-08-08 19:37:01'),
(32, 'App\\Domains\\Auth\\User', 2, 'auth_token', '143628a90afab0dddf40b5636b4c4bcfbc38a5776904669b96a6b07b428ad412', '[\"*\"]', '2026-08-08 16:12:27', NULL, '2026-08-08 16:12:07', '2026-08-08 16:12:27'),
(34, 'App\\Domains\\Auth\\User', 8, 'impersonation_token', '019b6624c97b95cb1ba68c75d4897c136c1ccfd17d0892212fa66ea5033f4573', '[\"*\"]', '2026-08-08 19:15:25', NULL, '2026-08-08 16:12:27', '2026-08-08 19:15:25'),
(35, 'App\\Domains\\Auth\\User', 2, 'auth_token', '1f21e6dc15771f0152c564a0d5dbdc7f8078f7f31c6e61477c2827ba34b4c189', '[\"*\"]', '2026-08-09 19:11:36', NULL, '2026-08-08 16:15:09', '2026-08-09 19:11:36'),
(37, 'App\\Domains\\Auth\\User', 2, 'auth_token', '37bcc83b2c632df22e02a92681c22fcbbc23f25a81ae2dacebb1cf9dfb43b268', '[\"*\"]', '2026-08-08 16:17:11', NULL, '2026-08-08 16:16:09', '2026-08-08 16:17:11'),
(49, 'App\\Domains\\Auth\\User', 2, 'auth_token', '00fb297b38d7645b8210a0627cbc675cc2a8c9b3a4f4ec8138a735939157341a', '[\"*\"]', '2026-08-09 15:40:02', NULL, '2026-08-09 15:39:21', '2026-08-09 15:40:02'),
(50, 'App\\Domains\\Auth\\User', 2, 'auth_token', '0056c234bec6ca413b1a4376f15a7bd8953fda3ca3cdcba2f9655eb930fa47eb', '[\"*\"]', '2026-08-09 15:49:15', NULL, '2026-08-09 15:39:34', '2026-08-09 15:49:15'),
(51, 'App\\Domains\\Auth\\User', 2, 'auth_token', '5a9337dea07a7b74775d89d4b213b2910a7faa6e1d532b993faa3af30d11735a', '[\"*\"]', '2026-08-09 15:53:24', NULL, '2026-08-09 15:40:36', '2026-08-09 15:53:24'),
(52, 'App\\Domains\\Auth\\User', 2, 'auth_token', '99391b6c5d898adf8c3e4d7f84ae594beb073ea280c6360961ca5bbc7abe6e43', '[\"*\"]', '2026-08-09 16:08:11', NULL, '2026-08-09 15:40:52', '2026-08-09 16:08:11'),
(53, 'App\\Domains\\Auth\\User', 2, 'auth_token', '04991402fbd9909cb2634d79af1c13ed1d8b1e3c1cdb4f84b49a276f6e7b9e66', '[\"*\"]', '2026-08-09 15:42:22', NULL, '2026-08-09 15:42:10', '2026-08-09 15:42:22'),
(54, 'App\\Domains\\Auth\\User', 12, 'impersonation_token', '9a4fea8481e35520a4d9809d17a33feff65d71545fd030d3286d37d4ed6cf58d', '[\"*\"]', '2026-08-10 22:33:21', NULL, '2026-08-09 15:42:22', '2026-08-10 22:33:21'),
(58, 'App\\Domains\\Auth\\User', 10, 'impersonation_token', 'dcc5145f22a8e44805977885744c82e788395190c550ff94f82a2f94b6c690d1', '[\"*\"]', '2026-08-09 17:45:09', NULL, '2026-08-09 15:49:15', '2026-08-09 17:45:09'),
(64, 'App\\Domains\\Auth\\User', 10, 'impersonation_token', 'c8dd07d51775a42339eda508e4dc94933058f1002dc42e4c6dfca752c62bd3fe', '[\"*\"]', '2026-08-09 22:03:35', NULL, '2026-08-09 16:08:11', '2026-08-09 22:03:35'),
(65, 'App\\Domains\\Auth\\User', 2, 'auth_token', '6d1497aad1e52700d701045649da265c10e172b4b075337a7dd6f298231a0060', '[\"*\"]', '2026-08-10 10:59:06', NULL, '2026-08-10 10:49:58', '2026-08-10 10:59:06'),
(74, 'App\\Domains\\Auth\\User', 13, 'auth_token', '6163df2d6fed6b6fa2181da50dbb9325d2fe95b44e34bc538c48183cf136260f', '[\"*\"]', '2026-08-10 11:00:40', NULL, '2026-08-10 10:59:40', '2026-08-10 11:00:40'),
(75, 'App\\Domains\\Auth\\User', 2, 'auth_token', '3ebb5a147136cff29166a9e289afe7756a6cb42488379fa6e2c123846e0d44ac', '[\"*\"]', '2026-08-10 11:01:01', NULL, '2026-08-10 11:00:48', '2026-08-10 11:01:01'),
(76, 'App\\Domains\\Auth\\User', 2, 'auth_token', 'f6b36af3a57a53f87202c13da5a73b8e3c216868440c4ab49a38f127211339f8', '[\"*\"]', '2026-08-10 12:05:15', NULL, '2026-08-10 12:01:40', '2026-08-10 12:05:15'),
(78, 'App\\Domains\\Auth\\User', 11, 'impersonation_token', 'ff4c31ac4fe1bb391b597c914f4c532c421e9a6c1957d9be0342fcca46dd6f61', '[\"*\"]', '2026-08-10 12:06:19', NULL, '2026-08-10 12:05:15', '2026-08-10 12:06:19'),
(79, 'App\\Domains\\Auth\\User', 14, 'auth_token', '436d84cd6c9b88b34d125638d37ee830187f124cfabca466f1ed03595618a86d', '[\"*\"]', '2026-08-10 12:10:02', NULL, '2026-08-10 12:07:32', '2026-08-10 12:10:02'),
(80, 'App\\Domains\\Auth\\User', 2, 'auth_token', '19cfbdd7dc6c26023524d341aa371852805b61daa02822e95fcd06a8bb1b08b8', '[\"*\"]', '2026-08-10 12:10:51', NULL, '2026-08-10 12:10:08', '2026-08-10 12:10:51'),
(81, 'App\\Domains\\Auth\\User', 12, 'impersonation_token', 'a80e3d4469e5ec260ed8ad1864cc08038d0e13fbe5c85a38bcef3836b251af09', '[\"*\"]', '2026-08-10 12:12:43', NULL, '2026-08-10 12:10:51', '2026-08-10 12:12:43'),
(82, 'App\\Domains\\Auth\\User', 14, 'auth_token', '30837c5f830293773cefdafaffa664bff75a212d73f89f27c41a41bf6a50c2b7', '[\"*\"]', '2026-08-10 12:15:54', NULL, '2026-08-10 12:13:06', '2026-08-10 12:15:54'),
(83, 'App\\Domains\\Auth\\User', 2, 'auth_token', 'bee5d1a2762127fb4b42dbd3c3032ec0f1dee474cb124332084b7e3882ae8f3c', '[\"*\"]', '2026-08-10 12:18:41', NULL, '2026-08-10 12:16:02', '2026-08-10 12:18:41'),
(85, 'App\\Domains\\Auth\\User', 10, 'impersonation_token', 'fc53f13a256125307fb4fc48214776fdd0b150b1ac072ad6abbdfbadb95f55f5', '[\"*\"]', '2026-08-10 12:34:18', NULL, '2026-08-10 12:18:41', '2026-08-10 12:34:18');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `canteen_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `sold_count` int(11) NOT NULL DEFAULT 0,
  `rating` decimal(3,2) NOT NULL DEFAULT 0.00,
  `rating_count` int(11) NOT NULL DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `canteen_id`, `name`, `description`, `category`, `price`, `stock`, `image`, `is_available`, `discount_price`, `sold_count`, `rating`, `rating_count`, `deleted_at`, `created_at`, `updated_at`) VALUES
(5, 4, 'Mie', NULL, 'Mknn', 10000.00, 4, NULL, 1, NULL, 4, 0.00, 0, NULL, '2026-08-09 10:45:54', '2026-08-10 12:05:59');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'web', '2026-06-28 10:04:24', '2026-06-28 10:04:24'),
(2, 'user', 'web', '2026-06-28 10:04:24', '2026-06-28 10:04:24'),
(3, 'kantin', 'web', '2026-06-28 10:04:24', '2026-06-28 10:04:24'),
(4, 'kurir', 'web', '2026-06-28 10:04:24', '2026-06-28 10:04:24');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('0xfZAAcagUcDSmtqVPIjomtuMnBx5b2vRrOdaCJD', NULL, '34.156.181.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36', 'eyJfdG9rZW4iOiJnUTdvWmNWektBTWhEN1dNYXlaaXpaYVdka3U0cWVsNnRXN0diVVFhIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvXC9jbXNcL3dwLWluY2x1ZGVzXC93bHdtYW5pZmVzdC54bWwiLCJyb3V0ZSI6ImdlbmVyYXRlZDo6UXZacUxZeXlnWG5scmNCaCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1786084598),
('1tMYPQXOD52Di8L8ukww9yswPIXb5p5Sw4yyjuTF', NULL, '114.10.154.238', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_5_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/151.0.7922.57 Mobile/15E148 Safari/604.1', 'eyJfdG9rZW4iOiJDQW9tb0NaZGhSbVg5TjB3THcwRWJadlJQTmdaRjZsMTVnZzljSUlvIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpZS1J5Sm1VdXplUVJHbFVFIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1786180546),
('2OK918u9mGkZfJOEg6rem2jz03r2XUU3f7ElYGOW', NULL, '140.213.187.176', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJLZm5kWjFVd2dESjZhTUNlUkR6Rk8zYjVqdkxXZ2pSQTJhWjk5SUxNIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6eklrVklUdHZaM0JKRFZ4VCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1786333748),
('3u31EGsd49slUxyzFNPaZpidCE6yXNF9fm96aukr', NULL, '114.5.108.15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0', 'eyJfdG9rZW4iOiJTN2hRZmk1YXFJWFJrV0c5UmlNMk5BeVNUb0RWekt5eHg0VWd4VlZ3IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpZS1J5Sm1VdXplUVJHbFVFIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1786166815),
('8ob7U0PCmvDjhpxiGb5DyZ6xIxwj6RMiWdFLVyJU', NULL, '125.166.8.242', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6,2 Mobile/15E148 Safari/604.1', 'eyJfdG9rZW4iOiJFUkFZY2Q4WEdlQVM1bGpJMTdRQWRxMVY2R1pweWxFTjJlTVdXRll3IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpRdlpxTFl5eWdYbmxyY0JoIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1784969497),
('9lxOLuCPQpYv5N13HpNR0WGSijNJH4169JPsQEx6', NULL, '103.178.13.38', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJqZ1ZqcXRwcEw2WHF1a3hBWmdHTVQxWjFRcUlOQUNRVW9ZMk9IdnFVIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpRdlpxTFl5eWdYbmxyY0JoIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1785936900),
('aam4l4YCS5VxpPtsrpSa3ir8SBqoQMe1fz4n60RY', NULL, '147.92.179.105', 'facebookexternalhit/1.1;line-poker/1.0', 'eyJfdG9rZW4iOiJMWDhySjU3SWZBYlJpeHQyVXdpdm1HRGVNWERnZzJWUXBXMGtCamRyIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZCIsInJvdXRlIjoiZ2VuZXJhdGVkOjp6SWtWSVR0dlozQkpEVnhUIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1786255682),
('ClrhxsM36KsTP9JHpXcPQrW6PWmzErWQHCocrXU9', NULL, '103.253.27.124', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', 'eyJfdG9rZW4iOiJOeEhIeDBWVTkxZ1hhdE9xNnRRbGlTOXZBYjk3UU9tMGxrVjdtVExwIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpRdlpxTFl5eWdYbmxyY0JoIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1786005972),
('DjbRYuF0TlQG6We2PzXGLM74czfEo7vDpurdQHD5', NULL, '114.10.155.147', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJLY0ZyY3EzaHhUcGRKNHd5czhUZmwxRmlEdU5OcDdsNk9zbWgzQ2NmIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjp6SWtWSVR0dlozQkpEVnhUIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1786250790),
('DQapRkAB2Q45aqoD8X6UqmZPQ5QBOywBewAj1P1d', NULL, '114.5.108.115', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiI5RnpWRWZzTEkyMjdoRzJFa3FCVlNuN0pwc2czenlsMTgwMHUxQkN3IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpZS1J5Sm1VdXplUVJHbFVFIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1786180491),
('dTMNsPl15U1Rog4aEDwVt66uFhe4d9yynB5xAybJ', NULL, '35.189.210.255', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36', 'eyJfdG9rZW4iOiJzWGswM2JjSjgzWG5PT2NFa2I4WEtjaHZrZ2lxcmJsSmN5N01PanBDIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvXC9jbXNcL3dwLWluY2x1ZGVzXC93bHdtYW5pZmVzdC54bWwiLCJyb3V0ZSI6ImdlbmVyYXRlZDo6UXZacUxZeXlnWG5scmNCaCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1785754852),
('E7ZcIp7rKGQGlmuzwH0QiT3lqAS066VPkzpijn5g', NULL, '114.8.230.173', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJENXlBZzhGWGNyZzNVeWR1MFBJcnVDTkdmQXBISXBrTXJ2OGpLVTl1IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvZGFzaGJvYXJkXC9wYW5kdWFuIiwicm91dGUiOiJnZW5lcmF0ZWQ6OnpJa1ZJVHR2WjNCSkRWeFQifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1786272303),
('EbmGF3RcB7wguq4SVbo8gXaN9ySoNzW465tPfJ2g', NULL, '114.10.155.188', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5.2 Mobile/15E148 Safari/604.1', 'eyJfdG9rZW4iOiJaZVhmc21VYjYyYmM2UkVoVnRkdVQ3VDczNGw5ZWNvM1J3MU5IZno4IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjp6SWtWSVR0dlozQkpEVnhUIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1786264877),
('ef6mNCxXnPLu3ZRezzVOqnuu2c0EaqBgoyXeclkX', NULL, '103.184.18.72', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_6_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/151.0.7922.57 Mobile/15E148 Safari/604.1', 'eyJfdG9rZW4iOiJTZzFYUFJZUTRGMnFCUnFpOUc5MUxybWVRbjlKb1BIelBGd25HVTFjIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpRdlpxTFl5eWdYbmxyY0JoIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1785930732),
('enWjEcDYt1ei55jZXkb0dCcsDESKd4lIPwXJqCpE', NULL, '114.10.155.201', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJvcVNQN1JGdk52eGNoRkRqblNReXpLRFVycTlCbmhSWjRsSmVncldpIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjp6SWtWSVR0dlozQkpEVnhUIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1786246915),
('FANBHym3v9oZkJ6NQcDDKDXTtUb6U76VrahscCZs', NULL, '45.79.190.34', 'RootEvidence/1.0', 'eyJfdG9rZW4iOiJGcm5DdHpmV09TOVB0ZFRqR1Y0UzR1ZU9oMzNCb0pmSHcwSHNjTnhMIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpRdlpxTFl5eWdYbmxyY0JoIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1785749241),
('FwASxY8E16iuRGiovAEd313Ly8d8hSiNsVEpLVd1', NULL, '114.10.155.201', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJNcmRuY3dwenFEbjhOV3ZwZDZNV0RRem9IZkUybk9qeWlscnlFV3dSIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvZGFzaGJvYXJkXC90dWdhcy1rdXJpciIsInJvdXRlIjoiZ2VuZXJhdGVkOjp6SWtWSVR0dlozQkpEVnhUIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1786259406),
('Fx1drrN0TtH9aJWmXiVyXy4bG0LhpOO2ZNrl6rMZ', NULL, '114.5.108.15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJpQW5jTlpzVEdPVFdDbW1qMHlUamRkTXVyUXUxUkpubGNDSExMUTR3IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpZS1J5Sm1VdXplUVJHbFVFIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1786156163),
('fZ6P8yEgcVXSq4rUSB7Ii566SWogNE4OJjyhkhW1', NULL, '35.204.134.146', 'Scrapy/2.17.0 (+https://scrapy.org)', 'eyJfdG9rZW4iOiIxZUFEbVpOSzdzN21OcmNyOWxNdTEyRlEzdzF5bnBaa25iVHc4S2JPIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpRdlpxTFl5eWdYbmxyY0JoIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1785582167),
('G4vJ1Xfk3N0XgDzHHISLwuda0CHRqVuEkEuuSNov', NULL, '167.172.36.236', 'Mozilla/5.0', 'eyJfdG9rZW4iOiJ0ZzNoUnRjeUFWZFpueVBLTFVxU0E0d010NVhqdm9OVFpBUjhoNGRjIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvd3AtbG9naW4ucGhwIiwicm91dGUiOiJnZW5lcmF0ZWQ6OlF2WnFMWXl5Z1hubHJjQmgifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1785116470),
('g6v1KJRhUp5IMtwjjnRpiFABql47MZ6Tmh5hairp', NULL, '74.7.243.128', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.4; +https://openai.com/gptbot)', 'eyJfdG9rZW4iOiJSRGRYWFFXNUpyNlVybmpQUUdvaDZsQ1BrWDBXSllaZTBaYUdISGZWIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpRdlpxTFl5eWdYbmxyY0JoIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1785901851),
('gEfMKV7sd258ngKQ0zkCX2GOxdyUGh72ELmZVz0X', NULL, '140.213.187.236', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJyeWowUWcyY3VjUnJ5QU1FODVIb1pRMUVsTENVY1NpdXczTzlOa21EIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpRdlpxTFl5eWdYbmxyY0JoIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1785123476),
('gfzWAckDXiwpI2VC1WYGd8KgjE3llDqCsgJIDodp', NULL, '74.7.242.49', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.4; +https://openai.com/gptbot)', 'eyJfdG9rZW4iOiJqd1pOWmx3ZWhXdUJIUG95NXM4YjQ3ZXp5V0UyV0RndEJSMkNNZXNnIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpRdlpxTFl5eWdYbmxyY0JoIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1785331107),
('GLtGcanC4rQGcngEETrfbdnIkM6XtBs4nGuZ5yhO', NULL, '103.253.27.124', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', 'eyJfdG9rZW4iOiJlNGdGMXBFNFRTZ2ZwYUc5elY0dVA1dHhHRXBFZFVRdTdMdHFrbHFoIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvdGVtcGxhdGVzXC9jYXNzaW9wZWlhXC90ZW1wbGF0ZURldGFpbHMueG1sIiwicm91dGUiOiJnZW5lcmF0ZWQ6OlF2WnFMWXl5Z1hubHJjQmgifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1786005971),
('HAPpge05brr3dVdvZqhM9oNuxNKUsB32Yea8HyXI', NULL, '103.253.27.124', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', 'eyJfdG9rZW4iOiJoa1dHUEdBVGtURVRKeEJMYjloTFJhRFJzSEplQzR1Q0FOeExrelc2IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvd3AtanNvbiIsInJvdXRlIjoiZ2VuZXJhdGVkOjpRdlpxTFl5eWdYbmxyY0JoIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1786005972),
('IF1XMy9JQJNfRNcfk3s77pOmd15URBmaQ4R8RTgn', NULL, '103.253.27.124', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', 'eyJfdG9rZW4iOiJ4WjUxMkxLdjhpTmtYZmtCU3ZKVnNGdmVLRkJkRDBpVGVKcmNPclJmIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvd3AtaW5jbHVkZXNcL2Nzc1wvYnV0dG9ucy5jc3MiLCJyb3V0ZSI6ImdlbmVyYXRlZDo6UXZacUxZeXlnWG5scmNCaCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1786005972),
('KJcYxPg6WhqR9qM1p4FSa98B76xsZuQEmi57J13q', NULL, '114.10.154.238', 'NetworkingExtension/8624.2.5.10.8 Network/5812.122.1 iOS/26.5.2', 'eyJfdG9rZW4iOiJuNWRidDQ1d0ZFeTU3QVhMMW1qbTI2QU42dE5jS1RNQjNmRUNyZjE1IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvYXBwbGUtdG91Y2gtaWNvbi5wbmciLCJyb3V0ZSI6ImdlbmVyYXRlZDo6WUtSeUptVXV6ZVFSR2xVRSJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1786180531),
('krWL65XrVVRyv56FntF6j8peIMnJEtBgH1J1RUel', NULL, '103.253.27.124', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', 'eyJfdG9rZW4iOiJoSUJBNmJ6UXdNZGRqWFdpWjlMVkNyakFkQWxCaWdDWmkwM0htamNEIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvUkVBRE1FLnR4dCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpRdlpxTFl5eWdYbmxyY0JoIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1786005971),
('ktIwMV82yigIlGWIJI6Jts4BrAViwuzz05Kyx1Wh', NULL, '182.5.242.21', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiI0MEx4V3ltMlNaWmZaUnJlWVYwOTZUY2t3cllueVhma1lIY0xlZDRVIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvZGFzaGJvYXJkXC9rYW50aW5cLzEiLCJyb3V0ZSI6ImdlbmVyYXRlZDo6UXZacUxZeXlnWG5scmNCaCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1784951488),
('KxW3cWtS0SV7ZGvJlqEkV5eQAS7n0eulyg2geXjw', NULL, '114.5.108.15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0', 'eyJfdG9rZW4iOiJSQmhFdW9GSlZ3eXd1N1UySEVPMllYV3I2Q3o1aHBnSjNIZDcyQkxpIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpZS1J5Sm1VdXplUVJHbFVFIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1786166757),
('LGfoX16fRryyWfxVOkWNfMo4fDDtEtdCE9FqYPCv', NULL, '147.92.179.119', 'facebookexternalhit/1.1;line-poker/1.0', 'eyJfdG9rZW4iOiJ6eWdOcFpaeE1zbjdwMUxGN0dpZm1BTlRMT2xybm55M0h4TDZvV2pKIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZCIsInJvdXRlIjoiZ2VuZXJhdGVkOjp6SWtWSVR0dlozQkpEVnhUIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1786255692),
('mwcH9EeG5UkM1wXLgg9rAPMSX59VuTwO8PsxWYbM', NULL, '114.5.108.15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0', 'eyJfdG9rZW4iOiJ2MWU1ZTdhcEV3UG9uWjlzdERPbnVmSWlldk40dDZqSFlQZjZseURiIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpZS1J5Sm1VdXplUVJHbFVFIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1786167054),
('N6DwERzWzu3Cdz7XukqTgD4sdQSeAW2ybFmyVtYe', NULL, '31.42.133.125', 'Mozilla/5.0 (X11; Linux i686; rv:109.0) Gecko/20100101 Firefox/120.0', 'eyJfdG9rZW4iOiI5cGJTUFJieFNJSmlnbGtUNVNiTzY1VE15aVQ2bmhvUDNlR04xYWhpIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpRdlpxTFl5eWdYbmxyY0JoIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1785232912),
('OAX8XlEE5hp8ljaBGhRF0vaFkoP0mPhEtJs2PIfn', NULL, '182.4.135.193', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJ4Z1gwN3Q1c3RWa0sybWg3bGFwYWFPanlRN0NDU1Zhbm55Wlk2dkt0IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvZGFzaGJvYXJkXC9wYW5kdWFuIiwicm91dGUiOiJnZW5lcmF0ZWQ6OnpJa1ZJVHR2WjNCSkRWeFQifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1786266096),
('oreKE7n1Q8sYkEg55yXxzN13oXqD3LJ03RU7MktU', NULL, '146.190.112.121', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJnQWxRdHNqV2FiUkxvb2lQT3Y4R2RKbThYNVNsd2w2ZVBDSTg1dURhIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpRdlpxTFl5eWdYbmxyY0JoIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1786032595),
('PGiQBJWpiL5nyaRfS3wWd6lwmHBgQJjUfNBYnKZH', NULL, '114.5.108.115', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_6_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/151.0.7922.57 Mobile/15E148 Safari/604.1', 'eyJfdG9rZW4iOiJ5MTBGSmFpU0l5R3dLbHRIMnY3WHBPYzExWUhyc3JKaGR0N2lKR2dIIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpZS1J5Sm1VdXplUVJHbFVFIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1786180314),
('pIWeQcxT3JZgK1LOqwYJ88L5nKVJgTstpinoaK7O', NULL, '103.17.77.94', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0', 'eyJfdG9rZW4iOiJISmt0dTVkUkxKZ1RKVmVLQ3dhU3MyaDJmRlluT3Rlb01yd2V5Q29TIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpRdlpxTFl5eWdYbmxyY0JoIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1786069356),
('poiP9jqPmTMTDbXFHb38HvnuW7xbhnYZlclciFi8', NULL, '103.76.151.61', 'Mozilla/5.0 (Linux; Android 10; M2006C3MG) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/123.0.6312.118 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJwU2xzaXpKT0tBOGtqSGlJa3JveFl2MThyMUJ2MjVoVXhLTEYzOGNGIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpRdlpxTFl5eWdYbmxyY0JoIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1785935005),
('qHVKIEi9eMGxdxWOlSODcXFvfdBgZIuBZWWCaTCu', NULL, '136.66.109.195', 'Mozilla/5.0 (compatible; CMS-Checker/1.0; +https://example.com)', 'eyJfdG9rZW4iOiJvbkY3R3FxQUl6RHdRTjZuRlpIRHRqVTYwV2lBd2U1ekhoNER4a21wIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpRdlpxTFl5eWdYbmxyY0JoIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1785161389),
('QomghFGMwgLD2fjFG2Gh8CyQ9evUiNBB9zDibwNG', NULL, '114.8.230.173', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJFd2dTMVNEY1k4V0ExNDE0eFg3RzdSZVl5UU83d2JIUzFab1BHb3ZwIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvcmVnaXN0ZXIiLCJyb3V0ZSI6ImdlbmVyYXRlZDo6eklrVklUdHZaM0JKRFZ4VCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1786264730),
('rABB6M3m3dnE3QxYeJdk0M2lDBdc4nIzjOPhbdiS', NULL, '45.79.190.34', 'RootEvidence/1.0', 'eyJfdG9rZW4iOiJvNWF0WFBsTFhLaTg4cmVsTzBTWUhSc1YzRk9xSkx5dlRxYjNLS1hMIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpRdlpxTFl5eWdYbmxyY0JoIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1785749242),
('sOJBdLbayhbdOunb8shhHWuUHcWuf0G9UQkgxw8U', NULL, '140.213.187.176', 'WhatsApp/2.23.20.0', 'eyJfdG9rZW4iOiJJazNtYjQxRWM3cFFKcVdhQVZ0V05tcjdkbFNmMkFLVmdRRnFzZlc3IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6eklrVklUdHZaM0JKRFZ4VCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1786333757),
('SXiCCGETnuD0z74HqrhyNPZK5NgNBaxQQOSHGhj9', NULL, '36.77.41.53', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiI5S3FVT0t6dWtiblZDaGMyaE92bjhoZFZCbXdZVFVxTlV1RndZWldWIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjp6SWtWSVR0dlozQkpEVnhUIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1786337442),
('SYBAACyjnDa5Nw7a4SCIuKsfbm0VygVRpc5XVddZ', NULL, '103.147.73.120', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJ2QVlGNXJIc0ZpN0lVQkFVSldnMFlZeHoxYXpDVFBXdTlDcnlBUnRkIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvZGFzaGJvYXJkXC9rZXJhbmphbmciLCJyb3V0ZSI6ImdlbmVyYXRlZDo6UXZacUxZeXlnWG5scmNCaCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1785113549),
('Tw0iP88zM4hbHSfInMma5FpNXX4nrnS2ZFbxsGiV', NULL, '136.109.111.147', 'Mozilla/5.0 (compatible; CMS-Checker/1.0; +https://example.com)', 'eyJfdG9rZW4iOiJiT3poMExBVlBsU3VJeW5qSGRsRFVhUmZleXNhVURzYXFjNEpvN2t5IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpRdlpxTFl5eWdYbmxyY0JoIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1785137469),
('v3mhQ4Zw6EaazZABZLA6aPt09adpMTJQ3leBIK2R', NULL, '34.24.245.15', '', 'eyJfdG9rZW4iOiJtUTl4TzNWSEVwR0VtSG5lenRFekI0aXF0emtrTVo4NUF3VGtrWFVwIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvLmdpdFwvY29uZmlnIiwicm91dGUiOiJnZW5lcmF0ZWQ6OlF2WnFMWXl5Z1hubHJjQmgifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1785880660),
('VeAXcWsewTGGpH8HrrUdbuk0mZDyxSthghHFH5Vu', NULL, '103.17.77.94', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0', 'eyJfdG9rZW4iOiJJVnB4QUo1UlZ2MlQ2eUxQYU0zQjBaUTZGNzdnajMyN1JtQjE1Q1NhIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvZGFzaGJvYXJkXC91c2VycyIsInJvdXRlIjoiZ2VuZXJhdGVkOjpJeTRnVnlsTnRVcmFhbzByIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1786094062),
('wXYTWYXkGTZFJrhGKuZdYDkiU6K3h8oDBZoWTgKK', NULL, '34.42.11.193', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:25.0) Gecko/20100101 Firefox/29.0', 'eyJfdG9rZW4iOiJkVlNiTGhZUlluQVRpdGVteUV4emdsNloyU0ZBdUxZc0N6VE9xU2xKIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpRdlpxTFl5eWdYbmxyY0JoIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1785176749),
('X4eIhhvqadDbcwWDuAXwGO6NIEtQg4DlSlXias13', NULL, '114.10.155.201', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_6_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/151.0.7922.57 Mobile/15E148 Safari/604.1', 'eyJfdG9rZW4iOiJObkRTNElvY0o3MWViblpPNXVUUU11b1l3VE1xOXVLZzY0TTc3WnlMIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjp6SWtWSVR0dlozQkpEVnhUIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1786264826),
('xQbLe91MHsuZw6QnmkpWLgIXHTWg4NDVaCawP55O', NULL, '114.5.221.219', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_6_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/151.0.7922.57 Mobile/15E148 Safari/604.1', 'eyJfdG9rZW4iOiJXQmxNcTFWd3hOTkhFbXVHOG1XUXppUmo4UUU5Q0syZ3l5TVRYVzNlIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6UXZacUxZeXlnWG5scmNCaCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1785942708),
('YVEUKkCJal3cq4L7sGhy53ffJSkgg6GBr0wDUA0f', NULL, '45.79.190.34', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/150.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJUZ29hT0hpbzZVRExqNnhkaFN4VFYwdXlFM2xpY3prZW9CdWgzZGVaIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZCIsInJvdXRlIjoiZ2VuZXJhdGVkOjpRdlpxTFl5eWdYbmxyY0JoIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1785749869);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `is_working` tinyint(1) NOT NULL DEFAULT 0,
  `avatar` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `santri_name` varchar(255) DEFAULT NULL,
  `santri_room` varchar(255) DEFAULT NULL,
  `santri_class` varchar(255) DEFAULT NULL,
  `santri_level` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `balance` decimal(12,2) NOT NULL DEFAULT 0.00,
  `penalty_points` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `is_working`, `avatar`, `email_verified_at`, `password`, `santri_name`, `santri_room`, `santri_class`, `santri_level`, `remember_token`, `created_at`, `updated_at`, `balance`, `penalty_points`) VALUES
(2, 'Administrator', 'admin@higopondok.com', NULL, 0, NULL, NULL, '$2y$12$R2W8y3RpF4LPFRgdzifSt.Mkh8W.9.KoHyEQxJ2HH1oXlKC./KJrS', NULL, NULL, NULL, NULL, NULL, '2026-06-28 10:04:24', '2026-06-28 10:04:24', 0.00, 0),
(10, 'Kantin', 'kantin@email.com', NULL, 0, NULL, NULL, '$2y$12$N7HKYYPwII0sxAwYu5pBWuspT7FnJBDoCCM1z6Fj8alQfbEpM7cNy', NULL, NULL, NULL, NULL, NULL, '2026-08-09 10:42:41', '2026-08-09 10:42:41', 0.00, 0),
(11, 'Wali', 'wali@email.com', '628787878787', 0, NULL, NULL, '$2y$12$AjR7txe9zxp6cDjdAtcVh.Rrxe1IBQ91Ymqp7j0tz7S8aqnLsjnQO', 'ZIDAN ABDILLAH KAFABIHI', 'Al Majid 1', '10 / X', 'MA', NULL, '2026-08-09 10:42:58', '2026-08-09 15:45:33', 0.00, 0),
(12, 'Kurir', 'kurir@email.com', NULL, 1, NULL, NULL, '$2y$12$53zKqrcWIivPg71gxMJB0eqDs4sHzrJbE.M3xJuKv0LPlnZIbK4y2', NULL, NULL, NULL, NULL, NULL, '2026-08-09 10:43:20', '2026-08-10 12:12:43', 0.00, 0),
(13, 'Anma muniri', 'anmamuniri@gmail.com', NULL, 0, NULL, NULL, '$2y$12$gdjjOkpzRQ3X7GxW3w7jWuKhAXHAaQkcgg97s09Jhcl0mETHAz0XG', NULL, NULL, NULL, NULL, NULL, '2026-08-10 10:59:40', '2026-08-10 10:59:40', 0.00, 0),
(14, 'Latifah Zumaila Iva', 'latifahzumaila@gmail.com', NULL, 0, NULL, NULL, '$2y$12$4ItvW9EDow90QyLQhA1gheocIQi8jwmmD05unCHDfQMyMMpMr2sfW', 'MUHAMAD AKMAL FUADI', 'Al Majid 1', '10 / X', 'MA', NULL, '2026-08-10 12:07:32', '2026-08-10 12:15:04', 0.00, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activity_logs_user_id_foreign` (`user_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `canteens`
--
ALTER TABLE `canteens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `canteens_user_id_foreign` (`user_id`);

--
-- Indexes for table `canteen_banners`
--
ALTER TABLE `canteen_banners`
  ADD PRIMARY KEY (`id`),
  ADD KEY `canteen_banners_canteen_id_foreign` (`canteen_id`),
  ADD KEY `canteen_banners_status_index` (`status`);

--
-- Indexes for table `canteen_withdrawals`
--
ALTER TABLE `canteen_withdrawals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `canteen_withdrawals_canteen_id_foreign` (`canteen_id`),
  ADD KEY `canteen_withdrawals_admin_id_foreign` (`admin_id`);

--
-- Indexes for table `drivers`
--
ALTER TABLE `drivers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `drivers_user_id_foreign` (`user_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  ADD KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_user_id_foreign` (`user_id`),
  ADD KEY `orders_canteen_id_foreign` (`canteen_id`),
  ADD KEY `orders_courier_id_foreign` (`courier_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_order_id_foreign` (`order_id`),
  ADD KEY `order_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payment_logs`
--
ALTER TABLE `payment_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_logs_user_id_foreign` (`user_id`),
  ADD KEY `payment_logs_order_id_foreign` (`order_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `products_canteen_id_foreign` (`canteen_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT for table `canteens`
--
ALTER TABLE `canteens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `canteen_banners`
--
ALTER TABLE `canteen_banners`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `canteen_withdrawals`
--
ALTER TABLE `canteen_withdrawals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `drivers`
--
ALTER TABLE `drivers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `payment_logs`
--
ALTER TABLE `payment_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `canteens`
--
ALTER TABLE `canteens`
  ADD CONSTRAINT `canteens_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `canteen_banners`
--
ALTER TABLE `canteen_banners`
  ADD CONSTRAINT `canteen_banners_canteen_id_foreign` FOREIGN KEY (`canteen_id`) REFERENCES `canteens` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `canteen_withdrawals`
--
ALTER TABLE `canteen_withdrawals`
  ADD CONSTRAINT `canteen_withdrawals_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `canteen_withdrawals_canteen_id_foreign` FOREIGN KEY (`canteen_id`) REFERENCES `canteens` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `drivers`
--
ALTER TABLE `drivers`
  ADD CONSTRAINT `drivers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_canteen_id_foreign` FOREIGN KEY (`canteen_id`) REFERENCES `canteens` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_courier_id_foreign` FOREIGN KEY (`courier_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payment_logs`
--
ALTER TABLE `payment_logs`
  ADD CONSTRAINT `payment_logs_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `payment_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_canteen_id_foreign` FOREIGN KEY (`canteen_id`) REFERENCES `canteens` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
