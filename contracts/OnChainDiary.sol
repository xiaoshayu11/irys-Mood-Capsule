// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title On-chain Diary with NFT
/// @notice Each address can write multiple diary entries per calendar day (up to 5 times) and mint as NFT.
contract OnChainDiary is ERC721, Ownable {
    // address => date (days since Unix epoch) => content array
    mapping(address => mapping(uint256 => string[])) private diary;
    
    // address => date (days since Unix epoch) => image IPFS hash array
    mapping(address => mapping(uint256 => string[])) private diaryImages;
    
    // address => date (days since Unix epoch) => submission count
    mapping(address => mapping(uint256 => uint256)) private dailySubmissionCount;
    
    // NFT token ID => diary data
    mapping(uint256 => DiaryData) public diaryNFTs;
    
    // Counter for token IDs
    uint256 private _tokenIdCounter;

    // Max length for content in bytes (reduced to 20 characters)
    uint256 public constant MAX_LENGTH = 20;
    
    // Max submissions per day for regular users
    uint256 public constant MAX_DAILY_SUBMISSIONS = 5;
    

    struct DiaryData {
        address author;
        uint256 date;
        string content;
        string imageHash;
        uint256 timestamp;
    }

    event DiaryWritten(address indexed user, uint256 indexed date, string content, string imageHash, uint256 submissionIndex);
    event DiaryMintedAsNFT(address indexed user, uint256 indexed tokenId, uint256 date);

    constructor() ERC721("IRYS Diary", "IRYSD") Ownable(msg.sender) {
    }

    /// @notice Write today's diary entry with optional image. Up to 5 times per day.
    /// @param _content The diary content (<= 20 bytes)
    /// @param _imageHash IPFS hash of the image (can be empty)
    function writeDiary(string memory _content, string memory _imageHash) external {
        require(bytes(_content).length > 0, "Empty content");
        require(bytes(_content).length <= MAX_LENGTH, "Content too long");

        uint256 today = block.timestamp / 1 days;
        
        // Check daily limit
        require(dailySubmissionCount[msg.sender][today] < MAX_DAILY_SUBMISSIONS, "Daily limit reached");

        // Add to arrays
        diary[msg.sender][today].push(_content);
        diaryImages[msg.sender][today].push(_imageHash);
        dailySubmissionCount[msg.sender][today]++;
        
        uint256 submissionIndex = dailySubmissionCount[msg.sender][today] - 1;
        emit DiaryWritten(msg.sender, today, _content, _imageHash, submissionIndex);
    }

    /// @notice Mint today's diary as NFT (mints the latest entry)
    function mintDiaryAsNFT() external {
        uint256 today = block.timestamp / 1 days;
        require(diary[msg.sender][today].length > 0, "No diary written today");
        
        uint256 tokenId = _tokenIdCounter++;
        uint256 latestIndex = diary[msg.sender][today].length - 1;
        
        diaryNFTs[tokenId] = DiaryData({
            author: msg.sender,
            date: today,
            content: diary[msg.sender][today][latestIndex],
            imageHash: diaryImages[msg.sender][today][latestIndex],
            timestamp: block.timestamp
        });
        
        _safeMint(msg.sender, tokenId);
        emit DiaryMintedAsNFT(msg.sender, tokenId, today);
    }

    /// @notice Get all diary entries for a user at a specific date
    function getDiary(address _user, uint256 _date) external view returns (string[] memory) {
        return diary[_user][_date];
    }

    /// @notice Get all image hashes for a user at a specific date
    function getDiaryImage(address _user, uint256 _date) external view returns (string[] memory) {
        return diaryImages[_user][_date];
    }

    /// @notice Get a specific diary entry by index
    function getDiaryEntry(address _user, uint256 _date, uint256 _index) external view returns (string memory) {
        require(_index < diary[_user][_date].length, "Index out of bounds");
        return diary[_user][_date][_index];
    }

    /// @notice Get submission count for a user on a specific date
    function getDailySubmissionCount(address _user, uint256 _date) external view returns (uint256) {
        return dailySubmissionCount[_user][_date];
    }

    /// @notice Get diary data for an NFT
    function getDiaryNFT(uint256 _tokenId) external view returns (DiaryData memory) {
        require(_tokenId < _tokenIdCounter, "Token does not exist");
        return diaryNFTs[_tokenId];
    }

    /// @notice Convenience: get caller's diary for a date
    function getMyDiary(uint256 _date) external view returns (string[] memory) {
        return diary[msg.sender][_date];
    }

    /// @notice Get total number of NFTs minted
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }

}



