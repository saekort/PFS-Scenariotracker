-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 29, 2015 at 04:49 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `scenariotracker`
--

--
-- Dumping data for table `authors`
--

INSERT INTO `authors` (`id`, `name`, `created_on`, `updated_on`, `deleted`) VALUES
(1, 'Michael Kortes', '2015-05-26 13:01:56', '2015-05-26 13:01:56', NULL),
(2, 'Tim Hitchcock', '2015-05-26 13:01:56', '2015-05-26 13:01:56', NULL),
(3, 'Greg A. Vaughan', '2015-05-26 13:01:56', '2015-05-26 13:01:56', NULL),
(4, 'Craig Shackleton', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(5, 'Nicolas Logue', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL);

--
-- Dumping data for table `scenarios`
--

INSERT INTO `scenarios` (`id`, `name`, `description`, `type`, `season`, `number`, `tier`, `evergreen`, `archived`, `created_on`, `updated_on`, `deleted`, `author_id`) VALUES
(1, 'Silent Tide', 'When strange reports of misty undead spread through Absalom, you and your fellow Pathfinders are dispatched to the half-drowned district of Puddles. Notoriously rough, the drooling addicts, flesh panderers, and quick-handed knifers of Puddles are the least of your worries. The night''s tide brings with it an ancient armada of some long-forgotten war and you are the only thing between their mist-shrouded ghost fleet and Absalom''s utter oblivion.', 'scenario', '0', '1', '1-5', 0, NULL, '2015-05-26 13:01:56', '2015-05-26 13:01:56', NULL, 1),
(2, 'The Hydra''s Fang Incident', 'After an Andoren village is razed by the Hydra''s Fang, a renegade Chelish slaver-ship, outrage threatens the stability of both nations. You and your fellow Pathfinders are sent to capture the Fang before the Inner Sea is pitched into political frenzy.', 'scenario', '0', '2', '1-5', 0, NULL, '2015-05-26 13:01:56', '2015-05-26 13:01:56', NULL, 2),
(3, 'Murder on the Silken Caravan', 'Volunteers are needed to escort the body of a deceased venture-captain across the parched Qadiran desert to Katheer. The Silken Caravan offers passage, hauling exotic treasures across the perilous sea of sands. You''ll brave bandits, spies, and unwelcome mourners hell-bent on paying respects to your dead companion. Worse still, the caravan''s mistress, a satin-swathed Qadiran princess, has designs of her own on you and your cargo.', 'scenario', '0', '3', '1-5', 0, NULL, '2015-05-26 13:01:56', '2015-05-26 13:01:56', NULL, 3),
(4, 'The Frozen Fingers of Midnight', 'Skelg the Ripper, envoy from the Land of the Linnorm Kings, lies wasting in his villa on the outskirts of Absalom. A frigid curse followed Skelg from his northern homeland and grips his bearish heart in its frosty embrace. As the bizarre freezing ailment pushes Skelg to the brink of death, the Society dispatches you and your fellow Pathfinders to uncover the secrets of the freezing curse before Absalom falls to its icy grip.', 'scenario', '0', '4', '1-5', 0, NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL, 4),
(5, 'Mists of Mwangi', 'Pathfinder Lugizar Trantos recently returned from the Mwangi Expanse with haunted eyes and a pack full of strange idols. Absalom''s famed Blakros Museum purchased his pieces and Lugizar vanished. The strange monkey idols he pulled from the misty jungles of Mwangi carry with them a fell curse, and now their power has laid claim to the museum. Can the Pathfinder Society uncover the source of the curse in time, or will the Blackros Museum be forever lost to the mists of Mwangi?', 'scenario', '0', '5', '1-5', 0, NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL, 5);

--
-- Dumping data for table `subtiers`
--

INSERT INTO `subtiers` (`id`, `name`, `created_on`, `updated_on`, `deleted`) VALUES
(1, '1', '2015-05-26 13:01:56', '2015-05-26 13:01:56', NULL),
(2, '1-2', '2015-05-26 13:01:56', '2015-05-26 13:01:56', NULL),
(3, '3-4', '2015-05-26 13:01:56', '2015-05-26 13:01:56', NULL),
(4, '4-5', '2015-05-26 13:01:56', '2015-05-26 13:01:56', NULL),
(5, '5-6', '2015-05-26 13:01:56', '2015-05-26 13:01:56', NULL),
(6, '6-7', '2015-05-26 13:01:56', '2015-05-26 13:01:56', NULL),
(7, '7', '2015-05-26 13:01:56', '2015-05-26 13:01:56', NULL),
(8, '7-8', '2015-05-26 13:01:56', '2015-05-26 13:01:56', NULL),
(9, '8-9', '2015-05-26 13:01:56', '2015-05-26 13:01:56', NULL),
(10, '10-11', '2015-05-26 13:01:56', '2015-05-26 13:01:56', NULL),
(11, '12', '2015-05-26 13:01:56', '2015-05-26 13:01:56', NULL);
