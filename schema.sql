-- Criart.ia - MySQL Schema
-- Import this file once via phpMyAdmin > Import tab

SET FOREIGN_KEY_CHECKS=0;
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `User` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `emailVerified` DATETIME(3) NULL,
  `name` VARCHAR(191) NULL,
  `username` VARCHAR(191) NULL,
  `avatar` TEXT NULL,
  `passwordHash` VARCHAR(191) NULL,
  `role` ENUM('USER','ADMIN','SUPER_ADMIN') NOT NULL DEFAULT 'USER',
  `locale` VARCHAR(191) NOT NULL DEFAULT 'pt-BR',
  `timezone` VARCHAR(191) NOT NULL DEFAULT 'America/Sao_Paulo',
  `onboardingDone` TINYINT(1) NOT NULL DEFAULT 0,
  `onboardingProfile` VARCHAR(191) NULL,
  `credits` INT NOT NULL DEFAULT 10,
  `totalCreditsUsed` INT NOT NULL DEFAULT 0,
  `totalCreditsEarned` INT NOT NULL DEFAULT 10,
  `stripeCustomerId` VARCHAR(191) NULL,
  `referralCode` VARCHAR(191) NULL,
  `referredBy` VARCHAR(191) NULL,
  `googleId` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `lastActiveAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `User_email_key`(`email`),
  UNIQUE INDEX `User_username_key`(`username`),
  UNIQUE INDEX `User_stripeCustomerId_key`(`stripeCustomerId`),
  UNIQUE INDEX `User_referralCode_key`(`referralCode`),
  UNIQUE INDEX `User_googleId_key`(`googleId`),
  INDEX `User_email_idx`(`email`),
  INDEX `User_stripeCustomerId_idx`(`stripeCustomerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Brand` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `logo` TEXT NULL,
  `colors` JSON NOT NULL,
  `fonts` JSON NOT NULL,
  `description` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Brand_userId_idx`(`userId`),
  CONSTRAINT `Brand_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Subscription` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `plan` ENUM('FREE','STARTER','PRO','BUSINESS','ENTERPRISE') NOT NULL DEFAULT 'FREE',
  `status` ENUM('ACTIVE','CANCELED','PAST_DUE','TRIALING','INCOMPLETE') NOT NULL DEFAULT 'ACTIVE',
  `stripeSubscriptionId` VARCHAR(191) NULL,
  `stripePriceId` VARCHAR(191) NULL,
  `stripeCurrentPeriodEnd` DATETIME(3) NULL,
  `stripeCurrentPeriodStart` DATETIME(3) NULL,
  `cancelAtPeriodEnd` TINYINT(1) NOT NULL DEFAULT 0,
  `monthlyCredits` INT NOT NULL DEFAULT 10,
  `trialEndsAt` DATETIME(3) NULL,
  `currentPeriodStart` DATETIME(3) NULL,
  `currentPeriodEnd` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Subscription_userId_key`(`userId`),
  UNIQUE INDEX `Subscription_stripeSubscriptionId_key`(`stripeSubscriptionId`),
  INDEX `Subscription_userId_idx`(`userId`),
  CONSTRAINT `Subscription_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Project` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `thumbnail` TEXT NULL,
  `status` ENUM('ACTIVE','ARCHIVED','DELETED') NOT NULL DEFAULT 'ACTIVE',
  `brandId` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Project_userId_idx`(`userId`),
  INDEX `Project_status_idx`(`status`),
  CONSTRAINT `Project_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Project_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `Brand`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Generation` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `projectId` VARCHAR(191) NULL,
  `type` ENUM('OUTFIT_SWAP','AVATAR_CREATION','BACKGROUND_SWAP','PRODUCT_PHOTO','CAMPAIGN','UPSCALE','REMOVE_BG','VIRTUAL_TRYON','POSE_CHANGE','MOCKUP','VIDEO','CATALOG','SOCIAL_PACK') NOT NULL,
  `status` ENUM('PENDING','PROCESSING','COMPLETED','FAILED') NOT NULL DEFAULT 'PENDING',
  `prompt` TEXT NULL,
  `negativePrompt` TEXT NULL,
  `settings` JSON NOT NULL,
  `inputImages` JSON NOT NULL,
  `outputImages` JSON NOT NULL,
  `outputVideo` TEXT NULL,
  `creditsUsed` INT NOT NULL DEFAULT 1,
  `errorMessage` TEXT NULL,
  `processingTime` INT NULL,
  `modelUsed` VARCHAR(191) NULL,
  `jobId` VARCHAR(191) NULL,
  `seed` INT NULL,
  `width` INT NULL,
  `height` INT NULL,
  `steps` INT NULL,
  `cfgScale` DOUBLE NULL,
  `isFavorited` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `completedAt` DATETIME(3) NULL,
  PRIMARY KEY (`id`),
  INDEX `Generation_userId_idx`(`userId`),
  INDEX `Generation_projectId_idx`(`projectId`),
  INDEX `Generation_type_idx`(`type`),
  INDEX `Generation_status_idx`(`status`),
  INDEX `Generation_createdAt_idx`(`createdAt`),
  CONSTRAINT `Generation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Generation_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `CreditTransaction` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `type` ENUM('PURCHASE','CONSUMPTION','REFUND','BONUS','SUBSCRIPTION_RENEWAL') NOT NULL,
  `amount` INT NOT NULL,
  `balance` INT NOT NULL,
  `description` VARCHAR(191) NULL,
  `metadata` JSON NULL,
  `generationId` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `CreditTransaction_userId_idx`(`userId`),
  INDEX `CreditTransaction_generationId_idx`(`generationId`),
  CONSTRAINT `CreditTransaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CreditTransaction_generationId_fkey` FOREIGN KEY (`generationId`) REFERENCES `Generation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Asset` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `projectId` VARCHAR(191) NULL,
  `generationId` VARCHAR(191) NULL,
  `type` ENUM('IMAGE','VIDEO','MASK','REFERENCE') NOT NULL,
  `url` TEXT NOT NULL,
  `key` TEXT NOT NULL,
  `filename` VARCHAR(191) NOT NULL,
  `mimeType` VARCHAR(191) NOT NULL,
  `size` INT NOT NULL,
  `width` INT NULL,
  `height` INT NULL,
  `isFavorited` TINYINT(1) NOT NULL DEFAULT 0,
  `metadata` JSON NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Asset_userId_idx`(`userId`),
  INDEX `Asset_projectId_idx`(`projectId`),
  INDEX `Asset_generationId_idx`(`generationId`),
  CONSTRAINT `Asset_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Asset_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Asset_generationId_fkey` FOREIGN KEY (`generationId`) REFERENCES `Generation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Template` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `thumbnail` TEXT NOT NULL,
  `category` VARCHAR(191) NOT NULL,
  `tags` JSON NOT NULL,
  `prompt` TEXT NOT NULL,
  `negativePrompt` TEXT NULL,
  `settings` JSON NOT NULL,
  `type` ENUM('OUTFIT_SWAP','AVATAR_CREATION','BACKGROUND_SWAP','PRODUCT_PHOTO','CAMPAIGN','UPSCALE','REMOVE_BG','VIRTUAL_TRYON','POSE_CHANGE','MOCKUP','VIDEO','CATALOG','SOCIAL_PACK') NOT NULL,
  `format` VARCHAR(191) NOT NULL DEFAULT 'square',
  `isPremium` TINYINT(1) NOT NULL DEFAULT 0,
  `isPublic` TINYINT(1) NOT NULL DEFAULT 1,
  `usageCount` INT NOT NULL DEFAULT 0,
  `createdById` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Template_category_idx`(`category`),
  INDEX `Template_type_idx`(`type`),
  INDEX `Template_isPublic_idx`(`isPublic`),
  CONSTRAINT `Template_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ApiKey` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `keyHash` VARCHAR(191) NOT NULL,
  `prefix` VARCHAR(191) NOT NULL,
  `lastUsedAt` DATETIME(3) NULL,
  `expiresAt` DATETIME(3) NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `permissions` JSON NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `ApiKey_keyHash_key`(`keyHash`),
  INDEX `ApiKey_userId_idx`(`userId`),
  INDEX `ApiKey_keyHash_idx`(`keyHash`),
  CONSTRAINT `ApiKey_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Notification` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `message` TEXT NOT NULL,
  `data` JSON NULL,
  `isRead` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Notification_userId_idx`(`userId`),
  INDEX `Notification_isRead_idx`(`isRead`),
  CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS=1;
