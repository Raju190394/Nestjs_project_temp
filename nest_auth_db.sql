-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 08, 2026 at 02:18 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nest_auth_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `refreshtoken`
--

CREATE TABLE `refreshtoken` (
  `id` varchar(191) NOT NULL,
  `token` varchar(500) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `refreshtoken`
--

INSERT INTO `refreshtoken` (`id`, `token`, `userId`, `expiresAt`, `createdAt`) VALUES
('157e55c5-ff37-4ac4-b8a8-d1a901c896fc', '$2b$10$zzRlA3gbycRHLikJc1XRM.QK/YFl3RfdBGDyWh2mdxHcfhVwwGWVm', '6e5bb0b2-284d-4399-98bc-e20c83b23622', '2026-01-15 13:12:35.160', '2026-01-08 13:12:35.161');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `firstName` varchar(191) DEFAULT NULL,
  `lastName` varchar(191) DEFAULT NULL,
  `role` enum('USER','ADMIN') NOT NULL DEFAULT 'USER',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `firstName`, `lastName`, `role`, `createdAt`, `updatedAt`) VALUES
('6e5bb0b2-284d-4399-98bc-e20c83b23622', 'admin@nexus.com', '$2b$10$Lt79zufaqFJb7mw0rap0TecjY/BOjGsGbI8Vm/nzqm5xF8/MK4HPO', 'System', 'Admin', 'ADMIN', '2026-01-08 12:49:42.124', '2026-01-08 12:49:42.124'),
('a114c449-b482-4dc4-b374-6fc1fbe810af', 'admin@email.com', '$2b$10$HchgK8X2bCb9aMzOAkz8b.B1zCsz4Dv1lQ/fQwSgZtorI3Ez1IJ5a', 'Romanchal', 'Nayak', 'ADMIN', '2026-01-08 13:10:54.872', '2026-01-08 13:11:08.558');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('596f86fd-f757-42b8-b91e-8ee5e1f7245d', '9ee7aaa0fd6edca339214a862d06444992a25775c1088eb1a18abe299142468a', '2026-01-08 12:49:37.619', '20260108124937_init', NULL, NULL, '2026-01-08 12:49:37.509', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `refreshtoken`
--
ALTER TABLE `refreshtoken`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `RefreshToken_token_key` (`token`),
  ADD KEY `RefreshToken_userId_idx` (`userId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`),
  ADD KEY `User_email_idx` (`email`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `refreshtoken`
--
ALTER TABLE `refreshtoken`
  ADD CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
