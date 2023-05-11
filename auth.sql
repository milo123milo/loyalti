-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 11, 2023 at 04:31 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `auth`
--

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `name` text DEFAULT NULL,
  `discount` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `pib` int(11) DEFAULT NULL,
  `address` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `name`, `discount`, `type`, `pib`, `address`) VALUES
(2, 'Jane Doe', 15, 'Kasa', 987654321, '456 Second St'),
(3, 'Bob Johnson', 5, 'Kasa', 555555555, '789 Third St'),
(323050, 'Marko', 5, 'Kasa', 123123, 'bb'),
(423051, 'asdasd', 10, 'Faktura', 12, '12'),
(523050, '123', 7, 'Kasa', 0, 'a');

--
-- Triggers `clients`
--
DELIMITER $$
CREATE TRIGGER `auto_id` BEFORE INSERT ON `clients` FOR EACH ROW BEGIN
    DECLARE ordinal INT;
    DECLARE year CHAR(2);
    DECLARE month CHAR(2);
    DECLARE type_num INT;
    
    SET ordinal = (SELECT COUNT(*) + 1 FROM clients);
    SET year = DATE_FORMAT(CURDATE(), '%y');
    SET month = DATE_FORMAT(CURDATE(), '%m');
    
    IF NEW.type = 'faktura' THEN
        SET type_num = 1;
    ELSEIF NEW.type = 'kasa' THEN
        SET type_num = 0;
    END IF;
    
    SET NEW.id = CONCAT(ordinal, year, month, type_num);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `receiptitems`
--

CREATE TABLE `receiptitems` (
  `ID` int(11) NOT NULL,
  `ReceiptID` int(11) DEFAULT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Quantity` decimal(10,2) DEFAULT NULL,
  `Unit` varchar(255) DEFAULT NULL,
  `PricePerPiece` decimal(10,2) DEFAULT NULL,
  `PriceTotal` decimal(10,2) DEFAULT NULL,
  `PriceTotalVAT` decimal(10,2) DEFAULT NULL,
  `Discount` decimal(5,2) DEFAULT NULL,
  `Total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `receiptitems`
--

INSERT INTO `receiptitems` (`ID`, `ReceiptID`, `Name`, `Quantity`, `Unit`, `PricePerPiece`, `PriceTotal`, `PriceTotalVAT`, `Discount`, `Total`) VALUES
(1, 12, 'Item A', '2.00', 'pcs', '10.00', '20.00', '24.20', '0.00', '24.20'),
(2, 12, 'Item B', '1.00', 'kg', '5.50', '5.50', '6.61', '5.00', '6.28'),
(3, 12, 'Item C', '3.00', 'm', '1.20', '3.60', '4.34', '10.00', '3.91'),
(4, 12, 'Item D', '4.00', 'pcs', '3.75', '15.00', '18.15', '0.00', '18.15'),
(5, 12, 'Item E', '2.00', 'kg', '7.50', '15.00', '18.15', '2.50', '17.68'),
(6, 22, 'Item F', '1.00', 'pc', '50.00', '50.00', '60.50', '15.00', '51.43'),
(7, 22, 'Item G', '2.00', 'pcs', '6.25', '12.50', '15.13', '5.00', '14.37'),
(8, 22, 'Item H', '5.00', 'm', '1.80', '9.00', '10.89', '0.00', '10.89'),
(9, 22, 'Item I', '3.00', 'kg', '4.25', '12.75', '15.43', '2.00', '15.13'),
(10, 34, 'Item J', '1.00', 'pc', '100.00', '100.00', '121.00', '20.00', '96.80'),
(11, 34, 'Item K', '2.00', 'pcs', '8.50', '17.00', '20.57', '0.00', '20.57'),
(12, 34, 'Item L', '4.00', 'm', '2.00', '8.00', '9.68', '8.00', '8.91'),
(13, 34, 'Item M', '3.00', 'kg', '3.50', '10.50', '12.70', '5.00', '12.07'),
(14, 34, 'Item N', '2.00', 'pcs', '7.75', '15.50', '18.73', '0.00', '18.73'),
(15, 34, 'Item O', '1.00', 'pc', '75.00', '75.00', '90.75', '10.00', '81.68'),
(31, 746041641, 'ESPRESSO', '1.00', 'KOM', '1.12', '1.12', '1.20', '7.00', '1.12'),
(32, 756468597, 'CAPUCCINO', '1.00', 'Komad', '1.24', '1.24', '1.50', '7.00', '1.40'),
(33, 756468597, 'ESPRESSO', '1.00', 'Komad', '1.12', '1.12', '1.20', '7.00', '1.12');

-- --------------------------------------------------------

--
-- Table structure for table `receipts`
--

CREATE TABLE `receipts` (
  `ID` int(11) NOT NULL,
  `IIC` text DEFAULT NULL,
  `Date` datetime DEFAULT NULL,
  `Total` decimal(10,2) DEFAULT NULL,
  `TotalVAT` decimal(10,2) DEFAULT NULL,
  `Discount` decimal(5,2) DEFAULT NULL,
  `TotalDiscounted` decimal(10,2) GENERATED ALWAYS AS (`TotalVAT` - `TotalVAT` * (`Discount` / 100)) STORED,
  `ClientID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `receipts`
--

INSERT INTO `receipts` (`ID`, `IIC`, `Date`, `Total`, `TotalVAT`, `Discount`, `ClientID`) VALUES
(12, 'A123', '2022-04-30 10:30:00', '100.00', '120.00', '10.00', 2),
(22, 'B456', '2022-05-01 15:45:00', '75.50', '90.60', '5.00', 2),
(34, 'C789', '2022-05-02 12:00:00', '200.00', '240.00', '0.00', 2),
(41, 'D012', '2022-05-02 13:30:00', '50.00', '60.00', '8.00', 2),
(54, 'E345', '2022-05-02 16:15:00', '150.00', '180.00', '15.00', 2),
(746041641, 'E3E96EA24AA7FECA263DE5E6E938FB64', '2023-04-24 11:38:43', '1.12', '1.20', '7.00', 523050),
(756468597, '9623B061BA18D72926216173C080892E', '2023-05-03 14:59:05', '2.23', '2.70', '7.00', 523050);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` text DEFAULT NULL,
  `password` text DEFAULT NULL,
  `role` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `password`, `role`) VALUES
(24, 'admin', 'admin', 'admin'),
(26, 'user', 'user', 'user'),
(27, 'root', 'root', 'root');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `receiptitems`
--
ALTER TABLE `receiptitems`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ReceiptID` (`ReceiptID`);

--
-- Indexes for table `receipts`
--
ALTER TABLE `receipts`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ClientID` (`ClientID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=523051;

--
-- AUTO_INCREMENT for table `receiptitems`
--
ALTER TABLE `receiptitems`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `receiptitems`
--
ALTER TABLE `receiptitems`
  ADD CONSTRAINT `receiptitems_ibfk_1` FOREIGN KEY (`ReceiptID`) REFERENCES `receipts` (`ID`);

--
-- Constraints for table `receipts`
--
ALTER TABLE `receipts`
  ADD CONSTRAINT `receipts_ibfk_1` FOREIGN KEY (`ClientID`) REFERENCES `clients` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
