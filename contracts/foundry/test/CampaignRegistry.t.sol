// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {CampaignRegistry} from "../src/CampaignRegistry.sol";

contract CampaignRegistryTest is Test {
    CampaignRegistry public registry;
    
    address public owner = address(this);
    address public platformBackend = address(0x1);
    address public creator = address(0x2);
    address public unauthorized = address(0x3);
    
    bytes32 public campaignHash = keccak256("test-campaign-1");
    
    event CampaignRegistered(
        bytes32 indexed campaignHash,
        address indexed creator,
        uint256 registeredAt
    );
    
    function setUp() public {
        registry = new CampaignRegistry(platformBackend);
    }
    
    function test_Constructor() public view {
        assertEq(registry.owner(), owner);
        assertEq(registry.platformBackend(), platformBackend);
        assertEq(registry.totalCampaigns(), 0);
    }
    
    function test_RegisterCampaign() public {
        vm.prank(platformBackend);
        
        vm.expectEmit(true, true, false, true);
        emit CampaignRegistered(campaignHash, creator, block.timestamp);
        
        registry.registerCampaign(campaignHash, creator);
        
        assertEq(registry.totalCampaigns(), 1);
        assertTrue(registry.campaignExists(campaignHash));
        assertEq(registry.getCampaignCreator(campaignHash), creator);
    }
    
    function test_RevertWhen_UnauthorizedRegister() public {
        vm.prank(unauthorized);
        vm.expectRevert(CampaignRegistry.Unauthorized.selector);
        registry.registerCampaign(campaignHash, creator);
    }
    
    function test_RevertWhen_DuplicateCampaign() public {
        vm.startPrank(platformBackend);
        registry.registerCampaign(campaignHash, creator);
        
        vm.expectRevert(CampaignRegistry.CampaignAlreadyExists.selector);
        registry.registerCampaign(campaignHash, creator);
        vm.stopPrank();
    }
    
    function test_RevertWhen_ZeroCreator() public {
        vm.prank(platformBackend);
        vm.expectRevert(CampaignRegistry.ZeroAddress.selector);
        registry.registerCampaign(campaignHash, address(0));
    }
    
    function test_RevertWhen_ZeroCampaignHash() public {
        vm.prank(platformBackend);
        vm.expectRevert(CampaignRegistry.InvalidCampaignHash.selector);
        registry.registerCampaign(bytes32(0), creator);
    }
    
    function test_GetCampaignDetails() public {
        vm.prank(platformBackend);
        registry.registerCampaign(campaignHash, creator);
        
        (address _creator, uint256 registeredAt, bool exists) = registry.getCampaignDetails(campaignHash);
        
        assertEq(_creator, creator);
        assertEq(registeredAt, block.timestamp);
        assertTrue(exists);
    }
    
    function test_GetCampaignsByCreator() public {
        bytes32 hash1 = keccak256("campaign-1");
        bytes32 hash2 = keccak256("campaign-2");
        
        vm.startPrank(platformBackend);
        registry.registerCampaign(hash1, creator);
        registry.registerCampaign(hash2, creator);
        vm.stopPrank();
        
        bytes32[] memory campaigns = registry.getCampaignsByCreator(creator);
        
        assertEq(campaigns.length, 2);
        assertEq(campaigns[0], hash1);
        assertEq(campaigns[1], hash2);
    }
    
    function test_SetPlatformBackend() public {
        address newBackend = address(0x4);
        
        registry.setPlatformBackend(newBackend);
        
        assertEq(registry.platformBackend(), newBackend);
    }
    
    function test_RevertWhen_UnauthorizedSetBackend() public {
        vm.prank(unauthorized);
        vm.expectRevert(CampaignRegistry.Unauthorized.selector);
        registry.setPlatformBackend(address(0x4));
    }
    
    function test_TransferOwnership() public {
        address newOwner = address(0x5);
        
        registry.transferOwnership(newOwner);
        
        assertEq(registry.owner(), newOwner);
    }
    
    function testFuzz_RegisterMultipleCampaigns(uint8 count) public {
        vm.assume(count > 0 && count < 100);
        
        vm.startPrank(platformBackend);
        for (uint8 i = 0; i < count; i++) {
            bytes32 hash = keccak256(abi.encodePacked("campaign-", i));
            registry.registerCampaign(hash, creator);
        }
        vm.stopPrank();
        
        assertEq(registry.totalCampaigns(), count);
        assertEq(registry.getCreatorCampaignCount(creator), count);
    }
}
