// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {IntentProof} from "../src/IntentProof.sol";

contract IntentProofTest is Test {
    IntentProof public proof;
    
    address public owner = address(this);
    address public platformBackend = address(0x1);
    address public user = address(0x2);
    address public unauthorized = address(0x3);
    
    bytes32 public campaignHash = keccak256("test-campaign-1");
    
    event ProofRecorded(
        uint256 indexed proofId,
        address indexed user,
        bytes32 indexed campaignHash,
        uint256 timestamp
    );
    
    function setUp() public {
        proof = new IntentProof(platformBackend);
    }
    
    function test_Constructor() public view {
        assertEq(proof.owner(), owner);
        assertEq(proof.platformBackend(), platformBackend);
        assertEq(proof.totalProofs(), 0);
    }
    
    function test_RecordProof() public {
        vm.prank(platformBackend);
        
        vm.expectEmit(true, true, true, true);
        emit ProofRecorded(0, user, campaignHash, block.timestamp);
        
        uint256 proofId = proof.recordProof(user, campaignHash);
        
        assertEq(proofId, 0);
        assertEq(proof.totalProofs(), 1);
        assertTrue(proof.userHasProofForCampaign(user, campaignHash));
    }
    
    function test_RevertWhen_UnauthorizedRecord() public {
        vm.prank(unauthorized);
        vm.expectRevert(IntentProof.Unauthorized.selector);
        proof.recordProof(user, campaignHash);
    }
    
    function test_RevertWhen_DuplicateProof() public {
        vm.startPrank(platformBackend);
        proof.recordProof(user, campaignHash);
        
        vm.expectRevert(IntentProof.ProofAlreadyExists.selector);
        proof.recordProof(user, campaignHash);
        vm.stopPrank();
    }
    
    function test_RevertWhen_ZeroUser() public {
        vm.prank(platformBackend);
        vm.expectRevert(IntentProof.ZeroAddress.selector);
        proof.recordProof(address(0), campaignHash);
    }
    
    function test_RevertWhen_ZeroCampaignHash() public {
        vm.prank(platformBackend);
        vm.expectRevert(IntentProof.InvalidCampaignHash.selector);
        proof.recordProof(user, bytes32(0));
    }
    
    function test_GetProofDetails() public {
        vm.prank(platformBackend);
        uint256 proofId = proof.recordProof(user, campaignHash);
        
        (address _user, bytes32 _campaignHash, uint256 timestamp, bool exists) = proof.getProofDetails(proofId);
        
        assertEq(_user, user);
        assertEq(_campaignHash, campaignHash);
        assertEq(timestamp, block.timestamp);
        assertTrue(exists);
    }
    
    function test_GetProofs() public {
        bytes32 hash1 = keccak256("campaign-1");
        bytes32 hash2 = keccak256("campaign-2");
        
        vm.startPrank(platformBackend);
        proof.recordProof(user, hash1);
        proof.recordProof(user, hash2);
        vm.stopPrank();
        
        uint256[] memory proofIds = proof.getProofs(user);
        
        assertEq(proofIds.length, 2);
        assertEq(proofIds[0], 0);
        assertEq(proofIds[1], 1);
    }
    
    function test_GetProofCount() public {
        vm.startPrank(platformBackend);
        proof.recordProof(user, keccak256("campaign-1"));
        proof.recordProof(user, keccak256("campaign-2"));
        proof.recordProof(user, keccak256("campaign-3"));
        vm.stopPrank();
        
        assertEq(proof.getProofCount(user), 3);
    }
    
    function test_MultipleUsersMultipleCampaigns() public {
        address user2 = address(0x4);
        bytes32 hash1 = keccak256("campaign-1");
        bytes32 hash2 = keccak256("campaign-2");
        
        vm.startPrank(platformBackend);
        proof.recordProof(user, hash1);
        proof.recordProof(user, hash2);
        proof.recordProof(user2, hash1);
        vm.stopPrank();
        
        assertEq(proof.totalProofs(), 3);
        assertEq(proof.getProofCount(user), 2);
        assertEq(proof.getProofCount(user2), 1);
        assertTrue(proof.userHasProofForCampaign(user, hash1));
        assertTrue(proof.userHasProofForCampaign(user, hash2));
        assertTrue(proof.userHasProofForCampaign(user2, hash1));
        assertFalse(proof.userHasProofForCampaign(user2, hash2));
    }
    
    function test_SetPlatformBackend() public {
        address newBackend = address(0x5);
        
        proof.setPlatformBackend(newBackend);
        
        assertEq(proof.platformBackend(), newBackend);
    }
    
    function test_TransferOwnership() public {
        address newOwner = address(0x6);
        
        proof.transferOwnership(newOwner);
        
        assertEq(proof.owner(), newOwner);
    }
    
    function testFuzz_RecordMultipleProofs(uint8 count) public {
        vm.assume(count > 0 && count < 100);
        
        vm.startPrank(platformBackend);
        for (uint8 i = 0; i < count; i++) {
            bytes32 hash = keccak256(abi.encodePacked("campaign-", i));
            proof.recordProof(user, hash);
        }
        vm.stopPrank();
        
        assertEq(proof.totalProofs(), count);
        assertEq(proof.getProofCount(user), count);
    }
}
