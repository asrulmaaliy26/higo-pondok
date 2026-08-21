-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 21, 2026 at 08:51 AM
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
(84, 14, 'updated', 'User', 14, 'Memperbarui User: Latifah Zumaila Iva', '2026-08-10 12:15:04', '2026-08-10 12:15:04'),
(85, NULL, 'created', 'User', 15, 'Menambahkan User baru: Asrul Maaliy', '2026-08-17 19:51:16', '2026-08-17 19:51:16'),
(86, 10, 'created', 'Product', 6, 'Menambahkan Product baru: dimsum', '2026-08-17 20:11:13', '2026-08-17 20:11:13'),
(87, 10, 'created', 'Canteen', 5, 'Menambahkan Canteen baru: bakso kenangan', '2026-08-17 20:12:02', '2026-08-17 20:12:02'),
(88, 2, 'updated', 'Canteen', 5, 'Memperbarui Canteen: bakso kenangan', '2026-08-17 20:13:03', '2026-08-17 20:13:03'),
(89, NULL, 'created', 'User', 16, 'Menambahkan User baru: Nur Akhsin Alifian Hadi', '2026-08-17 20:16:08', '2026-08-17 20:16:08'),
(90, 16, 'updated', 'User', 16, 'Memperbarui User: Nur Akhsin Alifian Hadi', '2026-08-17 20:19:29', '2026-08-17 20:19:29'),
(91, 10, 'created', 'Canteen', 6, 'Menambahkan Canteen baru: DIMSUM GENDUT', '2026-08-18 15:16:58', '2026-08-18 15:16:58'),
(92, 10, 'updated', 'Canteen', 5, 'Memperbarui Canteen: bakso kenangan', '2026-08-18 15:17:09', '2026-08-18 15:17:09'),
(93, 10, 'updated', 'Canteen', 6, 'Memperbarui Canteen: DIMSUM GENDUT', '2026-08-18 15:23:40', '2026-08-18 15:23:40'),
(94, 10, 'created', 'Product', 7, 'Menambahkan Product baru: DIMSUM ORIGINAL isi 6', '2026-08-18 15:26:29', '2026-08-18 15:26:29'),
(95, 10, 'created', 'Product', 8, 'Menambahkan Product baru: Dimsum mentai spicy isi 6', '2026-08-18 15:27:26', '2026-08-18 15:27:26'),
(96, 10, 'updated', 'Product', 8, 'Memperbarui Product: Dimsum mentai spicy isi 6', '2026-08-18 15:28:28', '2026-08-18 15:28:28'),
(97, 10, 'updated', 'Product', 8, 'Memperbarui Product: Dimsum mentai spicy isi 6', '2026-08-18 15:31:26', '2026-08-18 15:31:26'),
(98, 10, 'updated', 'Product', 7, 'Memperbarui Product: DIMSUM ORIGINAL isi 6', '2026-08-18 15:31:45', '2026-08-18 15:31:45'),
(99, 10, 'updated', 'Canteen', 4, 'Memperbarui Canteen: Gacoan', '2026-08-18 15:32:28', '2026-08-18 15:32:28'),
(100, 2, 'updated', 'Canteen', 6, 'Memperbarui Canteen: DIMSUM GENDUT', '2026-08-18 15:35:53', '2026-08-18 15:35:53'),
(101, 2, 'updated', 'Canteen', 6, 'Memperbarui Canteen: DIMSUM GENDUT', '2026-08-18 15:36:07', '2026-08-18 15:36:07'),
(102, 10, 'deleted', 'Product', 6, 'Menghapus Product: dimsum', '2026-08-18 15:38:52', '2026-08-18 15:38:52'),
(103, 10, 'deleted', 'Product', 5, 'Menghapus Product: Mie', '2026-08-18 15:42:04', '2026-08-18 15:42:04'),
(104, 2, 'updated', 'User', 16, 'Memperbarui User: Nur Akhsin Alifian Hadi', '2026-08-18 16:02:32', '2026-08-18 16:02:32'),
(105, 16, 'updated', 'User', 16, 'Memperbarui User: Nur Akhsin Alifian Hadi', '2026-08-18 16:17:34', '2026-08-18 16:17:34'),
(106, 16, 'created', 'Order', 7, 'Menambahkan Order baru: 7', '2026-08-18 16:17:53', '2026-08-18 16:17:53'),
(107, 16, 'updated', 'Product', 7, 'Memperbarui Product: DIMSUM ORIGINAL isi 6', '2026-08-18 16:17:53', '2026-08-18 16:17:53'),
(108, 16, 'updated', 'Product', 7, 'Memperbarui Product: DIMSUM ORIGINAL isi 6', '2026-08-18 16:17:53', '2026-08-18 16:17:53'),
(109, 16, 'updated', 'Order', 7, 'Memperbarui Order: 7', '2026-08-18 16:17:53', '2026-08-18 16:17:53'),
(110, 16, 'updated', 'Order', 7, 'Memperbarui Order: 7', '2026-08-18 16:19:00', '2026-08-18 16:19:00'),
(111, 16, 'updated', 'Product', 7, 'Memperbarui Product: DIMSUM ORIGINAL isi 6', '2026-08-18 16:19:00', '2026-08-18 16:19:00'),
(112, 16, 'updated', 'Product', 7, 'Memperbarui Product: DIMSUM ORIGINAL isi 6', '2026-08-18 16:19:00', '2026-08-18 16:19:00'),
(113, 16, 'created', 'Order', 8, 'Menambahkan Order baru: 8', '2026-08-18 16:19:30', '2026-08-18 16:19:30'),
(114, 16, 'updated', 'Product', 8, 'Memperbarui Product: Dimsum mentai spicy isi 6', '2026-08-18 16:19:30', '2026-08-18 16:19:30'),
(115, 16, 'updated', 'Product', 8, 'Memperbarui Product: Dimsum mentai spicy isi 6', '2026-08-18 16:19:30', '2026-08-18 16:19:30'),
(116, 16, 'updated', 'Order', 8, 'Memperbarui Order: 8', '2026-08-18 16:19:30', '2026-08-18 16:19:30'),
(117, NULL, 'created', 'User', 17, 'Menambahkan User baru: jsp.learningeducation', '2026-08-18 16:36:19', '2026-08-18 16:36:19'),
(118, NULL, 'updated', 'User', 17, 'Memperbarui User: jsp.learningeducation', '2026-08-18 16:40:27', '2026-08-18 16:40:27'),
(119, NULL, 'created', 'Order', 9, 'Menambahkan Order baru: 9', '2026-08-18 16:55:31', '2026-08-18 16:55:31'),
(120, NULL, 'updated', 'Product', 7, 'Memperbarui Product: DIMSUM ORIGINAL isi 6', '2026-08-18 16:55:31', '2026-08-18 16:55:31'),
(121, NULL, 'updated', 'Product', 7, 'Memperbarui Product: DIMSUM ORIGINAL isi 6', '2026-08-18 16:55:31', '2026-08-18 16:55:31'),
(122, NULL, 'updated', 'Product', 8, 'Memperbarui Product: Dimsum mentai spicy isi 6', '2026-08-18 16:55:31', '2026-08-18 16:55:31'),
(123, NULL, 'updated', 'Product', 8, 'Memperbarui Product: Dimsum mentai spicy isi 6', '2026-08-18 16:55:31', '2026-08-18 16:55:31'),
(124, NULL, 'updated', 'Order', 9, 'Memperbarui Order: 9', '2026-08-18 16:55:31', '2026-08-18 16:55:31'),
(125, NULL, 'created', 'User', 18, 'Menambahkan User baru: muhammad steven', '2026-08-18 19:21:06', '2026-08-18 19:21:06'),
(126, NULL, 'updated', 'User', 18, 'Memperbarui User: muhammad steven', '2026-08-18 19:33:24', '2026-08-18 19:33:24'),
(127, NULL, 'created', 'Order', 10, 'Menambahkan Order baru: 10', '2026-08-19 15:34:22', '2026-08-19 15:34:22'),
(128, NULL, 'updated', 'Product', 7, 'Memperbarui Product: DIMSUM ORIGINAL isi 6', '2026-08-19 15:34:22', '2026-08-19 15:34:22'),
(129, NULL, 'updated', 'Product', 7, 'Memperbarui Product: DIMSUM ORIGINAL isi 6', '2026-08-19 15:34:22', '2026-08-19 15:34:22'),
(130, NULL, 'updated', 'Product', 8, 'Memperbarui Product: Dimsum mentai spicy isi 6', '2026-08-19 15:34:22', '2026-08-19 15:34:22'),
(131, NULL, 'updated', 'Product', 8, 'Memperbarui Product: Dimsum mentai spicy isi 6', '2026-08-19 15:34:22', '2026-08-19 15:34:22'),
(132, NULL, 'updated', 'Order', 10, 'Memperbarui Order: 10', '2026-08-19 15:34:22', '2026-08-19 15:34:22'),
(133, 10, 'updated', 'Canteen', 4, 'Memperbarui Canteen: Mie Gacoan', '2026-08-19 18:39:35', '2026-08-19 18:39:35'),
(134, 10, 'updated', 'Canteen', 5, 'Memperbarui Canteen: BAKSO KUY KAUMAN', '2026-08-19 18:43:29', '2026-08-19 18:43:29'),
(135, 10, 'updated', 'Canteen', 6, 'Memperbarui Canteen: DIMSUM GENDUT KAUMAN', '2026-08-19 18:43:40', '2026-08-19 18:43:40'),
(136, 10, 'created', 'Canteen', 7, 'Menambahkan Canteen baru: MIE AYAM SOLO KAUMAN', '2026-08-19 18:44:05', '2026-08-19 18:44:05'),
(137, 10, 'updated', 'Canteen', 7, 'Memperbarui Canteen: MIE AYAM SOLO KAUMAN', '2026-08-19 18:44:12', '2026-08-19 18:44:12'),
(138, 10, 'created', 'Canteen', 8, 'Menambahkan Canteen baru: NASI GORENG', '2026-08-19 18:44:34', '2026-08-19 18:44:34'),
(139, 10, 'updated', 'Canteen', 8, 'Memperbarui Canteen: NASI GORENG', '2026-08-19 18:44:44', '2026-08-19 18:44:44'),
(140, 10, 'created', 'Canteen', 9, 'Menambahkan Canteen baru: SEBLAK BUNA', '2026-08-19 18:45:02', '2026-08-19 18:45:02'),
(141, 10, 'created', 'Canteen', 10, 'Menambahkan Canteen baru: SATE TAICAN KENAYAN', '2026-08-19 18:45:22', '2026-08-19 18:45:22'),
(142, 10, 'created', 'Canteen', 11, 'Menambahkan Canteen baru: NASI PADANG KAUMAN', '2026-08-19 18:46:24', '2026-08-19 18:46:24'),
(143, 10, 'created', 'Canteen', 12, 'Menambahkan Canteen baru: MARTABAK KAUMAN', '2026-08-19 18:47:02', '2026-08-19 18:47:02'),
(144, 10, 'created', 'Canteen', 13, 'Menambahkan Canteen baru: TERANG BULAN KAUMAN', '2026-08-19 18:47:21', '2026-08-19 18:47:21'),
(145, 10, 'created', 'Canteen', 14, 'Menambahkan Canteen baru: NASI AYAM GEPREK KAUMAN', '2026-08-19 18:47:51', '2026-08-19 18:47:51'),
(146, 10, 'created', 'Canteen', 15, 'Menambahkan Canteen baru: ROKET CHIKEN KAUMAN', '2026-08-19 18:58:17', '2026-08-19 18:58:17'),
(147, 10, 'created', 'Canteen', 16, 'Menambahkan Canteen baru: PENYETAN LAMONGAN KAUMAN', '2026-08-19 18:59:09', '2026-08-19 18:59:09'),
(148, 10, 'created', 'Canteen', 17, 'Menambahkan Canteen baru: NESCAFEE', '2026-08-19 19:00:43', '2026-08-19 19:00:43'),
(149, 10, 'created', 'Canteen', 18, 'Menambahkan Canteen baru: MOMOYO', '2026-08-19 19:00:54', '2026-08-19 19:00:54'),
(150, 10, 'created', 'Canteen', 19, 'Menambahkan Canteen baru: TROPISCO', '2026-08-19 19:00:59', '2026-08-19 19:00:59'),
(151, 2, 'updated', 'Canteen', 19, 'Memperbarui Canteen: TROPISCO', '2026-08-19 19:01:42', '2026-08-19 19:01:42'),
(152, 2, 'updated', 'Canteen', 19, 'Memperbarui Canteen: TROPISCO', '2026-08-19 19:01:51', '2026-08-19 19:01:51'),
(153, 2, 'updated', 'Canteen', 18, 'Memperbarui Canteen: MOMOYO', '2026-08-19 19:04:31', '2026-08-19 19:04:31'),
(154, 2, 'updated', 'Canteen', 18, 'Memperbarui Canteen: MOMOYO', '2026-08-19 19:04:35', '2026-08-19 19:04:35'),
(155, 2, 'updated', 'Canteen', 17, 'Memperbarui Canteen: NESCAFEE', '2026-08-19 19:04:55', '2026-08-19 19:04:55'),
(156, 2, 'updated', 'Canteen', 17, 'Memperbarui Canteen: NESCAFEE', '2026-08-19 19:04:57', '2026-08-19 19:04:57'),
(157, 2, 'updated', 'Canteen', 16, 'Memperbarui Canteen: PENYETAN LAMONGAN KAUMAN', '2026-08-19 19:05:19', '2026-08-19 19:05:19'),
(158, 2, 'updated', 'Canteen', 16, 'Memperbarui Canteen: PENYETAN LAMONGAN KAUMAN', '2026-08-19 19:05:21', '2026-08-19 19:05:21'),
(159, 2, 'updated', 'Canteen', 16, 'Memperbarui Canteen: PENYETAN LAMONGAN KAUMAN', '2026-08-19 19:05:28', '2026-08-19 19:05:28'),
(160, 2, 'updated', 'Canteen', 15, 'Memperbarui Canteen: ROKET CHIKEN KAUMAN', '2026-08-19 19:05:32', '2026-08-19 19:05:32'),
(161, 2, 'updated', 'Canteen', 15, 'Memperbarui Canteen: ROKET CHIKEN KAUMAN', '2026-08-19 19:05:33', '2026-08-19 19:05:33'),
(162, 2, 'updated', 'Canteen', 14, 'Memperbarui Canteen: NASI AYAM GEPREK KAUMAN', '2026-08-19 19:05:37', '2026-08-19 19:05:37'),
(163, 2, 'updated', 'Canteen', 14, 'Memperbarui Canteen: NASI AYAM GEPREK KAUMAN', '2026-08-19 19:05:39', '2026-08-19 19:05:39'),
(164, 2, 'updated', 'Canteen', 13, 'Memperbarui Canteen: TERANG BULAN KAUMAN', '2026-08-19 19:05:42', '2026-08-19 19:05:42'),
(165, 2, 'updated', 'Canteen', 13, 'Memperbarui Canteen: TERANG BULAN KAUMAN', '2026-08-19 19:05:44', '2026-08-19 19:05:44'),
(166, 2, 'updated', 'Canteen', 12, 'Memperbarui Canteen: MARTABAK KAUMAN', '2026-08-19 19:05:48', '2026-08-19 19:05:48'),
(167, 2, 'updated', 'Canteen', 12, 'Memperbarui Canteen: MARTABAK KAUMAN', '2026-08-19 19:05:49', '2026-08-19 19:05:49'),
(168, 2, 'updated', 'Canteen', 11, 'Memperbarui Canteen: NASI PADANG KAUMAN', '2026-08-19 19:05:52', '2026-08-19 19:05:52'),
(169, 2, 'updated', 'Canteen', 11, 'Memperbarui Canteen: NASI PADANG KAUMAN', '2026-08-19 19:05:54', '2026-08-19 19:05:54'),
(170, 2, 'updated', 'Canteen', 10, 'Memperbarui Canteen: SATE TAICAN KENAYAN', '2026-08-19 19:05:56', '2026-08-19 19:05:56'),
(171, 2, 'updated', 'Canteen', 10, 'Memperbarui Canteen: SATE TAICAN KENAYAN', '2026-08-19 19:05:58', '2026-08-19 19:05:58'),
(172, 2, 'updated', 'Canteen', 9, 'Memperbarui Canteen: SEBLAK BUNA', '2026-08-19 19:06:01', '2026-08-19 19:06:01'),
(173, 2, 'updated', 'Canteen', 9, 'Memperbarui Canteen: SEBLAK BUNA', '2026-08-19 19:06:02', '2026-08-19 19:06:02'),
(174, 2, 'updated', 'Canteen', 9, 'Memperbarui Canteen: SEBLAK BUNA', '2026-08-19 19:06:05', '2026-08-19 19:06:05'),
(175, 2, 'updated', 'Canteen', 8, 'Memperbarui Canteen: NASI GORENG', '2026-08-19 19:06:08', '2026-08-19 19:06:08'),
(176, 2, 'updated', 'Canteen', 8, 'Memperbarui Canteen: NASI GORENG', '2026-08-19 19:06:09', '2026-08-19 19:06:09'),
(177, 2, 'updated', 'Canteen', 7, 'Memperbarui Canteen: MIE AYAM SOLO KAUMAN', '2026-08-19 19:06:15', '2026-08-19 19:06:15'),
(178, 2, 'updated', 'Canteen', 7, 'Memperbarui Canteen: MIE AYAM SOLO KAUMAN', '2026-08-19 19:06:17', '2026-08-19 19:06:17'),
(179, 2, 'updated', 'Canteen', 16, 'Memperbarui Canteen: PENYETAN LAMONGAN KAUMAN', '2026-08-19 19:06:39', '2026-08-19 19:06:39'),
(180, 10, 'created', 'Product', 9, 'Menambahkan Product baru: Mie Suit', '2026-08-19 19:20:12', '2026-08-19 19:20:12'),
(181, 10, 'created', 'Product', 10, 'Menambahkan Product baru: Mie Hompimpa', '2026-08-19 19:20:51', '2026-08-19 19:20:51'),
(182, 10, 'created', 'Product', 11, 'Menambahkan Product baru: Mie Gacoan', '2026-08-19 19:21:21', '2026-08-19 19:21:21'),
(183, 10, 'created', 'Product', 12, 'Menambahkan Product baru: Udang Keju', '2026-08-19 19:23:27', '2026-08-19 19:23:27'),
(184, 10, 'created', 'Product', 13, 'Menambahkan Product baru: Udang Rambutan', '2026-08-19 19:24:00', '2026-08-19 19:24:00'),
(185, 10, 'created', 'Product', 14, 'Menambahkan Product baru: siomay', '2026-08-19 19:24:32', '2026-08-19 19:24:32'),
(186, 10, 'created', 'Product', 15, 'Menambahkan Product baru: Lumpia Udang', '2026-08-19 19:25:09', '2026-08-19 19:25:09'),
(187, 10, 'created', 'Product', 16, 'Menambahkan Product baru: Bakso Kuy', '2026-08-19 19:33:49', '2026-08-19 19:33:49'),
(188, 10, 'updated', 'Product', 16, 'Memperbarui Product: Bakso Sapi Halus', '2026-08-19 19:34:11', '2026-08-19 19:34:11'),
(189, 10, 'created', 'Product', 17, 'Menambahkan Product baru: Bakso Mercon', '2026-08-19 19:36:06', '2026-08-19 19:36:06'),
(190, 10, 'created', 'Product', 18, 'Menambahkan Product baru: Bakso Telur', '2026-08-19 19:37:07', '2026-08-19 19:37:07'),
(191, 10, 'updated', 'Canteen', 5, 'Memperbarui Canteen: BAKSO KUY KAUMAN', '2026-08-19 19:38:30', '2026-08-19 19:38:30'),
(192, 10, 'updated', 'Product', 8, 'Memperbarui Product: Dimsum mentai spicy isi 6', '2026-08-19 19:41:00', '2026-08-19 19:41:00'),
(193, 10, 'updated', 'Product', 7, 'Memperbarui Product: DIMSUM ORIGINAL isi 6', '2026-08-19 19:41:29', '2026-08-19 19:41:29'),
(194, 10, 'updated', 'Canteen', 6, 'Memperbarui Canteen: DIMSUM GENDUT KAUMAN', '2026-08-19 19:42:14', '2026-08-19 19:42:14'),
(195, 10, 'created', 'Product', 19, 'Menambahkan Product baru: Mie Ayam', '2026-08-19 19:44:07', '2026-08-19 19:44:07'),
(196, 10, 'created', 'Product', 20, 'Menambahkan Product baru: Nasi Goreng cikrak \"OGES KANE\"', '2026-08-19 19:47:46', '2026-08-19 19:47:46'),
(197, 10, 'created', 'Product', 21, 'Menambahkan Product baru: Seblak Paket 1', '2026-08-19 19:56:19', '2026-08-19 19:56:19'),
(198, 10, 'updated', 'Product', 21, 'Memperbarui Product: Seblak Paket 1', '2026-08-19 19:56:57', '2026-08-19 19:56:57'),
(199, 10, 'created', 'Product', 22, 'Menambahkan Product baru: Seblak paket 2', '2026-08-19 19:57:59', '2026-08-19 19:57:59'),
(200, 10, 'updated', 'Product', 22, 'Memperbarui Product: Seblak paket 2', '2026-08-19 19:58:39', '2026-08-19 19:58:39'),
(201, 10, 'updated', 'Product', 22, 'Memperbarui Product: Seblak paket 2', '2026-08-19 19:59:29', '2026-08-19 19:59:29'),
(202, 10, 'created', 'Product', 23, 'Menambahkan Product baru: sate taican', '2026-08-19 20:04:50', '2026-08-19 20:04:50'),
(203, 10, 'created', 'Product', 24, 'Menambahkan Product baru: Nasi padang', '2026-08-19 20:07:33', '2026-08-19 20:07:33'),
(204, 10, 'created', 'Product', 25, 'Menambahkan Product baru: nasi padang', '2026-08-19 20:08:05', '2026-08-19 20:08:05'),
(205, 10, 'created', 'Product', 26, 'Menambahkan Product baru: Martabak telur', '2026-08-19 20:10:29', '2026-08-19 20:10:29'),
(206, 10, 'created', 'Product', 27, 'Menambahkan Product baru: Terang Bulang rasa coklat', '2026-08-19 20:11:11', '2026-08-19 20:11:11'),
(207, 10, 'updated', 'Product', 27, 'Memperbarui Product: Terang Bulan rasa coklat', '2026-08-19 20:11:24', '2026-08-19 20:11:24'),
(208, 10, 'created', 'Product', 28, 'Menambahkan Product baru: nasi ayam geprek', '2026-08-19 20:12:46', '2026-08-19 20:12:46'),
(209, 10, 'created', 'Product', 29, 'Menambahkan Product baru: Paket Matah 1', '2026-08-19 20:15:42', '2026-08-19 20:15:42'),
(210, 10, 'created', 'Product', 30, 'Menambahkan Product baru: Paket Terasi 1', '2026-08-19 20:16:21', '2026-08-19 20:16:21'),
(211, NULL, 'created', 'User', 19, 'Menambahkan User baru: Ma Alhidayah', '2026-08-19 20:54:50', '2026-08-19 20:54:50'),
(212, NULL, 'created', 'User', 20, 'Menambahkan User baru: Gilang permatasari', '2026-08-19 21:06:47', '2026-08-19 21:06:47'),
(213, NULL, 'created', 'User', 21, 'Menambahkan User baru: Elshanum Elsa', '2026-08-19 21:12:50', '2026-08-19 21:12:50'),
(214, NULL, 'created', 'User', 22, 'Menambahkan User baru: dwi Setiawan', '2026-08-19 21:14:22', '2026-08-19 21:14:22'),
(215, NULL, 'created', 'User', 23, 'Menambahkan User baru: Junaina Shafwana Al Ihsan', '2026-08-19 21:19:16', '2026-08-19 21:19:16'),
(216, NULL, 'created', 'User', 24, 'Menambahkan User baru: Muhammad Baidowi', '2026-08-19 21:19:52', '2026-08-19 21:19:52'),
(217, 23, 'updated', 'User', 23, 'Memperbarui User: Junaina Shafwana Al Ihsan', '2026-08-19 21:21:16', '2026-08-19 21:21:16'),
(218, 24, 'updated', 'User', 24, 'Memperbarui User: Muhammad Baidowi', '2026-08-19 21:24:21', '2026-08-19 21:24:21'),
(219, NULL, 'created', 'User', 25, 'Menambahkan User baru: Adilla Riandhani', '2026-08-19 21:27:04', '2026-08-19 21:27:04'),
(220, NULL, 'created', 'User', 26, 'Menambahkan User baru: Maulidia Afiana', '2026-08-19 21:33:14', '2026-08-19 21:33:14'),
(221, NULL, 'created', 'User', 27, 'Menambahkan User baru: Insaniya Khusna04', '2026-08-19 21:35:32', '2026-08-19 21:35:32'),
(222, NULL, 'created', 'User', 28, 'Menambahkan User baru: Zananaurulfajri', '2026-08-19 21:36:38', '2026-08-19 21:36:38'),
(223, NULL, 'created', 'User', 29, 'Menambahkan User baru: Sulis Tiyo', '2026-08-19 21:37:43', '2026-08-19 21:37:43'),
(224, NULL, 'created', 'User', 30, 'Menambahkan User baru: nurin latif azizah', '2026-08-19 21:38:09', '2026-08-19 21:38:09'),
(225, 29, 'updated', 'User', 29, 'Memperbarui User: Sulis Tiyo', '2026-08-19 21:40:56', '2026-08-19 21:40:56'),
(226, 29, 'updated', 'User', 29, 'Memperbarui User: Sulis Tiyo', '2026-08-19 21:41:17', '2026-08-19 21:41:17'),
(227, NULL, 'created', 'User', 31, 'Menambahkan User baru: Ratna Ningsih', '2026-08-19 21:43:47', '2026-08-19 21:43:47'),
(228, NULL, 'created', 'User', 32, 'Menambahkan User baru: AZIZAH NISA', '2026-08-19 21:50:07', '2026-08-19 21:50:07'),
(229, NULL, 'created', 'User', 33, 'Menambahkan User baru: Ovi Novia', '2026-08-19 21:52:56', '2026-08-19 21:52:56'),
(230, 32, 'updated', 'User', 32, 'Memperbarui User: AZIZAH NISA', '2026-08-19 21:52:56', '2026-08-19 21:52:56'),
(231, NULL, 'created', 'User', 34, 'Menambahkan User baru: Ani Mufdiatul Ulfa', '2026-08-19 21:55:56', '2026-08-19 21:55:56'),
(232, 34, 'updated', 'User', 34, 'Memperbarui User: Ani Mufdiatul Ulfa', '2026-08-19 21:58:54', '2026-08-19 21:58:54'),
(233, NULL, 'created', 'User', 35, 'Menambahkan User baru: Farzan Abdillah', '2026-08-19 22:06:54', '2026-08-19 22:06:54'),
(234, NULL, 'created', 'User', 36, 'Menambahkan User baru: Aprilia Azizah', '2026-08-19 22:08:06', '2026-08-19 22:08:06'),
(235, NULL, 'created', 'User', 37, 'Menambahkan User baru: Safira Khanza', '2026-08-19 22:19:10', '2026-08-19 22:19:10'),
(236, NULL, 'created', 'User', 38, 'Menambahkan User baru: Dunia Ini', '2026-08-19 22:22:14', '2026-08-19 22:22:14'),
(237, NULL, 'created', 'User', 39, 'Menambahkan User baru: nana kristina', '2026-08-19 22:22:29', '2026-08-19 22:22:29'),
(238, NULL, 'created', 'User', 40, 'Menambahkan User baru: Roifa Roifa', '2026-08-19 22:23:38', '2026-08-19 22:23:38'),
(239, NULL, 'created', 'User', 41, 'Menambahkan User baru: sugeng lelono', '2026-08-19 22:34:40', '2026-08-19 22:34:40'),
(240, NULL, 'created', 'User', 42, 'Menambahkan User baru: Aliyah', '2026-08-19 22:35:50', '2026-08-19 22:35:50'),
(241, 39, 'updated', 'User', 39, 'Memperbarui User: nana kristina', '2026-08-19 22:45:05', '2026-08-19 22:45:05'),
(242, 39, 'updated', 'User', 39, 'Memperbarui User: nana kristina', '2026-08-19 22:47:11', '2026-08-19 22:47:11'),
(243, NULL, 'created', 'User', 43, 'Menambahkan User baru: Bekti Rahayu', '2026-08-19 22:48:38', '2026-08-19 22:48:38'),
(244, 39, 'updated', 'User', 39, 'Memperbarui User: nana kristina', '2026-08-19 22:49:50', '2026-08-19 22:49:50'),
(245, NULL, 'created', 'User', 44, 'Menambahkan User baru: salwa balqies gaming', '2026-08-19 22:54:14', '2026-08-19 22:54:14'),
(246, NULL, 'created', 'User', 45, 'Menambahkan User baru: Risa Fafa', '2026-08-19 23:00:11', '2026-08-19 23:00:11'),
(247, 45, 'updated', 'User', 45, 'Memperbarui User: Risa Fafa', '2026-08-19 23:06:22', '2026-08-19 23:06:22'),
(248, NULL, 'created', 'User', 46, 'Menambahkan User baru: Pondok Asmah', '2026-08-19 23:20:03', '2026-08-19 23:20:03'),
(249, NULL, 'created', 'User', 47, 'Menambahkan User baru: Madin al-hidayah Putri', '2026-08-19 23:24:45', '2026-08-19 23:24:45'),
(250, NULL, 'created', 'User', 48, 'Menambahkan User baru: siti aniyah', '2026-08-20 03:39:20', '2026-08-20 03:39:20'),
(251, NULL, 'created', 'User', 49, 'Menambahkan User baru: Mas Rokhah', '2026-08-20 05:03:19', '2026-08-20 05:03:19'),
(252, NULL, 'created', 'User', 50, 'Menambahkan User baru: Asmaul Husna', '2026-08-20 05:11:58', '2026-08-20 05:11:58'),
(253, 50, 'updated', 'User', 50, 'Memperbarui User: Asmaul Husna', '2026-08-20 05:16:42', '2026-08-20 05:16:42'),
(254, NULL, 'created', 'User', 51, 'Menambahkan User baru: Hayati Mustofa', '2026-08-20 05:26:09', '2026-08-20 05:26:09'),
(255, NULL, 'created', 'User', 52, 'Menambahkan User baru: Zelda', '2026-08-20 05:41:38', '2026-08-20 05:41:38'),
(256, 10, 'created', 'Product', 31, 'Menambahkan Product baru: Tropisco', '2026-08-20 05:50:50', '2026-08-20 05:50:50'),
(257, 10, 'created', 'Product', 32, 'Menambahkan Product baru: Es Degan Coklat', '2026-08-20 05:53:20', '2026-08-20 05:53:20'),
(258, 10, 'updated', 'Product', 31, 'Memperbarui Product: Tropisco Big Brown Sugar', '2026-08-20 05:54:02', '2026-08-20 05:54:02'),
(259, 10, 'updated', 'Product', 31, 'Memperbarui Product: Tropisco Big Brown Sugar', '2026-08-20 05:54:08', '2026-08-20 05:54:08'),
(260, 10, 'updated', 'Product', 32, 'Memperbarui Product: Tropisco Es Degan Coklat', '2026-08-20 05:55:14', '2026-08-20 05:55:14'),
(261, 10, 'updated', 'Product', 31, 'Memperbarui Product: Tropisco Big Brown Sugar', '2026-08-20 05:55:51', '2026-08-20 05:55:51'),
(262, 10, 'created', 'Product', 33, 'Menambahkan Product baru: Tropisco Cocopandan Small', '2026-08-20 05:57:37', '2026-08-20 05:57:37'),
(263, 10, 'created', 'Product', 34, 'Menambahkan Product baru: Tropisco Melon Small', '2026-08-20 06:00:23', '2026-08-20 06:00:23'),
(264, 10, 'updated', 'Product', 34, 'Memperbarui Product: Tropisco Melon Small', '2026-08-20 06:00:52', '2026-08-20 06:00:52'),
(265, 10, 'created', 'Product', 35, 'Menambahkan Product baru: Tropisco Original Big', '2026-08-20 06:03:04', '2026-08-20 06:03:04'),
(266, 10, 'created', 'Product', 36, 'Menambahkan Product baru: Tropisco Original Small', '2026-08-20 06:03:30', '2026-08-20 06:03:30'),
(267, 10, 'updated', 'Product', 36, 'Memperbarui Product: Tropisco Original Small', '2026-08-20 06:03:40', '2026-08-20 06:03:40'),
(268, 10, 'created', 'Product', 37, 'Menambahkan Product baru: Tropisco Melon Big', '2026-08-20 06:04:14', '2026-08-20 06:04:14'),
(269, 10, 'updated', 'Product', 37, 'Memperbarui Product: Tropisco Melon Big', '2026-08-20 06:04:49', '2026-08-20 06:04:49'),
(270, 10, 'created', 'Product', 38, 'Menambahkan Product baru: Tropisco Brown Sugar Small', '2026-08-20 06:06:57', '2026-08-20 06:06:57'),
(271, 10, 'updated', 'Product', 38, 'Memperbarui Product: Tropisco Brown Sugar Small', '2026-08-20 06:07:25', '2026-08-20 06:07:25'),
(272, 10, 'updated', 'Product', 31, 'Memperbarui Product: Tropisco Big Brown Sugar', '2026-08-20 06:07:45', '2026-08-20 06:07:45'),
(273, NULL, 'created', 'User', 53, 'Menambahkan User baru: ANI\'MATUL FARIDA', '2026-08-20 06:12:01', '2026-08-20 06:12:01'),
(274, 53, 'updated', 'User', 53, 'Memperbarui User: ANI\'MATUL FARIDA', '2026-08-20 06:19:58', '2026-08-20 06:19:58'),
(275, 10, 'created', 'Product', 39, 'Menambahkan Product baru: Momoyo Strawberry Jasmine', '2026-08-20 06:21:33', '2026-08-20 06:21:33'),
(276, 10, 'created', 'Product', 40, 'Menambahkan Product baru: Momoyo Ice Cream Matcha', '2026-08-20 06:23:35', '2026-08-20 06:23:35'),
(277, 10, 'updated', 'Product', 40, 'Memperbarui Product: Momoyo Ice Cream Matcha', '2026-08-20 06:23:44', '2026-08-20 06:23:44'),
(278, 10, 'created', 'Product', 41, 'Menambahkan Product baru: Momoyo Ice Cream Vanilla', '2026-08-20 06:24:02', '2026-08-20 06:24:02'),
(279, 10, 'created', 'Product', 42, 'Menambahkan Product baru: Momoyo Ice Cream Coklat', '2026-08-20 06:24:20', '2026-08-20 06:24:20'),
(280, 10, 'updated', 'Product', 41, 'Memperbarui Product: Momoyo Ice Cream Vanilla', '2026-08-20 06:24:28', '2026-08-20 06:24:28'),
(281, 10, 'created', 'Product', 43, 'Menambahkan Product baru: Ice Cream Strawberry', '2026-08-20 06:27:31', '2026-08-20 06:27:31'),
(282, 10, 'created', 'Product', 44, 'Menambahkan Product baru: Ice Cream Matcha', '2026-08-20 06:27:51', '2026-08-20 06:27:51'),
(283, 10, 'created', 'Product', 45, 'Menambahkan Product baru: Lemon Black Tea', '2026-08-20 06:34:32', '2026-08-20 06:34:32'),
(284, 10, 'created', 'Product', 46, 'Menambahkan Product baru: Lemonnode', '2026-08-20 06:35:31', '2026-08-20 06:35:31'),
(285, 10, 'created', 'Product', 47, 'Menambahkan Product baru: Passion Crystal Boom', '2026-08-20 06:38:45', '2026-08-20 06:38:45'),
(286, NULL, 'created', 'User', 54, 'Menambahkan User baru: Anis Resheta', '2026-08-20 06:48:05', '2026-08-20 06:48:05'),
(287, 10, 'created', 'Product', 48, 'Menambahkan Product baru: Nestle Lemonade', '2026-08-20 06:52:29', '2026-08-20 06:52:29'),
(288, 10, 'created', 'Product', 49, 'Menambahkan Product baru: Nestle Milo', '2026-08-20 06:54:49', '2026-08-20 06:54:49'),
(289, 10, 'updated', 'Product', 48, 'Memperbarui Product: Nestle Lemonade', '2026-08-20 06:55:20', '2026-08-20 06:55:20'),
(290, 10, 'updated', 'Product', 49, 'Memperbarui Product: Nestle Milo', '2026-08-20 06:55:35', '2026-08-20 06:55:35'),
(291, 10, 'created', 'Product', 50, 'Menambahkan Product baru: Nescafe Caffe Latte Normal', '2026-08-20 06:57:02', '2026-08-20 06:57:02'),
(292, 10, 'updated', 'Product', 50, 'Memperbarui Product: Nescafe Caffe Latte Normal', '2026-08-20 06:57:16', '2026-08-20 06:57:16'),
(293, 10, 'created', 'Product', 51, 'Menambahkan Product baru: Nescafe Caffe Latte Strong', '2026-08-20 06:58:05', '2026-08-20 06:58:05'),
(294, 10, 'updated', 'Product', 48, 'Memperbarui Product: Nestle Lemonade', '2026-08-20 06:58:25', '2026-08-20 06:58:25'),
(295, 10, 'created', 'Product', 52, 'Menambahkan Product baru: Nestle Lemon Tea', '2026-08-20 07:00:12', '2026-08-20 07:00:12'),
(296, 10, 'created', 'Product', 53, 'Menambahkan Product baru: Ayam Penyet', '2026-08-20 07:04:13', '2026-08-20 07:04:13'),
(297, 10, 'updated', 'Product', 53, 'Memperbarui Product: Ayam Penyet', '2026-08-20 07:06:16', '2026-08-20 07:06:16'),
(298, 10, 'created', 'Product', 54, 'Menambahkan Product baru: Lele Penyet', '2026-08-20 07:08:07', '2026-08-20 07:08:07'),
(299, 10, 'created', 'Product', 55, 'Menambahkan Product baru: Lele', '2026-08-20 07:09:07', '2026-08-20 07:09:07'),
(300, NULL, 'created', 'User', 55, 'Menambahkan User baru: Queensya meyla Meyla', '2026-08-20 07:15:54', '2026-08-20 07:15:54'),
(301, 10, 'created', 'Product', 56, 'Menambahkan Product baru: Ayam Penyet', '2026-08-20 07:16:13', '2026-08-20 07:16:13'),
(302, 10, 'created', 'Product', 57, 'Menambahkan Product baru: Nasi Ayam Penyet + Es Teh', '2026-08-20 07:19:26', '2026-08-20 07:19:26'),
(303, NULL, 'created', 'User', 56, 'Menambahkan User baru: Zulvia Khoirina', '2026-08-20 07:24:34', '2026-08-20 07:24:34'),
(304, 28, 'updated', 'User', 28, 'Memperbarui User: Zananaurulfajri', '2026-08-20 07:25:15', '2026-08-20 07:25:15'),
(305, NULL, 'created', 'User', 57, 'Menambahkan User baru: Lailatul Mubarokah', '2026-08-20 07:52:58', '2026-08-20 07:52:58'),
(306, NULL, 'created', 'User', 58, 'Menambahkan User baru: Soleh Efendi', '2026-08-20 08:05:54', '2026-08-20 08:05:54'),
(307, NULL, 'created', 'User', 59, 'Menambahkan User baru: tiaraa araaa', '2026-08-20 08:14:25', '2026-08-20 08:14:25'),
(308, NULL, 'created', 'User', 60, 'Menambahkan User baru: khariratul istiqlaliyah', '2026-08-20 08:18:07', '2026-08-20 08:18:07'),
(309, NULL, 'created', 'User', 61, 'Menambahkan User baru: Heri Redmi 12', '2026-08-20 08:18:53', '2026-08-20 08:18:53'),
(310, 60, 'updated', 'User', 60, 'Memperbarui User: khariratul istiqlaliyah', '2026-08-20 08:23:23', '2026-08-20 08:23:23'),
(311, 48, 'updated', 'User', 48, 'Memperbarui User: siti aniyah', '2026-08-20 08:24:26', '2026-08-20 08:24:26'),
(312, NULL, 'created', 'User', 62, 'Menambahkan User baru: muhammad fuad Hanif', '2026-08-20 08:31:22', '2026-08-20 08:31:22'),
(313, 62, 'updated', 'User', 62, 'Memperbarui User: muhammad fuad Hanif', '2026-08-20 08:32:18', '2026-08-20 08:32:18'),
(314, NULL, 'created', 'User', 63, 'Menambahkan User baru: Nimatus sholihah', '2026-08-20 08:41:05', '2026-08-20 08:41:05'),
(315, 58, 'updated', 'User', 58, 'Memperbarui User: Soleh Efendi', '2026-08-20 08:42:12', '2026-08-20 08:42:12'),
(316, NULL, 'created', 'User', 64, 'Menambahkan User baru: ACHMAD JUNAIDI', '2026-08-20 08:42:16', '2026-08-20 08:42:16'),
(317, NULL, 'created', 'User', 65, 'Menambahkan User baru: Miratul Kasanah', '2026-08-20 08:42:24', '2026-08-20 08:42:24'),
(318, 64, 'updated', 'User', 64, 'Memperbarui User: ACHMAD JUNAIDI', '2026-08-20 08:43:20', '2026-08-20 08:43:20'),
(319, NULL, 'created', 'User', 66, 'Menambahkan User baru: Achmad Junaidi', '2026-08-20 08:43:49', '2026-08-20 08:43:49'),
(320, 66, 'updated', 'User', 66, 'Memperbarui User: Achmad Junaidi', '2026-08-20 08:44:32', '2026-08-20 08:44:32'),
(321, NULL, 'created', 'User', 67, 'Menambahkan User baru: Tutus Emy', '2026-08-20 08:49:38', '2026-08-20 08:49:38'),
(322, NULL, 'created', 'User', 68, 'Menambahkan User baru: Miratus Sholihah', '2026-08-20 08:53:36', '2026-08-20 08:53:36'),
(323, 68, 'updated', 'User', 68, 'Memperbarui User: Miratus Sholihah', '2026-08-20 08:54:51', '2026-08-20 08:54:51'),
(324, NULL, 'created', 'User', 69, 'Menambahkan User baru: Yasmin Latifatus', '2026-08-20 08:56:07', '2026-08-20 08:56:07'),
(325, 67, 'updated', 'User', 67, 'Memperbarui User: Tutus Emy', '2026-08-20 09:01:46', '2026-08-20 09:01:46'),
(326, NULL, 'created', 'User', 70, 'Menambahkan User baru: Isah Waidah', '2026-08-20 09:04:28', '2026-08-20 09:04:28'),
(327, NULL, 'created', 'User', 71, 'Menambahkan User baru: Sri rahayu', '2026-08-20 09:08:41', '2026-08-20 09:08:41'),
(328, 71, 'updated', 'User', 71, 'Memperbarui User: Sri rahayu', '2026-08-20 09:10:35', '2026-08-20 09:10:35'),
(329, 71, 'updated', 'User', 71, 'Memperbarui User: Sri rahayu', '2026-08-20 09:11:41', '2026-08-20 09:11:41'),
(330, NULL, 'created', 'User', 72, 'Menambahkan User baru: Binti Kholifah', '2026-08-20 09:12:33', '2026-08-20 09:12:33'),
(331, NULL, 'created', 'User', 73, 'Menambahkan User baru: Ika Zahwa', '2026-08-20 09:13:49', '2026-08-20 09:13:49'),
(332, NULL, 'created', 'User', 74, 'Menambahkan User baru: yohana wijayanti', '2026-08-20 09:13:51', '2026-08-20 09:13:51'),
(333, 74, 'updated', 'User', 74, 'Memperbarui User: yohana wijayanti', '2026-08-20 09:15:26', '2026-08-20 09:15:26'),
(334, NULL, 'created', 'User', 75, 'Menambahkan User baru: Naimatul Masruroh', '2026-08-20 09:30:40', '2026-08-20 09:30:40'),
(335, 66, 'updated', 'User', 66, 'Memperbarui User: Achmad Junaidi', '2026-08-20 09:33:17', '2026-08-20 09:33:17'),
(336, NULL, 'created', 'User', 76, 'Menambahkan User baru: Faizatur robiatil Adawiyah', '2026-08-20 09:36:11', '2026-08-20 09:36:11'),
(337, NULL, 'created', 'User', 77, 'Menambahkan User baru: Siti Maulidiyah', '2026-08-20 09:40:23', '2026-08-20 09:40:23'),
(338, NULL, 'created', 'User', 78, 'Menambahkan User baru: ilma ilmariza', '2026-08-20 09:43:42', '2026-08-20 09:43:42'),
(339, 78, 'updated', 'User', 78, 'Memperbarui User: ilma ilmariza', '2026-08-20 09:46:33', '2026-08-20 09:46:33'),
(340, NULL, 'created', 'User', 79, 'Menambahkan User baru: Sulistiyaningsih', '2026-08-20 09:47:05', '2026-08-20 09:47:05'),
(341, NULL, 'created', 'User', 80, 'Menambahkan User baru: Siti Aslikah', '2026-08-20 09:49:12', '2026-08-20 09:49:12'),
(342, 2, 'deleted', 'User', 17, 'Menghapus User: jsp.learningeducation', '2026-08-20 09:50:23', '2026-08-20 09:50:23'),
(343, 2, 'deleted', 'User', 18, 'Menghapus User: muhammad steven', '2026-08-20 09:50:28', '2026-08-20 09:50:28'),
(344, 78, 'updated', 'User', 78, 'Memperbarui User: ilma ilmariza', '2026-08-20 09:51:48', '2026-08-20 09:51:48'),
(345, NULL, 'created', 'User', 81, 'Menambahkan User baru: muhammad andra', '2026-08-20 09:54:54', '2026-08-20 09:54:54'),
(346, 81, 'updated', 'User', 81, 'Memperbarui User: muhammad andra', '2026-08-20 09:55:49', '2026-08-20 09:55:49'),
(347, NULL, 'created', 'User', 82, 'Menambahkan User baru: DWI RATNASARI', '2026-08-20 09:58:11', '2026-08-20 09:58:11'),
(348, 81, 'created', 'Order', 11, 'Menambahkan Order baru: 11', '2026-08-20 09:58:15', '2026-08-20 09:58:15'),
(349, 81, 'updated', 'Product', 7, 'Memperbarui Product: DIMSUM ORIGINAL isi 6', '2026-08-20 09:58:15', '2026-08-20 09:58:15'),
(350, 81, 'updated', 'Product', 7, 'Memperbarui Product: DIMSUM ORIGINAL isi 6', '2026-08-20 09:58:15', '2026-08-20 09:58:15'),
(351, 81, 'updated', 'Product', 8, 'Memperbarui Product: Dimsum mentai spicy isi 6', '2026-08-20 09:58:15', '2026-08-20 09:58:15'),
(352, 81, 'updated', 'Product', 8, 'Memperbarui Product: Dimsum mentai spicy isi 6', '2026-08-20 09:58:15', '2026-08-20 09:58:15'),
(353, 81, 'updated', 'Order', 11, 'Memperbarui Order: 11', '2026-08-20 09:58:15', '2026-08-20 09:58:15'),
(354, NULL, 'created', 'User', 83, 'Menambahkan User baru: Arninda', '2026-08-20 10:04:50', '2026-08-20 10:04:50'),
(355, NULL, 'created', 'User', 84, 'Menambahkan User baru: Prasetyo Saputro', '2026-08-20 10:34:08', '2026-08-20 10:34:08'),
(356, NULL, 'created', 'User', 85, 'Menambahkan User baru: Siti Mariyam', '2026-08-20 10:50:45', '2026-08-20 10:50:45'),
(357, NULL, 'created', 'User', 86, 'Menambahkan User baru: baleendahngunut 01', '2026-08-20 11:02:08', '2026-08-20 11:02:08'),
(358, 86, 'updated', 'User', 86, 'Memperbarui User: baleendahngunut 01', '2026-08-20 11:08:56', '2026-08-20 11:08:56'),
(359, NULL, 'created', 'User', 87, 'Menambahkan User baru: Siti Rofiah', '2026-08-20 11:10:16', '2026-08-20 11:10:16'),
(360, 87, 'updated', 'User', 87, 'Memperbarui User: Siti Rofiah', '2026-08-20 11:13:02', '2026-08-20 11:13:02'),
(361, 87, 'updated', 'User', 87, 'Memperbarui User: Siti Rofiah', '2026-08-20 11:13:41', '2026-08-20 11:13:41'),
(362, 65, 'updated', 'User', 65, 'Memperbarui User: Miratul Kasanah', '2026-08-20 11:16:44', '2026-08-20 11:16:44'),
(363, NULL, 'created', 'User', 88, 'Menambahkan User baru: Atik Robaniyah', '2026-08-20 11:40:06', '2026-08-20 11:40:06'),
(364, NULL, 'created', 'User', 89, 'Menambahkan User baru: Arr Riyadi (Arik Puspita Sari)', '2026-08-20 11:41:55', '2026-08-20 11:41:55'),
(365, NULL, 'created', 'User', 90, 'Menambahkan User baru: Atik Robaniyah', '2026-08-20 11:44:15', '2026-08-20 11:44:15'),
(366, 33, 'updated', 'User', 33, 'Memperbarui User: Ovi Novia', '2026-08-20 11:46:37', '2026-08-20 11:46:37'),
(367, NULL, 'created', 'User', 91, 'Menambahkan User baru: Nurul Malikah', '2026-08-20 12:00:46', '2026-08-20 12:00:46'),
(368, NULL, 'created', 'User', 92, 'Menambahkan User baru: Helton Farihal', '2026-08-20 12:01:34', '2026-08-20 12:01:34'),
(369, NULL, 'created', 'User', 93, 'Menambahkan User baru: Vera Patika', '2026-08-20 12:15:25', '2026-08-20 12:15:25'),
(370, NULL, 'created', 'User', 94, 'Menambahkan User baru: warung nasi cokot', '2026-08-20 12:16:17', '2026-08-20 12:16:17'),
(371, 94, 'updated', 'User', 94, 'Memperbarui User: warung nasi cokot', '2026-08-20 12:19:20', '2026-08-20 12:19:20'),
(372, NULL, 'created', 'User', 95, 'Menambahkan User baru: Alfista', '2026-08-20 12:26:37', '2026-08-20 12:26:37'),
(373, NULL, 'created', 'User', 96, 'Menambahkan User baru: Siti Nur Azizah', '2026-08-20 12:30:41', '2026-08-20 12:30:41'),
(374, NULL, 'created', 'User', 97, 'Menambahkan User baru: Rofi\'atun Mukaromah', '2026-08-20 12:52:44', '2026-08-20 12:52:44'),
(375, NULL, 'created', 'User', 98, 'Menambahkan User baru: aldo kris', '2026-08-20 12:52:56', '2026-08-20 12:52:56'),
(376, 83, 'updated', 'User', 83, 'Memperbarui User: Arninda', '2026-08-20 12:54:51', '2026-08-20 12:54:51'),
(377, 83, 'created', 'Order', 12, 'Menambahkan Order baru: 12', '2026-08-20 12:54:56', '2026-08-20 12:54:56'),
(378, 83, 'updated', 'Product', 9, 'Memperbarui Product: Mie Suit', '2026-08-20 12:54:56', '2026-08-20 12:54:56'),
(379, 83, 'updated', 'Product', 9, 'Memperbarui Product: Mie Suit', '2026-08-20 12:54:56', '2026-08-20 12:54:56'),
(380, 83, 'updated', 'Order', 12, 'Memperbarui Order: 12', '2026-08-20 12:54:56', '2026-08-20 12:54:56'),
(381, 83, 'updated', 'Order', 12, 'Memperbarui Order: 12', '2026-08-20 12:55:54', '2026-08-20 12:55:54'),
(382, 83, 'updated', 'Product', 9, 'Memperbarui Product: Mie Suit', '2026-08-20 12:55:54', '2026-08-20 12:55:54'),
(383, 83, 'updated', 'Product', 9, 'Memperbarui Product: Mie Suit', '2026-08-20 12:55:54', '2026-08-20 12:55:54'),
(384, NULL, 'created', 'User', 99, 'Menambahkan User baru: NurinLatif Azizah', '2026-08-20 12:57:09', '2026-08-20 12:57:09'),
(385, 99, 'updated', 'User', 99, 'Memperbarui User: NurinLatif Azizah', '2026-08-20 13:01:52', '2026-08-20 13:01:52'),
(386, 99, 'created', 'Order', 13, 'Menambahkan Order baru: 13', '2026-08-20 13:01:58', '2026-08-20 13:01:58'),
(387, 99, 'updated', 'Product', 7, 'Memperbarui Product: DIMSUM ORIGINAL isi 6', '2026-08-20 13:01:58', '2026-08-20 13:01:58'),
(388, 99, 'updated', 'Product', 7, 'Memperbarui Product: DIMSUM ORIGINAL isi 6', '2026-08-20 13:01:58', '2026-08-20 13:01:58'),
(389, 99, 'updated', 'Order', 13, 'Memperbarui Order: 13', '2026-08-20 13:01:58', '2026-08-20 13:01:58'),
(390, 99, 'created', 'Order', 14, 'Menambahkan Order baru: 14', '2026-08-20 13:03:45', '2026-08-20 13:03:45'),
(391, 99, 'updated', 'Product', 9, 'Memperbarui Product: Mie Suit', '2026-08-20 13:03:45', '2026-08-20 13:03:45'),
(392, 99, 'updated', 'Product', 9, 'Memperbarui Product: Mie Suit', '2026-08-20 13:03:45', '2026-08-20 13:03:45'),
(393, 99, 'updated', 'Order', 14, 'Memperbarui Order: 14', '2026-08-20 13:03:45', '2026-08-20 13:03:45'),
(394, 99, 'updated', 'Order', 13, 'Memperbarui Order: 13', '2026-08-20 13:04:02', '2026-08-20 13:04:02'),
(395, 99, 'updated', 'Product', 7, 'Memperbarui Product: DIMSUM ORIGINAL isi 6', '2026-08-20 13:04:02', '2026-08-20 13:04:02'),
(396, 99, 'updated', 'Product', 7, 'Memperbarui Product: DIMSUM ORIGINAL isi 6', '2026-08-20 13:04:02', '2026-08-20 13:04:02'),
(397, 99, 'updated', 'Order', 14, 'Memperbarui Order: 14', '2026-08-20 13:04:24', '2026-08-20 13:04:24'),
(398, 99, 'updated', 'Product', 9, 'Memperbarui Product: Mie Suit', '2026-08-20 13:04:24', '2026-08-20 13:04:24'),
(399, 99, 'updated', 'Product', 9, 'Memperbarui Product: Mie Suit', '2026-08-20 13:04:24', '2026-08-20 13:04:24'),
(400, NULL, 'created', 'User', 100, 'Menambahkan User baru: Nur Arsyadan A', '2026-08-20 13:07:16', '2026-08-20 13:07:16'),
(401, 100, 'updated', 'User', 100, 'Memperbarui User: Nur Arsyadan A', '2026-08-20 13:10:13', '2026-08-20 13:10:13'),
(402, 100, 'created', 'Order', 15, 'Menambahkan Order baru: 15', '2026-08-20 13:10:55', '2026-08-20 13:10:55'),
(403, 100, 'updated', 'Product', 16, 'Memperbarui Product: Bakso Sapi Halus', '2026-08-20 13:10:55', '2026-08-20 13:10:55'),
(404, 100, 'updated', 'Product', 16, 'Memperbarui Product: Bakso Sapi Halus', '2026-08-20 13:10:55', '2026-08-20 13:10:55'),
(405, 100, 'updated', 'Order', 15, 'Memperbarui Order: 15', '2026-08-20 13:10:55', '2026-08-20 13:10:55'),
(406, NULL, 'created', 'User', 101, 'Menambahkan User baru: NAIMATUL FAUZIYAH', '2026-08-20 13:12:03', '2026-08-20 13:12:03'),
(407, 101, 'updated', 'User', 101, 'Memperbarui User: NAIMATUL FAUZIYAH', '2026-08-20 13:13:22', '2026-08-20 13:13:22'),
(408, 100, 'updated', 'Order', 15, 'Memperbarui Order: 15', '2026-08-20 13:14:03', '2026-08-20 13:14:03'),
(409, NULL, 'created', 'User', 102, 'Menambahkan User baru: Zidni Ilma', '2026-08-20 13:17:43', '2026-08-20 13:17:43'),
(410, 102, 'updated', 'User', 102, 'Memperbarui User: Zidni Ilma', '2026-08-20 13:24:24', '2026-08-20 13:24:24'),
(411, 75, 'updated', 'User', 75, 'Memperbarui User: Naimatul Masruroh', '2026-08-20 13:34:52', '2026-08-20 13:34:52'),
(412, 75, 'created', 'Order', 16, 'Menambahkan Order baru: 16', '2026-08-20 13:35:59', '2026-08-20 13:35:59'),
(413, 75, 'updated', 'Product', 10, 'Memperbarui Product: Mie Hompimpa', '2026-08-20 13:35:59', '2026-08-20 13:35:59'),
(414, 75, 'updated', 'Product', 10, 'Memperbarui Product: Mie Hompimpa', '2026-08-20 13:35:59', '2026-08-20 13:35:59'),
(415, 75, 'updated', 'Order', 16, 'Memperbarui Order: 16', '2026-08-20 13:35:59', '2026-08-20 13:35:59'),
(416, 75, 'updated', 'Order', 16, 'Memperbarui Order: 16', '2026-08-20 13:36:23', '2026-08-20 13:36:23'),
(417, 75, 'updated', 'Product', 10, 'Memperbarui Product: Mie Hompimpa', '2026-08-20 13:36:23', '2026-08-20 13:36:23'),
(418, 75, 'updated', 'Product', 10, 'Memperbarui Product: Mie Hompimpa', '2026-08-20 13:36:23', '2026-08-20 13:36:23'),
(419, NULL, 'created', 'User', 103, 'Menambahkan User baru: Zairina Amalia', '2026-08-20 14:27:21', '2026-08-20 14:27:21'),
(420, NULL, 'created', 'User', 104, 'Menambahkan User baru: Muhtarom Tarom', '2026-08-20 14:30:39', '2026-08-20 14:30:39'),
(421, 39, 'created', 'Order', 17, 'Menambahkan Order baru: 17', '2026-08-20 15:11:48', '2026-08-20 15:11:48'),
(422, 39, 'updated', 'Product', 20, 'Memperbarui Product: Nasi Goreng cikrak \"OGES KANE\"', '2026-08-20 15:11:48', '2026-08-20 15:11:48');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `model_type`, `model_id`, `description`, `created_at`, `updated_at`) VALUES
(423, 39, 'updated', 'Product', 20, 'Memperbarui Product: Nasi Goreng cikrak \"OGES KANE\"', '2026-08-20 15:11:48', '2026-08-20 15:11:48'),
(424, 39, 'updated', 'Order', 17, 'Memperbarui Order: 17', '2026-08-20 15:11:48', '2026-08-20 15:11:48'),
(425, NULL, 'created', 'User', 105, 'Menambahkan User baru: bank one', '2026-08-20 15:15:55', '2026-08-20 15:15:55'),
(426, 39, 'updated', 'Order', 17, 'Memperbarui Order: 17', '2026-08-20 15:18:16', '2026-08-20 15:18:16'),
(427, 102, 'updated', 'User', 102, 'Memperbarui User: Zidni Ilma', '2026-08-20 15:20:59', '2026-08-20 15:20:59'),
(428, 39, 'updated', 'User', 39, 'Memperbarui User: nana kristina', '2026-08-20 15:40:17', '2026-08-20 15:40:17'),
(429, 39, 'created', 'Order', 18, 'Menambahkan Order baru: 18', '2026-08-20 15:42:07', '2026-08-20 15:42:07'),
(430, 39, 'updated', 'Product', 20, 'Memperbarui Product: Nasi Goreng cikrak \"OGES KANE\"', '2026-08-20 15:42:07', '2026-08-20 15:42:07'),
(431, 39, 'updated', 'Product', 20, 'Memperbarui Product: Nasi Goreng cikrak \"OGES KANE\"', '2026-08-20 15:42:07', '2026-08-20 15:42:07'),
(432, 39, 'updated', 'Order', 18, 'Memperbarui Order: 18', '2026-08-20 15:42:07', '2026-08-20 15:42:07'),
(433, 39, 'updated', 'Order', 18, 'Memperbarui Order: 18', '2026-08-20 15:46:58', '2026-08-20 15:46:58'),
(434, NULL, 'created', 'User', 106, 'Menambahkan User baru: makinun aminun', '2026-08-20 15:57:47', '2026-08-20 15:57:47'),
(435, NULL, 'created', 'User', 107, 'Menambahkan User baru: Fitrin dwi norfadilah', '2026-08-20 15:58:10', '2026-08-20 15:58:10'),
(436, 106, 'updated', 'User', 106, 'Memperbarui User: makinun aminun', '2026-08-20 15:59:58', '2026-08-20 15:59:58'),
(437, 107, 'updated', 'User', 107, 'Memperbarui User: Fitrin dwi norfadilah', '2026-08-20 16:05:37', '2026-08-20 16:05:37'),
(438, 107, 'updated', 'User', 107, 'Memperbarui User: Fitrin dwi norfadilah', '2026-08-20 16:07:25', '2026-08-20 16:07:25'),
(439, 107, 'created', 'Order', 19, 'Menambahkan Order baru: 19', '2026-08-20 16:10:33', '2026-08-20 16:10:33'),
(440, 107, 'updated', 'Product', 11, 'Memperbarui Product: Mie Gacoan', '2026-08-20 16:10:33', '2026-08-20 16:10:33'),
(441, 107, 'updated', 'Product', 11, 'Memperbarui Product: Mie Gacoan', '2026-08-20 16:10:33', '2026-08-20 16:10:33'),
(442, 107, 'updated', 'Order', 19, 'Memperbarui Order: 19', '2026-08-20 16:10:33', '2026-08-20 16:10:33'),
(443, 107, 'created', 'Order', 20, 'Menambahkan Order baru: 20', '2026-08-20 16:10:33', '2026-08-20 16:10:33'),
(444, 107, 'updated', 'Product', 48, 'Memperbarui Product: Nestle Lemonade', '2026-08-20 16:10:33', '2026-08-20 16:10:33'),
(445, 107, 'updated', 'Product', 48, 'Memperbarui Product: Nestle Lemonade', '2026-08-20 16:10:33', '2026-08-20 16:10:33'),
(446, 107, 'updated', 'Order', 20, 'Memperbarui Order: 20', '2026-08-20 16:10:34', '2026-08-20 16:10:34'),
(447, NULL, 'created', 'User', 108, 'Menambahkan User baru: instagram123 aa', '2026-08-20 16:19:06', '2026-08-20 16:19:06'),
(448, NULL, 'created', 'User', 109, 'Menambahkan User baru: Ima andriyani', '2026-08-20 16:36:41', '2026-08-20 16:36:41'),
(449, NULL, 'created', 'User', 110, 'Menambahkan User baru: Zi Dan', '2026-08-20 16:37:42', '2026-08-20 16:37:42'),
(450, 109, 'updated', 'User', 109, 'Memperbarui User: Ima andriyani', '2026-08-20 16:40:31', '2026-08-20 16:40:31'),
(451, 110, 'updated', 'User', 110, 'Memperbarui User: Zi Dan', '2026-08-20 16:41:22', '2026-08-20 16:41:22'),
(452, 110, 'updated', 'User', 110, 'Memperbarui User: Zi Dan', '2026-08-20 16:42:39', '2026-08-20 16:42:39'),
(453, 110, 'created', 'Order', 21, 'Menambahkan Order baru: 21', '2026-08-20 16:46:24', '2026-08-20 16:46:24'),
(454, 110, 'updated', 'Product', 19, 'Memperbarui Product: Mie Ayam', '2026-08-20 16:46:24', '2026-08-20 16:46:24'),
(455, 110, 'updated', 'Product', 19, 'Memperbarui Product: Mie Ayam', '2026-08-20 16:46:24', '2026-08-20 16:46:24'),
(456, 110, 'updated', 'Order', 21, 'Memperbarui Order: 21', '2026-08-20 16:46:24', '2026-08-20 16:46:24'),
(457, 110, 'updated', 'Order', 21, 'Memperbarui Order: 21', '2026-08-20 16:49:07', '2026-08-20 16:49:07'),
(458, 110, 'updated', 'Order', 21, 'Memperbarui Order: 21', '2026-08-20 16:49:44', '2026-08-20 16:49:44'),
(459, NULL, 'created', 'User', 111, 'Menambahkan User baru: Erli Retna', '2026-08-20 16:54:09', '2026-08-20 16:54:09'),
(460, 111, 'updated', 'User', 111, 'Memperbarui User: Erli Retna', '2026-08-20 17:02:42', '2026-08-20 17:02:42'),
(461, 111, 'updated', 'User', 111, 'Memperbarui User: Erli Retnawati', '2026-08-20 17:03:16', '2026-08-20 17:03:16'),
(462, NULL, 'created', 'User', 112, 'Menambahkan User baru: Nila Anisa', '2026-08-20 17:06:45', '2026-08-20 17:06:45'),
(463, 112, 'updated', 'User', 112, 'Memperbarui User: Nila Anisa', '2026-08-20 17:10:27', '2026-08-20 17:10:27'),
(464, NULL, 'created', 'User', 113, 'Menambahkan User baru: arsada mahyana', '2026-08-20 17:16:02', '2026-08-20 17:16:02'),
(465, NULL, 'created', 'User', 114, 'Menambahkan User baru: Mir\'atus S', '2026-08-20 17:21:41', '2026-08-20 17:21:41'),
(466, 51, 'updated', 'User', 51, 'Memperbarui User: Hayati Mustofa', '2026-08-20 17:26:42', '2026-08-20 17:26:42'),
(467, 114, 'updated', 'User', 114, 'Memperbarui User: Mir\'atus S', '2026-08-20 17:30:49', '2026-08-20 17:30:49'),
(468, 106, 'updated', 'User', 106, 'Memperbarui User: makinun aminun', '2026-08-20 17:34:46', '2026-08-20 17:34:46'),
(469, 10, 'updated', 'Order', 21, 'Memperbarui Order: 21', '2026-08-20 17:36:10', '2026-08-20 17:36:10'),
(470, 10, 'updated', 'Order', 19, 'Memperbarui Order: 19', '2026-08-20 17:36:35', '2026-08-20 17:36:35'),
(471, 10, 'updated', 'Order', 20, 'Memperbarui Order: 20', '2026-08-20 17:37:32', '2026-08-20 17:37:32'),
(472, 10, 'updated', 'Order', 18, 'Memperbarui Order: 18', '2026-08-20 17:37:34', '2026-08-20 17:37:34'),
(473, 10, 'updated', 'Order', 17, 'Memperbarui Order: 17', '2026-08-20 17:37:37', '2026-08-20 17:37:37'),
(474, 10, 'updated', 'Order', 15, 'Memperbarui Order: 15', '2026-08-20 17:37:40', '2026-08-20 17:37:40'),
(475, 10, 'updated', 'Order', 11, 'Memperbarui Order: 11', '2026-08-20 17:37:45', '2026-08-20 17:37:45'),
(476, 106, 'updated', 'User', 106, 'Memperbarui User: makinun aminun', '2026-08-20 17:38:04', '2026-08-20 17:38:04'),
(477, NULL, 'created', 'User', 115, 'Menambahkan User baru: Erni Susanti', '2026-08-20 18:51:41', '2026-08-20 18:51:41'),
(478, NULL, 'created', 'User', 116, 'Menambahkan User baru: Siswantodt Londodt', '2026-08-20 19:00:33', '2026-08-20 19:00:33'),
(479, NULL, 'created', 'User', 117, 'Menambahkan User baru: Ima Zulfa', '2026-08-20 19:26:11', '2026-08-20 19:26:11'),
(480, 117, 'updated', 'User', 117, 'Memperbarui User: Ima Zulfa', '2026-08-20 19:27:15', '2026-08-20 19:27:15'),
(481, 117, 'updated', 'User', 117, 'Memperbarui User: Ima Zulfa', '2026-08-20 19:29:59', '2026-08-20 19:29:59'),
(482, 48, 'updated', 'User', 48, 'Memperbarui User: siti aniyah', '2026-08-20 19:39:36', '2026-08-20 19:39:36'),
(483, NULL, 'created', 'User', 118, 'Menambahkan User baru: Endang Wahyuni', '2026-08-20 19:41:53', '2026-08-20 19:41:53'),
(484, NULL, 'created', 'User', 119, 'Menambahkan User baru: Englia Fathoni', '2026-08-20 19:42:07', '2026-08-20 19:42:07'),
(485, 118, 'updated', 'User', 118, 'Memperbarui User: Endang Wahyuni', '2026-08-20 19:48:15', '2026-08-20 19:48:15'),
(486, NULL, 'created', 'User', 120, 'Menambahkan User baru: Umi Mahtum', '2026-08-20 19:49:59', '2026-08-20 19:49:59'),
(487, NULL, 'created', 'User', 121, 'Menambahkan User baru: 06. Daffa\' Safaraz', '2026-08-20 19:53:50', '2026-08-20 19:53:50'),
(488, NULL, 'created', 'User', 122, 'Menambahkan User baru: Cici Siswati', '2026-08-20 19:56:19', '2026-08-20 19:56:19'),
(489, 122, 'updated', 'User', 122, 'Memperbarui User: Cici Siswati', '2026-08-20 19:57:02', '2026-08-20 19:57:02'),
(490, NULL, 'created', 'User', 123, 'Menambahkan User baru: deske febrian18', '2026-08-20 19:57:34', '2026-08-20 19:57:34'),
(491, 122, 'updated', 'User', 122, 'Memperbarui User: Cici Siswati', '2026-08-20 19:59:32', '2026-08-20 19:59:32'),
(492, NULL, 'created', 'User', 124, 'Menambahkan User baru: noura ulfa', '2026-08-20 20:00:34', '2026-08-20 20:00:34'),
(493, 121, 'updated', 'User', 121, 'Memperbarui User: 06. Daffa\' Safaraz', '2026-08-20 20:01:00', '2026-08-20 20:01:00'),
(494, NULL, 'created', 'User', 125, 'Menambahkan User baru: Rohmah', '2026-08-20 20:06:37', '2026-08-20 20:06:37'),
(495, 123, 'updated', 'User', 123, 'Memperbarui User: deske febrian18', '2026-08-20 20:06:38', '2026-08-20 20:06:38'),
(496, 124, 'updated', 'User', 124, 'Memperbarui User: noura ulfa', '2026-08-20 20:06:55', '2026-08-20 20:06:55'),
(497, NULL, 'created', 'User', 126, 'Menambahkan User baru: RENDI NUROHMAN', '2026-08-20 20:11:32', '2026-08-20 20:11:32'),
(498, NULL, 'created', 'User', 127, 'Menambahkan User baru: Denti Febriyanti', '2026-08-20 20:11:37', '2026-08-20 20:11:37'),
(499, NULL, 'created', 'User', 128, 'Menambahkan User baru: Sabila Azka', '2026-08-20 20:14:00', '2026-08-20 20:14:00'),
(500, NULL, 'created', 'User', 129, 'Menambahkan User baru: Gus Dur', '2026-08-20 20:14:07', '2026-08-20 20:14:07'),
(501, NULL, 'created', 'User', 130, 'Menambahkan User baru: Hilwa Ayin', '2026-08-20 20:16:41', '2026-08-20 20:16:41'),
(502, NULL, 'created', 'User', 131, 'Menambahkan User baru: Agustina widayanti', '2026-08-20 20:17:13', '2026-08-20 20:17:13'),
(503, NULL, 'created', 'User', 132, 'Menambahkan User baru: Hadi Suyono', '2026-08-20 20:20:03', '2026-08-20 20:20:03'),
(504, NULL, 'created', 'User', 133, 'Menambahkan User baru: erma lianti', '2026-08-20 20:21:35', '2026-08-20 20:21:35'),
(505, 133, 'updated', 'User', 133, 'Memperbarui User: erma lianti', '2026-08-20 20:23:35', '2026-08-20 20:23:35'),
(506, 132, 'updated', 'User', 132, 'Memperbarui User: Hadi Suyono', '2026-08-20 20:25:07', '2026-08-20 20:25:07'),
(507, NULL, 'created', 'User', 134, 'Menambahkan User baru: Yunika anggi Hardini', '2026-08-20 20:26:06', '2026-08-20 20:26:06'),
(508, NULL, 'created', 'User', 135, 'Menambahkan User baru: Siti Chalimah', '2026-08-20 20:27:33', '2026-08-20 20:27:33'),
(509, 120, 'updated', 'User', 120, 'Memperbarui User: Umi Mahtum', '2026-08-20 20:28:46', '2026-08-20 20:28:46'),
(510, NULL, 'updated', 'User', 135, 'Memperbarui User: Siti Chalimah', '2026-08-20 20:29:53', '2026-08-20 20:29:53'),
(511, 135, 'updated', 'User', 135, 'Memperbarui User: Siti Chalimah', '2026-08-20 20:30:55', '2026-08-20 20:30:55'),
(512, NULL, 'created', 'User', 136, 'Menambahkan User baru: Aziiz Almashury', '2026-08-20 20:33:13', '2026-08-20 20:33:13'),
(513, NULL, 'created', 'User', 137, 'Menambahkan User baru: Yuhu Seblak', '2026-08-20 20:34:11', '2026-08-20 20:34:11'),
(514, 137, 'updated', 'User', 137, 'Memperbarui User: Yuhu Seblak', '2026-08-20 20:36:48', '2026-08-20 20:36:48'),
(515, 12, 'updated', 'Order', 21, 'Memperbarui Order: 21', '2026-08-20 20:38:11', '2026-08-20 20:38:11'),
(516, 12, 'updated', 'Order', 18, 'Memperbarui Order: 18', '2026-08-20 20:39:30', '2026-08-20 20:39:30'),
(517, NULL, 'created', 'User', 138, 'Menambahkan User baru: Nurhidayati Ima', '2026-08-20 20:39:35', '2026-08-20 20:39:35'),
(518, 12, 'updated', 'Order', 17, 'Memperbarui Order: 17', '2026-08-20 20:40:30', '2026-08-20 20:40:30'),
(519, NULL, 'created', 'User', 139, 'Menambahkan User baru: Choirya', '2026-08-20 20:41:16', '2026-08-20 20:41:16'),
(520, NULL, 'created', 'User', 140, 'Menambahkan User baru: Khudori Achmad', '2026-08-20 20:41:24', '2026-08-20 20:41:24'),
(521, NULL, 'created', 'User', 141, 'Menambahkan User baru: nana Aini', '2026-08-20 20:46:07', '2026-08-20 20:46:07'),
(522, NULL, 'created', 'User', 142, 'Menambahkan User baru: Mokh. Habibbullah', '2026-08-20 21:17:46', '2026-08-20 21:17:46'),
(523, NULL, 'created', 'User', 143, 'Menambahkan User baru: nashr Ahmad', '2026-08-20 21:18:34', '2026-08-20 21:18:34'),
(524, NULL, 'created', 'User', 144, 'Menambahkan User baru: Rafa elis', '2026-08-20 21:20:56', '2026-08-20 21:20:56'),
(525, NULL, 'created', 'User', 145, 'Menambahkan User baru: Sulukur Rosikhoh', '2026-08-20 21:23:01', '2026-08-20 21:23:01'),
(526, 143, 'updated', 'User', 143, 'Memperbarui User: nashr Ahmad', '2026-08-20 21:23:55', '2026-08-20 21:23:55'),
(527, 145, 'updated', 'User', 145, 'Memperbarui User: Sulukur Rosikhoh', '2026-08-20 21:25:04', '2026-08-20 21:25:04'),
(528, NULL, 'created', 'User', 146, 'Menambahkan User baru: Achmad Rifai', '2026-08-20 22:30:44', '2026-08-20 22:30:44'),
(529, NULL, 'created', 'User', 147, 'Menambahkan User baru: Endah Dwi', '2026-08-20 23:09:30', '2026-08-20 23:09:30'),
(530, NULL, 'updated', 'User', 123, 'Memperbarui User: deske febrian18', '2026-08-21 00:01:57', '2026-08-21 00:01:57'),
(531, NULL, 'created', 'User', 148, 'Menambahkan User baru: *', '2026-08-21 01:25:22', '2026-08-21 01:25:22'),
(532, NULL, 'created', 'Canteen', 20, 'Menambahkan Canteen baru: *', '2026-08-21 01:25:22', '2026-08-21 01:25:22'),
(533, NULL, 'created', 'User', 149, 'Menambahkan User baru: Katwanto Sag', '2026-08-21 04:00:56', '2026-08-21 04:00:56'),
(534, 149, 'updated', 'User', 149, 'Memperbarui User: Katwanto Sag', '2026-08-21 04:26:35', '2026-08-21 04:26:35'),
(535, NULL, 'created', 'User', 150, 'Menambahkan User baru: Mey Shinta', '2026-08-21 05:18:14', '2026-08-21 05:18:14'),
(536, 150, 'updated', 'User', 150, 'Memperbarui User: Mey Shinta', '2026-08-21 05:19:55', '2026-08-21 05:19:55'),
(537, NULL, 'created', 'User', 151, 'Menambahkan User baru: Purwanti Endang', '2026-08-21 05:20:46', '2026-08-21 05:20:46'),
(538, 151, 'updated', 'User', 151, 'Memperbarui User: Purwanti Endang', '2026-08-21 05:22:40', '2026-08-21 05:22:40'),
(539, NULL, 'created', 'User', 152, 'Menambahkan User baru: Sukodono Oke', '2026-08-21 06:01:11', '2026-08-21 06:01:11'),
(540, 152, 'updated', 'User', 152, 'Memperbarui User: Sukodono Oke', '2026-08-21 06:03:36', '2026-08-21 06:03:36'),
(541, NULL, 'created', 'User', 153, 'Menambahkan User baru: Azizah Kusriana', '2026-08-21 06:33:40', '2026-08-21 06:33:40'),
(542, 153, 'updated', 'User', 153, 'Memperbarui User: Azizah Kusriana', '2026-08-21 06:37:00', '2026-08-21 06:37:00'),
(543, NULL, 'created', 'User', 154, 'Menambahkan User baru: Siti Aliyah', '2026-08-21 08:13:14', '2026-08-21 08:13:14'),
(544, NULL, 'created', 'User', 155, 'Menambahkan User baru: Budi', '2026-08-21 08:33:22', '2026-08-21 08:33:22'),
(545, 155, 'updated', 'User', 155, 'Memperbarui User: Budi', '2026-08-21 08:34:55', '2026-08-21 08:34:55'),
(546, 155, 'updated', 'User', 155, 'Memperbarui User: Budi', '2026-08-21 08:39:01', '2026-08-21 08:39:01'),
(547, NULL, 'created', 'User', 156, 'Menambahkan User baru: Jamu Recma', '2026-08-21 09:02:08', '2026-08-21 09:02:08'),
(548, NULL, 'created', 'User', 157, 'Menambahkan User baru: Galang Alanna', '2026-08-21 09:06:35', '2026-08-21 09:06:35'),
(549, NULL, 'created', 'User', 158, 'Menambahkan User baru: Darul Huda', '2026-08-21 09:07:53', '2026-08-21 09:07:53'),
(550, 157, 'updated', 'User', 157, 'Memperbarui User: Galang Alanna', '2026-08-21 09:09:31', '2026-08-21 09:09:31'),
(551, NULL, 'created', 'User', 159, 'Menambahkan User baru: Sumali Nirnur', '2026-08-21 09:10:30', '2026-08-21 09:10:30'),
(552, 158, 'updated', 'User', 158, 'Memperbarui User: Darul Huda', '2026-08-21 09:11:18', '2026-08-21 09:11:18'),
(553, NULL, 'created', 'User', 160, 'Menambahkan User baru: aqin elghouts', '2026-08-21 09:12:58', '2026-08-21 09:12:58'),
(554, NULL, 'created', 'User', 161, 'Menambahkan User baru: MOH ZEN GULOJOWO', '2026-08-21 09:28:51', '2026-08-21 09:28:51'),
(555, 161, 'updated', 'User', 161, 'Memperbarui User: MOH ZEN GULOJOWO', '2026-08-21 09:30:06', '2026-08-21 09:30:06'),
(556, NULL, 'created', 'User', 162, 'Menambahkan User baru: Ananda Sabila', '2026-08-21 09:31:27', '2026-08-21 09:31:27'),
(557, 162, 'updated', 'User', 162, 'Memperbarui User: Ananda Sabila', '2026-08-21 09:40:01', '2026-08-21 09:40:01'),
(558, NULL, 'created', 'User', 163, 'Menambahkan User baru: Muhammad Muzaki', '2026-08-21 09:45:37', '2026-08-21 09:45:37'),
(559, NULL, 'created', 'User', 164, 'Menambahkan User baru: Khansa Aqilatul Azizah', '2026-08-21 09:48:12', '2026-08-21 09:48:12'),
(560, 164, 'updated', 'User', 164, 'Memperbarui User: Khansa Aqilatul Azizah', '2026-08-21 09:51:18', '2026-08-21 09:51:18'),
(561, NULL, 'created', 'User', 165, 'Menambahkan User baru: Calista Zahra', '2026-08-21 09:54:18', '2026-08-21 09:54:18'),
(562, 165, 'updated', 'User', 165, 'Memperbarui User: Calista Zahra', '2026-08-21 09:56:10', '2026-08-21 09:56:10'),
(563, 165, 'updated', 'User', 165, 'Memperbarui User: Calista Zahra', '2026-08-21 09:58:59', '2026-08-21 09:58:59'),
(564, NULL, 'created', 'User', 166, 'Menambahkan User baru: Raisa Balqis', '2026-08-21 10:03:33', '2026-08-21 10:03:33'),
(565, NULL, 'created', 'User', 167, 'Menambahkan User baru: Trenggalek Jaya', '2026-08-21 10:05:16', '2026-08-21 10:05:16'),
(566, 166, 'updated', 'User', 166, 'Memperbarui User: Raisa Balqis', '2026-08-21 10:08:33', '2026-08-21 10:08:33'),
(567, 167, 'updated', 'User', 167, 'Memperbarui User: Trenggalek Jaya', '2026-08-21 10:12:17', '2026-08-21 10:12:17'),
(568, NULL, 'created', 'User', 168, 'Menambahkan User baru: Arina manasikana', '2026-08-21 10:15:14', '2026-08-21 10:15:14'),
(569, NULL, 'created', 'User', 169, 'Menambahkan User baru: Nita Sri Wahyuni', '2026-08-21 10:19:37', '2026-08-21 10:19:37'),
(570, 169, 'updated', 'User', 169, 'Memperbarui User: Nita Sri Wahyuni', '2026-08-21 10:21:00', '2026-08-21 10:21:00'),
(571, 169, 'created', 'Order', 22, 'Menambahkan Order baru: 22', '2026-08-21 10:23:28', '2026-08-21 10:23:28'),
(572, 169, 'updated', 'Product', 9, 'Memperbarui Product: Mie Suit', '2026-08-21 10:23:28', '2026-08-21 10:23:28'),
(573, 169, 'updated', 'Product', 9, 'Memperbarui Product: Mie Suit', '2026-08-21 10:23:28', '2026-08-21 10:23:28'),
(574, 169, 'updated', 'Order', 22, 'Memperbarui Order: 22', '2026-08-21 10:23:28', '2026-08-21 10:23:28'),
(575, 169, 'updated', 'Order', 22, 'Memperbarui Order: 22', '2026-08-21 10:23:39', '2026-08-21 10:23:39'),
(576, 169, 'updated', 'Product', 9, 'Memperbarui Product: Mie Suit', '2026-08-21 10:23:39', '2026-08-21 10:23:39'),
(577, 169, 'updated', 'Product', 9, 'Memperbarui Product: Mie Suit', '2026-08-21 10:23:39', '2026-08-21 10:23:39'),
(578, NULL, 'created', 'User', 170, 'Menambahkan User baru: Lutfi Langgeng', '2026-08-21 10:25:12', '2026-08-21 10:25:12'),
(579, NULL, 'created', 'User', 171, 'Menambahkan User baru: Aan Himah', '2026-08-21 10:25:55', '2026-08-21 10:25:55'),
(580, 171, 'updated', 'User', 171, 'Memperbarui User: Aan Himah', '2026-08-21 10:28:31', '2026-08-21 10:28:31'),
(581, 171, 'created', 'Order', 23, 'Menambahkan Order baru: 23', '2026-08-21 10:30:13', '2026-08-21 10:30:13'),
(582, 171, 'updated', 'Product', 7, 'Memperbarui Product: DIMSUM ORIGINAL isi 6', '2026-08-21 10:30:13', '2026-08-21 10:30:13'),
(583, 171, 'updated', 'Product', 7, 'Memperbarui Product: DIMSUM ORIGINAL isi 6', '2026-08-21 10:30:13', '2026-08-21 10:30:13'),
(584, 171, 'updated', 'Order', 23, 'Memperbarui Order: 23', '2026-08-21 10:30:13', '2026-08-21 10:30:13'),
(585, 171, 'updated', 'Order', 23, 'Memperbarui Order: 23', '2026-08-21 10:30:27', '2026-08-21 10:30:27'),
(586, 171, 'updated', 'Product', 7, 'Memperbarui Product: DIMSUM ORIGINAL isi 6', '2026-08-21 10:30:27', '2026-08-21 10:30:27'),
(587, 171, 'updated', 'Product', 7, 'Memperbarui Product: DIMSUM ORIGINAL isi 6', '2026-08-21 10:30:27', '2026-08-21 10:30:27'),
(588, NULL, 'created', 'User', 172, 'Menambahkan User baru: Wahyudi Sucipto', '2026-08-21 10:48:43', '2026-08-21 10:48:43'),
(589, NULL, 'created', 'User', 173, 'Menambahkan User baru: Kholid Ridho', '2026-08-21 11:00:23', '2026-08-21 11:00:23'),
(590, NULL, 'created', 'User', 174, 'Menambahkan User baru: Nurulhani fatuzzahrok zahrok azhar', '2026-08-21 11:03:05', '2026-08-21 11:03:05'),
(591, NULL, 'created', 'User', 175, 'Menambahkan User baru: Nur Kolis', '2026-08-21 11:05:43', '2026-08-21 11:05:43'),
(592, 174, 'updated', 'User', 174, 'Memperbarui User: Nurulhani fatuzzahrok zahrok azhar', '2026-08-21 11:07:03', '2026-08-21 11:07:03'),
(593, NULL, 'created', 'User', 176, 'Menambahkan User baru: Sumadi Anto', '2026-08-21 11:11:25', '2026-08-21 11:11:25'),
(594, 176, 'updated', 'User', 176, 'Memperbarui User: Sumadi Anto', '2026-08-21 11:13:28', '2026-08-21 11:13:28'),
(595, NULL, 'created', 'User', 177, 'Menambahkan User baru: Endang Asturina', '2026-08-21 11:24:11', '2026-08-21 11:24:11'),
(596, NULL, 'created', 'User', 178, 'Menambahkan User baru: Umi Fadilah', '2026-08-21 11:28:49', '2026-08-21 11:28:49'),
(597, 178, 'updated', 'User', 178, 'Memperbarui User: Umi Fadilah', '2026-08-21 11:30:12', '2026-08-21 11:30:12'),
(598, 178, 'created', 'Order', 24, 'Menambahkan Order baru: 24', '2026-08-21 11:31:57', '2026-08-21 11:31:57'),
(599, 178, 'updated', 'Product', 11, 'Memperbarui Product: Mie Gacoan', '2026-08-21 11:31:57', '2026-08-21 11:31:57'),
(600, 178, 'updated', 'Product', 11, 'Memperbarui Product: Mie Gacoan', '2026-08-21 11:31:57', '2026-08-21 11:31:57'),
(601, 178, 'updated', 'Order', 24, 'Memperbarui Order: 24', '2026-08-21 11:31:57', '2026-08-21 11:31:57'),
(602, 178, 'updated', 'Order', 24, 'Memperbarui Order: 24', '2026-08-21 11:33:21', '2026-08-21 11:33:21'),
(603, 178, 'updated', 'Product', 11, 'Memperbarui Product: Mie Gacoan', '2026-08-21 11:33:21', '2026-08-21 11:33:21'),
(604, 178, 'updated', 'Product', 11, 'Memperbarui Product: Mie Gacoan', '2026-08-21 11:33:21', '2026-08-21 11:33:21'),
(605, NULL, 'created', 'User', 179, 'Menambahkan User baru: Imroatul Mufidah', '2026-08-21 11:44:40', '2026-08-21 11:44:40'),
(606, NULL, 'created', 'User', 180, 'Menambahkan User baru: Putris Tian', '2026-08-21 12:04:09', '2026-08-21 12:04:09'),
(607, 163, 'updated', 'User', 163, 'Memperbarui User: Muhammad Muzaki', '2026-08-21 12:05:02', '2026-08-21 12:05:02'),
(608, NULL, 'created', 'User', 181, 'Menambahkan User baru: zizi ajayyy', '2026-08-21 12:11:16', '2026-08-21 12:11:16'),
(609, NULL, 'created', 'User', 182, 'Menambahkan User baru: Vivo Y12s', '2026-08-21 12:14:49', '2026-08-21 12:14:49'),
(610, 182, 'updated', 'User', 182, 'Memperbarui User: KARUNIA CITRA AZAHRA', '2026-08-21 12:18:46', '2026-08-21 12:18:46'),
(611, 182, 'updated', 'User', 182, 'Memperbarui User: KARUNIA CITRA AZAHRA', '2026-08-21 12:19:36', '2026-08-21 12:19:36'),
(612, 182, 'updated', 'User', 182, 'Memperbarui User: KARUNIA CITRA AZAHRA', '2026-08-21 12:20:56', '2026-08-21 12:20:56'),
(613, NULL, 'created', 'User', 183, 'Menambahkan User baru: Sintia Baru', '2026-08-21 12:31:51', '2026-08-21 12:31:51'),
(614, NULL, 'created', 'User', 184, 'Menambahkan User baru: Lina Najah', '2026-08-21 12:32:31', '2026-08-21 12:32:31'),
(615, 183, 'updated', 'User', 183, 'Memperbarui User: Sintia Baru', '2026-08-21 12:34:51', '2026-08-21 12:34:51'),
(616, NULL, 'created', 'User', 185, 'Menambahkan User baru: gus pul', '2026-08-21 12:36:31', '2026-08-21 12:36:31'),
(617, 184, 'updated', 'User', 184, 'Memperbarui User: Lina Najah', '2026-08-21 12:39:55', '2026-08-21 12:39:55'),
(618, NULL, 'created', 'User', 186, 'Menambahkan User baru: Rania Nia', '2026-08-21 12:46:38', '2026-08-21 12:46:38'),
(619, 186, 'updated', 'User', 186, 'Memperbarui User: Rania Nia', '2026-08-21 12:49:28', '2026-08-21 12:49:28'),
(620, NULL, 'created', 'User', 187, 'Menambahkan User baru: Bitzz Kulbett', '2026-08-21 12:59:52', '2026-08-21 12:59:52'),
(621, NULL, 'created', 'User', 188, 'Menambahkan User baru: Nur Cahya', '2026-08-21 13:06:46', '2026-08-21 13:06:46'),
(622, NULL, 'created', 'User', 189, 'Menambahkan User baru: ALIN FITRIYAH', '2026-08-21 13:08:17', '2026-08-21 13:08:17'),
(623, 189, 'updated', 'User', 189, 'Memperbarui User: ALIN FITRIYAH', '2026-08-21 13:10:07', '2026-08-21 13:10:07'),
(624, NULL, 'created', 'User', 190, 'Menambahkan User baru: Najwa Ulya', '2026-08-21 13:17:30', '2026-08-21 13:17:30'),
(625, NULL, 'created', 'User', 191, 'Menambahkan User baru: Ria Azaria', '2026-08-21 13:18:19', '2026-08-21 13:18:19'),
(626, 190, 'updated', 'User', 190, 'Memperbarui User: Najwa Ulya', '2026-08-21 13:19:21', '2026-08-21 13:19:21'),
(627, 191, 'updated', 'User', 191, 'Memperbarui User: Ria Azaria', '2026-08-21 13:23:09', '2026-08-21 13:23:09'),
(628, NULL, 'created', 'User', 192, 'Menambahkan User baru: anakorang606 west', '2026-08-21 13:23:35', '2026-08-21 13:23:35'),
(629, NULL, 'created', 'User', 193, 'Menambahkan User baru: Sihe Wawaanajwa', '2026-08-21 13:26:14', '2026-08-21 13:26:14'),
(630, NULL, 'created', 'User', 194, 'Menambahkan User baru: Keylia Almahira', '2026-08-21 13:27:24', '2026-08-21 13:27:24'),
(631, 194, 'updated', 'User', 194, 'Memperbarui User: Keylia Almahira', '2026-08-21 13:31:38', '2026-08-21 13:31:38'),
(632, NULL, 'created', 'User', 195, 'Menambahkan User baru: sholikin mmdc', '2026-08-21 13:34:25', '2026-08-21 13:34:25'),
(633, NULL, 'created', 'User', 196, 'Menambahkan User baru: Firnan Diana', '2026-08-21 13:44:05', '2026-08-21 13:44:05'),
(634, NULL, 'created', 'User', 197, 'Menambahkan User baru: Rizka Naini', '2026-08-21 13:49:46', '2026-08-21 13:49:46'),
(635, NULL, 'created', 'User', 198, 'Menambahkan User baru: Lala Nabil', '2026-08-21 13:52:38', '2026-08-21 13:52:38'),
(636, NULL, 'created', 'User', 199, 'Menambahkan User baru: Nely_khusna Al-fauziyah', '2026-08-21 13:53:46', '2026-08-21 13:53:46'),
(637, NULL, 'created', 'User', 200, 'Menambahkan User baru: laelatus siami', '2026-08-21 13:55:25', '2026-08-21 13:55:25'),
(638, NULL, 'created', 'User', 201, 'Menambahkan User baru: Sun Ella', '2026-08-21 13:57:37', '2026-08-21 13:57:37'),
(639, NULL, 'created', 'User', 202, 'Menambahkan User baru: N. Cahya Azzahra', '2026-08-21 13:58:44', '2026-08-21 13:58:44'),
(640, 202, 'updated', 'User', 202, 'Memperbarui User: N. Cahya Azzahra', '2026-08-21 13:59:45', '2026-08-21 13:59:45'),
(641, NULL, 'created', 'User', 203, 'Menambahkan User baru: Mahmudiyah Utami', '2026-08-21 14:11:23', '2026-08-21 14:11:23'),
(642, 183, 'updated', 'User', 183, 'Memperbarui User: Sintia Baru', '2026-08-21 14:12:15', '2026-08-21 14:12:15'),
(643, 183, 'created', 'Order', 25, 'Menambahkan Order baru: 25', '2026-08-21 14:12:19', '2026-08-21 14:12:19'),
(644, 183, 'updated', 'Product', 8, 'Memperbarui Product: Dimsum mentai spicy isi 6', '2026-08-21 14:12:19', '2026-08-21 14:12:19'),
(645, 183, 'updated', 'Product', 8, 'Memperbarui Product: Dimsum mentai spicy isi 6', '2026-08-21 14:12:19', '2026-08-21 14:12:19'),
(646, 183, 'updated', 'Order', 25, 'Memperbarui Order: 25', '2026-08-21 14:12:19', '2026-08-21 14:12:19'),
(647, 183, 'updated', 'Order', 25, 'Memperbarui Order: 25', '2026-08-21 14:12:28', '2026-08-21 14:12:28'),
(648, 183, 'updated', 'Product', 8, 'Memperbarui Product: Dimsum mentai spicy isi 6', '2026-08-21 14:12:28', '2026-08-21 14:12:28'),
(649, 183, 'updated', 'Product', 8, 'Memperbarui Product: Dimsum mentai spicy isi 6', '2026-08-21 14:12:28', '2026-08-21 14:12:28'),
(650, 117, 'created', 'Order', 26, 'Menambahkan Order baru: 26', '2026-08-21 14:13:00', '2026-08-21 14:13:00'),
(651, 117, 'updated', 'Product', 8, 'Memperbarui Product: Dimsum mentai spicy isi 6', '2026-08-21 14:13:00', '2026-08-21 14:13:00'),
(652, 117, 'updated', 'Product', 8, 'Memperbarui Product: Dimsum mentai spicy isi 6', '2026-08-21 14:13:00', '2026-08-21 14:13:00'),
(653, 117, 'updated', 'Order', 26, 'Memperbarui Order: 26', '2026-08-21 14:13:00', '2026-08-21 14:13:00'),
(654, 117, 'updated', 'Order', 26, 'Memperbarui Order: 26', '2026-08-21 14:16:14', '2026-08-21 14:16:14'),
(655, 77, 'updated', 'User', 77, 'Memperbarui User: Siti Maulidiyah', '2026-08-21 14:17:52', '2026-08-21 14:17:52'),
(656, NULL, 'created', 'User', 204, 'Menambahkan User baru: rischa hermawati', '2026-08-21 14:22:03', '2026-08-21 14:22:03'),
(657, NULL, 'created', 'User', 205, 'Menambahkan User baru: jihannaailur01', '2026-08-21 14:24:48', '2026-08-21 14:24:48'),
(658, NULL, 'created', 'User', 206, 'Menambahkan User baru: Naila Ulya', '2026-08-21 14:25:21', '2026-08-21 14:25:21'),
(659, 205, 'updated', 'User', 205, 'Memperbarui User: jihannaailur01', '2026-08-21 14:28:13', '2026-08-21 14:28:13'),
(660, NULL, 'created', 'User', 207, 'Menambahkan User baru: Fatih Al fayadh', '2026-08-21 14:28:36', '2026-08-21 14:28:36'),
(661, NULL, 'created', 'User', 208, 'Menambahkan User baru: Vanesya Amelia', '2026-08-21 14:34:07', '2026-08-21 14:34:07'),
(662, NULL, 'created', 'User', 209, 'Menambahkan User baru: Siti Maftuhah', '2026-08-21 14:34:51', '2026-08-21 14:34:51'),
(663, NULL, 'created', 'User', 210, 'Menambahkan User baru: Fanesa Amel', '2026-08-21 14:35:52', '2026-08-21 14:35:52'),
(664, 209, 'updated', 'User', 209, 'Memperbarui User: Siti Maftuhah', '2026-08-21 14:40:40', '2026-08-21 14:40:40'),
(665, 207, 'updated', 'User', 207, 'Memperbarui User: Fatih Al fayadh', '2026-08-21 14:42:13', '2026-08-21 14:42:13'),
(666, 208, 'updated', 'User', 208, 'Memperbarui User: Vanesya Amelia', '2026-08-21 14:44:44', '2026-08-21 14:44:44'),
(667, 208, 'updated', 'User', 208, 'Memperbarui User: Vanesya Amelia', '2026-08-21 14:46:09', '2026-08-21 14:46:09'),
(668, NULL, 'created', 'User', 211, 'Menambahkan User baru: Estuning Oktaviana', '2026-08-21 14:47:00', '2026-08-21 14:47:00'),
(669, 208, 'created', 'Order', 27, 'Menambahkan Order baru: 27', '2026-08-21 14:47:00', '2026-08-21 14:47:00'),
(670, 208, 'updated', 'Product', 9, 'Memperbarui Product: Mie Suit', '2026-08-21 14:47:00', '2026-08-21 14:47:00'),
(671, 208, 'updated', 'Product', 9, 'Memperbarui Product: Mie Suit', '2026-08-21 14:47:00', '2026-08-21 14:47:00'),
(672, 208, 'updated', 'Order', 27, 'Memperbarui Order: 27', '2026-08-21 14:47:00', '2026-08-21 14:47:00'),
(673, 208, 'updated', 'Order', 27, 'Memperbarui Order: 27', '2026-08-21 14:47:20', '2026-08-21 14:47:20'),
(674, 208, 'updated', 'Product', 9, 'Memperbarui Product: Mie Suit', '2026-08-21 14:47:20', '2026-08-21 14:47:20'),
(675, 208, 'updated', 'Product', 9, 'Memperbarui Product: Mie Suit', '2026-08-21 14:47:20', '2026-08-21 14:47:20'),
(676, 211, 'updated', 'User', 211, 'Memperbarui User: Estuning Oktaviana', '2026-08-21 14:48:17', '2026-08-21 14:48:17'),
(677, 51, 'updated', 'User', 51, 'Memperbarui User: Hayati Mustofa', '2026-08-21 14:50:12', '2026-08-21 14:50:12'),
(678, NULL, 'created', 'User', 212, 'Menambahkan User baru: Fatma Zanida', '2026-08-21 14:53:29', '2026-08-21 14:53:29'),
(679, NULL, 'created', 'User', 213, 'Menambahkan User baru: Lily Feliciane', '2026-08-21 14:54:25', '2026-08-21 14:54:25'),
(680, 212, 'updated', 'User', 212, 'Memperbarui User: Fatma Zanida', '2026-08-21 14:54:31', '2026-08-21 14:54:31'),
(681, 212, 'created', 'Order', 28, 'Menambahkan Order baru: 28', '2026-08-21 14:55:32', '2026-08-21 14:55:32'),
(682, 212, 'updated', 'Product', 11, 'Memperbarui Product: Mie Gacoan', '2026-08-21 14:55:32', '2026-08-21 14:55:32'),
(683, 212, 'updated', 'Product', 11, 'Memperbarui Product: Mie Gacoan', '2026-08-21 14:55:32', '2026-08-21 14:55:32'),
(684, 212, 'updated', 'Order', 28, 'Memperbarui Order: 28', '2026-08-21 14:55:32', '2026-08-21 14:55:32'),
(685, 213, 'updated', 'User', 213, 'Memperbarui User: Lily Feliciane', '2026-08-21 14:56:03', '2026-08-21 14:56:03'),
(686, NULL, 'created', 'User', 214, 'Menambahkan User baru: dewi ulfa', '2026-08-21 14:58:48', '2026-08-21 14:58:48'),
(687, NULL, 'created', 'User', 215, 'Menambahkan User baru: Hanik Maslikhatu', '2026-08-21 14:59:52', '2026-08-21 14:59:52'),
(688, 215, 'updated', 'User', 215, 'Memperbarui User: Hanik Maslikhatu', '2026-08-21 15:00:57', '2026-08-21 15:00:57'),
(689, NULL, 'created', 'User', 216, 'Menambahkan User baru: Aryanti Farel', '2026-08-21 15:01:07', '2026-08-21 15:01:07'),
(690, 214, 'updated', 'User', 214, 'Memperbarui User: dewi ulfa', '2026-08-21 15:01:55', '2026-08-21 15:01:55'),
(691, 215, 'updated', 'User', 215, 'Memperbarui User: Hanik Maslikhatu', '2026-08-21 15:01:59', '2026-08-21 15:01:59'),
(692, 207, 'updated', 'User', 207, 'Memperbarui User: Fatih Al fayadh', '2026-08-21 15:03:10', '2026-08-21 15:03:10'),
(693, 207, 'created', 'Order', 29, 'Menambahkan Order baru: 29', '2026-08-21 15:03:21', '2026-08-21 15:03:21'),
(694, 207, 'updated', 'Product', 19, 'Memperbarui Product: Mie Ayam', '2026-08-21 15:03:21', '2026-08-21 15:03:21'),
(695, 207, 'updated', 'Product', 19, 'Memperbarui Product: Mie Ayam', '2026-08-21 15:03:21', '2026-08-21 15:03:21'),
(696, 207, 'updated', 'Order', 29, 'Memperbarui Order: 29', '2026-08-21 15:03:21', '2026-08-21 15:03:21'),
(697, 216, 'updated', 'User', 216, 'Memperbarui User: Aryanti Farel', '2026-08-21 15:04:25', '2026-08-21 15:04:25'),
(698, NULL, 'created', 'User', 217, 'Menambahkan User baru: Juwik Diana', '2026-08-21 15:11:05', '2026-08-21 15:11:05'),
(699, 207, 'updated', 'Order', 29, 'Memperbarui Order: 29', '2026-08-21 15:14:36', '2026-08-21 15:14:36'),
(700, 217, 'updated', 'User', 217, 'Memperbarui User: Juwik Diana', '2026-08-21 15:15:44', '2026-08-21 15:15:44'),
(701, 217, 'created', 'Order', 30, 'Menambahkan Order baru: 30', '2026-08-21 15:15:49', '2026-08-21 15:15:49'),
(702, 217, 'updated', 'Product', 7, 'Memperbarui Product: DIMSUM ORIGINAL isi 6', '2026-08-21 15:15:49', '2026-08-21 15:15:49'),
(703, 217, 'updated', 'Product', 7, 'Memperbarui Product: DIMSUM ORIGINAL isi 6', '2026-08-21 15:15:49', '2026-08-21 15:15:49'),
(704, 217, 'updated', 'Order', 30, 'Memperbarui Order: 30', '2026-08-21 15:15:49', '2026-08-21 15:15:49'),
(705, 217, 'updated', 'Order', 30, 'Memperbarui Order: 30', '2026-08-21 15:16:00', '2026-08-21 15:16:00'),
(706, 217, 'updated', 'Product', 7, 'Memperbarui Product: DIMSUM ORIGINAL isi 6', '2026-08-21 15:16:00', '2026-08-21 15:16:00'),
(707, 217, 'updated', 'Product', 7, 'Memperbarui Product: DIMSUM ORIGINAL isi 6', '2026-08-21 15:16:00', '2026-08-21 15:16:00'),
(708, 207, 'updated', 'Order', 29, 'Memperbarui Order: 29', '2026-08-21 15:16:05', '2026-08-21 15:16:05'),
(709, NULL, 'created', 'User', 218, 'Menambahkan User baru: Zharifa Dhiya Nafisa', '2026-08-21 15:17:18', '2026-08-21 15:17:18'),
(710, 216, 'created', 'Order', 31, 'Menambahkan Order baru: 31', '2026-08-21 15:18:34', '2026-08-21 15:18:34'),
(711, 216, 'updated', 'Product', 11, 'Memperbarui Product: Mie Gacoan', '2026-08-21 15:18:34', '2026-08-21 15:18:34'),
(712, 216, 'updated', 'Product', 11, 'Memperbarui Product: Mie Gacoan', '2026-08-21 15:18:34', '2026-08-21 15:18:34'),
(713, 216, 'updated', 'Order', 31, 'Memperbarui Order: 31', '2026-08-21 15:18:34', '2026-08-21 15:18:34'),
(714, 216, 'updated', 'Order', 31, 'Memperbarui Order: 31', '2026-08-21 15:18:56', '2026-08-21 15:18:56'),
(715, 216, 'updated', 'Product', 11, 'Memperbarui Product: Mie Gacoan', '2026-08-21 15:18:56', '2026-08-21 15:18:56'),
(716, 216, 'updated', 'Product', 11, 'Memperbarui Product: Mie Gacoan', '2026-08-21 15:18:56', '2026-08-21 15:18:56'),
(717, NULL, 'created', 'User', 219, 'Menambahkan User baru: Verawati', '2026-08-21 15:20:06', '2026-08-21 15:20:06'),
(718, 207, 'created', 'Order', 32, 'Menambahkan Order baru: 32', '2026-08-21 15:25:24', '2026-08-21 15:25:24'),
(719, 207, 'updated', 'Product', 50, 'Memperbarui Product: Nescafe Caffe Latte Normal', '2026-08-21 15:25:24', '2026-08-21 15:25:24'),
(720, 207, 'updated', 'Product', 50, 'Memperbarui Product: Nescafe Caffe Latte Normal', '2026-08-21 15:25:24', '2026-08-21 15:25:24'),
(721, 207, 'updated', 'Order', 32, 'Memperbarui Order: 32', '2026-08-21 15:25:24', '2026-08-21 15:25:24'),
(722, NULL, 'created', 'User', 220, 'Menambahkan User baru: Elvia Elvia', '2026-08-21 15:27:04', '2026-08-21 15:27:04'),
(723, 207, 'updated', 'Order', 32, 'Memperbarui Order: 32', '2026-08-21 15:27:33', '2026-08-21 15:27:33'),
(724, NULL, 'created', 'User', 221, 'Menambahkan User baru: OLEH-OLEH KHAS TRENGGALEK', '2026-08-21 15:32:04', '2026-08-21 15:32:04'),
(725, NULL, 'created', 'User', 222, 'Menambahkan User baru: nadia khoiriyah', '2026-08-21 15:34:38', '2026-08-21 15:34:38'),
(726, NULL, 'created', 'User', 223, 'Menambahkan User baru: Ainik S', '2026-08-21 15:36:40', '2026-08-21 15:36:40'),
(727, 77, 'created', 'Order', 33, 'Menambahkan Order baru: 33', '2026-08-21 15:38:50', '2026-08-21 15:38:50'),
(728, 77, 'updated', 'Product', 11, 'Memperbarui Product: Mie Gacoan', '2026-08-21 15:38:50', '2026-08-21 15:38:50'),
(729, 77, 'updated', 'Product', 11, 'Memperbarui Product: Mie Gacoan', '2026-08-21 15:38:50', '2026-08-21 15:38:50'),
(730, 77, 'updated', 'Product', 15, 'Memperbarui Product: Lumpia Udang', '2026-08-21 15:38:50', '2026-08-21 15:38:50'),
(731, 77, 'updated', 'Product', 15, 'Memperbarui Product: Lumpia Udang', '2026-08-21 15:38:50', '2026-08-21 15:38:50'),
(732, 77, 'updated', 'Order', 33, 'Memperbarui Order: 33', '2026-08-21 15:38:50', '2026-08-21 15:38:50'),
(733, 77, 'created', 'Order', 34, 'Menambahkan Order baru: 34', '2026-08-21 15:38:50', '2026-08-21 15:38:50'),
(734, 77, 'updated', 'Product', 8, 'Memperbarui Product: Dimsum mentai spicy isi 6', '2026-08-21 15:38:50', '2026-08-21 15:38:50'),
(735, 77, 'updated', 'Product', 8, 'Memperbarui Product: Dimsum mentai spicy isi 6', '2026-08-21 15:38:50', '2026-08-21 15:38:50'),
(736, 77, 'updated', 'Order', 34, 'Memperbarui Order: 34', '2026-08-21 15:38:50', '2026-08-21 15:38:50'),
(737, 77, 'created', 'Order', 35, 'Menambahkan Order baru: 35', '2026-08-21 15:38:50', '2026-08-21 15:38:50'),
(738, 77, 'updated', 'Product', 50, 'Memperbarui Product: Nescafe Caffe Latte Normal', '2026-08-21 15:38:50', '2026-08-21 15:38:50'),
(739, 77, 'updated', 'Product', 50, 'Memperbarui Product: Nescafe Caffe Latte Normal', '2026-08-21 15:38:50', '2026-08-21 15:38:50'),
(740, 77, 'updated', 'Order', 35, 'Memperbarui Order: 35', '2026-08-21 15:38:50', '2026-08-21 15:38:50'),
(741, 77, 'created', 'Order', 36, 'Menambahkan Order baru: 36', '2026-08-21 15:38:50', '2026-08-21 15:38:50'),
(742, 77, 'updated', 'Product', 46, 'Memperbarui Product: Lemonnode', '2026-08-21 15:38:50', '2026-08-21 15:38:50'),
(743, 77, 'updated', 'Product', 46, 'Memperbarui Product: Lemonnode', '2026-08-21 15:38:50', '2026-08-21 15:38:50'),
(744, 77, 'updated', 'Order', 36, 'Memperbarui Order: 36', '2026-08-21 15:38:50', '2026-08-21 15:38:50'),
(745, 222, 'updated', 'User', 222, 'Memperbarui User: nadia khoiriyah', '2026-08-21 15:38:55', '2026-08-21 15:38:55'),
(746, 77, 'updated', 'Order', 33, 'Memperbarui Order: 33', '2026-08-21 15:41:11', '2026-08-21 15:41:11'),
(747, 77, 'updated', 'Order', 34, 'Memperbarui Order: 34', '2026-08-21 15:44:22', '2026-08-21 15:44:22'),
(748, 77, 'updated', 'Order', 35, 'Memperbarui Order: 35', '2026-08-21 15:46:01', '2026-08-21 15:46:01'),
(749, 77, 'updated', 'Order', 36, 'Memperbarui Order: 36', '2026-08-21 15:47:07', '2026-08-21 15:47:07'),
(750, NULL, 'created', 'User', 224, 'Menambahkan User baru: anik rahmatuningsih', '2026-08-21 15:47:54', '2026-08-21 15:47:54'),
(751, NULL, 'created', 'User', 225, 'Menambahkan User baru: Nadira Nadira', '2026-08-21 15:48:13', '2026-08-21 15:48:13'),
(752, 225, 'updated', 'User', 225, 'Memperbarui User: Nadira Nadira', '2026-08-21 15:51:24', '2026-08-21 15:51:24'),
(753, NULL, 'created', 'User', 226, 'Menambahkan User baru: Fara', '2026-08-21 15:54:33', '2026-08-21 15:54:33'),
(754, NULL, 'created', 'User', 227, 'Menambahkan User baru: Alaik Husna', '2026-08-21 16:00:26', '2026-08-21 16:00:26'),
(755, 227, 'updated', 'User', 227, 'Memperbarui User: Alaik Husna', '2026-08-21 16:01:50', '2026-08-21 16:01:50'),
(756, NULL, 'created', 'User', 228, 'Menambahkan User baru: Nurul Fadhilah', '2026-08-21 16:05:33', '2026-08-21 16:05:33'),
(757, NULL, 'created', 'User', 229, 'Menambahkan User baru: Nuzul Mukaromah', '2026-08-21 16:07:38', '2026-08-21 16:07:38'),
(758, NULL, 'created', 'User', 230, 'Menambahkan User baru: Intan', '2026-08-21 16:09:47', '2026-08-21 16:09:47'),
(759, NULL, 'created', 'User', 231, 'Menambahkan User baru: Elvya Dyna', '2026-08-21 16:10:59', '2026-08-21 16:10:59'),
(760, 230, 'updated', 'User', 230, 'Memperbarui User: Intan khoirun nisa\'', '2026-08-21 16:11:12', '2026-08-21 16:11:12'),
(761, 229, 'updated', 'User', 229, 'Memperbarui User: Nuzul Mukaromah', '2026-08-21 16:12:22', '2026-08-21 16:12:22'),
(762, 135, 'created', 'Order', 37, 'Menambahkan Order baru: 37', '2026-08-21 16:14:08', '2026-08-21 16:14:08'),
(763, 135, 'updated', 'Product', 11, 'Memperbarui Product: Mie Gacoan', '2026-08-21 16:14:08', '2026-08-21 16:14:08'),
(764, 135, 'updated', 'Product', 11, 'Memperbarui Product: Mie Gacoan', '2026-08-21 16:14:08', '2026-08-21 16:14:08'),
(765, 135, 'updated', 'Order', 37, 'Memperbarui Order: 37', '2026-08-21 16:14:08', '2026-08-21 16:14:08'),
(766, 229, 'updated', 'User', 229, 'Memperbarui User: Nuzul Mukaromah', '2026-08-21 16:14:20', '2026-08-21 16:14:20'),
(767, 229, 'updated', 'User', 229, 'Memperbarui User: Nuzul Mukaromah', '2026-08-21 16:15:23', '2026-08-21 16:15:23'),
(768, 229, 'updated', 'User', 229, 'Memperbarui User: Nuzul Mukaromah', '2026-08-21 16:15:34', '2026-08-21 16:15:34'),
(769, 183, 'created', 'Order', 38, 'Menambahkan Order baru: 38', '2026-08-21 16:16:06', '2026-08-21 16:16:06'),
(770, 183, 'updated', 'Product', 8, 'Memperbarui Product: Dimsum mentai spicy isi 6', '2026-08-21 16:16:06', '2026-08-21 16:16:06'),
(771, 183, 'updated', 'Product', 8, 'Memperbarui Product: Dimsum mentai spicy isi 6', '2026-08-21 16:16:06', '2026-08-21 16:16:06'),
(772, 183, 'updated', 'Order', 38, 'Memperbarui Order: 38', '2026-08-21 16:16:06', '2026-08-21 16:16:06'),
(773, 183, 'updated', 'Order', 38, 'Memperbarui Order: 38', '2026-08-21 16:16:31', '2026-08-21 16:16:31'),
(774, 183, 'updated', 'Product', 8, 'Memperbarui Product: Dimsum mentai spicy isi 6', '2026-08-21 16:16:31', '2026-08-21 16:16:31'),
(775, 183, 'updated', 'Product', 8, 'Memperbarui Product: Dimsum mentai spicy isi 6', '2026-08-21 16:16:31', '2026-08-21 16:16:31'),
(776, 135, 'updated', 'Order', 37, 'Memperbarui Order: 37', '2026-08-21 16:16:41', '2026-08-21 16:16:41'),
(777, NULL, 'created', 'User', 232, 'Menambahkan User baru: Wildan Mukholladun', '2026-08-21 16:17:13', '2026-08-21 16:17:13'),
(778, 232, 'updated', 'User', 232, 'Memperbarui User: Wildan Mukholladun', '2026-08-21 16:20:41', '2026-08-21 16:20:41'),
(779, NULL, 'created', 'User', 233, 'Menambahkan User baru: Shofaa Nurazizah', '2026-08-21 16:23:30', '2026-08-21 16:23:30'),
(780, NULL, 'created', 'User', 234, 'Menambahkan User baru: Supadmi80', '2026-08-21 16:23:31', '2026-08-21 16:23:31'),
(781, 233, 'updated', 'User', 233, 'Memperbarui User: Shofaa Nurazizah', '2026-08-21 16:24:52', '2026-08-21 16:24:52'),
(782, NULL, 'created', 'User', 235, 'Menambahkan User baru: nanikervina', '2026-08-21 16:33:53', '2026-08-21 16:33:53'),
(783, NULL, 'created', 'User', 236, 'Menambahkan User baru: Naila Hafizah', '2026-08-21 16:57:07', '2026-08-21 16:57:07'),
(784, 236, 'updated', 'User', 236, 'Memperbarui User: Naila Hafizah', '2026-08-21 16:58:25', '2026-08-21 16:58:25'),
(785, 110, 'updated', 'User', 110, 'Memperbarui User: Zi Dan', '2026-08-21 16:59:30', '2026-08-21 16:59:30'),
(786, 221, 'updated', 'User', 221, 'Memperbarui User: OLEH-OLEH KHAS TRENGGALEK', '2026-08-21 17:11:26', '2026-08-21 17:11:26'),
(787, NULL, 'created', 'User', 237, 'Menambahkan User baru: Alvina Muzzaiyana', '2026-08-21 17:20:14', '2026-08-21 17:20:14'),
(788, NULL, 'created', 'User', 238, 'Menambahkan User baru: Artha Charisa', '2026-08-21 17:31:26', '2026-08-21 17:31:26'),
(789, 85, 'updated', 'User', 85, 'Memperbarui User: Siti Mariyam', '2026-08-21 17:34:00', '2026-08-21 17:34:00'),
(790, 238, 'updated', 'User', 238, 'Memperbarui User: Artha Charisa', '2026-08-21 17:34:42', '2026-08-21 17:34:42'),
(791, NULL, 'created', 'User', 239, 'Menambahkan User baru: Wafi wafa', '2026-08-21 17:41:37', '2026-08-21 17:41:37'),
(792, NULL, 'created', 'User', 240, 'Menambahkan User baru: Nanang Firmansyah', '2026-08-21 17:47:09', '2026-08-21 17:47:09'),
(793, 240, 'updated', 'User', 240, 'Memperbarui User: Nanang Firmansyah', '2026-08-21 17:50:07', '2026-08-21 17:50:07'),
(794, NULL, 'created', 'User', 241, 'Menambahkan User baru: Prima Rasa', '2026-08-21 18:05:59', '2026-08-21 18:05:59'),
(795, 241, 'updated', 'User', 241, 'Memperbarui User: Prima Rasa', '2026-08-21 18:08:09', '2026-08-21 18:08:09'),
(796, NULL, 'created', 'User', 242, 'Menambahkan User baru: Eka Jaya', '2026-08-21 18:51:44', '2026-08-21 18:51:44'),
(797, NULL, 'created', 'User', 243, 'Menambahkan User baru: Basroni Punya', '2026-08-21 18:55:30', '2026-08-21 18:55:30'),
(798, NULL, 'created', 'User', 244, 'Menambahkan User baru: Qw Kediri', '2026-08-21 19:10:48', '2026-08-21 19:10:48'),
(799, NULL, 'created', 'User', 245, 'Menambahkan User baru: mohammad luthfi', '2026-08-21 19:10:56', '2026-08-21 19:10:56'),
(800, NULL, 'created', 'User', 246, 'Menambahkan User baru: ENDAH NURDIANI', '2026-08-21 19:12:53', '2026-08-21 19:12:53'),
(801, 246, 'updated', 'User', 246, 'Memperbarui User: ENDAH NURDIANI', '2026-08-21 19:19:27', '2026-08-21 19:19:27'),
(802, NULL, 'created', 'User', 247, 'Menambahkan User baru: alya anisa', '2026-08-21 19:19:41', '2026-08-21 19:19:41'),
(803, NULL, 'created', 'User', 248, 'Menambahkan User baru: Jihan Nadia', '2026-08-21 19:21:03', '2026-08-21 19:21:03'),
(804, 247, 'updated', 'User', 247, 'Memperbarui User: alya anisa', '2026-08-21 19:21:34', '2026-08-21 19:21:34'),
(805, 248, 'updated', 'User', 248, 'Memperbarui User: Jihan Nadia', '2026-08-21 19:24:53', '2026-08-21 19:24:53'),
(806, 10, 'updated', 'Order', 37, 'Memperbarui Order: 37', '2026-08-21 19:32:00', '2026-08-21 19:32:00'),
(807, 10, 'updated', 'Order', 29, 'Memperbarui Order: 29', '2026-08-21 19:32:39', '2026-08-21 19:32:39'),
(808, 10, 'updated', 'Order', 32, 'Memperbarui Order: 32', '2026-08-21 19:32:48', '2026-08-21 19:32:48'),
(809, 10, 'updated', 'Order', 36, 'Memperbarui Order: 36', '2026-08-21 19:32:55', '2026-08-21 19:32:55'),
(810, 10, 'updated', 'Order', 35, 'Memperbarui Order: 35', '2026-08-21 19:33:01', '2026-08-21 19:33:01'),
(811, 10, 'updated', 'Order', 34, 'Memperbarui Order: 34', '2026-08-21 19:33:09', '2026-08-21 19:33:09'),
(812, 10, 'updated', 'Order', 33, 'Memperbarui Order: 33', '2026-08-21 19:33:16', '2026-08-21 19:33:16'),
(813, NULL, 'created', 'User', 249, 'Menambahkan User baru: Putri Bunga Jameela', '2026-08-21 19:33:51', '2026-08-21 19:33:51'),
(814, 249, 'updated', 'User', 249, 'Memperbarui User: Putri Bunga Jameela', '2026-08-21 19:36:01', '2026-08-21 19:36:01'),
(815, NULL, 'created', 'User', 250, 'Menambahkan User baru: alisofiyan1961 alisofiyan', '2026-08-21 19:41:33', '2026-08-21 19:41:33'),
(816, NULL, 'created', 'User', 251, 'Menambahkan User baru: Sappn Aa', '2026-08-21 19:45:27', '2026-08-21 19:45:27'),
(817, NULL, 'created', 'User', 252, 'Menambahkan User baru: Akhyar Rosidi', '2026-08-21 19:45:47', '2026-08-21 19:45:47'),
(818, 250, 'updated', 'User', 250, 'Memperbarui User: alisofiyan1961 alisofiyan', '2026-08-21 19:47:54', '2026-08-21 19:47:54'),
(819, 10, 'updated', 'Order', 26, 'Memperbarui Order: 26', '2026-08-21 19:50:08', '2026-08-21 19:50:08'),
(820, NULL, 'created', 'User', 253, 'Menambahkan User baru: sika', '2026-08-21 19:52:12', '2026-08-21 19:52:12'),
(821, NULL, 'created', 'User', 254, 'Menambahkan User baru: Muyanto Anto', '2026-08-21 19:53:18', '2026-08-21 19:53:18'),
(822, 253, 'updated', 'User', 253, 'Memperbarui User: sika', '2026-08-21 19:53:50', '2026-08-21 19:53:50'),
(823, 250, 'updated', 'User', 250, 'Memperbarui User: alisofiyan', '2026-08-21 19:56:07', '2026-08-21 19:56:07'),
(824, NULL, 'created', 'User', 255, 'Menambahkan User baru: Nurmai ulfa', '2026-08-21 20:11:20', '2026-08-21 20:11:20'),
(825, 255, 'updated', 'User', 255, 'Memperbarui User: Nurmai ulfa', '2026-08-21 20:16:06', '2026-08-21 20:16:06'),
(826, NULL, 'created', 'User', 256, 'Menambahkan User baru: andriesta prastyana1981', '2026-08-21 20:36:49', '2026-08-21 20:36:49'),
(827, NULL, 'created', 'User', 257, 'Menambahkan User baru: Fahim Sayidah', '2026-08-21 20:42:21', '2026-08-21 20:42:21'),
(828, 257, 'updated', 'User', 257, 'Memperbarui User: Fahim Sayidah', '2026-08-21 20:43:48', '2026-08-21 20:43:48');

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
(4, 10, 'Mie Gacoan', 'kota', 'Mie', NULL, 'approved', 3500.00, 1500.00, 0.00, NULL, 0, NULL, NULL, '6285777799988', 0.00, 0, NULL, '2026-08-09 10:43:38', '2026-08-19 18:39:35', 0.00, '09:00:00', '17:00:00'),
(5, 10, 'BAKSO KUY KAUMAN', 'kauman', 'Bakso Kuy Kauman', NULL, 'approved', 2000.00, 0.00, 0.00, NULL, 0, NULL, NULL, NULL, 0.00, 0, NULL, '2026-08-17 20:12:02', '2026-08-19 19:38:30', 0.00, '09:00:00', '17:00:00'),
(6, 10, 'DIMSUM GENDUT KAUMAN', 'kauman', 'DIMSUM GENDUT KAUMAN', NULL, 'approved', 2000.00, 0.00, 0.00, NULL, 0, NULL, NULL, NULL, 0.00, 0, NULL, '2026-08-18 15:16:58', '2026-08-19 19:42:14', 0.00, '09:00:00', '17:00:00'),
(7, 10, 'MIE AYAM SOLO KAUMAN', 'kauman', NULL, NULL, 'approved', 2000.00, 0.00, 0.00, NULL, 0, NULL, NULL, NULL, 0.00, 0, NULL, '2026-08-19 18:44:05', '2026-08-19 19:06:17', 0.00, '09:00:00', '17:00:00'),
(8, 10, 'NASI GORENG', 'kauman', NULL, NULL, 'approved', 2000.00, 0.00, 0.00, NULL, 0, NULL, NULL, NULL, 0.00, 0, NULL, '2026-08-19 18:44:34', '2026-08-19 19:06:09', 0.00, '09:00:00', '17:00:00'),
(9, 10, 'SEBLAK BUNA', 'kauman', NULL, NULL, 'approved', 0.00, 0.00, 0.00, NULL, 0, NULL, NULL, NULL, 0.00, 0, NULL, '2026-08-19 18:45:02', '2026-08-19 19:06:05', 0.00, '09:00:00', '17:00:00'),
(10, 10, 'SATE TAICAN KENAYAN', 'kauman', NULL, NULL, 'approved', 0.00, 0.00, 0.00, NULL, 0, NULL, NULL, NULL, 0.00, 0, NULL, '2026-08-19 18:45:22', '2026-08-19 19:05:58', 0.00, '09:00:00', '17:00:00'),
(11, 10, 'NASI PADANG KAUMAN', 'kauman', NULL, NULL, 'approved', 0.00, 0.00, 0.00, NULL, 0, NULL, NULL, NULL, 0.00, 0, NULL, '2026-08-19 18:46:24', '2026-08-19 19:05:54', 0.00, '09:00:00', '17:00:00'),
(12, 10, 'MARTABAK KAUMAN', 'kauman', NULL, NULL, 'approved', 0.00, 0.00, 0.00, NULL, 0, NULL, NULL, NULL, 0.00, 0, NULL, '2026-08-19 18:47:02', '2026-08-19 19:05:49', 0.00, '09:00:00', '17:00:00'),
(13, 10, 'TERANG BULAN KAUMAN', 'kauman', NULL, NULL, 'approved', 0.00, 0.00, 0.00, NULL, 0, NULL, NULL, NULL, 0.00, 0, NULL, '2026-08-19 18:47:21', '2026-08-19 19:05:44', 0.00, '09:00:00', '17:00:00'),
(14, 10, 'NASI AYAM GEPREK KAUMAN', 'kauman', NULL, NULL, 'approved', 0.00, 0.00, 0.00, NULL, 0, NULL, NULL, NULL, 0.00, 0, NULL, '2026-08-19 18:47:51', '2026-08-19 19:05:39', 0.00, '09:00:00', '17:00:00'),
(15, 10, 'ROKET CHIKEN KAUMAN', 'kauman', NULL, NULL, 'approved', 0.00, 0.00, 0.00, NULL, 0, NULL, NULL, NULL, 0.00, 0, NULL, '2026-08-19 18:58:17', '2026-08-19 19:05:33', 0.00, '09:00:00', '17:00:00'),
(16, 10, 'PENYETAN LAMONGAN KAUMAN', 'kauman', NULL, NULL, 'approved', 0.00, 0.00, 0.00, NULL, 0, NULL, NULL, NULL, 0.00, 0, NULL, '2026-08-19 18:59:09', '2026-08-19 19:06:39', 0.00, '09:00:00', '17:00:00'),
(17, 10, 'NESCAFEE', 'kauman', NULL, NULL, 'approved', 0.00, 0.00, 0.00, NULL, 0, NULL, NULL, NULL, 0.00, 0, NULL, '2026-08-19 19:00:43', '2026-08-19 19:04:57', 0.00, '09:00:00', '17:00:00'),
(18, 10, 'MOMOYO', 'kauman', NULL, NULL, 'approved', 0.00, 0.00, 0.00, NULL, 0, NULL, NULL, NULL, 0.00, 0, NULL, '2026-08-19 19:00:54', '2026-08-19 19:04:35', 0.00, '09:00:00', '17:00:00'),
(19, 10, 'TROPISCO', 'kauman', NULL, NULL, 'approved', 0.00, 0.00, 0.00, NULL, 0, NULL, NULL, NULL, 0.00, 0, NULL, '2026-08-19 19:00:59', '2026-08-19 19:01:51', 0.00, '09:00:00', '17:00:00'),
(20, 148, '*', 'kauman', '*', NULL, 'pending', 0.00, 0.00, 0.00, NULL, 0, NULL, NULL, NULL, 0.00, 0, NULL, '2026-08-21 01:25:22', '2026-08-21 01:25:22', 0.00, '09:00:00', '17:00:00');

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
(2, 'App\\Domains\\Auth\\User', 15),
(2, 'App\\Domains\\Auth\\User', 16),
(2, 'App\\Domains\\Auth\\User', 19),
(2, 'App\\Domains\\Auth\\User', 20),
(2, 'App\\Domains\\Auth\\User', 21),
(2, 'App\\Domains\\Auth\\User', 22),
(2, 'App\\Domains\\Auth\\User', 23),
(2, 'App\\Domains\\Auth\\User', 24),
(2, 'App\\Domains\\Auth\\User', 25),
(2, 'App\\Domains\\Auth\\User', 26),
(2, 'App\\Domains\\Auth\\User', 27),
(2, 'App\\Domains\\Auth\\User', 28),
(2, 'App\\Domains\\Auth\\User', 29),
(2, 'App\\Domains\\Auth\\User', 30),
(2, 'App\\Domains\\Auth\\User', 31),
(2, 'App\\Domains\\Auth\\User', 32),
(2, 'App\\Domains\\Auth\\User', 33),
(2, 'App\\Domains\\Auth\\User', 34),
(2, 'App\\Domains\\Auth\\User', 35),
(2, 'App\\Domains\\Auth\\User', 36),
(2, 'App\\Domains\\Auth\\User', 37),
(2, 'App\\Domains\\Auth\\User', 38),
(2, 'App\\Domains\\Auth\\User', 39),
(2, 'App\\Domains\\Auth\\User', 40),
(2, 'App\\Domains\\Auth\\User', 41),
(2, 'App\\Domains\\Auth\\User', 42),
(2, 'App\\Domains\\Auth\\User', 43),
(2, 'App\\Domains\\Auth\\User', 44),
(2, 'App\\Domains\\Auth\\User', 45),
(2, 'App\\Domains\\Auth\\User', 46),
(2, 'App\\Domains\\Auth\\User', 47),
(2, 'App\\Domains\\Auth\\User', 48),
(2, 'App\\Domains\\Auth\\User', 49),
(2, 'App\\Domains\\Auth\\User', 50),
(2, 'App\\Domains\\Auth\\User', 51),
(2, 'App\\Domains\\Auth\\User', 52),
(2, 'App\\Domains\\Auth\\User', 53),
(2, 'App\\Domains\\Auth\\User', 54),
(2, 'App\\Domains\\Auth\\User', 55),
(2, 'App\\Domains\\Auth\\User', 56),
(2, 'App\\Domains\\Auth\\User', 57),
(2, 'App\\Domains\\Auth\\User', 58),
(2, 'App\\Domains\\Auth\\User', 59),
(2, 'App\\Domains\\Auth\\User', 60),
(2, 'App\\Domains\\Auth\\User', 61),
(2, 'App\\Domains\\Auth\\User', 62),
(2, 'App\\Domains\\Auth\\User', 63),
(2, 'App\\Domains\\Auth\\User', 64),
(2, 'App\\Domains\\Auth\\User', 65),
(2, 'App\\Domains\\Auth\\User', 66),
(2, 'App\\Domains\\Auth\\User', 67),
(2, 'App\\Domains\\Auth\\User', 68),
(2, 'App\\Domains\\Auth\\User', 69),
(2, 'App\\Domains\\Auth\\User', 70),
(2, 'App\\Domains\\Auth\\User', 71),
(2, 'App\\Domains\\Auth\\User', 72),
(2, 'App\\Domains\\Auth\\User', 73),
(2, 'App\\Domains\\Auth\\User', 74),
(2, 'App\\Domains\\Auth\\User', 75),
(2, 'App\\Domains\\Auth\\User', 76),
(2, 'App\\Domains\\Auth\\User', 77),
(2, 'App\\Domains\\Auth\\User', 78),
(2, 'App\\Domains\\Auth\\User', 79),
(2, 'App\\Domains\\Auth\\User', 80),
(2, 'App\\Domains\\Auth\\User', 81),
(2, 'App\\Domains\\Auth\\User', 82),
(2, 'App\\Domains\\Auth\\User', 83),
(2, 'App\\Domains\\Auth\\User', 84),
(2, 'App\\Domains\\Auth\\User', 85),
(2, 'App\\Domains\\Auth\\User', 86),
(2, 'App\\Domains\\Auth\\User', 87),
(2, 'App\\Domains\\Auth\\User', 88),
(2, 'App\\Domains\\Auth\\User', 89),
(2, 'App\\Domains\\Auth\\User', 90),
(2, 'App\\Domains\\Auth\\User', 91),
(2, 'App\\Domains\\Auth\\User', 92),
(2, 'App\\Domains\\Auth\\User', 93),
(2, 'App\\Domains\\Auth\\User', 94),
(2, 'App\\Domains\\Auth\\User', 95),
(2, 'App\\Domains\\Auth\\User', 96),
(2, 'App\\Domains\\Auth\\User', 97),
(2, 'App\\Domains\\Auth\\User', 98),
(2, 'App\\Domains\\Auth\\User', 99),
(2, 'App\\Domains\\Auth\\User', 100),
(2, 'App\\Domains\\Auth\\User', 101),
(2, 'App\\Domains\\Auth\\User', 102),
(2, 'App\\Domains\\Auth\\User', 103),
(2, 'App\\Domains\\Auth\\User', 104),
(2, 'App\\Domains\\Auth\\User', 105),
(2, 'App\\Domains\\Auth\\User', 106),
(2, 'App\\Domains\\Auth\\User', 107),
(2, 'App\\Domains\\Auth\\User', 108),
(2, 'App\\Domains\\Auth\\User', 109),
(2, 'App\\Domains\\Auth\\User', 110),
(2, 'App\\Domains\\Auth\\User', 111),
(2, 'App\\Domains\\Auth\\User', 112),
(2, 'App\\Domains\\Auth\\User', 113),
(2, 'App\\Domains\\Auth\\User', 114),
(2, 'App\\Domains\\Auth\\User', 115),
(2, 'App\\Domains\\Auth\\User', 116),
(2, 'App\\Domains\\Auth\\User', 117),
(2, 'App\\Domains\\Auth\\User', 118),
(2, 'App\\Domains\\Auth\\User', 119),
(2, 'App\\Domains\\Auth\\User', 120),
(2, 'App\\Domains\\Auth\\User', 121),
(2, 'App\\Domains\\Auth\\User', 122),
(2, 'App\\Domains\\Auth\\User', 123),
(2, 'App\\Domains\\Auth\\User', 124),
(2, 'App\\Domains\\Auth\\User', 125),
(2, 'App\\Domains\\Auth\\User', 126),
(2, 'App\\Domains\\Auth\\User', 127),
(2, 'App\\Domains\\Auth\\User', 128),
(2, 'App\\Domains\\Auth\\User', 129),
(2, 'App\\Domains\\Auth\\User', 130),
(2, 'App\\Domains\\Auth\\User', 131),
(2, 'App\\Domains\\Auth\\User', 132),
(2, 'App\\Domains\\Auth\\User', 133),
(2, 'App\\Domains\\Auth\\User', 134),
(2, 'App\\Domains\\Auth\\User', 135),
(2, 'App\\Domains\\Auth\\User', 136),
(2, 'App\\Domains\\Auth\\User', 137),
(2, 'App\\Domains\\Auth\\User', 138),
(2, 'App\\Domains\\Auth\\User', 139),
(2, 'App\\Domains\\Auth\\User', 140),
(2, 'App\\Domains\\Auth\\User', 141),
(2, 'App\\Domains\\Auth\\User', 142),
(2, 'App\\Domains\\Auth\\User', 143),
(2, 'App\\Domains\\Auth\\User', 144),
(2, 'App\\Domains\\Auth\\User', 145),
(2, 'App\\Domains\\Auth\\User', 146),
(2, 'App\\Domains\\Auth\\User', 147),
(2, 'App\\Domains\\Auth\\User', 149),
(2, 'App\\Domains\\Auth\\User', 150),
(2, 'App\\Domains\\Auth\\User', 151),
(2, 'App\\Domains\\Auth\\User', 152),
(2, 'App\\Domains\\Auth\\User', 153),
(2, 'App\\Domains\\Auth\\User', 154),
(2, 'App\\Domains\\Auth\\User', 155),
(2, 'App\\Domains\\Auth\\User', 156),
(2, 'App\\Domains\\Auth\\User', 157),
(2, 'App\\Domains\\Auth\\User', 158),
(2, 'App\\Domains\\Auth\\User', 159),
(2, 'App\\Domains\\Auth\\User', 160),
(2, 'App\\Domains\\Auth\\User', 161),
(2, 'App\\Domains\\Auth\\User', 162),
(2, 'App\\Domains\\Auth\\User', 163),
(2, 'App\\Domains\\Auth\\User', 164),
(2, 'App\\Domains\\Auth\\User', 165),
(2, 'App\\Domains\\Auth\\User', 166),
(2, 'App\\Domains\\Auth\\User', 167),
(2, 'App\\Domains\\Auth\\User', 168),
(2, 'App\\Domains\\Auth\\User', 169),
(2, 'App\\Domains\\Auth\\User', 170),
(2, 'App\\Domains\\Auth\\User', 171),
(2, 'App\\Domains\\Auth\\User', 172),
(2, 'App\\Domains\\Auth\\User', 173),
(2, 'App\\Domains\\Auth\\User', 174),
(2, 'App\\Domains\\Auth\\User', 175),
(2, 'App\\Domains\\Auth\\User', 176),
(2, 'App\\Domains\\Auth\\User', 177),
(2, 'App\\Domains\\Auth\\User', 178),
(2, 'App\\Domains\\Auth\\User', 179),
(2, 'App\\Domains\\Auth\\User', 180),
(2, 'App\\Domains\\Auth\\User', 181),
(2, 'App\\Domains\\Auth\\User', 182),
(2, 'App\\Domains\\Auth\\User', 183),
(2, 'App\\Domains\\Auth\\User', 184),
(2, 'App\\Domains\\Auth\\User', 185),
(2, 'App\\Domains\\Auth\\User', 186),
(2, 'App\\Domains\\Auth\\User', 187),
(2, 'App\\Domains\\Auth\\User', 188),
(2, 'App\\Domains\\Auth\\User', 189),
(2, 'App\\Domains\\Auth\\User', 190),
(2, 'App\\Domains\\Auth\\User', 191),
(2, 'App\\Domains\\Auth\\User', 192),
(2, 'App\\Domains\\Auth\\User', 193),
(2, 'App\\Domains\\Auth\\User', 194),
(2, 'App\\Domains\\Auth\\User', 195),
(2, 'App\\Domains\\Auth\\User', 196),
(2, 'App\\Domains\\Auth\\User', 197),
(2, 'App\\Domains\\Auth\\User', 198),
(2, 'App\\Domains\\Auth\\User', 199),
(2, 'App\\Domains\\Auth\\User', 200),
(2, 'App\\Domains\\Auth\\User', 201),
(2, 'App\\Domains\\Auth\\User', 202),
(2, 'App\\Domains\\Auth\\User', 203),
(2, 'App\\Domains\\Auth\\User', 204),
(2, 'App\\Domains\\Auth\\User', 205),
(2, 'App\\Domains\\Auth\\User', 206),
(2, 'App\\Domains\\Auth\\User', 207),
(2, 'App\\Domains\\Auth\\User', 208),
(2, 'App\\Domains\\Auth\\User', 209),
(2, 'App\\Domains\\Auth\\User', 210),
(2, 'App\\Domains\\Auth\\User', 211),
(2, 'App\\Domains\\Auth\\User', 212),
(2, 'App\\Domains\\Auth\\User', 213),
(2, 'App\\Domains\\Auth\\User', 214),
(2, 'App\\Domains\\Auth\\User', 215),
(2, 'App\\Domains\\Auth\\User', 216),
(2, 'App\\Domains\\Auth\\User', 217),
(2, 'App\\Domains\\Auth\\User', 218),
(2, 'App\\Domains\\Auth\\User', 219),
(2, 'App\\Domains\\Auth\\User', 220),
(2, 'App\\Domains\\Auth\\User', 221),
(2, 'App\\Domains\\Auth\\User', 222),
(2, 'App\\Domains\\Auth\\User', 223),
(2, 'App\\Domains\\Auth\\User', 224),
(2, 'App\\Domains\\Auth\\User', 225),
(2, 'App\\Domains\\Auth\\User', 226),
(2, 'App\\Domains\\Auth\\User', 227),
(2, 'App\\Domains\\Auth\\User', 228),
(2, 'App\\Domains\\Auth\\User', 229),
(2, 'App\\Domains\\Auth\\User', 230),
(2, 'App\\Domains\\Auth\\User', 231),
(2, 'App\\Domains\\Auth\\User', 232),
(2, 'App\\Domains\\Auth\\User', 233),
(2, 'App\\Domains\\Auth\\User', 234),
(2, 'App\\Domains\\Auth\\User', 235),
(2, 'App\\Domains\\Auth\\User', 236),
(2, 'App\\Domains\\Auth\\User', 237),
(2, 'App\\Domains\\Auth\\User', 238),
(2, 'App\\Domains\\Auth\\User', 239),
(2, 'App\\Domains\\Auth\\User', 240),
(2, 'App\\Domains\\Auth\\User', 241),
(2, 'App\\Domains\\Auth\\User', 242),
(2, 'App\\Domains\\Auth\\User', 243),
(2, 'App\\Domains\\Auth\\User', 244),
(2, 'App\\Domains\\Auth\\User', 245),
(2, 'App\\Domains\\Auth\\User', 246),
(2, 'App\\Domains\\Auth\\User', 247),
(2, 'App\\Domains\\Auth\\User', 248),
(2, 'App\\Domains\\Auth\\User', 249),
(2, 'App\\Domains\\Auth\\User', 250),
(2, 'App\\Domains\\Auth\\User', 251),
(2, 'App\\Domains\\Auth\\User', 252),
(2, 'App\\Domains\\Auth\\User', 253),
(2, 'App\\Domains\\Auth\\User', 254),
(2, 'App\\Domains\\Auth\\User', 255),
(2, 'App\\Domains\\Auth\\User', 256),
(2, 'App\\Domains\\Auth\\User', 257),
(3, 'App\\Domains\\Auth\\User', 10),
(3, 'App\\Domains\\Auth\\User', 148),
(4, 'App\\Domains\\Auth\\User', 12),
(4, 'App\\Domains\\Auth\\User', 148);

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
  `proof_of_payment` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`proof_of_payment`)),
  `proof_of_purchase` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`proof_of_purchase`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `is_courier_paid_by_canteen` tinyint(1) NOT NULL DEFAULT 0,
  `proof_courier_paid` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `canteen_id`, `is_custom`, `custom_notes`, `total_price`, `admin_fee`, `delivery_fee`, `status`, `payment_status`, `courier_id`, `delivery_location`, `proof_of_delivery`, `proof_of_payment`, `proof_of_purchase`, `created_at`, `updated_at`, `is_courier_paid_by_canteen`, `proof_courier_paid`) VALUES
(3, 11, 4, 0, NULL, 13000.00, 1000.00, 2000.00, 'completed', 'unpaid', 12, 'Al Majid 1', '[\"kurir_kurir\\/proofs\\/nEozZ3zmlQfnsbf5UeYr0mdGAbfGofYunC5oAVoV.jpg\"]', NULL, '[\"kurir_kurir\\/proofs\\/YZDQ8MQM2AhFdizUl8v3pNtw1Hpqo8u0H0OEbtCx.jpg\"]', '2026-08-09 10:46:25', '2026-08-09 10:48:47', 0, NULL),
(4, 11, 4, 0, NULL, 13000.00, 1000.00, 2000.00, 'completed', 'unpaid', 12, 'Al Majid 1', NULL, NULL, NULL, '2026-08-09 15:43:55', '2026-08-09 15:51:38', 0, NULL),
(5, 11, 4, 0, NULL, 13000.00, 1000.00, 2000.00, 'processing', 'unpaid', 12, 'Al Majid 1', NULL, NULL, NULL, '2026-08-10 10:52:19', '2026-08-10 10:55:38', 0, NULL),
(6, 11, 4, 0, NULL, 13000.00, 1000.00, 2000.00, 'pending', 'unpaid', 12, 'Al Majid 1', NULL, NULL, NULL, '2026-08-10 12:05:59', '2026-08-10 12:05:59', 0, NULL),
(7, 16, 6, 0, NULL, 54000.00, 1000.00, 2000.00, 'cancelled', 'unpaid', 12, 'Al Majid 3', NULL, NULL, NULL, '2026-08-18 16:17:53', '2026-08-18 16:19:00', 0, NULL),
(8, 16, 6, 0, NULL, 25000.00, 1000.00, 2000.00, 'pending', 'unpaid', 12, 'Al Majid 3', NULL, NULL, NULL, '2026-08-18 16:19:30', '2026-08-18 16:19:30', 0, NULL),
(11, 81, 6, 0, NULL, 44000.00, 1000.00, 2000.00, 'processing', 'unpaid', 12, 'Al Majid 1', NULL, NULL, NULL, '2026-08-20 09:58:15', '2026-08-20 17:37:45', 0, NULL),
(12, 83, 4, 0, NULL, 16000.00, 1000.00, 2000.00, 'cancelled', 'unpaid', 12, 'Asmah', NULL, NULL, NULL, '2026-08-20 12:54:56', '2026-08-20 12:55:54', 0, NULL),
(13, 99, 6, 0, NULL, 39000.00, 1000.00, 2000.00, 'cancelled', 'unpaid', 12, 'Asmah', NULL, NULL, NULL, '2026-08-20 13:01:58', '2026-08-20 13:04:02', 0, NULL),
(14, 99, 4, 0, NULL, 16000.00, 1000.00, 2000.00, 'cancelled', 'unpaid', 12, 'Asmah', NULL, NULL, NULL, '2026-08-20 13:03:45', '2026-08-20 13:04:24', 0, NULL),
(15, 100, 5, 0, NULL, 19000.00, 1000.00, 2000.00, 'processing', 'unpaid', 12, 'Al Majid 1 / Kamar A7', NULL, '[\"user_ahmad_al-badawi\\/proofs\\/MY1uhTyGr2ZSW8klKCrOP0Dne18U1b3ptUsWnc2a.jpg\"]', NULL, '2026-08-20 13:10:55', '2026-08-20 17:37:40', 0, NULL),
(16, 75, 4, 0, NULL, 16000.00, 1000.00, 2000.00, 'cancelled', 'unpaid', 12, 'Asmah', NULL, NULL, NULL, '2026-08-20 13:35:59', '2026-08-20 13:36:23', 0, NULL),
(17, 39, 8, 0, NULL, 19000.00, 1000.00, 2000.00, 'processing', 'unpaid', 12, 'Al Majid 2', '[\"kurir_kurir\\/proofs\\/SGMXZgBXRhq9YqC6dOZz4rfP4xiP5wQ6A8uinvwU.jpg\"]', '[\"user_mohammad_dzaka_brillian_wibisono\\/proofs\\/dcTUucaoJJiYzAIft8ctxgSd3fLtVelOoEWFhVHN.jpg\"]', NULL, '2026-08-20 15:11:48', '2026-08-20 20:40:30', 0, NULL),
(18, 39, 8, 0, NULL, 19000.00, 1000.00, 2000.00, 'processing', 'unpaid', 12, 'Asmah putri/ kamar G16', '[\"kurir_kurir\\/proofs\\/bB8GfYltmwnFdwT3OlBxgXywyN8wXWHyqyNgwptQ.jpg\"]', '[\"user_maida_farras_zahrani\\/proofs\\/G5zCM95XxKGP2ydXXPPCXiftZCsvyQYp7z97ZbuY.jpg\"]', NULL, '2026-08-20 15:42:07', '2026-08-20 20:39:30', 0, NULL),
(19, 107, 4, 0, NULL, 16000.00, 1000.00, 2000.00, 'processing', 'unpaid', 12, 'G5', NULL, NULL, NULL, '2026-08-20 16:10:33', '2026-08-20 17:36:35', 0, NULL),
(20, 107, 17, 0, NULL, 16500.00, 1000.00, 2000.00, 'processing', 'unpaid', 12, 'G5', NULL, NULL, NULL, '2026-08-20 16:10:33', '2026-08-20 17:37:32', 0, NULL),
(21, 110, 7, 0, NULL, 16000.00, 1000.00, 2000.00, 'processing', 'unpaid', 12, 'Asmah G17', '[\"kurir_kurir\\/proofs\\/x1tOdf3sN2SDp2LczYjiEvUSAInreRPBDPqYIlY7.jpg\"]', '[\"user_naila_hafizah_qurratu\'ain\\/proofs\\/xjkKUqX8PvniZOetoeC6SlOj2uqGSkevXLXTqS6e.jpg\",\"user_naila_hafizah_qurratu\'ain\\/proofs\\/S2of8HptoZWjVBiimtezszTWV1XHEOAYKGKv3UyL.jpg\"]', NULL, '2026-08-20 16:46:24', '2026-08-20 20:38:11', 0, NULL),
(22, 169, 4, 0, NULL, 16000.00, 1000.00, 2000.00, 'cancelled', 'unpaid', 12, 'Asmah g.23', NULL, NULL, NULL, '2026-08-21 10:23:28', '2026-08-21 10:23:39', 0, NULL),
(23, 171, 6, 0, NULL, 21000.00, 1000.00, 2000.00, 'cancelled', 'unpaid', 12, 'Asmah G-20', NULL, NULL, NULL, '2026-08-21 10:30:13', '2026-08-21 10:30:27', 0, NULL),
(24, 178, 4, 0, NULL, 16000.00, 1000.00, 2000.00, 'cancelled', 'unpaid', 12, 'Asmah G17', NULL, NULL, NULL, '2026-08-21 11:31:57', '2026-08-21 11:33:21', 0, NULL),
(25, 183, 6, 0, NULL, 26000.00, 1000.00, 2000.00, 'cancelled', 'unpaid', 12, 'Asmah', NULL, NULL, NULL, '2026-08-21 14:12:19', '2026-08-21 14:12:28', 0, NULL),
(26, 117, 6, 0, NULL, 26000.00, 1000.00, 2000.00, 'processing', 'waiting_confirmation', 12, 'G 8', NULL, '[\"user_nasya_ashila_maulida\\/proofs\\/xgEHHqbxqiqprUcDFjhgJfu4GWoX8ueqMKidWMgr.png\"]', NULL, '2026-08-21 14:13:00', '2026-08-21 19:50:08', 0, NULL),
(27, 208, 4, 0, NULL, 16000.00, 1000.00, 2000.00, 'cancelled', 'unpaid', 12, 'ASMAH / G.21', NULL, NULL, NULL, '2026-08-21 14:47:00', '2026-08-21 14:47:20', 0, NULL),
(28, 212, 4, 0, NULL, 16000.00, 1000.00, 2000.00, 'pending', 'unpaid', 12, 'Asmah', NULL, NULL, NULL, '2026-08-21 14:55:32', '2026-08-21 14:55:32', 0, NULL),
(29, 207, 7, 0, NULL, 16000.00, 1000.00, 2000.00, 'processing', 'waiting_confirmation', 12, 'ASMAH', NULL, '[\"user_awfa_naili_fahrina\\/proofs\\/oHh1fRiNaQhPNEYjjvRpDym1r3ITChRVD6zYNTzv.png\",\"user_awfa_naili_fahrina\\/proofs\\/zK9GecFbiJs1ymGCk5RAxtaqFJ1sqoMzctvCEEih.png\"]', NULL, '2026-08-21 15:03:21', '2026-08-21 19:32:39', 0, NULL),
(30, 217, 6, 0, NULL, 21000.00, 1000.00, 2000.00, 'cancelled', 'unpaid', 12, 'ASMAH', NULL, NULL, NULL, '2026-08-21 15:15:49', '2026-08-21 15:16:00', 0, NULL),
(31, 216, 4, 0, NULL, 16000.00, 1000.00, 2000.00, 'cancelled', 'unpaid', 12, 'Asrama:Asmah,kamar:G.24,kelas:11 agama 2', NULL, NULL, NULL, '2026-08-21 15:18:34', '2026-08-21 15:18:56', 0, NULL),
(32, 207, 17, 0, NULL, 20500.00, 1000.00, 2000.00, 'processing', 'waiting_confirmation', 12, 'ASMAH', NULL, '[\"user_awfa_naili_fahrina\\/proofs\\/1uXtswZliOoGE9dMeDN9cW0l0DEQ6nsWlnrP0zrQ.png\"]', NULL, '2026-08-21 15:25:24', '2026-08-21 19:32:48', 0, NULL),
(33, 77, 4, 0, NULL, 26000.00, 1000.00, 2000.00, 'processing', 'waiting_confirmation', 12, 'ASMAH', NULL, '[\"user_adeeva_calzoum_zanubi\\/proofs\\/vA4STpI65HOzPHMrRdAvybha0hD4UhkwcMF0Fbyp.jpg\"]', NULL, '2026-08-21 15:38:50', '2026-08-21 19:33:16', 0, NULL),
(34, 77, 6, 0, NULL, 26000.00, 1000.00, 2000.00, 'processing', 'waiting_confirmation', 12, 'ASMAH', NULL, '[\"user_adeeva_calzoum_zanubi\\/proofs\\/GBafSbeDjQGOmNqQdvQOW2Dc2iTjUaPuEmfAfnbd.jpg\"]', NULL, '2026-08-21 15:38:50', '2026-08-21 19:33:09', 0, NULL),
(35, 77, 17, 0, NULL, 20500.00, 1000.00, 2000.00, 'processing', 'waiting_confirmation', 12, 'ASMAH', NULL, '[\"user_adeeva_calzoum_zanubi\\/proofs\\/2tGJG6cYgILKZcv2dHXbCeKYPL9RVmXiz5OhPiDW.jpg\"]', NULL, '2026-08-21 15:38:50', '2026-08-21 19:33:01', 0, NULL),
(36, 77, 18, 0, NULL, 17000.00, 1000.00, 2000.00, 'processing', 'waiting_confirmation', 12, 'ASMAH', NULL, '[\"user_adeeva_calzoum_zanubi\\/proofs\\/ngytGiP40AiyQKdaYcg0fCOISwih4scdF0QQ2RYW.jpg\"]', NULL, '2026-08-21 15:38:50', '2026-08-21 19:32:55', 0, NULL),
(37, 135, 4, 0, NULL, 220000.00, 1000.00, 11000.00, 'processing', 'waiting_confirmation', 12, 'Al Majid 2', NULL, '[\"user_muhammad_satria_ulinnuha\\/proofs\\/xYEFRe2BF08R2tdCZXTRcZy1uQ0wJ6MyM0AWbgNs.jpg\"]', NULL, '2026-08-21 16:14:08', '2026-08-21 19:32:00', 0, NULL),
(38, 183, 6, 0, NULL, 26000.00, 1000.00, 2000.00, 'cancelled', 'unpaid', 12, 'Asmah', NULL, NULL, NULL, '2026-08-21 16:16:06', '2026-08-21 16:16:31', 0, NULL);

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
(6, 6, 5, 1, 10000.00, 10000.00, NULL, '2026-08-10 12:05:59', '2026-08-10 12:05:59'),
(7, 7, 7, 3, 17000.00, 51000.00, NULL, '2026-08-18 16:17:53', '2026-08-18 16:17:53'),
(8, 8, 8, 1, 22000.00, 22000.00, NULL, '2026-08-18 16:19:30', '2026-08-18 16:19:30'),
(13, 11, 7, 1, 18000.00, 18000.00, NULL, '2026-08-20 09:58:15', '2026-08-20 09:58:15'),
(14, 11, 8, 1, 23000.00, 23000.00, NULL, '2026-08-20 09:58:15', '2026-08-20 09:58:15'),
(15, 12, 9, 1, 13000.00, 13000.00, NULL, '2026-08-20 12:54:56', '2026-08-20 12:54:56'),
(16, 13, 7, 2, 18000.00, 36000.00, NULL, '2026-08-20 13:01:58', '2026-08-20 13:01:58'),
(17, 14, 9, 1, 13000.00, 13000.00, NULL, '2026-08-20 13:03:45', '2026-08-20 13:03:45'),
(18, 15, 16, 1, 16000.00, 16000.00, NULL, '2026-08-20 13:10:55', '2026-08-20 13:10:55'),
(19, 16, 10, 1, 13000.00, 13000.00, NULL, '2026-08-20 13:35:59', '2026-08-20 13:35:59'),
(20, 17, 20, 1, 16000.00, 16000.00, 'Tidak pedas, tidak timun', '2026-08-20 15:11:48', '2026-08-20 15:11:48'),
(21, 18, 20, 1, 16000.00, 16000.00, 'Sumer, tidak pakai sayur tpi pakai timun', '2026-08-20 15:42:07', '2026-08-20 15:42:07'),
(22, 19, 11, 1, 13000.00, 13000.00, NULL, '2026-08-20 16:10:33', '2026-08-20 16:10:33'),
(23, 20, 48, 1, 13500.00, 13500.00, NULL, '2026-08-20 16:10:33', '2026-08-20 16:10:33'),
(24, 21, 19, 1, 13000.00, 13000.00, 'Sambel d sendirikan', '2026-08-20 16:46:24', '2026-08-20 16:46:24'),
(25, 22, 9, 1, 13000.00, 13000.00, NULL, '2026-08-21 10:23:28', '2026-08-21 10:23:28'),
(26, 23, 7, 1, 18000.00, 18000.00, NULL, '2026-08-21 10:30:13', '2026-08-21 10:30:13'),
(27, 24, 11, 1, 13000.00, 13000.00, NULL, '2026-08-21 11:31:57', '2026-08-21 11:31:57'),
(28, 25, 8, 1, 23000.00, 23000.00, NULL, '2026-08-21 14:12:19', '2026-08-21 14:12:19'),
(29, 26, 8, 1, 23000.00, 23000.00, NULL, '2026-08-21 14:13:00', '2026-08-21 14:13:00'),
(30, 27, 9, 1, 13000.00, 13000.00, NULL, '2026-08-21 14:47:00', '2026-08-21 14:47:00'),
(31, 28, 11, 1, 13000.00, 13000.00, NULL, '2026-08-21 14:55:32', '2026-08-21 14:55:32'),
(32, 29, 19, 1, 13000.00, 13000.00, NULL, '2026-08-21 15:03:21', '2026-08-21 15:03:21'),
(33, 30, 7, 1, 18000.00, 18000.00, NULL, '2026-08-21 15:15:49', '2026-08-21 15:15:49'),
(34, 31, 11, 1, 13000.00, 13000.00, NULL, '2026-08-21 15:18:34', '2026-08-21 15:18:34'),
(35, 32, 50, 1, 17500.00, 17500.00, NULL, '2026-08-21 15:25:24', '2026-08-21 15:25:24'),
(36, 33, 11, 1, 13000.00, 13000.00, NULL, '2026-08-21 15:38:50', '2026-08-21 15:38:50'),
(37, 33, 15, 1, 10000.00, 10000.00, NULL, '2026-08-21 15:38:50', '2026-08-21 15:38:50'),
(38, 34, 8, 1, 23000.00, 23000.00, NULL, '2026-08-21 15:38:50', '2026-08-21 15:38:50'),
(39, 35, 50, 1, 17500.00, 17500.00, NULL, '2026-08-21 15:38:50', '2026-08-21 15:38:50'),
(40, 36, 46, 1, 14000.00, 14000.00, NULL, '2026-08-21 15:38:50', '2026-08-21 15:38:50'),
(41, 37, 11, 16, 13000.00, 208000.00, 'LEVEL 1', '2026-08-21 16:14:08', '2026-08-21 16:14:08'),
(42, 38, 8, 1, 23000.00, 23000.00, NULL, '2026-08-21 16:16:06', '2026-08-21 16:16:06');

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
(35, 'App\\Domains\\Auth\\User', 2, 'auth_token', '1f21e6dc15771f0152c564a0d5dbdc7f8078f7f31c6e61477c2827ba34b4c189', '[\"*\"]', '2026-08-21 20:37:31', NULL, '2026-08-08 16:15:09', '2026-08-21 20:37:31'),
(37, 'App\\Domains\\Auth\\User', 2, 'auth_token', '37bcc83b2c632df22e02a92681c22fcbbc23f25a81ae2dacebb1cf9dfb43b268', '[\"*\"]', '2026-08-08 16:17:11', NULL, '2026-08-08 16:16:09', '2026-08-08 16:17:11'),
(49, 'App\\Domains\\Auth\\User', 2, 'auth_token', '00fb297b38d7645b8210a0627cbc675cc2a8c9b3a4f4ec8138a735939157341a', '[\"*\"]', '2026-08-09 15:40:02', NULL, '2026-08-09 15:39:21', '2026-08-09 15:40:02'),
(50, 'App\\Domains\\Auth\\User', 2, 'auth_token', '0056c234bec6ca413b1a4376f15a7bd8953fda3ca3cdcba2f9655eb930fa47eb', '[\"*\"]', '2026-08-09 15:49:15', NULL, '2026-08-09 15:39:34', '2026-08-09 15:49:15'),
(51, 'App\\Domains\\Auth\\User', 2, 'auth_token', '5a9337dea07a7b74775d89d4b213b2910a7faa6e1d532b993faa3af30d11735a', '[\"*\"]', '2026-08-09 15:53:24', NULL, '2026-08-09 15:40:36', '2026-08-09 15:53:24'),
(52, 'App\\Domains\\Auth\\User', 2, 'auth_token', '99391b6c5d898adf8c3e4d7f84ae594beb073ea280c6360961ca5bbc7abe6e43', '[\"*\"]', '2026-08-09 16:08:11', NULL, '2026-08-09 15:40:52', '2026-08-09 16:08:11'),
(53, 'App\\Domains\\Auth\\User', 2, 'auth_token', '04991402fbd9909cb2634d79af1c13ed1d8b1e3c1cdb4f84b49a276f6e7b9e66', '[\"*\"]', '2026-08-17 20:12:29', NULL, '2026-08-09 15:42:10', '2026-08-17 20:12:29'),
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
(85, 'App\\Domains\\Auth\\User', 10, 'impersonation_token', 'fc53f13a256125307fb4fc48214776fdd0b150b1ac072ad6abbdfbadb95f55f5', '[\"*\"]', '2026-08-10 12:34:18', NULL, '2026-08-10 12:18:41', '2026-08-10 12:34:18'),
(86, 'App\\Domains\\Auth\\User', 15, 'auth_token', 'f187f63e01d894d0ee41b784a1c58ed939174772b2e82b0c442002ec0651ef3f', '[\"*\"]', '2026-08-17 20:09:52', NULL, '2026-08-17 19:51:16', '2026-08-17 20:09:52'),
(89, 'App\\Domains\\Auth\\User', 2, 'auth_token', 'f1640b49768df40f297abe5250cabba6d8714dac30741809414aaaf53a820230', '[\"*\"]', '2026-08-17 20:24:46', NULL, '2026-08-17 20:10:06', '2026-08-17 20:24:46'),
(92, 'App\\Domains\\Auth\\User', 16, 'auth_token', '0a4127b1ecde723d6f379b24e8c08e51169ffb78df3f3fc103e28cf1e0ac3037', '[\"*\"]', '2026-08-18 15:59:19', NULL, '2026-08-17 20:16:08', '2026-08-18 15:59:19'),
(95, 'App\\Domains\\Auth\\User', 2, 'auth_token', '40da7a918ec1c78e46617388b4a5006540b57c511788e6df72f33f964e4cfb5c', '[\"*\"]', '2026-08-17 20:25:45', NULL, '2026-08-17 20:25:22', '2026-08-17 20:25:45'),
(96, 'App\\Domains\\Auth\\User', 10, 'auth_token', 'a6fc1e98a9f6851ab03c9383ff8c5ce1a63fc4893dcb818579d2f961cf5aa559', '[\"*\"]', '2026-08-20 19:09:30', NULL, '2026-08-17 20:25:52', '2026-08-20 19:09:30'),
(97, 'App\\Domains\\Auth\\User', 2, 'auth_token', 'cdb825d012e1c3c67f4706a8c4a24326eaa04edff21aa7bce889128e2bf675cd', '[\"*\"]', '2026-08-18 15:04:03', NULL, '2026-08-18 15:02:02', '2026-08-18 15:04:03'),
(98, 'App\\Domains\\Auth\\User', 10, 'auth_token', '21a1a25ddbc08c31063a74dd2bafd06b09656c2857cb4894390bb3ad26cc775d', '[\"*\"]', '2026-08-18 15:35:18', NULL, '2026-08-18 15:04:17', '2026-08-18 15:35:18'),
(99, 'App\\Domains\\Auth\\User', 2, 'auth_token', 'be87a2cd75dc322fcff68fa7b93bfc59cb28c74c8e92aeccc738d0b928aee923', '[\"*\"]', '2026-08-18 15:36:15', NULL, '2026-08-18 15:35:29', '2026-08-18 15:36:15'),
(100, 'App\\Domains\\Auth\\User', 10, 'auth_token', '0365a61029b57f68fd3ca7a0104511d841420cf3d023c8006b9429b68078ff2b', '[\"*\"]', '2026-08-18 15:45:06', NULL, '2026-08-18 15:36:25', '2026-08-18 15:45:06'),
(101, 'App\\Domains\\Auth\\User', 2, 'auth_token', '65fa19d75fe25d95720fe65855d2d84e5c3dc3c6688e9cfed14440e60c7d4745', '[\"*\"]', '2026-08-18 16:02:47', NULL, '2026-08-18 16:02:07', '2026-08-18 16:02:47'),
(102, 'App\\Domains\\Auth\\User', 16, 'auth_token', '338a7cffa8b524c216e306464bba00df57720445b88767b6484c43eeea795285', '[\"*\"]', '2026-08-18 16:03:35', NULL, '2026-08-18 16:03:21', '2026-08-18 16:03:35'),
(103, 'App\\Domains\\Auth\\User', 16, 'auth_token', 'aa1b3aab12047c5cf7882dac4ec0793f90557aab6d11f89db7df1b9071d510d4', '[\"*\"]', '2026-08-18 16:33:28', NULL, '2026-08-18 16:12:09', '2026-08-18 16:33:28'),
(104, 'App\\Domains\\Auth\\User', 16, 'auth_token', '49134728e20d57921936e3f930e0bc8dd75893300552056d2d1cd209096fd6b3', '[\"*\"]', '2026-08-18 18:59:41', NULL, '2026-08-18 16:15:41', '2026-08-18 18:59:41'),
(105, 'App\\Domains\\Auth\\User', 17, 'auth_token', 'e906d071aec20a98f3e54944828b237d9a46976ec37098f9bb435094befa600d', '[\"*\"]', '2026-08-20 09:48:51', NULL, '2026-08-18 16:36:19', '2026-08-20 09:48:51'),
(106, 'App\\Domains\\Auth\\User', 18, 'auth_token', '458af9a3ef815b859688104815451ddfb2e0926d82c55d88c68976cd2fa61a24', '[\"*\"]', '2026-08-20 00:11:45', NULL, '2026-08-18 19:21:06', '2026-08-20 00:11:45'),
(107, 'App\\Domains\\Auth\\User', 2, 'auth_token', '448d17d60e79d7208341d35cdbcbc500885b04ba1bcbe7af27caf6ddce338f97', '[\"*\"]', '2026-08-19 12:58:42', NULL, '2026-08-19 12:58:08', '2026-08-19 12:58:42'),
(108, 'App\\Domains\\Auth\\User', 10, 'auth_token', 'fcecee40d770f26a4c50f0123d0c482e905d8031a53a1cee43709e06e812e2b8', '[\"*\"]', '2026-08-19 13:09:38', NULL, '2026-08-19 12:59:02', '2026-08-19 13:09:38'),
(109, 'App\\Domains\\Auth\\User', 10, 'auth_token', '988d918cfd464f1bdb32234926f938faf084f1c60b8f96d8e665a90ba708cbce', '[\"*\"]', '2026-08-19 19:01:13', NULL, '2026-08-19 18:38:17', '2026-08-19 19:01:13'),
(110, 'App\\Domains\\Auth\\User', 2, 'auth_token', '19e924b053880da40b1d6aa3e5dc8f60f3010d4445440fed9e362d992965f14f', '[\"*\"]', '2026-08-19 19:02:47', NULL, '2026-08-19 19:01:24', '2026-08-19 19:02:47'),
(111, 'App\\Domains\\Auth\\User', 2, 'auth_token', '8c518f10dca3e74d66dfae99fe74296e981ca75ab2341b7493c333ee5725e00c', '[\"*\"]', '2026-08-19 19:21:44', NULL, '2026-08-19 19:03:56', '2026-08-19 19:21:44'),
(112, 'App\\Domains\\Auth\\User', 10, 'auth_token', '640e9fbcce8b150f9803882b3585fb9477a0276788c4e803478a8b02f06e73bc', '[\"*\"]', '2026-08-19 20:19:56', NULL, '2026-08-19 19:05:19', '2026-08-19 20:19:56'),
(113, 'App\\Domains\\Auth\\User', 2, 'auth_token', 'b84a92059b43e6fb8e77be8a0cc45afdb630ea2384ba5ab92c8ed10b8c1b31ca', '[\"*\"]', '2026-08-19 20:57:31', NULL, '2026-08-19 20:42:15', '2026-08-19 20:57:31'),
(114, 'App\\Domains\\Auth\\User', 19, 'auth_token', '4a16de701c3062b2b5bf89975918c67995ef9705e2edd526d4883370863dc60b', '[\"*\"]', '2026-08-19 20:55:52', NULL, '2026-08-19 20:54:51', '2026-08-19 20:55:52'),
(115, 'App\\Domains\\Auth\\User', 20, 'auth_token', 'ad04d479f31b3d732f978ec8667958d1aa359c8b80b9db89b682e9ed979fbe40', '[\"*\"]', '2026-08-20 23:49:17', NULL, '2026-08-19 21:06:47', '2026-08-20 23:49:17'),
(116, 'App\\Domains\\Auth\\User', 21, 'auth_token', '7ea666bbb8f137af917286d9b1398b153c98223e8e2538d4165343b05660f3c9', '[\"*\"]', '2026-08-19 21:13:21', NULL, '2026-08-19 21:12:50', '2026-08-19 21:13:21'),
(117, 'App\\Domains\\Auth\\User', 21, 'auth_token', 'c358ea3968127d758226790c5c935583a3649b5a2dfbcdab6ccbf21b675c421b', '[\"*\"]', '2026-08-19 21:14:11', NULL, '2026-08-19 21:13:49', '2026-08-19 21:14:11'),
(118, 'App\\Domains\\Auth\\User', 22, 'auth_token', 'fb4451c757ff70cbbb14e137d89149b7a9b37a8cc40566292a5ffb0869986447', '[\"*\"]', '2026-08-19 22:05:58', NULL, '2026-08-19 21:14:22', '2026-08-19 22:05:58'),
(119, 'App\\Domains\\Auth\\User', 23, 'auth_token', 'fd35876d882974a5aacd1b97105a70153a2284cbf7ced5bb436a12bbb4efa29b', '[\"*\"]', '2026-08-19 21:34:35', NULL, '2026-08-19 21:19:16', '2026-08-19 21:34:35'),
(120, 'App\\Domains\\Auth\\User', 24, 'auth_token', '32c03b0aef6a5fd177997aa33e752a698836044e722a72b28ac94629cdfe71ca', '[\"*\"]', '2026-08-19 21:30:12', NULL, '2026-08-19 21:19:52', '2026-08-19 21:30:12'),
(121, 'App\\Domains\\Auth\\User', 25, 'auth_token', '98627556305dacbd389699a3685f1369c39b8b0343b248a46d7a73a0e5fdacfa', '[\"*\"]', '2026-08-19 21:28:17', NULL, '2026-08-19 21:27:05', '2026-08-19 21:28:17'),
(122, 'App\\Domains\\Auth\\User', 26, 'auth_token', '24fb55b368cb277551544231263b15cc90dfae45df539adf801d62763d0a69ca', '[\"*\"]', '2026-08-19 21:35:58', NULL, '2026-08-19 21:33:14', '2026-08-19 21:35:58'),
(123, 'App\\Domains\\Auth\\User', 27, 'auth_token', '5f03c343141eaf49155895ae92b771307175a155fa6cb3aa6b56c2a4cfc3290d', '[\"*\"]', '2026-08-19 22:04:09', NULL, '2026-08-19 21:35:32', '2026-08-19 22:04:09'),
(124, 'App\\Domains\\Auth\\User', 28, 'auth_token', 'e928b9f5f6ab0939015f3ebc274ead20b74f859baac6dd29a394b02dd88038de', '[\"*\"]', '2026-08-19 21:37:35', NULL, '2026-08-19 21:36:38', '2026-08-19 21:37:35'),
(125, 'App\\Domains\\Auth\\User', 29, 'auth_token', '1114f3f64d3941e1c7d7b27649399e65e1f4b8170bc65061cb1d1a461046ca3d', '[\"*\"]', '2026-08-19 21:46:49', NULL, '2026-08-19 21:37:43', '2026-08-19 21:46:49'),
(126, 'App\\Domains\\Auth\\User', 23, 'auth_token', 'dc621cdef46a4792ef6b8261b929d6203ac59331dcada7ce64ca5ff7e6113907', '[\"*\"]', '2026-08-20 17:13:41', NULL, '2026-08-19 21:38:02', '2026-08-20 17:13:41'),
(127, 'App\\Domains\\Auth\\User', 30, 'auth_token', 'f7589e6b59548c2bf010142467606d0626b449cc771394a4b802d2d3841ed49f', '[\"*\"]', '2026-08-19 21:41:11', NULL, '2026-08-19 21:38:09', '2026-08-19 21:41:11'),
(128, 'App\\Domains\\Auth\\User', 28, 'auth_token', '6d874a5f6fbdcb46329f8b3a6f8a71b6469b1abb2e091b8e2bc4aa39165dd793', '[\"*\"]', '2026-08-19 21:42:01', NULL, '2026-08-19 21:39:57', '2026-08-19 21:42:01'),
(129, 'App\\Domains\\Auth\\User', 28, 'auth_token', '745237a9d53f9f480f28c04b0587b40ace2450c37b020b9e3adf16ae859009c6', '[\"*\"]', '2026-08-19 21:45:26', NULL, '2026-08-19 21:43:16', '2026-08-19 21:45:26'),
(130, 'App\\Domains\\Auth\\User', 31, 'auth_token', '18d12d8b99973a3d7909714f3dc5fc65d7813cf809f33c1b8489a5b94d6af327', '[\"*\"]', '2026-08-19 21:44:31', NULL, '2026-08-19 21:43:47', '2026-08-19 21:44:31'),
(131, 'App\\Domains\\Auth\\User', 32, 'auth_token', 'cc51bb03cdb053eede18f263e401edd1cd03600c3ce2a8c51974a430b4ec9bb1', '[\"*\"]', '2026-08-19 21:53:04', NULL, '2026-08-19 21:50:07', '2026-08-19 21:53:04'),
(132, 'App\\Domains\\Auth\\User', 33, 'auth_token', 'cc420297825cfd99109583e2f1b5f712ce1dd19c8bffbb1fe4fd6a1f9b9dbc26', '[\"*\"]', '2026-08-19 21:54:05', NULL, '2026-08-19 21:52:56', '2026-08-19 21:54:05'),
(133, 'App\\Domains\\Auth\\User', 32, 'auth_token', '794fbe0cff28fc6137e7b9e734d7d2e0800c129532b8b8a219b5036667bdf6bc', '[\"*\"]', '2026-08-19 21:57:57', NULL, '2026-08-19 21:53:49', '2026-08-19 21:57:57'),
(134, 'App\\Domains\\Auth\\User', 33, 'auth_token', '319210363b3b005a51deee6ab04187255807c3edceb8d42c58c7ae9955cb6b43', '[\"*\"]', '2026-08-19 21:54:16', NULL, '2026-08-19 21:54:15', '2026-08-19 21:54:16'),
(135, 'App\\Domains\\Auth\\User', 34, 'auth_token', '0381d66d142b39af777f084f57b5e9717a5083416c1774b5e5361a71289541c9', '[\"*\"]', '2026-08-19 22:02:50', NULL, '2026-08-19 21:55:56', '2026-08-19 22:02:50'),
(136, 'App\\Domains\\Auth\\User', 34, 'auth_token', 'd2b4814e4c0aecbcf1586a40686164c4a552dcdf99068fbcab9c68e0175f37d0', '[\"*\"]', '2026-08-19 22:05:37', NULL, '2026-08-19 22:04:14', '2026-08-19 22:05:37'),
(137, 'App\\Domains\\Auth\\User', 34, 'auth_token', '55ef1d5c4df22b12fa23080b4b7e83957d3e2724c67b337c67c3bb1713b63247', '[\"*\"]', '2026-08-19 22:09:32', NULL, '2026-08-19 22:06:28', '2026-08-19 22:09:32'),
(138, 'App\\Domains\\Auth\\User', 35, 'auth_token', '28f4d096fa750589846181ae2fdef10f691cba29f3a09b065868ab3e9c6aa435', '[\"*\"]', '2026-08-19 23:31:32', NULL, '2026-08-19 22:06:54', '2026-08-19 23:31:32'),
(139, 'App\\Domains\\Auth\\User', 36, 'auth_token', '1818d2ee7573b2ab76a313e208de0dd03dcadfe142a1e3bb0cca1cc8850cc69a', '[\"*\"]', '2026-08-19 22:09:25', NULL, '2026-08-19 22:08:06', '2026-08-19 22:09:25'),
(140, 'App\\Domains\\Auth\\User', 37, 'auth_token', '5011d3982979ed18644672d4f89268f1c8949354524169ba673c8374aa2852bc', '[\"*\"]', '2026-08-19 22:19:41', NULL, '2026-08-19 22:19:10', '2026-08-19 22:19:41'),
(141, 'App\\Domains\\Auth\\User', 38, 'auth_token', 'e7a8e4e6c3ba33acd205a3448fa2c2cf0d456cab9e564c01da707165e80f84f0', '[\"*\"]', '2026-08-19 22:23:06', NULL, '2026-08-19 22:22:14', '2026-08-19 22:23:06'),
(142, 'App\\Domains\\Auth\\User', 39, 'auth_token', '703b30d0d5d30c4bceb5dd66febbf13c7e5ecb067e5f12316fc0121e63783c68', '[\"*\"]', '2026-08-19 22:45:31', NULL, '2026-08-19 22:22:29', '2026-08-19 22:45:31'),
(143, 'App\\Domains\\Auth\\User', 40, 'auth_token', 'e180f6d5542ecdd90e7df5961ace772e3c94aaf991124e8bd9290bbe37b16447', '[\"*\"]', '2026-08-19 22:24:03', NULL, '2026-08-19 22:23:38', '2026-08-19 22:24:03'),
(144, 'App\\Domains\\Auth\\User', 39, 'auth_token', '283e0e84eca39cac1cb21da71dbbf6b8ecf3795b7ce0dbdf535f873185e892fa', '[\"*\"]', '2026-08-19 22:48:19', NULL, '2026-08-19 22:27:51', '2026-08-19 22:48:19'),
(145, 'App\\Domains\\Auth\\User', 41, 'auth_token', '42d3eaa3d32a228ba7e29f9a1a12c8953b6d5e59e98eb50e30fc7f6b1f79cdb2', '[\"*\"]', '2026-08-19 22:48:13', NULL, '2026-08-19 22:34:40', '2026-08-19 22:48:13'),
(146, 'App\\Domains\\Auth\\User', 42, 'auth_token', '43fabbb5b5ad8475bb123594a01b8be4269b3541d9bac576b69ef7413f21aed0', '[\"*\"]', '2026-08-19 22:55:53', NULL, '2026-08-19 22:35:50', '2026-08-19 22:55:53'),
(147, 'App\\Domains\\Auth\\User', 39, 'auth_token', '57c6dff92d51832e0a41c99f3366164846d2f1b1fc00b937b24faa199180cd74', '[\"*\"]', '2026-08-19 23:05:38', NULL, '2026-08-19 22:45:43', '2026-08-19 23:05:38'),
(148, 'App\\Domains\\Auth\\User', 39, 'auth_token', '6518d061ac406bcff928fcdc5a76434983d348a323159d2139e601232483b7f4', '[\"*\"]', '2026-08-21 13:32:45', NULL, '2026-08-19 22:48:28', '2026-08-21 13:32:45'),
(149, 'App\\Domains\\Auth\\User', 43, 'auth_token', '9bbe7abed7c26df174475cd9c5cab270941b0e10234ca0ab8c41fb012b0efd18', '[\"*\"]', '2026-08-19 22:51:37', NULL, '2026-08-19 22:48:39', '2026-08-19 22:51:37'),
(150, 'App\\Domains\\Auth\\User', 41, 'auth_token', '238e3498b92fdc08b8c5fa80c41fee22431feda71156bd9c1df54c80439877db', '[\"*\"]', '2026-08-19 22:49:03', NULL, '2026-08-19 22:48:58', '2026-08-19 22:49:03'),
(151, 'App\\Domains\\Auth\\User', 44, 'auth_token', '12660dd2f6430bbcaeda11306a6318f69e3d7f3b8460c7e6f8078d8d7c15cc60', '[\"*\"]', '2026-08-19 23:13:51', NULL, '2026-08-19 22:54:14', '2026-08-19 23:13:51'),
(152, 'App\\Domains\\Auth\\User', 45, 'auth_token', 'c2f65ee56ad6ddf3898ad0792f7a13f3937c8f803fbd3d697d1cb5af0a6065ef', '[\"*\"]', '2026-08-19 23:07:00', NULL, '2026-08-19 23:00:11', '2026-08-19 23:07:00'),
(153, 'App\\Domains\\Auth\\User', 27, 'auth_token', 'a61b2c73d1c9a95a49a75e9154e21f1bcd26024bbd4c41aadd26a2b7650a6c8a', '[\"*\"]', '2026-08-19 23:20:24', NULL, '2026-08-19 23:14:41', '2026-08-19 23:20:24'),
(154, 'App\\Domains\\Auth\\User', 46, 'auth_token', 'b7b8c3a3e7e4d0fa024d7d0173ce7db25e65b48a943d6eacf1d994a2dc8a03d7', '[\"*\"]', '2026-08-19 23:20:58', NULL, '2026-08-19 23:20:03', '2026-08-19 23:20:58'),
(155, 'App\\Domains\\Auth\\User', 47, 'auth_token', '9424eab4acf07e1162c5222b64704b933d47337798226cb5827c1b358fbe3c99', '[\"*\"]', '2026-08-19 23:30:02', NULL, '2026-08-19 23:24:45', '2026-08-19 23:30:02'),
(156, 'App\\Domains\\Auth\\User', 16, 'auth_token', '76da95bcaea96c531a2e0676bc79748845309eac38eca0d9920f739783230da6', '[\"*\"]', '2026-08-20 08:20:08', NULL, '2026-08-20 00:12:12', '2026-08-20 08:20:08'),
(157, 'App\\Domains\\Auth\\User', 48, 'auth_token', '74663eb13f0d172067740e8fc9b08786a21a19b4e3358fcf067ecf73dab8bba4', '[\"*\"]', '2026-08-20 03:39:52', NULL, '2026-08-20 03:39:20', '2026-08-20 03:39:52'),
(158, 'App\\Domains\\Auth\\User', 32, 'auth_token', 'bb5264401b615b7cafd5d5d0c7f02f11283d9548b5a5139b2f366231bbcc18f1', '[\"*\"]', '2026-08-20 04:01:12', NULL, '2026-08-20 04:01:06', '2026-08-20 04:01:12'),
(159, 'App\\Domains\\Auth\\User', 49, 'auth_token', '038ca46165bc9c470b0fe4806c91da6f7322bd730fb8a9a14361eb9fd2691006', '[\"*\"]', '2026-08-20 05:07:49', NULL, '2026-08-20 05:03:19', '2026-08-20 05:07:49'),
(160, 'App\\Domains\\Auth\\User', 49, 'auth_token', 'a6b497188f963873f3fdb961561f0031a8b860eb4c5c5d8dca31e62bb158e70d', '[\"*\"]', '2026-08-21 13:42:48', NULL, '2026-08-20 05:08:06', '2026-08-21 13:42:48'),
(161, 'App\\Domains\\Auth\\User', 50, 'auth_token', '77246c51d809677d1beb3ca67b656cc53aa3c04ca2cd60cfd2e837f1631d6c75', '[\"*\"]', '2026-08-20 05:26:02', NULL, '2026-08-20 05:11:58', '2026-08-20 05:26:02'),
(162, 'App\\Domains\\Auth\\User', 51, 'auth_token', 'b2a0ba8bb6d415da17292956ba00c761fd790cac7c52b1a7e02b38ff03fb0f33', '[\"*\"]', '2026-08-20 06:30:05', NULL, '2026-08-20 05:26:09', '2026-08-20 06:30:05'),
(163, 'App\\Domains\\Auth\\User', 50, 'auth_token', 'd022a4471a065a818e144ae622c37d3fc62632c2c87836687c184ce99c0fb6ce', '[\"*\"]', '2026-08-20 05:27:51', NULL, '2026-08-20 05:27:11', '2026-08-20 05:27:51'),
(164, 'App\\Domains\\Auth\\User', 2, 'auth_token', 'ce20e9b152bf1f2927a1aef131412f7c008bb515dc344f4411e875f4198fd0db', '[\"*\"]', '2026-08-20 05:43:02', NULL, '2026-08-20 05:39:20', '2026-08-20 05:43:02'),
(165, 'App\\Domains\\Auth\\User', 10, 'auth_token', '01b1198e24673d77604645a5069266f6d79b1b568aa84fa8487a3c596a6f38aa', '[\"*\"]', '2026-08-20 07:19:54', NULL, '2026-08-20 05:40:03', '2026-08-20 07:19:54'),
(166, 'App\\Domains\\Auth\\User', 52, 'auth_token', '247b05379347443920dfe4f9c2dd9c5e07cd85db9830d8087be7f6a5ddc72d34', '[\"*\"]', '2026-08-20 05:47:02', NULL, '2026-08-20 05:41:38', '2026-08-20 05:47:02'),
(167, 'App\\Domains\\Auth\\User', 28, 'auth_token', '88909721382ea46d83d30ed337ee2b9169b7c1104b0920e62f416fbb32299448', '[\"*\"]', '2026-08-20 05:59:19', NULL, '2026-08-20 05:55:02', '2026-08-20 05:59:19'),
(168, 'App\\Domains\\Auth\\User', 53, 'auth_token', '669466fec7c82c22d880eb0498506b3c22b2149554f91320af1379e3f6fa2bae', '[\"*\"]', '2026-08-20 09:42:53', NULL, '2026-08-20 06:12:01', '2026-08-20 09:42:53'),
(169, 'App\\Domains\\Auth\\User', 54, 'auth_token', '13417708cb0fe4f9f1f5b1095d66d9891b754ac64fc524b9d1a04ccd1cefee59', '[\"*\"]', '2026-08-20 06:49:14', NULL, '2026-08-20 06:48:05', '2026-08-20 06:49:14'),
(170, 'App\\Domains\\Auth\\User', 55, 'auth_token', 'd5368d6830fb0c33d70c8faefa0249847aa2f6dd4302aa2616c4e221b9e15755', '[\"*\"]', '2026-08-20 07:17:04', NULL, '2026-08-20 07:15:54', '2026-08-20 07:17:04'),
(171, 'App\\Domains\\Auth\\User', 55, 'auth_token', '92204f69d4761b1401681aa2b74e11d3e3f280a49bd460e2d325cdcfefb1a5de', '[\"*\"]', '2026-08-20 07:17:40', NULL, '2026-08-20 07:17:34', '2026-08-20 07:17:40'),
(172, 'App\\Domains\\Auth\\User', 55, 'auth_token', '70530de14e44511b00e706ffb46c8445ba3a0d9eb3a08b16e9477724c92a3e2e', '[\"*\"]', '2026-08-21 12:06:32', NULL, '2026-08-20 07:17:55', '2026-08-21 12:06:32'),
(173, 'App\\Domains\\Auth\\User', 28, 'auth_token', '50f9b9af53179a571073c2728c11ab97a0cca823d07730212fd0ccc1f11830f4', '[\"*\"]', '2026-08-21 07:03:43', NULL, '2026-08-20 07:23:37', '2026-08-21 07:03:43'),
(174, 'App\\Domains\\Auth\\User', 56, 'auth_token', '82690de0d8337008905f13e3a9d900e19b9de40274676b7d6bd5382aa24d8590', '[\"*\"]', '2026-08-20 07:28:39', NULL, '2026-08-20 07:24:34', '2026-08-20 07:28:39'),
(175, 'App\\Domains\\Auth\\User', 44, 'auth_token', '27a3c3ff34c3651aa10dcc8fbb0a65677a3d1b37a3169d6bb1a3fead7ee9872c', '[\"*\"]', '2026-08-20 07:48:30', NULL, '2026-08-20 07:48:29', '2026-08-20 07:48:30'),
(176, 'App\\Domains\\Auth\\User', 44, 'auth_token', '95963e5643fc7dfae484a0a76b0067582750ca5ad93f238ca48a483cbabee174', '[\"*\"]', '2026-08-20 07:50:12', NULL, '2026-08-20 07:48:59', '2026-08-20 07:50:12'),
(177, 'App\\Domains\\Auth\\User', 57, 'auth_token', '6ccabcdc2581679947761116cdd049575c8ac6bc85237b1e0e001a9edaf17ec7', '[\"*\"]', '2026-08-20 08:35:19', NULL, '2026-08-20 07:52:58', '2026-08-20 08:35:19'),
(178, 'App\\Domains\\Auth\\User', 30, 'auth_token', 'c80ef5f432589f1ee0ab546334e8c6c621bc0aaa985b0d5853f3948bece50d60', '[\"*\"]', '2026-08-20 07:56:42', NULL, '2026-08-20 07:55:27', '2026-08-20 07:56:42'),
(179, 'App\\Domains\\Auth\\User', 58, 'auth_token', 'e66ea99c311112ce2eaff47b750fefbafc3692446f2d9bdf719e4050abba22a9', '[\"*\"]', '2026-08-21 15:25:24', NULL, '2026-08-20 08:05:54', '2026-08-21 15:25:24'),
(180, 'App\\Domains\\Auth\\User', 44, 'auth_token', '6da54015f0b3fad9cec8b2598fbfae685662b3bf513680adaed113112784bd86', '[\"*\"]', '2026-08-20 08:14:25', NULL, '2026-08-20 08:10:37', '2026-08-20 08:14:25'),
(181, 'App\\Domains\\Auth\\User', 59, 'auth_token', 'fa1f60dd9c4d929d689418d760d39ac0efe6272d6e32da1c3490a6797ba6b719', '[\"*\"]', '2026-08-20 08:26:52', NULL, '2026-08-20 08:14:25', '2026-08-20 08:26:52'),
(182, 'App\\Domains\\Auth\\User', 60, 'auth_token', 'b0eaac55a06542b266cd598ebf5eb694557060e7775547c137a3effb1e4f3b51', '[\"*\"]', '2026-08-20 08:55:08', NULL, '2026-08-20 08:18:07', '2026-08-20 08:55:08'),
(183, 'App\\Domains\\Auth\\User', 61, 'auth_token', 'dd87d9a95957ec4e9e378485f8cdf41327ceed5c2802114492c9d804375c45b4', '[\"*\"]', '2026-08-20 20:27:48', NULL, '2026-08-20 08:18:53', '2026-08-20 20:27:48'),
(184, 'App\\Domains\\Auth\\User', 48, 'auth_token', '3666d7c7933b338f7574e034b04206dcf6416312472eabaeecf8c6489c001c01', '[\"*\"]', '2026-08-20 08:27:07', NULL, '2026-08-20 08:23:10', '2026-08-20 08:27:07'),
(185, 'App\\Domains\\Auth\\User', 59, 'auth_token', 'e5d99ceb9e5c8c000087ff7ad0a1ebad6da50b8afde7f3c795863cf1361ba9e9', '[\"*\"]', '2026-08-20 08:27:37', NULL, '2026-08-20 08:26:59', '2026-08-20 08:27:37'),
(186, 'App\\Domains\\Auth\\User', 44, 'auth_token', '3ff08e05b449fd87dfd8ca4d9fc534f836ac8061f09d770dd55d68c8c1da9bf0', '[\"*\"]', '2026-08-20 08:28:32', NULL, '2026-08-20 08:28:32', '2026-08-20 08:28:32'),
(187, 'App\\Domains\\Auth\\User', 44, 'auth_token', 'd99461ba0a488ad8ab0aa6697f05ff87b612fedc353aa89e4af582b48a944762', '[\"*\"]', '2026-08-20 08:59:27', NULL, '2026-08-20 08:28:44', '2026-08-20 08:59:27'),
(188, 'App\\Domains\\Auth\\User', 62, 'auth_token', 'e98239eadc218e7b032665439e5e13529a88078e393ffc111a4f87c876ab1108', '[\"*\"]', '2026-08-20 09:02:11', NULL, '2026-08-20 08:31:28', '2026-08-20 09:02:11'),
(189, 'App\\Domains\\Auth\\User', 57, 'auth_token', 'a90cac07bd323784177030a77aa88bfc72a0febceebcb87701e6341c9f7e1e61', '[\"*\"]', NULL, NULL, '2026-08-20 08:35:31', '2026-08-20 08:35:31'),
(190, 'App\\Domains\\Auth\\User', 63, 'auth_token', '3e18706e2f2303483ac05ecf455423717e62cf1bcc1f7e39b9c245a89924227e', '[\"*\"]', '2026-08-20 08:41:28', NULL, '2026-08-20 08:41:05', '2026-08-20 08:41:28'),
(191, 'App\\Domains\\Auth\\User', 63, 'auth_token', '3480cf349c0835b1d0af58505f7fbbe8b2e6909586a482a84b391361121f6cc8', '[\"*\"]', '2026-08-20 15:00:19', NULL, '2026-08-20 08:41:52', '2026-08-20 15:00:19'),
(192, 'App\\Domains\\Auth\\User', 64, 'auth_token', 'e1edd785080c64a3a7262f2af5e55c7444fdc70f6c58308e6135185403b9f92d', '[\"*\"]', '2026-08-20 08:43:33', NULL, '2026-08-20 08:42:16', '2026-08-20 08:43:33'),
(193, 'App\\Domains\\Auth\\User', 65, 'auth_token', 'd57c00278ddb2075a8979fd72a30a01c58d762d66d9ef5cf985fb80e55d11cd5', '[\"*\"]', '2026-08-20 11:18:00', NULL, '2026-08-20 08:42:31', '2026-08-20 11:18:00'),
(194, 'App\\Domains\\Auth\\User', 66, 'auth_token', 'e67fc29883f4b599d4b34a339413a6e8de07acf31aa55a85dc6cbafa658a744e', '[\"*\"]', '2026-08-20 11:00:55', NULL, '2026-08-20 08:43:49', '2026-08-20 11:00:55'),
(195, 'App\\Domains\\Auth\\User', 67, 'auth_token', 'da2339f00b78d08094fdfa097df0d49f07750d3cfc2c6259c5f0342f74b8d005', '[\"*\"]', '2026-08-20 09:02:41', NULL, '2026-08-20 08:49:38', '2026-08-20 09:02:41'),
(196, 'App\\Domains\\Auth\\User', 68, 'auth_token', '80a511284a9809f81eb322765acbd1a02c4a721eb4862e0dd50d835715afc3c6', '[\"*\"]', '2026-08-20 11:27:21', NULL, '2026-08-20 08:53:36', '2026-08-20 11:27:21'),
(197, 'App\\Domains\\Auth\\User', 69, 'auth_token', 'dfc62a3409ed83c5e464fb2c21857268786bc14f39108acae10e30ac3b0e4df8', '[\"*\"]', '2026-08-20 08:56:28', NULL, '2026-08-20 08:56:07', '2026-08-20 08:56:28'),
(198, 'App\\Domains\\Auth\\User', 29, 'auth_token', '8399544dface48a2ba514c5cead268c6a0408fec5b857ca54dfa4fde57a4404e', '[\"*\"]', '2026-08-20 08:57:21', NULL, '2026-08-20 08:56:15', '2026-08-20 08:57:21'),
(199, 'App\\Domains\\Auth\\User', 10, 'auth_token', '358d4f1cb0c0c5e175ec354b0d498a332473aba8b888e0754d95b29a1f90cad1', '[\"*\"]', '2026-08-20 08:57:50', NULL, '2026-08-20 08:57:39', '2026-08-20 08:57:50'),
(200, 'App\\Domains\\Auth\\User', 2, 'auth_token', 'f25c4709a2ba9c1145d2ba2755eaa5b84fe4e97870766f72a8b2d9c320ef539a', '[\"*\"]', '2026-08-20 09:02:47', NULL, '2026-08-20 08:58:03', '2026-08-20 09:02:47'),
(201, 'App\\Domains\\Auth\\User', 69, 'auth_token', 'a72c2a76a7d44965ab860c507ec351b93bef087417f53a809ce907337b702456', '[\"*\"]', '2026-08-20 08:58:42', NULL, '2026-08-20 08:58:07', '2026-08-20 08:58:42'),
(202, 'App\\Domains\\Auth\\User', 11, 'auth_token', 'f067d40720335631796f58bd4164bb20c83d51ff37f21efe8be6e1caccc9ce01', '[\"*\"]', '2026-08-20 12:16:57', NULL, '2026-08-20 09:03:56', '2026-08-20 12:16:57'),
(203, 'App\\Domains\\Auth\\User', 70, 'auth_token', 'cb30cc5440ac00d54c09fb6761b6912407f9a06d4b6e19bc070eddbc2880cf07', '[\"*\"]', '2026-08-20 09:04:33', NULL, '2026-08-20 09:04:28', '2026-08-20 09:04:33'),
(204, 'App\\Domains\\Auth\\User', 71, 'auth_token', 'f9f3f099156d311bb245d730f2cc0a2503a8fcb656c18a0e3b1045d43071e274', '[\"*\"]', '2026-08-20 09:31:44', NULL, '2026-08-20 09:08:41', '2026-08-20 09:31:44'),
(205, 'App\\Domains\\Auth\\User', 69, 'auth_token', 'fbfa06d884eff4b8eac85da46b62ab6988224ab2951ba5fead6ea589bf54de00', '[\"*\"]', '2026-08-20 09:11:58', NULL, '2026-08-20 09:11:06', '2026-08-20 09:11:58'),
(206, 'App\\Domains\\Auth\\User', 72, 'auth_token', '586d3732cc8e96e40af98fff524475d07ebc951f7e3fa15156caddddabe01ab6', '[\"*\"]', '2026-08-20 09:18:40', NULL, '2026-08-20 09:12:33', '2026-08-20 09:18:40'),
(207, 'App\\Domains\\Auth\\User', 73, 'auth_token', '24d65fa1e983607d66982ee4f0869d47145b1cdca2daa0f64dbfc7bd456857fe', '[\"*\"]', '2026-08-20 09:15:44', NULL, '2026-08-20 09:13:49', '2026-08-20 09:15:44'),
(208, 'App\\Domains\\Auth\\User', 74, 'auth_token', '8944690a74299fefe0e8617a1980ee79aeabeb93112c95b7874c6222d1b677d5', '[\"*\"]', '2026-08-20 09:16:45', NULL, '2026-08-20 09:13:51', '2026-08-20 09:16:45'),
(209, 'App\\Domains\\Auth\\User', 73, 'auth_token', 'a981bbb754031ea306396c08300fe3fa72b15b584c6b50b4d00727e357e9cdda', '[\"*\"]', '2026-08-20 09:16:26', NULL, '2026-08-20 09:16:26', '2026-08-20 09:16:26'),
(210, 'App\\Domains\\Auth\\User', 74, 'auth_token', 'fa78268957b27fac2ab4b5f460e6606a1d7cec8fe1ea6162480ca868281cbd86', '[\"*\"]', '2026-08-21 19:04:00', NULL, '2026-08-20 09:20:04', '2026-08-21 19:04:00'),
(211, 'App\\Domains\\Auth\\User', 75, 'auth_token', 'e3435461973e4cfbed73c0ac54ef61e989920e6f2af0459e4fe6c7451d2d4ab4', '[\"*\"]', '2026-08-20 11:02:18', NULL, '2026-08-20 09:30:40', '2026-08-20 11:02:18'),
(212, 'App\\Domains\\Auth\\User', 71, 'auth_token', 'e4660c4bc4aba5a07e0b2a8649e8dd1674eb072d1518f42dd50741c2bd391b78', '[\"*\"]', '2026-08-20 09:33:08', NULL, '2026-08-20 09:32:42', '2026-08-20 09:33:08'),
(213, 'App\\Domains\\Auth\\User', 76, 'auth_token', '1bb7cdf878d3f440e20097a9336e5a0803d68dc05c3fa1e0f6d0bd8e7ef1c85d', '[\"*\"]', '2026-08-20 09:37:20', NULL, '2026-08-20 09:36:11', '2026-08-20 09:37:20'),
(214, 'App\\Domains\\Auth\\User', 77, 'auth_token', 'e228fa8797e844c68eff8ff3ef5ee8042eb8109747e2948c5280a024b6379ad3', '[\"*\"]', '2026-08-20 09:40:51', NULL, '2026-08-20 09:40:23', '2026-08-20 09:40:51'),
(215, 'App\\Domains\\Auth\\User', 77, 'auth_token', 'c529283b88580b6ec9e5bc8a0adf3af314d47036cc33af0cbc77e6b34d2bf963', '[\"*\"]', '2026-08-20 09:46:03', NULL, '2026-08-20 09:43:05', '2026-08-20 09:46:03'),
(216, 'App\\Domains\\Auth\\User', 78, 'auth_token', 'dde0a31148298ff9b54f670a9932f0224318b9892a4ed03d048174bd04ce5c65', '[\"*\"]', '2026-08-20 09:52:02', NULL, '2026-08-20 09:43:42', '2026-08-20 09:52:02'),
(217, 'App\\Domains\\Auth\\User', 79, 'auth_token', '6a3d258b642e836369e21cb0373b417bfae5b0d0fc509d598d7b46e5759271c3', '[\"*\"]', '2026-08-20 09:52:38', NULL, '2026-08-20 09:47:05', '2026-08-20 09:52:38'),
(218, 'App\\Domains\\Auth\\User', 80, 'auth_token', '10114ca8eb2ee40991160e4ff7c29024075a78ec2f83dc1e6cb5651b93e5fc73', '[\"*\"]', NULL, NULL, '2026-08-20 09:49:12', '2026-08-20 09:49:12'),
(219, 'App\\Domains\\Auth\\User', 2, 'auth_token', '20b9db5da0a7d1befe8be814bf47f196d5fd8e05854d80a9141e707aabc4db79', '[\"*\"]', '2026-08-20 09:50:38', NULL, '2026-08-20 09:49:48', '2026-08-20 09:50:38'),
(220, 'App\\Domains\\Auth\\User', 77, 'auth_token', '2cbdeb7feaf1cf55e3062e0036afc6aa56ca0c2582de0c53b999b99dad97196f', '[\"*\"]', '2026-08-20 09:52:51', NULL, '2026-08-20 09:52:40', '2026-08-20 09:52:51'),
(221, 'App\\Domains\\Auth\\User', 81, 'auth_token', 'ac26af5dd30d105086f461e779ab3bd1b1d8e6140185e784e05bad97dd78aac7', '[\"*\"]', '2026-08-20 09:59:38', NULL, '2026-08-20 09:54:54', '2026-08-20 09:59:38'),
(222, 'App\\Domains\\Auth\\User', 82, 'auth_token', '12e1495b8805fdf483a691a34442cf0462cbc56e3bc8bc82c38d6955f7891e54', '[\"*\"]', '2026-08-20 09:59:35', NULL, '2026-08-20 09:58:11', '2026-08-20 09:59:35'),
(223, 'App\\Domains\\Auth\\User', 2, 'auth_token', '2f6ef97193fc3debf23024ce967454b918b44117ba68d85ac78a5c730c13e243', '[\"*\"]', '2026-08-20 10:30:50', NULL, '2026-08-20 10:02:56', '2026-08-20 10:30:50'),
(224, 'App\\Domains\\Auth\\User', 83, 'auth_token', 'ede8938a1d3df49995ba68da7177357ecd1427ba1b818d7472e7da6013231916', '[\"*\"]', '2026-08-20 12:49:16', NULL, '2026-08-20 10:04:50', '2026-08-20 12:49:16'),
(225, 'App\\Domains\\Auth\\User', 84, 'auth_token', '6b3ee9fdd1e9801177e668bea71251cf3a69ef73f08118b899964205ba354925', '[\"*\"]', '2026-08-20 10:35:18', NULL, '2026-08-20 10:34:08', '2026-08-20 10:35:18'),
(226, 'App\\Domains\\Auth\\User', 59, 'auth_token', 'df357a14f6d915e6f2df4fa49edb11ddf0d5e14e49e868ec99851408053ca201', '[\"*\"]', '2026-08-20 10:42:16', NULL, '2026-08-20 10:40:48', '2026-08-20 10:42:16'),
(227, 'App\\Domains\\Auth\\User', 85, 'auth_token', '9294fcbfdfdcd959eba1e131888eef8d9857c6a156dc7cb5c0a59bca8df3bfdb', '[\"*\"]', '2026-08-20 10:51:06', NULL, '2026-08-20 10:50:45', '2026-08-20 10:51:06'),
(228, 'App\\Domains\\Auth\\User', 85, 'auth_token', '9495b4f616f809f34b7b1cb5a7becd85163dba2a1c95b86c47a6c4fd213fa278', '[\"*\"]', '2026-08-20 10:55:05', NULL, '2026-08-20 10:54:56', '2026-08-20 10:55:05'),
(229, 'App\\Domains\\Auth\\User', 85, 'auth_token', '00b2d58324bccbb30420f8900cf0285d684faa386c1a18eb12c0b6beb683a807', '[\"*\"]', '2026-08-20 10:56:20', NULL, '2026-08-20 10:56:05', '2026-08-20 10:56:20'),
(230, 'App\\Domains\\Auth\\User', 86, 'auth_token', 'b2b93641ae129abc82d9bc2fb7e792a13d139572ca319693f7d942d49c1571e3', '[\"*\"]', '2026-08-20 11:09:03', NULL, '2026-08-20 11:02:08', '2026-08-20 11:09:03'),
(231, 'App\\Domains\\Auth\\User', 87, 'auth_token', '112e6bd0772fca325d8c9da50240e896717dee6a70356a91420306a1855c621f', '[\"*\"]', '2026-08-20 11:17:53', NULL, '2026-08-20 11:10:16', '2026-08-20 11:17:53'),
(232, 'App\\Domains\\Auth\\User', 87, 'auth_token', 'bd01ce9e445dfbba6df99a5c50ac910fe136c172edb9a7c40899f4126ec5b9e5', '[\"*\"]', '2026-08-21 09:31:06', NULL, '2026-08-20 11:18:08', '2026-08-21 09:31:06'),
(233, 'App\\Domains\\Auth\\User', 11, 'auth_token', '189e13956f9fba36c5c8aad75c7363fa9ad74f373e21ad97a1dd4c6186c4fd11', '[\"*\"]', '2026-08-20 11:35:52', NULL, '2026-08-20 11:31:28', '2026-08-20 11:35:52'),
(234, 'App\\Domains\\Auth\\User', 88, 'auth_token', '856f3a50ef0396e45d52b01b5a7c3fafd016cd1e1d93aa3a950acdd71b14643e', '[\"*\"]', '2026-08-20 11:44:05', NULL, '2026-08-20 11:40:06', '2026-08-20 11:44:05'),
(235, 'App\\Domains\\Auth\\User', 89, 'auth_token', '95c69e6d27a17fc0922fe7e52c1297c3754284432c7b1471e7fcf44fd0610c0e', '[\"*\"]', '2026-08-20 11:50:19', NULL, '2026-08-20 11:41:55', '2026-08-20 11:50:19'),
(236, 'App\\Domains\\Auth\\User', 39, 'auth_token', '9d7c0498c1700c23b128c70e7004493a03119c0c5c0543f02ca60cd3fea6f3d1', '[\"*\"]', '2026-08-20 11:43:44', NULL, '2026-08-20 11:41:59', '2026-08-20 11:43:44'),
(237, 'App\\Domains\\Auth\\User', 90, 'auth_token', 'afee064077610e9b6671cbb4c2894180e2c5a4012d0e7220d3c4ecf3dfbc4b79', '[\"*\"]', '2026-08-20 11:44:25', NULL, '2026-08-20 11:44:15', '2026-08-20 11:44:25'),
(238, 'App\\Domains\\Auth\\User', 33, 'auth_token', '44afabbfbdffd4ee471688b890dd695cbc82d7be70418d4ebae6ed83619405db', '[\"*\"]', '2026-08-20 11:55:38', NULL, '2026-08-20 11:44:38', '2026-08-20 11:55:38'),
(239, 'App\\Domains\\Auth\\User', 91, 'auth_token', 'c7ca9ee5e7c0f1f2d6eca031bc9e42965b6fd08459204faaa0f8fab5c61c8a8d', '[\"*\"]', '2026-08-20 12:05:59', NULL, '2026-08-20 12:00:46', '2026-08-20 12:05:59'),
(240, 'App\\Domains\\Auth\\User', 92, 'auth_token', 'e2e4d7fd1aecb3f9162c7ca5076dec2a919f37aa8f1456f9bcb8d0fb667d0b4e', '[\"*\"]', '2026-08-20 12:06:59', NULL, '2026-08-20 12:01:34', '2026-08-20 12:06:59'),
(241, 'App\\Domains\\Auth\\User', 93, 'auth_token', '0526fd8a9c5122e9d385e6d5ecfe1ac5cfd8faab6458a7eb7f4a1a2b8454e20d', '[\"*\"]', '2026-08-20 12:28:06', NULL, '2026-08-20 12:15:25', '2026-08-20 12:28:06'),
(242, 'App\\Domains\\Auth\\User', 94, 'auth_token', '56bd4259644316e9260afcfe1ef9516cbc83cd364d43faaca51f77a02252d858', '[\"*\"]', '2026-08-20 12:24:46', NULL, '2026-08-20 12:16:17', '2026-08-20 12:24:46'),
(243, 'App\\Domains\\Auth\\User', 10, 'auth_token', '70cc94ea0e692e0d39949e7b25367fc7dd13dc83101869c9f0a1b73afd9be0be', '[\"*\"]', '2026-08-20 12:40:22', NULL, '2026-08-20 12:18:00', '2026-08-20 12:40:22'),
(244, 'App\\Domains\\Auth\\User', 95, 'auth_token', '101e4ccac4d6c6b8a86af526edd098df5069eaa639660489f7dbdd9cfe247b3e', '[\"*\"]', '2026-08-20 13:18:00', NULL, '2026-08-20 12:26:37', '2026-08-20 13:18:00'),
(245, 'App\\Domains\\Auth\\User', 96, 'auth_token', '1f77d7ba14f006b5f8af42925cea4b37a34b39944f42eedabebe95afac28a030', '[\"*\"]', '2026-08-20 12:33:25', NULL, '2026-08-20 12:30:41', '2026-08-20 12:33:25'),
(246, 'App\\Domains\\Auth\\User', 2, 'auth_token', '50fc2f14567e9d848f8ea5b58949a0c685e73ab827cb2f6507be58a182b9deae', '[\"*\"]', '2026-08-20 12:34:00', NULL, '2026-08-20 12:33:44', '2026-08-20 12:34:00'),
(247, 'App\\Domains\\Auth\\User', 10, 'auth_token', 'f1d48a4214a21aa003d5a00dcc7dc75957ea353f722f4c5a3070f6c3e9c0d7fe', '[\"*\"]', '2026-08-20 12:35:59', NULL, '2026-08-20 12:34:23', '2026-08-20 12:35:59'),
(248, 'App\\Domains\\Auth\\User', 83, 'auth_token', 'e3ad49fabcded1da396f0f51af51f2d3c23ef0ded014785b5765cdc70bcdc38a', '[\"*\"]', '2026-08-20 12:57:44', NULL, '2026-08-20 12:50:02', '2026-08-20 12:57:44'),
(249, 'App\\Domains\\Auth\\User', 97, 'auth_token', '8a51bdcfabc1f62166721bdd956c6458eff437710259731a6daa421dcd9390ce', '[\"*\"]', '2026-08-20 12:58:29', NULL, '2026-08-20 12:52:44', '2026-08-20 12:58:29'),
(250, 'App\\Domains\\Auth\\User', 98, 'auth_token', 'a97aaa9f8e3db286706380911d3314de914a8ef0eb38f9c056ffef1225ff020c', '[\"*\"]', '2026-08-20 13:01:02', NULL, '2026-08-20 12:52:56', '2026-08-20 13:01:02'),
(251, 'App\\Domains\\Auth\\User', 89, 'auth_token', '2a5f1ee8e05f2c1c27d08ab9c640ba37f1c41e45e219e25d640814462defdecb', '[\"*\"]', '2026-08-20 13:27:21', NULL, '2026-08-20 12:53:18', '2026-08-20 13:27:21'),
(252, 'App\\Domains\\Auth\\User', 99, 'auth_token', '55580a69ef8ed85cd708414584ee7c42dc36078e5fc65bdb52932ae0a3a872a5', '[\"*\"]', '2026-08-20 12:57:30', NULL, '2026-08-20 12:57:09', '2026-08-20 12:57:30'),
(253, 'App\\Domains\\Auth\\User', 99, 'auth_token', '60c95f229f49648fb3012344ac8a7d074a651d02550c1c629b46c63fe5883b3c', '[\"*\"]', '2026-08-20 13:10:29', NULL, '2026-08-20 12:58:28', '2026-08-20 13:10:29'),
(254, 'App\\Domains\\Auth\\User', 93, 'auth_token', '8b29c0cfe776cc7c665dceb5ffa9abe4ba5169f13140b033af74e078fc1c1b8d', '[\"*\"]', '2026-08-20 13:20:26', NULL, '2026-08-20 13:03:20', '2026-08-20 13:20:26'),
(255, 'App\\Domains\\Auth\\User', 100, 'auth_token', 'e2f0409b5045757a3ea9ae13af63aa90f094982701d19c9dc105acd408198dc9', '[\"*\"]', '2026-08-20 13:16:27', NULL, '2026-08-20 13:07:16', '2026-08-20 13:16:27'),
(256, 'App\\Domains\\Auth\\User', 101, 'auth_token', '28c42621ef3f67efac69960dfe8b02627d027dc0378e20f020f6c352feb8c3b5', '[\"*\"]', '2026-08-20 19:05:18', NULL, '2026-08-20 13:12:03', '2026-08-20 19:05:18'),
(257, 'App\\Domains\\Auth\\User', 102, 'auth_token', 'a81226e78d45e4f2a800261944feefbe16e0bb9c650f467923dd604cbe595ecb', '[\"*\"]', '2026-08-20 13:20:46', NULL, '2026-08-20 13:17:43', '2026-08-20 13:20:46'),
(258, 'App\\Domains\\Auth\\User', 102, 'auth_token', '6d202f1816c5b65da4bb0e32a40c10cefc4b59374f15ad1210b0388705d3aeaa', '[\"*\"]', '2026-08-20 13:21:21', NULL, '2026-08-20 13:20:49', '2026-08-20 13:21:21'),
(259, 'App\\Domains\\Auth\\User', 102, 'auth_token', '0c34bd0f16c6a7346050dec012f3b03ded30c7e9f4a400e51d8b819e67793c42', '[\"*\"]', '2026-08-20 13:24:57', NULL, '2026-08-20 13:22:00', '2026-08-20 13:24:57'),
(260, 'App\\Domains\\Auth\\User', 102, 'auth_token', '06c034b61692bb52ac0a0f1630149bad652d273472cdeb3089808dc48345c2f1', '[\"*\"]', '2026-08-20 13:30:40', NULL, '2026-08-20 13:30:19', '2026-08-20 13:30:40'),
(261, 'App\\Domains\\Auth\\User', 102, 'auth_token', 'aa5dd854d0bcca34f93a597fc8c5ea00b53d962d4b5c155b4491f99f5d156bf4', '[\"*\"]', '2026-08-21 17:12:48', NULL, '2026-08-20 13:31:08', '2026-08-21 17:12:48'),
(262, 'App\\Domains\\Auth\\User', 75, 'auth_token', 'f789606033e0feb3b356a120724414b33e83a2945fe7d62359bda6c821bdfb0f', '[\"*\"]', '2026-08-21 20:51:24', NULL, '2026-08-20 13:33:33', '2026-08-21 20:51:24'),
(263, 'App\\Domains\\Auth\\User', 46, 'auth_token', '5f194947d120393d9d0689d4ccb94bc8e891022f21fe6ee49d3387c1986ef565', '[\"*\"]', '2026-08-20 14:24:28', NULL, '2026-08-20 14:20:31', '2026-08-20 14:24:28'),
(264, 'App\\Domains\\Auth\\User', 103, 'auth_token', '12c978dc78d96712380b164dfce1eed3b475cb36f316e10b2eb4da082460547d', '[\"*\"]', '2026-08-20 14:50:52', NULL, '2026-08-20 14:27:21', '2026-08-20 14:50:52'),
(265, 'App\\Domains\\Auth\\User', 104, 'auth_token', '74afba0890a92d6fcb752d0193bb1639aad9dd77f071c7d5821d8c2f0eb63a5a', '[\"*\"]', '2026-08-21 09:22:34', NULL, '2026-08-20 14:30:39', '2026-08-21 09:22:34'),
(266, 'App\\Domains\\Auth\\User', 103, 'auth_token', '1b54709c525342fe6355733a96bdd14965334666ee011d84c0aef61663896313', '[\"*\"]', '2026-08-20 14:51:56', NULL, '2026-08-20 14:51:00', '2026-08-20 14:51:56'),
(267, 'App\\Domains\\Auth\\User', 63, 'auth_token', 'c02838586664f4310929eb7e37d76680d5901345b3735dac48d7500b06796b31', '[\"*\"]', '2026-08-20 15:04:26', NULL, '2026-08-20 15:00:28', '2026-08-20 15:04:26'),
(268, 'App\\Domains\\Auth\\User', 21, 'auth_token', '6042637afb29693be7c733e405ea8b7b284670528ec70f00a0a10bfa4a8cb45e', '[\"*\"]', '2026-08-20 15:10:29', NULL, '2026-08-20 15:10:13', '2026-08-20 15:10:29'),
(269, 'App\\Domains\\Auth\\User', 21, 'auth_token', '47d6da522aeb6c6a492c367d2a30721526dfd48d675646839bcf4f47886703eb', '[\"*\"]', '2026-08-20 15:11:47', NULL, '2026-08-20 15:11:24', '2026-08-20 15:11:47'),
(270, 'App\\Domains\\Auth\\User', 105, 'auth_token', 'bd3a8b00ec9dabee7373d6894ba8736915b0e86aa50b19d4bbd83edc26d883aa', '[\"*\"]', '2026-08-20 15:16:19', NULL, '2026-08-20 15:15:55', '2026-08-20 15:16:19'),
(271, 'App\\Domains\\Auth\\User', 106, 'auth_token', '44e2d3dd92ae262143385885fffb8dcbbca6cf980485e87fe2405bd32405aced', '[\"*\"]', '2026-08-20 16:01:28', NULL, '2026-08-20 15:57:47', '2026-08-20 16:01:28'),
(272, 'App\\Domains\\Auth\\User', 107, 'auth_token', 'f24604af7e08c7b78524d1aca23bf4721154af85ceac173dc6a723052f6da254', '[\"*\"]', '2026-08-20 16:11:35', NULL, '2026-08-20 15:58:10', '2026-08-20 16:11:35'),
(273, 'App\\Domains\\Auth\\User', 108, 'auth_token', 'b12f178f75a3a085ad08abf8f938c7df50c01e43a0820ecdc2d817821b46e11f', '[\"*\"]', '2026-08-20 16:21:10', NULL, '2026-08-20 16:19:06', '2026-08-20 16:21:10'),
(274, 'App\\Domains\\Auth\\User', 109, 'auth_token', 'e8f817d3851d7461808eeef67e0aae778567de717b2a0ce42931384f604ee37e', '[\"*\"]', '2026-08-20 17:54:08', NULL, '2026-08-20 16:36:41', '2026-08-20 17:54:08'),
(275, 'App\\Domains\\Auth\\User', 110, 'auth_token', '408e6af1bc425627175a17ff2fb9a3c5311f37bcae119dba18362945339cb6c9', '[\"*\"]', '2026-08-20 16:38:11', NULL, '2026-08-20 16:37:42', '2026-08-20 16:38:11'),
(276, 'App\\Domains\\Auth\\User', 110, 'auth_token', 'e08809f6cba6927577f4da1d71bca7ce9427051a73a6795a19bba3776ee33d45', '[\"*\"]', '2026-08-20 17:02:30', NULL, '2026-08-20 16:38:41', '2026-08-20 17:02:30'),
(277, 'App\\Domains\\Auth\\User', 106, 'auth_token', 'e4ef83b465a47d190087f3ae3b37ef2fed34fa0fa441bdd213f64f4f94935db0', '[\"*\"]', '2026-08-20 18:26:36', NULL, '2026-08-20 16:44:12', '2026-08-20 18:26:36'),
(278, 'App\\Domains\\Auth\\User', 111, 'auth_token', 'e01193e394c3f1bc656208cb1597cb70bf550c859697b56bcf4d44c313f8cf50', '[\"*\"]', '2026-08-20 17:04:37', NULL, '2026-08-20 16:54:09', '2026-08-20 17:04:37'),
(279, 'App\\Domains\\Auth\\User', 110, 'auth_token', '78b8e627233bce994df11b327fbdc841eaf147010eaac15536e44fb297ac1e35', '[\"*\"]', '2026-08-20 17:05:05', NULL, '2026-08-20 17:02:40', '2026-08-20 17:05:05'),
(280, 'App\\Domains\\Auth\\User', 110, 'auth_token', '16d50945d3e4274e341b851da0c05113cf32a3927e5e35f76a42eb06e683a3fa', '[\"*\"]', '2026-08-20 17:42:44', NULL, '2026-08-20 17:05:16', '2026-08-20 17:42:44'),
(281, 'App\\Domains\\Auth\\User', 112, 'auth_token', '94e574fa09c2ec78e581274985a97684aed8a8a7e5454cfb46627636b7890201', '[\"*\"]', '2026-08-21 10:49:22', NULL, '2026-08-20 17:06:45', '2026-08-21 10:49:22'),
(282, 'App\\Domains\\Auth\\User', 113, 'auth_token', '4990007c3afb2bf3a6553ee225d243ed42a27f48b558663174e81fea46b25dda', '[\"*\"]', '2026-08-20 17:17:09', NULL, '2026-08-20 17:16:02', '2026-08-20 17:17:09'),
(283, 'App\\Domains\\Auth\\User', 51, 'auth_token', '2e3c7b4861fe7fa2ad7803c7a44ccc5e752168d5d95071795473c5b7de615dfa', '[\"*\"]', '2026-08-20 17:27:18', NULL, '2026-08-20 17:19:30', '2026-08-20 17:27:18'),
(284, 'App\\Domains\\Auth\\User', 114, 'auth_token', '11e17e953319b0178f09cc93c032a8c1ee340d8f8f8de2673dcd79996aead143', '[\"*\"]', '2026-08-20 17:33:36', NULL, '2026-08-20 17:21:41', '2026-08-20 17:33:36'),
(285, 'App\\Domains\\Auth\\User', 2, 'auth_token', '3b589fa91ca10fe62cb53b69e9f03046b88aaf0f1fa882e7a3f3c50ea304aa8d', '[\"*\"]', '2026-08-20 17:38:27', NULL, '2026-08-20 17:30:20', '2026-08-20 17:38:27'),
(287, 'App\\Domains\\Auth\\User', 2, 'auth_token', 'b6befb8541d8efc4cbc78366d270519a2789b2fae7244ae7ef28eea3a4120867', '[\"*\"]', '2026-08-20 17:37:00', NULL, '2026-08-20 17:33:17', '2026-08-20 17:37:00'),
(288, 'App\\Domains\\Auth\\User', 114, 'auth_token', '7d1d3a8dc5f504b5c8ade72f6e8563f6f63f2fc76effd72e33d4ed8deec7e84a', '[\"*\"]', '2026-08-20 17:36:45', NULL, '2026-08-20 17:33:35', '2026-08-20 17:36:45'),
(289, 'App\\Domains\\Auth\\User', 2, 'auth_token', '6f91da48cca74308f9529971cafffa15840902fd5cff45b8d9ab572c4954517b', '[\"*\"]', '2026-08-20 17:37:05', NULL, '2026-08-20 17:37:04', '2026-08-20 17:37:05'),
(290, 'App\\Domains\\Auth\\User', 10, 'auth_token', '6883577b55e74ced79ec11ddec4516b6e060b112a53bcc9c7028602d9896bf0c', '[\"*\"]', '2026-08-20 19:29:22', NULL, '2026-08-20 17:37:37', '2026-08-20 19:29:22');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(291, 'App\\Domains\\Auth\\User', 12, 'impersonation_token', '9e9b9af70060d19b627ce7f9649b0862dfa43bf6f78fdd323535930d617fc7c6', '[\"*\"]', '2026-08-20 17:38:27', NULL, '2026-08-20 17:38:27', '2026-08-20 17:38:27'),
(292, 'App\\Domains\\Auth\\User', 110, 'auth_token', 'c21b6560da93b16df3b48df77f4eedb7df6d20eab15cbc739fccd0fbae1fdbd2', '[\"*\"]', '2026-08-20 17:44:38', NULL, '2026-08-20 17:42:52', '2026-08-20 17:44:38'),
(293, 'App\\Domains\\Auth\\User', 12, 'auth_token', '7cb78dbc880c392ed034d9d9cf350f7884c9fdc81e5049671c55ae65aa146b93', '[\"*\"]', '2026-08-21 20:44:27', NULL, '2026-08-20 17:42:59', '2026-08-21 20:44:27'),
(294, 'App\\Domains\\Auth\\User', 2, 'auth_token', 'aba66902e6a2d529d7757efac711bdb9f4aae9e4681f78eb01a635b964574378', '[\"*\"]', '2026-08-20 17:47:13', NULL, '2026-08-20 17:46:09', '2026-08-20 17:47:13'),
(295, 'App\\Domains\\Auth\\User', 10, 'impersonation_token', 'fae216e538f92a9f8b87dd0982d35ebdb46488be19b8affa423cf18016142e3c', '[\"*\"]', '2026-08-20 22:02:35', NULL, '2026-08-20 17:47:13', '2026-08-20 22:02:35'),
(296, 'App\\Domains\\Auth\\User', 110, 'auth_token', '064d0ef28f24ec8c1af7593ad6cbe5de699ed4f6640bce8eec22589f5fee8461', '[\"*\"]', '2026-08-20 17:59:12', NULL, '2026-08-20 17:51:53', '2026-08-20 17:59:12'),
(297, 'App\\Domains\\Auth\\User', 2, 'auth_token', '424d05ea4d09879d0cd466423ca0f8541ea80112d96152017fc2e7d5fada1247', '[\"*\"]', '2026-08-20 19:55:00', NULL, '2026-08-20 17:56:23', '2026-08-20 19:55:00'),
(299, 'App\\Domains\\Auth\\User', 2, 'auth_token', '0b35866ac8e0a7587ab462796b188e3fcbc7fdf70448a58d8da5f32fa93d2a53', '[\"*\"]', '2026-08-20 18:06:04', NULL, '2026-08-20 18:03:29', '2026-08-20 18:06:04'),
(300, 'App\\Domains\\Auth\\User', 2, 'auth_token', '09037ac611e16d221546da20bd1d1d7073606562bfa54fff2eb17ff08bb3bbd9', '[\"*\"]', '2026-08-20 18:24:08', NULL, '2026-08-20 18:11:20', '2026-08-20 18:24:08'),
(302, 'App\\Domains\\Auth\\User', 111, 'auth_token', '5a5fdc0cc5eb956c91b2f61880d1f241f90b01e2f0da45f7ca51096a81a39364', '[\"*\"]', '2026-08-20 18:29:04', NULL, '2026-08-20 18:28:07', '2026-08-20 18:29:04'),
(303, 'App\\Domains\\Auth\\User', 2, 'auth_token', '3357c7261b8a0c95c94d163fce11379d6f2268608bec6e4afe5d17242a60d625', '[\"*\"]', '2026-08-20 18:30:05', NULL, '2026-08-20 18:29:06', '2026-08-20 18:30:05'),
(304, 'App\\Domains\\Auth\\User', 10, 'impersonation_token', 'c6aa07ef520f39d0ef9e4d1c57f34957b5944d470c13ee292700d4a3bf7b6cfe', '[\"*\"]', '2026-08-20 18:40:39', NULL, '2026-08-20 18:30:05', '2026-08-20 18:40:39'),
(305, 'App\\Domains\\Auth\\User', 2, 'auth_token', 'd0a2bd87ccd66c85ecc4e1fc5c35f3aeb94985116a1138418df9e9131655b0db', '[\"*\"]', '2026-08-20 18:39:41', NULL, '2026-08-20 18:31:10', '2026-08-20 18:39:41'),
(306, 'App\\Domains\\Auth\\User', 110, 'auth_token', '97dee031e1ffe4aee41d1aa2dcb4727d49c15c953828cc781a6e5861e40c482a', '[\"*\"]', '2026-08-20 18:48:19', NULL, '2026-08-20 18:43:07', '2026-08-20 18:48:19'),
(307, 'App\\Domains\\Auth\\User', 48, 'auth_token', '04bd1214510824bbe1a0d6bb7d89851e4a010e04980561ae99334972deb629c8', '[\"*\"]', '2026-08-20 18:47:36', NULL, '2026-08-20 18:46:32', '2026-08-20 18:47:36'),
(308, 'App\\Domains\\Auth\\User', 110, 'auth_token', 'c864a1872853239b802dcd9e4130d09f511de03163a380c6fa24087d54973783', '[\"*\"]', '2026-08-20 18:49:14', NULL, '2026-08-20 18:48:28', '2026-08-20 18:49:14'),
(309, 'App\\Domains\\Auth\\User', 110, 'auth_token', '7364cee6791f8fafa7eb98385f7fea3f717a56f67c195ffe399f54299e398d9c', '[\"*\"]', '2026-08-20 19:00:21', NULL, '2026-08-20 18:49:43', '2026-08-20 19:00:21'),
(310, 'App\\Domains\\Auth\\User', 115, 'auth_token', 'd94e937108ce0bddfbaca4a9d717ead19f881133adca67b2d57e4c0069f158ad', '[\"*\"]', '2026-08-20 18:52:31', NULL, '2026-08-20 18:51:41', '2026-08-20 18:52:31'),
(311, 'App\\Domains\\Auth\\User', 116, 'auth_token', '905e800ca0eff25fe087516adcbf9e13e8c20342570a68fbf61e36726c111e26', '[\"*\"]', '2026-08-20 19:14:23', NULL, '2026-08-20 19:00:33', '2026-08-20 19:14:23'),
(312, 'App\\Domains\\Auth\\User', 110, 'auth_token', '0e6faae0137aeab84ac4f270407469dad6ddf4c37da60f0589c5b0dcb06e7cc4', '[\"*\"]', '2026-08-20 19:12:25', NULL, '2026-08-20 19:03:22', '2026-08-20 19:12:25'),
(313, 'App\\Domains\\Auth\\User', 110, 'auth_token', '01bf42781d3e2ca2542b53a196857a6e22b40f24282650adb6e9b2d450bbb3c1', '[\"*\"]', '2026-08-20 19:14:02', NULL, '2026-08-20 19:12:39', '2026-08-20 19:14:02'),
(315, 'App\\Domains\\Auth\\User', 117, 'auth_token', '59e99e21c7306f742a364106f4c80a8de3d7f1ca42ae173b88c4946d17db42f6', '[\"*\"]', '2026-08-20 21:26:08', NULL, '2026-08-20 19:26:11', '2026-08-20 21:26:08'),
(316, 'App\\Domains\\Auth\\User', 48, 'auth_token', 'd2a8a5251e986ef9567d3d488a9fb2b0de8fe441c8c2cc850ad2302a729017d4', '[\"*\"]', '2026-08-20 19:32:36', NULL, '2026-08-20 19:30:15', '2026-08-20 19:32:36'),
(317, 'App\\Domains\\Auth\\User', 48, 'auth_token', '6a0c2ef5302affc657839a6712855ca6d430ef7a3616cf0cec58ad74aeca6253', '[\"*\"]', '2026-08-20 19:39:59', NULL, '2026-08-20 19:39:19', '2026-08-20 19:39:59'),
(318, 'App\\Domains\\Auth\\User', 118, 'auth_token', 'edd79df48344e169a7034aa7aa2633739b4ac302abb163b067dbdbcc4f72ab4f', '[\"*\"]', '2026-08-20 19:49:31', NULL, '2026-08-20 19:41:53', '2026-08-20 19:49:31'),
(319, 'App\\Domains\\Auth\\User', 119, 'auth_token', 'ce067de55160b48b3d7658a218a6bfb381344b1b8e64614445d96ef3e98edd28', '[\"*\"]', '2026-08-20 19:45:17', NULL, '2026-08-20 19:42:07', '2026-08-20 19:45:17'),
(320, 'App\\Domains\\Auth\\User', 34, 'auth_token', '9a0a0965806a91b0a3c14d3a8348416e95c3d882b88f127d0688ba32e831c7ac', '[\"*\"]', '2026-08-20 19:44:13', NULL, '2026-08-20 19:43:43', '2026-08-20 19:44:13'),
(322, 'App\\Domains\\Auth\\User', 120, 'auth_token', '981138212a66cbe62cb8dd69eb262fff3121df08360a832be38e9f5b3f16b851', '[\"*\"]', '2026-08-20 20:33:49', NULL, '2026-08-20 19:49:59', '2026-08-20 20:33:49'),
(323, 'App\\Domains\\Auth\\User', 121, 'auth_token', '228fc2f7e0a1868a0d3dc3ff1998974670082024e74d7a4f2ed9d2ee65c99a1a', '[\"*\"]', '2026-08-20 20:01:56', NULL, '2026-08-20 19:53:50', '2026-08-20 20:01:56'),
(324, 'App\\Domains\\Auth\\User', 10, 'impersonation_token', '849a92fc1c0b740a90b3aa39ea5bb5858206cccd5b462eba6361d2ebbc3c5f0a', '[\"*\"]', '2026-08-21 20:49:40', NULL, '2026-08-20 19:55:00', '2026-08-21 20:49:40'),
(325, 'App\\Domains\\Auth\\User', 122, 'auth_token', 'ac7fb220eb7d95c47cba57db94f61002b3156eef5e26e3df73961dd80c77eee0', '[\"*\"]', '2026-08-20 21:17:34', NULL, '2026-08-20 19:56:19', '2026-08-20 21:17:34'),
(326, 'App\\Domains\\Auth\\User', 123, 'auth_token', '23365833bbc5c3d58417282bdafa957e798bc029595e353af2545c9e4cbb0478', '[\"*\"]', '2026-08-20 23:28:07', NULL, '2026-08-20 19:57:34', '2026-08-20 23:28:07'),
(327, 'App\\Domains\\Auth\\User', 124, 'auth_token', '33c8fde9c00b3f3b94513a1751b9f2f169d8dffbeef602252ea65d6c6b217952', '[\"*\"]', '2026-08-20 20:02:07', NULL, '2026-08-20 20:00:34', '2026-08-20 20:02:07'),
(328, 'App\\Domains\\Auth\\User', 121, 'auth_token', 'df2962d751f05eaba6804ee8c2b9d69c48ddd24bf1a09e179da3990b7f6be071', '[\"*\"]', '2026-08-20 20:09:27', NULL, '2026-08-20 20:02:13', '2026-08-20 20:09:27'),
(329, 'App\\Domains\\Auth\\User', 124, 'auth_token', 'd264c669ffca5af2f683a98fb684e6f2c8ca95d7b3f67fd74d38903d787c6627', '[\"*\"]', '2026-08-20 20:02:29', NULL, '2026-08-20 20:02:18', '2026-08-20 20:02:29'),
(330, 'App\\Domains\\Auth\\User', 124, 'auth_token', 'd9ae6b732b02642c7248c5acfaca59aaf6b1ca953f299bdd30d12814eb2087b6', '[\"*\"]', '2026-08-20 20:03:23', NULL, '2026-08-20 20:03:11', '2026-08-20 20:03:23'),
(331, 'App\\Domains\\Auth\\User', 124, 'auth_token', '21e6e7a5f9148ede89adb6aefb400a6ff12fee33158f821d22320a47db0c987f', '[\"*\"]', '2026-08-21 11:33:57', NULL, '2026-08-20 20:04:33', '2026-08-21 11:33:57'),
(332, 'App\\Domains\\Auth\\User', 125, 'auth_token', '8980f464fed3cad481139e0a1fdd79f1783040316ae3ff4939f4a31bcdfcfcd6', '[\"*\"]', '2026-08-20 20:07:23', NULL, '2026-08-20 20:06:37', '2026-08-20 20:07:23'),
(333, 'App\\Domains\\Auth\\User', 126, 'auth_token', '0915d35bebcef4701234f28043f5ae91addbb5e7d0ae63b10e399484260b802a', '[\"*\"]', '2026-08-20 20:13:14', NULL, '2026-08-20 20:11:32', '2026-08-20 20:13:14'),
(334, 'App\\Domains\\Auth\\User', 127, 'auth_token', 'ce58e82c72b774023664a430c08a5b89afde9b1ff326df9705f4704d57ceafbf', '[\"*\"]', '2026-08-20 20:12:24', NULL, '2026-08-20 20:11:37', '2026-08-20 20:12:24'),
(335, 'App\\Domains\\Auth\\User', 128, 'auth_token', 'd70ce5a91046ce1280739817e5c8a004a43617d1a11b4407ef06554d987f0d01', '[\"*\"]', '2026-08-20 20:14:01', NULL, '2026-08-20 20:14:00', '2026-08-20 20:14:01'),
(336, 'App\\Domains\\Auth\\User', 129, 'auth_token', '93ba48454a0d9fcc1c61efa70fe9fe86b0eb49f04c7acc08492a51f753e2e24a', '[\"*\"]', '2026-08-20 20:38:38', NULL, '2026-08-20 20:14:07', '2026-08-20 20:38:38'),
(337, 'App\\Domains\\Auth\\User', 130, 'auth_token', '4126250f58f637836e47fa76f694033bf784f99feab8fb43ea37987f58b0b326', '[\"*\"]', '2026-08-20 20:17:08', NULL, '2026-08-20 20:16:41', '2026-08-20 20:17:08'),
(338, 'App\\Domains\\Auth\\User', 131, 'auth_token', '37aedf87d8caa5f9f4d3302fa0a3b15865e54f6e03165a0086864a1a68218ad6', '[\"*\"]', '2026-08-20 20:21:25', NULL, '2026-08-20 20:17:13', '2026-08-20 20:21:25'),
(339, 'App\\Domains\\Auth\\User', 132, 'auth_token', 'f9f617176e86233f89bdaef6146546b12e6b2d8a8595fbc932226a3514e1e1c0', '[\"*\"]', '2026-08-20 20:29:36', NULL, '2026-08-20 20:20:03', '2026-08-20 20:29:36'),
(340, 'App\\Domains\\Auth\\User', 120, 'auth_token', 'db961b3a102d88dc0f4b38957b6eed65cc82e9a0d1680b64bddd078921c3c606', '[\"*\"]', '2026-08-20 20:23:28', NULL, '2026-08-20 20:21:20', '2026-08-20 20:23:28'),
(341, 'App\\Domains\\Auth\\User', 133, 'auth_token', '9c22edda4adcd61946f034d321bd7b0183526d33619fb8f31941018dc0ce1265', '[\"*\"]', '2026-08-20 20:28:25', NULL, '2026-08-20 20:21:35', '2026-08-20 20:28:25'),
(342, 'App\\Domains\\Auth\\User', 134, 'auth_token', '7eb37a7d9f250906166f1a73140894a51c368464aa9d4553b0ea01ceb6e673ca', '[\"*\"]', '2026-08-20 20:26:52', NULL, '2026-08-20 20:26:06', '2026-08-20 20:26:52'),
(343, 'App\\Domains\\Auth\\User', 135, 'auth_token', '84215fc4cb27fcce39d2c1aa55a194d871c6f3b5d544789af11fee8af6c9a9c4', '[\"*\"]', '2026-08-20 20:38:44', NULL, '2026-08-20 20:27:33', '2026-08-20 20:38:44'),
(344, 'App\\Domains\\Auth\\User', 135, 'auth_token', '2922d1b6765ec234c5cd3f4eb3631942f6a24ad3746d35e1408661e3bce125e1', '[\"*\"]', '2026-08-20 20:38:43', NULL, '2026-08-20 20:29:53', '2026-08-20 20:38:43'),
(345, 'App\\Domains\\Auth\\User', 133, 'auth_token', '9aeba1a80927ab02b3f5aa91573905dc958139b77425c677ec4cc1ebe3424c29', '[\"*\"]', '2026-08-20 20:34:22', NULL, '2026-08-20 20:32:01', '2026-08-20 20:34:22'),
(346, 'App\\Domains\\Auth\\User', 136, 'auth_token', 'f269369d3bbc56b2db3cced0e1bd564c8f62a2aa0f78a014f8194bf1afdeb159', '[\"*\"]', '2026-08-20 20:42:59', NULL, '2026-08-20 20:33:13', '2026-08-20 20:42:59'),
(347, 'App\\Domains\\Auth\\User', 137, 'auth_token', 'f884a447c10b42fdc42be402d6fa5488c94e188ede9e8d14842f952dc2416cd7', '[\"*\"]', '2026-08-20 20:42:46', NULL, '2026-08-20 20:34:11', '2026-08-20 20:42:46'),
(348, 'App\\Domains\\Auth\\User', 135, 'auth_token', 'e8928a4afacc47ddf718e1510008ec3e73bc14673c097ffcdbecfe8020a78c74', '[\"*\"]', '2026-08-20 20:34:30', NULL, '2026-08-20 20:34:24', '2026-08-20 20:34:30'),
(349, 'App\\Domains\\Auth\\User', 135, 'auth_token', '41ac1cdb6ee43a9cdfef78c2250b9b41f582801436b5ad80b879554fc9b069cd', '[\"*\"]', '2026-08-20 20:37:28', NULL, '2026-08-20 20:36:20', '2026-08-20 20:37:28'),
(350, 'App\\Domains\\Auth\\User', 135, 'auth_token', '2fc82a0fb000bcfca338064882ca034c95435f5a981a8e1852e5fa484cb9d718', '[\"*\"]', '2026-08-20 20:38:30', NULL, '2026-08-20 20:37:54', '2026-08-20 20:38:30'),
(351, 'App\\Domains\\Auth\\User', 32, 'auth_token', '3ec1aa8f3397ba17357181614502c27fa938bf53b01e7790bd3e2b2992b81b35', '[\"*\"]', '2026-08-20 20:38:34', NULL, '2026-08-20 20:38:23', '2026-08-20 20:38:34'),
(352, 'App\\Domains\\Auth\\User', 138, 'auth_token', 'e4eeebd1fe3809b2479b826532bf0708d161589f915421adea2834c1704959b1', '[\"*\"]', '2026-08-20 20:40:57', NULL, '2026-08-20 20:39:35', '2026-08-20 20:40:57'),
(353, 'App\\Domains\\Auth\\User', 135, 'auth_token', '0bd8ba6855f21d9f676cc0cc1e8afe43bcd0f68ad8005005152a125beff04bb8', '[\"*\"]', '2026-08-20 20:41:29', NULL, '2026-08-20 20:39:58', '2026-08-20 20:41:29'),
(354, 'App\\Domains\\Auth\\User', 139, 'auth_token', '5823defe07d009ed6d31159b590107d000200754f751c7e4bd99cd0dfaf78295', '[\"*\"]', '2026-08-20 20:42:59', NULL, '2026-08-20 20:41:16', '2026-08-20 20:42:59'),
(355, 'App\\Domains\\Auth\\User', 140, 'auth_token', 'b25a5377affe77052508e17cc1aaae1937d21cb5b3c8a6e83ebe6b18c86947ee', '[\"*\"]', '2026-08-21 10:07:02', NULL, '2026-08-20 20:41:24', '2026-08-21 10:07:02'),
(356, 'App\\Domains\\Auth\\User', 141, 'auth_token', '965e6fcce49ba27b10c170e406bdc9cc5dae654835e7713b4e86be7f3a3bdc79', '[\"*\"]', '2026-08-20 20:46:18', NULL, '2026-08-20 20:46:07', '2026-08-20 20:46:18'),
(357, 'App\\Domains\\Auth\\User', 134, 'auth_token', '1188406d52336268cc13dc2173ee4bb1cfacf10e65c752b8bd8ac0cbc80b4665', '[\"*\"]', '2026-08-20 20:53:40', NULL, '2026-08-20 20:53:08', '2026-08-20 20:53:40'),
(358, 'App\\Domains\\Auth\\User', 118, 'auth_token', '34fbf4be5de6ce4bc0a3bacdb191a241b842000ab8770ae2360d05df1d914606', '[\"*\"]', '2026-08-20 21:15:09', NULL, '2026-08-20 21:14:06', '2026-08-20 21:15:09'),
(359, 'App\\Domains\\Auth\\User', 122, 'auth_token', 'dbf6d282c7ccbdac4fee14253ebb1ac53c4df057d1d8ff0256f452e8f93ae242', '[\"*\"]', '2026-08-20 21:19:01', NULL, '2026-08-20 21:17:41', '2026-08-20 21:19:01'),
(360, 'App\\Domains\\Auth\\User', 142, 'auth_token', 'c22d8a54a14da6e893d612feafeb27dd0c1ab44d579451c7710c669df479cf5f', '[\"*\"]', '2026-08-20 21:18:33', NULL, '2026-08-20 21:17:46', '2026-08-20 21:18:33'),
(361, 'App\\Domains\\Auth\\User', 143, 'auth_token', '5722951d759fde4ae9720ff1f24256e851ea577eef82eb6adb1dc7a33b4d00cd', '[\"*\"]', '2026-08-21 09:31:39', NULL, '2026-08-20 21:18:34', '2026-08-21 09:31:39'),
(362, 'App\\Domains\\Auth\\User', 144, 'auth_token', 'c327814535d821d7b4e5ce356ee6861769ddeafb12a5d58f57f4195b835152a9', '[\"*\"]', '2026-08-20 21:21:29', NULL, '2026-08-20 21:20:56', '2026-08-20 21:21:29'),
(363, 'App\\Domains\\Auth\\User', 144, 'auth_token', 'f1e1a9e95368f13ac93987906c329e9522ea4227b6b2899a6f33ef964cce4f08', '[\"*\"]', '2026-08-20 21:21:38', NULL, '2026-08-20 21:21:38', '2026-08-20 21:21:38'),
(364, 'App\\Domains\\Auth\\User', 145, 'auth_token', '4b72873f5bbd388e19ec50dc2feb487b103040936f0355fe7059fa640c15048a', '[\"*\"]', '2026-08-20 21:27:24', NULL, '2026-08-20 21:23:01', '2026-08-20 21:27:24'),
(365, 'App\\Domains\\Auth\\User', 117, 'auth_token', '8bb7f3f18bc0862d205e7a719c9f13fb874ed8bf090672a6f42655b8d906c494', '[\"*\"]', '2026-08-20 21:27:27', NULL, '2026-08-20 21:26:14', '2026-08-20 21:27:27'),
(366, 'App\\Domains\\Auth\\User', 110, 'auth_token', '4903d80a2211a843acb34f97f1def9fad01ae6db97d3364acbe4c4543e2f84f1', '[\"*\"]', '2026-08-20 21:34:03', NULL, '2026-08-20 21:33:06', '2026-08-20 21:34:03'),
(367, 'App\\Domains\\Auth\\User', 146, 'auth_token', '83390665b4a0d7bd4735d4465613342cbb8e4846212ea2c94e0997b294a467b1', '[\"*\"]', '2026-08-20 22:46:00', NULL, '2026-08-20 22:30:44', '2026-08-20 22:46:00'),
(368, 'App\\Domains\\Auth\\User', 146, 'auth_token', '09557f5739cbfb4031ee066f734a887376317211a7c707217869089b24296bbd', '[\"*\"]', '2026-08-20 22:50:22', NULL, '2026-08-20 22:47:38', '2026-08-20 22:50:22'),
(369, 'App\\Domains\\Auth\\User', 147, 'auth_token', '8bdf588d61cd7cab7c512e0c88a48296c5c41e089213f1d07306248ad9075d49', '[\"*\"]', '2026-08-20 23:12:20', NULL, '2026-08-20 23:09:30', '2026-08-20 23:12:20'),
(370, 'App\\Domains\\Auth\\User', 123, 'auth_token', '8bf78a3acfb4a7a2199e041511ec9779e355715c40e2b99f5948354d12929278', '[\"*\"]', '2026-08-21 00:05:57', NULL, '2026-08-21 00:01:57', '2026-08-21 00:05:57'),
(371, 'App\\Domains\\Auth\\User', 149, 'auth_token', '855035f85221fa23496b7d2fb687745c118f2a425cf92b8794bd225c4c833c38', '[\"*\"]', '2026-08-21 04:29:40', NULL, '2026-08-21 04:00:56', '2026-08-21 04:29:40'),
(372, 'App\\Domains\\Auth\\User', 150, 'auth_token', 'fa7afef1f84f42ff3fdf02e521c612fa2cfc3a3bd0fc6d3b279e729ac9fb84a9', '[\"*\"]', '2026-08-21 05:20:05', NULL, '2026-08-21 05:18:14', '2026-08-21 05:20:05'),
(373, 'App\\Domains\\Auth\\User', 151, 'auth_token', '2d9e13103099ff839ce960a5d5691df240a19be43532032a4053e1800aae8588', '[\"*\"]', '2026-08-21 05:22:46', NULL, '2026-08-21 05:20:46', '2026-08-21 05:22:46'),
(374, 'App\\Domains\\Auth\\User', 151, 'auth_token', 'e39002be167dd5b3da4c6b1744b41c17b7b43638c668cf54bb98bc1d08372181', '[\"*\"]', '2026-08-21 05:24:23', NULL, '2026-08-21 05:22:59', '2026-08-21 05:24:23'),
(375, 'App\\Domains\\Auth\\User', 126, 'auth_token', '592fc798fc58b821ecc373c39f8a36a887b68b0337ee6c101e41f7ae5022d5e6', '[\"*\"]', '2026-08-21 05:24:16', NULL, '2026-08-21 05:23:23', '2026-08-21 05:24:16'),
(376, 'App\\Domains\\Auth\\User', 120, 'auth_token', '440bee6ec627c1ca9e0f4c43f316eba1c1263f276bbd5c680434a55a7d4a9691', '[\"*\"]', '2026-08-21 10:45:54', NULL, '2026-08-21 06:00:36', '2026-08-21 10:45:54'),
(377, 'App\\Domains\\Auth\\User', 152, 'auth_token', '0d84b9de879da84c9ae950fcfbdf0587b7e9121204710b50957fa073b2dbed73', '[\"*\"]', '2026-08-21 06:06:24', NULL, '2026-08-21 06:01:11', '2026-08-21 06:06:24'),
(378, 'App\\Domains\\Auth\\User', 152, 'auth_token', 'ab9ce861488c2cd3f50e919f068ee99415721d1e938ee44d269c51a33d322dcc', '[\"*\"]', '2026-08-21 06:09:17', NULL, '2026-08-21 06:08:05', '2026-08-21 06:09:17'),
(379, 'App\\Domains\\Auth\\User', 153, 'auth_token', 'ae6912d16cc2e1f85b9359d06a7ef7a62407984d9b434cf18ea1b6e8c5a5bd00', '[\"*\"]', '2026-08-21 06:37:14', NULL, '2026-08-21 06:33:40', '2026-08-21 06:37:14'),
(380, 'App\\Domains\\Auth\\User', 153, 'auth_token', '44c9196c13499564ceb19bed6e6446c9808acabeff6b1bb53a35424b76809de5', '[\"*\"]', '2026-08-21 06:38:42', NULL, '2026-08-21 06:37:43', '2026-08-21 06:38:42'),
(381, 'App\\Domains\\Auth\\User', 153, 'auth_token', '4d171e01939aa2d27e5679417807e2a85b85865cec087a75bb1a17cbf5ec602f', '[\"*\"]', '2026-08-21 06:40:00', NULL, '2026-08-21 06:39:44', '2026-08-21 06:40:00'),
(382, 'App\\Domains\\Auth\\User', 153, 'auth_token', 'ea5fb8aa40ff007fe2da8afa1088ed558ab0295f69f875ec9a63a6df9e3a7942', '[\"*\"]', '2026-08-21 06:40:17', NULL, '2026-08-21 06:40:11', '2026-08-21 06:40:17'),
(383, 'App\\Domains\\Auth\\User', 113, 'auth_token', '48221e2c087e7cb436052cff1266e4f1684c6b8620d0a38d73d0041cbb63dd80', '[\"*\"]', '2026-08-21 07:18:58', NULL, '2026-08-21 07:13:27', '2026-08-21 07:18:58'),
(384, 'App\\Domains\\Auth\\User', 93, 'auth_token', '46c1d952ef03aa6da2cb7b595dd8c34cf901f356ca2e01bb0a4029a096726e82', '[\"*\"]', '2026-08-21 13:42:48', NULL, '2026-08-21 07:56:49', '2026-08-21 13:42:48'),
(385, 'App\\Domains\\Auth\\User', 154, 'auth_token', '864bfb9f431cecc2d7d1495c8f5963e47f951a37939326ced985e2dd2b1fc505', '[\"*\"]', '2026-08-21 08:19:03', NULL, '2026-08-21 08:13:14', '2026-08-21 08:19:03'),
(386, 'App\\Domains\\Auth\\User', 154, 'auth_token', '8e98d8d5d6a012e8b90ab6b61f9d58ca096a4b48d872510005dadac1c3b47f3f', '[\"*\"]', '2026-08-21 08:21:21', NULL, '2026-08-21 08:20:22', '2026-08-21 08:21:21'),
(387, 'App\\Domains\\Auth\\User', 110, 'auth_token', '2952fda50fcdbe77e4cf538788dddf569d0fa0a7561dbb2b3d49921e1279a90b', '[\"*\"]', '2026-08-21 08:23:44', NULL, '2026-08-21 08:23:12', '2026-08-21 08:23:44'),
(388, 'App\\Domains\\Auth\\User', 155, 'auth_token', '63d24dde112ed53a4db34faf1cd420fdb7b7d4891b9e14fef37a3ca98e943776', '[\"*\"]', '2026-08-21 08:39:25', NULL, '2026-08-21 08:33:22', '2026-08-21 08:39:25'),
(389, 'App\\Domains\\Auth\\User', 33, 'auth_token', 'c1e0de944e606cef93da0d7b6758201094c2891d4e306302e83bfb7a4306f584', '[\"*\"]', '2026-08-21 08:40:52', NULL, '2026-08-21 08:37:45', '2026-08-21 08:40:52'),
(390, 'App\\Domains\\Auth\\User', 29, 'auth_token', '1e56f4473246ce704e7bfe201cc7803609484ac9eef18b485c9b184cfe24a8a6', '[\"*\"]', '2026-08-21 08:42:23', NULL, '2026-08-21 08:42:02', '2026-08-21 08:42:23'),
(391, 'App\\Domains\\Auth\\User', 135, 'auth_token', '095e83771e5b901ff0876c02612f005a1a1f53087540588192fe2af12f5142c5', '[\"*\"]', '2026-08-21 13:56:10', NULL, '2026-08-21 08:56:04', '2026-08-21 13:56:10'),
(392, 'App\\Domains\\Auth\\User', 156, 'auth_token', '3a9c80d9e5f4aa2e66ea2fb55136d2bcf6c1a79b24ad1fa3a519e469921b961a', '[\"*\"]', '2026-08-21 09:02:32', NULL, '2026-08-21 09:02:08', '2026-08-21 09:02:32'),
(393, 'App\\Domains\\Auth\\User', 157, 'auth_token', '44003bc083117739b05f0b15aa57376105a0f1b40e0086065f711c22887f2b7a', '[\"*\"]', '2026-08-21 09:34:26', NULL, '2026-08-21 09:06:35', '2026-08-21 09:34:26'),
(394, 'App\\Domains\\Auth\\User', 158, 'auth_token', '43bee38587e423895333129293c0021ae40713a5513cbc387f0ffa2980e70f57', '[\"*\"]', '2026-08-21 09:14:43', NULL, '2026-08-21 09:07:53', '2026-08-21 09:14:43'),
(395, 'App\\Domains\\Auth\\User', 159, 'auth_token', '0a02079fe7d49a3e97ffb78c24bffaa565a84048d6ce45484cd456aaa436a81f', '[\"*\"]', '2026-08-21 09:16:07', NULL, '2026-08-21 09:10:30', '2026-08-21 09:16:07'),
(396, 'App\\Domains\\Auth\\User', 160, 'auth_token', '46191d8b8f8af405a98c1fe6e74c1df485720dda3ddc90e7940a6e2ee6051f31', '[\"*\"]', '2026-08-21 09:16:16', NULL, '2026-08-21 09:12:58', '2026-08-21 09:16:16'),
(397, 'App\\Domains\\Auth\\User', 104, 'auth_token', 'd5ce3bab18b49f41b86b3623f7523dad208893b3afd9831ec027d2af9c088642', '[\"*\"]', '2026-08-21 09:26:06', NULL, '2026-08-21 09:22:41', '2026-08-21 09:26:06'),
(398, 'App\\Domains\\Auth\\User', 53, 'auth_token', 'acfc54ae8f28fe3feba32a4eb906acde6bf5eab4a8a049ba19a0eb8281afc81d', '[\"*\"]', '2026-08-21 15:26:26', NULL, '2026-08-21 09:22:44', '2026-08-21 15:26:26'),
(399, 'App\\Domains\\Auth\\User', 161, 'auth_token', '6ba15f5ee64885e3ef9a0574712a8cea0940b1c743007a22ce01a892a4e27448', '[\"*\"]', '2026-08-21 09:31:19', NULL, '2026-08-21 09:28:51', '2026-08-21 09:31:19'),
(400, 'App\\Domains\\Auth\\User', 162, 'auth_token', '80d6b4bc1bafea90317444bc82ede72aa64f295b3369fbb930120a16b41cda48', '[\"*\"]', '2026-08-21 09:40:42', NULL, '2026-08-21 09:31:27', '2026-08-21 09:40:42'),
(401, 'App\\Domains\\Auth\\User', 163, 'auth_token', 'dcb87fdee203e13ea839090d9307f24b4f317ee1106fdd1bb1966259dbc53fce', '[\"*\"]', '2026-08-21 09:46:40', NULL, '2026-08-21 09:45:37', '2026-08-21 09:46:40'),
(402, 'App\\Domains\\Auth\\User', 164, 'auth_token', '241ded5b94dbb1079566b30820c8f4b2b07950f850df165384875f6fffae7667', '[\"*\"]', '2026-08-21 09:51:18', NULL, '2026-08-21 09:48:12', '2026-08-21 09:51:18'),
(403, 'App\\Domains\\Auth\\User', 165, 'auth_token', 'f099d48d425e026c3e895eb2ba294d8485a60e743d192922e7ccb68ca7d542a0', '[\"*\"]', '2026-08-21 10:01:50', NULL, '2026-08-21 09:54:18', '2026-08-21 10:01:50'),
(404, 'App\\Domains\\Auth\\User', 166, 'auth_token', 'db34863691f7ef84caf4aef9e5e4030fc30f7c3a5ff9f15ac7240cfa2fbf5d78', '[\"*\"]', '2026-08-21 10:08:55', NULL, '2026-08-21 10:03:33', '2026-08-21 10:08:55'),
(405, 'App\\Domains\\Auth\\User', 167, 'auth_token', '1beea125c51aaadc5ad0161e1121164e7ed04df985dfd74ac851a9b13e1024eb', '[\"*\"]', '2026-08-21 10:06:41', NULL, '2026-08-21 10:05:16', '2026-08-21 10:06:41'),
(406, 'App\\Domains\\Auth\\User', 167, 'auth_token', '2217c5f03980da6f6bf719953c8e5162c50de565dc1ba6118bbcf13b242acfce', '[\"*\"]', '2026-08-21 10:17:47', NULL, '2026-08-21 10:09:16', '2026-08-21 10:17:47'),
(407, 'App\\Domains\\Auth\\User', 29, 'auth_token', 'b12bc03c6860de442d1e4572ff60271447610a401ebce3487ee301695d27821b', '[\"*\"]', '2026-08-21 10:10:09', NULL, '2026-08-21 10:10:09', '2026-08-21 10:10:09'),
(408, 'App\\Domains\\Auth\\User', 168, 'auth_token', 'b0e80ea1ff8cb8afc99b4aa097cf3bdb3af427bc6521b16e65de6bacd2f8536f', '[\"*\"]', '2026-08-21 10:50:48', NULL, '2026-08-21 10:15:14', '2026-08-21 10:50:48'),
(409, 'App\\Domains\\Auth\\User', 169, 'auth_token', '92fe7f20c88cfa32d366352c00cbd832b8b8652cca12c67006203887672e601e', '[\"*\"]', '2026-08-21 10:24:54', NULL, '2026-08-21 10:19:37', '2026-08-21 10:24:54'),
(410, 'App\\Domains\\Auth\\User', 170, 'auth_token', '46ff55003eb5f070649dac51443146d62fd1985ee47b20922ebb7181eaff94ac', '[\"*\"]', '2026-08-21 10:25:39', NULL, '2026-08-21 10:25:12', '2026-08-21 10:25:39'),
(411, 'App\\Domains\\Auth\\User', 171, 'auth_token', 'eb40c507dfedf1ca81bf7068de450e0a8d4ac572b08aaf11ddfc2a228110c0bb', '[\"*\"]', '2026-08-21 10:33:02', NULL, '2026-08-21 10:25:55', '2026-08-21 10:33:02'),
(412, 'App\\Domains\\Auth\\User', 94, 'auth_token', '9a955638f2f88c45a2136a24c67c54c66990ce4c4864a44d0f5de1c788c3629e', '[\"*\"]', '2026-08-21 11:20:05', NULL, '2026-08-21 10:40:59', '2026-08-21 11:20:05'),
(413, 'App\\Domains\\Auth\\User', 121, 'auth_token', '12f598c818d9fcf32577443ee9c3685a45352618320927f7a432cb45416076bb', '[\"*\"]', '2026-08-21 10:47:23', NULL, '2026-08-21 10:44:05', '2026-08-21 10:47:23'),
(414, 'App\\Domains\\Auth\\User', 120, 'auth_token', '03ca29deff59588902fd28feb336ab1f963e6fe0e9c5bc1cc0864269e962186d', '[\"*\"]', '2026-08-21 10:48:46', NULL, '2026-08-21 10:46:00', '2026-08-21 10:48:46'),
(415, 'App\\Domains\\Auth\\User', 172, 'auth_token', 'e060846f68b77b15479f8993523b6b0a04cb4482f82e03182cee5f2fb1cc190c', '[\"*\"]', '2026-08-21 10:49:52', NULL, '2026-08-21 10:48:43', '2026-08-21 10:49:52'),
(416, 'App\\Domains\\Auth\\User', 172, 'auth_token', '424f8729bff73efceba5c6121bd412b87e664e5bcc9050f4e3b2b80411b52fcb', '[\"*\"]', '2026-08-21 10:50:14', NULL, '2026-08-21 10:50:13', '2026-08-21 10:50:14'),
(417, 'App\\Domains\\Auth\\User', 56, 'auth_token', '812af499a90c4e0062694ef32d987eca0b50d489576f8b80048a2d0b023f83e1', '[\"*\"]', '2026-08-21 15:07:57', NULL, '2026-08-21 10:51:33', '2026-08-21 15:07:57'),
(418, 'App\\Domains\\Auth\\User', 173, 'auth_token', '41716d52f8bf34e58f15d5bcdb681c05d142ff6c23298c4ceedff4c1f5ca2910', '[\"*\"]', '2026-08-21 11:01:39', NULL, '2026-08-21 11:00:23', '2026-08-21 11:01:39'),
(419, 'App\\Domains\\Auth\\User', 174, 'auth_token', 'b47de720843c921469b906a83261a90aa2bf14b6f2e407be5c7232d7ef99ebd9', '[\"*\"]', '2026-08-21 11:13:30', NULL, '2026-08-21 11:03:05', '2026-08-21 11:13:30'),
(420, 'App\\Domains\\Auth\\User', 175, 'auth_token', 'bbe53b1d603cd06449d6e20013cec569df31db4a184634589617de3f0cd406a9', '[\"*\"]', '2026-08-21 11:06:34', NULL, '2026-08-21 11:05:43', '2026-08-21 11:06:34'),
(421, 'App\\Domains\\Auth\\User', 176, 'auth_token', '885d1fe8a7a68f69ba1e72ab1541712b60566e97f2827bafb36c4ed71688108b', '[\"*\"]', '2026-08-21 11:13:57', NULL, '2026-08-21 11:11:25', '2026-08-21 11:13:57'),
(422, 'App\\Domains\\Auth\\User', 94, 'auth_token', '28213a6c9e3035af131fd121baf25c791c28a65b6a1546289fd4dc0f97ccf08e', '[\"*\"]', '2026-08-21 11:25:54', NULL, '2026-08-21 11:22:44', '2026-08-21 11:25:54'),
(423, 'App\\Domains\\Auth\\User', 177, 'auth_token', 'e3b7032d5755d5d903ed09c98756beb143c6a0e517ed7476266cf2e11cc0da9b', '[\"*\"]', '2026-08-21 16:50:57', NULL, '2026-08-21 11:24:11', '2026-08-21 16:50:57'),
(424, 'App\\Domains\\Auth\\User', 178, 'auth_token', '5d52aa743c5b059284910b1ffd91e648153648773b432e34e4d6535c13c23dfe', '[\"*\"]', '2026-08-21 11:33:25', NULL, '2026-08-21 11:28:49', '2026-08-21 11:33:25'),
(425, 'App\\Domains\\Auth\\User', 145, 'auth_token', '25e5fc4ed71805d85de4a50d19ef63b93738b345dce96505d58eb9718464c355', '[\"*\"]', '2026-08-21 11:33:15', NULL, '2026-08-21 11:31:57', '2026-08-21 11:33:15'),
(426, 'App\\Domains\\Auth\\User', 124, 'auth_token', '6e6913419274ec224112451673f89675724803f09a583308345715c1abd0b483', '[\"*\"]', '2026-08-21 13:15:08', NULL, '2026-08-21 11:34:05', '2026-08-21 13:15:08'),
(427, 'App\\Domains\\Auth\\User', 178, 'auth_token', '3013ff64f5851652427b441b52a02e2d457fe6e5d2b3a1ec9f74184e59502745', '[\"*\"]', '2026-08-21 11:38:36', NULL, '2026-08-21 11:37:31', '2026-08-21 11:38:36'),
(428, 'App\\Domains\\Auth\\User', 178, 'auth_token', '3ced481168de0a764f783b5766d784dc03d770f8bf79c50ffcbd660f4320369d', '[\"*\"]', '2026-08-21 11:39:00', NULL, '2026-08-21 11:38:59', '2026-08-21 11:39:00'),
(429, 'App\\Domains\\Auth\\User', 178, 'auth_token', '5700d4a5a02c8518fcc08062557cadda6b5226356dd8fac0e3b2fdac3627bc61', '[\"*\"]', '2026-08-21 11:39:30', NULL, '2026-08-21 11:39:24', '2026-08-21 11:39:30'),
(430, 'App\\Domains\\Auth\\User', 134, 'auth_token', 'acd3266e6be143d69035937f8ee986d030f4924d3f2d1812d44c93986f573958', '[\"*\"]', '2026-08-21 11:44:23', NULL, '2026-08-21 11:43:32', '2026-08-21 11:44:23'),
(431, 'App\\Domains\\Auth\\User', 179, 'auth_token', '93e4d2217c7206dfad5adcaa1ca41be3da61fb19431c284592bd0b9406154e30', '[\"*\"]', '2026-08-21 11:49:12', NULL, '2026-08-21 11:44:40', '2026-08-21 11:49:12'),
(432, 'App\\Domains\\Auth\\User', 163, 'auth_token', '15b20de06e42e545da2b175ba28f5c8fd45d579d5ad24b43aff9c04bad001ea3', '[\"*\"]', '2026-08-21 12:05:22', NULL, '2026-08-21 12:03:55', '2026-08-21 12:05:22'),
(433, 'App\\Domains\\Auth\\User', 180, 'auth_token', 'a949e69361912bf58b7128d7102f1da0fc125a3f306871e1107d7448a576bad0', '[\"*\"]', '2026-08-21 17:47:34', NULL, '2026-08-21 12:04:09', '2026-08-21 17:47:34'),
(434, 'App\\Domains\\Auth\\User', 181, 'auth_token', '294c8b9638edf77e6e08845c820d8a6405f653da96d8dc86074ef70dcc13bdbd', '[\"*\"]', '2026-08-21 12:12:00', NULL, '2026-08-21 12:11:16', '2026-08-21 12:12:00'),
(435, 'App\\Domains\\Auth\\User', 181, 'auth_token', '720c95f3c76d40f0064d3cc32ed133b1ca440743ff0c08f74576509ee5b722e5', '[\"*\"]', '2026-08-21 12:20:10', NULL, '2026-08-21 12:12:29', '2026-08-21 12:20:10'),
(436, 'App\\Domains\\Auth\\User', 182, 'auth_token', '4477dab8ee90be72936b158afd04a49be95179c93815b7cc9b024310292c652b', '[\"*\"]', '2026-08-21 12:24:57', NULL, '2026-08-21 12:14:49', '2026-08-21 12:24:57'),
(437, 'App\\Domains\\Auth\\User', 181, 'auth_token', 'ceb67ab6c495583e89d7e957789c706cbe9a0713b70e092216708d5e35577c6f', '[\"*\"]', '2026-08-21 12:25:33', NULL, '2026-08-21 12:25:28', '2026-08-21 12:25:33'),
(438, 'App\\Domains\\Auth\\User', 181, 'auth_token', '27c9800ae8943fb65ad860e7df3b75f9c5a9e7f1871b6f101fca99e5f5d846dc', '[\"*\"]', '2026-08-21 12:27:08', NULL, '2026-08-21 12:25:33', '2026-08-21 12:27:08'),
(439, 'App\\Domains\\Auth\\User', 183, 'auth_token', 'c70fc253a5856e4234e9def440d5915393f6c6d7dc5f8f19cd3db9b3a6d9a52a', '[\"*\"]', '2026-08-21 12:35:37', NULL, '2026-08-21 12:31:51', '2026-08-21 12:35:37'),
(440, 'App\\Domains\\Auth\\User', 184, 'auth_token', '6e6dddfdda910d3c72cf35831700cdcc6d78aff7562afc72d1d184a43c2ceeea', '[\"*\"]', '2026-08-21 12:40:24', NULL, '2026-08-21 12:32:31', '2026-08-21 12:40:24'),
(441, 'App\\Domains\\Auth\\User', 183, 'auth_token', '4bedf56d939c1339cfa3d777cb4e9cb78b9fe6fb21148df28ef009c9117f2973', '[\"*\"]', '2026-08-21 12:38:48', NULL, '2026-08-21 12:36:09', '2026-08-21 12:38:48'),
(442, 'App\\Domains\\Auth\\User', 185, 'auth_token', 'f2137b59a55c3a3812c9f66679ec5995f671631dba9c18b1cf7b6c6a14c859e3', '[\"*\"]', '2026-08-21 12:38:46', NULL, '2026-08-21 12:36:31', '2026-08-21 12:38:46'),
(443, 'App\\Domains\\Auth\\User', 183, 'auth_token', '438173076b2c920d927a44b00f14e0bad8c9dc8ddecf8355cbe356886168d28d', '[\"*\"]', '2026-08-21 12:41:25', NULL, '2026-08-21 12:38:55', '2026-08-21 12:41:25'),
(444, 'App\\Domains\\Auth\\User', 184, 'auth_token', 'e0f282fcdca9d406308aef534115da8d5c6f7def1d9a05d3a81ca9fd5bc5f538', '[\"*\"]', '2026-08-21 12:43:57', NULL, '2026-08-21 12:41:32', '2026-08-21 12:43:57'),
(445, 'App\\Domains\\Auth\\User', 186, 'auth_token', '5701fe147a44022bbe26465d79bf5a9cc42f744488d1c6e35e52083fe95ddc9f', '[\"*\"]', '2026-08-21 13:37:30', NULL, '2026-08-21 12:46:38', '2026-08-21 13:37:30'),
(446, 'App\\Domains\\Auth\\User', 165, 'auth_token', '9909e448350e4bd4655b0e918421b0f91624c15c3f3eae98c1f7c900661adbd1', '[\"*\"]', '2026-08-21 13:06:47', NULL, '2026-08-21 12:47:06', '2026-08-21 13:06:47'),
(447, 'App\\Domains\\Auth\\User', 187, 'auth_token', 'c8a8bfcfb5016c578d2d6e8199e8fac0d827b022fdf466a8a8deeb4267e4387e', '[\"*\"]', '2026-08-21 13:03:32', NULL, '2026-08-21 12:59:52', '2026-08-21 13:03:32'),
(448, 'App\\Domains\\Auth\\User', 165, 'auth_token', '88863eae4d5f5c2429072a018b66bd01e9bafb134b61ac198a643aceadb947ca', '[\"*\"]', '2026-08-21 13:08:37', NULL, '2026-08-21 13:03:49', '2026-08-21 13:08:37'),
(449, 'App\\Domains\\Auth\\User', 188, 'auth_token', '2cbd369c23dc60557cdcdba32b8e08e41b08ebaa1dc397a32059cb4566a6f1f9', '[\"*\"]', '2026-08-21 13:20:08', NULL, '2026-08-21 13:06:46', '2026-08-21 13:20:08'),
(450, 'App\\Domains\\Auth\\User', 189, 'auth_token', 'cbef3b5b8edd43de18fb4eb29b55786eb479703653340d4884d26e9701086d55', '[\"*\"]', '2026-08-21 16:50:31', NULL, '2026-08-21 13:08:17', '2026-08-21 16:50:31'),
(451, 'App\\Domains\\Auth\\User', 190, 'auth_token', '8c9e8b88abf7b16b2964f3d5c0554175d7047f46d6069dbd01f8a93bdfc17a89', '[\"*\"]', '2026-08-21 13:53:40', NULL, '2026-08-21 13:17:30', '2026-08-21 13:53:40'),
(452, 'App\\Domains\\Auth\\User', 191, 'auth_token', '4b66f8bb4fbc75a1c0c88c55f49b1f49b2166357de220e40833988ada03691f9', '[\"*\"]', '2026-08-21 13:18:20', NULL, '2026-08-21 13:18:19', '2026-08-21 13:18:20'),
(453, 'App\\Domains\\Auth\\User', 188, 'auth_token', '6bd658b621135c2f3bf7dff6d1e68e91a090442e228b2d830a798615e462226f', '[\"*\"]', '2026-08-21 13:20:37', NULL, '2026-08-21 13:20:18', '2026-08-21 13:20:37'),
(454, 'App\\Domains\\Auth\\User', 191, 'auth_token', '201a746903c860eaad3be931a28c64cf8ef6518a7b97127ef250ba14d5a56b8d', '[\"*\"]', '2026-08-21 13:27:18', NULL, '2026-08-21 13:20:49', '2026-08-21 13:27:18'),
(455, 'App\\Domains\\Auth\\User', 192, 'auth_token', 'f7e65e2edecbd42aa30401efee86b03281891f77e473de61e908b66785b4d449', '[\"*\"]', '2026-08-21 13:23:56', NULL, '2026-08-21 13:23:35', '2026-08-21 13:23:56'),
(456, 'App\\Domains\\Auth\\User', 39, 'auth_token', '45af3dcf441f9a37902eeb890bb13bc51f0c8425f68de16cbde16a440537ccf1', '[\"*\"]', '2026-08-21 13:26:06', NULL, '2026-08-21 13:25:10', '2026-08-21 13:26:06'),
(457, 'App\\Domains\\Auth\\User', 193, 'auth_token', '9fe78196abd7195708fad57642a5a4b9e83dae05717062038c7a938d49e64534', '[\"*\"]', '2026-08-21 13:27:32', NULL, '2026-08-21 13:26:14', '2026-08-21 13:27:32'),
(458, 'App\\Domains\\Auth\\User', 194, 'auth_token', 'fcee4f3eb74708070f2a557a23e536a43acafcaaf80d3ccfec816d2a34644e3c', '[\"*\"]', '2026-08-21 13:31:43', NULL, '2026-08-21 13:27:24', '2026-08-21 13:31:43'),
(459, 'App\\Domains\\Auth\\User', 195, 'auth_token', '016656bf3ea06157c3d162af97c885a6235e9e0501575276f30d4b0d798db8bb', '[\"*\"]', '2026-08-21 13:35:23', NULL, '2026-08-21 13:34:25', '2026-08-21 13:35:23'),
(460, 'App\\Domains\\Auth\\User', 169, 'auth_token', '07dd1459994e1e724f3cf49d54547b1a036194f26cb9cac57b3bc9d5fc112fb6', '[\"*\"]', '2026-08-21 13:36:15', NULL, '2026-08-21 13:35:51', '2026-08-21 13:36:15'),
(461, 'App\\Domains\\Auth\\User', 187, 'auth_token', '9959ffa7ccfa3e8eb9508e3e560c1c5d561982352744e10dd3c80b2057e91d5b', '[\"*\"]', '2026-08-21 13:38:14', NULL, '2026-08-21 13:36:42', '2026-08-21 13:38:14'),
(462, 'App\\Domains\\Auth\\User', 164, 'auth_token', 'cc7a41238f93d1caa91ae160df71c58917877d02d293633654e571baff9387ff', '[\"*\"]', '2026-08-21 13:41:33', NULL, '2026-08-21 13:38:52', '2026-08-21 13:41:33'),
(463, 'App\\Domains\\Auth\\User', 196, 'auth_token', '6579eddc14e6874ec4cbc8d7b6c3b467aa928645345e81e6e3a338d55aaebcf0', '[\"*\"]', '2026-08-21 13:52:13', NULL, '2026-08-21 13:44:05', '2026-08-21 13:52:13'),
(464, 'App\\Domains\\Auth\\User', 197, 'auth_token', '43fc7495c25ca90f782b47003f5d3f4de720209e51e35b837e8aa8c511272a09', '[\"*\"]', '2026-08-21 14:39:16', NULL, '2026-08-21 13:49:46', '2026-08-21 14:39:16'),
(465, 'App\\Domains\\Auth\\User', 198, 'auth_token', '30fd18fcc3bea74ba013b968c11acbfacc7f0156bdd0bace5092ad633ff5d750', '[\"*\"]', '2026-08-21 13:59:10', NULL, '2026-08-21 13:52:38', '2026-08-21 13:59:10'),
(466, 'App\\Domains\\Auth\\User', 199, 'auth_token', '6478ef53a8a8bdf0f06de2a74bf022badeba77cb871f6d7d94e098ba5d7b1db0', '[\"*\"]', '2026-08-21 13:55:39', NULL, '2026-08-21 13:53:46', '2026-08-21 13:55:39'),
(467, 'App\\Domains\\Auth\\User', 200, 'auth_token', 'bc4d14fe4f03d4b5fbfbfb4f7dc8fd47e3a183547537b2c2e17c828af67a39ec', '[\"*\"]', '2026-08-21 13:56:18', NULL, '2026-08-21 13:55:25', '2026-08-21 13:56:18'),
(468, 'App\\Domains\\Auth\\User', 135, 'auth_token', '8ff1835987b1cfa44678b1cb3a5e6be408e3561929d125bcbfe589b44e578cce', '[\"*\"]', '2026-08-21 13:58:39', NULL, '2026-08-21 13:56:31', '2026-08-21 13:58:39'),
(469, 'App\\Domains\\Auth\\User', 201, 'auth_token', '4d60d1d29ba64afbcfa712b75135beb2160e842e1ba144938344b6fd3c62638e', '[\"*\"]', '2026-08-21 14:14:44', NULL, '2026-08-21 13:57:37', '2026-08-21 14:14:44'),
(470, 'App\\Domains\\Auth\\User', 202, 'auth_token', 'bf6c1d8d6e4f815e371f4db545d3ed6c6446bf9f4aa6b3cdd598149e3e66b9b4', '[\"*\"]', '2026-08-21 14:00:38', NULL, '2026-08-21 13:58:44', '2026-08-21 14:00:38'),
(471, 'App\\Domains\\Auth\\User', 202, 'auth_token', '99c39a3ad03d046275f82cc4788c0ffec9ffcfe0aad3b4df49ad5283e0d6132b', '[\"*\"]', '2026-08-21 14:00:55', NULL, '2026-08-21 14:00:49', '2026-08-21 14:00:55'),
(472, 'App\\Domains\\Auth\\User', 40, 'auth_token', '0bc0324ebc5325dede1b588804f870f781f88d2ddc5a718cc6f14cce7eb33fa8', '[\"*\"]', '2026-08-21 14:09:55', NULL, '2026-08-21 14:08:51', '2026-08-21 14:09:55'),
(473, 'App\\Domains\\Auth\\User', 183, 'auth_token', '1da3ea0cdeb142ed2ea2812a6bf9fd321ae9f0e16e176044d0fb25b52aa9feec', '[\"*\"]', '2026-08-21 16:11:38', NULL, '2026-08-21 14:10:33', '2026-08-21 16:11:38'),
(474, 'App\\Domains\\Auth\\User', 203, 'auth_token', '0ca0e1fc141a86e0d40398b37bb524b637b0d2ac959813c4c2e5a33323433fe7', '[\"*\"]', '2026-08-21 14:11:44', NULL, '2026-08-21 14:11:23', '2026-08-21 14:11:44'),
(475, 'App\\Domains\\Auth\\User', 117, 'auth_token', '2b2750237313354e839d461f52466d9855a9228c0693b39b56ecbcf4e62d993b', '[\"*\"]', '2026-08-21 14:16:46', NULL, '2026-08-21 14:11:33', '2026-08-21 14:16:46'),
(476, 'App\\Domains\\Auth\\User', 77, 'auth_token', 'cfcddd0de7bb3891ca6d87c0430031955a141fe85e315f51c35cb580f0fcd131', '[\"*\"]', '2026-08-21 18:56:21', NULL, '2026-08-21 14:15:35', '2026-08-21 18:56:21'),
(477, 'App\\Domains\\Auth\\User', 140, 'auth_token', '173a10a66bbce8e050bc6222306189ef0d68818a5eea8dd3f29bb03d0e7da492', '[\"*\"]', '2026-08-21 14:17:12', NULL, '2026-08-21 14:16:34', '2026-08-21 14:17:12'),
(478, 'App\\Domains\\Auth\\User', 140, 'auth_token', 'd73320b8407c3a7207cdcc4175f6b5cf57a28717f32a063f310022c9faa337c9', '[\"*\"]', '2026-08-21 14:40:20', NULL, '2026-08-21 14:17:33', '2026-08-21 14:40:20'),
(479, 'App\\Domains\\Auth\\User', 204, 'auth_token', 'ed1ed1b6773e618b8d7ede1f1cf805b7c29a18349b11a1f91b490feebd342afc', '[\"*\"]', '2026-08-21 14:28:27', NULL, '2026-08-21 14:22:03', '2026-08-21 14:28:27'),
(480, 'App\\Domains\\Auth\\User', 205, 'auth_token', '97f87df66522ee18d35280b25940720549080cd7b626221fef4aa1117b9231bf', '[\"*\"]', '2026-08-21 14:30:24', NULL, '2026-08-21 14:24:48', '2026-08-21 14:30:24'),
(481, 'App\\Domains\\Auth\\User', 206, 'auth_token', '25928120d796ae302c8efad4f7b6c1edbb1ef637a5c82f12963ad0fa13b689d6', '[\"*\"]', '2026-08-21 14:26:35', NULL, '2026-08-21 14:25:21', '2026-08-21 14:26:35'),
(482, 'App\\Domains\\Auth\\User', 207, 'auth_token', 'aa60a551e58b9f9d937be46134db237e834bcc4b60167bfae6163898e5671107', '[\"*\"]', '2026-08-21 14:30:14', NULL, '2026-08-21 14:28:36', '2026-08-21 14:30:14'),
(483, 'App\\Domains\\Auth\\User', 139, 'auth_token', '70d36c24705a47894aebe944835207b28ab4e0ceeba9d33d77ab9a385a20d473', '[\"*\"]', '2026-08-21 17:14:26', NULL, '2026-08-21 14:29:07', '2026-08-21 17:14:26'),
(484, 'App\\Domains\\Auth\\User', 207, 'auth_token', '2af6f4eb77a9645aa0b8e279f002e11e54ada0c5ea7fbd77e824ebc039058e8d', '[\"*\"]', '2026-08-21 18:59:51', NULL, '2026-08-21 14:31:26', '2026-08-21 18:59:51'),
(485, 'App\\Domains\\Auth\\User', 205, 'auth_token', 'ec4405389aa226a1eb9bafd5287c2cfbfd7fcd0dfb488a21a3d29a5ac3862821', '[\"*\"]', '2026-08-21 14:34:01', NULL, '2026-08-21 14:33:05', '2026-08-21 14:34:01'),
(486, 'App\\Domains\\Auth\\User', 208, 'auth_token', '62e838e11b6b36c71d6ef6c055b6a1d2ed61946b38e1737e4387f19bd72bc4d5', '[\"*\"]', '2026-08-21 14:50:47', NULL, '2026-08-21 14:34:07', '2026-08-21 14:50:47'),
(487, 'App\\Domains\\Auth\\User', 209, 'auth_token', '313bae757315a02bd4dde245d4c9360b4caa0dfaba5cf50ebd19f6fa5501c279', '[\"*\"]', '2026-08-21 14:40:50', NULL, '2026-08-21 14:34:51', '2026-08-21 14:40:50'),
(488, 'App\\Domains\\Auth\\User', 210, 'auth_token', '9cae305b05dd060c15d384f09679bfa3336fb5b48fd2655cd9e531bd1f844f58', '[\"*\"]', '2026-08-21 14:37:49', NULL, '2026-08-21 14:35:52', '2026-08-21 14:37:49'),
(489, 'App\\Domains\\Auth\\User', 210, 'auth_token', 'd28677312649c2f91b9ab16973c641e8d28ce186382300b96e81720e40ac6348', '[\"*\"]', '2026-08-21 14:43:37', NULL, '2026-08-21 14:39:21', '2026-08-21 14:43:37'),
(490, 'App\\Domains\\Auth\\User', 117, 'auth_token', 'f7430405e0a97e2b988bb95da013b304b3c86a485e53c94dc0d5ea622e02edca', '[\"*\"]', '2026-08-21 14:42:24', NULL, '2026-08-21 14:41:37', '2026-08-21 14:42:24'),
(491, 'App\\Domains\\Auth\\User', 210, 'auth_token', 'b08a1c829be003ae3c4a9380cb49d70436d677a192179872cd74829fed8474b7', '[\"*\"]', '2026-08-21 14:47:51', NULL, '2026-08-21 14:46:42', '2026-08-21 14:47:51'),
(492, 'App\\Domains\\Auth\\User', 211, 'auth_token', 'f91d23abdcfe31315a6615fc0a86d637fe6f485ee06a57971acabc071ca2d78a', '[\"*\"]', '2026-08-21 14:48:35', NULL, '2026-08-21 14:47:00', '2026-08-21 14:48:35'),
(493, 'App\\Domains\\Auth\\User', 211, 'auth_token', '35448f524eb88782487b368d91cc117ed10efe9cc660dba451b4ecbcff9e3685', '[\"*\"]', '2026-08-21 14:51:03', NULL, '2026-08-21 14:49:01', '2026-08-21 14:51:03'),
(494, 'App\\Domains\\Auth\\User', 21, 'auth_token', '5de4feee8b00d597539dd1722175da2e63da4e10138f2de7dbc48de76c9d969f', '[\"*\"]', '2026-08-21 14:50:26', NULL, '2026-08-21 14:49:41', '2026-08-21 14:50:26'),
(495, 'App\\Domains\\Auth\\User', 51, 'auth_token', 'b725258e9c2ef98c3c33de183b966c69c0af8b59cfa310557856fdf27c7953af', '[\"*\"]', '2026-08-21 14:50:17', NULL, '2026-08-21 14:49:55', '2026-08-21 14:50:17'),
(496, 'App\\Domains\\Auth\\User', 208, 'auth_token', 'eaef871d6d4f35788db6cbe1bb04a0c70c5203239acbf06109c36605f15f55df', '[\"*\"]', '2026-08-21 14:51:01', NULL, '2026-08-21 14:50:48', '2026-08-21 14:51:01'),
(497, 'App\\Domains\\Auth\\User', 212, 'auth_token', '2115aa5b2b55d906524505ea34a93dfe2a19f3554f21865b08fb1d8bbf1027d7', '[\"*\"]', '2026-08-21 16:21:45', NULL, '2026-08-21 14:53:29', '2026-08-21 16:21:45'),
(498, 'App\\Domains\\Auth\\User', 213, 'auth_token', 'b0439ee02e80d345c2ae0b753020351aa2028c0b88e6a48a0f6a66496c42e708', '[\"*\"]', '2026-08-21 15:00:39', NULL, '2026-08-21 14:54:25', '2026-08-21 15:00:39'),
(499, 'App\\Domains\\Auth\\User', 214, 'auth_token', 'd332c7b522947154b61eb2ce29a8b5ab9bd41f0c73026b1c6b26303a39f31e9b', '[\"*\"]', '2026-08-21 15:33:02', NULL, '2026-08-21 14:58:48', '2026-08-21 15:33:02'),
(500, 'App\\Domains\\Auth\\User', 215, 'auth_token', 'c14f112d446293d7ab110d646007613f49eb33b68ebba7d1f0957f495e0fe48c', '[\"*\"]', '2026-08-21 15:03:04', NULL, '2026-08-21 14:59:52', '2026-08-21 15:03:04'),
(501, 'App\\Domains\\Auth\\User', 216, 'auth_token', '57a2ac69e635013d1ba4c80288fc333012a2b3c606bb021b568b61df5f15181b', '[\"*\"]', '2026-08-21 15:19:35', NULL, '2026-08-21 15:01:07', '2026-08-21 15:19:35'),
(502, 'App\\Domains\\Auth\\User', 213, 'auth_token', '66a54257ad7f43afd22a993be75cdde21489fe98ee8aa6b46e8c16b49f7e00c4', '[\"*\"]', '2026-08-21 15:01:39', NULL, '2026-08-21 15:01:38', '2026-08-21 15:01:39'),
(503, 'App\\Domains\\Auth\\User', 215, 'auth_token', '4d26d1fbde5c5e47d61684639f23e4347bd664ed681ffcf49550760285977c78', '[\"*\"]', '2026-08-21 15:10:04', NULL, '2026-08-21 15:06:58', '2026-08-21 15:10:04'),
(504, 'App\\Domains\\Auth\\User', 188, 'auth_token', '0b227ffc68f0ed1c3eddcff1e2bcd455d4acfe96aaef93170ee0b1002dd6317d', '[\"*\"]', '2026-08-21 15:24:05', NULL, '2026-08-21 15:10:41', '2026-08-21 15:24:05'),
(505, 'App\\Domains\\Auth\\User', 217, 'auth_token', '06579be3123531f7abe5de8ab72086dace7109c27d19805e53570ff8c636a31f', '[\"*\"]', '2026-08-21 15:35:06', NULL, '2026-08-21 15:11:05', '2026-08-21 15:35:06'),
(506, 'App\\Domains\\Auth\\User', 77, 'auth_token', 'e53afa3b4820e0887cab3b5b8c874c62b8a3c0385ffa0158e8873d67aee6d8df', '[\"*\"]', '2026-08-21 15:15:32', NULL, '2026-08-21 15:12:17', '2026-08-21 15:15:32'),
(507, 'App\\Domains\\Auth\\User', 218, 'auth_token', '9ea2467f41e496cdb478d26be7d910b484d669d8d8151e27c2b55b97742a4140', '[\"*\"]', '2026-08-21 15:18:37', NULL, '2026-08-21 15:17:18', '2026-08-21 15:18:37'),
(508, 'App\\Domains\\Auth\\User', 219, 'auth_token', 'a49c9a929206e36a51b117cf8754fd3699281bb51a4d5c835be053ebbac8cfe9', '[\"*\"]', '2026-08-21 15:24:14', NULL, '2026-08-21 15:20:06', '2026-08-21 15:24:14'),
(509, 'App\\Domains\\Auth\\User', 198, 'auth_token', 'd705362ff0d4f2995b80fdf84294e4d13034d995136266a2691f4ea1c60907d9', '[\"*\"]', '2026-08-21 15:30:16', NULL, '2026-08-21 15:26:18', '2026-08-21 15:30:16'),
(510, 'App\\Domains\\Auth\\User', 220, 'auth_token', '5bcbd53eb92a07504d63ff970e49af51a63ba9f6c381ee537d62ad022ae8d42f', '[\"*\"]', '2026-08-21 15:28:05', NULL, '2026-08-21 15:27:04', '2026-08-21 15:28:05'),
(511, 'App\\Domains\\Auth\\User', 198, 'auth_token', '51f9ff240b9e881d194629687db38e482282915e4e729aa57d0d4b0b721ef005', '[\"*\"]', '2026-08-21 15:32:19', NULL, '2026-08-21 15:30:29', '2026-08-21 15:32:19'),
(512, 'App\\Domains\\Auth\\User', 221, 'auth_token', '49e74c5b61845ab96435fa56ff27474a4beff2604807e098e7de8d4cda0a5b66', '[\"*\"]', '2026-08-21 17:13:33', NULL, '2026-08-21 15:32:04', '2026-08-21 17:13:33'),
(513, 'App\\Domains\\Auth\\User', 214, 'auth_token', '2f50a0c8d131dfb131e2e8548e4d6eb542bdb4c680817b00c3289f6816354731', '[\"*\"]', '2026-08-21 15:33:13', NULL, '2026-08-21 15:33:13', '2026-08-21 15:33:13'),
(514, 'App\\Domains\\Auth\\User', 222, 'auth_token', 'de9fc8fb6fed13110ec6f2ad51cfdcd868d57c0d31e8ed0b62f21853bf8aae13', '[\"*\"]', '2026-08-21 15:39:23', NULL, '2026-08-21 15:34:38', '2026-08-21 15:39:23'),
(515, 'App\\Domains\\Auth\\User', 77, 'auth_token', '9479c5c95f1d0ed6bd481a688629deb674fc25b8dd7e96d7df8caedc7867d40b', '[\"*\"]', '2026-08-21 15:47:41', NULL, '2026-08-21 15:35:17', '2026-08-21 15:47:41'),
(516, 'App\\Domains\\Auth\\User', 223, 'auth_token', 'a510206061277797147c7f8c71d817de65bb417cdafbf23613a386b5804a1648', '[\"*\"]', '2026-08-21 15:38:30', NULL, '2026-08-21 15:36:40', '2026-08-21 15:38:30'),
(517, 'App\\Domains\\Auth\\User', 220, 'auth_token', '2bea6eed81b77fd11dce6e484a5bbde9b4316474eedc34ea3a66c0d118910df3', '[\"*\"]', '2026-08-21 18:42:54', NULL, '2026-08-21 15:37:03', '2026-08-21 18:42:54'),
(518, 'App\\Domains\\Auth\\User', 154, 'auth_token', 'a2c9fdc28d33ff6e534cec95e6f11592506b465f9473a8d4decfc3d7db5d6fc3', '[\"*\"]', '2026-08-21 18:17:51', NULL, '2026-08-21 15:43:31', '2026-08-21 18:17:51'),
(519, 'App\\Domains\\Auth\\User', 117, 'auth_token', 'cba8bff359bd1911ed77927e50709ddb8c847aa13f71d158d519e305989efa7e', '[\"*\"]', '2026-08-21 15:46:25', NULL, '2026-08-21 15:45:37', '2026-08-21 15:46:25'),
(520, 'App\\Domains\\Auth\\User', 28, 'auth_token', '18cc2bb0acbc40803a20957fe66cfba10afb6b61489263ddc164f30521dd0527', '[\"*\"]', '2026-08-21 15:56:06', NULL, '2026-08-21 15:47:30', '2026-08-21 15:56:06'),
(521, 'App\\Domains\\Auth\\User', 224, 'auth_token', '0d6088495024fcb705bd7d16fcf2009090e659ab1466c3f1886549e69cfe5092', '[\"*\"]', '2026-08-21 15:51:45', NULL, '2026-08-21 15:47:54', '2026-08-21 15:51:45'),
(522, 'App\\Domains\\Auth\\User', 225, 'auth_token', 'e53cbd6a2e95b3d4b1cc9bf0f0e86192be8ff1c37dc501399aaf0b344538bea0', '[\"*\"]', '2026-08-21 15:51:34', NULL, '2026-08-21 15:48:13', '2026-08-21 15:51:34'),
(523, 'App\\Domains\\Auth\\User', 110, 'auth_token', 'ce3fa84e78c66d3f17fefb34e6b4d32fee54f7325e15adb807ecb148174679d3', '[\"*\"]', '2026-08-21 15:50:22', NULL, '2026-08-21 15:48:30', '2026-08-21 15:50:22'),
(524, 'App\\Domains\\Auth\\User', 77, 'auth_token', '03b860534c1e835bad956ec3abe338b56d8cd8aa094d4f9afb5fcffb9104c12b', '[\"*\"]', '2026-08-21 15:52:14', NULL, '2026-08-21 15:52:01', '2026-08-21 15:52:14'),
(525, 'App\\Domains\\Auth\\User', 226, 'auth_token', '8a7ba7d76650a69b353df0303982017d4bd288d8364f339faced1a0eaa955c35', '[\"*\"]', '2026-08-21 15:56:30', NULL, '2026-08-21 15:54:33', '2026-08-21 15:56:30'),
(526, 'App\\Domains\\Auth\\User', 226, 'auth_token', '28afae58dde2c45b4bf36ba975cdf52d9dc8cc9e908c160061b5402b84b344a9', '[\"*\"]', '2026-08-21 15:56:52', NULL, '2026-08-21 15:56:52', '2026-08-21 15:56:52'),
(527, 'App\\Domains\\Auth\\User', 226, 'auth_token', '93b6239f8e2ab047723b70ab60b6f16ae91e4e916acfdc625b7f05c8d54bd277', '[\"*\"]', '2026-08-21 15:57:11', NULL, '2026-08-21 15:57:10', '2026-08-21 15:57:11'),
(528, 'App\\Domains\\Auth\\User', 227, 'auth_token', 'd294658c40ec8be9dda086744aa9bc3b1cac56666198f44cbabcf408f3a5626a', '[\"*\"]', '2026-08-21 16:05:49', NULL, '2026-08-21 16:00:26', '2026-08-21 16:05:49'),
(529, 'App\\Domains\\Auth\\User', 228, 'auth_token', 'fd8aee260dc1a944fb2f7591f585ad22a3ac301ae76c3b367eb62143b8421b4e', '[\"*\"]', '2026-08-21 16:12:05', NULL, '2026-08-21 16:05:33', '2026-08-21 16:12:05'),
(530, 'App\\Domains\\Auth\\User', 227, 'auth_token', '22afefea4b2295acdbd5fc1a4b98ab9c069d9a39b7f09c5204efd83503495bad', '[\"*\"]', NULL, NULL, '2026-08-21 16:06:05', '2026-08-21 16:06:05'),
(531, 'App\\Domains\\Auth\\User', 229, 'auth_token', '3297c2d5c489a83d2d80b279e7bfc3fb5e171d6ba262ba2e2f6cda1128130f36', '[\"*\"]', '2026-08-21 18:53:10', NULL, '2026-08-21 16:07:38', '2026-08-21 18:53:10'),
(532, 'App\\Domains\\Auth\\User', 230, 'auth_token', '3de03bca626643b5b73a53a2a3f5b5cc91d702511095ca7acc4b6b6b9a766427', '[\"*\"]', '2026-08-21 16:11:52', NULL, '2026-08-21 16:09:47', '2026-08-21 16:11:52'),
(533, 'App\\Domains\\Auth\\User', 231, 'auth_token', '340c293f20be0f57a66df243102744617cac66a8c06b80a388a3dab7d540dc6e', '[\"*\"]', '2026-08-21 17:17:06', NULL, '2026-08-21 16:10:59', '2026-08-21 17:17:06'),
(534, 'App\\Domains\\Auth\\User', 183, 'auth_token', 'ea137798d004eb2a0a1220085427df726d50a935dc4e053bb748dcfc87ec06ad', '[\"*\"]', '2026-08-21 16:15:22', NULL, '2026-08-21 16:11:45', '2026-08-21 16:15:22'),
(535, 'App\\Domains\\Auth\\User', 135, 'auth_token', 'b564f53202370c917c939f5633f7b4b88ca29a552c689c5a6559584aecc61c6c', '[\"*\"]', '2026-08-21 19:45:12', NULL, '2026-08-21 16:13:05', '2026-08-21 19:45:12');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(536, 'App\\Domains\\Auth\\User', 77, 'auth_token', 'f1beb60c600ead8ce791536d74fb54cec1ba8282b3c9b9f8239f4e7d6d9d497c', '[\"*\"]', '2026-08-21 16:14:17', NULL, '2026-08-21 16:13:42', '2026-08-21 16:14:17'),
(537, 'App\\Domains\\Auth\\User', 183, 'auth_token', '9b2b6358e55140d7a9b7e2cc6551c235a854d174dac353043e5c7c2645b8fd6d', '[\"*\"]', '2026-08-21 16:16:58', NULL, '2026-08-21 16:15:45', '2026-08-21 16:16:58'),
(538, 'App\\Domains\\Auth\\User', 135, 'auth_token', 'b4994de9677a1e8ec6c829072af3ed2983cac7c145f489746465322f8ad23394', '[\"*\"]', '2026-08-21 16:17:33', NULL, '2026-08-21 16:16:42', '2026-08-21 16:17:33'),
(539, 'App\\Domains\\Auth\\User', 232, 'auth_token', 'efc7d2c90cbdef443bce1edbd293b63dd25256c819e8a8e8951d9140853b792c', '[\"*\"]', '2026-08-21 16:24:24', NULL, '2026-08-21 16:17:13', '2026-08-21 16:24:24'),
(540, 'App\\Domains\\Auth\\User', 233, 'auth_token', 'c66a45e5b8ba64e4165219afcf3552f559f595fb50801922e784779700d4116d', '[\"*\"]', '2026-08-21 16:28:17', NULL, '2026-08-21 16:23:31', '2026-08-21 16:28:17'),
(541, 'App\\Domains\\Auth\\User', 234, 'auth_token', '10315ef92c9cc581ca3ef3f04bc754f5f5f6f580e2e25cd884d6fe07e7f0981f', '[\"*\"]', '2026-08-21 16:23:47', NULL, '2026-08-21 16:23:31', '2026-08-21 16:23:47'),
(542, 'App\\Domains\\Auth\\User', 234, 'auth_token', '7b73c30565581c13d0d7371202193db02dc90df8873e8c026f891b52741cf165', '[\"*\"]', '2026-08-21 16:27:29', NULL, '2026-08-21 16:27:23', '2026-08-21 16:27:29'),
(543, 'App\\Domains\\Auth\\User', 234, 'auth_token', '31356c43f6dcb8f7887262a4567dc86a03b89aa812f5fe692d107b5a1fbeb2b1', '[\"*\"]', '2026-08-21 16:29:02', NULL, '2026-08-21 16:27:39', '2026-08-21 16:29:02'),
(544, 'App\\Domains\\Auth\\User', 235, 'auth_token', '3e27349d039980d6d576b319a1a5bc794238f86750e22c2a496f5d209a09b666', '[\"*\"]', '2026-08-21 16:39:07', NULL, '2026-08-21 16:33:53', '2026-08-21 16:39:07'),
(545, 'App\\Domains\\Auth\\User', 77, 'auth_token', '33138c8f50650d0436d3a0720db17809677114e5a325422d89d4072e8837823b', '[\"*\"]', '2026-08-21 16:49:38', NULL, '2026-08-21 16:48:14', '2026-08-21 16:49:38'),
(546, 'App\\Domains\\Auth\\User', 189, 'auth_token', '3681c833220e83c877e9cc7a449bd0661b95865e793d6843484b2ff364e72958', '[\"*\"]', '2026-08-21 16:52:48', NULL, '2026-08-21 16:50:59', '2026-08-21 16:52:48'),
(547, 'App\\Domains\\Auth\\User', 110, 'auth_token', '6f6b7bfa0a6a874b4da72d84d8f259a9cdda8a0d0e67d74c88cbc594a8326920', '[\"*\"]', '2026-08-21 16:59:45', NULL, '2026-08-21 16:55:57', '2026-08-21 16:59:45'),
(548, 'App\\Domains\\Auth\\User', 236, 'auth_token', '0cb91b182b81d982087c6a8314ec82a00c93b7496e25ba2dbc7ebb5a7477c872', '[\"*\"]', '2026-08-21 16:59:38', NULL, '2026-08-21 16:57:07', '2026-08-21 16:59:38'),
(549, 'App\\Domains\\Auth\\User', 127, 'auth_token', '940a86f7eae30fac48caf4a3e4dcf435d7ad9594447083450472f67dc7960584', '[\"*\"]', '2026-08-21 16:59:56', NULL, '2026-08-21 16:59:27', '2026-08-21 16:59:56'),
(550, 'App\\Domains\\Auth\\User', 208, 'auth_token', '8d735bd6941b874a3f5fdc10ef442b7172e9178384782906b7886fa5dd3e422b', '[\"*\"]', '2026-08-21 17:01:00', NULL, '2026-08-21 17:00:59', '2026-08-21 17:01:00'),
(551, 'App\\Domains\\Auth\\User', 208, 'auth_token', 'bf2bf6de3a6fc758f0b018b09cf02f9352c3cd0c635c90827c1a370bf0e65dbb', '[\"*\"]', '2026-08-21 17:03:29', NULL, '2026-08-21 17:01:21', '2026-08-21 17:03:29'),
(552, 'App\\Domains\\Auth\\User', 77, 'auth_token', 'dbcccfec4be00b7814e55404a31d2783bdd1c2ecbc9b96b27e1ad4f1a1089f35', '[\"*\"]', '2026-08-21 17:06:51', NULL, '2026-08-21 17:06:46', '2026-08-21 17:06:51'),
(553, 'App\\Domains\\Auth\\User', 77, 'auth_token', 'bafe15be00b4bad51e45cccec137c5766f9cd1f54a898cb4dbed9b0956ea2e7b', '[\"*\"]', '2026-08-21 17:14:06', NULL, '2026-08-21 17:12:55', '2026-08-21 17:14:06'),
(554, 'App\\Domains\\Auth\\User', 237, 'auth_token', 'ebb7827839e065d449143bec4e18f032cb8591d11375611f4859fb2f882a16a7', '[\"*\"]', '2026-08-21 17:21:06', NULL, '2026-08-21 17:20:14', '2026-08-21 17:21:06'),
(555, 'App\\Domains\\Auth\\User', 77, 'auth_token', 'ac10c0c8595f5e238d76f033e7894c3d86aa88dc6ab801c2b139bb3b832bf119', '[\"*\"]', '2026-08-21 17:29:04', NULL, '2026-08-21 17:26:58', '2026-08-21 17:29:04'),
(556, 'App\\Domains\\Auth\\User', 85, 'auth_token', 'cb65c5b6200cab896521b1abc3677681b8acb91e2d3092e773f579e7ed67a3dc', '[\"*\"]', '2026-08-21 17:57:28', NULL, '2026-08-21 17:30:05', '2026-08-21 17:57:28'),
(557, 'App\\Domains\\Auth\\User', 77, 'auth_token', '19aa1e9a46b41a7548b9e6ab51f8fbe8f9e8411bc0506ea39746e95e459137de', '[\"*\"]', '2026-08-21 17:31:17', NULL, '2026-08-21 17:30:51', '2026-08-21 17:31:17'),
(558, 'App\\Domains\\Auth\\User', 238, 'auth_token', '4369776f9a56ea4393ce086d5033c47e8d8e70c8d303b35c1e884bba70320851', '[\"*\"]', '2026-08-21 17:39:01', NULL, '2026-08-21 17:31:26', '2026-08-21 17:39:01'),
(559, 'App\\Domains\\Auth\\User', 77, 'auth_token', '5059226104afb0ac212e51597c78505cc8b84e240d5b170665c8e06701740d22', '[\"*\"]', '2026-08-21 17:32:38', NULL, '2026-08-21 17:32:28', '2026-08-21 17:32:38'),
(560, 'App\\Domains\\Auth\\User', 77, 'auth_token', '7d50ec47995bf3c2f87b97210f64dff071520804cecccfe011f92118a0738c4a', '[\"*\"]', '2026-08-21 17:39:04', NULL, '2026-08-21 17:38:42', '2026-08-21 17:39:04'),
(561, 'App\\Domains\\Auth\\User', 238, 'auth_token', '017a0a3a5803a71acfadf16d1d41f32bcff1711b4249d7ac785bcd34cc76a4cd', '[\"*\"]', '2026-08-21 18:55:19', NULL, '2026-08-21 17:39:11', '2026-08-21 18:55:19'),
(562, 'App\\Domains\\Auth\\User', 77, 'auth_token', 'd9eb346d93146e20dd835fb16171844ba27ab049e264f92764f1011f63f202ba', '[\"*\"]', '2026-08-21 17:47:21', NULL, '2026-08-21 17:40:32', '2026-08-21 17:47:21'),
(563, 'App\\Domains\\Auth\\User', 239, 'auth_token', '0d7c0fb2af32681f9c65c5654fb282e09161fef1a0042f1f8437371003debbd1', '[\"*\"]', '2026-08-21 17:45:01', NULL, '2026-08-21 17:41:37', '2026-08-21 17:45:01'),
(564, 'App\\Domains\\Auth\\User', 240, 'auth_token', 'c13fe7e73711fc5bd70f761793c192cf77b9d427cd63f63bb540d1552ddb9f0f', '[\"*\"]', '2026-08-21 17:51:05', NULL, '2026-08-21 17:47:09', '2026-08-21 17:51:05'),
(565, 'App\\Domains\\Auth\\User', 154, 'auth_token', '1c47bf99ec167af078b20074de725e6fb2a734991bb12209048fdb0dbd918cd5', '[\"*\"]', '2026-08-21 17:49:38', NULL, '2026-08-21 17:47:36', '2026-08-21 17:49:38'),
(566, 'App\\Domains\\Auth\\User', 77, 'auth_token', '70d3f2de55b70e40445deb2ab863d8480dafbd82e994ba9285cec0418d6b6dec', '[\"*\"]', '2026-08-21 17:51:49', NULL, '2026-08-21 17:49:23', '2026-08-21 17:51:49'),
(567, 'App\\Domains\\Auth\\User', 2, 'auth_token', '4fad54a3b29b630e7fc4dd723dace72dc9b0586bd5de05b26a2077af06c4bd52', '[\"*\"]', '2026-08-21 17:57:21', NULL, '2026-08-21 17:50:00', '2026-08-21 17:57:21'),
(569, 'App\\Domains\\Auth\\User', 77, 'auth_token', '960585e1921c821e1de06f1843eed6716686d895a982e1c0320ffc8a5bbcf24a', '[\"*\"]', '2026-08-21 17:57:25', NULL, '2026-08-21 17:55:40', '2026-08-21 17:57:25'),
(570, 'App\\Domains\\Auth\\User', 59, 'auth_token', '84f767ee809bbde0fc5db1c53c710f22f39f995e2e5b2233a55ea2c7df9a6c6e', '[\"*\"]', '2026-08-21 17:58:07', NULL, '2026-08-21 17:57:50', '2026-08-21 17:58:07'),
(571, 'App\\Domains\\Auth\\User', 2, 'auth_token', '509be2260890fac4df8cea6c6330d4c6fd87ea23c8da95cf928ef649702f03e7', '[\"*\"]', '2026-08-21 17:59:32', NULL, '2026-08-21 17:59:22', '2026-08-21 17:59:32'),
(572, 'App\\Domains\\Auth\\User', 10, 'impersonation_token', 'f2fa68a0e301f73b00a4805e15a0c6a8794d803fb462af32b3f8f26a2f8ce4c8', '[\"*\"]', '2026-08-21 18:25:29', NULL, '2026-08-21 17:59:32', '2026-08-21 18:25:29'),
(573, 'App\\Domains\\Auth\\User', 91, 'auth_token', 'd48b5e449437b6f3298187e26cf67e1c79130e7423e0b0616d51c724cf36e3d2', '[\"*\"]', '2026-08-21 19:55:40', NULL, '2026-08-21 18:00:37', '2026-08-21 19:55:40'),
(574, 'App\\Domains\\Auth\\User', 241, 'auth_token', '6cda03fc658eb6d4878127822823d09de61302947b4ad0bdcae6345f86d459e6', '[\"*\"]', '2026-08-21 18:08:14', NULL, '2026-08-21 18:05:59', '2026-08-21 18:08:14'),
(575, 'App\\Domains\\Auth\\User', 77, 'auth_token', '8c742527da7d3f6f6624272bed2b934221d403e81c5bbc6b30d562f12d2dd961', '[\"*\"]', '2026-08-21 18:07:49', NULL, '2026-08-21 18:07:35', '2026-08-21 18:07:49'),
(576, 'App\\Domains\\Auth\\User', 241, 'auth_token', '9932195bac086fede0b469f3e79c5aadee22f4c0f16cfa8ea0eecf42130134b6', '[\"*\"]', '2026-08-21 18:11:35', NULL, '2026-08-21 18:09:52', '2026-08-21 18:11:35'),
(577, 'App\\Domains\\Auth\\User', 77, 'auth_token', '50e15b7e9e46747ab6e2ab4b59b0c3353c6e40908a899ee0df102ee071bb9738', '[\"*\"]', '2026-08-21 18:19:06', NULL, '2026-08-21 18:18:23', '2026-08-21 18:19:06'),
(578, 'App\\Domains\\Auth\\User', 241, 'auth_token', 'd090738721511ee7ad4289414a17b8ebf11a70681492de8f15a3a9a2cf51417e', '[\"*\"]', '2026-08-21 18:37:24', NULL, '2026-08-21 18:37:13', '2026-08-21 18:37:24'),
(579, 'App\\Domains\\Auth\\User', 241, 'auth_token', '9d8d9e81a25f52140a2459d9e2e64a50b9abe5a3b693fb79652244486464ee9e', '[\"*\"]', '2026-08-21 18:42:00', NULL, '2026-08-21 18:40:29', '2026-08-21 18:42:00'),
(580, 'App\\Domains\\Auth\\User', 2, 'auth_token', 'c996a870c7f55f686841c7d5279a786f84daa3c52bff17ad5ff6b4590e98ae8d', '[\"*\"]', '2026-08-21 18:43:09', NULL, '2026-08-21 18:42:37', '2026-08-21 18:43:09'),
(581, 'App\\Domains\\Auth\\User', 10, 'impersonation_token', '8ac02a25273f3a8a480fb70a20d330be3c133f69ce66714a51a7b08220801e0d', '[\"*\"]', '2026-08-21 19:59:46', NULL, '2026-08-21 18:43:09', '2026-08-21 19:59:46'),
(582, 'App\\Domains\\Auth\\User', 242, 'auth_token', 'c4d8efd64e6d7d5b3a94910b80e11605c940c9ab3282b1ad066d9d50fe718ac6', '[\"*\"]', '2026-08-21 18:53:37', NULL, '2026-08-21 18:51:44', '2026-08-21 18:53:37'),
(583, 'App\\Domains\\Auth\\User', 243, 'auth_token', '58d63b6c8a1626b7877ad20d6a184babdc7349e7c63ee435cc59e6ce758841e5', '[\"*\"]', '2026-08-21 18:56:43', NULL, '2026-08-21 18:55:30', '2026-08-21 18:56:43'),
(584, 'App\\Domains\\Auth\\User', 208, 'auth_token', 'd553293a0df7912e972eaf39c71093590e9cf104e50800872be9ba34a85e5afc', '[\"*\"]', '2026-08-21 18:56:35', NULL, '2026-08-21 18:55:59', '2026-08-21 18:56:35'),
(585, 'App\\Domains\\Auth\\User', 77, 'auth_token', '6b21e4aa9cd140e2739f8322fb35e6eb303a214f02a7144a4c236847d86f52ec', '[\"*\"]', '2026-08-21 20:46:35', NULL, '2026-08-21 18:56:40', '2026-08-21 20:46:35'),
(586, 'App\\Domains\\Auth\\User', 208, 'auth_token', '0a2b28c491b075621e9cd2232f718b1d690c266c6b18838561e33d4cca8e9396', '[\"*\"]', '2026-08-21 18:57:43', NULL, '2026-08-21 18:57:11', '2026-08-21 18:57:43'),
(587, 'App\\Domains\\Auth\\User', 243, 'auth_token', '8fc53f8b099a68a62098801f8c9a3e66d534ca3f9ae56a38a856b597044078af', '[\"*\"]', '2026-08-21 18:57:15', NULL, '2026-08-21 18:57:14', '2026-08-21 18:57:15'),
(588, 'App\\Domains\\Auth\\User', 77, 'auth_token', '6b0c0d85f4c0b1f1d68133a49879ac33262124a3824919ae88a40fdb29c3bb12', '[\"*\"]', '2026-08-21 19:07:00', NULL, '2026-08-21 19:06:51', '2026-08-21 19:07:00'),
(589, 'App\\Domains\\Auth\\User', 244, 'auth_token', 'afc1352ea88f9dc5c245f8d4c24cf1c252079f4e9dc22f260f898537d6208a67', '[\"*\"]', '2026-08-21 19:10:54', NULL, '2026-08-21 19:10:48', '2026-08-21 19:10:54'),
(590, 'App\\Domains\\Auth\\User', 245, 'auth_token', '47fc42cb6d5538cf8993c11824e3f9974826dfb841b3733f7905c0053f17ecce', '[\"*\"]', '2026-08-21 19:11:38', NULL, '2026-08-21 19:10:56', '2026-08-21 19:11:38'),
(591, 'App\\Domains\\Auth\\User', 246, 'auth_token', '3061b0f516a6ef2704f401d0ec8404c8a582c2f3c3a86a636b6417f1d2ec6a5d', '[\"*\"]', '2026-08-21 19:20:31', NULL, '2026-08-21 19:12:53', '2026-08-21 19:20:31'),
(592, 'App\\Domains\\Auth\\User', 214, 'auth_token', '968fb37370a189d4691bb9259c549753e57fd195d16db4e9003d36e5bbf66567', '[\"*\"]', '2026-08-21 19:18:52', NULL, '2026-08-21 19:18:06', '2026-08-21 19:18:52'),
(593, 'App\\Domains\\Auth\\User', 178, 'auth_token', 'bbf92eec292a2e22f526461fa37de78778993bb78cdd36031d3928a293b3c1ac', '[\"*\"]', '2026-08-21 19:18:41', NULL, '2026-08-21 19:18:33', '2026-08-21 19:18:41'),
(594, 'App\\Domains\\Auth\\User', 178, 'auth_token', '99e6240857c721005fbd00b36b7558a0779f18fb0cb88034937b7fcdf4e40e27', '[\"*\"]', '2026-08-21 19:19:39', NULL, '2026-08-21 19:19:08', '2026-08-21 19:19:39'),
(595, 'App\\Domains\\Auth\\User', 247, 'auth_token', '118caa54377dc91b6c3a4ed064d265cf64f75c10c53f173a3fe19f677aad6925', '[\"*\"]', '2026-08-21 19:28:37', NULL, '2026-08-21 19:19:41', '2026-08-21 19:28:37'),
(596, 'App\\Domains\\Auth\\User', 248, 'auth_token', 'fe45692c2ab0fe8522bed311191ecc2822e52eaf7ff1502beb3666bea8aa868d', '[\"*\"]', '2026-08-21 19:31:22', NULL, '2026-08-21 19:21:03', '2026-08-21 19:31:22'),
(597, 'App\\Domains\\Auth\\User', 2, 'auth_token', '0db8d1be96f25b75105cba54e7f434fd571f44a5f239f9b9f39e3fc7a136e9db', '[\"*\"]', '2026-08-21 19:29:05', NULL, '2026-08-21 19:28:49', '2026-08-21 19:29:05'),
(598, 'App\\Domains\\Auth\\User', 10, 'impersonation_token', 'de3ad04188dd55f7ead64e91707494986a7c6e74729faa3a63db24351a8c25fd', '[\"*\"]', '2026-08-21 19:34:23', NULL, '2026-08-21 19:29:05', '2026-08-21 19:34:23'),
(599, 'App\\Domains\\Auth\\User', 247, 'auth_token', '10a702a3d3c5ee8884cd1a0aa163cdb037e357595f5b0cfd8759494e966ee9fc', '[\"*\"]', '2026-08-21 19:31:24', NULL, '2026-08-21 19:29:36', '2026-08-21 19:31:24'),
(600, 'App\\Domains\\Auth\\User', 248, 'auth_token', 'a84c565d25c4f64c02d1efad7149d60d968fb64890000502a81cf011799a13bc', '[\"*\"]', '2026-08-21 19:31:51', NULL, '2026-08-21 19:31:35', '2026-08-21 19:31:51'),
(601, 'App\\Domains\\Auth\\User', 249, 'auth_token', '3bda48264a01fd2224265d5959ca2ddb060dcd3116fcb33f793b6e14995648ea', '[\"*\"]', '2026-08-21 19:37:35', NULL, '2026-08-21 19:33:51', '2026-08-21 19:37:35'),
(602, 'App\\Domains\\Auth\\User', 249, 'auth_token', '84b407f256322442727a944200d88175db8fcbd1d181cfe713e314d7fa01cb90', '[\"*\"]', '2026-08-21 19:39:54', NULL, '2026-08-21 19:38:10', '2026-08-21 19:39:54'),
(603, 'App\\Domains\\Auth\\User', 250, 'auth_token', '6c4684578f6d2e8c0277ef243de065cd782a4a8cbbd036445e1d6cdac52188ea', '[\"*\"]', '2026-08-21 19:56:31', NULL, '2026-08-21 19:41:33', '2026-08-21 19:56:31'),
(604, 'App\\Domains\\Auth\\User', 2, 'auth_token', '85ac3eef1f5de0d7b0963db866030569080ddf7f2152cf680346a0551d67bbd3', '[\"*\"]', '2026-08-21 19:45:00', NULL, '2026-08-21 19:44:22', '2026-08-21 19:45:00'),
(605, 'App\\Domains\\Auth\\User', 10, 'impersonation_token', 'bb20e6bc5d592f2324e46b6bdc9bc74383c16e1cea1d4ce0ba0c6f5d7c51aefb', '[\"*\"]', '2026-08-21 20:13:50', NULL, '2026-08-21 19:45:00', '2026-08-21 20:13:50'),
(606, 'App\\Domains\\Auth\\User', 251, 'auth_token', '9970281424bc7312b69e421b2955e736a0c3f15d1940fe30f2a939b893b063db', '[\"*\"]', '2026-08-21 19:49:04', NULL, '2026-08-21 19:45:27', '2026-08-21 19:49:04'),
(607, 'App\\Domains\\Auth\\User', 252, 'auth_token', 'ce33de97ce05387bdad89a9b81a1c6221b26b3309cb10d15f50101117a345efc', '[\"*\"]', '2026-08-21 19:46:03', NULL, '2026-08-21 19:45:47', '2026-08-21 19:46:03'),
(608, 'App\\Domains\\Auth\\User', 252, 'auth_token', 'a02a92a421369f5e3275b010866491c3c94b1c4adc695dc5f8205aba83eddc9d', '[\"*\"]', '2026-08-21 19:55:42', NULL, '2026-08-21 19:46:24', '2026-08-21 19:55:42'),
(609, 'App\\Domains\\Auth\\User', 123, 'auth_token', '916c89cdf9590ea0aad660ab27167a633a8adb0166b91f5cb52a6a550533216e', '[\"*\"]', '2026-08-21 20:00:20', NULL, '2026-08-21 19:51:46', '2026-08-21 20:00:20'),
(610, 'App\\Domains\\Auth\\User', 253, 'auth_token', '317ff09a72272fb9587a3492f67c8efd30376afbeff53d6178383ff172840760', '[\"*\"]', '2026-08-21 19:54:10', NULL, '2026-08-21 19:52:12', '2026-08-21 19:54:10'),
(611, 'App\\Domains\\Auth\\User', 254, 'auth_token', 'd8fcf153845e897b0bce5bc3e55767b1b22ff8b76d8f5c425f2f0498f3c53201', '[\"*\"]', '2026-08-21 19:54:08', NULL, '2026-08-21 19:53:18', '2026-08-21 19:54:08'),
(612, 'App\\Domains\\Auth\\User', 253, 'auth_token', '3662d99c69ba9f89e8d4609cfb1ea8526cd2ed319a38c96df1758465c2eb9ad7', '[\"*\"]', '2026-08-21 19:54:28', NULL, '2026-08-21 19:54:28', '2026-08-21 19:54:28'),
(613, 'App\\Domains\\Auth\\User', 253, 'auth_token', '22a2bf19f2491a3250a4e541d6bbfba67054da4b31309f9b2bcc91bbaba37a3d', '[\"*\"]', '2026-08-21 19:57:15', NULL, '2026-08-21 19:56:40', '2026-08-21 19:57:15'),
(614, 'App\\Domains\\Auth\\User', 77, 'auth_token', 'be7e013943bab1191b656f54ae0269dee727a988d94f34ef907acec49ad56b71', '[\"*\"]', '2026-08-21 20:02:29', NULL, '2026-08-21 20:02:06', '2026-08-21 20:02:29'),
(615, 'App\\Domains\\Auth\\User', 2, 'auth_token', '55707c6ff175e6becc9c43b6b059db195e3e66779d623f7c71d29980ea2c60d6', '[\"*\"]', '2026-08-21 20:02:57', NULL, '2026-08-21 20:02:40', '2026-08-21 20:02:57'),
(616, 'App\\Domains\\Auth\\User', 10, 'impersonation_token', '88d144e3bae47f531b7ba18e9dda03a4a5817558f6117529ea02b092c22d8350', '[\"*\"]', '2026-08-21 20:38:12', NULL, '2026-08-21 20:02:57', '2026-08-21 20:38:12'),
(617, 'App\\Domains\\Auth\\User', 255, 'auth_token', 'ff5d182c349434efe467060dfa34ab9c6a98391d208a37df4ee7392b69f21f66', '[\"*\"]', '2026-08-21 20:19:57', NULL, '2026-08-21 20:11:20', '2026-08-21 20:19:57'),
(618, 'App\\Domains\\Auth\\User', 256, 'auth_token', '914106de9a4da408fe699c09ac374a5bfcc0f2aeb690e21b1d71c0b3b0e04bca', '[\"*\"]', '2026-08-21 20:37:10', NULL, '2026-08-21 20:36:49', '2026-08-21 20:37:10'),
(619, 'App\\Domains\\Auth\\User', 10, 'impersonation_token', '1f7edd3568aa6f98fc186e34d61434a6afc84e7dc1c56782f15a63190a1c3a4a', '[\"*\"]', '2026-08-21 20:38:12', NULL, '2026-08-21 20:37:31', '2026-08-21 20:38:12'),
(620, 'App\\Domains\\Auth\\User', 222, 'auth_token', '535faf87e70c3274d7381c92c12e67e0a0b288f0914e686043ce53709438a957', '[\"*\"]', '2026-08-21 20:39:08', NULL, '2026-08-21 20:38:17', '2026-08-21 20:39:08'),
(621, 'App\\Domains\\Auth\\User', 257, 'auth_token', '42df498884110514ed26c14eae66a11ea6f799382b4b6f7b32c4343c48c7a7ee', '[\"*\"]', '2026-08-21 20:44:48', NULL, '2026-08-21 20:42:21', '2026-08-21 20:44:48'),
(622, 'App\\Domains\\Auth\\User', 257, 'auth_token', '6f7329b03a64e10b5a34dac78888197e0e0b0bb4f231373242fdbe919fb42744', '[\"*\"]', '2026-08-21 20:44:58', NULL, '2026-08-21 20:44:48', '2026-08-21 20:44:58'),
(623, 'App\\Domains\\Auth\\User', 77, 'auth_token', '608184d0f2a4d65536b1bae3f54671bbb45214aa1549fc810257c7f0e0ccdc4d', '[\"*\"]', '2026-08-21 20:47:14', NULL, '2026-08-21 20:46:49', '2026-08-21 20:47:14');

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
(5, 4, 'Mie', NULL, 'Mknn', 10000.00, 4, NULL, 1, NULL, 4, 0.00, 0, '2026-08-18 15:42:04', '2026-08-09 10:45:54', '2026-08-18 15:42:04'),
(6, 4, 'dimsum', NULL, 'snack', 10000.00, 0, 'kantin_kantin/products/gcASNOfHT5NhYs9o33rVInbrXqcWNzMMvBqowhjv.png', 1, NULL, 0, 0.00, 0, '2026-08-18 15:38:52', '2026-08-17 20:11:13', '2026-08-18 15:38:52'),
(7, 6, 'DIMSUM ORIGINAL isi 6', NULL, 'Makanan', 18000.00, 3, 'kantin_kantin/products/21EeZgz9RhiY5Y8otheQmACnibIM3vLSTedZujnV.png', 1, NULL, 3, 0.00, 0, NULL, '2026-08-18 15:26:29', '2026-08-21 15:16:00'),
(8, 6, 'Dimsum mentai spicy isi 6', NULL, 'makanan', 23000.00, 6, 'kantin_kantin/products/8977vQv0INYNynGXneuGz37pVNtmMum9X0xJfy9C.png', 1, NULL, 6, 0.00, 0, NULL, '2026-08-18 15:27:26', '2026-08-21 16:16:31'),
(9, 4, 'Mie Suit', NULL, 'level 1,2,3', 13000.00, 0, 'kantin_kantin/products/hkenzSyy3kwBMGXHixKgySsTqL17sPdPJvndHbB7.jpg', 1, NULL, 0, 0.00, 0, NULL, '2026-08-19 19:20:12', '2026-08-21 14:47:20'),
(10, 4, 'Mie Hompimpa', NULL, 'level. 1,2,3', 13000.00, 0, 'kantin_kantin/products/XEHUdxCzPSgrABwPJm8zRIbYZCUbdlgBtZ5Mfox4.jpg', 1, NULL, 0, 0.00, 0, NULL, '2026-08-19 19:20:51', '2026-08-20 13:36:23'),
(11, 4, 'Mie Gacoan', NULL, 'level 1,2,3', 13000.00, 19, 'kantin_kantin/products/CLVFjbt5xiehgh0Y6vkpPVGGQnTFG6CLgfFm7rBA.jpg', 1, NULL, 19, 0.00, 0, NULL, '2026-08-19 19:21:21', '2026-08-21 16:14:08'),
(12, 4, 'Udang Keju', NULL, 'snack', 10000.00, 0, 'kantin_kantin/products/AUydoUL2vh4O0cJ2dE9e3iaazQWvbuCr3kHeVRXN.jpg', 1, NULL, 0, 0.00, 0, NULL, '2026-08-19 19:23:27', '2026-08-19 19:23:27'),
(13, 4, 'Udang Rambutan', NULL, 'snack', 10000.00, 0, 'kantin_kantin/products/eAihT7B1VO8bEKgvvO0ksp0AeZBqIfnTarzqae30.jpg', 1, NULL, 0, 0.00, 0, NULL, '2026-08-19 19:24:00', '2026-08-19 19:24:00'),
(14, 4, 'siomay', NULL, 'snack', 10000.00, 0, 'kantin_kantin/products/TyFlzZUBTabDSHt36vfeRaueOxWj9V9DmDxaQykp.jpg', 1, NULL, 0, 0.00, 0, NULL, '2026-08-19 19:24:32', '2026-08-19 19:24:32'),
(15, 4, 'Lumpia Udang', NULL, 'snack', 10000.00, 1, 'kantin_kantin/products/eVqQtrZ85XwYV52mpAMU2wTMausge0KdnTevo9GL.jpg', 1, NULL, 1, 0.00, 0, NULL, '2026-08-19 19:25:09', '2026-08-21 15:38:50'),
(16, 5, 'Bakso Sapi Halus', NULL, NULL, 16000.00, 1, 'kantin_kantin/products/cYCC4sZzPPppAxHXKZu40D59LDRVxffFu2tI6OWj.png', 1, NULL, 1, 0.00, 0, NULL, '2026-08-19 19:33:49', '2026-08-20 13:10:55'),
(17, 5, 'Bakso Mercon', NULL, NULL, 16000.00, 0, 'kantin_kantin/products/6suuvUrHL4j94yzahgmAHHhfIhga7YT8B7EpnVcm.png', 1, NULL, 0, 0.00, 0, NULL, '2026-08-19 19:36:06', '2026-08-19 19:36:06'),
(18, 5, 'Bakso Telur', NULL, NULL, 16000.00, 0, 'kantin_kantin/products/lwAOfFkR6U7v8I8iNwhl9InkzRHR81FTdVke2ouC.png', 1, NULL, 0, 0.00, 0, NULL, '2026-08-19 19:37:07', '2026-08-19 19:37:07'),
(19, 7, 'Mie Ayam', NULL, NULL, 13000.00, 2, 'kantin_kantin/products/ouRHZWI0cbaXDf0v5K6ZikbSGGk5yQmbFvtJql4n.png', 1, NULL, 2, 0.00, 0, NULL, '2026-08-19 19:44:07', '2026-08-21 15:03:21'),
(20, 8, 'Nasi Goreng cikrak \"OGES KANE\"', NULL, NULL, 16000.00, 2, 'kantin_kantin/products/N80XMSRq0yG5uN5uWIpWpgy8zOzSn5pO2LCyCraa.png', 1, NULL, 2, 0.00, 0, NULL, '2026-08-19 19:47:46', '2026-08-20 15:42:07'),
(21, 9, 'Seblak Paket 1', NULL, 'kerupuk oren, kerupuk putih, cuanki, sosis merah, bakso', 16000.00, 0, 'kantin_kantin/products/FqBtMC6zXFVNjhcyMYYIRrfWiQ3NobgVeU3AMcCm.jpg', 1, NULL, 0, 0.00, 0, NULL, '2026-08-19 19:56:19', '2026-08-19 19:56:57'),
(22, 9, 'Seblak paket 2', NULL, 'kerupuk oren, kerupuk putih, kerupuk mawar, cuanki, sosis merah, bakso, kembang cumi', 19000.00, 0, 'kantin_kantin/products/6VbWt4HLnf0gCrtvwVnZZDNZoYtEcJCnhKb38tZC.jpg', 1, NULL, 0, 0.00, 0, NULL, '2026-08-19 19:57:59', '2026-08-19 19:59:29'),
(23, 10, 'sate taican', NULL, 'daging', 23000.00, 0, 'kantin_kantin/products/c2J5CQWOpOgY2cvdvQMXvlXQAkxz4mWeGyD1dxIs.png', 1, NULL, 0, 0.00, 0, NULL, '2026-08-19 20:04:50', '2026-08-19 20:04:50'),
(24, 11, 'Nasi padang', NULL, 'Lauk Ayam', 16000.00, 0, 'kantin_kantin/products/UCDeYdMAVmAm9vacJsafrT5mk82labE2nWLerobC.png', 1, NULL, 0, 0.00, 0, NULL, '2026-08-19 20:07:33', '2026-08-19 20:07:33'),
(25, 11, 'nasi padang', NULL, 'lauk udang', 18000.00, 0, 'kantin_kantin/products/eq7qnDJ2cKefVUN5Y5OaacJhHR1Nwqr5YWRkdDR5.png', 1, NULL, 0, 0.00, 0, NULL, '2026-08-19 20:08:05', '2026-08-19 20:08:05'),
(26, 12, 'Martabak telur', NULL, NULL, 25000.00, 0, 'kantin_kantin/products/pxkOwv6NTRNJnkDEZj4859YIKihhG6Mjm7n6ILeh.png', 1, NULL, 0, 0.00, 0, NULL, '2026-08-19 20:10:29', '2026-08-19 20:10:29'),
(27, 13, 'Terang Bulan rasa coklat', NULL, NULL, 22000.00, 0, 'kantin_kantin/products/IAyHokFWdllY9rW1zBdBkR6wuLE2L7ROv4WYDcKa.png', 1, NULL, 0, 0.00, 0, NULL, '2026-08-19 20:11:11', '2026-08-19 20:11:24'),
(28, 14, 'nasi ayam geprek', NULL, NULL, 12000.00, 0, 'kantin_kantin/products/Y9NrdKRimNP7PihXPBnj9qKWPg79wQgG3fspYnsq.png', 1, NULL, 0, 0.00, 0, NULL, '2026-08-19 20:12:46', '2026-08-19 20:12:46'),
(29, 15, 'Paket Matah 1', NULL, 'Ayam Paha atas/dada, Nasi, sambal matah, Es Teh,', 26000.00, 0, 'kantin_kantin/products/32dtiOMwWVgErtnSFOWLDRrdyQjnEwm9a1ohCKng.png', 1, NULL, 0, 0.00, 0, NULL, '2026-08-19 20:15:42', '2026-08-19 20:15:42'),
(30, 15, 'Paket Terasi 1', NULL, 'Ayam Paha atas/dada, Nasi, sambal terasi, Es Teh,', 26000.00, 0, NULL, 1, NULL, 0, 0.00, 0, NULL, '2026-08-19 20:16:21', '2026-08-19 20:16:21'),
(31, 19, 'Tropisco Big Brown Sugar', NULL, 'Minuman', 13000.00, 0, 'kantin_kantin/products/IzHMCnmkU2e6dDXEMKd5zrhOgv2Z1cFAzD28yzMB.jpg', 1, NULL, 0, 0.00, 0, NULL, '2026-08-20 05:50:50', '2026-08-20 06:07:45'),
(32, 19, 'Tropisco Es Degan Coklat', NULL, 'Minuman', 15000.00, 0, 'kantin_kantin/products/edWmJnSyzEanZSPWR9DYCtv1St3EIQUz191YF489.jpg', 1, NULL, 0, 0.00, 0, NULL, '2026-08-20 05:53:20', '2026-08-20 05:55:14'),
(33, 19, 'Tropisco Cocopandan Small', NULL, 'Minuman', 10000.00, 0, 'kantin_kantin/products/PWkConJ42aEY11ju6bX9lgA6ZabntyHGGwL6TGea.jpg', 1, NULL, 0, 0.00, 0, NULL, '2026-08-20 05:57:37', '2026-08-20 05:57:37'),
(34, 19, 'Tropisco Melon Small', NULL, 'Minuman', 10000.00, 0, 'kantin_kantin/products/MOtdbtjHPHa5v8KX4LLSyRDrHMq5S8XIo7NYQvML.webp', 1, NULL, 0, 0.00, 0, NULL, '2026-08-20 06:00:23', '2026-08-20 06:00:52'),
(35, 19, 'Tropisco Original Big', NULL, 'Minuman', 11000.00, 0, 'kantin_kantin/products/mjNYrtKaP5zz7Db6ZXDq4eRd3E7bCpv11zCPUiEu.jpg', 1, NULL, 0, 0.00, 0, NULL, '2026-08-20 06:03:04', '2026-08-20 06:03:04'),
(36, 19, 'Tropisco Original Small', NULL, 'Minuman', 10000.00, 0, 'kantin_kantin/products/BNqFlxMQqp8Gqbun9bP4EcG5jOoFpzBHUBTQTIbt.jpg', 1, NULL, 0, 0.00, 0, NULL, '2026-08-20 06:03:30', '2026-08-20 06:03:40'),
(37, 19, 'Tropisco Melon Big', NULL, 'Minuman', 12000.00, 0, 'kantin_kantin/products/R5ybMC8U7itcrZI8lmcmda2r9ZFJAZgIKd0MEVZJ.webp', 1, NULL, 0, 0.00, 0, NULL, '2026-08-20 06:04:14', '2026-08-20 06:04:49'),
(38, 19, 'Tropisco Brown Sugar Small', NULL, 'Minuman', 11000.00, 0, 'kantin_kantin/products/EWIfjXH0SKEpj8IharYxLKwywTlD82XH97Q5FJpd.jpg', 1, NULL, 0, 0.00, 0, NULL, '2026-08-20 06:06:57', '2026-08-20 06:07:25'),
(39, 18, 'Momoyo Strawberry Jasmine', NULL, 'Minuman', 19000.00, 0, 'kantin_kantin/products/5wpMQLWfrR1LnAKmYhLiFHDiiZtvDaFD30wf91ne.webp', 1, NULL, 0, 0.00, 0, NULL, '2026-08-20 06:21:33', '2026-08-20 06:21:33'),
(40, 18, 'Momoyo Ice Cream Matcha', NULL, 'Minuman', 12000.00, 0, 'kantin_kantin/products/YZwgERuxAr12dHTeZFcU9Xo0gGGrMfYKYRXqZvg9.webp', 1, NULL, 0, 0.00, 0, NULL, '2026-08-20 06:23:35', '2026-08-20 06:23:44'),
(41, 18, 'Momoyo Ice Cream Vanilla', NULL, 'Minuman', 12000.00, 0, 'kantin_kantin/products/0CCyqWu77VVGno7GJsG1Z7Pa041MhmqIhkZmV1aV.webp', 1, NULL, 0, 0.00, 0, NULL, '2026-08-20 06:24:02', '2026-08-20 06:24:28'),
(42, 18, 'Momoyo Ice Cream Coklat', NULL, 'Minuman', 12000.00, 0, 'kantin_kantin/products/02T4thSOiTsc1VcmzggdSpy9clXkUyOGwqtln6Fg.webp', 1, NULL, 0, 0.00, 0, NULL, '2026-08-20 06:24:20', '2026-08-20 06:24:20'),
(43, 18, 'Ice Cream Strawberry', NULL, 'Minuman', 20000.00, 0, 'kantin_kantin/products/guKmHuuWI4W0ecoVS3x7LaplHQdVN2xQQ63nGjpT.png', 1, NULL, 0, 0.00, 0, NULL, '2026-08-20 06:27:31', '2026-08-20 06:27:31'),
(44, 18, 'Ice Cream Matcha', NULL, 'Minuman', 20000.00, 0, 'kantin_kantin/products/GH2RX4SMaNKnkVh3NC8oyf252NDWVikMDItrcWlo.png', 1, NULL, 0, 0.00, 0, NULL, '2026-08-20 06:27:51', '2026-08-20 06:27:51'),
(45, 18, 'Lemon Black Tea', NULL, 'Minuman', 16000.00, 0, 'kantin_kantin/products/TkwUEkECL4j11voo9nu9FVhy4ty9WXOa5MNdrYwt.webp', 1, NULL, 0, 0.00, 0, NULL, '2026-08-20 06:34:32', '2026-08-20 06:34:32'),
(46, 18, 'Lemonnode', NULL, 'Minuman', 14000.00, 1, 'kantin_kantin/products/Fk70atTDxhms6ME7tbiPtJc32VAdE6QnMmFgJsHO.webp', 1, NULL, 1, 0.00, 0, NULL, '2026-08-20 06:35:31', '2026-08-21 15:38:50'),
(47, 18, 'Passion Crystal Boom', NULL, 'Minuman', 23000.00, 0, 'kantin_kantin/products/WQnImGEueaDiMGybkXzpQh9wZgEIzoViebxhlkri.webp', 1, NULL, 0, 0.00, 0, NULL, '2026-08-20 06:38:45', '2026-08-20 06:38:45'),
(48, 17, 'Nestle Lemonade', NULL, 'Minuman', 13500.00, 1, 'kantin_kantin/products/Zgukl3NZgbG1xBWuVC9O0tw6tYPh6ayme9kaRusH.jpg', 1, NULL, 1, 0.00, 0, NULL, '2026-08-20 06:52:29', '2026-08-20 16:10:33'),
(49, 17, 'Nestle Milo', NULL, 'Minuman', 17500.00, 0, 'kantin_kantin/products/ihWPYTYWgaoForNg1ocmEXoX0HNVrXY8cDbyCzAQ.jpg', 1, NULL, 0, 0.00, 0, NULL, '2026-08-20 06:54:49', '2026-08-20 06:55:35'),
(50, 17, 'Nescafe Caffe Latte Normal', NULL, 'Minuman', 17500.00, 2, 'kantin_kantin/products/XFM0swH4WdONqxg4wfbsbPsBKk2uFXfxrod9XOD6.jpg', 1, NULL, 2, 0.00, 0, NULL, '2026-08-20 06:57:02', '2026-08-21 15:38:50'),
(51, 17, 'Nescafe Caffe Latte Strong', NULL, 'Minuman', 19500.00, 0, 'kantin_kantin/products/S3WwK5aT34jzD1XLUvsYqdQVHBXsZ59AOE37Yt3p.jpg', 1, NULL, 0, 0.00, 0, NULL, '2026-08-20 06:58:05', '2026-08-20 06:58:05'),
(52, 17, 'Nestle Lemon Tea', NULL, 'Minuman', 13500.00, 0, 'kantin_kantin/products/6HJWjUeHAWQcTplcSbkGc43McyKTiv8vEKIl4sAQ.jpg', 1, NULL, 0, 0.00, 0, NULL, '2026-08-20 07:00:12', '2026-08-20 07:00:12'),
(53, 16, 'Ayam Penyet', NULL, 'Nasi + Ayam Goreng +Tempe+Tahu+ Lalapan + Sambal', 21000.00, 0, 'kantin_kantin/products/lfkb7tWHQOYAVMrE3SsD9O6imMWBx00drE5qCpIi.jpg', 1, NULL, 0, 0.00, 0, NULL, '2026-08-20 07:04:13', '2026-08-20 07:06:16'),
(54, 16, 'Lele Penyet', NULL, 'Nasi + Lele Goreng + Lalapan + Sambal', 16000.00, 0, 'kantin_kantin/products/KNroH5ofHFRJk6P3pmCoNdUvMpkctZHcXHWcOxav.jpg', 1, NULL, 0, 0.00, 0, NULL, '2026-08-20 07:08:07', '2026-08-20 07:08:07'),
(55, 16, 'Lele', NULL, 'Lele Goreng + Sambal + Lalapan', 15000.00, 0, 'kantin_kantin/products/fzWztkvPgDF8BpGw1b8qX064im20WAzxDFFIciLy.jpg', 1, NULL, 0, 0.00, 0, NULL, '2026-08-20 07:09:07', '2026-08-20 07:09:07'),
(56, 16, 'Ayam Penyet', NULL, 'Ayam Goreng+ Sambal + Lalapan', 17000.00, 0, 'kantin_kantin/products/bKoBnOaPrWGH0OJocYnfFdQSo6wgOZINPE8usChP.jpg', 1, NULL, 0, 0.00, 0, NULL, '2026-08-20 07:16:13', '2026-08-20 07:16:13'),
(57, 16, 'Nasi Ayam Penyet + Es Teh', NULL, 'Makanan', 23000.00, 0, 'kantin_kantin/products/zfpGyJFXwL7PuTb1TQfC8hvzQPK8URaYBET9Ck8J.jpg', 1, NULL, 0, 0.00, 0, NULL, '2026-08-20 07:19:26', '2026-08-20 07:19:26');

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
('09nQuc2hqGA2DSrvW73dRpM2eBJDIoIiKQbvY8Mz', NULL, '182.5.232.66', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJ0Y0VGMEJsTVBydE03blhmRTJZczlWcEkzRlM1QmpxVXgwZXp1cXAyIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787301987),
('0bq3cgyRUxtc3lmwxwORAK3P3JfVBZGh1RTya7Ql', NULL, '114.79.19.110', 'Mozilla/5.0 (Linux; U; Android 12; in-id; CPH2043 Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.5970.168 Mobile Safari/537.36 HeyTapBrowser/45.14.6.1', 'eyJfdG9rZW4iOiJiTjEyVEJrR0RWdTZoUWNQdUJOaFBEaFhmem5QbktrVmdjRXU5RENFIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787298727),
('12VBCupxbouX5FcFTHezN6FP1iDGJaYjA5L0ENer', NULL, '114.10.154.9', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJnWEdwSVZKYkdUcnlzWkYwcUd3OFVpRDZWRjFpc3IxYWtaZUM2NWFyIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787302621),
('1NA3NDbvh72rNCvkslpROaG9Rp6A05E5CQjS6rVh', NULL, '114.10.154.191', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/143.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiI5Y1lxeE5tc0Fubkc4eEpyc254aFIyTUZMRVBXQVFrNk1xaWpJbnhpIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvZGFzaGJvYXJkIiwicm91dGUiOiJnZW5lcmF0ZWQ6OjZpNjB6MGxGek40V2Roc3QifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1787303510),
('1Wvxal6hffIuyst1uTAeKQkSVTUGkN0HdekpMBbw', NULL, '103.76.151.61', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJ4T2xoYmpjd3lwSWZaQ1lwYllHM2FJTWx2WHNQVDM1cUl4eHRaUTZxIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787309917),
('2MVZkg6uXlbWo1vRnlICoKumJAFdkyeKMU6KymnZ', NULL, '114.10.154.204', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJnZ0NiTlM0Z0ZEYlJ1YzZ0cjZTajdsZFFJUDdEU25keXpIUXk4QmhvIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787305831),
('2ndXw7pQBcNqYrkeOHeJ5tFeKM2JpzchrXp55hXT', NULL, '114.79.4.5', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Safari/537.36 HeyTapBrowser/45.14.0.1 Chrome/115.0.5970.168', 'eyJfdG9rZW4iOiJKYzljYzR6c0VpVWxuQms0eTNZelpITmJSaWdRZzcycUc0QlB3bjJSIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787310170),
('5CA10sBe38YaA9LEqlnvyi4Ay8sfjmFsUVj1mzDD', NULL, '202.154.45.199', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJoN04yYlVlVk05cXBKdGN5dDBsaEs0U3BxRmNXMXZyaDFMSmZvNkhTIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787301748),
('5caN1VDdQgaMd5DFgxcvc3JCUWF6KcevmdjVioOS', NULL, '103.17.77.94', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0', 'eyJfdG9rZW4iOiI5MlcyY3RNenRpd2t6amlXZ0ttRVZOaGs5ZEZXRkRldXY1eVRXQU5rIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787319838),
('6aCOh3Op5xXbCBY2T0xWfqygDYAaRjsE7FSDAQ8h', NULL, '182.5.241.9', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJPSXBqM2N2Q1ZKcmU3UE9JTmFaNm1Qck9LT1ozSFRySHBvREFOUndPIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787304150),
('6IbQH1pxwT6XNVyQPbVCLYONYvj9QhWNWUHsfpe1', NULL, '14.0.171.190', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJxbklxMnlDdzgwUzcyWGpIYVAwTGhYU1lwTU13Nlh1MENOMWk1dXFLIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787306452),
('7UibFNYpnqxfiqnfWkHo0zl5ohAD9mPBI3x9sSnx', NULL, '202.154.45.199', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/143.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJWelZhQVhmMWh3d09wVE1iME9pT3NTeWtWU1F4V3hHZ3RubE5ZZnh2IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787302066),
('8Jm01Bp6Rbgt5q5GWJjjCAROJZ8a3EHMABpPrdhy', NULL, '114.10.155.247', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJlMVQ4dXl6STRQenVQcnJMNU9UeVVBTWRwazBNR1lFczRCcVA0dmdEIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787315026),
('A18ZB4P3pESJl8Px2qw4vyIM24P0av5FwPjJrEMP', NULL, '114.5.240.38', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJlQUlCbTNxU1BSdHBCRE1rYndUODA0aHZSQ0NaMXN3VTlwM1l0dFg4IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787319427),
('aPwN4pQ3wYvZiVN3bXxQm1qMSh6pYvIwnIL5nSeO', NULL, '103.124.139.155', 'WhatsApp/2.23.20.0', 'eyJfdG9rZW4iOiI2VmNQaERreVRDUXRtYVZDYmNxRzBtVW8zNjM5V1NFTUtiVEZUbDc1IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787302083),
('ATGCpbqAuvVB8YDpMcYLOmoxiCVEbAehTO14woEg', NULL, '182.3.100.72', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5.2 Safari/605.1.15', 'eyJfdG9rZW4iOiJBNjVpTVJaeGppNzB3ZmFHZ1ZnOVhvWk9QZklGanZUU2tJeUd1UUhlIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787319337),
('bAjMiGEXyppFhWj8ovbm4wX6v4Jar5IjK2Ual4Ir', NULL, '103.177.11.105', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiIyT3YwRDMyQks3emdvMlhwYnNKMHNKYVk3bzlWWjh3SFZZYTBhd3dXIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787313005),
('BnqsC5lNkNz2k8KT277eufbZL7NVdX4RKI8TMZu8', NULL, '114.10.154.142', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJEMnRxMXpKbFd5SEx3Mkl0N3BmSUltU1dMSUFnVGphejlBTmE0cHRXIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787303756),
('bRX0nLclWcvW5MrV3yFAUa1JHKmbhng5V1v5yxEx', NULL, '114.8.229.35', 'Mozilla/5.0 (Linux; U; Android 12; in-id; CPH2477 Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.5970.168 Mobile Safari/537.36 HeyTapBrowser/45.14.6.1', 'eyJfdG9rZW4iOiJOcFRUa2pFV2E0d0x1RG5VMXV0d0FaeWVJUWtRWHo4UE9pTTFWcXVoIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787303013),
('BwfSSHGCy0H3BWXsitkLD2oDXOeOMk2930n5TdXb', NULL, '114.10.154.196', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJDOE5GRm1sZXQ3SWh1b0RJalc2TGZXaDU2UjJzRjZieUZqbWt5bHkxIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787304529),
('bXCxGpukgvcuyO3Gy1VHM4SuC6mamf21DediX4YA', NULL, '182.6.65.179', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJNWDRlUGFtME1qWE1GTUF3UTV4ZnhTV1MzM2hnSmxCRk1DNk9pVlZBIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787318397),
('CDBrqMCYl4GUh3Lp61CfKnqq0NcSGG9Qn2TSOrrx', NULL, '103.177.11.105', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJqTnFZWmxMSGREV2U2bHphZDZDNnBndWlBUlZSWXZrd0JlMzFhUGMzIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787300817),
('ChSZoZTnmGarKTmLLVVMhWWKqoTkYAp3IrkiIvj8', NULL, '157.15.67.140', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJlT0hSbWxQRzRRMWlVU01RdEwyTm45TFgzUFlyUkMzNVZtMUVmVldsIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787303498),
('dMpDPQPaQwMhSbA6abAq8rpC3CKnvfP26k0hQKSm', NULL, '103.141.108.101', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJLM3pPdnRLamM0T2pacDJlZTBLY24wV3drZnpsSmZwZk1raXpQck5UIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvZGFzaGJvYXJkXC9wcm9maWxlIiwicm91dGUiOiJnZW5lcmF0ZWQ6OjZpNjB6MGxGek40V2Roc3QifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1787304097),
('DVja40TEnUg95giympleOwQx66P4HjPsgsKnTJKT', NULL, '157.15.67.140', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJsV1haOGhjSTV2dnBUeFZ5ck9vU0JZME9URUEwdjdTamtUV2cySThkIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvZGFzaGJvYXJkXC9wZW1iYXlhcmFuIiwicm91dGUiOiJnZW5lcmF0ZWQ6OjZpNjB6MGxGek40V2Roc3QifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1787303498),
('dvnO1yKBpVBV6KNndkcMgYQ84dRJCbF2uFX4gqwN', NULL, '156.230.191.207', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJ0UzdDa0xRMUFxZWkyTEFMN3FzZU11NERqVTluOHhjVHh6V01wbmk3IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787319269),
('DWSepN6XRg1RGiyt8XGsWM4IqPqlbSOeV3UQ8Ndq', NULL, '114.10.155.236', 'Mozilla/5.0 (Linux; Android 13; V2109; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0.6778.200 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJPdnRUU3YwcnNJc3UzRDV0enpHTDlFSVRPMmRBelJuNDIzd05UMjVPIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787300244),
('DZPibj3nHKaXGmij9hb9UKLAuCGmDshM4x1MKIjg', NULL, '103.147.73.125', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiIzZ0tpOHRJMGhxOFMxRmtreFdCNzZiSzlCTzBjTTlwT3RiazdCUHBKIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787316256),
('EecKj4dpMkoNcfBtw89AOayPlxbNS44eDgu74dJ8', NULL, '114.10.154.196', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJzSWVQYVJYajVLbDhROUxGcnRHb2UzWjlLeTlwekNPcDY5cXpxUzdHIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787304753),
('ejJ0XRP3vJDJ3A4eirSKPQtoxVOVPJyCZwAQGGc9', NULL, '114.10.155.237', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiI5MW51MTh3N0Z0V3h3cG16Ynh3RUFaeGhZY20xS2pkTllwdm1RVEdGIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787301014),
('EkNhNNe7VRZL9ik0uC88WU5C9kIRk7MEpeN1HBoK', NULL, '114.10.154.248', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJjeFBjbXN3U2hxSXIwWWhZTUdGTEw0QlpVeWl5QnRhbHBiZG9SZU9jIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787311349),
('EsxNuZ8Km4eI4wS1LjPpB4YiBV3gnKa8mbtb9ymb', NULL, '114.10.154.213', 'Mozilla/5.0 (Linux; Android 10; M2003J15SC) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.7049.79 Mobile Safari/537.36', 'eyJfdG9rZW4iOiI1THdSc013SFVsQ2wwWnAwZDEzdmhRZ2FHN0RuTHJmR2tHQUlLRHVVIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787308201),
('EXMsKfUrOZaj3o3al2OMUHXz9ZOk4FbrTROGEuUq', NULL, '114.5.247.133', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJ1YmxpcWJDWHVDcGNDNjBhRFJ6SUV6bzcyaHYxeFpEaWpOVDQ0RENDIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvZGFzaGJvYXJkXC9wZW1iYXlhcmFuIiwicm91dGUiOiJnZW5lcmF0ZWQ6OjZpNjB6MGxGek40V2Roc3QifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1787300585),
('FAfatXSYUWwUec16NwIVBHOKrMLnfr61XgKtq65x', NULL, '103.178.13.39', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJ0dmh5RE5BbUczTjhhd3JXUXpBc1gyM0FEdldxWmRWOFg4M0xRdU1kIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787314237),
('fbP0YdV1TlhxP4ZpwANRrbjVURT2au7TSLGn97Ou', NULL, '114.10.154.248', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJQVUlJOEVzRGFsc0hveDRWZUdpV1p3TWVVQ2hvUFNCS3BJaE05ak5nIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787316073),
('fIBjIfmmH1zCdkTAKq4T2gQqeGRTgOsxxEXMppMi', NULL, '202.154.45.199', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiIyeHI4NEU0cHVzOVFUQUpHVzVScUJiek93dWVvbGZTVlE1cUtDM0N4IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787314198),
('FKF2FL3uU0MpoSXRq88KQsX2iyKj8T6gf2gbX61m', NULL, '103.177.11.105', 'Mozilla/5.0 (Linux; U; Android 10; in-id; CPH2185 Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.88 Mobile Safari/537.36 HeyTapBrowser/45.10.4.9.1.2', 'eyJfdG9rZW4iOiJGVnNHWnI4bE9DZnd3c01lcklDb3dvUU16WXJITXNleVNEUnhGTDBEIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787310578),
('fmnuBoZ3IJYjeaoekOiXqNfxMacvdCpN4IiAt8b6', NULL, '114.10.154.183', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJqU3Y4Q2l4UWJ3SGxQbHI2NWw5Q1hybHpqTng1NWFSYkQyc1dGeGgzIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787301914),
('FOQitN1nEYO5V9HocDpNIE4fZGejynFUGiJY6iF1', NULL, '14.0.171.190', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJtOURsSVN2dm81MUZlTnhDa0w1R3JaVFVsMWxobjJjM01reG1lZ1VpIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787313347),
('FpYWaHfoXviiWjKPPrRa4LUWTXw0HWBXVc9fthaA', NULL, '140.213.57.151', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJ6bXVYZk5SYlIwQlVKR2dlbDdHb0R2V3ZQd3NzYkRhMTRzMVg3ZUdtIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787303245),
('g54i0xVuGv8lrYdXNsPJywWWBlCxRcXzu20e7inw', NULL, '103.186.60.106', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiIxTEtUV3hLNWtZUm01N3BpMjdlN3hVVEw2Vlk2WUtrVjB4YkNHd2QxIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787300624),
('g5TtHSm9IOiG7HJw8UIarZg06FXntcXyjZNkIX2a', NULL, '103.150.32.159', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5.2 Mobile/15E148 Safari/604.1', 'eyJfdG9rZW4iOiJOcm55aHJ6NGc5MXM0Sk9iNFNCaEYyNUtObzY0UXc2SDFJaXEyd0tQIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787314582),
('GoUd9fI1vOnnY3pMYXtB5GVzobHGZPbzMGP9nlo9', NULL, '114.10.154.165', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJBWkZ3SThiMFI5NGhXSG85QmN0bkV0b2tjcjI1MzJCVzhBZUZjUjJCIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787316789),
('GWoELvHflUdy4ktyLrui6IKq63TRyPJ1AB0e5I7O', NULL, '202.58.74.141', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJFbnNCak1LZ2JLeVpXbnRDeHBqeUVnVk5TTnNIc01JUFNLQ0p5OGFyIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787317856),
('gYPgU1r7eZLLKRnSPinPWfTLUxWqU3M55XzslXx3', NULL, '125.166.1.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiIzYlF0eE90S1Q2R3hqeE9lSWRrb21HTDBoRFI3MGJBeVdNdjFaMjFyIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787310813),
('H9e2QgsNtY6ZBGWe9pbpoJOFx0DUoeVchQoIu6rE', NULL, '114.10.154.154', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJ5V3N5RnFrc2tsT3lEWVQ0WmFyVXhWdEhtemloYjR2NjhRSGZTWmhBIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787299435),
('hcALI83eJYVfgIJHXqwa02HSbqXvI3WzcrApe7TU', NULL, '114.8.227.160', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJ5TWt4eHljYkw1RUVyaG5ycDZrOFVhbTdwTXlwREVUZWZoQ2dqeVVRIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787306146),
('HDNiv6q54tf0k0l30fOp6fhma3c4QrTcopPhF8cN', NULL, '103.177.11.109', 'Mozilla/5.0 (Linux; Android 12; vivo 1938; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0.6778.200 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJQRlg3UTJxYUJiOVhodGJtVHZkb2VoN2kyTXR4Y0RacmdKZGRhdXl3IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787311957),
('hOCsWuYXThdsxsgR3B5saBRBYt2JVXlgXiQqOIzE', NULL, '103.141.108.101', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJnY0VyQ0s5aEF0dHIyT25zYVM1M2F5YkZKSFdwZ0ExaW5LV2dkYzNYIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787316985),
('i1TfR78RDc6Upwu6l2zNcIVvktLgUVs79p0akDXR', NULL, '114.10.155.181', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJUOWZLdFBncEFEZ2pVYVltSTZSeU00RGtxa0RYWldFVFBzTFgwdUYxIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787300678),
('IaA0GmGogNWKPabZNiNVVczVDwHLVDp32AOqfN6y', NULL, '202.58.74.197', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1', 'eyJfdG9rZW4iOiI0YzR4QUx0Sm1uY1llUlVtSXlRYWRCRzdFR1B2OGZseGJSbUNmRzVkIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvZGFzaGJvYXJkXC9rYW50aW5cLzQiLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787309161),
('iBNE1bQP2ubsHlaSpZCqBUlpKmQrUxOwXktdsTU2', NULL, '39.194.0.117', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/143.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJ2WGQ1SGVRZU51MVpsZnpJNkxSQTFnSHo3MUpWbHNXQW94dEQ2cldmIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787313864),
('ibSPzR6ctqzrQWlSXQx7AFFkNjqnF7z6jBND0imh', NULL, '114.10.154.38', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiI5S2hHR1pESkNxNTVSTHNiNFVPakRET2NaNmxlTDVYU1VORU12a09EIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787300271),
('ipPn1uwxWFTZTESy3Jh2vFAi1JCB3YkRWPn9LOcZ', NULL, '103.130.80.123', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJ5bFR6cU5Jd2xTblVhMHhEbERCSzkzQWVOdXJNWkFtMjlvZ3lsbVZ1IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787315567),
('iTNjOs46ctmUHzkNFMlJ22ql4m2twrKvEof1DSOn', NULL, '114.10.154.163', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1', 'eyJfdG9rZW4iOiJRdk93dU5HN2VqVnRUMjlkTGI4OFh2a1FiSWVFMElaa1FBMnNiZmJTIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787303573),
('iw96VBCfuAezNige2op0JMbOR6x5KQnrAPSsBpiM', NULL, '156.230.191.197', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiI4STFnSG1FcWE2SExuWVZCV1VocWkwdkpFNGNkcmkwdHpzYjZ2cnJkIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvZGFzaGJvYXJkXC9rYW50aW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787316939),
('iZ6P2TvBy8yek9jPMUu3BPQm6BBTq9rRZVWUJ9dP', NULL, '114.10.155.137', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36 OPR/100.0.0.0', 'eyJfdG9rZW4iOiI3ZFVsalc5TmRhdzBqcUZKd0ZaRnVmZEg0eWpTVTI3QXFodVFOcEVNIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787301302),
('jA4nXzBLF0qY5JDqkjsL9Ww0Uj3RlOmIoXqQworz', NULL, '202.58.74.141', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJwRVNUOVRtanJxQTFLelFOYmhUM3R3bzFVeklkUTdzN3JETVJnQ3p1IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787308887),
('jhLHPrC3lrUpSyXx2PXbt5gqFVQy2gKWf2PUE1mM', NULL, '125.166.9.225', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJzUjl6bmhqWjFqNEhGbHF5M0RTeWRHZDhVQ2Y1OE5XR3hMV2c4cEx6IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787300960),
('jV1dBYICL9k9o2OA7H4zjpyXrTwU9i99VNtFD4Vf', NULL, '157.15.67.140', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/143.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJuWDhuSlRoRXhiMHhhMklBWG5rYlZkVUc2enhaQkFjcTdJeHkxYjE5IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787313209),
('k9Q44PLyD9L2ScPWL1OVNbugcMAsbUyCYyfyMgEp', NULL, '192.178.8.128', 'GoogleAssociationService', 'eyJfdG9rZW4iOiJHRnpqS3A0TkVxVksyVmF5djJFYm5IUWVYSEFvSGUyWFNBQ2VBUDBmIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvLndlbGwta25vd25cL2Fzc2V0bGlua3MuanNvbiIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787299911),
('KaHvy6W5IgUt7bIrwpBB7XOqXCBFewXNHolxwMdw', NULL, '103.124.139.155', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiIyWFBuQW9TbVhDd214RWptOVVkck05TDJYSzg1NkxMOHBHN1NzcEpTIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787319995),
('kNGFRPvrVpYHwjo4NLPrzFhM9BCRQAZLmaNh307u', NULL, '103.177.11.105', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJKSllQR2FCRVI2eVBYc0JMN2ZxSnM5VFNaMmVqUjhORjc2Y2JaUkNhIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787310499),
('kYItT6pyNcqDzPSXHd0Xn7xL2Xv6HCuvwlsK4atq', NULL, '114.10.155.170', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJSTW5HVEpVY0xqOFM1MmdKa3pFNW5mek5EYzRZTmh6a0lDYWRvMTFVIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787303109),
('l7r2OQPQKvzLJuTsJjET0FJdbNhVbZmCBthYGOtj', NULL, '114.8.227.160', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJEY0U0YVUyOEE4WGhrMVJSUDYwY1BZcm02UU4xdGQzVWcyVWh0OWxVIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787306213),
('l8Rehr4hLwWiPg5V3EREBu9Fl8hJg1b71evULfnq', NULL, '103.158.250.34', 'WhatsApp/2.23.20.0', 'eyJfdG9rZW4iOiJDb2Rxajg4S0tieWZnS0J0b0pzbVhEVEQ2S2JNQ0NzN29kVVZ2aFoxIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787308176),
('lAHPD9waJ970nEzGAP2CIjwtvwj6K4z9Mc4E8lij', NULL, '157.15.63.85', 'Mozilla/5.0 (Linux; U; Android 11; in-id; CPH1937 Build/RKQ1.200903.002) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.5970.168 Mobile Safari/537.36 HeyTapBrowser/45.14.6.1', 'eyJfdG9rZW4iOiJxV0FwVjY2SEZQQk8zb3NnMGQ5RlBzYXFhZXV3dE93NmEyWVpWTDkzIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787319624),
('LefELi0HhgOJgPp128KqZrUDzM74DOIBY2XzzYIS', NULL, '103.76.151.61', 'Mozilla/5.0 (Linux; Android 10; M2006C3MG) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/123.0.6312.118 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJuMVpaWTJWeDE2Y2Z6VWpaczBhWDdvblhUN0NPQ0U2UjJCZGdibnNoIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787309368),
('lHBo7fFw2l2iNAAjqJta4Td80EjH1saRinyECiek', NULL, '36.73.208.179', 'WhatsApp/2.23.20.0', 'eyJfdG9rZW4iOiIzYk5LZzhyaXBJaDhLMUZ4RzNIa1hBanJxMVlFbm54ZEFPZE9lMnJ4IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787302843),
('LuQ7DcYhG71WQsXcTRmBXf297NoeESA12AanM0Oy', NULL, '36.73.208.179', 'Mozilla/5.0 (Linux; Android 16; 24117RN76O) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/123.0.6312.118 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJEcGYxT3FxbGNXOHRueXhyQlVrb2N2Sm41blBNTWQwMDBtdGhhc3U0IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787300230),
('LyLaikISptAMd7k5YkryJPCalTp8m8RRFIqUbl30', NULL, '36.85.77.74', 'Mozilla/5.0 (Linux; Android 8.1.0; vivo 1802 Build/O11019; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0.6778.200 Mobile Safari/537.36', 'eyJfdG9rZW4iOiIyUHRIeVVtc1dmeVcxUmh0TFB3ckFtN215VkowUmpCWDJUczdqSVZQIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787308816),
('mePo81LPUoZJWhIbbhXuivzSB1QjNNE1vgi6xlip', NULL, '202.58.78.69', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJjRmVRY29IazhLRGJ6WDNTdHlxUGVIZVZnNVk3akVGdjdsQ1c5b1J0IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787314672),
('mjQZYK5qwIyBv78FiyvrNeTM2uSRxZ7Ep2FRZ3HK', NULL, '182.6.78.58', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiI1QWVFYTE3RklJUWpyTVhraEVCb3YzV1ZKYkpDYTZtdURkcG9odHdCIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787301891),
('MK3W5lqvDCmnZWJcuTjw4g6lBL50auHue5GQoBk4', NULL, '163.227.183.14', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJKUlh5UUZGN0I1S2JFU3FkNEdaaG44aXRCdnZ5S0dKclI1ZWc3TUhHIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787299241),
('mnbAqDkQrccCgYxjzG7Yr12Xa4wrWm7Z4QEbkNDm', NULL, '182.5.241.155', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJJMG1EZkN5SDRBMXFnUzlvdzBaeEZ6M0FZRnBzdlZySDFXNVl1aVNMIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787315481),
('N4WIJ9D4Vy1IBwDg91IL29P7e9JgB46uxLgdYi9S', NULL, '182.5.240.84', 'Mozilla/5.0 (Linux; Android 12; V2120; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.141 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJCazNOcktjajYzTDJmN2xzZ01ZcDJ6WnZCT3ZVSndXMWtTVnJiV3ppIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787316336),
('nmt52jO7VJCgLYFinZ53wPsA17PDPYkge6RViqvX', NULL, '140.213.187.34', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJzclFvc0ZtVWpjNDUxQUlFS2tubXlHbG1ZWFNPVGp5N25ucWJKa3BxIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787303347),
('O3stqVZQJpGnlwpupOfAn6eZXRPDqN3OJVmxfYgA', NULL, '114.10.155.158', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJVVVlUTWpGUXEyNnN6MmhadW5jN2Y5MFpxVUpGM0h6Q3VzOUg0cHBZIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787301393),
('odvu99IYQpxnII54VGjdzOXdh7WjDTzolkuPS2sX', NULL, '103.132.53.166', 'Mozilla/5.0 (Linux; U; Android 11; in-id; CPH2269 Build/RP1A.200720.011) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.5970.168 Mobile Safari/537.36 HeyTapBrowser/45.14.6.1', 'eyJfdG9rZW4iOiJweDF4QWVLQ1lodXhjUVE3Y2xiMXNmNm5halpyWXJBczBlb0FKTmZUIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787316103),
('Oh46IA7woGYKtXSGvqzISKSfd8oOzuUA7mzzmxAi', NULL, '192.178.8.137', 'GoogleAssociationService', 'eyJfdG9rZW4iOiJubmozYWdJNDV5cEhsNVE5RGgyTWRYckxVSW0zMkFlR0dLZUg3azMxIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvLndlbGwta25vd25cL2Fzc2V0bGlua3MuanNvbiIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787299911),
('ohxhRhwFuI5ueu7j5VgnUK6Mvi8Xv6Zia6F553Iw', NULL, '114.10.154.189', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJKQXVpVTFTeFVEYXZOenVtZFUyd2RmazFFN1dkbEdVVFdZQXRxRlNDIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787308741),
('OXmMTQUnpXRvTWURxF2Mo54OfhyP0W6gE7aszp7k', NULL, '117.18.17.39', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiI1UHY5TXRMUklIZjQ4VTRDb29mQUtXd21yQnZxVDVoTHNTYkY0bGdvIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787303123),
('OzUXZqO9xCQp3ifZVpCQaMy5ntl1E0ehWSX6OK7z', NULL, '114.10.154.212', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJSSHdHVFFialptZGZGczNrN0VreTg0ZENGWXBkU1VkVHNDUWdDcERlIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787299042),
('P0MiTHpOxxr7JI67Hys9RSa6dsc0X0DWOUHttEd5', NULL, '114.5.223.125', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJkNGhkWVBiQnplTVdPZHFNUDJXTzRSVUl5MVllUTFpN293QVhRTW9tIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787300885),
('PARcPwbWd4DHywF8eMH3og852Uvt8S7RAuvjFpLU', NULL, '114.10.154.191', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/143.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiI2ejMyUlVhOTB3Y1Q5ZVk1RVlxQ2t0ZE50S2FmU2JTNktUUkVsdzlmIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787303306),
('PedU1C6dJzXVKoeQmJaQzcMRhf3tKEZuTA9zWwdN', NULL, '114.10.155.128', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJWREZONWpMOGUyNGx4dVlpNDdJdURucEFYeDFaVGFKT2FvelI0Rm94IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787301079),
('PHPlkxsztxbT8yjwcP5Lax8VOA5sEc5SclKpa7ma', NULL, '114.10.155.210', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/24.0 Chrome/117.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJWQzh1OWRCMGlqcmN5b3p3WUNHOWtVVmFPZ3RoZ0c2dXhWa1ZWajFNIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787305880),
('pTJetZMSVo7HukwuabHvQg8whFz2qB2tViiOkGqT', NULL, '114.8.218.98', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJTOG5oSGR0M0lzN0hWMUJEYkJPQTNSWGNYUTB6eTEwQXBiT3c2Y0IwIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787301867),
('QEg3TTf39ohqqBYTdivOLFEcU0Tg65ELzP8JFx8F', NULL, '140.213.59.37', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJSNWtQWEQwVHJaejR1RkhoUzgxa1luYUtjN2FOTkl5d0VLaEZEdjcxIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvZGFzaGJvYXJkXC9rYW50aW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787313188),
('qjuIlbwPyxlgD3pQ9CtT1uO6yFASYUlAXtqQm43O', NULL, '114.10.154.143', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiIyeVpOZGEyOWdmYXBaNHdXdkE1bUgwbjgzcjZpNTBCemtKaU1DNWYyIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787302163),
('RbyZXNZt4iNpG2xkRfXdPghXPKpVzpyuuMVuNtJa', NULL, '210.79.142.137', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Mobile/15E148 Safari/604.1', 'eyJfdG9rZW4iOiJrYml3RFROeUNPaHpRaHA4TFBTRk1NS2ppM0JhZUc2QjdNazBqcVFoIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787320094),
('rHzkxVbj7qzjK2hKuR37YlngvyVPxyNufwN7e4bl', NULL, '103.153.149.246', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJvVHg5eUJsdlR4YXZLWm5IWGlWVjI1WmVBWnpjQmh3bk82d3hSUm0wIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787313040),
('SjReR1oQq817TPJsPdncfYWonhkeUjoJ2g9uGEYP', NULL, '114.5.242.207', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJ1U3ZGU1A1dEp5YW9paWZMUkpKdEJ3Q2dLaFc2VTBjWE5IcXRUU0xLIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787298855),
('TACdpZ4uLBIOnK0zuxQSb3Ti5uWmPn5mF2SdH1ts', NULL, '192.178.8.128', 'GoogleAssociationService', 'eyJfdG9rZW4iOiJkY0t5TTVoejRXZ01YSlE2WWRJMlZQbnpEZmlyaDZTNExZbXZ3NVREIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvLndlbGwta25vd25cL2Fzc2V0bGlua3MuanNvbiIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787299907),
('tHYFfXL2ldP3Bv4NP2VYhAivoq5TIOaJfIykJj2t', NULL, '182.6.66.189', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiI2d3JycXlaSjNVdzduTm9FVUJ0QmU0VU5TTTZWQ0lHV0NPOE80am44IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787313267),
('U2z6Ao7wy4yxWUwIjhozWY0fPwr6BDpWbEwsQYkQ', NULL, '103.177.11.105', 'Mozilla/5.0 (Linux; Android 12; V2111; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0.6778.200 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJENmJ0NmtCNkd2cTBaWnFIazBvYWpUN1VVQmt5NUtDcDdwOEI5WHFhIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787316261),
('V0e8xtHOGIzEtWFcLrZU6562E8IMaxmvWg2pbKBK', NULL, '103.144.146.2', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJCemRWclZhdVl3M0dzT2RiNkpMRE53RVlCTWxBZUw3ZzNvNnlxTGdDIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787299288),
('VALHnCU96yRmW5bNHx2AVZ0jnDtteYHlOmtdiDW4', NULL, '210.79.142.149', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJuOHdhRmxUWmh0RGlGZGx3cWoxazhlYmdSTE9YMXhPZkVEOURLQnRIIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787309848),
('vp16VJRm1GdClTcF2YDnbx3FTVoyTilMflCl8upX', NULL, '36.85.52.144', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiI1dEEydXZVUlBicTBDaVQ5aEdsYjZ6OEYxbks4RW1sWlBtbGV6bWFjIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787300566),
('w8NKENYIfixRxWKOywM2vdUKtGgsvfNSj3x3qPiF', NULL, '182.3.100.233', 'Mozilla/5.0 (Linux; U; Android 12; in-id; CPH2387 Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.5970.168 Mobile Safari/537.36 HeyTapBrowser/45.14.6.1', 'eyJfdG9rZW4iOiJJdVNHdUFWQllzTE5NOWN2enhHMzJVNlczMkcwdG5OUXZ1T3JsVmlPIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787313148),
('WOFXoQx2oenFa5m7Yz2DNdP8hDIpF1PLt6f2PygD', NULL, '182.6.91.34', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiI2NkNxWktxcWJSaFp0b3lvSmpUSUd2b0EyUFVQOTVhQjFkbXF4VEVZIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787304435),
('XbXnHAECxkKUa3PUyZUUiH44ioAIM6IQ0tWFLPeB', NULL, '182.6.82.172', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/143.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJjNlBwSFdhelFZSnRSTTlMVkJsNUYwSldsR1A1QWdtdmFHVXAxeDNrIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787314774),
('xGRlG8Et5DP62zUHGEBxg4RG4REincS1yIyqzuyj', NULL, '157.15.67.106', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJBZGRYMFpsWUFVUHFlMGdKQTVtSXJZcmtJODJMSEpPMmtWMEpvNW9zIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787314627),
('xgs03V0WxsSOnLycE133P9bnRtsHsMoieei4aAPm', NULL, '192.178.8.128', 'GoogleAssociationService', 'eyJfdG9rZW4iOiJyQ1BXS2dNOXNuaXJmZUJtTDFCWVlQUW1UVXl6cG5HOG8wV2V2a3lyIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvLndlbGwta25vd25cL2Fzc2V0bGlua3MuanNvbiIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787299907),
('XQts95iU6J3IQzy5KUqAkqgyDP46hOlCBFtYuuF9', NULL, '103.169.135.27', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJ2Z2g4d1ZyNEJZWE5jZFBmZnhRaWJvMWFyWGFzaWpvME02VTRlSUhlIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787319709),
('Xu2MEPS2f9ZfSJJySB8OAmiDBihNDa8KD6krZlHk', NULL, '114.10.154.191', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/143.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJFMkFHeThXNnFKZGc5UmhCZXBnTWozZ2dtUzRmV0QxWWNaR1o5ZWxxIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvZGFzaGJvYXJkIiwicm91dGUiOiJnZW5lcmF0ZWQ6OjZpNjB6MGxGek40V2Roc3QifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1787303491),
('XWseH2mlw3kdPQlnQLKAoavEga7hxApezHhg49Yi', NULL, '103.190.78.11', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiIxQ0pIRmkzOEd4WUZ0Z2w3SlBZQldXaDhha0NvM21FZ0JUaFUyTkg5IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787314237),
('y8EX9n7jQIlxmKjmf0NN2IGqK1Voxe2dlv2exziD', NULL, '36.79.240.191', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJUenBYaWtQV1dQRUtIR0V6aDViNkRJazZyVTlGWG1VVTZ0SlRSeWd2IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvcmVnaXN0ZXIiLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787314300),
('Y8FjM17oLsEOaDOn4EcY8aCBAiZsbJO92P5XyOmV', NULL, '103.177.11.101', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJIYUJienJ5RXE2eHdRaXJoVE43Q2xKRVBoU284a095MUtySkpKUU12IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787307119),
('YojDB4aHbkUuhK2LUNH8xrt5Vi2lTwlJHp3StlbD', NULL, '103.31.118.99', 'Mozilla/5.0 (Linux; Android 11; Infinix X657B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.98 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJBS2I5RzNReW5jZndmMTdnR24yTFNhZ3lwUTkyRm1RRWpsR1A2ZEpPIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787307601);
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('YvopXbScWradcmg0hcRi65FZp8B6o4vMYNHfq9mR', NULL, '114.8.231.118', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/26.0 Chrome/122.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJydVhXclpSbDE1b1NOQVAxRWFoQ2M2WGx1MGtZWHpJR0t3b3k3VkhKIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787303663),
('z0WPFeU2XAQ5ij7znJ1lKoAmtEDpbX1mZEv2PSqS', NULL, '202.154.45.199', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJocElPT1gwejhyM0MzM1FFVVFaNjhVWnZmRWxua2UxcE1kTDl2MGRxIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvZGFzaGJvYXJkIiwicm91dGUiOiJnZW5lcmF0ZWQ6OjZpNjB6MGxGek40V2Roc3QifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1787299675),
('z4DTUZdUVQr5dIyXTYUO44EDYwCkkPPCnjU4juJh', NULL, '114.10.154.191', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/143.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJoVGZFeXd3ZXlVZFdDUmRtNFlhVGxWeThySTI5bWpGSjJFQVZobkdFIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvZGFzaGJvYXJkIiwicm91dGUiOiJnZW5lcmF0ZWQ6OjZpNjB6MGxGek40V2Roc3QifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1787303482),
('ZbAQo9J6hitxwymrc2h8ofCdA0uSze1yexGI09TJ', NULL, '182.6.89.62', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJ0RXV4dmUwRG9hdDVKU3NHRFVscEhvcTRVYVdpYXZ6YTAxVGI4VXowIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787300539),
('ZlMAW7b6EPdgnoQ1ny5RD4FUTDo0Gh37spDopiKd', NULL, '103.186.61.10', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiIxYVNoYkJGUkhpaGdZVTU3OXlEcjM4cXNQaWFNcGFCc2FCRVNudnJrIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvaW5kZXguaHRtbCIsInJvdXRlIjoiZ2VuZXJhdGVkOjo2aTYwejBsRnpONFdkaHN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787307515),
('zvJNNjYCt5JP7Kji725LUaLqYBW22oYUir53jImm', NULL, '182.6.71.243', 'Mozilla/5.0 (Linux; Android 16; en; Infinix X6858 Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.7871.181 HiBrowser/v3.00.05.02;lang=id;nation=ID;locale=id_ID UWS/ Mobile Safari/537.36', 'eyJfdG9rZW4iOiI2VzYxb29pQ3RvNHV3ZXI1VTh2VzNQQ05sWmp5eTNSRzVjdWpCbFZoIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHBzOlwvXC9oaWdvLmxwaWFsaGlkYXlhaC5vci5pZFwvbG9naW4iLCJyb3V0ZSI6ImdlbmVyYXRlZDo6Nmk2MHowbEZ6TjRXZGhzdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787303149);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `google_id` varchar(255) DEFAULT NULL,
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

INSERT INTO `users` (`id`, `name`, `email`, `google_id`, `phone`, `is_working`, `avatar`, `email_verified_at`, `password`, `santri_name`, `santri_room`, `santri_class`, `santri_level`, `remember_token`, `created_at`, `updated_at`, `balance`, `penalty_points`) VALUES
(2, 'Administrator', 'admin@higopondok.com', NULL, NULL, 0, NULL, NULL, '$2y$12$R2W8y3RpF4LPFRgdzifSt.Mkh8W.9.KoHyEQxJ2HH1oXlKC./KJrS', NULL, NULL, NULL, NULL, NULL, '2026-06-28 10:04:24', '2026-06-28 10:04:24', 0.00, 0),
(10, 'Kantin', 'kantin@email.com', NULL, NULL, 0, NULL, NULL, '$2y$12$N7HKYYPwII0sxAwYu5pBWuspT7FnJBDoCCM1z6Fj8alQfbEpM7cNy', NULL, NULL, NULL, NULL, NULL, '2026-08-09 10:42:41', '2026-08-09 10:42:41', 0.00, 0),
(11, 'Wali', 'wali@email.com', NULL, '628787878787', 0, NULL, NULL, '$2y$12$AjR7txe9zxp6cDjdAtcVh.Rrxe1IBQ91Ymqp7j0tz7S8aqnLsjnQO', 'ZIDAN ABDILLAH KAFABIHI', 'Al Majid 1', '10 / X', 'MA', NULL, '2026-08-09 10:42:58', '2026-08-09 15:45:33', 0.00, 0),
(12, 'Kurir', 'kurir@email.com', NULL, NULL, 1, NULL, NULL, '$2y$12$53zKqrcWIivPg71gxMJB0eqDs4sHzrJbE.M3xJuKv0LPlnZIbK4y2', NULL, NULL, NULL, NULL, NULL, '2026-08-09 10:43:20', '2026-08-10 12:12:43', 0.00, 0),
(13, 'Anma muniri', 'anmamuniri@gmail.com', NULL, NULL, 0, NULL, NULL, '$2y$12$gdjjOkpzRQ3X7GxW3w7jWuKhAXHAaQkcgg97s09Jhcl0mETHAz0XG', NULL, NULL, NULL, NULL, NULL, '2026-08-10 10:59:40', '2026-08-10 10:59:40', 0.00, 0),
(14, 'Latifah Zumaila Iva', 'latifahzumaila@gmail.com', NULL, NULL, 0, NULL, NULL, '$2y$12$4ItvW9EDow90QyLQhA1gheocIQi8jwmmD05unCHDfQMyMMpMr2sfW', 'MUHAMAD AKMAL FUADI', 'Al Majid 1', '10 / X', 'MA', NULL, '2026-08-10 12:07:32', '2026-08-10 12:15:04', 0.00, 0),
(15, 'Asrul Maaliy', 'info@staialmannan.ac.id', '111363695380035432619', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocJfufm1ZXhi_Ks_09eNl-jQ_WVZgpSIvGpOL6Ve123tIwVHPQ=s96-c', NULL, '$2y$12$U6kUftOslASuIkcmoHeDneD7Yqzb7SonCrIBecI44qZ50xIhbn7RO', NULL, NULL, NULL, NULL, NULL, '2026-08-17 19:51:16', '2026-08-17 19:51:16', 0.00, 0),
(16, 'Nur Akhsin Alifian Hadi', 'nurakhsin350@gmail.com', NULL, '62812345678999', 0, NULL, NULL, '$2y$12$P3rSax74CFXU34XDcIpi4.u5BOVA9org9nuWkN.qggvaomxuWlaTG', 'MUHAMMAD ABDUL LATIB', 'Al Majid 3', '10 / X', 'MA', NULL, '2026-08-17 20:16:08', '2026-08-18 16:17:34', 0.00, 0),
(19, 'Ma Alhidayah', 'maalhidayah2020@gmail.com', '109617565117192766567', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLeTMJifzgRvj6WVvKBs9IgFsPzCtwY9_rAedbhkbeGSyVOwA=s96-c', NULL, '$2y$12$FuBA6/.2gnH.RigF7SuSTe6FS27tBoTCwdlEfMwzKw9PhHPybOx7q', NULL, NULL, NULL, NULL, NULL, '2026-08-19 20:54:50', '2026-08-19 20:54:50', 0.00, 0),
(20, 'Gilang permatasari', 'gilang.permatas4ri@gmail.com', NULL, NULL, 0, NULL, NULL, '$2y$12$w2aVg6z4GJ1g4o1tGgKCmesz6Sk1WioMj1vsSdPT/HtknPnGiMKcm', NULL, NULL, NULL, NULL, NULL, '2026-08-19 21:06:47', '2026-08-19 21:06:47', 0.00, 0),
(21, 'Elshanum Elsa', 'siti.ulipah24@gmail.com', '109027929602932569142', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKWCiaRrnW4qQiV57pBwYBP6XXJe5FOMFH8rp97sskoF8HS7mA=s96-c', NULL, '$2y$12$mCCnuhW71kBKyATyK4fJ8uwZvkV6OAOYFbKaJLjTC.okekfLgzL.6', NULL, NULL, NULL, NULL, NULL, '2026-08-19 21:12:50', '2026-08-19 21:12:50', 0.00, 0),
(22, 'dwi Setiawan', 'dwisetiawanprayoga9930@gmail.com', '101213178430838600411', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocINdbF-rT_aCirjbaVYvVUQM_habOjT001m0Dc4jdDYOExxgA=s96-c', NULL, '$2y$12$g6WUUV/jCPZik.0OjTNJtORK39IOk6O2syCWjCIXepSR5YT5vGL9m', NULL, NULL, NULL, NULL, NULL, '2026-08-19 21:14:22', '2026-08-19 21:14:22', 0.00, 0),
(23, 'Junaina Shafwana Al Ihsan', 'naina.ihsan@gmail.com', NULL, '6285815150353', 0, NULL, NULL, '$2y$12$vq2RRv0Khv99DdJHVoJfc.ghAUhjSK5.ICkIFF7zj0k0k02godJpG', 'JUNAINA SHAFWANA AL IHSAN', 'Asmah', '7 / VII', 'SMP', NULL, '2026-08-19 21:19:16', '2026-08-19 21:21:16', 0.00, 0),
(24, 'Muhammad Baidowi', 'bypetanidowi@gmail.com', NULL, '6285856941836', 0, NULL, NULL, '$2y$12$uAEAgBw6rfJ12pcVVdvNLO7ufciu7miLKv5XRI6oHNgZ3UyLlPoBC', 'AISYAH AYUDIA INARA', 'Asmah', '7 / VII', 'SMP', NULL, '2026-08-19 21:19:52', '2026-08-19 21:24:21', 0.00, 0),
(25, 'Adilla Riandhani', 'adillariandhani@gmail.com', '103473924932529385304', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocL6urpYKwEfUO3PCj1CxWmr2yaHHX3JyX1DCMOQE3JZkuCD5Q=s96-c', NULL, '$2y$12$xJDsOX5QrSq/QBAp.gDcje1Lz7hItAkx89HtnYEPBExr94ihnGlCe', NULL, NULL, NULL, NULL, NULL, '2026-08-19 21:27:04', '2026-08-19 21:27:04', 0.00, 0),
(26, 'Maulidia Afiana', 'maulidiaafiana@gmail.com', NULL, NULL, 0, NULL, NULL, '$2y$12$Huv2C3Rg8KuJ.iJ0nbSLeOLoDHeoCRLCheTmEURR9FTy5fIoKS1wu', NULL, NULL, NULL, NULL, NULL, '2026-08-19 21:33:14', '2026-08-19 21:33:14', 0.00, 0),
(27, 'Insaniya Khusna04', 'insaniyakhusna@gmail.com', '107242151758929666582', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocK0IQ8A0T293mYJvRT9hlQDIVQ2wcDh8WYY5u_UtMsQMiCLgg=s96-c', NULL, '$2y$12$eeIPDEU3rCuusxJcfkkCkertnsJmirPdxbAktPxXTQzrjezAJThWC', NULL, NULL, NULL, NULL, NULL, '2026-08-19 21:35:32', '2026-08-19 21:35:32', 0.00, 0),
(28, 'Zananaurulfajri', 'zananaurulfajri@gmail.com', NULL, '62895401139290', 0, NULL, NULL, '$2y$12$0Fc76y.liI.K9y5ANClLy.KOA0WvrgICJUDLp1HXkumqap1IdVsxW', 'BASIMA AISYA SAKHI', 'Asmah G1', '7 / VII', 'SMP', NULL, '2026-08-19 21:36:38', '2026-08-20 07:25:15', 0.00, 0),
(29, 'Sulis Tiyo', 'stiyo2104@gmail.com', '104230955660110962588', '6281347456313', 0, 'https://lh3.googleusercontent.com/a/ACg8ocJuP99A9Mw1DdbgdwjjpdRp21q_xRMVO5kw2v1UPCBj7XGuJf8=s96-c', NULL, '$2y$12$V8Q/yKLXjCVJ4Z2dlLAIX.OiTkZNHeMAhMjF0teuhqZeIq//6JQRe', 'IZZATUN NISA MITSLA YAQUTILLAH', 'Asmah', '7 / VII', 'SMP', NULL, '2026-08-19 21:37:43', '2026-08-19 21:41:17', 0.00, 0),
(30, 'nurin latif azizah', 'nurinlatifazizah@gmail.com', '117597715918598220507', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLA5hv3-2qcIfJHz11WjhRu7gaf3lMF_YwE9n9v5QBWGsfdK6ep=s96-c', NULL, '$2y$12$gxlAtVLGNUkLg0oFxE7h8uJKFWX0RgJZI2SMBo71RKGjC0NL5XGau', NULL, NULL, NULL, NULL, NULL, '2026-08-19 21:38:09', '2026-08-19 21:38:09', 0.00, 0),
(31, 'Ratna Ningsih', 'ningsihratna9999@gmail.com', '114079813044352189139', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLrFFzbgXEQbIb0g8PhxJmMCOIGSx3TCMXjCFQlBQ0e_YM6tg=s96-c', NULL, '$2y$12$4XirXrY76//VA78kRVHFSeZsNZX.6kUn0rlLou7Z0l0zrzg8Ymo0.', NULL, NULL, NULL, NULL, NULL, '2026-08-19 21:43:47', '2026-08-19 21:43:47', 0.00, 0),
(32, 'AZIZAH NISA', 'azizahnisa101092@gmail.com', '104146559407841732466', '6285895599310', 0, 'https://lh3.googleusercontent.com/a/ACg8ocIKL8KUIudKehTYw2setpdAvTQgCCbJAfDB0bU7ObtUQGSvLQ=s96-c', NULL, '$2y$12$bkgB4y63LqLQhx38E8NtleB5zvbf2DOnAFmHfVD2quKxWW.5sd/gC', 'AZIZAH KHOIRUN NISA\'', 'Kamar G4', '7 / VII', 'SMP', NULL, '2026-08-19 21:50:07', '2026-08-19 21:52:56', 0.00, 0),
(33, 'Ovi Novia', 'ovinovia863@gmail.com', '118261825310939377371', '6289656315797', 0, 'https://lh3.googleusercontent.com/a/ACg8ocLfh-hYAAAK-tBNOn_LWxMUzOwKPjaiTz7yLFiqUhXKM3CP4g=s96-c', NULL, '$2y$12$T1LliUB0x1cSMN9670vgXeeiqpJIYiLmaAGhkpy.oHy3SprZkQTWS', 'MUH.HAMZAH ZAKARIA', 'MAJID', '9 / IX', 'SMP', NULL, '2026-08-19 21:52:56', '2026-08-20 11:46:37', 0.00, 0),
(34, 'Ani Mufdiatul Ulfa', 'animufdiatululfa@gmail.com', '113509960371071480328', '6285707624139', 0, 'https://lh3.googleusercontent.com/a/ACg8ocK_KSnRWAlYkPlxI2meGshr9JHAanmN0DZbE4JY2dUA9GMQWTop=s96-c', NULL, '$2y$12$CgS.3QxzOsLizrhsjW9jm.VFt4U3NarFRskcl.8.u06Ea.N8yu24q', 'ALMAAHIRA NAYYARA ZAKIYYAH', 'Asmah G1', '7 / VII', 'SMP', NULL, '2026-08-19 21:55:56', '2026-08-19 21:58:54', 0.00, 0),
(35, 'Farzan Abdillah', 'abdillahfarzan168@gmail.com', '101859728520971198516', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLEqSC5eb5lqUaW9FTQGy0NU8Cige5r1yYKIWrGviBD4X5OPg=s96-c', NULL, '$2y$12$Yv1XuxalEqxHynxQw2zjH.EYBU2WZq8eWF2dYSNNgOwCDyJD.5dsW', NULL, NULL, NULL, NULL, NULL, '2026-08-19 22:06:54', '2026-08-19 22:06:54', 0.00, 0),
(36, 'Aprilia Azizah', 'apriliapensi@gmail.com', '100069833542409861767', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocIbtFu8wzjx9Na03X9a4Awo4cGvv4B7LyKRTI86_qO2X3WKF0o=s96-c', NULL, '$2y$12$z4rGcHX5syR.Y9tjnOepbON9wzS5ihR8pzTF9sqP.tpdsIgFxmGmC', NULL, NULL, NULL, NULL, NULL, '2026-08-19 22:08:06', '2026-08-19 22:08:06', 0.00, 0),
(37, 'Safira Khanza', 'safirakhanza06@gmail.com', '107797418776750165387', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocIqYw9goMfC7d20GxETtYtgXsZAnKmZJz0jMSLp7pRCPPHxXA=s96-c', NULL, '$2y$12$XGLFfX6nSg/jGvDsymRdBuMUD4t/uUlDeIlqemxbPQ/BbdLrAtaiO', NULL, NULL, NULL, NULL, NULL, '2026-08-19 22:19:10', '2026-08-19 22:19:10', 0.00, 0),
(38, 'Dunia Ini', 'duniaini641@gmail.com', '100436549784343924415', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLYnrKVwx-l7X4jOqXMQoo5YFiJST4Kz19_4XsY_ag05f66Sg=s96-c', NULL, '$2y$12$80dg6/ndL8faYi0ogPxsRORRJvq/xkUm/CGPKcF00P.8lCjlUqVx.', NULL, NULL, NULL, NULL, NULL, '2026-08-19 22:22:14', '2026-08-19 22:22:14', 0.00, 0),
(39, 'nana kristina', 'nanakristina1979@gmail.com', '104333866569328391815', '6282231318179', 0, 'https://lh3.googleusercontent.com/a/ACg8ocI44s1yUOzXPBgY7BcyLNLzW9pf9qImA9Sdvgb3_j9cmvNQ9Wdg=s96-c', NULL, '$2y$12$hAdtZWY7aoB89gOi75xiJO1nBecJO25qdk9lVlsKyw7RS6DDbQO3q', 'MAIDA FARRAS ZAHRANI', 'Asmah putri/ kamar G16', '11 / XI', 'MA', NULL, '2026-08-19 22:22:29', '2026-08-20 15:40:17', 0.00, 0),
(40, 'Roifa Roifa', 'rroifa5@gmail.com', '108624199888823634163', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKCCg1-rqSIAV5hE9yki_W535XXU147i4WyCdAtu4ERQyxkPw=s96-c', NULL, '$2y$12$2L9h0fTyUayd3Nj5xSN5R..m1DaRoDa5kg/vDN8ye9ec9tHV4Db.W', NULL, NULL, NULL, NULL, NULL, '2026-08-19 22:23:38', '2026-08-19 22:23:38', 0.00, 0),
(41, 'sugeng lelono', 'sugengrifa12@gmail.com', '107636498048291258776', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocILyJ2txk6CH-BAlF2AyZjqlFJOjwjaJsA582UfiPIuZGm0QQ=s96-c', NULL, '$2y$12$OOrDduQvsWvD/PdANEu40ewsEbdmbw1mg7KLCteRBXDpuPtwr5M0u', NULL, NULL, NULL, NULL, NULL, '2026-08-19 22:34:40', '2026-08-19 22:34:40', 0.00, 0),
(42, 'Aliyah', 'alyahurun87@gmail.com', NULL, NULL, 0, NULL, NULL, '$2y$12$XxKHvv7ItmrrDlk4He1oNupHV.S/QF0N4TKCvVS/ereVuO/gFir/S', NULL, NULL, NULL, NULL, NULL, '2026-08-19 22:35:50', '2026-08-19 22:35:50', 0.00, 0),
(43, 'Bekti Rahayu', 'bektirahayu435@gmail.com', '104801423674242431292', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLKyI1czGrntRAtkSf86LEeylTMUueAPM03n49kpfo6PSlq3Q=s96-c', NULL, '$2y$12$.NaQpKp8qISen4sU3iHP0eK6dA03Lx7t0pYs/z7vpUqxERkPiozZG', NULL, NULL, NULL, NULL, NULL, '2026-08-19 22:48:38', '2026-08-19 22:48:38', 0.00, 0),
(44, 'salwa balqies gaming', 'rofiqblitar@gmail.com', '112527405566287729096', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocJd8qpWur4za0GN15L-VYkAjbbYFcAU1Qtfc6mXanu9YrOtjVLO=s96-c', NULL, '$2y$12$cyxZmfHFnJhMHgNv80OXq.1CQGkutRFtaTokXoJdN4dfNE/OTrXmS', NULL, NULL, NULL, NULL, NULL, '2026-08-19 22:54:14', '2026-08-19 22:54:14', 0.00, 0),
(45, 'Risa Fafa', 'risafafa6@gmail.com', '114771691509419493135', '6285762258306', 0, 'https://lh3.googleusercontent.com/a/ACg8ocIw_WjsizVdq7b6zZYhgz8kKgRilJMnPNlfJZhc0mauRH6PbQ=s96-c', NULL, '$2y$12$yeL56C/TU3GJQcAVY.o7XuXaBU5lKT5N0xpTQ3AVyxurGKHkssuFy', 'RISA HILLALUSSA\'ADAH ZAEN', 'Asmah G6', '8 / VIII', 'SMP', NULL, '2026-08-19 23:00:11', '2026-08-19 23:06:22', 0.00, 0),
(46, 'Pondok Asmah', 'pondokasmah@gmail.com', '104928852979164815128', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocJD-1F8UWRutmU2sQ02ixo2vnDXwIXKGMoWc3AeC9ZPic7Zbw=s96-c', NULL, '$2y$12$29bVbD62TKclIZGEg2BhzeW.G4suQInqvh7z7nVKs271p9ZbaPDAy', NULL, NULL, NULL, NULL, NULL, '2026-08-19 23:20:03', '2026-08-19 23:20:03', 0.00, 0),
(47, 'Madin al-hidayah Putri', 'madinalhidayahputri@gmail.com', '104630775109285558964', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocJUXcRkB5iUpvxiiBbZY8KKuOoMn3KpgDg0nadDW91FRJeFpQ=s96-c', NULL, '$2y$12$WLzyxg4ko5CYzToGJXtjPu/BXoSKEl5XHWJ99dbH6DtMQ.cxjaiqK', NULL, NULL, NULL, NULL, NULL, '2026-08-19 23:24:45', '2026-08-19 23:24:45', 0.00, 0),
(48, 'siti aniyah', 'aniyahsiti17@gmail.com', '103246900283622203996', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKt50fG3aQ8hm84CKD7OI32Zhd_eC0wLlMB3CzCp-iEgznq-v8J=s96-c', NULL, '$2y$12$FDsEc4QV94qoGdz4iyILJuCXVU1bgWJkCqzsPSQwTa6zaFLVXv8/m', 'BILQIS NAJWA QORRI\'AINA', 'G12', '8 / VIII', 'SMP', NULL, '2026-08-20 03:39:20', '2026-08-20 19:39:36', 0.00, 0),
(49, 'Mas Rokhah', 'rokhah05@gmail.com', '105210924034845395005', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocJ8wDV21sMP_jQOMBuS6aokMzK8IiwHKg5S2pcSortf_9aYgwI=s96-c', NULL, '$2y$12$g.YSLBnPQDvOD1kYxfeljuMPlqMEWaPpfvlguEsUx7uu7xhzhmKmi', NULL, NULL, NULL, NULL, NULL, '2026-08-20 05:03:19', '2026-08-20 05:03:19', 0.00, 0),
(50, 'Asmaul Husna', 'zainmulki@gmail.com', NULL, '6285855005818', 0, NULL, NULL, '$2y$12$a4RneZQVzsp07EQE230H7.ZJ1s6L42GCgl1F2LavaRIYSG4ZCGt6i', 'LAHIN AHLA ZAIN', 'Asmah', '7 / VII', 'SMP', NULL, '2026-08-20 05:11:58', '2026-08-20 05:16:42', 0.00, 0),
(51, 'Hayati Mustofa', 'hayatimustofa97@gmail.com', '115435583940810516182', '6285706177369', 0, 'https://lh3.googleusercontent.com/a/ACg8ocLDwQ-UXlxMYjqAdE0qVahmWkQ8oyNwS10ftp7SFwMFm1dw8w=s96-c', NULL, '$2y$12$4W9.NTUS/bI0UMkQLDCSW.Qhq4pGEnu7xrKKVRSQVK7rLwjaD2sUq', 'NABILA AINUN NAJWA', 'Asmah  kamar G_1', '7 / VII', 'SMP', NULL, '2026-08-20 05:26:09', '2026-08-21 14:50:12', 0.00, 0),
(52, 'Zelda', 'z17997742@gmail.com', '103232243260473424261', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocIQcj0rbLczggAZX4xpYQ2WEsI6OG8MUf86h2i7Fxve-dOp4w=s96-c', NULL, '$2y$12$nIL7Tz06SU044K8.ZGUgD.ykh6U7ge3GQ7JiK6DMlkwBc/HFNIgL2', NULL, NULL, NULL, NULL, NULL, '2026-08-20 05:41:38', '2026-08-20 05:41:38', 0.00, 0),
(53, 'ANI\'MATUL FARIDA', 'anifarida761@gmail.com', NULL, '6283834229169', 0, NULL, NULL, '$2y$12$pk3axGaz29o9JPR0VpDY7.jq8t9SjyhXvQiA7xSQOiFiMrSA2nRp.', 'FITA PUTRI APRILIA', 'G7', '8 / VIII', 'SMP', NULL, '2026-08-20 06:12:01', '2026-08-20 06:19:58', 0.00, 0),
(54, 'Anis Resheta', 'anisresheta10@gmail.com', '114959661421424579065', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLsrK4m0yo3rlmuxW747rl-rVcNKEzPUb5ptVOPFmbYZoGpX7Q=s96-c', NULL, '$2y$12$KerPvlQO6y9/aGpMF8t3deWnae9pSmGxKiLxV8NAzvTyTaEerh1sW', NULL, NULL, NULL, NULL, NULL, '2026-08-20 06:48:05', '2026-08-20 06:48:05', 0.00, 0),
(55, 'Queensya meyla Meyla', 'queensyameyla@gmail.com', '114463667388060621177', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKmB3TrhEA8V-E2pL7yc1hFkfz3cdmcQupjXrEoK_z0am3OCw=s96-c', NULL, '$2y$12$Q8XtONA5R05XRbV6RWCv/eASfSM3bmCwhmAEm2q7OYY48zgsjW2dy', NULL, NULL, NULL, NULL, NULL, '2026-08-20 07:15:54', '2026-08-20 07:15:54', 0.00, 0),
(56, 'Zulvia Khoirina', 'khoirinazulvia@gmail.com', NULL, NULL, 0, NULL, NULL, '$2y$12$0Rm22dTLz0dmUwLgt7obcu2HiU5mIY92WtYYsA2D5Rb9.r6ExmGPy', NULL, NULL, NULL, NULL, NULL, '2026-08-20 07:24:34', '2026-08-20 07:24:34', 0.00, 0),
(57, 'Lailatul Mubarokah', 'laila020588@gmail.com', '107291588044226656963', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocI-dj1c_m-ri8q4Oh3HtP2FIuwq-W-5ZZyGToPc3f_G71WtRA=s96-c', NULL, '$2y$12$s5mtaykGFz83LWMmPRHpsOiwcSmTG94E0CdOZoj2qGB784OxjrOUG', NULL, NULL, NULL, NULL, NULL, '2026-08-20 07:52:58', '2026-08-20 07:52:58', 0.00, 0),
(58, 'Soleh Efendi', 'effendicelly@gmail.com', '113694656924216628858', '6281217977750', 0, 'https://lh3.googleusercontent.com/a/ACg8ocJUZiRrLPcleuW7ruw4QygA8nzggD9vhu9JB8ZGYeeemeUcvg=s96-c', NULL, '$2y$12$ozk/mXvL.J4fULQLSYqmSuWg/V0jJRMhcSTPpuI8YGgLz4vN91NtK', 'AFRILIA CELLY CLARESTA', 'G12', '8 / VIII', 'SMP', NULL, '2026-08-20 08:05:54', '2026-08-20 08:42:12', 0.00, 0),
(59, 'tiaraa araaa', 'mutiararizqi789@gmail.com', '110182637383738022759', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocIcMMqKBM8nvLpT7q4lwUZtEPwLXLLMT7vFLOTLan-kQyDCyjYa=s96-c', NULL, '$2y$12$kbZcL1isAP2uHFbj5dgKtebajKKqhDUkCyCXq4zhY.Ww/qPRHhm5y', NULL, NULL, NULL, NULL, NULL, '2026-08-20 08:14:25', '2026-08-20 08:14:25', 0.00, 0),
(60, 'khariratul istiqlaliyah', 'khariratulistiqlaliyah@gmail.com', NULL, '6285645831466', 0, NULL, NULL, '$2y$12$PVQKSUkRfQr/fpNqiQlMWuULbmk5admTxpXbPPogLgBbERCXpQdbq', 'MUHAMMAD LABIK AMINULLAH', 'Al Majid 2', '7 / VII', 'SMP', NULL, '2026-08-20 08:18:07', '2026-08-20 08:23:23', 0.00, 0),
(61, 'Heri Redmi 12', 'hta651147@gmail.com', '110384169685556307873', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocJ8ddbOAW6yvNf76Y-wH6DibpCAWR6GBEEAXFmdy0izl5xyHMtZ=s96-c', NULL, '$2y$12$.9HjYXSAQMk2U.CREPV9y..NXF427nbNlgDOLaPmKA6EyIDNL3KMu', NULL, NULL, NULL, NULL, NULL, '2026-08-20 08:18:53', '2026-08-20 08:18:53', 0.00, 0),
(62, 'muhammad fuad Hanif', 'fuadhanif17@gmail.com', '107802383983846766536', '6285655418069', 0, NULL, NULL, '$2y$12$aQ0lZX45dTFt0Jt0SDmYC.7OwXVTVp3QYQjD1mO..ggKBZRpaIysK', NULL, NULL, NULL, NULL, NULL, '2026-08-20 08:31:19', '2026-08-20 08:32:18', 0.00, 0),
(63, 'Nimatus sholihah', 'sholihahnikmah11@gmail.com', '117375918168206344066', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLX_zqrFdI5NzYSgLQteWBUjTC7NvZxWId4j7u9Xo9oBLFjGJo=s96-c', NULL, '$2y$12$H0nfDOgJAZCAHz8ytXDGh.eoP.Tl/8tel4bTBF9I2shhlqkzgYnqS', NULL, NULL, NULL, NULL, NULL, '2026-08-20 08:41:05', '2026-08-20 08:41:05', 0.00, 0),
(64, 'ACHMAD JUNAIDI', 'junales@gmail.com', '108735499034318786057', '6285158500438', 0, 'https://lh3.googleusercontent.com/a/ACg8ocIWOT4X72YJKqr26BPGZVactsEanmvJxuBUCU40VjmdioxITg0=s96-c', NULL, '$2y$12$obiNtL8E7wq5GXCKbhGs7.zUAfBPAzlOf6zEvI02CgI1sRvDoG4Ee', 'ACHMAD SHOBIBUR ROHMAN', 'Al Majid 2', '7 / VII', 'SMP', NULL, '2026-08-20 08:42:16', '2026-08-20 08:43:20', 0.00, 0),
(65, 'Miratul Kasanah', 'miratulkasanah123@gmail.com', '106739151433605862166', '6283899303660', 0, 'https://lh3.googleusercontent.com/a/ACg8ocL1HAS-juOIXNdrHS6fy2EOTeRaRJy-B_up1-V6w9lCj_jWcA=s96-c', NULL, '$2y$12$ayq7jMpDrQdSLRMfsXVljuUd.gbbo6K1NsstXU9SHNRlCo99IeKS.', 'TAHTA ALVINA SINTA ALAWIA', 'Asmah G5', '8 / VIII', 'SMP', NULL, '2026-08-20 08:42:17', '2026-08-20 11:16:44', 0.00, 0),
(66, 'Achmad Junaidi', 'junales01@gmail.com', '113415244735822741299', '6285158500438', 0, 'https://lh3.googleusercontent.com/a/ACg8ocL5WOhO5uSNKtAuujjyiJfOONntDOyvl62zCap7TiNYkPJ-qg=s96-c', NULL, '$2y$12$R.4LwI/Pwh3IBDBI6wrXJ.v.BRqjIptY.fO3C0vXFMGjEX2hzuJsO', 'JAMALUDDIN ACHMAD AL BAQIR', 'MAJID 2', '9 / IX', 'SMP', NULL, '2026-08-20 08:43:46', '2026-08-20 09:33:17', 0.00, 0),
(67, 'Tutus Emy', 'toesmee87@gmail.com', '114137893790524576917', '6281359826786', 0, 'https://lh3.googleusercontent.com/a/ACg8ocK7riJ2yUH9gZ3Dw-tj76YrXHMVqmOfvkhLQA4ROHZYre_CTbCl=s96-c', NULL, '$2y$12$Ku7EYq7qmF2LBk83EnjXeeodWpqaViyYm.3hE4s8ItYRcGpOrzv9m', 'AHMAD SADAD AZ-ZAMZAMI', 'C1', '7 / VII', 'SMP', NULL, '2026-08-20 08:49:38', '2026-08-20 09:01:46', 0.00, 0),
(68, 'Miratus Sholihah', 'miratussholihah85@gmail.com', '111613723531745692834', '6285804853896', 0, 'https://lh3.googleusercontent.com/a/ACg8ocJpZRoKd3gJwxiN8lz9WNe9Lw66kzEgsXj_C91ECZsWLNb3fumc=s96-c', NULL, '$2y$12$1es3rKtuSHd.putlM7e/0.cZrCfKeufGtNhg7Jj1ne6VCRmj9TVQa', 'MUHAMMAD BAHRUL HIKAM', 'C4', '7 / VII', 'SMP', NULL, '2026-08-20 08:53:36', '2026-08-20 08:54:51', 0.00, 0),
(69, 'Yasmin Latifatus', 'yasminlatifatus12@gmail.com', '112932861553413340552', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKFQzjXXNEirIe6Kaq0CCmi7Q4_DhU6eZhTQLf6qgJLX_UH4x4N=s96-c', NULL, '$2y$12$/Ft6S0toxyqKr/T0OjnY2.fnWdxHYOdWKZeb33hSRn9uPU5/VAI26', NULL, NULL, NULL, NULL, NULL, '2026-08-20 08:56:07', '2026-08-20 08:56:07', 0.00, 0),
(70, 'Isah Waidah', 'isahwaidah@gmail.com', '116235515036135715392', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocK89-h0pQjlpxJQTQjkcn_gnCaNkZ1BqUq08dnqvmi6OYhzrA=s96-c', NULL, '$2y$12$7AKIaAOjK1F7HTiX9W5Qd.xirowheK75SLh6a4SOMTYg.jy5Kgo7u', NULL, NULL, NULL, NULL, NULL, '2026-08-20 09:04:28', '2026-08-20 09:04:28', 0.00, 0),
(71, 'Sri rahayu', 'cemblack87@gmail.com', NULL, '628155020209', 0, NULL, NULL, '$2y$12$BAk5TvMfixtD7CiBY/ZV9emIkl7f0fEz0jueA7lSOesi/7QSZWBn6', 'FARRAS HILMIYA AZARINE NARESWARI', 'ASMAH G-12', '9 / IX', 'SMP', NULL, '2026-08-20 09:08:41', '2026-08-20 09:11:41', 0.00, 0),
(72, 'Binti Kholifah', 'bintikholifah734@gmail.com', '105010619951079435053', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocIVSt6MzOXfJZsZ9rwh0jTq-QFIH_sSO0U5HSoPotVo8SdsbQ=s96-c', NULL, '$2y$12$WzAQ1Za/xD5LGA/w9araP.4RZvzr0HCppK2O1ObkeVEnLoJRBfqdS', NULL, NULL, NULL, NULL, NULL, '2026-08-20 09:12:33', '2026-08-20 09:12:33', 0.00, 0),
(73, 'Ika Zahwa', 'ikazahwa08@gmail.com', '111926648099641577142', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLg7rukg6XdUpFRi_XbNSkZ_4wkPeQwKcuUKhTfQchZD7O6vQ=s96-c', NULL, '$2y$12$zUxYGgu/RLrb/5X95cQxm.0WfkbX.22mtefAhGMVKD0rN8alpSGvC', NULL, NULL, NULL, NULL, NULL, '2026-08-20 09:13:49', '2026-08-20 09:13:49', 0.00, 0),
(74, 'yohana wijayanti', 'yohanawijayanti9@gmail.com', '115768389048186285729', '6285791315168', 0, 'https://lh3.googleusercontent.com/a/ACg8ocJrpIv19D-L7O505pqT1M4uC0uL31bg_msh_tbbii5mSvNHIw=s96-c', NULL, '$2y$12$N.iX05BqBVKTRULWAWbn8e.vGnEQwccb9Gcrz/M0iMxmU7wrBmTb2', 'AULIA DZIKRIYATI KURNIA', 'Asmah', '7 / VII', 'SMP', NULL, '2026-08-20 09:13:51', '2026-08-20 09:15:26', 0.00, 0),
(75, 'Naimatul Masruroh', 'naimamasruroh86@gmail.com', NULL, '6285921947636', 0, NULL, NULL, '$2y$12$sJYY7YvK2T0NZaEYBknAruLOikFtD9kH49Q0byIVXbNRAOFzxyCTi', 'NASA HUMAIRA BILQIS', 'Asmah', '7 / VII', 'SMP', NULL, '2026-08-20 09:30:40', '2026-08-20 13:34:52', 0.00, 0),
(76, 'Faizatur robiatil Adawiyah', 'faizahrobiah9@gmail.com', NULL, NULL, 0, NULL, NULL, '$2y$12$VX9j3MnWAxCSiHmSZc2N9uxY9GTBGfxspy9FmXVqY1PbbjzNTFZkS', NULL, NULL, NULL, NULL, NULL, '2026-08-20 09:36:11', '2026-08-20 09:36:11', 0.00, 0),
(77, 'Siti Maulidiyah', 'smaulidiyahdeeva@gmail.com', '108141494569345176689', '6285736360885', 0, 'https://lh3.googleusercontent.com/a/ACg8ocI1wWg2Z2zzDSa8sRNkOSQD0RTBRm0ILs3KLXVKBLjBf0IPsA=s96-c', NULL, '$2y$12$XixU5.cBj/1683/0n2AW4eonv9yq0c7FQ2Fpw7lUNaUqaoVKfhzyu', 'ADEEVA CALZOUM ZANUBI', 'ASMAH', '9 / IX', 'SMP', NULL, '2026-08-20 09:40:23', '2026-08-21 14:17:52', 0.00, 0),
(78, 'ilma ilmariza', 'ilmariza48@gmail.com', '117776642466331898853', '6285765586972', 0, 'https://lh3.googleusercontent.com/a/ACg8ocKfQynZMlpLOKIenEKYMHyBrrzv0FSbJNARn-eqtQYRHv3io6yD=s96-c', NULL, '$2y$12$NjL65S5cUl7rS8wlmtEbBuOlmypnAyUKlkAtlspS8sfAMsQIfCET2', 'LUQIYA SYAMSA MAULIDA', 'Asrama asmah', '8 / VIII', 'SMP', NULL, '2026-08-20 09:43:42', '2026-08-20 09:51:48', 0.00, 0),
(79, 'Sulistiyaningsih', 'sulistiyaningsih86@gmail.com', NULL, NULL, 0, NULL, NULL, '$2y$12$j9TWLPCqFtEV1.ZOvBY3JOOXyjyymWqZbefevYoloo/e8paz7Yy0G', NULL, NULL, NULL, NULL, NULL, '2026-08-20 09:47:05', '2026-08-20 09:47:05', 0.00, 0),
(80, 'Siti Aslikah', 'aslikahsiti81@gmail.com', '114431691110665979674', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKABa5KYLnO_Iy7EArBEmTeobFoDtndezEXQNMLsZJExAepyg=s96-c', NULL, '$2y$12$Yz3CGbSs2JuQQ8L2GVcqfuP0aUAUPBXG.LaXWfuQ.b3Fxfjj0L9rS', NULL, NULL, NULL, NULL, NULL, '2026-08-20 09:49:12', '2026-08-20 09:49:12', 0.00, 0),
(81, 'muhammad andra', 'muhammadandra@gmail.com', NULL, '6281234354454365', 0, NULL, NULL, '$2y$12$CnmNGg.UyyUksOm9ZphcwOsZdftfvSIvwLf7bILT5ff9LKSjGCunO', 'MUDZAKKI AKBAR FEBRIAN', 'Al Majid 1', '10 / X', 'MA', NULL, '2026-08-20 09:54:54', '2026-08-20 09:55:49', 0.00, 0),
(82, 'DWI RATNASARI', 'dwiratnasari21@guru.sd.belajar.id', '110874775592377960408', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocIQhPQv1fWiV27J6TCecs_WBdsb2dMKEl1ru4QKuY4qIVUYrLM=s96-c', NULL, '$2y$12$G8cyduTFKjB8RQBWLtO51OfpddsK76H7U8qXRVSyjU6z0VPlg4oEi', NULL, NULL, NULL, NULL, NULL, '2026-08-20 09:58:11', '2026-08-20 09:58:11', 0.00, 0),
(83, 'Arninda', 'arnindatrisnad@gmail.com', NULL, '6282237584575', 0, NULL, NULL, '$2y$12$wOwNwHntmIINrYB.IR8CL.irhKw3eTBmzAIWp7Y4zYNP0rI4/a0Vi', 'MAULYDIA AYU RAHMAWATI', 'Asmah', '10 / X', 'MA', NULL, '2026-08-20 10:04:50', '2026-08-20 12:54:51', 0.00, 0),
(84, 'Prasetyo Saputro', 'prasetyosaputro1980@gmail.com', '115158743809635787857', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLYHJ3UNAQ-w56_vCZwEXz8TLR99LlUA7pRnmkRJ4by79kevw=s96-c', NULL, '$2y$12$z.QrRk9ZZ4xo6PvSwDAIvuRI8o3uemGXolxMhWXaRprBQT78Bxuj.', NULL, NULL, NULL, NULL, NULL, '2026-08-20 10:34:08', '2026-08-20 10:34:08', 0.00, 0),
(85, 'Siti Mariyam', 'sitimariyam08231@gmail.com', '115740767738721488929', '6285645933201', 0, 'https://lh3.googleusercontent.com/a/ACg8ocL4alTeAEavdvQTCTM_sEtxyS5GythEQy0EKTFeGlLSpcQEJw=s96-c', NULL, '$2y$12$Ri8MHexYFpjPATSFMiL1sOLRfqQtQGHIX7Pm8UODHVhjFrk.gic66', 'NABILA PUTRI AZZAHRA', 'Asmah G1', '7 / VII', 'SMP', NULL, '2026-08-20 10:50:45', '2026-08-21 17:34:00', 0.00, 0),
(86, 'baleendahngunut 01', 'baleendahngunut01@gmail.com', '101040884915452763726', '6285546662149', 0, 'https://lh3.googleusercontent.com/a/ACg8ocKhpSogg3JnJENZJJADRoVY6lzW6aQLQZ54hmZhYG9N17gBJQ=s96-c', NULL, '$2y$12$3T7m7MiHrDqyzUVI.k/5cOPgKkJiFMWL/E6WkLvZ97OrE4.zdSg8G', 'MUHAMMAD HAFIDZ ARROSYID', 'Al Majid 2', '7 / VII', 'SMP', NULL, '2026-08-20 11:02:08', '2026-08-20 11:08:56', 0.00, 0),
(87, 'Siti Rofiah', 'rofiahsiti985@gmail.com', '117263796191009796186', '6282230404242', 0, 'https://lh3.googleusercontent.com/a/ACg8ocJxDH7_f_bbwUh6jyu77w93scR-8AVVJ25Q6G_qTvNqvM16C-U=s96-c', NULL, '$2y$12$spPlJc2SvLPsKBfu98PZ2envq2KUUtCnkYhIDYgHSj5Hxm3.dBXvi', 'SAFINA SALSABILA KAMIL', 'ASMAH G6', '9 / IX', 'SMP', NULL, '2026-08-20 11:10:16', '2026-08-20 11:13:41', 0.00, 0),
(88, 'Atik Robaniyah', 'robaniyahatik@gmail.com', '112969130696845139060', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKJQqAO481cBrrSHzRUJeSGtcOowKI8VJku0man7HWyr-7lvg=s96-c', NULL, '$2y$12$ctVfCcPhulyjf7w9CkPSauBy2/aosJs8qUAgNwqWvzB4Lq1KabuFa', NULL, NULL, NULL, NULL, NULL, '2026-08-20 11:40:06', '2026-08-20 11:40:06', 0.00, 0),
(89, 'Arr Riyadi (Arik Puspita Sari)', 'mak.nyus80@gmail.com', '115427970980869132955', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocJ5Wfr-6YZXTNaQ7vG3VPDGBToYXha7LHYHI2U0TFuQmKf4Vw0=s96-c', NULL, '$2y$12$0.tnZbXkIRwPR.Bf4kyoHOqkUDTbnFVjjV8oiWbKJVBRnN194ax6a', NULL, NULL, NULL, NULL, NULL, '2026-08-20 11:41:55', '2026-08-20 11:41:55', 0.00, 0),
(90, 'Atik Robaniyah', 'robaniyahatik12@gmail.com', '114851779815689372570', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocK-91ux4qlPIytmWz5WZ2dS3KBm7RYKOCLVLxknHQQN5C6SDA=s96-c', NULL, '$2y$12$xDMLjzosJLZEBoEy3i866ea.kDZEN4RWcKucZ0A4rra.DK3rPj71W', NULL, NULL, NULL, NULL, NULL, '2026-08-20 11:44:15', '2026-08-20 11:44:15', 0.00, 0),
(91, 'Nurul Malikah', 'nurulmalikah16@gmail.com', '101640930013485192368', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocJCGDxp5KU8YC8FRxVz0WDoRO1BOJV6r1HGX0Kb-tt3GdefVA=s96-c', NULL, '$2y$12$Yz3bhjdl0comfM9zOX7C7ehDqeO/9DpCgQna2/7k1Oq0pXgKuM1Im', NULL, NULL, NULL, NULL, NULL, '2026-08-20 12:00:46', '2026-08-20 12:00:46', 0.00, 0),
(92, 'Helton Farihal', 'heltonfarihal@gmail.com', '107970591484337984895', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocL5yDNjDO-Z5NcrbvKVgVc-mxiQo781XB5bhFTKrG8KhlUTDks=s96-c', NULL, '$2y$12$RAYOdIM3jLl8qakbcDU54e1qJQ6Yu8n/Doen3/Iyfsnt6dhsOd7Pi', NULL, NULL, NULL, NULL, NULL, '2026-08-20 12:01:34', '2026-08-20 12:01:34', 0.00, 0),
(93, 'Vera Patika', 'verapatika1@gmail.com', NULL, NULL, 0, NULL, NULL, '$2y$12$w311GBXyF8CXrKwyjYXkCOwF/I1JoD5vrti/yPB6Hd0hGeSbjTxga', NULL, NULL, NULL, NULL, NULL, '2026-08-20 12:15:25', '2026-08-20 12:15:25', 0.00, 0),
(94, 'warung nasi cokot', 'usahanebunda@gmail.com', '104009405009051929322', '628165445083', 0, 'https://lh3.googleusercontent.com/a/ACg8ocLvWD-ysc9yEUwkeG_ddi5OR4sWoEFX275kbeaBxhxUObZpXUlW=s96-c', NULL, '$2y$12$mX0T0LNs.2fs4W.x3Ero7envj3MqS8p0SJxwGgpDi7a9aSycfDlFa', 'SYIFA AZZAHRA', 'G 2', '7 / VII', 'SMP', NULL, '2026-08-20 12:16:17', '2026-08-20 12:19:20', 0.00, 0),
(95, 'Alfista', 'alfistays@gmail.com', '109850768658815923945', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocJrPC_pQ4DgUDb0uNWH2tW_RlZCkMcOEtL-yQWS_HFnD4t_4z4=s96-c', NULL, '$2y$12$srfy3NDgWzCKnMts68pp.evP5FPHe/6rwrx4ChbI0qjZLyPvT5jr.', NULL, NULL, NULL, NULL, NULL, '2026-08-20 12:26:37', '2026-08-20 12:26:37', 0.00, 0),
(96, 'Siti Nur Azizah', 'sitinurazizahh5@gmail.com', '101106586695417562113', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLkG4ASwH25Kt3UBd38BqDtR9N3zsFJwag-8AsuB4TL8WW0vsVjHA=s96-c', NULL, '$2y$12$eFuS9c.85CBrrARLxvFihegJLwdm5ExWr1LBpc3b94Y0ACvKWh1qu', NULL, NULL, NULL, NULL, NULL, '2026-08-20 12:30:41', '2026-08-20 12:30:41', 0.00, 0),
(97, 'Rofi\'atun Mukaromah', 'rofiatunmukarromah@gmail.com', NULL, NULL, 0, NULL, NULL, '$2y$12$vLIJ1MYcxqU.m.0XbwEuietnPj.2lSJ7RXlRzNLK1H68HprkM5OXO', NULL, NULL, NULL, NULL, NULL, '2026-08-20 12:52:44', '2026-08-20 12:52:44', 0.00, 0),
(98, 'aldo kris', 'aldokris085@gmail.com', '100672606256429646823', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocIusGn_a2t791MFyurpYVD1CzUg8XGIdL4Ji6eJmapfn7ugUc3T=s96-c', NULL, '$2y$12$F46AXMOXjrCt4XstWDZcO.JaVvuff.IE5sfWvdYT8bsmgJ77PD4aS', NULL, NULL, NULL, NULL, NULL, '2026-08-20 12:52:56', '2026-08-20 12:52:56', 0.00, 0),
(99, 'NurinLatif Azizah', 'nurinlatif2124@gmail.com', '108439829069827403624', '6281235471361', 0, 'https://lh3.googleusercontent.com/a/ACg8ocLUEeqr1bAF264W5JvU6NYCS1uYfLLIK9JNytiM3BsbzeTpmQ=s96-c', NULL, '$2y$12$CdaooJByqzefKh05ergE8.Mn5M9BnNAn9jk7P4RljorSU9NorE0R6', 'NGARIFATUN NIKMAH ZAHRO', 'Asmah', '10 / X', 'MA', NULL, '2026-08-20 12:57:09', '2026-08-20 13:01:52', 0.00, 0),
(100, 'Nur Arsyadan A', 'baikdanbarokah@gmail.com', NULL, '6282337202569', 0, NULL, NULL, '$2y$12$VA.7iVlt7yzAtuJ5MrPQuOEs0WOheE9tg6wbENssZqGTXMtgYseB2', 'AHMAD AL-BADAWI', 'Al Majid 1 / Kamar A7', '11 / XI', 'MA', NULL, '2026-08-20 13:07:16', '2026-08-20 13:10:13', 0.00, 0),
(101, 'NAIMATUL FAUZIYAH', 'imesweat34@gmail.com', '115118689838191863135', '6285646334427', 0, 'https://lh3.googleusercontent.com/a/ACg8ocLFiAo-q3v5vBiTuq9yPotDuUJUGy3ZxA6jnca79pZ0ey4uBPEJ8w=s96-c', NULL, '$2y$12$zY4A1KCX40VDjNtPMxAaL.ncyMw.z8qjQeowXFogigcBMHMB9rnxS', 'IFTITAH AZMI ATHIFA', 'G12', '8 / VIII', 'SMP', NULL, '2026-08-20 13:12:03', '2026-08-20 13:13:22', 0.00, 0),
(102, 'Zidni Ilma', 'zidniilma97748@gmail.com', '102502969000035749795', '6285334814798', 0, 'https://lh3.googleusercontent.com/a/ACg8ocIysgUfzNnObGNC3L8o9nVanOTkJYtkqDEam1_QX5LeECZ15A=s96-c', NULL, '$2y$12$/EcjwhSTCp5MW3hivwUB3.lAWfb8Z7ZBvMH9kdx8VaMQ2loDKAIYK', 'ZIDNI ILMA HAQIQI', 'ASMAH G.9', '9 / IX', 'SMP', NULL, '2026-08-20 13:17:43', '2026-08-20 15:20:59', 0.00, 0),
(103, 'Zairina Amalia', 'zairinaamalia5@gmail.com', '106440982983498524833', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLVgUy90T9r5qvVc0SPJ0XoEirfcdEY2ptwIWkKX0x8xY60W3Yq=s96-c', NULL, '$2y$12$avzo8LmGR4pe.d.4YddrTeRu0TNvm.LodUxqEWLNxuzXf2vWB1pEu', NULL, NULL, NULL, NULL, NULL, '2026-08-20 14:27:21', '2026-08-20 14:27:21', 0.00, 0),
(104, 'Muhtarom Tarom', 'tmuhtarom398@gmail.com', '105256780956806032266', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLbShAKOkv5yGrNemFfz7sOgKjTOzo_LZnaNV084ZKCBFqwMw=s96-c', NULL, '$2y$12$XIYtSGbW5z7a0g2lvYGCNeFDHd7lx7X7dGWW05lVX1zPQZEkFVMIq', NULL, NULL, NULL, NULL, NULL, '2026-08-20 14:30:39', '2026-08-20 14:30:39', 0.00, 0),
(105, 'bank one', 'blankkyosu@gmail.com', '111150715704220891798', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKCC7Yj3W8voz-HwIdY-4JpoDx23ncDOZqZSbc93xPuzsYhEA=s96-c', NULL, '$2y$12$GNIY1rIG7umqJTRXTWSfmObcHHEpr0ChZB2wgC53hNZtUfxCRZP1m', NULL, NULL, NULL, NULL, NULL, '2026-08-20 15:15:55', '2026-08-20 15:15:55', 0.00, 0),
(106, 'makinun aminun', 'makinunaminun@gmail.com', '107505918444329477049', '62881037314827', 0, 'https://lh3.googleusercontent.com/a/ACg8ocIZStbQ3O_E0u815TpG5__R_4tFYTjK7-xYQ1kmdfMRMsWmAw=s96-c', NULL, '$2y$12$fMqFjToCsH92TkYZs6a9.OaoKqVeroDV3JYGmQY/hxm8BZ/K.tbiG', 'SYAHDU NAZWATUL JANNAH', 'Asmah kamar G 4', '7 / VII', 'SMP', NULL, '2026-08-20 15:57:47', '2026-08-20 17:38:04', 0.00, 0),
(107, 'Fitrin dwi norfadilah', 'fitrinzivan@gmail.com', NULL, '6281237777191', 0, NULL, NULL, '$2y$12$OtGR9tFVIOPH71gxPYlNiuoC4lj/gIuqpR0hujWoVSR/AHCx64cXO', 'ZYA NAZNEEN LATISHA WIDY', 'G5', '8 / VIII', 'SMP', NULL, '2026-08-20 15:58:10', '2026-08-20 16:07:25', 0.00, 0),
(108, 'instagram123 aa', 'aainstagram186@gmail.com', '106780936717777303654', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKHyZCe6aAbkjVmFLyCCqOLXsu1qjS84-mQuHgtFWMspOudkw=s96-c', NULL, '$2y$12$/jmeG.aJL3xb.e40TysUd..iZYNXq4NajNN4uDx2DURvl8GKVadcm', NULL, NULL, NULL, NULL, NULL, '2026-08-20 16:19:06', '2026-08-20 16:19:06', 0.00, 0),
(109, 'Ima andriyani', 'imaandriyani6@gmail.com', '114971420001711269123', '6285758964796', 0, 'https://lh3.googleusercontent.com/a/ACg8ocIFTsAlVkFmxq0ksMuu9A_fA7w6oEvD4EflBQ4ol-eXXXV3f_Y=s96-c', NULL, '$2y$12$8fpSI/el0xa2ziPDDr.v6.oEgGfM8bSyxf2r76R0Vm1FNsR12h8oq', 'M. FAIRUZ ALBAHRIE IZDIHAR', 'Al Majid 2', '7 / VII', 'SMP', NULL, '2026-08-20 16:36:41', '2026-08-20 16:40:31', 0.00, 0),
(110, 'Zi Dan', 'zidan15956@gmail.com', '101861320318100615819', '6285754343797', 0, 'https://lh3.googleusercontent.com/a/ACg8ocJXqUyg2EaSI_nOwYuykyLmU-ohpwN8mj9X_YXbQG5kHnoGmQ=s96-c', NULL, '$2y$12$N1llujaz0hJhtUPhDev0I.b078dvQe4a5cSY5eZucCf8DXugdyrNy', 'ZIDAN AHMAD HAIDAR MUSYAFFA', 'Almajid 2 C8', '8 / VIII', 'SMP', NULL, '2026-08-20 16:37:42', '2026-08-21 16:59:30', 0.00, 0),
(111, 'Erli Retnawati', 'erliretna@gmail.com', '102459491123557725615', '6285706771403', 0, 'https://lh3.googleusercontent.com/a/ACg8ocJU29QMj6bGFCldpYu-d7Ujr4d_8oeIwUoFm5AVU0yn3tIbzQY=s96-c', NULL, '$2y$12$351ZiCQB8i8aEj5rk6kmye2F5rMQ1RGQirp7KmFAyfkjMB7g3YIdO', 'SITI WARDATUZZAHRO\'', 'Asmah G14', '7 / VII', 'SMP', NULL, '2026-08-20 16:54:09', '2026-08-20 17:03:16', 0.00, 0),
(112, 'Nila Anisa', 'bila.anisa1311@gmail.com', '110083532568616402575', '6285707732707', 0, 'https://lh3.googleusercontent.com/a/ACg8ocLiZrEXVgzRw3NZjrdo-CTcu-IpEqVBoA1ZOfSjJpyNmGtJLg=s96-c', NULL, '$2y$12$4IhG8fBNWCtRFS/adYRJJ.FDm9gR6UJTyYkbRIwJfbWpgYuFw/cbu', 'NAJWA KHOIRU WILDA', 'Asmah/G.1', '7 / VII', 'SMP', NULL, '2026-08-20 17:06:45', '2026-08-20 17:10:27', 0.00, 0),
(113, 'arsada mahyana', 'arsadamahyana@gmail.com', '100259618206734523014', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocJEyMKApp9SrYw2Vd5ObBT6-6s6cq93QxZFuhZmeBbSiUwXZQ=s96-c', NULL, '$2y$12$JZyPrsk1LOrl..q0weIybekcUApggGQJCJjOFgWj9BLQ.xAkk0XbW', NULL, NULL, NULL, NULL, NULL, '2026-08-20 17:16:02', '2026-08-20 17:16:02', 0.00, 0),
(114, 'Mir\'atus S', 'miratuss75@gmail.com', '109136604553945600897', '6287858277262', 0, 'https://lh3.googleusercontent.com/a/ACg8ocJgjA7bbHOXitR4xnLs0IStCu0-vPiFofM0YhSGjdG4L_TaHw=s96-c', NULL, '$2y$12$BH/GMljrwwQCfZORHofk.elgtPcfw3MgX5Mc7Vapqx35B4kVJcphK', 'MOHAMMAD ZIDNI ZAMZAMI', 'Al Majid 2', '7 / VII', 'SMP', NULL, '2026-08-20 17:21:41', '2026-08-20 17:30:49', 0.00, 0),
(115, 'Erni Susanti', '112233ernisusanti@gmail.com', '109172114985574851154', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocIEBVfIZpsADNxOFC5ichgN6UofGpGNEwas9pq7AHDxryCq8w=s96-c', NULL, '$2y$12$3CL6M1jvmkjAXNBGqm9SFuPcBkPegajGfUint5xYjUoynL/2e6e5m', NULL, NULL, NULL, NULL, NULL, '2026-08-20 18:51:41', '2026-08-20 18:51:41', 0.00, 0),
(116, 'Siswantodt Londodt', 'siswantodt027@gmail.com', '111752513899148053681', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKwbxSf8DC637KIH5DONRk9uqcoqSd5WoGtK066_oaNJwy2_w=s96-c', NULL, '$2y$12$r5G0nb9BFgaHulpx55ZSoe3NYF56JbwTGidx56R6JTYiUGUFSCUPW', NULL, NULL, NULL, NULL, NULL, '2026-08-20 19:00:33', '2026-08-20 19:00:33', 0.00, 0),
(117, 'Ima Zulfa', 'imazulfa86@gmail.com', '106469666342306306130', '6285732041376', 0, 'https://lh3.googleusercontent.com/a/ACg8ocID4hqfuiumOCSVckVbOauanwd2FjZddx1lDQyruq7pjOsLzjg=s96-c', NULL, '$2y$12$x90IxiweO0V8JdcyiSMfieSkAz8KWvNoTlGIOLQy4MsZAgCdHUJW.', 'NASYA ASHILA MAULIDA', 'G 8', '8 / VIII', 'SMP', NULL, '2026-08-20 19:26:11', '2026-08-20 19:29:59', 0.00, 0),
(118, 'Endang Wahyuni', 'fayiz073@gmail.com', '100485345593562613852', '6287860948390', 0, 'https://lh3.googleusercontent.com/a/ACg8ocLVJJTqAHDUaopWh5MqjMig1ujf1MDprnSk_0U6rE56hntQeb9Z=s96-c', NULL, '$2y$12$Juq2XActdDzmQc8YkoReKuS7NKDsJ52IpeCQ/aeqTl0x74/ImwAWu', 'FARIISTHA NAJWA ANINDYA AL MALIK', 'Asmah/ kamar G4 kelas 7E', '7 / VII', 'SMP', NULL, '2026-08-20 19:41:53', '2026-08-20 19:48:15', 0.00, 0),
(119, 'Englia Fathoni', 'engliafathoni@gmail.com', '118044076789545309553', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLoOfwN07cQKXbalwHzx7p7UxVd_dPfRZ9zODF4YyFD4eQolfkgaw=s96-c', NULL, '$2y$12$XKu5yUWJ6j47tJtXfh/09OMgywIl4CLC6BWOVMa7l8GA.lL6Ubpci', NULL, NULL, NULL, NULL, NULL, '2026-08-20 19:42:07', '2026-08-20 19:42:07', 0.00, 0),
(120, 'Umi Mahtum', 'umahtum9@gmail.com', '118176039741507834332', '6285235696046', 0, 'https://lh3.googleusercontent.com/a/ACg8ocLdP0QPh54QNyMudHe5QNVD0y-TVvDJ766Z6iqT9cgITn7s9A=s96-c', NULL, '$2y$12$8fP0jYUMfbZJw7sc9kzFCeBb1XS7VQZK1vejQ4eTGxdB3xxHykIGq', NULL, NULL, NULL, NULL, NULL, '2026-08-20 19:49:59', '2026-08-20 20:28:46', 0.00, 0),
(121, '06. Daffa\' Safaraz', 'merryeko@gmail.com', '116036301342492760094', '6282257699596', 0, 'https://lh3.googleusercontent.com/a/ACg8ocLGzN-NS7Sfzd1fCWu8Pkxf9QkLAHnYtz9NzRfh3boi2eAt6Q=s96-c', NULL, '$2y$12$evnBKpeXq/1df68DCyzO.OGNoyH37LXBgoltIN0bRjvcY1GiKOUZC', 'MALEEKA NAZNEEN RAISYA', 'Asmah G1', '7 / VII', 'SMP', NULL, '2026-08-20 19:53:50', '2026-08-20 20:01:00', 0.00, 0),
(122, 'Cici Siswati', 'cicisiswati4@gmail.com', '108698009331873090721', '6281331431581', 0, 'https://lh3.googleusercontent.com/a/ACg8ocI_yGm22t15Bgd3ait-ionBsfXlIEHebhJrsYCba-le68QD9RBndA=s96-c', NULL, '$2y$12$6I1cvQsS8I.JPyPn5aZA8Odfb.iDZCO1R94jKq193hfkBOQSSFThm', 'KAYLA KHANSA AZ ZAHRA', 'G1', '7 / VII', 'SMP', NULL, '2026-08-20 19:56:19', '2026-08-20 19:59:32', 0.00, 0),
(123, 'deske febrian18', 'deskefebrian@gmail.com', '104970211686766388260', '6285859820305', 0, 'https://lh3.googleusercontent.com/a/ACg8ocJe2wwfw59GGX41DJZPwtGTon42oZWXUfSHqaCQEOapfudlVw=s96-c', NULL, '$2y$12$9IEQ3R36SmZHC98mWnf0HeMDcIS8dCRnwEyWyqDEXSss7Owa6/2Rq', 'MAULIDYA BILQIS PUTRI AZ-ZAHRA', 'Asmah G.3', '7 / VII', 'SMP', NULL, '2026-08-20 19:57:34', '2026-08-21 00:01:57', 0.00, 0),
(124, 'noura ulfa', 'amidhana1@gmail.com', '104993729127543637833', '85624407704', 0, 'https://lh3.googleusercontent.com/a/ACg8ocKPxCPCWGjYuIdlUsrpmu20ghL86Z8p7O2GpdBvnJoMmkY-VPrf=s96-c', NULL, '$2y$12$HlYrhPJLl5mRAY8WN5T/xuEfNBW9Hjhjemo4CkSOJHxymspmrmdRe', 'LAYYINA SYAUQIYA', 'Asmah', '7 / VII', 'SMP', NULL, '2026-08-20 20:00:34', '2026-08-20 20:06:55', 0.00, 0),
(125, 'Rohmah', 'rachmanashir29@gmail.com', '107153491929478181232', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocL5tWAwstqaZYtkcD0Xh42dOYIvDwuhnwc5aEgvGnJOn2Ymg08=s96-c', NULL, '$2y$12$FFrZGkv/f6UlAoa439uV8.HVW.EypyDXDL3pET0.8ENKH6FslG52q', NULL, NULL, NULL, NULL, NULL, '2026-08-20 20:06:37', '2026-08-20 20:06:37', 0.00, 0),
(126, 'RENDI NUROHMAN', 'yetik.parcel2018@gmail.com', '106512999958324792110', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocItgVkhqpjvasIrJEhPZxWwsj3J1gEU35ZOv2UizZzcdRFteQ=s96-c', NULL, '$2y$12$QZrjEdqvgRVuVs5BqbNPGuq1zQ.bo69nWZf6b.JCxDaJ2wp4.a1ye', NULL, NULL, NULL, NULL, NULL, '2026-08-20 20:11:32', '2026-08-20 20:11:32', 0.00, 0),
(127, 'Denti Febriyanti', 'dentifebriyanti1996@gmail.com', '108880610610406188645', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocL0DxfhxTt7SgDX-VeccRC7IXIVUSYn-kYGeTuIwK9TC-Wnow=s96-c', NULL, '$2y$12$xHW8BjeDHDxAIeKJO4vQS.Y1vCO/t5BPphIT.36otyOJqRIv4/Tzq', NULL, NULL, NULL, NULL, NULL, '2026-08-20 20:11:37', '2026-08-20 20:11:37', 0.00, 0),
(128, 'Sabila Azka', 'sabilaazka22@gmail.com', '110866234145970559774', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKngHtNqD8NLFV6mM5i8E5hXBHrO2tHl8TEs_76bt_NfOGkXw=s96-c', NULL, '$2y$12$5JIqW9lhNHmmgHgehZMjL.oWMHFpSBCjOnGz4dbD6ZSWY/.ADtAlK', NULL, NULL, NULL, NULL, NULL, '2026-08-20 20:14:00', '2026-08-20 20:14:00', 0.00, 0),
(129, 'Gus Dur', 'gusdurrr2022@gmail.com', '107480954176225268376', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKaJse7NKSLD5Q70PmfbMoGqRYDoXa6XFM5lbkQexiAdzqkWw=s96-c', NULL, '$2y$12$F/4rKG4aF7ayI8SXEQbStOsLP/iG/yBpYNjDUTcAiMbtvmkvSbiim', NULL, NULL, NULL, NULL, NULL, '2026-08-20 20:14:07', '2026-08-20 20:14:07', 0.00, 0),
(130, 'Hilwa Ayin', 'nazifayin2@gmail.com', '113629668527334000123', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLyL6TyXBha-MFGKALrgr3_txmgR_nFfDUaF5MJ20vLzKF8aSRD=s96-c', NULL, '$2y$12$01dfMX1bxQonzAXQ.Qr..eHdkGtrAUy2Di5vZdbv7lP7CYGoJvhru', NULL, NULL, NULL, NULL, NULL, '2026-08-20 20:16:41', '2026-08-20 20:16:41', 0.00, 0),
(131, 'Agustina widayanti', 'agustinawidayanti87@gmail.com', NULL, NULL, 0, NULL, NULL, '$2y$12$S9dVVMst82Zl87Sp.dER3.W2zBtGRrhUbMrRXZdPEZCrMfWc34J0G', NULL, NULL, NULL, NULL, NULL, '2026-08-20 20:17:13', '2026-08-20 20:17:13', 0.00, 0),
(132, 'Hadi Suyono', 'hadisuyono5758@gmail.com', '118410755317151377008', '6281231593649', 0, 'https://lh3.googleusercontent.com/a/ACg8ocIzCxHh55ExuewUbde2AH2daNj0aPhgG7jz7ElQNgglffS6KmHf=s96-c', NULL, '$2y$12$BBhSVycD34zoMYlcLoSTu.Spi20ddzXejHGKI1Vvb2fQyizDBHGWW', 'ADHYASTHA PRASRAYA MAHADIKA RAFARDHAN', 'Al Majid 2', '7 / VII', 'SMP', NULL, '2026-08-20 20:20:03', '2026-08-20 20:25:07', 0.00, 0),
(133, 'erma lianti', 'ermalianti82@gmail.com', '104808390083611557220', '6281234412677', 0, 'https://lh3.googleusercontent.com/a/ACg8ocLba2KqpcZTpZsuj7-D82Ct6vrujE6ItJoUXGGb3mCVi6fj9A=s96-c', NULL, '$2y$12$HchpJPuwhc2vH7ztaWZRTusQs75rIKyo2J8a3b.iQphIlZqvgtUyC', 'MUHAMMAD AFIQ ZEROUN NUGROHO', 'C5', '7 / VII', 'SMP', NULL, '2026-08-20 20:21:35', '2026-08-20 20:23:35', 0.00, 0),
(134, 'Yunika anggi Hardini', 'yunikaanggihardini298@gmail.com', '103528263087100538294', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLpQxxr9t3IG0fKivwZt9-jIZ83X3iJEkxZQ76DZURspH7mkg=s96-c', NULL, '$2y$12$3YzVC05QIzbmtQDXRTBZGeN5gCYUXScsWhWNGQWgYTe8qCE1uu5iW', NULL, NULL, NULL, NULL, NULL, '2026-08-20 20:26:06', '2026-08-20 20:26:06', 0.00, 0),
(135, 'Siti Chalimah', 'ulinsatria626@gmail.com', '116802307973579171958', '6282335414065', 0, 'https://lh3.googleusercontent.com/a/ACg8ocLb4M69BQ7z6kbmKlYCbFTbFQvsCiV3hRhOPg-654HZF-PqiQ=s96-c', NULL, '$2y$12$ejzLpytwPG1OEXwMPGQfFeA0rLmcEXNyjQwHZRPm5O1/PPj4lXHFe', 'MUHAMMAD SATRIA ULINNUHA', 'Al Majid 2', '7 / VII', 'SMP', NULL, '2026-08-20 20:27:33', '2026-08-20 20:30:55', 0.00, 0),
(136, 'Aziiz Almashury', 'almashuryaziiz2@gmail.com', '113299398547958622071', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKn_Nipli5-R8UAPrXXU2rs9I6-1YnquZ685yF1rlCOH0QvRBcM=s96-c', NULL, '$2y$12$43yn0Vtud4Ib.D8kpDlpaefolvAIWjKlfCHzEjCNxRZwQERIMhKwy', NULL, NULL, NULL, NULL, NULL, '2026-08-20 20:33:13', '2026-08-20 20:33:13', 0.00, 0),
(137, 'Yuhu Seblak', 'yuhuseblak673@gmail.com', '108213329736803702835', '6285732947940', 0, 'https://lh3.googleusercontent.com/a/ACg8ocIv1C3qrn2a-Oqmqd12fbDjEP9EXhtR3QxA8La_aglPnyNWKQ=s96-c', NULL, '$2y$12$OuF6TEbCVxagjYFgLi1XIux9UkZ1EH0vjJcdwY3jEaR.2kXVcNdNy', 'MUHAMAD RAMDHAN FITRA MAHARDIKA', 'MAJID 2', '9 / IX', 'SMP', NULL, '2026-08-20 20:34:11', '2026-08-20 20:36:48', 0.00, 0),
(138, 'Nurhidayati Ima', 'nurhidayatiima0209@gmail.com', '101423797849992561350', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLmhf2XlgayNU5pr3OWlkD-dCaT74wQKiG1h9_BABVVV9Y1ZA=s96-c', NULL, '$2y$12$saoCtQrOo5BYaK/m4l2MFuATr7yybO.lcbyg08lHcTjeNJrKtBP36', NULL, NULL, NULL, NULL, NULL, '2026-08-20 20:39:35', '2026-08-20 20:39:35', 0.00, 0),
(139, 'Choirya', 'rya.choir86@gmail.com', '108314766533567798522', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocJbNOIDHeV3nP639fPuPwHU2cIQnJhd4CXdwLjqM4yNL9cKkRAZ=s96-c', NULL, '$2y$12$TxubLNsqmkNsLfOA9QOKO.l1W1dtXWEhTI66YR5Bq1/q9qoJzBZqi', NULL, NULL, NULL, NULL, NULL, '2026-08-20 20:41:16', '2026-08-20 20:41:16', 0.00, 0),
(140, 'Khudori Achmad', 'khudoriachmad7@gmail.com', '105330819578842507771', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocL9CFhYorMNBw62iFnVwq9OCQOIWyWrmcrgjeA9OYv0XW9s_ts=s96-c', NULL, '$2y$12$TmsBJomGCIqA/aPXFfqbduCkEq//Pz0arxy60azwFL3pWFAdZv.dK', NULL, NULL, NULL, NULL, NULL, '2026-08-20 20:41:24', '2026-08-20 20:41:24', 0.00, 0),
(141, 'nana Aini', 'nanaaini986@gmail.com', '109531893148278632678', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLMBIMoR4Qk3p728kUDDQqw9ydz1amuqVZxnTULK8iWbaWhfGPBuQ=s96-c', NULL, '$2y$12$1rg7Nv3dghYFH6FijrVZTeKt3q/fQp1MBpB6XcGhUpKVMniITurvS', NULL, NULL, NULL, NULL, NULL, '2026-08-20 20:46:07', '2026-08-20 20:46:07', 0.00, 0),
(142, 'Mokh. Habibbullah', 'habibdahana@gmail.com', '108478207063241476080', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocIgoZvnNjYFhMNiGc4kLgU7VMOsbtkiyqxyOEf3HwBuzg3ZQJXWEg=s96-c', NULL, '$2y$12$eyWqS1QuL1PIsGwq9.y8KuakYAW5F1POryImBPg.UPezvkr.buv0i', NULL, NULL, NULL, NULL, NULL, '2026-08-20 21:17:46', '2026-08-20 21:17:46', 0.00, 0),
(143, 'nashr Ahmad', 'nashrahmad81@gmail.com', '110275547554547176029', '6281335191533', 0, 'https://lh3.googleusercontent.com/a/ACg8ocKWzwd9SoP0dONmQwX7od9tPwI2i3lMSA1V_1b3kcDEy9-PWU2HGA=s96-c', NULL, '$2y$12$kfXcW.iglcoXLZIcvKCBHuuzVWCpOtjgjNe.dno7gTABveYNaHKKC', 'AISYAH QIRANI FIRZANA', 'Asmah', '7 / VII', 'SMP', NULL, '2026-08-20 21:18:34', '2026-08-20 21:23:55', 0.00, 0),
(144, 'Rafa elis', 'rafae3330@gmail.com', '103496195592681486243', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocIBtpRm48AVnuSVMroug8EX_EPPGUDJWAvfHqAYXinpxgh7qQ=s96-c', NULL, '$2y$12$IH/qSzBbD/4HFWTloj/nT.H4kTmU69prjQkPub56m.eMd3DYbjh5a', NULL, NULL, NULL, NULL, NULL, '2026-08-20 21:20:56', '2026-08-20 21:20:56', 0.00, 0),
(145, 'Sulukur Rosikhoh', 'sulukurrosikhoh88@gmail.com', '110941897586718413672', '6282228787375', 0, NULL, NULL, '$2y$12$4mpQKDj62oYPsgFCVRHiau7kB.RpuPZEiyUv0h5NE4oXs.WzoE3l2', 'SHIDROTA MUNAYA FATMAZZAHRA', 'G2', '7 / VII', 'SMP', NULL, '2026-08-20 21:23:01', '2026-08-20 21:25:04', 0.00, 0),
(146, 'Achmad Rifai', 'rifaiachmad3795@gmail.com', '101106670750860600143', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocL7xN1llQCNX9xS4TmJdUA17VlzwpJZzCpgaptElLw_luep7Q=s96-c', NULL, '$2y$12$.NtmhH6/IyvkNLNzQTkJueGuYzcGY.fGz.lsfqSQ9vKqtHz06pBHq', NULL, NULL, NULL, NULL, NULL, '2026-08-20 22:30:44', '2026-08-20 22:30:44', 0.00, 0),
(147, 'Endah Dwi', 'endahdwi181078@gmail.com', '114428443333711255905', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocJkBE9Xe3OLGq7n_1bKvRtB3NlCB7RWGO6YQHuTk_8JtIEKqA=s96-c', NULL, '$2y$12$9NilonZMdvkZPkGMptoKhOeeYPhNf.haUdSbrTUoMovN.uMialcFq', NULL, NULL, NULL, NULL, NULL, '2026-08-20 23:09:30', '2026-08-20 23:09:30', 0.00, 0),
(148, '*', '*@gamil.com', NULL, NULL, 0, NULL, NULL, '$2y$12$DajHzQuyY8HhDJ0K/F7mIusgbQTeNMwGgKaTVpEFoqlgMotGog1AK', NULL, NULL, NULL, NULL, NULL, '2026-08-21 01:25:22', '2026-08-21 01:25:22', 0.00, 0),
(149, 'Katwanto Sag', 'katwantosag@gmail.com', '110285151089795260164', '6285235927607', 0, 'https://lh3.googleusercontent.com/a/ACg8ocK8ho_jSJwR7I12aOwP9bW-Afo__GGhyIKXliU3Pt8I2d3chg=s96-c', NULL, '$2y$12$BFjyBhWsIDSnEi7on7MU1ekUwTB5IRSJ.ZngwmItahp8P6BBmUJNu', 'MUHAMMAD SYUKRON HALWAANI', 'C 5', '7 / VII', 'SMP', NULL, '2026-08-21 04:00:56', '2026-08-21 04:26:35', 0.00, 0),
(150, 'Mey Shinta', 'meyshin.19d@gmail.com', '100819713023953773065', '6287834762669', 0, 'https://lh3.googleusercontent.com/a/ACg8ocL2Uhxd4k33CPI6Hr5TMxCfFdeIADIBE0m1que_6fWLGATYOLM=s96-c', NULL, '$2y$12$utvXJJmPNrflYPFKIdyXCOF3auNSXxPm32Xk8Vm4cgs7yU.mUFqAu', 'DEWI MEY SHINTA', 'ASMAH/G8', '8 / VIII', 'SMP', NULL, '2026-08-21 05:18:14', '2026-08-21 05:19:55', 0.00, 0),
(151, 'Purwanti Endang', 'endangpurwantii087@gmail.com', '113241492740755880815', '628566576476', 0, 'https://lh3.googleusercontent.com/a/ACg8ocKLL3P-lk7CpJsK84iSOErZ-7iYpX2GkpN64ux7I_vtLDlZaw=s96-c', NULL, '$2y$12$cu9NxsJ8tZu16/7tN2S67eg2VGGVHShaks8ROosST9Su4.C.T3r.u', 'DEWI MEY SHINTA', 'Asmah/G8', '8 / VIII', 'SMP', NULL, '2026-08-21 05:20:46', '2026-08-21 05:22:40', 0.00, 0),
(152, 'Sukodono Oke', 'okesukodono41@gmail.com', '111948082105858166100', '6285735045429', 0, 'https://lh3.googleusercontent.com/a/ACg8ocKq69awC6guhwPzaDnRq2Np-I4szh28787HASNmkLde1qG9Zg=s96-c', NULL, '$2y$12$GFHIjbKVzYYZr8DnXXiXGODiIuSTMnzY4vXbwRk0OdFa8nPh0WXJe', 'FRESTALIYA DEA ANGGUN PRATIWI', 'Asrama asmah / g12', '8 / VIII', 'SMP', NULL, '2026-08-21 06:01:11', '2026-08-21 06:03:36', 0.00, 0),
(153, 'Azizah Kusriana', 'azizahkusriana4@gmail.com', '107831920451953382810', '62895622650855', 0, 'https://lh3.googleusercontent.com/a/ACg8ocKMog8JaNRdHEpP5W8HK5vMPiagjNSLuWytQkquKPn4rNTrlg=s96-c', NULL, '$2y$12$NzAlsfSukfPB3C1Cc7FHW.7ml/G0gtIM0ls8G1FSkh1yJh5ZTzc6S', 'RIZA AWWALIA OKTAVIA', 'Asmah G11', '8 / VIII', 'SMP', NULL, '2026-08-21 06:33:40', '2026-08-21 06:37:00', 0.00, 0),
(154, 'Siti Aliyah', 'sitialiyah120686@gmail.com', '114991781880650942102', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKdV5ye4_v2_QulkvFM84M3TyVddcnJiCaHqhm1n5cgt9uD3w=s96-c', NULL, '$2y$12$e4TryEEkS8l5WsZsDeYCvOFmlP9Up89gyu6XOj0G08gEi1vNqw9gK', NULL, NULL, NULL, NULL, NULL, '2026-08-21 08:13:14', '2026-08-21 08:13:14', 0.00, 0),
(155, 'Budi', 'budi.santoso0806@gmail.com', NULL, '6285749077165', 0, NULL, NULL, '$2y$12$7eXkrqKnzwJ.xCnFFkPee.TYJuGCA/NBmUoMQs2PFUeEJ3bX9VPPG', 'MUHAMMAD RICHARD KEVIN SANTOSO', 'C2', '7 / VII', 'SMP', NULL, '2026-08-21 08:33:22', '2026-08-21 08:39:01', 0.00, 0),
(156, 'Jamu Recma', 'jamurecma@gmail.com', '116872769790977985273', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLNzivLLlsl40NLP-pS3CF5oJytXG00eur0N8X5JvSkGDbGaTUr=s96-c', NULL, '$2y$12$rxz3r5VNOErkL5d/dwpMSueT40P0k9S4UZNnr95Wp4Q6ArEKMJu22', NULL, NULL, NULL, NULL, NULL, '2026-08-21 09:02:08', '2026-08-21 09:02:08', 0.00, 0),
(157, 'Galang Alanna', 'galangalanna.sa12@gmail.com', '104189484448794784091', '6285156709160', 0, NULL, NULL, '$2y$12$Q863hYUHTRi6k4cBu6hoIOuFgQV3CmC0EjzUT53dZJ1m1xlcWkqai', 'NARENDRA FAIRUZ DZAKI', 'Al Majid 2', '7 / VII', 'SMP', NULL, '2026-08-21 09:06:35', '2026-08-21 09:09:31', 0.00, 0),
(158, 'Darul Huda', 'hudanisa78@gmail.com', '100961975851611556294', '6285791677269', 0, 'https://lh3.googleusercontent.com/a/ACg8ocK23PUednJ_fgrMQ3W1hehQRecdWwes8BpDdpFYV_r_99r_dpU=s96-c', NULL, '$2y$12$gvQsqWphFwaB.ee6Kz.G9e2gpnt2SV1ucpaU3Gs5aWvY9lx2z5sUe', 'INDI ZAHRANI HUDA', 'Asmah', '10 / X', 'MA', NULL, '2026-08-21 09:07:53', '2026-08-21 09:11:18', 0.00, 0),
(159, 'Sumali Nirnur', 'sumalinirnur@gmail.com', '112847960564722993797', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKhMZZMTklevzVGSapLHEb_KW1s-Jaft5bSRzffWK5fxtP-tQ=s96-c', NULL, '$2y$12$8Q2Gu4YPQwktuQVwiRW79OGTFVTaLsZnYIuxduQXGRtaPKR3cI5Lm', NULL, NULL, NULL, NULL, NULL, '2026-08-21 09:10:30', '2026-08-21 09:10:30', 0.00, 0);
INSERT INTO `users` (`id`, `name`, `email`, `google_id`, `phone`, `is_working`, `avatar`, `email_verified_at`, `password`, `santri_name`, `santri_room`, `santri_class`, `santri_level`, `remember_token`, `created_at`, `updated_at`, `balance`, `penalty_points`) VALUES
(160, 'aqin elghouts', 'aqin84.ae@gmail.com', '109073069547309544144', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLLK7rCHQZ5PSIrry5c_n7J27Kgg7gRBokxdABeNvwQ197CqbRS=s96-c', NULL, '$2y$12$wXFlRzHLTM1176PKbOU2y.QfbOby9TRdJExfjCUiDVdKDIwMTeNBq', NULL, NULL, NULL, NULL, NULL, '2026-08-21 09:12:58', '2026-08-21 09:12:58', 0.00, 0),
(161, 'MOH ZEN GULOJOWO', 'qanajla@gmail.com', '109674316249891903237', '6285231740031', 0, 'https://lh3.googleusercontent.com/a/ACg8ocLDwxie9S4J6teMeAPE40OdN01-wK-96EFm8evaN1t24nzjYJBx=s96-c', NULL, '$2y$12$hWabeACTifz1d4iJMmcqEOkDda8oWl5VJWL8czOA9bmOaSp5vHzFS', 'MARSA QISTINA AN NAJLA', 'Asmah G20', '10 / X', 'MA', NULL, '2026-08-21 09:28:51', '2026-08-21 09:30:06', 0.00, 0),
(162, 'Ananda Sabila', 'anandasabila607@gmail.com', '111087696113849222998', '6285655829077', 0, 'https://lh3.googleusercontent.com/a/ACg8ocInsA6DWmfygBX1lDzVJc2UeEbCEQP1p6yo4nXZVuHd4gzeWg=s96-c', NULL, '$2y$12$aUobMPZL6GTobXsoihtS8Ou08FNc0q585Qv3zKUMjwH0ifTvffiu.', 'ANANDA SABILA AZKA', 'ASMAH/G.18', '12 / XII', 'MA', NULL, '2026-08-21 09:31:27', '2026-08-21 09:40:01', 0.00, 0),
(163, 'Muhammad Muzaki', 'muhammadmuzaki9748@gmail.com', '102391379621666020574', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKi2w1etDhMkKeKYVUlLpWrxlE6LYDxYQiL6XacAjRvVHzzHEiz=s96-c', NULL, '$2y$12$ORdxHaYUMnw.VIDj4Ax8Pez3zSo5pfOU6CJT.cKWtGYMSv1qakIWK', 'NURUL FADHILAH', 'Asmah', '10 / X', 'MA', NULL, '2026-08-21 09:45:37', '2026-08-21 12:05:01', 0.00, 0),
(164, 'Khansa Aqilatul Azizah', 'khansaaqilatulazizah@gmail.com', '105683119577697452292', '6282296996532', 0, 'https://lh3.googleusercontent.com/a/ACg8ocJL_8oFOmVIWh7BS-0Q6ZJ2-DjIJA3ecn-S4gLdvbvgJpx7xw=s96-c', NULL, '$2y$12$fRkBl2FBVsxxj8Dmwrf9nejEpQ/kltpSMj8nNFBSAJEGE384NGmaa', 'KHANSA AQILATUL AZIZAH', 'Asmah / G-19', '11 / XI', 'MA', NULL, '2026-08-21 09:48:12', '2026-08-21 09:51:18', 0.00, 0),
(165, 'Calista Zahra', 'calistazahra815@gmail.com', '107282303649902322782', '6285894606812', 0, 'https://lh3.googleusercontent.com/a/ACg8ocJ-wHkCaGEu7P36yM-ObLfVWlDqXITaAMzbUrQw_TJzuJib8jc=s96-c', NULL, '$2y$12$cfLSh90.S2reLKAGRwxwjeLvDA9w//k8./oCncU3ssLaMLclkK0tC', 'CALISTA ZAHRA AQILA PUTRI', 'Kamar G 14', '7 / VII', 'SMP', NULL, '2026-08-21 09:54:18', '2026-08-21 09:58:59', 0.00, 0),
(166, 'Raisa Balqis', 'raisabalqiss123@gmail.com', '117268990904987452905', '6285708377084', 0, 'https://lh3.googleusercontent.com/a/ACg8ocLeHf-kmcKldju1eVks5b7nVwbgBNkCs6hcRFhfV600bnSobA=s96-c', NULL, '$2y$12$Wd3xryqSq54k9Vo00tbMm.vPm46sAan2r78JqAB0.SmZrFYInnmS6', 'RAISA BALQIS', 'asmah G. 8', '8 / VIII', 'SMP', NULL, '2026-08-21 10:03:33', '2026-08-21 10:08:33', 0.00, 0),
(167, 'Trenggalek Jaya', 'trenggalekjaya25@gmail.com', '113606169222096318408', '6285784666118', 0, 'https://lh3.googleusercontent.com/a/ACg8ocJhmK9CIHTMFKmdgRf1KvEOD9wcIVtFCs4gGeYBiG8MRDId1g=s96-c', NULL, '$2y$12$syWAMwRnxJzEjDRhPAzuW.Db.n70GO0J.rkCf4AL9JmAskZFm5pGq', 'AZIFA KHURIN MASHFUFAH', 'G 20', '11 / XI', 'MA', NULL, '2026-08-21 10:05:16', '2026-08-21 10:12:17', 0.00, 0),
(168, 'Arina manasikana', 'bundaula88@gmail.com', NULL, NULL, 0, NULL, NULL, '$2y$12$Yb8FE8RuPZMmwWLZA5SsReS6rhF.Q/KVbAGJF4Tl8b8duYN74ywkG', NULL, NULL, NULL, NULL, NULL, '2026-08-21 10:15:14', '2026-08-21 10:15:14', 0.00, 0),
(169, 'Nita Sri Wahyuni', 'nitasriwahyuni22030@gmail.com', '104510270618489727393', '6282232026003', 0, 'https://lh3.googleusercontent.com/a/ACg8ocKQxjlg_11HrpYZUoD73P_PDfoM6-0vsb8pgBZTmA3BNdO2PA=s96-c', NULL, '$2y$12$HiO6gAGQiec8irnnpB2iCeQPlTGCfwVbGm1/eBeCkps6UZ/3IYNmS', 'FIULINA FINKAN ELQUERA PUTRIE', 'Asmah g.23', '10 / X', 'MA', NULL, '2026-08-21 10:19:37', '2026-08-21 10:21:00', 0.00, 0),
(170, 'Lutfi Langgeng', 'lutfilanggeng09@gmail.com', '116339453378070678708', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLKdWU6kNEg7nRsAHAXZP_eg9orSD-onTPg5yoIgsK5i91mnQ=s96-c', NULL, '$2y$12$xGTMlolJn/kj1j0MlbrSEOhHaa37siPiZ0Ze0rW6OphK9h79hPOR6', NULL, NULL, NULL, NULL, NULL, '2026-08-21 10:25:12', '2026-08-21 10:25:12', 0.00, 0),
(171, 'Aan Himah', 'aanhimah497@gmail.com', '113753971476207507869', '6289697225233', 0, 'https://lh3.googleusercontent.com/a/ACg8ocIwpbKjGh7iN5aCK-UzgM6V08sqQZDUUPse_isO30LvRAgLFA=s96-c', NULL, '$2y$12$lgF/WE76aM5G5Z6Ofc0eM.vE9EI6HCj9DG0rb8hCcic6opqTggvXS', 'PUTRI UMROTUL UBUDIYAH', 'Asmah G-20', '10 / X', 'MA', NULL, '2026-08-21 10:25:55', '2026-08-21 10:28:31', 0.00, 0),
(172, 'Wahyudi Sucipto', 'wahyudisucipto80@gmail.com', '101775902616740292025', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocJdsmFqi3MMp7ugj7s7EylRkMsfROGEFekXGmiO_vnysFfTLw=s96-c', NULL, '$2y$12$W/ZCB5XRUt3ez5WLDApovuPPHfFXAV8QzVZcfi8hwukMwzNSTrYPi', NULL, NULL, NULL, NULL, NULL, '2026-08-21 10:48:43', '2026-08-21 10:48:43', 0.00, 0),
(173, 'Kholid Ridho', 'kholidridho5@gmail.com', '112903515609434685065', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocI-Tk8EnyxEGKzRK3RyaS36m1JHyGu9B8PZeq7IYnrbqEuwEg=s96-c', NULL, '$2y$12$06Qmy9Hj2VsqvLSAnmUqleLoyw25CPXmC5BrxtYyyZD7Kg427Z4NG', NULL, NULL, NULL, NULL, NULL, '2026-08-21 11:00:23', '2026-08-21 11:00:23', 0.00, 0),
(174, 'Nurulhani fatuzzahrok zahrok azhar', 'hanynurul567@gmail.com', NULL, '6285784249544', 0, NULL, NULL, '$2y$12$JbrwM35fDjfXTHLMVzl9Teo4pWjC.A.kiliEJ9uO/lfE5a4lQg67O', 'YULIANA ANTIKA KHOIRUNNIKMAH', NULL, '10 / X', 'MA', NULL, '2026-08-21 11:03:05', '2026-08-21 11:07:03', 0.00, 0),
(175, 'Nur Kolis', 'koliswarkop12@gmail.com', '118008589488386428363', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocIRLx7oFPl08DI2oc5DSQ7xfcJcEd12FSNrNl3LB2fWRLI05w=s96-c', NULL, '$2y$12$foP2H3APuta9OodNEr2MK.pIQzYpSD5YiQiAyvtEIKfWd/yeR7TZq', NULL, NULL, NULL, NULL, NULL, '2026-08-21 11:05:43', '2026-08-21 11:05:43', 0.00, 0),
(176, 'Sumadi Anto', 'sumadianto370@gmail.com', '108440397889371681103', '6282330194440', 0, 'https://lh3.googleusercontent.com/a/ACg8ocLf5zrL6r9lrZpPsEqRpJgZXawOFPFnhg8hPL-p0t5w3jM76w=s96-c', NULL, '$2y$12$a.5FdyFZICfRcQslJvBLBeaFNvgB6uFlQXZWUrvBcUOPzRHOh6PFC', 'NIRMALA PURI RAMADHANI', 'ASMAH , G.7', '8 / VIII', 'SMP', NULL, '2026-08-21 11:11:25', '2026-08-21 11:13:28', 0.00, 0),
(177, 'Endang Asturina', 'endangasturina817@gmail.com', '116477624799563739997', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKWZyUnlspxMpN0IO3Gozjqdkt5-2jNPm6awx7FftDyIIVUSA=s96-c', NULL, '$2y$12$tLLsY7PJsEqk3l5/KqITTePR6ZsVJu0YnKYvahUXHgBj98VdUyuW2', NULL, NULL, NULL, NULL, NULL, '2026-08-21 11:24:11', '2026-08-21 11:24:11', 0.00, 0),
(178, 'Umi Fadilah', 'umif7943@gmail.com', '101527990324637443472', '6285607313948', 0, 'https://lh3.googleusercontent.com/a/ACg8ocILYfKaLlZK6GgR30DsMNTuGa2GuW-9HJy-6iEJx9x3fj1Zvw=s96-c', NULL, '$2y$12$TMdLmO3fbapFtGr/XexTeenSbl22LZ5G0GkTt3HS4HITemXwsKstK', 'DZAWI HAFIDHOTUL ULYA AL ABIDAH', 'Asmah G17', '10 / X', 'MA', NULL, '2026-08-21 11:28:49', '2026-08-21 11:30:12', 0.00, 0),
(179, 'Imroatul Mufidah', 'imroatulmufidah1507@gmail.com', '117532711374787487103', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocJj74Dz9sh_TCKIAoe-4fTgTVO1vzGCwuK8mylXDjVu163a-Q=s96-c', NULL, '$2y$12$K83ye3Z6laXPS9lbFUfqFO/xpwIa.0cLayR1B.h.FXJhYO6C3qfbW', NULL, NULL, NULL, NULL, NULL, '2026-08-21 11:44:40', '2026-08-21 11:44:40', 0.00, 0),
(180, 'Putris Tian', 'putristian77@gmail.com', '116614665543633277582', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLk6Ss47pOWkKF9jIYo3GBsgO2cMYfsvoxihTLm_6GVtGGBIA=s96-c', NULL, '$2y$12$nh1u3cUYFnUyln1dAUMmZul8E9NmurMbvKTzLh2KXYOSnEPOaYWF.', NULL, NULL, NULL, NULL, NULL, '2026-08-21 12:04:09', '2026-08-21 12:04:09', 0.00, 0),
(181, 'zizi ajayyy', 'ziziajayyy@gmail.com', '114341218174103028270', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocK0KaXxHmwVucZ0fMApXwR-sTrKMLHbWhnBJ8gs5X0uMy3MFw=s96-c', NULL, '$2y$12$Q0cTboKBNUDtFHt5NS64huSgIjkY6XcUhcSkxbFhw933BKnfWtxRO', NULL, NULL, NULL, NULL, NULL, '2026-08-21 12:11:16', '2026-08-21 12:11:16', 0.00, 0),
(182, 'KARUNIA CITRA AZAHRA', 'ysv9100@gmail.com', '113757351018870655730', '6285745685538', 0, 'user_karunia_citra_azahra/avatars/1787289656_IMG_20260424_214518_808.webp', NULL, '$2y$12$uf33qhuxZz/l70TL5bNsTeemHO0rJFSuvJYaE6buWFQ4IKFb8DFHC', 'KARUNIA CITRA AZAHRA', 'Asrama Asmah, kamar G6', '8 / VIII', 'SMP', NULL, '2026-08-21 12:14:49', '2026-08-21 12:20:56', 0.00, 0),
(183, 'Sintia Baru', 'sintiabaru92@gmail.com', '109994899879927239125', '6285847704637', 0, 'https://lh3.googleusercontent.com/a/ACg8ocKAsro2CfG5c6fEBeBToLfGx0kDr9J9cq9lDYU5ALiDAZ75ig=s96-c', NULL, '$2y$12$3ZpYucJXGjesrArYLTL68ulkx9OOMysLLxlQVReTXWUO50MRnsGAe', 'SINTIA KHANIFIA', 'Asmah', '10 / X', 'MA', NULL, '2026-08-21 12:31:51', '2026-08-21 14:12:15', 0.00, 0),
(184, 'Lina Najah', 'linanajah254@gmail.com', '102277935367500859257', '6282229927211', 0, 'user_lina_najah/avatars/1787290795_Screenshot_2025-07-23-08-16-46-44.jpg', NULL, '$2y$12$koeIUDEfmOhdudke60CuOOXiIfnQhzr5atj5vXzAXWWrFDBPkrnBW', NULL, NULL, NULL, NULL, NULL, '2026-08-21 12:32:31', '2026-08-21 12:39:55', 0.00, 0),
(185, 'gus pul', 'guspul554@gmail.com', '109604427482147645206', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocIGB3zzRPBcsnygszrq5fbqlFfodvyuqpEhyi_9CXHHTaNFbBZV=s96-c', NULL, '$2y$12$l93uwQ/bLIvRzmkw9oPXee.CrleoDdIb52kAji8cwm6bqNATZfKJW', NULL, NULL, NULL, NULL, NULL, '2026-08-21 12:36:31', '2026-08-21 12:36:31', 0.00, 0),
(186, 'Rania Nia', 'rnia0353@gmail.com', '112533343816930956837', '6281259624242', 0, 'https://lh3.googleusercontent.com/a/ACg8ocIpZnn_xDBJK2GqA_JMKCkLE0KMTwsOujMXmq0T7j1owemxwQ=s96-c', NULL, '$2y$12$5Clqs04wf/cddX0jlW0iOumZ.6uB/QuYIXGMltIggDXVUZT474z2S', 'AZKIA NAZIFATUZ ZAHRA', 'G12', '8 / VIII', 'SMP', NULL, '2026-08-21 12:46:38', '2026-08-21 12:49:28', 0.00, 0),
(187, 'Bitzz Kulbett', 'praymal123@gmail.com', '114401371081157408414', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocIzRH2mlbPXlp2T4TZwMZlBztQnS8aWMGw8NF47unJgdmfHkt4-=s96-c', NULL, '$2y$12$KQeXalfzlIae6NlXm83/X.137mISEC11RofvcqxpXwXldiV.oTfDS', NULL, NULL, NULL, NULL, NULL, '2026-08-21 12:59:52', '2026-08-21 12:59:52', 0.00, 0),
(188, 'Nur Cahya', 'nc170161@gmail.com', '115901447171571169761', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocK_6YutpgTKb7FrH4pURu010Oxs75pKI-8nd4aOIxdlayICXg=s96-c', NULL, '$2y$12$gHCNGUt.b7fPBlnq4VBAlu6hRMFBHck/TUD5MoV0V5hcefw9cEntG', NULL, NULL, NULL, NULL, NULL, '2026-08-21 13:06:46', '2026-08-21 13:06:46', 0.00, 0),
(189, 'ALIN FITRIYAH', 'alinfitriyah6@gmail.com', NULL, '6285843918770', 0, NULL, NULL, '$2y$12$cp/75BNMLoqcp6M/xzxrDuyGZhUs.BgIXNTy8F6vgddKeaYMfRGCC', 'EKA ZAIDA IMANIA RAMADHANI', 'ASMAH/G 12', '9 / IX', 'SMP', NULL, '2026-08-21 13:08:17', '2026-08-21 13:10:07', 0.00, 0),
(190, 'Najwa Ulya', 'ulyanajwa31@gmail.com', '100003281412563370528', '6285735890978', 0, 'https://lh3.googleusercontent.com/a/ACg8ocK2RlYHnWO7unSukOLcxOM8u1CG32arJKvEMFTkNUzs9mlzIg=s96-c', NULL, '$2y$12$TgrsW40tsE6rFPFjHUA1P.Jef7zwDzjNV33QJjP/MUoXainKsWMYS', 'NAJWA A\'YUNAL \'ULYA', 'Asrama Asmah kamar G. 11', '8 / VIII', 'SMP', NULL, '2026-08-21 13:17:30', '2026-08-21 13:19:21', 0.00, 0),
(191, 'Ria Azaria', 'razaria69@gmail.com', '106158609487739422971', '6285648511128', 0, 'https://lh3.googleusercontent.com/a/ACg8ocLsYq3LuecbDP_1Yt_u6-USJQP3dVSzlJp0BJ5nS01F3v9Vtg=s96-c', NULL, '$2y$12$YzvN.WilHECJmoE0z85ya.XGv6lIu7iXzKchEtfz3tzhrPqvopjEC', 'AZARIA DEVI', 'ASMAH G. 12', '9 / IX', 'SMP', NULL, '2026-08-21 13:18:19', '2026-08-21 13:23:09', 0.00, 0),
(192, 'anakorang606 west', 'aziz.west999@gmail.com', '101678780903035989364', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKSl8sTx_b_Bqlg4fQwAoVHs7fRkoDDBY_WxJUZIABzj8ksmebIZA=s96-c', NULL, '$2y$12$giIAt/q35Ogemw2TbzHuuOvZmB02e8rGiMONmdK7g1FQB/7Sn9/sC', NULL, NULL, NULL, NULL, NULL, '2026-08-21 13:23:35', '2026-08-21 13:23:35', 0.00, 0),
(193, 'Sihe Wawaanajwa', 'wawaanajwasihe@gmail.com', '102621746471885597804', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocJ4C1rU_xWf1Za3bPGu1ibYo35FWzG5tItO1HVIAhFMQMuLNA=s96-c', NULL, '$2y$12$2zFxdQNkD/yUWPM0LhkHrO0YgLKFYyIqK6XJOW7UqOGym4mjLBlYy', NULL, NULL, NULL, NULL, NULL, '2026-08-21 13:26:14', '2026-08-21 13:26:14', 0.00, 0),
(194, 'Keylia Almahira', 'keyliaalmahira892@gmail.com', '107496539420467433967', '85640253200', 0, 'https://lh3.googleusercontent.com/a/ACg8ocILAeHe_l2IOOP_aSe1p6htCYC5ERVfLMVHAH60GmguoV4sLg=s96-c', NULL, '$2y$12$KPOOLSvyzD9KB8PBuZQaiuB4uE8CrVJ4PYXsVGO8bFMRJLhDAr3JO', 'NAYLA ZAKIA', 'Asmah/G.2', '8 / VIII', 'SMP', NULL, '2026-08-21 13:27:24', '2026-08-21 13:31:38', 0.00, 0),
(195, 'sholikin mmdc', 'sholikinmmdc@gmail.com', '101336927166497401338', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLiNUr7kUJyWewJiZlaZ7-Z-D_V7glK8SzTE8hxnyD2qyTUwQ=s96-c', NULL, '$2y$12$UeRdoSKxv/WAn11qU0eWBOER4x9A72jNPQCoCbnGmzLbvEpsIhmbO', NULL, NULL, NULL, NULL, NULL, '2026-08-21 13:34:25', '2026-08-21 13:34:25', 0.00, 0),
(196, 'Firnan Diana', 'firnandiana@gmail.com', NULL, NULL, 0, NULL, NULL, '$2y$12$xNXsNznsC0LVsIib1ilSy.2VMxnaw/jqYnmYXhWR/.y1etq60PHnO', NULL, NULL, NULL, NULL, NULL, '2026-08-21 13:44:05', '2026-08-21 13:44:05', 0.00, 0),
(197, 'Rizka Naini', 'rizkanaini99@gmail.com', '109811603129472525534', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKezkXFxOQ7zjz-Dz_MxPlvwCnlYK2FYs4UXLbqSMF8a8Vg2w=s96-c', NULL, '$2y$12$4kfb1/iFC0wJacrtrKQKXOHdH.Wvkk0sOF8V0ZT.BfiOvar5vILAC', NULL, NULL, NULL, NULL, NULL, '2026-08-21 13:49:46', '2026-08-21 13:49:46', 0.00, 0),
(198, 'Lala Nabil', 'lalanabil718@gmail.com', '110189063489688289899', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocK-s5iOE-csMNXS2wIe0kE8LdQFL-L1gG-m9mcV4VbBP6kIgQ=s96-c', NULL, '$2y$12$vZMTEEg6dlSaYNTxgjwNZuZJ3G0MDl56ipt6SQgk2FH.3CtVo/wn2', NULL, NULL, NULL, NULL, NULL, '2026-08-21 13:52:38', '2026-08-21 13:52:38', 0.00, 0),
(199, 'Nely_khusna Al-fauziyah', 'nelykhusnaalfauziyah@gmail.com', '109459386108273884075', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKqgpiV8z6rvfkm8HOK2BqjVP07atJrpGH-Ymju7nYAdXB2Dw=s96-c', NULL, '$2y$12$Bc52K2WJYt0T/45FRJmFwe0RHxb6H3L.mHJFtsCZ6/vU.QMSwnL9i', NULL, NULL, NULL, NULL, NULL, '2026-08-21 13:53:46', '2026-08-21 13:53:46', 0.00, 0),
(200, 'laelatus siami', 'laelatus.siami.tp@gmail.com', '115241143363545490714', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKEFJ8xMzBp9WT5uWlGpoBc2uwW0LDxStAiltPp8_0oCVvGjA=s96-c', NULL, '$2y$12$kRNoRa8ee3uy0/0Bvy6e6OQOPlZqpkYfNkSsVFzcBl2f05ry8MlDu', NULL, NULL, NULL, NULL, NULL, '2026-08-21 13:55:25', '2026-08-21 13:55:25', 0.00, 0),
(201, 'Sun Ella', 'ellasun232@gmail.com', '115624954266697661179', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocI3MonTR-jlpX3lDZxC4r8jcyj3PK8loxlkHmH79lknbohY3w=s96-c', NULL, '$2y$12$Lyb2hVc3YkdyWMPE6/kyUe11mjKlUUGn1f86CqbJj3LtoJioUd32a', NULL, NULL, NULL, NULL, NULL, '2026-08-21 13:57:37', '2026-08-21 13:57:37', 0.00, 0),
(202, 'N. Cahya Azzahra', 'dwiratnas0903@gmail.com', '108622792421008973939', '6282290113579', 0, 'https://lh3.googleusercontent.com/a/ACg8ocLNnGYB0FHkSd0gt583mEHvFY24-IVck2prXQYcZKIKHtXFAQ=s96-c', NULL, '$2y$12$UHM.QrqUoHQ7hQL0854qC.Zt3vje34aWAdHPGKoTZfDmkvgnlj/Mu', 'NABILLA CAHYA AZZAHRA', 'Asmah G23', '11 / XI', 'MA', NULL, '2026-08-21 13:58:44', '2026-08-21 13:59:45', 0.00, 0),
(203, 'Mahmudiyah Utami', 'mahmudiyahutami729@gmail.com', '106808504804580732522', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocJoOiJXq8JFj6L71qbkudmR2eroM3H4nhL57jwTNwXO4_He9w=s96-c', NULL, '$2y$12$wvcxonR5klK/R0R/7xPFNOb6lOaMaFOOWFa.1XR2/B84NSNsUipCG', NULL, NULL, NULL, NULL, NULL, '2026-08-21 14:11:23', '2026-08-21 14:11:23', 0.00, 0),
(204, 'rischa hermawati', 'rischahermawat89@gmail.com', '112133140785364789987', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocIIfoW-QscBYUt-mQix251AubaG47E9BiNl-seUWAMCBkqdG9G_=s96-c', NULL, '$2y$12$EgsbatRkLYh0mQl0a1aHhunEXekQr72/0MluJaUS3yDZBJrEN8eY2', NULL, NULL, NULL, NULL, NULL, '2026-08-21 14:22:03', '2026-08-21 14:22:03', 0.00, 0),
(205, 'jihannaailur01', 'jihannaailur@gmail.com', '109506543531153067122', '628563729116', 0, 'https://lh3.googleusercontent.com/a/ACg8ocJ_zZeUwcl7UX562IH_Hn6n1cp5DIAmwLCJ6GIb9eQmx3l1Cg=s96-c', NULL, '$2y$12$NCkUrmYBSLr7uy1xh8vhu.8r0zNSZ8ONYHPTBIFjTkkK7OEpcuRr.', 'JIHAN NAILURROHMAH', 'ASMAH', '12 / XII', 'MA', NULL, '2026-08-21 14:24:48', '2026-08-21 14:28:13', 0.00, 0),
(206, 'Naila Ulya', 'nailaulya058@gmail.com', '108494387466567335119', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocIlKrXAp8guDEg4DpJPJ2x8La0oRHo8CUhp-JVmnPc8eJ-G=s96-c', NULL, '$2y$12$FboTLRg86g4p77gGT7vJhOadbZu8jJHyNUsOp1/7jCm3R8htfWpCG', NULL, NULL, NULL, NULL, NULL, '2026-08-21 14:25:21', '2026-08-21 14:25:21', 0.00, 0),
(207, 'Fatih Al fayadh', 'alfayadhfatih@gmail.com', '109159098696293902077', '6285159975509', 0, 'https://lh3.googleusercontent.com/a/ACg8ocKmQb239dzKb4IOUgDrfg24aUWQYBguZW_kixcgdHZNeAVd5Q=s96-c', NULL, '$2y$12$m.8eVRFnmJWut1qMCndwZuZJKGh6J1D3QkxQ/c/87IgHOw4ix/9si', 'AWFA NAILI FAHRINA', 'ASMAH', '12 / XII', 'MA', NULL, '2026-08-21 14:28:36', '2026-08-21 15:03:10', 0.00, 0),
(208, 'Vanesya Amelia', 'vanesyaamelia49@gmail.com', '112612039970433242062', '85254791772', 0, 'https://lh3.googleusercontent.com/a/ACg8ocLQkNNhhUHJdaPSxle3-GGcY4qfJ65SBmrK8qEg8eLGNLunJTiatQ=s96-c', NULL, '$2y$12$rDbgYxgGxLB2ToeiHbauDOozpWVieB2RqheZzgJGl5fthM98onKjy', 'FANESSA AMELIA EKA RAMDANI', 'ASMAH / G.21', '12 / XII', 'MA', NULL, '2026-08-21 14:34:07', '2026-08-21 14:46:09', 0.00, 0),
(209, 'Siti Maftuhah', 'maftuhahsrengat@gmail.com', '105658527297911917479', '6285704310431', 0, 'https://lh3.googleusercontent.com/a/ACg8ocIhY6GrJFWL1sHxZuUf4bCovi2r9VOsVIDQ3wdmDRVZEGZEHw=s96-c', NULL, '$2y$12$GkqGUDUMd6bU6IGB9vJ9EO.g3uzxkwoKygs1uwBAQJNQyaQjKRbY2', 'ULFA KHABIBATUZ ZAHRO', 'Asmah G-21', '11 / XI', 'MA', NULL, '2026-08-21 14:34:51', '2026-08-21 14:40:40', 0.00, 0),
(210, 'Fanesa Amel', 'amelfanesa7@gmail.com', '108791560563147524986', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKocUAZp74AopSYKFhyizMji96vntrrQLV6CcdHwU4z4seC_g=s96-c', NULL, '$2y$12$4YGlnCnYs3paPtPUjQbwgOAd5AMByfSVGG0/EFhNdlDseuf2vDBgi', NULL, NULL, NULL, NULL, NULL, '2026-08-21 14:35:52', '2026-08-21 14:35:52', 0.00, 0),
(211, 'Estuning Oktaviana', 'estuningoktwviana@gmail.com', '109662141100155122365', '6285336443112', 0, 'https://lh3.googleusercontent.com/a/ACg8ocKgJTAuViXCJfGCNW6MNyHPJg8UWsjmDUZNd3dNdDiFYMHTXcbe=s96-c', NULL, '$2y$12$XXUHKgWC8Jlg9F2/aytuw.s6aHso.kdf9aFFsohTAgYqoUbqGethi', 'HURIN KHIZANATUL MAZAYA', 'ASMAH', '9 / IX', 'SMP', NULL, '2026-08-21 14:47:00', '2026-08-21 14:48:17', 0.00, 0),
(212, 'Fatma Zanida', 'fatmazanida65@gmail.com', '116862507654582734017', '6285730707649', 0, 'https://lh3.googleusercontent.com/a/ACg8ocIXcaAXUe1HV16gP32uyB7SLSgn0WuAbt_4cfeVTYcPlRgHLb1U=s96-c', NULL, '$2y$12$eyBENXnNHVOzyJ73pjRequ6cSmPYi96Y8xTtPgQQg70lHa/5k1U2G', 'FATMA ZANIDA', 'Asmah', '10 / X', 'MA', NULL, '2026-08-21 14:53:29', '2026-08-21 14:54:31', 0.00, 0),
(213, 'Lily Feliciane', 'lilyfeliciane45@gmail.com', '103916758993135119491', '6282142119531', 0, 'https://lh3.googleusercontent.com/a/ACg8ocJfyTcIzJq0qi1jNCnbajUFxiiD8OUqoCfp5aD_DBG6dcAErgA=s96-c', NULL, '$2y$12$EDrcWxjIr8TRZ/o05I53Ru.p2QhvJloN.07YCdz8GK1OjKxuQKOrG', 'DHIEZA KHOIRUL UMMAH', 'Asrama Asmah/G.11', '8 / VIII', 'SMP', NULL, '2026-08-21 14:54:25', '2026-08-21 14:56:03', 0.00, 0),
(214, 'dewi ulfa', 'dewimasniaulfa88@gmail.com', '112662114229073305227', '6285648999592', 0, 'https://lh3.googleusercontent.com/a/ACg8ocLARaHtvqRZR6y_tF1KF1BJRtXa3p9ntBwl5wIDJ6m3afWr3g=s96-c', NULL, '$2y$12$BmisCEBrk/2irk8Ru14Q3.xfCwPYo.8Yq29.TKAdoExBxjrtoh1ZK', 'NAILA SYIFANA SALSABILA', 'ASMAH', '9 / IX', 'SMP', NULL, '2026-08-21 14:58:48', '2026-08-21 15:01:55', 0.00, 0),
(215, 'Hanik Maslikhatu', 'hanikmaslikhatu@gmail.com', NULL, '6288996706508', 0, NULL, NULL, '$2y$12$yGJflHr49s7oJG7zgMyRq.EEO0inlPvrkpoyU/ynfepdgp7HIxStK', 'ANIS NAI\'MATUL CHUSNA', 'ASMAH G23', '12 / XII', 'MA', NULL, '2026-08-21 14:59:52', '2026-08-21 15:01:59', 0.00, 0),
(216, 'Aryanti Farel', 'aryantifarel789@gmail.com', '101871684019098562543', '6283873915178', 0, 'https://lh3.googleusercontent.com/a/ACg8ocJMCzSJF-xKSPRwjS80lutqt251JeUqW1xLOVLQ7MhCwk7ZHA=s96-c', NULL, '$2y$12$fnUCiE43jJiB6.bls0W1UesDCfUH32v.ZwnfALPWOlYHKEKsAzZ4q', 'AIRA RAHMA EFENDI', 'Asrama:Asmah,kamar:G.24,kelas:11 agama 2', '11 / XI', 'MA', NULL, '2026-08-21 15:01:07', '2026-08-21 15:04:25', 0.00, 0),
(217, 'Juwik Diana', 'juwikdiana2@gmail.com', '118131140737488224477', '6285749067131', 0, 'https://lh3.googleusercontent.com/a/ACg8ocKzaHvZP4tIMBlz56yqP6U5gTl3mclVAs_w80mbooJqJp4csg=s96-c', NULL, '$2y$12$7ZS58gn2YzsoQhvUzOUNreCN4yd83OICkfzkMMHxTZW1ohDgE4/hW', 'ZAHIRA ALYASA SALSABINA', 'ASMAH', '9 / IX', 'SMP', NULL, '2026-08-21 15:11:05', '2026-08-21 15:15:44', 0.00, 0),
(218, 'Zharifa Dhiya Nafisa', 'zharifadhiyanafisa@gmail.com', '112062725281576914158', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLPEgSPW53q2F7xjIcRbpCzdn-FYH9ATM9KOhHJ9do_VGLsHNM=s96-c', NULL, '$2y$12$VpjWMehakUWReTJeW6zO6e7XEbuLpQ.SkbFNdlrFWkfiIk7yVw4mW', NULL, NULL, NULL, NULL, NULL, '2026-08-21 15:17:18', '2026-08-21 15:17:18', 0.00, 0),
(219, 'Verawati', 'vera170686@gmail.com', NULL, NULL, 0, NULL, NULL, '$2y$12$S6MReUqDNH6Hm6qfx.5ZjOE5Xu3lMfMIj3sxZuvG6PnBgYplT2gpu', NULL, NULL, NULL, NULL, NULL, '2026-08-21 15:20:06', '2026-08-21 15:20:06', 0.00, 0),
(220, 'Elvia Elvia', 'elviaelvia311@gmail.com', '111212431955000699341', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLmSjpSIymhFWrniicrsVCExmCB-SE_Kv4bT7A7w23ZbYBffw=s96-c', NULL, '$2y$12$vLmoJ5VGjskDgDnW.3zbMOGbC1I6dRfuO4GcKAawydsJxzyKK9FVa', NULL, NULL, NULL, NULL, NULL, '2026-08-21 15:27:04', '2026-08-21 15:27:04', 0.00, 0),
(221, 'OLEH-OLEH KHAS TRENGGALEK', 'shodik.hasan@gmail.com', '117211888769472669719', '6285259878422', 0, 'https://lh3.googleusercontent.com/a/ACg8ocK-5HsT6eLY9z0EUA0uhVgNlgxPn1YLSQvFf_Tmt_s_a0A0Nth3=s96-c', NULL, '$2y$12$prxWqXRX0TlwJ6FRwvamRuI5hII5C3/EpnhU.ovqSm5q7PR4PUHD6', 'SALSABILA MUFIDATUS SALAAMA', 'G7', '8 / VIII', 'SMP', NULL, '2026-08-21 15:32:04', '2026-08-21 17:11:26', 0.00, 0),
(222, 'nadia khoiriyah', 'khoiriyahnadia89@gmail.com', '106916524648642058790', '6285784962641', 0, 'https://lh3.googleusercontent.com/a/ACg8ocIc0M5mHTrPoJTKnGFVAsG0eKLb2mU9bzO4nHeUxsEjlKB7zQ=s96-c', NULL, '$2y$12$gEQO.Hdu99/YIDLJKQFCAO38lDUr1ZShOXVqNmIvoS4r5/AB30NLW', 'NADIA KHOIRIA IZZATUN NISA\'', 'ASMAH', '9 / IX', 'SMP', NULL, '2026-08-21 15:34:38', '2026-08-21 15:38:55', 0.00, 0),
(223, 'Ainik S', 'ainiks76850610@gmail.com', '113466276430748760300', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKud9mzoyrTO1ppvYhBQPbb9VIsO2S3W8XTVOtorG7voH9tmg=s96-c', NULL, '$2y$12$6zRvcPVybqciC2D23GpGeOr0DFuHEhxYsfkrhGrK35HEkvhQW5LoC', NULL, NULL, NULL, NULL, NULL, '2026-08-21 15:36:40', '2026-08-21 15:36:40', 0.00, 0),
(224, 'anik rahmatuningsih', 'anikrahmatuningsih@gmail.com', '115875612910541347910', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocJc7tTwSk8cFpTWei2RzBevZJcGskdP5Tr8-M66w_LeuuZ0aZjc=s96-c', NULL, '$2y$12$5rBJ1ht2rseqWfPkgaxtFuYCEZ3uWB3RQrAOS4qLDgRtSnPrQAotu', NULL, NULL, NULL, NULL, NULL, '2026-08-21 15:47:54', '2026-08-21 15:47:54', 0.00, 0),
(225, 'Nadira Nadira', 'masfufahm884@gmail.com', '111737906602786151524', '628133561943', 0, 'https://lh3.googleusercontent.com/a/ACg8ocKKCavwvn7jUDy9KQdbctbd1MEOOVNq4L5PeuvLHCQp4nzrgw=s96-c', NULL, '$2y$12$bqoT19KIuMOxvYbxGuxfq.vwwzsFxqB7jb/uRIJM6chimUYVpvgJe', 'NADIRA RIFATUL WIDYA', 'ASMAH', '9 / IX', 'SMP', NULL, '2026-08-21 15:48:13', '2026-08-21 15:51:24', 0.00, 0),
(226, 'Fara', 'fara49538@gmail.com', '115253569108272599360', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocJJwuW_tle0O8AHQm4DYwbq8i2kbP17qImF0fhah88wMs3lHb0=s96-c', NULL, '$2y$12$5snklB40tUIVkFny5q5KJeBbVf9tdM/VbulizILa1OoCnGW39U8Ym', NULL, NULL, NULL, NULL, NULL, '2026-08-21 15:54:33', '2026-08-21 15:54:33', 0.00, 0),
(227, 'Alaik Husna', 'husnaalaik@gmail.com', '112320388401446738320', '6281232806080', 0, 'https://lh3.googleusercontent.com/a/ACg8ocJQImh7sFJMm1gp9uQuC0Tbvv1NWYQj400vmX600caS_6jXx2Nq=s96-c', NULL, '$2y$12$9ReSb1ulhMKUCTQRon9CsuSI8ZnXQrbAjEx.QbpRdceT5VZkH8kRW', 'RODHIYA ALAIK HUSNA', 'ASMAH', '12 / XII', 'MA', NULL, '2026-08-21 16:00:26', '2026-08-21 16:01:50', 0.00, 0),
(228, 'Nurul Fadhilah', 'nurulfadhilah1426@gmail.com', '109015658737364531895', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocIWrUwEB3om7T51oSU0vaqohOCnNuxnlOKqCTceXZoNAI5sww=s96-c', NULL, '$2y$12$2zBpVg/1az5quAoz.Vyy7uNRv4KP95USkmRkp7wZlSywvPNs1RmPy', NULL, NULL, NULL, NULL, NULL, '2026-08-21 16:05:33', '2026-08-21 16:05:33', 0.00, 0),
(229, 'Nuzul Mukaromah', 'nuzulmukaromah86@gmail.com', '112100872332591675593', '6287865331833', 0, 'user_desi_arina_auliya_husna/avatars/1787303734_1001145003.webp', NULL, '$2y$12$2txy0gvV186ERIXnmmGZO.VpRWelEEk.lGnZji05y8EJsn9bPdEs2', 'DESI ARINA AULIYA HUSNA', 'ASMAH/ G7', '9 / IX', 'SMP', NULL, '2026-08-21 16:07:38', '2026-08-21 16:15:34', 0.00, 0),
(230, 'Intan khoirun nisa\'', 'intan740759@gmail.com', '116380197623288327577', '6285819810304', 0, 'https://lh3.googleusercontent.com/a/ACg8ocJ4UA_2E5g0uovBjKYUr93kHy_srQGqHN5rls8E4Es__NxoQg=s96-c', NULL, '$2y$12$Y.rH928TpmNClOXXgqt6fugNM/GftTzJmzu2Zpq2zPUq/5iQYvJjq', NULL, NULL, NULL, NULL, NULL, '2026-08-21 16:09:47', '2026-08-21 16:11:12', 0.00, 0),
(231, 'Elvya Dyna', 'elvyadyna@gmail.com', '117149712394357537281', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocIuKVCOLUwQ9k2uz65f35fqEhzQmrYPPLcT9WySD_SzjXc5-g=s96-c', NULL, '$2y$12$R/ZH7Yj/hiqxaDereT9dZetZeBWCAX5Gsfe6whjtziyAyqgQ8g1xy', NULL, NULL, NULL, NULL, NULL, '2026-08-21 16:10:59', '2026-08-21 16:10:59', 0.00, 0),
(232, 'Wildan Mukholladun', 'wildanrossi9@gmail.com', '105799635227463375519', '6281615261064', 0, 'https://lh3.googleusercontent.com/a/ACg8ocJU9rpkZHeDNzHwDy0RTGWz85ipwaOuJxF0FEjqDpQaXVPA3w=s96-c', NULL, '$2y$12$KoxEPX90ZDecfNZs3RD5tufWLV.fahQ6cMqWu7gX3MZFZFiSbiyIC', 'INTAN KHOIRUN NISA`', 'Asmah/G23', '11 / XI', 'MA', NULL, '2026-08-21 16:17:13', '2026-08-21 16:20:41', 0.00, 0),
(233, 'Shofaa Nurazizah', 'shofaanurazizah50@gmail.com', '113288812816167437011', '6282334770058', 0, 'https://lh3.googleusercontent.com/a/ACg8ocLMHSBgJu1kGkxiP26fao-QWn03iXDdKL8QOWq2AsJsQZ-oKw=s96-c', NULL, '$2y$12$GttS0WZb9bGdnn3GHX5WBOVrGj8KOEmdZGT0ScPgElyMb0pGQCwCS', 'FIMA NUR LATIFAH', 'ASMAH', '9 / IX', 'SMP', NULL, '2026-08-21 16:23:30', '2026-08-21 16:24:52', 0.00, 0),
(234, 'Supadmi80', 'amy.supadmi80@gmail.com', '105342031697046627539', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocICub97p3jEIrDPHiMwobxnAc-l_aqYBS15Fm0aEg09lPV7rQ=s96-c', NULL, '$2y$12$3CL/ar43WTw808ZCdwqro.MZIWDFQCpmctidjYvgDxQp0v5DLRnEC', NULL, NULL, NULL, NULL, NULL, '2026-08-21 16:23:31', '2026-08-21 16:23:31', 0.00, 0),
(235, 'nanikervina', 'nabilarissalma@gmail.com', NULL, NULL, 0, NULL, NULL, '$2y$12$h5Fla7FUGs.S3nRU7fegIuV/5aaW4uOqzgNWiETtOWn52BhOSrA2u', NULL, NULL, NULL, NULL, NULL, '2026-08-21 16:33:53', '2026-08-21 16:33:53', 0.00, 0),
(236, 'Naila Hafizah', 'nailahafiza57@gmail.com', '117685116290025176904', '6285754343797', 0, 'https://lh3.googleusercontent.com/a/ACg8ocImRM4ddpGQkSZ8G1p8O36UkG2bNfoAbQ7ZuGsTri1rynFQ-S5P=s96-c', NULL, '$2y$12$xlSjARJUuTrYXwTDD6h4k.SGn/ZC/4nJeoykKVU5Xh4PvULez..5i', 'NAILA HAFIZAH QURRATU\'AIN', 'Asmah G17', '10 / X', 'MA', NULL, '2026-08-21 16:57:07', '2026-08-21 16:58:25', 0.00, 0),
(237, 'Alvina Muzzaiyana', 'alvinamuzzaiyana@gmail.com', '113572642921533843736', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLYjpvAH-AIqRLpMf2-IQNIWejLjG-tWwRzbkzsKF3fL3zwdw=s96-c', NULL, '$2y$12$nPxTHY4NrptTK2ZpEPqnkOGTFOGol8jOFY57V/ki.5fwycjEyTS/W', NULL, NULL, NULL, NULL, NULL, '2026-08-21 17:20:14', '2026-08-21 17:20:14', 0.00, 0),
(238, 'Artha Charisa', 'arthacharisa@gmail.com', '102192132489844594624', '628563566922', 0, 'https://lh3.googleusercontent.com/a/ACg8ocLQGtw_dKkGW0h_dfp8H-Bs9OhirFw4YFuA6FfTSbiKjzKi-w=s96-c', NULL, '$2y$12$uR0V647YwUHUc9xgJvA4OOrsxXHv/.USr3B0A3k8lUKUYO3EEm5Tu', 'ARTHA CHARISA PUTRI', 'Asmah/G.22', '11 / XI', 'MA', NULL, '2026-08-21 17:31:26', '2026-08-21 17:34:42', 0.00, 0),
(239, 'Wafi wafa', 'wafiwafa6000@gmail.com', '115647115250301340818', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKUQVpguU1O1Typ9xJGpVWYqAaPjQA0lNGbzWw81wDt4Z17Ug=s96-c', NULL, '$2y$12$0ZtZ2uJLqBfu7ZNYVgTD0.9ZYzHBbei865VPRIReNilqlI5AO6V3y', NULL, NULL, NULL, NULL, NULL, '2026-08-21 17:41:37', '2026-08-21 17:41:37', 0.00, 0),
(240, 'Nanang Firmansyah', 'ulna980@gmail.com', '103387994103414762356', '6285259774848', 0, 'https://lh3.googleusercontent.com/a/ACg8ocJFpvzhyYpIBc4t_EH6eDFS464F6Q-8NIYOf_Qe78Ia-GgwWQ=s96-c', NULL, '$2y$12$PK9l92g5ezQhIKoVsYEFTOVBIV3qkCZrqn2vbtawPqUt3UwFf2Z7W', 'ULUF NUR YULINGGA LARASATI', 'ASMAH', '9 / IX', 'SMP', NULL, '2026-08-21 17:47:09', '2026-08-21 17:50:07', 0.00, 0),
(241, 'Prima Rasa', '123primarasa@gmail.com', '110118142110082520911', '6281351393886', 0, 'https://lh3.googleusercontent.com/a/ACg8ocJNN1uIP78Z0sQuSC2j4PVK_ZaHrrypsR6aondmkzbt-n-8UA=s96-c', NULL, '$2y$12$PxQxRPKmtrJvIX3lFoYBh.dR8PTwHod0sx8yh/2xSBi0dSom4DzYO', 'NAJWA MAULIDDA AZZAHRA SETYANI', 'Asmah/G 5', '8 / VIII', 'SMP', NULL, '2026-08-21 18:05:59', '2026-08-21 18:08:09', 0.00, 0),
(242, 'Eka Jaya', 'jayae496@gmail.com', '100655664744267307272', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLUNOYIfqVTFDo3oVvld4wVfCNw2HQgShfaLxv4CZiINHuLTA=s96-c', NULL, '$2y$12$ilhOFh0Oro6FA7xhAZjhIe8.X.j0PaCZ.QqFjqy1Af9/v1vkDmC1u', NULL, NULL, NULL, NULL, NULL, '2026-08-21 18:51:44', '2026-08-21 18:51:44', 0.00, 0),
(243, 'Basroni Punya', 'basroni281@gmail.com', '106796615709726723393', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocIBnimYfiiiHSKXDASdKD48ry3ik6xwMtTSJ-1ddjoJAgyd_Q=s96-c', NULL, '$2y$12$y5bzjSCQTJ/7P3gxouVo3.iKeeVR1TGNlbtA3tMTWlzaKd68R/43K', NULL, NULL, NULL, NULL, NULL, '2026-08-21 18:55:30', '2026-08-21 18:55:30', 0.00, 0),
(244, 'Qw Kediri', 'kediriqw@gmail.com', '115413799309303045451', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLPKgd_Q2exBSbwjAaOlLn1ItFWef-hSiQODcIBNKrvmMvDlQ=s96-c', NULL, '$2y$12$o4bvKTtc5P8/1VaegEAvKeDa5xv1hjU7/30ierlg7I7vNQk3V6u3a', NULL, NULL, NULL, NULL, NULL, '2026-08-21 19:10:48', '2026-08-21 19:10:48', 0.00, 0),
(245, 'mohammad luthfi', 'kangluthfi79@gmail.com', '106510269666965294811', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocLRVc3wXeFSdq5tsNO8bWLJovlvAn4Fj_4qxcLDm6mRWaNfyHuO=s96-c', NULL, '$2y$12$YKKZvaEjgXYtyl1xpsmODu0jPMCR4Qct/aPdYky1sh.xjNEz2tDBC', NULL, NULL, NULL, NULL, NULL, '2026-08-21 19:10:56', '2026-08-21 19:10:56', 0.00, 0),
(246, 'ENDAH NURDIANI', 'endahdiani02@gmail.com', '107910409826059740589', '6281334378498', 0, 'https://lh3.googleusercontent.com/a/ACg8ocIbQooFtrbCTd6yHGDy1BODBJ1mJpmGsO_yPIvdlitwLI2gH0RXVg=s96-c', NULL, '$2y$12$FtuPBpm2wlriLir7NDRa6u5xRB7HElLOh7GdXUCxsKHPC7fBn/PYi', 'AMIRA FARADISA AMANATULLAH', 'G.20', '11 / XI', 'MA', NULL, '2026-08-21 19:12:53', '2026-08-21 19:19:27', 0.00, 0),
(247, 'alya anisa', 'alyaanisa100@gmail.com', '110181255362412635946', '6282143368325', 0, 'https://lh3.googleusercontent.com/a/ACg8ocKwJjdY_LfbkeQH-LMM-K8yCqfejuW9R7ZJKdShcgUJ-UH8Eg=s96-c', NULL, '$2y$12$nmmp83KRqri9uTr.LYCOPe2y6gGtxb2YN775cK92de2.lZQNJHQEG', 'ALYA WASILLATURROHMAH', 'G8', '8 / VIII', 'SMP', NULL, '2026-08-21 19:19:41', '2026-08-21 19:21:34', 0.00, 0),
(248, 'Jihan Nadia', 'jihannadia0412@gmail.com', '102997723856220826320', '6282234753455', 0, 'https://lh3.googleusercontent.com/a/ACg8ocK3Df3Vtoz5N50-Bz8F4u2cVG7C7QFk7Yb67UShdYJnPWXSXw=s96-c', NULL, '$2y$12$Ua53ArFtZUNKLF4PG.OKDOcjEEqd8Y2D9TrC.LBKsRZVQ/QrqCzZa', 'JIHAN NADIA MUBARIKA', 'asmah/G 20', '11 / XI', 'MA', NULL, '2026-08-21 19:21:03', '2026-08-21 19:24:53', 0.00, 0),
(249, 'Putri Bunga Jameela', 'putribungajameela@gmail.com', '112484574453729634572', '6289696556460', 0, 'https://lh3.googleusercontent.com/a/ACg8ocKZIDJxLPR6Ira4FdB-VjPWhM531D6Nhu4twAiB19di3MwwCMo=s96-c', NULL, '$2y$12$Tab4ErFOrnd0VfwbiJO.I.5cuAJXpjFZKW7TTgshH1QDUSPUhtQNi', 'PUTRI BUNGA JAMEELA', 'G22', '12 / XII', 'MA', NULL, '2026-08-21 19:33:51', '2026-08-21 19:36:01', 0.00, 0),
(250, 'alisofiyan', 'alisofiyan02051961@gmail.com', '101778573789121089878', '6281515299769', 0, 'https://lh3.googleusercontent.com/a/ACg8ocL1z6lth2IsLGwDQUto10Y9NWz3YYoML3qeKi_cGleyXhX9xA=s96-c', NULL, '$2y$12$MHLYIBM3cW00rvG4DTGP9e1bKAFr2DYtIQaETzQIh0velXaVZTSEO', 'JAUHAROTU SULUSUL LAIL', 'Asrama asmah /G6', '11 / XI', 'MA', NULL, '2026-08-21 19:41:33', '2026-08-21 19:56:07', 0.00, 0),
(251, 'Sappn Aa', 'sappnaa026@gmail.com', '112541618070396073242', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocJqspsMvsdaDE4u1cXjGyIgiT1FTvioX6-q_UQVcUG_DbY9xA=s96-c', NULL, '$2y$12$hGLOviaXF3NY4enyJ0a.XuA3xImOVUwE/w4L/aK49YLc64qZgCnxS', NULL, NULL, NULL, NULL, NULL, '2026-08-21 19:45:27', '2026-08-21 19:45:27', 0.00, 0),
(252, 'Akhyar Rosidi', 'akhyar.rosidi.scm@gmail.com', '118069557280908211946', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKAugvZLNVpfEIQFlxdzmSvBpuiD037DuEzLf_9KZG5chcpYw=s96-c', NULL, '$2y$12$QY24zEoYVivZQrylcp9ifOTVaZL9.a6mY2Tm.apKLm/V.4nT9rV8C', NULL, NULL, NULL, NULL, NULL, '2026-08-21 19:45:47', '2026-08-21 19:45:47', 0.00, 0),
(253, 'sika', 'sika82483@gmail.com', '109407751303393689309', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocIHJGgjtDqUYnLXedqF3DeqAv2SfLAEWFQ7cAu8lfIQue38bw=s96-c', NULL, '$2y$12$zabiLHiFGpR.rYJjoFMVjejSvZGq9CCAF9tHa749rcBMucY.d4aJO', 'SYIKA ZAHWA MAULIDIYYA', 'ASMAH', '12 / XII', 'MA', NULL, '2026-08-21 19:52:12', '2026-08-21 19:53:50', 0.00, 0),
(254, 'Muyanto Anto', 'muyantoanto92@gmail.com', '112732752424143425072', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocJ1tSYNb1lmGvegljrLzzOSuxHMaxE_IlwBNWNRppiy8gq6Sg=s96-c', NULL, '$2y$12$.s5Jcuhknxe35tgs8DGwbezxPGHCKvfUA01LEZU3fdyqbvU1jyQbu', NULL, NULL, NULL, NULL, NULL, '2026-08-21 19:53:18', '2026-08-21 19:53:18', 0.00, 0),
(255, 'Nurmai ulfa', 'nurmai051@gmail.com', '117867819515661863667', '6285645211429', 0, 'https://lh3.googleusercontent.com/a/ACg8ocI4mXyJ8vPdTlinAem-jzN0ULauM-bOH-3eXN68gfJguKVDyw=s96-c', NULL, '$2y$12$5q9Qfh21zw1j7djL25nWLOqpxw5z5AaO8Ef..gttQCzwxsJBqQfmG', 'HANIFATU ZAKIYAH', 'ASMAH', '12 / XII', 'MA', NULL, '2026-08-21 20:11:20', '2026-08-21 20:16:06', 0.00, 0),
(256, 'andriesta prastyana1981', 'andriestaoke1981@gmail.com', '109107190161165360515', NULL, 0, 'https://lh3.googleusercontent.com/a/ACg8ocISGipoHuFZffy0M4guLjfC_-iNiY9RPbGRUiLKkuVrk9gCnw=s96-c', NULL, '$2y$12$SNMwg1kcMe.yb8Qq7GQYD..5.T5G4gWHsOFe1pn/MShXtjnlwUQV2', NULL, NULL, NULL, NULL, NULL, '2026-08-21 20:36:49', '2026-08-21 20:36:49', 0.00, 0),
(257, 'Fahim Sayidah', 'fahim.sayidah@gmail.com', '102752845642571248324', '6285853446071', 0, 'https://lh3.googleusercontent.com/a/ACg8ocJROuRnPfy--9iaEuDIl4bnNPvkBK44x2pCE4ANXc0880cGOA=s96-c', NULL, '$2y$12$8HQ0o.b2lIbxbmdKxY8DCeOoLVi79LvA0JoCDskxWtg/3ACawmK16', 'AINUN NIDA SHOFIYA', 'Asmah G17', '10 / X', 'MA', NULL, '2026-08-21 20:42:21', '2026-08-21 20:43:48', 0.00, 0);

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=829;

--
-- AUTO_INCREMENT for table `canteens`
--
ALTER TABLE `canteens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=624;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=258;

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
