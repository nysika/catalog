-- phpMyAdmin SQL Dump
-- version 4.4.6.1
-- http://www.phpmyadmin.net
--
-- Хост: irbis.shared
-- Время создания: Сен 05 2018 г., 14:34
-- Версия сервера: 10.1.30-MariaDB
-- Версия PHP: 5.4.45-pl0-gentoo

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;



-- --------------------------------------------------------

--
-- Структура таблицы `categories`
--

CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `description` text NOT NULL,
  `created` datetime NOT NULL,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `created`, `modified`) VALUES
(1, 'Fashion', 'Category for anything related to fashion.', '2014-06-01 00:35:07', '2014-05-30 13:34:33'),
(2, 'Electronics', 'Gadgets, drones and more.', '2014-06-01 00:35:07', '2014-05-30 13:34:33'),
(3, 'Motors', 'Motor sports and more', '2014-06-01 00:35:07', '2014-05-30 13:34:54'),
(5, 'Movies', 'Movie products.', '0000-00-00 00:00:00', '2016-01-08 10:27:26'),
(6, 'Books', 'Kindle books, audio books and more.', '0000-00-00 00:00:00', '2016-01-08 10:27:47'),
(13, 'Sports', 'Drop into new winter gear.', '2016-01-09 02:24:24', '2016-01-08 22:24:24');

-- --------------------------------------------------------

--
-- Структура таблицы `products`
--

CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL,
  `name` varchar(32) CHARACTER SET utf8 NOT NULL,
  `description` text CHARACTER SET utf8 NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `created` datetime NOT NULL,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `created`, `modified`) VALUES
(1, 'LG P880 4X HD', 'My first awesome phone!', '336', '2014-06-01 01:12:26', '2014-05-31 13:12:26'),
(2, 'Google Nexus 4', 'The most awesome phone of 2013!', '299', '2014-06-01 01:12:26', '2014-05-31 13:12:26'),
(3, 'Samsung Galaxy S4', 'How about no?', '600', '2014-06-01 01:12:26', '2014-05-31 13:12:26'),
(6, 'Bench Shirt', 'The best shirt!', '29', '2014-06-01 01:12:26', '2014-05-30 22:12:21'),
(7, 'Lenovo Laptop', 'My business partner.', '399', '2014-06-01 01:13:45', '2014-05-30 22:13:39'),
(8, 'Samsung Galaxy Tab 10.1', 'Good tablet.', '259', '2014-06-01 01:14:13', '2014-05-30 22:14:08'),
(9, 'Spalding Watch', 'My sports watch.', '199', '2014-06-01 01:18:36', '2014-05-30 22:18:31'),
(10, 'Sony Smart Watch', 'The coolest smart watch!', '300', '2014-06-06 17:10:01', '2014-06-05 14:09:51'),
(11, 'Huawei Y300', 'For testing purposes.', '100', '2014-06-06 17:11:04', '2014-06-05 14:10:54'),
(12, 'Abercrombie Lake Arnold Shirt', 'Perfect as gift!', '60', '2014-06-06 17:12:21', '2014-06-05 14:12:11'),
(13, 'Abercrombie Allen Brook Shirt', 'Cool red shirt!', '70', '2014-06-06 17:12:59', '2014-06-05 14:12:49');

-- --------------------------------------------------------

--
-- Структура таблицы `product_has_category`
--

CREATE TABLE IF NOT EXISTS `product_has_category` (
  `product_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `product_has_category`
--

INSERT INTO `product_has_category` (`product_id`, `category_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 2),
(2, 5),
(3, 1),
(3, 6),
(6, 5),
(6, 13),
(7, 2),
(8, 6),
(9, 1),
(9, 2),
(9, 6),
(10, 1),
(10, 5),
(10, 6),
(11, 5),
(12, 1),
(12, 5),
(12, 13),
(13, 2),
(13, 3);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `product_has_category`
--
ALTER TABLE `product_has_category`
  ADD PRIMARY KEY (`product_id`,`category_id`) USING BTREE,
  ADD KEY `fk_product_has_category_category_id` (`category_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT для таблицы `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=114;
--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `product_has_category`
--
ALTER TABLE `product_has_category`
  ADD CONSTRAINT `fk_product_has_category_category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_product_has_category_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
