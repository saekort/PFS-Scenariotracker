-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jun 26, 2015 at 03:20 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET FOREIGN_KEY_CHECKS=0;
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
(5, 'Nicolas Logue', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(6, 'Eileen Connors', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(7, 'Tim Connors', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(8, 'Joshua J. Frost', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(9, 'Lou Agresta', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(10, 'Jonathan H. Keith', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(11, 'Matthieu Dayon', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(12, 'Larry Wilhelm', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(13, 'Steven Robert', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(14, 'James F. MacKenzie', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(15, 'Elizabeth Leib', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(16, 'Christopher Self', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(17, 'Shane Cottom', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(18, 'Steven T. Helt', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(19, 'Clinton J. Boomer', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(20, 'Alison McKenzie', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(21, 'Craig Campbell', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(22, 'Benjamin Wenham', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(23, 'C. Robert Brown', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL);

--
-- Dumping data for table `j_author_scenario`
--

INSERT INTO `j_author_scenario` (`scenario_id`, `author_id`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

--
-- Dumping data for table `j_scenario_subtier`
--

INSERT INTO `j_scenario_subtier` (`id`, `scenario_id`, `subtier_id`) VALUES
(1, 1, 4),
(2, 1, 2);

--
-- Dumping data for table `people`
--

INSERT INTO `people` (`id`, `name`, `pfsnumber`, `created_on`, `updated_on`, `deleted`) VALUES
(1, 'Simon', 25642, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL);

--
-- Dumping data for table `scenarios`
--

INSERT INTO `scenarios` (`id`, `name`, `description`, `type`, `season`, `number`, `tier`, `evergreen`, `archived`, `created_on`, `updated_on`, `deleted`) VALUES
(1, 'Silent Tide', 'When strange reports of misty undead spread through Absalom, you and your fellow Pathfinders are dispatched to the half-drowned district of Puddles. Notoriously rough, the drooling addicts, flesh panderers, and quick-handed knifers of Puddles are the least of your worries. The night''s tide brings with it an ancient armada of some long-forgotten war and you are the only thing between their mist-shrouded ghost fleet and Absalom''s utter oblivion.', 'scenario', '0', '1', '1-5', 0, NULL, '2015-05-26 13:01:56', '2015-05-26 13:01:56', NULL),
(2, 'The Hydra''s Fang Incident', 'After an Andoren village is razed by the Hydra''s Fang, a renegade Chelish slaver-ship, outrage threatens the stability of both nations. You and your fellow Pathfinders are sent to capture the Fang before the Inner Sea is pitched into political frenzy.', 'scenario', '0', '2', '1-5', 1, NULL, '2015-05-26 13:01:56', '2015-05-26 13:01:56', NULL),
(3, 'Murder on the Silken Caravan', 'Volunteers are needed to escort the body of a deceased venture-captain across the parched Qadiran desert to Katheer. The Silken Caravan offers passage, hauling exotic treasures across the perilous sea of sands. You''ll brave bandits, spies, and unwelcome mourners hell-bent on paying respects to your dead companion. Worse still, the caravan''s mistress, a satin-swathed Qadiran princess, has designs of her own on you and your cargo.', 'scenario', '0', '3', '1-5', 0, NULL, '2015-05-26 13:01:56', '2015-05-26 13:01:56', NULL),
(4, 'The Frozen Fingers of Midnight', 'Skelg the Ripper, envoy from the Land of the Linnorm Kings, lies wasting in his villa on the outskirts of Absalom. A frigid curse followed Skelg from his northern homeland and grips his bearish heart in its frosty embrace. As the bizarre freezing ailment pushes Skelg to the brink of death, the Society dispatches you and your fellow Pathfinders to uncover the secrets of the freezing curse before Absalom falls to its icy grip.', 'scenario', '0', '4', '1-5', 0, NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(5, 'Mists of Mwangi', 'Pathfinder Lugizar Trantos recently returned from the Mwangi Expanse with haunted eyes and a pack full of strange idols. Absalom''s famed Blakros Museum purchased his pieces and Lugizar vanished. The strange monkey idols he pulled from the misty jungles of Mwangi carry with them a fell curse, and now their power has laid claim to the museum. Can the Pathfinder Society uncover the source of the curse in time, or will the Blackros Museum be forever lost to the mists of Mwangi?', 'scenario', '0', '5', '1-5', 0, NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(6, 'Black Waters', 'The Pathfinder Society seeks the ancient ruby ring of the salamander and it falls to a team of Pathfinders to find it. Last seen in the Tri-Towers Yard, a once elite academy for the youth of Absalom, the ruby ring is now lost in the Drownyard, all that remains of Tri-Towers after it was destroyed a decade ago in the great quake. The Pathfinders must risk the strange black ichors and salty brine to find their prize—will they risk their very souls as well?', 'scenario', '0', '6', '1-5', 0, NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(7, 'Among the Living', 'Famed Pathfinder Bodriggan Wuthers disappeared from his dig site beneath the House of the Immortal Son in Taldor''s gilded capital of Oppara. Once a grand temple to Aroden, the Immortal Son is now Oppara''s most opulent theater. Sent to locate Wuthers, the Pathfinders must attend an opera with members of the Oppara elite in order to gain access to the secretive theater''s dig site. When a cult crashes the performance and the nobility change into hideous walking dead, the Pathfinders are forced to choose between finding Wuthers or saving themselves.', 'scenario', '0', '7', '1-7', 0, NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(8, 'Slave Pits of Absalom', 'Someone kidnapped Lady Anilah Salhar—the Chelish wife of Dremdhet Salhar, one of Osirion''s many Grand Ambassadors to Absalom—and sold her into slavery. With Salhar holding delve permits over the heads of the Decemvirute, the Pathfinders are sent to assist the Osirian Ambassador. Venturing into Absalom''s darkest corners to save Lady Anilah, the Pathfinders must face the secrets of the Slave Pits to avoid becoming slaves themselves.', 'scenario', '0', '8', '1-5', 0, NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(9, 'Eye of the Crocodile King', 'Arcanamirium transmuter Maren Fuln found a magically sealed amulet in the school''s library and kept it as a shiny bauble. Little did he know the amulet contained an entity far worse than he imagined, and by unsealing it, he loosed a revenge-obsessed horror into the sewers beneath the school. Can the Pathfinder Society halt the beast’s plan in time, or will he build his army of revenge and sow chaos in Absalom?', 'scenario', '0', '9', '1-5', 0, '2010-05-24 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(10, 'Blood at Dralkard Manor', 'Venture-Captain Juberto Savarre plans to retire soon, and he’s set his sights on spooky Dralkard Manor in southern Andoran. With the locals swapping tales of hauntings and missing persons, Savarre sends Pathfinders in to uncover the truth. Are the stories just tall tales or will the Pathfinders find themselves drenched in blood at Dralkard Manor?', 'scenario', '0', '10', '1-7', 0, '2010-03-29 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(11, 'The Third Riddle', 'When Pathfinder Colm Safan entered the Nethys-linked heart of the fabled dungeon known as the Ravenous Sphinx, the Pathfinder Society expected to solve one of Osirion''s greatest riddles. Months passed with no word from Safan, and you and your fellow Pathfinders find yourselves dispatched into the desolate wastes of Osirion''s notorious Parched Dunes to find the sphinx, find Safan, and uncover the mystery he sought. With a band of cloaked riders on your trail and a trap-filled dungeon ahead, will you solve the third riddle before time runs out?', 'scenario', '0', '11', '1-5', 0, '2010-11-15 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(12, 'Stay of Execution', 'When a petty thief named Hadge gets a lucky break and makes off with a powerful divination focus of the Pathfinder Society''s masked leadership, you and your fellow Pathfinders set out to the sparsely populated Taldor frontier to find him and recover the focus. When the local governor tosses Hadge into the brutal Porthmos Prison for a minor crime, your mission suddenly becomes a jail break. Will you free Hadge and uncover the location of the focus before the gangs of Porthmos tear him apart?', 'scenario', '0', '12', '1-7', 0, '2010-11-15 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(13, 'The Prince of Augustana', 'When an old beggar shows up filthy and injured on the doorstep of the Augustana Pathfinder Lodge in Andoran and demands to be recognized as Andoran''s one true Emperor, Venture-Captain Wallace is inclined to chase him off. But when the old beggar reveals a wayfinder and tells a tale of demons and portals to another world beneath the streets of Augustana, Wallace summons you from Absalom to investigate. Will you make it through sewers, swarms, and sanctuaries to uncover the truth or will the dangers of the Augustana underworld consume you forever?', 'scenario', '0', '13', '1-5', 0, NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(14, 'The Many Fortunes of Grandmaster Torch', 'When four statues of unspeakable power were found in a tomb in Osirion and then stolen, the Pathfinder Society assumed they were gone forever. When they appeared again in the illicit inventory of a Qadiran smuggler in the massive trade city of Sedeq, the Society wasted little time dispatching you there to recover them. Finding the smuggler dead and a familiar face from Absalom responsible, your task quickly becomes a race to retrieve the statues before their brutal power can be unleashed on the citizens of the Satrap. Can you find the statues in time or will Sedeq be swallowed in a plague like none Golarion has ever seen?', 'scenario', '0', '14', '1-7', 0, NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(15, 'The Asmodeus Mirage', 'Appearing only once a century in the western deserts of Katapesh, the Asmodeus Mirage has plagued Golarion for thousands of years. Powered by a crystal bone devil skeleton and legendary for trapping unwary travelers, the Society has a vested interest in studying and cataloging the source of its power. You have been sent deep into the deserts of northern Garund to enter the Mirage—but there''s a catch! The Mirage only exists on Golarion for 24 hours every 100 years. Get trapped in the Mirage, and you may never see Golarion again.', 'scenario', '0', '15', '1-7', 0, '2010-03-29 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(16, 'To Scale the Dragon', 'The last remains of a sage from an age long past rests high atop the snow-covered tips of the Fog Peaks in Southern Galt and the Society wants his bones in order to study them and learn from them. They''ve sent you into a wintry wilderness of primordial beastmen and snow creatures not seen below the snow line to do just that. With the Aspis Consortium also seeking the bones, the race is on to beat them to the top and, once the bones are recovered, to make it back down alive.', 'scenario', '0', '16', '5-9', 0, NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(17, 'Perils of the Pirate Pact', 'When the Black Marquis lost all of the men he could trust on a failed treasure hunt, he did the only thing he could: turned to the Pathfinder Society for help. Offering an ancient lost text in return for assistance, the Black Marquis of Deadbridge sends you deep into the spider-haunted Echo Wood of the River Kingdoms to track down his missing pirates and recover an ancient treasure for the Society. You''ll face brigands, pirates, spiders and more—but will you survive the perils of the Pirate Pact?', 'scenario', '0', '17', '1-7', 0, NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(18, 'The Trouble with Secrets', 'Decades ago, an Osiriani Pathfinder named Bossell locked his transformed lover in the vaults beneath the Sothis Pathfinder Lodge. He then vowed that no one would ever discover his secret shame. The old and senile Bossell now relies on his assistant Fendel for everything, and the hapless assistant has disapeared into the vaults after reading his master''s journal. You''ve been sent beneath the Lodge to destroy whatever it is that Bossell''s lover has become—will you survive his secret or find yourself transformed as well?', 'scenario', '0', '18', '5-9', 1, '2010-05-24 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(19, 'Skeleton Moon', 'When Pathfinder alchemist Andrax d''Aponte contracted a mysterious wasting sickness, he set his mind to feverishly researching the disease and its cures. With the rare skeleton moon hanging in the sky above Absalom, the Decemvirate sends you to an ancient siege castle outside the city to recover d''Aponte''s research notes and inquire about his involvement in recent Pathfinder deaths in Osirion. What you find, however, is a man changed by madness and paralyzed by paranoia and fear. Will you survive the night of the skeleton moon?', 'scenario', '0', '19', '1-7', 0, '2010-11-15 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(20, 'King Xeros of Old Azlant', 'Panic grips Absalom when a huge crystalline sailing vessel appears suddenly in the harbor. Identified as the King Xeros of Old Azlant, the ship presents a great opportunity for the Pathfinder Society. You and your fellow adventurers are summoned by Venture-Captain Adril Hestram and dropped aboard the King Xeros to explore it and report back. Only, what you find isn''t an empty vessel, but a sinister ship with a vile intent.', 'scenario', '0', '20', '7-11', 0, NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(21, 'The Eternal Obelisk', 'When the Pathfinder-obsessed daughter of one Qadira''s most powerful trade princes goes missing trying to impress the Society, her father angrily demands the Pathfinders track her down or face expulsion from Katheer. Tracking the missing princess leads you to an underground complex filled with traps, tricks, and a creature so powerful, she''s lived for a thousand years. Can you save the princess and uncover the power of the Eternal Obelisk?', 'scenario', '0', '21', '5-9', 0, '2010-05-24 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(22, 'Fingerprints of the Fiend', 'When a retired Pathfinder''s nephew goes missing after allegedly discovered the fabled city of Rachikan of the ancient Jistka Imperium, he turns to the Society for help. Now you''ve been sent to the coast of devil-tainted Cheliax to uncover the missing nephew''s whereabouts and to, quite possibly, uncover one of the most sought-after legendary cities on Golarion. But you have to move quick! The Aspis Consortium is rumored to be racing to the site ahead of you and their involvement could spell disaster for the Pathfinder Society.', 'scenario', '0', '22', '7-11', 0, NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(23, 'Tide of Morning', 'Venture-Captain Dennel Hamshanks sends you to convince an Andoren druid named Hemzel to allow the Pathfinder Society to study his recently discovered lorestone, a minor magical item that unlocks some of the mysteries of the ancient Andoren druid circles. When you arrive and find Hemzel murdered and the lorestone missing, you must race against time to recover the lorestone and stop Hemzel''s murderers from using it against the druids of Andoran.', 'scenario', '0', '23', '1-5', 0, NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(24, 'Decline of Glory', 'When the son of a famous Pathfinder gains control of his father''s holdings in Taldor, the Pathfinder Society decides to build a new lodge there as a base to explore the many ruins of that crumbling empire. Unfortunately, the Taldan Phalanx has its eye on the holdings and an ancient curse has turned many of the residents into the walking dead. Can you survive the tangled web of Taldor''s politics and fight off the echoes of the past or will you, too, see your glory decline?', 'scenario', '0', '24', '1-7', 0, NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(25, 'Hands of the Muted God', 'When the man who would be the Muted God wordlessly stepped beyond the gates of the Starstone''s Cathedral, his thousand and one faithful ringing the Ascendant Court watched with the silent contemplation that is their highest sacrament. When he failed to emerge, many of his penitents abandoned their vows but a small sect remained loyal and worshipful. You and your fellow Pathfinders are sent into the mountains north of Absalom to follow the path of a doomed party and uncover the secrets of the Muted God. His loyal band of followers, called the Hand, will stop at nothing to keep you away from their shrine—even forming an alliance with some of Golarion''s most evil denizens.', 'scenario', '0', '25', '5-9', 0, '2010-11-15 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(26, 'Lost at Bitter End', 'When a Pathfinder Society Priest of Nethys disappears in northern Geb while studying the Mana Wastes, the Society sends you to uncover her whereabouts and find her journals. Arriving in the town of Bitter End, you find it deserted but for a few mysterious creatures never before seen on Golarion. Those creatures quickly lead to more and soon you''re embroiled in a mystery that could effect the very fabric of reality. Will you solve the mystery of Bitter End or find yourself lost forever in the Mana Wastes?', 'scenario', '0', '26', '7-11', 0, NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(27, 'Our Lady of Silver', 'You and your fellow Pathfinders are sent to Katheer, the shining capital of Qadira, to witness the wedding of Pathfinder Faireven to the wealthy and beautiful Lady of Silver and bring back a trove of relics given to the Society as part of the wedding dowry. When the wedding is disrupted by unscrupulous thieves, you soon find yourself dodging double-crosses, accusations of grave robbery, and worse. You must find the relics soon, or risk facing the eternal expulsion of the Society from the treasure-filled deserts of Qadira.', 'scenario', '0', '27', '5-9', 0, NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(28, 'Lyrics of Extinction', 'The fabled ruined city of Dokeran, deep inside the heart of the Mwangi Expanse, has been found and it''s your job as a Pathfinder to explore it and discover how it fell. After fighting through fiends, enslaved warriors, and the damned spirits of Dokeran''s dead, you find that the ruined city has a dark secret—one you might not survive. ', 'scenario', '0', '28', '7-11', 0, NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL);

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
SET FOREIGN_KEY_CHECKS=1;
