-- SQL Script to create Account table for ShopAcc Khiem Tran
-- Run this on your SQL Server database

CREATE TABLE [dbo].[Account] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [AccountCode] NVARCHAR(100) NOT NULL,
    [GameType] NVARCHAR(50) NOT NULL,
    [Rank] NVARCHAR(100) NOT NULL,
    [Price] DECIMAL(18, 2) NOT NULL,
    [SellerId] UNIQUEIDENTIFIER NOT NULL,
    [Description] NVARCHAR(500) NULL,
    [Status] NVARCHAR(50) NULL,
    [IsPublished] BIT NOT NULL DEFAULT 0,
    [ImageUrl] NVARCHAR(500) NULL,
    [Images] NVARCHAR(1000) NULL,
    [Rating] INT NOT NULL DEFAULT 5,
    [SoldCount] INT NOT NULL DEFAULT 0,
    [CreatedDate] DATETIME2 NULL,
    [CreatedId] UNIQUEIDENTIFIER NULL,
    [CreatedBy] NVARCHAR(MAX) NULL,
    [UpdatedDate] DATETIME2 NULL,
    [UpdatedId] UNIQUEIDENTIFIER NULL,
    [UpdatedBy] NVARCHAR(MAX) NULL,
    [IsDeleted] BIT NOT NULL DEFAULT 0
);

-- Create index on GameType and IsPublished for fast lookups
CREATE INDEX [IX_Account_GameType_IsPublished] 
ON [dbo].[Account] ([GameType], [IsPublished]) 
WHERE [IsDeleted] = 0;

-- Insert sample data (replace SellerId with an actual AppUser ID from your database)
INSERT INTO [dbo].[Account] ([AccountCode], [GameType], [Rank], [Price], [SellerId], [Status], [IsPublished], [Description], [CreatedDate], [CreatedBy])
VALUES 
    (N'#2332', N'Valorant', N'Bạc II', 4040000, '11111111-1111-1111-1111-111111111111', N'Available', 1, N'Tài khoản Valorant Bạc II - đã test kỹ lưỡng', GETDATE(), N'admin'),
    (N'#2333', N'Valorant', N'Vàng III', 4040000, '11111111-1111-1111-1111-111111111111', N'Available', 1, N'Tài khoản Valorant Vàng III', GETDATE(), N'admin'),
    (N'#2334', N'Valorant', N'Bạc II', 4040000, '11111111-1111-1111-1111-111111111111', N'Available', 1, N'Tài khoản Valorant Bạc II', GETDATE(), N'admin'),
    (N'#2335', N'Valorant', N'Vàng III', 4040000, '11111111-1111-1111-1111-111111111111', N'Available', 1, N'Tài khoản Valorant Vàng III', GETDATE(), N'admin'),
    (N'#2336', N'Valorant', N'Bạc II', 4040000, '11111111-1111-1111-1111-111111111111', N'Available', 1, N'Tài khoản Valorant Bạc II', GETDATE(), N'admin'),
    (N'#2337', N'Valorant', N'Vàng III', 4040000, '11111111-1111-1111-1111-111111111111', N'Available', 1, N'Tài khoản Valorant Vàng III', GETDATE(), N'admin'),
    (N'#2338', N'Valorant', N'Bạc II', 4040000, '11111111-1111-1111-1111-111111111111', N'Available', 1, N'Tài khoản Valorant Bạc II', GETDATE(), N'admin'),
    (N'#2339', N'Valorant', N'Vàng III', 4040000, '11111111-1111-1111-1111-111111111111', N'Available', 1, N'Tài khoản Valorant Vàng III', GETDATE(), N'admin'),
    (N'#3000', N'DeltaForce', N'Rank S', 5000000, '11111111-1111-1111-1111-111111111111', N'Available', 1, N'Tài khoản Delta Force Rank S', GETDATE(), N'admin'),
    (N'#3001', N'DeltaForce', N'Rank A', 3500000, '11111111-1111-1111-1111-111111111111', N'Available', 1, N'Tài khoản Delta Force Rank A', GETDATE(), N'admin');
