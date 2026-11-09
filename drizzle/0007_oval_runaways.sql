ALTER TABLE `guests` ADD `snapshot` text;
UPDATE guests SET snapshot = (SELECT data FROM weddings WHERE weddings.id = guests.wedding_id) WHERE snapshot IS NULL;
